<?php

/**
 * Template part for displaying bus booking item
 *
 * @package Flatsome Child
 */

// Ensure $item is available
if (!isset($item)) {
    return;
}

$cache_key = 'company_' . $item['company_id'];
$response = get_transient($cache_key);
if (false === $response) {
    $args = [
        'post_type'      => 'page',
        'posts_per_page' => 1,
        'post_parent'   => 15764,
        'meta_query'     => [
            [
                'key'   => 'company_id',
                'value' => $item['company_id'],
                'compare' => '=',
            ],
        ],
    ];

    $query = new WP_Query($args);
    $companyNX = $query->posts[0] ?? null;
    $thumbnail_url = $companyNX ? get_the_post_thumbnail_url($companyNX->ID, 'medium') : '';
    $gallery = $companyNX ? get_field('company_gallery', $companyNX->ID) ?? [] : [];

    $response = [
        'thumbnail' => $thumbnail_url,
        'gallery' => $gallery,
    ];

    set_transient($cache_key, $response, DAY_IN_SECONDS);
} else {
    $companyNX = null;
    $thumbnail_url = $response['thumbnail'] ?? '';
    $gallery = $response['gallery'] ?? [];
}
?>
<li class="online-booking-page__provider-list__item"
    id="route-trip-<?= $item['trip_id']; ?>">
    <?php if (!empty($item['notification'])) { ?>
        <div class="online-booking-page__provider-list__item_header_notify">
            <div class="header_notify-note">
                <div class="notify-tag">
                    <span>Thông báo</span>
                </div>
                <div class="tooltip notify-link">
                    <?= $item['notification']['label'] ?>
                    <span
                        class="tooltiptext tooltip-top"><?= $item['notification']['content'] ?></span>
                </div>
            </div>
        </div>
    <?php } ?>
    <div class="online-booking-page__provider-list__item__img">
        <img
            src="<?= !empty($thumbnail_url) ? esc_url($thumbnail_url) : home_url('/wp-content/uploads/assets/images/logo-icon-f2.png'); ?>"
            fetchpriority="high" decoding="async" width="162" height="162"
            class="attachment-post-thumbnail size-post-thumbnail wp-post-image entered"
            alt="<?= esc_attr($item['company_name']); ?>">
        <?php // if ($item['route']['schedules'][0]['config'] === 'ONLINE') { 
        ?>
        <div class="instant-confirm">
            <div><i class="fas fa-check-square"></i> Xác nhận tức thì</div>
            <div class="point"></div>
        </div>
        <?php // } 
        ?>
    </div>
    <div class="online-booking-page__provider-list__item__info">
        <div class="online-booking-page__provider-list__item__bus-name-info">
            <p class="online-booking-page__provider-list__item__title">
                <?= esc_html($item['company_name']); ?>
            </p>
            <button type="button" class="ant-btn bus-rating-button">
                <div class="bus-rating">
                    <i class="fas fa-star"></i>
                    <span>
                        <?= $item['ratings']['overall'] ?? 0 ?>
                        (<?= $item['ratings']['comments'] ?? 0 ?>)
                    </span>
                </div>
            </button>
        </div>
        <div class="online-booking-page__provider-list__item__bus-type-info">
            <p><?= esc_html($item['vehicle_type']); ?></p>
        </div>
        <div class="online-booking-page__provider-list__item__route-info">
            <div class="online-booking-page__provider-list__item__route-info__item">
                <span
                    class="online-booking-page__provider-list__item__route-info__item-time"><?= getTime($item['pickup_date']); ?>
                    • </span>
                <span
                    class="online-booking-page__provider-list__item__route-info__item-place"><?= esc_html($item['from_name']); ?></span>
            </div>
            <div class="online-booking-page__provider-list__item__route-info__travel-time">
                <?= totalTimeRoute($item['pickup_date'], $item['arrival_date']); ?>
            </div>
            <div
                class="online-booking-page__provider-list__item__route-info__item online-booking-page__provider-list__item__route-info__item--ct">
                <span
                    class="online-booking-page__provider-list__item__route-info__item-time"><?= getTime($item['arrival_date']); ?>
                    • </span>
                <span
                    class="online-booking-page__provider-list__item__route-info__item-place"><?= esc_html($item['to_name']); ?></span>
            </div>
        </div>
    </div>
    <div class="online-booking-page__provider-list__item__handle">
        <div class="online-booking-page__provider-list__item__price">
            <div class="fare">
                <?= isset($item['fare']) && isset($item['fare_max']) && $item['fare_max'] > $item['fare_original'] ? 'Từ ' : '' ?> <?= number_format($item['fare'], 0, ",", "."); ?>đ
            </div>
            <?php if ($item['fare_discount'] > 0 && $item['fare_original'] > 0) { ?>
                <div class="fareSmall">
                    <div class="small">
                        <?= number_format($item['fare_original'], 0, ",", "."); ?>đ
                    </div>
                </div>
            <?php } ?>
        </div>
        <div class="online-booking-page__provider-list__item__available-seat">
            <div
                class="seat-available <?= $item['available_seat'] <= 5 ? 'text-red' : '' ?>">
                Còn <?= $item['available_seat']; ?> chỗ trống
            </div>
        </div>
        <div class="online-booking-page__provider-list__item__btns">

            <div data-companyid="<?= $item['company_id']; ?>" data-load="0"
                data-tripid="<?= $item['trip_id']; ?>"
                data-seat-template-id="<?= $item['seat_template_id']; ?>"
                data-partner-id="<?= $item['partner']['partner_id']; ?>"
                data-partner-name="<?= $item['partner']['partner_name']; ?>"
                data-departure-date="<?= $item['departure_date'] ?? ''; ?>"
                data-pickup-date="<?= $item['pickup_date']; ?>"
                data-way-id="<?php echo isset($item['way_id']) ? $item['way_id'] : ''; ?>"
                data-booking-id="<?php echo isset($item['booking_id']) ? $item['booking_id'] : ''; ?>"
                data-fare="<?= $item['fare']; ?>"
                class="online-booking-page__provider-list__item__details-btn">
                Thông tin chi tiết
            </div>

            <button class="online-booking-page__provider-list__item__price-btn"
                data-trip="<?= $item['trip_id']; ?>"
                data-to="<?php echo (isset($item['toId']) ? $item['toId'] : (isset($item['to_name']) ? $item['to_name'] : '')); ?>"
                data-from="<?php echo (isset($item['fromId']) ? $item['fromId'] : (isset($item['from_name']) ? $item['from_name'] : '')); ?>"
                data-partner-id="<?= $item['partner']['partner_id']; ?>"
                data-pickup-date="<?= $item['pickup_date']; ?>"
                data-way-id="<?php echo isset($item['way_id']) ? $item['way_id'] : ''; ?>"
                data-booking-id="<?php echo isset($item['booking_id']) ? $item['booking_id'] : ''; ?>"
                data-fare="<?= $item['fare']; ?>"
                data-unchoosable="<?php echo isset($item['unchoosable']) ? $item['unchoosable'] : 0; ?>"
                data-route-name="<?php echo isset($item['route_name']) ? $item['route_name'] : ''; ?>">
                Chọn chuyến
            </button>
        </div>
    </div>
    <div class="online-booking-page__provider-list__item__full-route">
        <?php if (isset($item['route_name']) && !empty($item['route_name']) && isset($item['departure_date'])) { ?>
            <div class="notify-trip">
                <div class="full-trip"><span>*</span>Vé chặng thuộc chuyến
                    <?php echo formatDateISO($item['departure_date']); ?>
                    <?php echo $item['route_name']; ?>
                </div>
            </div>
        <?php } ?>
        <div style="width: 100%;"
            id="ticket-loading-<?= $item['trip_id']; ?>">
        </div>
    </div>
    <div class="online-booking-page__provider-list__seats-info"
        id="seats-info-conetnt-<?= $item['trip_id']; ?>">

    </div>
    <div class="online-booking-page__provider-list__details-tab"
        id="detail-tab-<?= $item['trip_id']; ?>">
        <div class="provider-details">
            <ul class="provider-details__nav">
                <li data-tab="images-tab-<?= $item['trip_id']; ?>"
                    class="active">Hình ảnh</li>
                <li
                    data-tab="convenience-tab-<?= $item['trip_id']; ?>">
                    Tiện ích</li>
                <li
                    data-tab="ratings-tab-<?= $item['trip_id']; ?>">
                    Đánh giá</li>
                <li
                    data-tab="pickup-dropoff-points-tab-<?= $item['trip_id']; ?>">
                    Điểm đón, trả</li>
                <li
                    data-tab="policy-tab-<?= $item['trip_id']; ?>">
                    Chính sách</li>
            </ul>
            <div class="provider-details__tabs width-tab">
                <div id="images-tab-<?= $item['trip_id']; ?>"
                    class="provider-details__tab images-tab">
                    <div class="provider-details__gallery">
                        <?php if (is_array($gallery) && count($gallery) > 0) { ?>
                            <div class="provider-details__gallery-main">
                                <?php foreach ($gallery as $g) { ?>
                                    <div class="provider-details__gallery-main__item">
                                        <img src="<?= esc_url($g['url']); ?>" width="<?= esc_attr($g['width']); ?>" height="<?= esc_attr($g['height']); ?>" class="attachment-large size-large" alt="<?= esc_attr($g['title']); ?>">
                                    </div>
                                <?php } ?>
                            </div>
                            <div class="provider-details__gallery-thumbnails">
                                <?php foreach ($gallery as $g) { ?>
                                    <div class="provider-details__gallery-thumbnails__item">
                                        <img src="<?= esc_url($g['sizes']['medium']); ?>" width="<?= esc_attr($g['sizes']['medium-width']); ?>" height="200" alt="<?= esc_attr($g['title']); ?>">
                                    </div>
                                <?php } ?>
                            </div>
                        <?php } else { ?>
                            <p style="text-align: center;"><strong>Dailyve</strong> sẽ sớm cập nhật thông tin nhà xe <?= esc_html($item['company_name']); ?> đến quý khách. <br> <a href="tel:19000155">Liên hệ hỗ trợ</a></p>
                        <?php } ?>
                    </div>
                </div>
                <div id="convenience-tab-<?= $item['trip_id']; ?>"
                    class="provider-details__tab">
                    <ul class="provider_details_convenience__list"></ul>
                    <div class="provider_details_convenience__list_2"></div>
                </div>
                <div id="pickup-dropoff-points-tab-<?= $item['trip_id']; ?>"
                    class="provider-details__tab">
                    <div class="bus-type-title">Lưu ý</div>
                    <div class="header-content">Các mốc thời gian đón, trả bên dưới là thời
                        gian dự kiến.
                        Lịch này có thể thay đổi tùy tình hình thực tế.</div>
                    <div class="flex flex-wrap accordion-sub-item__wrapper">
                        <div class="accordion-sub-item">
                            <div class="accordion-sub-item__title">Điểm đón</div>
                            <ul class="accordion-sub-item__list pickup-point-list">

                            </ul>
                        </div>
                        <div class="accordion-sub-item">
                            <div class="accordion-sub-item__title">Điểm trả</div>
                            <ul class="accordion-sub-item__list dropoff-point-list">

                            </ul>
                        </div>
                    </div>
                </div>
                <div id="policy-tab-<?= $item['trip_id']; ?>"
                    class="provider-details__tab">
                    <p class="policy-title"><strong>Chính sách nhà xe</strong></p>
                    <div class="content-policy-container">

                    </div>
                </div>
                <div id="ratings-tab-<?= $item['trip_id']; ?>"
                    class="provider-details__tab">
                    <div class="ratings-tab__average">
                        <span class="ratings-tab__average__point">
                            <i class="fas fa-star"></i>
                            <?= $item['ratings']['overall'] ?? 0 ?>
                        </span>
                        <span class="ratings-tab__average__total-ratings">
                            <?= $item['ratings']['comments'] ?? 0 ?>
                            đánh giá
                        </span>
                        <div class="ratings-tab__show-cmt__btn-wrap">
                            <!-- <button data-fancybox="" data-provider-id="3740"
                        data-src="#provider-details__comment-form"
                        class="ratings-tab__show-cmt__btn">Viết đánh giá</button> -->
                            <div class="ratings">
                                <div class="empty-stars" style="font-size: 16pt;"></div>
                                <div class="full-stars"
                                    style="width: <?php echo !isset($item['ratings']['overall']) ? 0 : ($item['ratings']['overall'] / 5) * 100; ?>%; font-size: 16pt;">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="rating-tab__cats"
                        id="list-rating-cats-<?= $item['trip_id']; ?>">

                    </div>
                    <div class="rating-tab__comments-list"
                        id="comment-list-<?= $item['trip_id']; ?>">

                    </div>
                    <div class="rating-tab__comments-list-pagination"
                        id="comment-pagination-<?= $item['trip_id']; ?>">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php if (!empty($item['important_notification']['content'])) : ?>
        <div class="notice-box">
            <h3 class="notice-box__title"><?php echo $item['important_notification']['label']; ?></h3>
            <div class="notice-box__desc"><?php echo $item['important_notification']['content']; ?></div>
        </div>
    <?php endif; ?>
</li>