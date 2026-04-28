<?php

/**
 * Template Name: Page Thanh toán vé custom
 */
get_header();

if (isset($_SESSION['tickets'])) {
    unset($_SESSION['tickets']);
}

$journey_group_id = isset($_GET['code']) ? sanitize_text_field(wp_unslash($_GET['code'])) : '';

if (empty($journey_group_id)) {
    wp_redirect(home_url(), 301);
    exit;
}

$existing_post = [];
$existing_post = get_posts([
    'post_type' => 'book-ticket',
    'post_status' => 'publish',
    'posts_per_page' => -1,
    'meta_query' => [
        [
            'key' => 'journey_group_id',
            'value' => $journey_group_id,
            'compare' => '=',
        ]
    ],
]);

// sort by journey_ticket_index (stable fallback)
if (!empty($existing_post)) {
    usort($existing_post, function ($a, $b) {
        $ia_raw = get_post_meta($a->ID, 'journey_ticket_index', true);
        $ib_raw = get_post_meta($b->ID, 'journey_ticket_index', true);

        $ia = is_numeric($ia_raw) ? (int) $ia_raw : 9999;
        $ib = is_numeric($ib_raw) ? (int) $ib_raw : 9999;

        if ($ia === $ib) {
            return $a->ID <=> $b->ID;
        }
        return $ia <=> $ib;
    });
}

