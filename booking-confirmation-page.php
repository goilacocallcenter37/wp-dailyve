<?php

/**
 * Template Name: Booking Confirmation Page
 */

get_header();

if (!empty($_SESSION['tickets']) && isset($_SESSION['tickets'])) {
    $tickets = $_SESSION['tickets'];
    $collab_guest_name = (isset($tickets[0]['collabGuestName'])) ? preg_replace('/\s+/', ' ', trim($tickets[0]['collabGuestName'])) : null;
    $collab_guest_phone = (isset($tickets[0]['collabGuestPhone'])) ? $tickets[0]['collabGuestPhone'] : null;

    // echo '<pre>';
    // print_r($tickets);
    // echo '</pre>';
?>
    <style>
        #main {
            background-color: #f2f2f2;
        }
    </style>
    <div class="container box-wrapper-info" id="form-payment-pay">
        <div class="booking-confirmation">
            <div class="row">
                <div class="col medium-6 small-12 large-7">
                    <div class="col-inner">
                        <div class="payment_body_container">
                            <div class="payment_title" style="margin-bottom: 20px;">Thông tin liên hệ</div>
                            <div class="wrap-left-info" style="width: 100%;">
                                <div class="omrs-input-group">
                                    <label class="omrs-input-underlined">
                                        <input <?php if ($collab_guest_name != null) : echo "value='$collab_guest_name'";
                                                    echo "readonly=true";
                                                endif; ?> required="" name="customer-name">
                                        <span <?php if ($collab_guest_name != null) : ?> style="top: 3px;" <?php endif; ?> class="omrs-input-label">Tên người đi <span style="color: red;">*</span></span>
                                        <span class="omrs-input-helper" id="msg-err-name"></span>
                                    </label>
                                </div>
                                <div class="omrs-input-group">
                                    <label class="omrs-input-underlined">
                                        <input <?php if ($collab_guest_phone != null) : echo "value='$collab_guest_phone'";
                                                    echo "readonly=true";
                                                endif; ?> required="" name="customer-phone">
                                        <span <?php if ($collab_guest_phone != null) : ?> style="top: 3px;" <?php endif; ?> class="omrs-input-label">Số điện thoại <span style="color: red;">*</span></span>
                                        <span class="omrs-input-helper" id="msg-err-phone"></span>
                                    </label>
                                </div>
                                <div class="omrs-input-group">
                                    <label class="omrs-input-underlined">
                                        <input required="" name="customer-email">
                                        <span class="omrs-input-label">mail@example.com <span style="color: red;">*</span></span>
                                        <span class="omrs-input-helper" id="msg-err-email"></span>
                                    </label>
                                </div>
                                <div>
                                    <textarea rows="3" style="width: 100%; border-radius: 8px;" placeholder="Ghi chú" name="customer-note"></textarea>
                                </div>

                            </div>
                            <div class="trust-message-container trust" style="margin-bottom: 20px;">
                                <i class="fas fa-shield-alt"></i>
                                <p class="trust-message-content">Số điện thoại và email được sử dụng để gửi thông tin đơn hàng và liên hệ khi cần thiết.</p>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="col medium-6 small-12 large-5">
                    <div class="col-inner">
                        <div class="payment_body_container" style="padding: 20px; margin-bottom: 20px;">
                            <div class="section-info-ticket">
                                <div class="title-info-ticket">Thông tin chuyến đi</div>
                                <?php foreach ($tickets as $key => $ticket) { ?>
                                    <div class="content-info-ticket" data-departure-date="<?= $ticket['seatsAndInfoData']['departure_date'] ?? '' ?>" data-departure-time="<?= $ticket['seatsAndInfoData']['departure_time'] ?? '' ?>" style="margin-top: <?= $key == 1 ? '20px' : '' ?>;">
                                        <div class="box-review-info-ticket-round-trip__container">
                                            <div class="section-ticket-header">
                                                <div class="section-ticket-header-left">
                                                    <img src="/wp-content/uploads/assets/images/bus_blue_24dp.svg" alt="bus icon" width="16" height="16">
                                                    <?php if (count($tickets) === 2) { ?>
                                                        <span class="toast-text-route"><?= $key === 0 ? 'CHIỀU ĐI' : 'CHIỀU VỀ'; ?></span>
                                                    <?php } ?>
                                                    <?php if ($ticket['partnerId'] == 'vexere') { ?>
                                                        <p class="base_text date-ticket-info"><?= convertStringToDateName($ticket['seatsAndInfoData']['departure_time']); ?></p>
                                                    <?php } ?>

                                                    <div class="total-ticket">
                                                        <img src="/wp-content/uploads/assets/images/people_alt_black_24dp.svg" alt="total icon" width="16" height="16">
                                                        <p class="base_text_1"><?= isset($ticket['selectedSeats']) ?? count($ticket['selectedSeats']); ?>
                                                            <?php
                                                            if (isset($ticket['selectedSeats'])) {
                                                                $seatCodes = array_column($ticket['selectedSeats'], 'seat_code');
                                                                $seatCodesString = implode(', ', $seatCodes);
                                                                echo !empty($seatCodes) ? '(' . $seatCodesString . ')' : '';
                                                            }
                                                            ?>
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
                                                        <p class="base_text"><?= $ticket['seatsAndInfoData']['company_name'] ?? 'Phương Trang'; ?></p>
                                                        <p class="base_text_1"><?= $ticket['seatsAndInfoData']['name'] ?? 'Limousine'; ?></p>
                                                    </div>
                                                </div>
                                                <div class="box-ticket-route-detail-container">
                                                    <div class="section-route-info">
                                                        <div class="area-point-detail-round-trip__container">
                                                            <div class="date-time-container">
                                                                <div class="date-time-container-pick-up time-pick-up">
                                                                    <div class="base__Headline01">
                                                                        <?php
                                                                        if (isset($ticket['pickupPoint']['real_time']) && $ticket['pickupPoint']['real_time'] != null) {
                                                                            echo convertDateTimeToHour($ticket['pickupPoint']['real_time']);
                                                                        } else {
                                                                            echo convertDateTimeToHour($ticket['transferPickupPoint']['real_time']);
                                                                        }
                                                                        ?>
                                                                    </div>
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
                                                                    <p class="base_text mb-5">
                                                                        <?php
                                                                        if (isset($ticket['pickupPoint']['name']) && $ticket['pickupPoint']['name']) {
                                                                            echo $ticket['pickupPoint']['name'];
                                                                        } else {
                                                                            echo $ticket['transferPickupPoint']['name'];
                                                                        } ?>
                                                                    </p>
                                                                    <p class="base_text_2">
                                                                        <?php
                                                                        if ($ticket['pickupPointMoreDesc']) {
                                                                            echo $ticket['pickupPointMoreDesc'];
                                                                        } elseif (isset($ticket['pickupPoint']['address']) && $ticket['pickupPoint']['address']) {
                                                                            echo $ticket['pickupPoint']['address'];
                                                                        } elseif (isset($ticket['transferPickupPoint']['address']) && $ticket['transferPickupPoint']['address']) {
                                                                            echo $ticket['transferPickupPoint']['address'];
                                                                        } ?>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="area-point-detail-round-trip__container">
                                                            <div class="date-time-container">
                                                                <div class="date-time-container-pick-up time-drop-off mb-0">
                                                                    <div class="base__Headline01">
                                                                        <?php
                                                                        if (isset($ticket['dropoffPoint']['real_time']) && $ticket['dropoffPoint']['real_time']) {
                                                                            echo convertDateTimeToHour($ticket['dropoffPoint']['real_time']);
                                                                        } else {
                                                                            echo convertDateTimeToHour($ticket['transferDropoffPoint']['real_time']);
                                                                        }
                                                                        ?>
                                                                    </div>
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
                                                                    <p class="base_text mb-5">
                                                                        <?php
                                                                        if (isset($ticket['dropoffPoint']['name']) && $ticket['dropoffPoint']['name']) {
                                                                            echo $ticket['dropoffPoint']['name'];
                                                                        } else {
                                                                            echo $ticket['transferDropoffPoint']['name'];
                                                                        } ?>
                                                                    </p>
                                                                    <p class="base_text_2">
                                                                        <?php
                                                                        if ($ticket['dropoffPointMoreDesc']) {
                                                                            echo $ticket['dropoffPointMoreDesc'];
                                                                        } elseif (isset($ticket['dropoffPoint']['address']) && $ticket['dropoffPoint']['address']) {
                                                                            echo $ticket['dropoffPoint']['address'];
                                                                        } elseif (isset($ticket['transferDropoffPoint']['address']) && $ticket['transferDropoffPoint']['address']) {
                                                                            echo $ticket['transferDropoffPoint']['address'];
                                                                        }
                                                                        ?>
                                                                    </p>
                                                                </div>
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
                        <div class="payment_body_container" style="padding: 20px; margin-bottom: 20px;">
                            <div class="ticket_info_body">
                                <?php if (is_user_logged_in() || is_customer_logged_in() === true) : ?>
                                    <div class="flex items-center justify-content-center">
                                        <input type="text" name="contributor_code" placeholder="Nhập mã giới thiệu" id="contributor_code" value="<?php
                                                                                                                                                    $current_user = wp_get_current_user();
                                                                                                                                                    $contributor_code = get_user_meta($current_user->ID, 'contributor_code', true);
                                                                                                                                                    echo !empty($contributor_code) ? $contributor_code : '';
                                                                                                                                                    ?>">
                                    </div>
                                    <div class="error-notify-lv"></div>
                                <?php endif; ?>
                                <div class="total-info-ticket">
                                    <p>Tổng tiền</p>
                                    <p>
                                        <?php
                                        $caculatorPriceTotal = caculatorPriceTotal(true);
                                        $total_price = $caculatorPriceTotal['total_price'];
                                        echo $total_price;
                                        ?>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button class="btn_payment_action" type="button" id="btn_payment">Tiếp tục thanh toán</button>
                            <div style="margin-top: 10px;">
                                <p class="text__base" style="font-weight: 400;">Bạn sẽ sớm nhận được biển số xe, số điện thoại tài xế và dễ dàng thay đổi điểm đón trả sau khi đặt.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


        </div>
    </div>
<?php
} else { ?>
    <div class="container">
        <div class="not-fount-trip-container">
            <div class="not__found__content">
                <div class="label" style="font-weight: 500;">Xin lỗi bạn vì sự bất tiện này. Dailyve không tìm thấy thông tin đơn hàng của bạn
                </div>
                <div class="content">Xin bạn vui lòng đặt vé mới <a href="/">tại đây</a></div>
            </div>
            <div class="if_bus_ani">
                <iframe style="border: none; width: 100%; height: 100%;"
                    src="https://lottie.host/embed/3c67b86e-7bff-4dac-8b6c-4cf8444beb75/VSTij16CGS.json"></iframe>
            </div>
        </div>
    </div>
<?php
}

get_footer();
?>