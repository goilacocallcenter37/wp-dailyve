<?php

/**
 * Template Name: Page Resuilt Payment
 */

get_header();

$journey_group_id = sanitize_text_field(wp_unslash($_GET['code']));

if (empty($journey_group_id)) {
    wp_redirect(home_url(), 301);
    exit;
}

$existing_post = get_posts([
    'post_type'      => 'book-ticket',
    'post_status'    => 'publish',
    'posts_per_page' => 2,
    'meta_query'     => [
        [
            'key'     => 'journey_group_id',
            'value'   => $journey_group_id,
            'compare' => '=',
        ]
    ],
]);

$codeArr = [];

if (!empty($existing_post) && is_array($existing_post)) {
    usort($existing_post, function ($a, $b) {
        $ia_raw = get_post_meta($a->ID, 'journey_ticket_index', true);
        $ib_raw = get_post_meta($b->ID, 'journey_ticket_index', true);
        $ia = is_numeric($ia_raw) ? (int)$ia_raw : 9999;
        $ib = is_numeric($ib_raw) ? (int)$ib_raw : 9999;
        if ($ia === $ib) {
            return $a->ID <=> $b->ID;
        }
        return $ia <=> $ib;
    });
}

if (!empty($existing_post)) {
    $post_id = $existing_post[0]->ID;
    $post_title = $existing_post[0]->post_title;

    // total price: sum across group
    $totalPrice = 0;
    foreach ($existing_post as $p) {
        $totalPrice += (float)(get_post_meta($p->ID, 'total_price', true) ?? 0);
    }

    $paymentStatus = (int)(get_post_meta($post_id, 'payment_status', true) ?: (function_exists('get_field') ? (get_field('payment_status', $post_id) ?? 0) : 0));

    // ===== Fetch payment status from database across posts in the group =====
    $paymentStatus = 1;
    if (!empty($existing_post)) {
        $statuses = [];
        foreach ($existing_post as $p) {
            $s = (int)get_post_meta($p->ID, 'payment_status', true);
            if ($s > 0) {
                $statuses[] = $s;
            }
        }
        if (!empty($statuses)) {
            if (in_array(3, $statuses)) {
                $paymentStatus = 3; // Canceled
            } elseif (in_array(2, $statuses)) {
                $paymentStatus = 2; // Paid
            } else {
                $paymentStatus = 1; // Pending
            }
        }
    }

    $paymentContent = (string)(get_post_meta($post_id, 'payment_content', true) ?? '');
    $paymentMethod  = (string)(get_post_meta($post_id, 'payment_method', true) ?? '');
    $phone          = (string)(get_post_meta($post_id, 'phone', true) ?? '');

    $payment_key = !empty(get_post_meta($post_id, 'journey_group_id', true)) ? (string)get_post_meta($post_id, 'journey_group_id', true) : $post_title;

    // Calculate remaining time for countdown (10 minutes = 600 seconds)
    $post_date_gmt = get_post_time('U', true, $post_id);
    $current_time_gmt = time();
    $expiry_duration = 600; // 10 minutes
    $remaining_seconds = max(0, ($post_date_gmt + $expiry_duration) - $current_time_gmt);

    // Build display tickets from posts (already sorted)
    $displayTickets = [];
    foreach ($existing_post as $p) {
        $pid = $p->ID;

        $seatStr = (string)(get_post_meta($pid, 'seat', true) ?? '');
        $seatArr = array_values(array_filter(array_map('trim', explode(',', $seatStr))));

        $displayTickets[] = [
            'post_id'     => $pid,
            'index'       => (int)get_post_meta($pid, 'journey_ticket_index', true),
            'from'        => (string)get_post_meta($pid, 'pickup_name', true),
            'to'          => (string)get_post_meta($pid, 'dropoff_name', true),
            'fromAddress'        => (string)get_post_meta($pid, 'pickup_address', true),
            'toAddress'          => (string)get_post_meta($pid, 'dropoff_address', true),
            'partner_id'         => (string)get_post_meta($pid, 'partner_id', true),
            'company'     => (string)get_post_meta($pid, 'company_bus', true),
            'vehicle'     => (string)get_post_meta($pid, 'vehicle_name', true),
            'pickupDate'  => (string)get_post_meta($pid, 'pickup_date', true),
            'arrivalDate' => (string)get_post_meta($pid, 'arrival_date', true),
            'seatArr'     => $seatArr,
            'seatStr'     => $seatStr,
            'customer'    => [
                'name'  => (string)get_post_meta($pid, 'full_name', true),
                'phone' => (string)get_post_meta($pid, 'phone', true),
                'email' => (string)get_post_meta($pid, 'email', true),
            ],
        ];
    }

?>

    <style>
        #main {
            background-color: #f2f2f2;
        }
    </style>

    <?php if ($paymentStatus == 1) { ?>
        <div class="box_time_expired">
            <div class="color--white">
                <p>Nếu giao dịch không thành công, vé sẽ hủy sau <strong id="time-expired"></strong></p>
            </div>
        </div>
    <?php } ?>

    <div class="container box-wrapper-info" id="form-payment-pay">
        <div class="payment_content" style="flex-wrap: wrap; flex-direction: row;">
            <?php if ($paymentStatus == 1) { ?>
                <div class="bg-blue-success payment-result-header w-left">
                    <img class="confetti-background" src="/wp-content/uploads/assets/images/confetti_desktop.png" alt="default-alt">
                    <div class="header-status">
                        <div class="" width="72" height="72">
                            <i class="fas fa-check-circle" style="color: #ffffff; font-size: 56px;"></i>
                        </div>
                        <p class="booking-status color--white">Đặt chỗ thành công</p>
                        <div class="notification color--white" style="display: none;">
                            <p>Thông tin chuyến đi đã được gửi đến <strong><?= $phone; ?></strong>, bạn hãy kiểm tra nhé!</p>
                        </div>
                    </div>
                </div>
            <?php } ?>
            <?php if ($paymentStatus == 1) { ?>
                <div class="payment_body_container w-right" style="padding: 20px;">
                    <div class="ticket_info_body">
                        <div class="title-info-ticket">Thông tin thanh toán</div>
                        <div class="content_info_customer_ticket">
                            <div>
                                <p class="text__base" style="font-weight: 400;">Trạng thái</p>
                                <p class="text__base text-danger" id="check-status-tr">Đang kiểm tra</p>
                            </div>
                            <div>
                                <p class="text__base" style="font-weight: 400;">Phương thức thanh toán</p>
                                <p class="text__base"><?= $paymentMethod; ?></p>
                            </div>
                            <div>
                                <p class="text__base" style="font-weight: 400;">Tổng tiền</p>
                                <p class="text__base" style="font-weight: bold;" id="total-price"><?= number_format($totalPrice, 0, ",", "."); ?>đ</p>
                            </div>
                            <div>
                                <p class="text__base" style="font-weight: 400;">Họ & tên</p>
                                <p class="text__base" id="customer-email"><?= $displayTickets[0]['customer']['email']; ?></p>
                            </div>
                            <div>
                                <p class="text__base" style="font-weight: 400;">Số điện thoại</p>
                                <p class="text__base" id="customer-phone"><?= $displayTickets[0]['customer']['phone']; ?></p>
                            </div>
                        </div>

                        <div class="trust-message-container trust noti-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p class="trust-message-content" style="font-size: 13px;">Nếu giao dịch chưa được xác minh trong vòng <strong>5 phút</strong> sau khi chuyển khoản, vui lòng liên hệ <a href="tel:19000155" title="19000155" style="color: #000;"><strong>1900 0155</strong></a> để được xử lí kịp thời.</p>
                        </div>
                    </div>
                </div>
            <?php } ?>
            <?php if ($paymentStatus == 1) { ?>
                <div class="payment_body_container w-left" style="padding: 0;">
                    <div class="payment_method_group">
                        <div class="payment_method_detail" style="padding: 0;">
                            <div class="payment_method_detail_content_container" style="display: block; margin-left: 0; padding-top: 0;">
                                <div class="transfer_va_box">
                                    <div class="content_detail">
                                        <div class="content_detail_right">
                                            <p class="info_text_pm">Chuyển khoản bằng mã QR, tự động điền thông tin</p>
                                            <div class="content_detail_guideline_step">
                                                <div>
                                                    <img src="/wp-content/uploads/assets/images/viet_qr_guideline_step_1.svg" alt="icon step 1" width="24" height="24">
                                                    <p class="step_title">Mở ứng dụng ngân hàng hoặc ví điện tử</p>
                                                </div>
                                                <div>
                                                    <img src="/wp-content/uploads/assets/images/viet_qr_guideline_step_2.svg" alt="icon step 2" width="24" height="24">
                                                    <p class="step_title">Dùng tính năng Mã QR quét hình bên</p>
                                                </div>
                                                <div>
                                                    <img src="/wp-content/uploads/assets/images/viet_qr_guideline_step_3.svg" alt="icon step 3" width="24" height="24">
                                                    <p class="step_title">Hoàn tất thanh toán, chờ Dailyve xác nhận</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="content_detail_left">
                                            <p class="step_title" style="margin-bottom: 10px;">Quét mã bên dưới</p>
                                            <div class="content_detail_qr">
                                                <img src="https://img.vietqr.io/image/MB-VQRQAAVUO1996-qr_only.png?amount=<?= $totalPrice; ?>&addInfo=<?= $paymentContent; ?>" alt="QR code">
                                            </div>

                                            <div>
                                                <img src="/wp-content/uploads/assets/images/vietqr_napas.png" alt="vietqr icon" width="100">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="transfer_va__vietqr_transfer_info_container">
                                        <div class="content_detail_transfer_info">
                                            <div>
                                                <p class="info_text_pm">Không thể thanh toán bằng mã QR?</p>
                                                <p style="font-size: 14px; font-weight: 700; line-height: 20px; letter-spacing: 0px; margin-bottom: 0px; color: #2474e5; text-align: right;">Tự nhập thông tin</p>
                                            </div>
                                            <div>
                                                <p class="title_text_pm">Ngân hàng</p>
                                                <p class="info_text_pm">MBBank</p>
                                            </div>
                                            <div>
                                                <p class="title_text_pm">Số tài khoản</p>
                                                <div class="content_detail_transfer_info_copy">
                                                    <p class="info_text_pm">VQRQAAVUO1996</p>
                                                    <div style="cursor: pointer;" onclick="coppyText('VQRQAAVUO1996');">
                                                        <img src="/wp-content/uploads/assets/images/copy-clipboard-blue.svg" alt="icon coppy" width="20" height="20">
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <p class="title_text_pm">Chủ tài khoản</p>
                                                <p class="info_text_pm">DAILYVE CO. LTD</p>
                                            </div>

                                            <div>
                                                <p class="title_text_pm">Tổng tiền</p>
                                                <div class="content_detail_transfer_info_copy">
                                                    <p class="info_text_pm"><?= number_format($totalPrice, 0, ",", "."); ?>đ</p>
                                                    <div style="cursor: pointer;" onclick="coppyText('<?= $totalPrice; ?>');">
                                                        <img src="/wp-content/uploads/assets/images/copy-clipboard-blue.svg" alt="icon coppy" width="20" height="20">
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <p class="title_text_pm">Nội dung</p>
                                                <div class="content_detail_transfer_info_copy">
                                                    <p class="info_text_pm"><?= $paymentContent; ?></p>
                                                    <div style="cursor: pointer;" onclick="coppyText('<?= $paymentContent; ?>');">
                                                        <img src="/wp-content/uploads/assets/images/copy-clipboard-blue.svg" alt="icon coppy" width="20" height="20">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            <?php } elseif ($paymentStatus == 2) { ?>
                <div class="w-left">
                    <div class="box_success_notify">
                        <div class="">
                            <div class="message-box _success">
                                <i class="fa fa-check-circle" aria-hidden="true"></i>
                                <h2> Vé đã được thanh toán </h2>
                                <p> Cảm ơn quý khách đã thanh toán. Dailyve
                                    cam kết giữ đúng chỗ quý khách đã chọn. </p> <br>
                                <a href="/" title="Mua vé khác">Mua vé khác</a>
                            </div>
                        </div>
                    </div>
                </div>
            <?php  } else { ?>
                <div class="w-left">
                    <div class="box_success_notify">
                        <div class="">
                            <div class="message-box _success _failed">
                                <i class="fa fa-times-circle" aria-hidden="true"></i>
                                <h2> Vé đã bị hủy </h2>
                                <p> Xin quý khách vui lòng <a href="/" title="Đặt lại vé khác">đặt lại vé khác</a> hoặc liên hệ hotline <a href="tel:19000155">1900 0155</a>. Dailyve chân thành cảm ơn. </p>
                            </div>
                        </div>
                    </div>
                </div>
            <?php  } ?>
            <div class="payment_body_container w-right" style="padding: 20px;">
                <div class="section-info-ticket">
                    <div class="title-info-ticket">Thông tin chuyến đi</div>
                    <div class="content-info-ticket">
                        <?php foreach ($displayTickets as $key => $item) { ?>
                            <div class="box-review-info-ticket-round-trip__container" style="margin-bottom: <?= count($displayTickets) === 2 && $key === 0 ? '16px' : '0px'; ?>;">
                                <div class="section-ticket-header">
                                    <div class="section-ticket-header-left">
                                        <img src="/wp-content/uploads/assets/images/bus_blue_24dp.svg" alt="bus icon" width="16" height="16">
                                        <?php if (count($displayTickets) === 2) { ?>
                                            <span class="toast-text-route"><?= $key === 0 ? 'CHIỀU ĐI' : 'CHIỀU VỀ'; ?></span>
                                        <?php } ?>
                                        <?php if ($item['partner_id'] == 'vexere') { ?>
                                            <p class="base_text date-ticket-info"><?= esc_html(convertStringToDateName($item['pickupDate'])); ?></p>
                                        <?php } ?>
                                        <div class="total-ticket">
                                            <img src="/wp-content/uploads/assets/images/people_alt_black_24dp.svg" alt="total icon" width="16" height="16">
                                            <p class="base_text_1"><?= count($item['seatArr']) ?>
                                                (<?= esc_html(join(",", $item['seatArr'])); ?>)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div class="section-ticket-content">
                                    <div class="section-ticket-company-info">
                                        <div>
                                            <img src="https://static.vexere.com/production/images/1584418537685.jpeg" alt="Avatar">
                                        </div>
                                        <div class="section-ticket-company-info-name">
                                            <p class="base_text"><?= esc_html($item['company']); ?></p>
                                            <p class="base_text_1"><?= esc_html($item['vehicle']); ?></p>
                                        </div>
                                    </div>
                                    <div class="box-ticket-route-detail-container">
                                        <div class="section-route-info">
                                            <div class="area-point-detail-round-trip__container">
                                                <div class="date-time-container">
                                                    <div class="date-time-container-pick-up time-pick-up">
                                                        <div class="base__Headline01"><?= esc_html(convertStringToTimeN($item['pickupDate'])); ?></div>
                                                    </div>
                                                </div>

                                                <div class="icon-container">
                                                    <div class="icon-container-top">
                                                        <img class="pickup-icon" src="/wp-content/uploads/assets/images/pickup_vv_blue_24dp.svg" alt="pickup-icon" width="12" height="12">
                                                    </div>

                                                    <div class="icon-container-divider">
                                                        <div class="icon-container-divider-border-right"></div>
                                                        <div class="icon-container-divider-border-left"></div>
                                                    </div>
                                                </div>

                                                <div class="section-area">
                                                    <div class="section-area-picker pickup-point-name">
                                                        <p class="base_text mb-5"><?= esc_html($item['from']); ?></p>
                                                        <?php if (!empty($item['pickup_name'])) { ?>
                                                            <p class="base_text_2"><?= esc_html($item['pickup_name']); ?></p>
                                                        <?php } ?>
                                                        <?php if (!empty($item['fromAddress'])) { ?>
                                                            <p class="base_text_2"><?= esc_html($item['fromAddress']); ?></p>
                                                        <?php } ?>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="area-point-detail-round-trip__container">
                                                <div class="date-time-container">
                                                    <div class="date-time-container-pick-up time-drop-off mb-0">
                                                        <div class="base__Headline01"><?= esc_html(convertStringToTimeN($item['arrivalDate'])); ?></div>
                                                    </div>
                                                </div>
                                                <div class="icon-container">
                                                    <div class="icon-container-divider">
                                                        <div class="icon-container-divider-border-right"></div>
                                                        <div class="icon-container-divider-border-left"></div>
                                                    </div>
                                                    <div class="icon-container-bottom">
                                                        <img class="pickup-icon" src="/wp-content/uploads/assets/images/dropoff_semantic_negative_12dp.svg" alt="dropoff-icon" width="12" height="12">
                                                    </div>
                                                </div>

                                                <div class="section-area">
                                                    <div class="section-area-picker dropoff-point-name">
                                                        <p class="base_text mb-5"><?= esc_html($item['to']); ?></p>
                                                        <?php if (!empty($item['dropoff_name'])) { ?>
                                                            <p class="base_text_2"><?= esc_html($item['dropoff_name']); ?></p>
                                                        <?php } ?>
                                                        <?php if (!empty($item['toAddress'])) { ?>
                                                            <p class="base_text_2"><?= esc_html($item['toAddress']); ?></p>
                                                        <?php } ?>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <?php } ?>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <?php if ($paymentStatus == 1) { ?>
        <script>
            jQuery(document).ready(function($) {
                var stopInterval = false;
                var paymentKey = '<?php echo esc_js($payment_key); ?>';
                var remaining_seconds = <?php echo (int)$remaining_seconds; ?>;
                var expireAt = Date.now() + remaining_seconds * 1000;

                var timer = setInterval(function() {
                    var remaining = Math.floor((expireAt - Date.now()) / 1000);
                    // Đảm bảo thời gian hiển thị không bị âm
                    var displayRemaining = remaining < 0 ? 0 : remaining;
                    var minutes = Math.floor(displayRemaining / 60);
                    var seconds = displayRemaining % 60;
                    if (minutes < 10) minutes = '0' + minutes;
                    if (seconds < 10) seconds = '0' + seconds;
                    $('#time-expired').text(minutes + ':' + seconds);

                    if (remaining < 0) {
                        clearInterval(timer);
                        stopInterval = true;
                        $('#time-expired').text('00:00');

                        $.ajax({
                            url: "<?php echo admin_url('admin-ajax.php'); ?>",
                            type: 'POST',
                            data: {
                                action: 'delete_ticket',
                                nonce: '<?php echo wp_create_nonce('ams_vexe_delete_ticket'); ?>',
                                // legacy param name kept as "code" but we pass journey_group_id/payment key
                                code: '<?php echo esc_js($payment_key); ?>',
                                journey_group_id: '<?php echo esc_js($journey_group_id); ?>'
                            },
                            success: function(response) {
                                if (response.success) {
                                    // if (response?.data?.status) {
                                    $('#check-status-tr').text('Chưa thanh toán');
                                    $('.booking-status').text('Vé đã bị hủy');
                                    $('.bg-blue-success').css('background-color', '#eb5757');
                                    $('.header-status i').removeClass('fa-check-circle').addClass('fa-times-circle')

                                    Swal.fire({
                                        title: `<div class="title-modal-sw2">Thời hạn thanh toán vé đã hết</div>`,
                                        html: `<div class="content-modal-sw2">
                                    <div class="content-sw2">
                                        <div class="payment_content">
                                            <div class="cop_text">
                                                <p>Xin quý khách vui lòng đặt lại vé khác. Dailyve chân thành cảm ơn.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>`,
                                        customClass: 'swal2-payment-offline',
                                        showCancelButton: false,
                                        confirmButtonColor: '#0d2e59',
                                        // cancelButtonColor: '#d33',
                                        confirmButtonText: 'Đã hiểu'
                                    }).then(function(result) {
                                        if (result.isConfirmed) {
                                            window.location.href = '/';
                                        } else {
                                            window.location.href = '/';
                                        }
                                    });
                                    // }
                                }
                            }
                        });
                    }
                }, 1000);


                var interval = setInterval(function() {
                    if (stopInterval) {
                        clearInterval(interval);
                        return;
                    }

                    $.ajax({
                        url: "<?php echo admin_url('admin-ajax.php'); ?>",
                        type: 'POST',
                        data: {
                            action: 'check_transaction_ticket',
                            nonce: '<?php echo wp_create_nonce('ams_vexe_check_transaction'); ?>',
                            code: '<?php echo esc_js($payment_key); ?>',
                            journey_group_id: '<?php echo esc_js($journey_group_id); ?>'
                        },

                        success: function(response) {
                            if (response.success) {
                                if (response?.data?.status) {
                                    // stopInterval = true;
                                    // $('#check-status-tr').text('Đã thanh toán');
                                    // $('#check-status-tr').removeClass('text-danger').addClass('text-success');
                                    // $('.booking-status').text('Thanh toán thành công');
                                    // $('.bg-blue-success').css('background-color', '#5cb85c');
                                    // clearInterval(timer);
                                    // $('.box_time_expired').remove();
                                    // $('.header-status .notification').show();
                                    // // Add sound effect for celebration
                                    // var audio = new Audio('/wp-content/uploads/assets/sounds/tada.mp3');
                                    // audio.play();
                                    location.href = '/payment-success/?code=<?php echo esc_js($payment_key); ?>';
                                }
                            }
                        }
                    });
                }, 5000);
            });
        </script>

    <?php } ?>

<?php
} else { ?>
    <div class="container">
        <div class="not-fount-trip-container">
            <div class="not__found__content">
                <div class="label" style="font-weight: 500;">Xin lỗi bạn vì sự bất tiện này. Dailyve không tìm thấy thông tin đơn hàng của bạn
                </div>
                <div class="content">Xin bạn vui lòng thay đổi mã đơn hàng</div>
            </div>

            <div class="if_bus_ani">
                <!-- <img src="/wp-content/uploads/assets/images/no-routes.png" alt="no route"> -->
                <iframe style="border: none; width: 100%; height: 100%;"
                    src="https://lottie.host/embed/3c67b86e-7bff-4dac-8b6c-4cf8444beb75/VSTij16CGS.json"></iframe>
            </div>
        </div>
    </div>
<?php
}

get_footer();
?>