if (!empty($existing_post)) {

    $post_id = $existing_post[0]->ID;
    $post_title = $existing_post[0]->post_title;

    $totalPrice = 0;
    foreach ($existing_post as $p) {
        $tp = get_post_meta($p->ID, 'total_price', true);
        if ($tp === '' || $tp === null) {
            $tp = get_field('total_price', $p->ID);
        }
        $totalPrice += (float) ($tp ?? 0);
    }

    $journeyIds = [];
    foreach ($existing_post as $p) {
        $jid = (string) (get_post_meta($p->ID, 'journey_id', true) ?: (function_exists('get_field') ? (get_field('journey_id', $p->ID) ?? '') : ''));
        if ($jid !== '')
            $journeyIds[] = $jid;
    }
    $journeyIds = array_values(array_unique(array_filter($journeyIds)));

    $paymentStatus = 1;
    if (!empty($existing_post)) {
        $statuses = [];
        foreach ($existing_post as $p) {
            $s = (int) get_post_meta($p->ID, 'payment_status', true);
            if ($s > 0) {
                $statuses[] = $s;
            }
        }
        if (!empty($statuses)) {
            if (in_array(3, $statuses)) {
                $paymentStatus = 3;
            } elseif (in_array(2, $statuses)) {
                $paymentStatus = 2;
            } else {
                $paymentStatus = 1;
            }
        }
    }

    // payment content
    $paymentContent = (string) get_post_meta($post_id, 'payment_content', true);
    if ($paymentContent === '') {
        $paymentContent = (string) (get_field('payment_content', $post_id) ?? '');
    }

    // key used on payment page actions (prefer journey_group_id)
    $payment_key = !empty($journey_group_id) ? $journey_group_id : $post_title;

    // Calculate remaining time for countdown (5 minutes = 300 seconds)
    $post_date_gmt = get_post_time('U', true, $post_id);
    $current_time_gmt = time();
    $expiry_duration = 600; // 10 minutes
    $remaining_seconds = max(0, ($post_date_gmt + $expiry_duration) - $current_time_gmt);

    // ===== Build tickets for rendering (NO API call) =====
    $displayTickets = [];
    foreach ($existing_post as $p) {
        $pid = $p->ID;

        $seatStr = (string) get_post_meta($pid, 'seat', true);
        $seatArr = array_values(array_filter(array_map('trim', explode(',', $seatStr))));

        $displayTickets[] = [
            'post_id' => $pid,
            'index' => (int) get_post_meta($pid, 'journey_ticket_index', true),
            'from' => (string) get_post_meta($pid, 'pickup_name', true),
            'to' => (string) get_post_meta($pid, 'dropoff_name', true),
            'fromAddress' => (string) get_post_meta($pid, 'pickup_address', true),
            'toAddress' => (string) get_post_meta($pid, 'dropoff_address', true),
            'company' => (string) get_post_meta($pid, 'company_bus', true),
            'vehicle' => (string) get_post_meta($pid, 'vehicle_name', true),
            'pickupDate' => (string) get_post_meta($pid, 'pickup_date', true),
            'arrivalDate' => (string) get_post_meta($pid, 'arrival_date', true),
            'bookingCodes' => (string) get_post_meta($pid, 'booking_codes', true),
            'partner_id' => (string) get_post_meta($pid, 'partner_id', true),
            'seatArr' => $seatArr,
            'seatStr' => $seatStr,
            'customer' => [
                'name' => (string) get_post_meta($pid, 'full_name', true),
                'phone' => (string) get_post_meta($pid, 'phone', true),
                'email' => (string) get_post_meta($pid, 'email', true),
            ],
        ];
    }

    $contact = $displayTickets[0]['customer'] ?? ['name' => '', 'phone' => '', 'email' => ''];
    ?>
    <?php if ($paymentStatus == 1) { ?>
        <div class="box_time_expired" style="background-color: var(--primary-color);">
            <div class="color--white">
                <p>Thời gian thanh toán còn lại <strong id="time-expired"></strong></p>
            </div>
        </div>
    <?php } ?>
    <div class="container box-wrapper-info" id="form-payment-pay">
        <div class="payment_content">
            <div class="payment_content_left">
                <?php if ($paymentStatus == 1) { ?>
                    <div class="payment_body_container">
                        <div class="payment_title">Phương thức thanh toán</div>
                        <div class="payment_method_group">
                            <!-- Thanh toán VNPAY -->
                            <!-- <div class="payment_method_detail">
                            <label for="method_vnpayqr">
                                <span><input style="margin-bottom: 0px;" type="radio" name="method" value="vnpayqr" id="method_vnpayqr"></span>
                                <span class="title-wrapper">
                                    <img src="/wp-content/uploads/assets/images/vn_pay.svg" width="20" height="20" alt="vnpay icon">
                                    <p>Thanh toán VNPAY - QR</p>
                                    <div class="bg--positive">
                                        <img src="/wp-content/uploads/assets/images/gpp_good.svg" alt="gpp icon">
                                        <p>An toàn & tiện lợi</p>
                                    </div>
                                </span>
                            </label>
                            <div style="color: rgba(0,0,0,.65);">
                                <p style="font-weight: 400; font-size: 14px; line-height: 20px; letter-spacing: 0px; margin-bottom: 0px; margin-top: 2px; margin-left: 25px;">
                                    Thiết bị cần cài đặt Ứng dụng ngân hàng (Mobile Banking) hoặc Ví VNPAY
                                </p>
                            </div>
                            <div class="payment_method_detail_content_container" id="content_vnpayqr_method">
                                <div class="cop_container">
                                    <p class="info_text_pm" style="font-size: 16px;">Hướng dẫn thanh toán</p>
                                    <div>
                                        <ul class="list-step-payment-vnpayqr">
                                            <li>Đăng nhập Ứng dụng ngân hàng hoặc Ví VNPAY</li>
                                            <li>Quét mã VNPAY-QR để thanh toán</li>
                                            <li>Nhập số tiền thanh toán & mã giảm giá (nếu có), xác minh giao dịch để đặt vé</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div> -->
                            <div class="payment_method_detail">
                                <label for="method_online">
                                    <span><input style="margin-bottom: 0px;" type="radio" name="method" value="online"
                                            id="method_online"></span>
                                    <span class="title-wrapper">
                                        <img src="/wp-content/uploads/assets/images/transfer_va.svg" alt="qr icon">
                                        <p>QR chuyển khoản online</p>
                                        <div class="bg--positive">
                                            <img src="/wp-content/uploads/assets/images/gpp_good.svg" alt="gpp icon">
                                            <p>An toàn & tiện lợi</p>
                                        </div>
                                    </span>
                                </label>
                                <div style="color: rgba(0,0,0,.65);">
                                    <p
                                        style="font-weight: 400; font-size: 14px; line-height: 20px; letter-spacing: 0px; margin-bottom: 0px; margin-top: 2px; margin-left: 25px;">
                                        Không cần nhập thông tin. Xác nhận thanh toán tức thì, nhanh chóng và ít sai sót.
                                    </p>
                                </div>
                                <div class="payment_method_detail_content_container" id="content_online_method">
                                    <div class="transfer_va_box">
                                        <div class="content_detail">
                                            <div class="content_detail_right">
                                                <p class="info_text_pm">Chuyển khoản bằng mã QR, tự động điền thông tin</p>
                                                <div class="content_detail_guideline_step">
                                                    <div>
                                                        <img src="/wp-content/uploads/assets/images/viet_qr_guideline_step_1.svg"
                                                            alt="icon step 1" width="24" height="24">
                                                        <p class="step_title">Mở ứng dụng ngân hàng hoặc ví điện tử</p>
                                                    </div>
                                                    <div>
                                                        <img src="/wp-content/uploads/assets/images/viet_qr_guideline_step_2.svg"
                                                            alt="icon step 2" width="24" height="24">
                                                        <p class="step_title">Dùng tính năng Mã QR quét hình bên</p>
                                                    </div>
                                                    <div>
                                                        <img src="/wp-content/uploads/assets/images/viet_qr_guideline_step_3.svg"
                                                            alt="icon step 3" width="24" height="24">
                                                        <p class="step_title">Hoàn tất thanh toán, chờ Dailyve xác nhận</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="content_detail_left">
                                                <p class="step_title" style="margin-bottom: 10px;">Quét mã bên dưới</p>
                                                <div class="content_detail_qr">
                                                    <img src="https://img.vietqr.io/image/MB-VQRQAAVUO1996-qr_only.png?amount=<?= $totalPrice; ?>&addInfo=<?= $paymentContent; ?>"
                                                        alt="QR code">
                                                </div>
                                                <div>
                                                    <img src="/wp-content/uploads/assets/images/vietqr_napas.png"
                                                        alt="vietqr icon" width="100">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="transfer_va__vietqr_transfer_info_container">
                                            <div class="content_detail_transfer_info">
                                                <div>
                                                    <p class="info_text_pm">Không thể thanh toán bằng mã QR?</p>
                                                    <p
                                                        style="font-size: 14px; font-weight: 700; line-height: 20px; letter-spacing: 0px; margin-bottom: 0px; color: #2474e5; text-align: right;">
                                                        Tự nhập thông tin</p>
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
                                                            <img src="/wp-content/uploads/assets/images/copy-clipboard-blue.svg"
                                                                alt="icon coppy" width="20" height="20">
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
                                                        <p class="info_text_pm total_price">
                                                            <?= number_format($totalPrice, 0, ",", "."); ?>đ</p>
                                                        <!-- <div style="cursor: pointer;">
                                                            <img src="/wp-content/uploads/assets/images/copy-clipboard-blue.svg" alt="icon coppy" width="20" height="20">
                                                        </div> -->
                                                    </div>
                                                </div>
                                                <div>
                                                    <p class="title_text_pm">Nội dung</p>
                                                    <div class="content_detail_transfer_info_copy">
                                                        <p class="info_text_pm"><?= $paymentContent; ?></p>
                                                        <div style="cursor: pointer;"
                                                            onclick="coppyText('<?= $paymentContent; ?>');">
                                                            <img src="/wp-content/uploads/assets/images/copy-clipboard-blue.svg"
                                                                alt="icon coppy" width="20" height="20">
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
                    <div style="width: 100%;">
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
                <?php } else { ?>
                    <div style="width: 100%;">
                        <div class="box_success_notify">
                            <div class="">
                                <div class="message-box _success _failed">
                                    <i class="fa fa-times-circle" aria-hidden="true"></i>
                                    <h2> Vé đã bị hủy </h2>
                                    <p> Xin quý khách vui lòng <a href="/" title="Đặt lại vé khác">đặt lại vé khác</a> hoặc liên
                                        hệ hotline <a href="tel:19000155">1900 0155</a>. Dailyve chân thành cảm ơn. </p>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php } ?>
            </div>
            <div class="payment_content_right">
                <?php if ($displayTickets[0]['partner_id'] == 'vexere') { ?>
                    <div class="payment_body_container" style="padding: 20px;">
                        <div class="ticket_info_body">
                            <div class="flex items-center justify-content-center" style="margin-bottom: 4px; gap: 10px;">
                                <input type="text" name="coupon_code" class="input-coupon" placeholder="Nhập mã giảm giá"
                                    id="coupon_code">
                                <input type="hidden" name="ticket_code" id="ticket_code"
                                    value="<?= esc_attr($journey_group_id); ?>">
                                <button class="btn-add-coupon">Áp dụng</button>
                            </div>
                            <div class="error-notify-lv"></div>
                            <div class="total-info-ticket" style="margin-top: 10px;">
                                <p>Tổng tiền</p>
                                <p class="total_price"><?= number_format($totalPrice, 0, ",", "."); ?>đ</p>
                            </div>
                        </div>
                    </div>
                <?php } ?>
                <div class="payment_body_container" style="padding: 20px;">
                    <div class="section-info-ticket">
                        <div class="title-info-ticket">Thông tin chuyến đi</div>
                        <div class="content-info-ticket">
                            <?php foreach ($displayTickets as $key => $item) { ?>
                                <div class="box-review-info-ticket-round-trip__container"
                                    style="margin-bottom: <?= count($displayTickets) === 2 && $key === 0 ? '16px' : '0px'; ?>;">
                                    <div class="section-ticket-header">
                                        <div class="section-ticket-header-left">
                                            <img src="/wp-content/uploads/assets/images/bus_blue_24dp.svg" alt="bus icon"
                                                width="16" height="16">
                                            <?php if (count($displayTickets) === 2) { ?>
                                                <span class="toast-text-route"><?= $key === 0 ? 'CHIỀU ĐI' : 'CHIỀU VỀ'; ?></span>
                                            <?php } ?>
                                            <?php if ($item['partner_id'] == 'vexere') { ?>
                                                <p class="base_text date-ticket-info">
                                                    <?= esc_html(convertStringToDateName($item['pickupDate'])); ?></p>
                                            <?php } ?>

                                            <div class="total-ticket">
                                                <img src="/wp-content/uploads/assets/images/people_alt_black_24dp.svg"
                                                    alt="total icon" width="16" height="16">
                                                <p class="base_text_1">
                                                    <?= count($item['seatArr']); ?>
                                                    (<?= esc_html(implode(',', $item['seatArr'])); ?>)
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="section-ticket-content">
                                        <div class="section-ticket-company-info">
                                            <div>
                                                <img src="https://static.vexere.com/production/images/1584418537685.jpeg"
                                                    alt="Avatar">
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
                                                            <div class="base__Headline01">
                                                                <?= esc_html(convertStringToTimeN($item['pickupDate'])); ?>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="icon-container">
                                                        <div class="icon-container-top">
                                                            <img class="pickup-icon"
                                                                src="/wp-content/uploads/assets/images/pickup_vv_blue_24dp.svg"
                                                                alt="pickup-icon" width="12" height="12">
                                                        </div>
                                                        <div class="icon-container-divider">
                                                            <div class="icon-container-divider-border-right"></div>
                                                            <div class="icon-container-divider-border-left"></div>
                                                        </div>
                                                    </div>
                                                    <div class="section-area">
                                                        <div class="section-area-picker pickup-point-name">
                                                            <p class="base_text mb-5"><?= esc_html($item['from']); ?></p>
                                                            <p class="base_text_2">
                                                                <?= esc_html($item['fromAddress'] ?: "Đang cập nhật"); ?></p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="area-point-detail-round-trip__container">
                                                    <div class="date-time-container">
                                                        <div class="date-time-container-pick-up time-drop-off mb-0">
                                                            <div class="base__Headline01">
                                                                <?= esc_html(convertStringToTimeN($item['arrivalDate'])); ?>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="icon-container">
                                                        <div class="icon-container-divider">
                                                            <div class="icon-container-divider-border-right"></div>
                                                            <div class="icon-container-divider-border-left"></div>
                                                        </div>
                                                        <div class="icon-container-bottom">
                                                            <img class="pickup-icon"
                                                                src="/wp-content/uploads/assets/images/dropoff_semantic_negative_12dp.svg"
                                                                alt="dropoff-icon" width="12" height="12">
                                                        </div>
                                                    </div>
                                                    <div class="section-area">
                                                        <div class="section-area-picker dropoff-point-name">
                                                            <p class="base_text mb-5"><?= esc_html($item['to']); ?></p>
                                                            <p class="base_text_2">
                                                                <?= esc_html($item['toAddress'] ?: "Đang cập nhật"); ?></p>
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

                <div class="payment_body_container" style="padding: 20px;">
                    <div class="ticket_info_body">
                        <div class="title-info-ticket">Thông tin liên hệ</div>
                        <div class="content_info_customer_ticket">
                            <div>
                                <p class="text__base" style="font-weight: 400;">Khách hàng</p>
                                <p class="text__base"><?= esc_html($contact['name']); ?></p>
                            </div>
                            <div>
                                <p class="text__base" style="font-weight: 400;">Số điện thoại</p>
                                <p class="text__base" id="customer-phone"><?= esc_html($contact['phone']); ?></p>
                            </div>
                            <?php if (!empty($contact['email'])) { ?>
                                <div>
                                    <p class="text__base" style="font-weight: 400;">Email</p>
                                    <p class="text__base" id="customer-email"><?= esc_html($contact['email']); ?></p>
                                </div>
                            <?php } ?>
                        </div>
                    </div>
                </div>

                <?php if ((int) $paymentStatus === 1) { ?>
                    <div>
                        <button class="btn_payment_action" type="button" id="btn_payment_action"
                            data-code="<?= esc_attr($payment_key); ?>">Thanh toán</button>
                        <div style="margin-top: 10px;">
                            <p class="text__base" style="font-weight: 400;">
                                Bạn sẽ sớm nhận được biển số xe, số điện thoại tài xế và dễ dàng thay đổi điểm đón trả sau khi
                                đặt.
                            </p>
                        </div>
                    </div>
                <?php } ?>
            </div>
        </div>
    </div>
    <?php if ($paymentStatus == 1) { ?>
        <script>
            jQuery(document).ready(function ($) {
                var stopInterval = false;
                var paymentKey = '<?php echo esc_js($payment_key); ?>';
                var remaining_seconds = <?php echo (int)$remaining_seconds; ?>;
                var expireAt = Date.now() + remaining_seconds * 1000;
                var timer = setInterval(function () {
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
                                // legacy param name kept as "code" but now we pass journey_group_id/payment key
                                code: '<?php echo esc_js($payment_key); ?>',
                                journey_group_id: '<?php echo esc_js($journey_group_id); ?>'
                            },
                            success: function (response) {
                                if (response.success) {
                                    if (response?.data?.status) {
                                        $('#check-status-tr').text('Chưa thanh toán');
                                        $('.booking-status').text('Vé đã bị hủy');
                                        $('.bg-blue-success').css('background-color', '#eb5757');

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
                                        }).then(function (result) {
                                            if (result.isConfirmed) {
                                                window.location.href = '/';
                                            } else {
                                                window.location.href = '/';
                                            }
                                        });
                                    }
                                }
                            }
                        });

                    }
                }, 1000);

                // Polling kiểm tra giao dịch chuyển khoản tự động mỗi 5 giây
                var checkTransactionInterval = setInterval(function () {
                    if (stopInterval) {
                        clearInterval(checkTransactionInterval);
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
                        success: function (response) {
                            if (response.success) {
                                if (response?.data?.status) {
                                    stopInterval = true;
                                    clearInterval(timer);
                                    clearInterval(checkTransactionInterval);
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
                <div class="label" style="font-weight: 500;">Xin lỗi bạn vì sự bất tiện này. Dailyve không tìm thấy thông
                    tin đơn hàng của bạn
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