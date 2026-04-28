<?php
$today = date_create(date("Y-m-d"));
date_sub($today, date_interval_create_from_date_string("1 day"));
$updated_date = date_format($today, "d-m-Y");

$selectedFromName = array();
$selectedToName = array();

$selectedFromPoints = ams_decode_points_query('fa');
$selectedToPoints = ams_decode_points_query('ta');
$selectedFromKeys = array_flip(array_map('ams_point_key', $selectedFromPoints));
$selectedToKeys = array_flip(array_map('ams_point_key', $selectedToPoints));

?>

<link href="https://unpkg.com/tachyons@4.10.0/css/tachyons.min.css" rel="stylesheet">

<div class="content-area">
    <!-- <div class="container online-booking__search-form">
        <div id="Info" class="w-100" style="color: var(--fs-color-success);">
            <div class="pb3 tc-l tl f4 w-100 ttn"><b id="fromName"></b> Đến <b id="toName"></b></div>
        </div>
    </div> -->

    <div class="container">
        <div class="online-booking-page__content">
            <div class="vivu-providers-header">
                <div class="vivu-author">
                    <div class="vivu-author__img">
                        <img src="<?= home_url('/wp-content/uploads/assets/images/logo-icon-f2.png'); ?>"
                            alt="Dailyve" />
                    </div>
                    <div class="vivu-author__txt">
                        <div class="vivu-author__title">Dailyve Team</div>
                        <div class="vivu-author__date">Ngày cập nhật: <?= $updated_date; ?></div>
                    </div>
                </div>
                <div class="vivu-providers-filter">
                    <select name="filter-vehicle-types">
                        <option value="">Tất cả xe</option>
                        <?php if (isset($dataStatictis['data']['vehicle_types'])) {
                            foreach ($dataStatictis['data']['vehicle_types'] as $type) { ?>
                                <option value="<?= $type['value'] == 'LIMOUSINE' ? 1 : 2; ?>">
                                    <?= $type['value'] == 'LIMOUSINE' ? 'Xe limousine' : 'Xe thường'; ?>
                                    (<?= esc_html($type['count']); ?>)
                                </option>
                        <?php }
                        } ?>
                    </select>
                </div>
            </div>
            <?php if (isset($data['items']) && is_array($data['items']) && empty($returnDate)) { ?>
                <div class="total-vexe-route">
                    <div id="result-vexe">Kết quả chiều <span id="chieu-route">đi</span>: <span id="total-route"><?= esc_html($data['paging']['totalItems']); ?></span> chuyến</div>
                </div>
            <?php } ?>
            <div class="main-vexe-content" is-company-page="0">
                <div class="sidebar-filter-vexe">
                    <div class="route-fixed-left">
                        <div class="sort__sort-container">
                            <div class="sort-title">Sắp xếp</div>
                            <div class="sort__route__radio-group">
                                <label class="radio-wrapper">
                                    <input type="radio" value="time:asc" name="sort" checked>
                                    <p>Giờ đi sớm nhất</p>
                                </label>
                                <label class="radio-wrapper">
                                    <input type="radio" value="time:desc" name="sort">
                                    <p>Giờ đi muộn nhất</p>
                                </label>
                                <label class="radio-wrapper">
                                    <input type="radio" value="rating:desc" name="sort">
                                    <p>Đánh giá cao nhất</p>
                                </label>
                                <label class="radio-wrapper">
                                    <input type="radio" value="fare:asc" name="sort">
                                    <p>Giá tăng dần</p>
                                </label>
                                <label class="radio-wrapper">
                                    <input type="radio" value="fare:desc" name="sort">
                                    <p>Giá giảm dần</p>
                                </label>
                            </div>
                        </div>
                        <?php if (isset($dataStatictis['data'])) { ?>
                            <div class="filters__container">
                                <div class="filters__group">
                                    <div class="filter-title">
                                        <div class="title">Lọc</div>
                                        <p class="btn-clear" id="remove-all-filter">Xóa lọc</p>
                                    </div>
                                    <div class="filter-item">
                                        <div class="group_style filter_bus-operator">
                                            <p>Giờ đi</p>
                                            <div id="time-range" class="d-hidden">
                                                <div class="sliders_step1">
                                                    <div id="slider-range"></div>
                                                </div>
                                                <div class="box-time-filter">
                                                    <div class="input-item-time">
                                                        <p>Từ</p>
                                                        <span class="slider-time">00:00</span>
                                                    </div>
                                                    <div class="input-item-time">
                                                        <p>Tới</p>
                                                        <span class="slider-time2">23:59</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <?php // if (1 > 2) {  
                                        ?>
                                        <div class="group_style filter_bus-operator">
                                            <p>Nhà xe</p>
                                            <div class="d-hidden">
                                                <input type="text" id="searchBox" class="input-filter"
                                                    placeholder="Tìm trong danh sách">
                                                <div id="company-list" class="company-list-filter">
                                                    <?php foreach ($dataStatictis['data']['companies']['data'] as $company) {
                                                        if ($company['id'] != 11071) {
                                                    ?>
                                                            <label>
                                                                <input type="checkbox" value="<?= esc_attr($company['id']); ?>"
                                                                    <?= in_array($company['id'], $arrCompanies) ? 'checked' : '' ?>
                                                                    data-name="<?= esc_attr($company['name']); ?>"><?= esc_html($company['name']); ?>
                                                                (<?= esc_html($company['trip_count']); ?>)
                                                            </label>
                                                    <?php }
                                                    } ?>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="group_style filter_bus-operator">
                                            <p>Đánh giá</p>
                                            <div class="list-rating-filters d-hidden">
                                                <div class="item-rating-filter <?= in_array(4, $arrRating) ? 'active' : ''; ?>"
                                                    data-rating="4-5" data-rating-min="4" data-rating-max="5">
                                                    <div class="ratings">
                                                        <div class="empty-stars" style="font-size: 15pt;"></div>
                                                        <div class="full-stars" style="width: 80%; font-size: 15pt;"></div>
                                                    </div>
                                                    <span>trở lên</span>
                                                </div>
                                                <div class="item-rating-filter <?= in_array(3, $arrRating) ? 'active' : ''; ?>"
                                                    data-rating="3-5" data-rating-min="3" data-rating-max="5">
                                                    <div class="ratings">
                                                        <div class="empty-stars" style="font-size: 15pt;"></div>
                                                        <div class="full-stars" style="width: 60%; font-size: 15pt;"></div>
                                                    </div>
                                                    <span>trở lên</span>
                                                </div>
                                                <div class="item-rating-filter <?= in_array(2, $arrRating) ? 'active' : ''; ?>"
                                                    data-rating="2-5" data-rating-min="2" data-rating-max="5">
                                                    <div class="ratings">
                                                        <div class="empty-stars" style="font-size: 15pt;"></div>
                                                        <div class="full-stars" style="width: 40%; font-size: 15pt;"></div>
                                                    </div>
                                                    <span>trở lên</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="group_style filter_bus-operator">
                                            <p>Điểm đi</p>
                                            <div class="d-hidden">
                                                <input type="text" id="searchBoxPickUpPC" class="input-filter"
                                                    placeholder="Tìm trong danh sách">
                                                <div id="company-list-fromArea-pc" class="company-list-filter">
                                                    <?php foreach ($dataStatictis['data']['pickup_points'] as $key => $point) {
                                                        $k = ams_point_key($point);
                                                        $pointB64 = base64_encode(wp_json_encode($point));
                                                        $isChecked = isset($selectedFromKeys[$k]);
                                                    ?>
                                                        <label style="font-size: 14px;">
                                                            <input
                                                                type="checkbox"
                                                                class="js-point js-pickup-point"
                                                                value="1"
                                                                <?php echo $isChecked ? 'checked' : ''; ?>
                                                                data-point-b64="<?php echo esc_attr($pointB64); ?>"
                                                                data-name="<?php echo esc_attr($point['district']); ?>">
                                                            <?= esc_html($point['district']); ?>
                                                            (<?= esc_html($point['trip_count']); ?>)
                                                        </label>
                                                    <?php } ?>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="group_style filter_bus-operator">
                                            <p>Điểm đến</p>
                                            <div class="d-hidden">
                                                <input type="text" id="searchBoxDropOffPC" class="input-filter"
                                                    placeholder="Tìm trong danh sách">
                                                <div id="company-list-toArea-pc" class="company-list-filter">
                                                    <?php foreach ($dataStatictis['data']['dropoff_points'] as $key => $point) {
                                                        $k = ams_point_key($point);
                                                        $pointB64 = base64_encode(wp_json_encode($point));
                                                        $isChecked = isset($selectedToKeys[$k]);
                                                    ?>
                                                        <label style="font-size: 14px;">
                                                            <input
                                                                type="checkbox"
                                                                class="js-point js-dropoff-point"
                                                                value="1"
                                                                <?php echo $isChecked ? 'checked' : ''; ?>
                                                                data-point-b64="<?php echo esc_attr($pointB64); ?>"
                                                                data-name="<?php echo esc_attr($point['district']); ?>">
                                                            <?= esc_html($point['district']); ?>
                                                            (<?= esc_html($point['trip_count']); ?>)
                                                        </label>
                                                    <?php } ?>
                                                </div>
                                            </div>
                                        </div>
                                        <?php // } 
                                        ?>
                                    </div>
                                </div>
                            </div>
                        <?php } ?>
                    </div>
                </div>
                <div class="sidebar-vexe-right">
                    <div class="list-search">

                    </div>
                    <div class="list-route-trip-container">
                        <?php if (isset($data['items']) && is_array($data['items']) && count($data['items']) > 0) { 
                            $company_data_map = ams_get_bulk_company_data($data['items']);
                        ?>
                            <ul class="online-booking-page__provider-list" total="<?php echo esc_attr($data['paging']['totalItems']); ?>">
                                <?php foreach ($data['items'] as $key => $item) {
                                    if ($item['company_id'] != 11071) {
                                        $cid = trim($item['company_id']);
                                        $company_info = $company_data_map[$cid] ?? ['thumbnail' => '', 'gallery' => []];
                                        $thumbnail_url = $company_info['thumbnail'];
                                        $gallery = $company_info['gallery'];
                                ?>

                                        <li class="online-booking-page__provider-list__item"
                                            id="route-trip-<?= esc_attr($item['trip_id']); ?>">
                                            <?php if (!empty($item['notification'])) { ?>
                                                <div class="online-booking-page__provider-list__item_header_notify">
                                                    <div class="header_notify-note">
                                                        <div class="notify-tag">
                                                            <span>Thông báo</span>
                                                        </div>
                                                        <div class="tooltip notify-link">
                                                            <?= esc_html($item['notification']['label']) ?>
                                                            <span
                                                                class="tooltiptext tooltip-top"><?= wp_kses_post($item['notification']['content']) ?></span>
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
                                                                <?= esc_html($item['ratings']['overall'] ?? 0) ?>
                                                                (<?= esc_html($item['ratings']['comments'] ?? 0) ?>)
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
                                                        Còn <?= esc_html($item['available_seat']); ?> chỗ trống
                                                    </div>
                                                </div>
                                                <div class="online-booking-page__provider-list__item__btns">

                                                    <div data-companyid="<?= esc_attr($item['company_id']); ?>" data-load="0"
                                                        data-tripid="<?= esc_attr($item['trip_id']); ?>"
                                                        data-seat-template-id="<?= esc_attr($item['seat_template_id']); ?>"
                                                        data-partner-id="<?= esc_attr($item['partner']['partner_id']); ?>"
                                                        data-partner-name="<?= esc_attr($item['partner']['partner_name']); ?>"
                                                        data-departure-date="<?= esc_attr($item['departure_date'] ?? ''); ?>"
                                                        data-departure-time="<?= esc_attr($item['departure_time'] ?? ''); ?>"
                                                        data-pickup-date="<?= esc_attr($item['pickup_date']); ?>"
                                                        data-way-id="<?php echo isset($item['way_id']) ? esc_attr($item['way_id']) : ''; ?>"
                                                        data-booking-id="<?php echo isset($item['booking_id']) ? esc_attr($item['booking_id']) : ''; ?>"
                                                        data-fare="<?= esc_attr($item['fare']); ?>"
                                                        class="online-booking-page__provider-list__item__details-btn">
                                                        Thông tin chi tiết
                                                    </div>

                                                    <button class="online-booking-page__provider-list__item__price-btn"
                                                        data-trip="<?= esc_attr($item['trip_id']); ?>"
                                                        data-to="<?php echo (isset($item['toId']) ? esc_attr($item['toId']) : (isset($item['to_name']) ? esc_attr($item['to_name']) : '')); ?>"
                                                        data-from="<?php echo (isset($item['fromId']) ? esc_attr($item['fromId']) : (isset($item['from_name']) ? esc_attr($item['from_name']) : '')); ?>"
                                                        data-partner-id="<?= esc_attr($item['partner']['partner_id']); ?>"
                                                        data-departure-time="<?= esc_attr($item['departure_time'] ?? ''); ?>"
                                                        data-departure-date="<?= esc_attr($item['departure_date'] ?? ''); ?>"
                                                        data-pickup-date="<?= esc_attr($item['pickup_date']); ?>"
                                                        data-way-id="<?php echo isset($item['way_id']) ? esc_attr($item['way_id']) : ''; ?>"
                                                        data-booking-id="<?php echo isset($item['booking_id']) ? esc_attr($item['booking_id']) : ''; ?>"
                                                        data-fare="<?= esc_attr($item['fare']); ?>"
                                                        data-unchoosable="<?php echo isset($item['unchoosable']) ? esc_attr($item['unchoosable']) : 0; ?>"
                                                        data-route-name="<?php echo isset($item['route_name']) ? esc_attr($item['route_name']) : ''; ?>">
                                                        Chọn chuyến
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="online-booking-page__provider-list__item__full-route">
                                                <?php if (isset($item['route_name']) && !empty($item['route_name']) && isset($item['departure_date'])) { ?>
                                                    <div class="notify-trip">
                                                        <div class="full-trip"><span>*</span>Vé chặng thuộc chuyến
                                                            <?php echo formatDateISO($item['departure_date']); ?>
                                                            <?php echo esc_html($item['route_name']); ?>
                                                        </div>
                                                    </div>
                                                <?php } ?>
                                                <div style="width: 100%;"
                                                    id="ticket-loading-<?= esc_attr($item['trip_id']); ?>">
                                                </div>
                                            </div>
                                            <div class="online-booking-page__provider-list__seats-info"
                                                id="seats-info-conetnt-<?= esc_attr($item['trip_id']); ?>">
                                            </div>
                                            <div class="online-booking-page__provider-list__details-tab"
                                                id="detail-tab-<?= esc_attr($item['trip_id']); ?>">
                                                <div class="provider-details">
                                                    <ul class="provider-details__nav">
                                                        <li data-tab="images-tab-<?= esc_attr($item['trip_id']); ?>"
                                                            class="active">Hình ảnh</li>
                                                        <li
                                                            data-tab="convenience-tab-<?= esc_attr($item['trip_id']); ?>">
                                                            Tiện ích</li>
                                                        <li
                                                            data-tab="ratings-tab-<?= esc_attr($item['trip_id']); ?>">
                                                            Đánh giá</li>
                                                        <li
                                                            data-tab="pickup-dropoff-points-tab-<?= esc_attr($item['trip_id']); ?>">
                                                            Điểm đón, trả</li>
                                                        <li
                                                            data-tab="policy-tab-<?= esc_attr($item['trip_id']); ?>">
                                                            Chính sách</li>
                                                    </ul>
                                                    <div class="provider-details__tabs width-tab">
                                                        <div id="images-tab-<?= esc_attr($item['trip_id']); ?>"
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
                                                        <div id="convenience-tab-<?= esc_attr($item['trip_id']); ?>"
                                                            class="provider-details__tab">
                                                            <ul class="provider_details_convenience__list"></ul>
                                                            <div class="provider_details_convenience__list_2"></div>
                                                        </div>
                                                        <div id="pickup-dropoff-points-tab-<?= esc_attr($item['trip_id']); ?>"
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
                                                        <div id="policy-tab-<?= esc_attr($item['trip_id']); ?>"
                                                            class="provider-details__tab">
                                                            <p class="policy-title"><strong>Chính sách nhà xe</strong></p>
                                                            <div class="content-policy-container">

                                                            </div>
                                                        </div>
                                                        <div id="ratings-tab-<?= esc_attr($item['trip_id']); ?>"
                                                            class="provider-details__tab">
                                                            <div class="ratings-tab__average">
                                                                <span class="ratings-tab__average__point">
                                                                    <i class="fas fa-star"></i>
                                                                    <?= esc_html($item['ratings']['overall']) ?>
                                                                </span>
                                                                <span class="ratings-tab__average__total-ratings">
                                                                    <?= esc_html($item['ratings']['comments']) ?>
                                                                    đánh giá
                                                                </span>
                                                                <div class="ratings-tab__show-cmt__btn-wrap">
                                                                    <!-- <button data-fancybox="" data-provider-id="3740"
                                                            data-src="#provider-details__comment-form"
                                                            class="ratings-tab__show-cmt__btn">Viết đánh giá</button> -->
                                                                    <div class="ratings">
                                                                        <div class="empty-stars" style="font-size: 16pt;"></div>
                                                                        <div class="full-stars"
                                                                            style="width: <?php echo esc_attr(!isset($item['ratings']['overall']) ? 0 : ($item['ratings']['overall'] / 5) * 100); ?>%; font-size: 16pt;">
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="rating-tab__cats"
                                                                id="list-rating-cats-<?= esc_attr($item['trip_id']); ?>">

                                                            </div>
                                                            <div class="rating-tab__comments-list"
                                                                id="comment-list-<?= esc_attr($item['trip_id']); ?>">

                                                            </div>
                                                            <div class="rating-tab__comments-list-pagination"
                                                                id="comment-pagination-<?= esc_attr($item['trip_id']); ?>">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <?php if (!empty($item['important_notification']['content'])) : ?>
                                                <div class="notice-box">
                                                    <h3 class="notice-box__title"><?php echo esc_html($item['important_notification']['label']); ?></h3>
                                                    <div class="notice-box__desc"><?php echo wp_kses_post($item['important_notification']['content']); ?></div>
                                                </div>
                                            <?php endif; ?>
                                        </li>
                                <?php }
                                } ?>
                            </ul>
                            <?php if ($data['paging']['hasMore'] > 0) { ?>
                                <div class="box-load-more">
                                    <button type="button" data-current-page="1" data-cursor="<?php echo esc_attr($data['nextCursor'] ?? ''); ?>" data-total-page="<?php echo esc_attr($data['paging']['totalPages'] ?? 0); ?>"
                                        class="btn-load-more-route">Xem thêm chuyến</button>
                                </div>
                                <div class="load-more-response-meta"
                                    data-has-more="<?php echo !empty($data['paging']['hasMore']) ? '1' : '0'; ?>"
                                    data-next-cursor="<?php echo esc_attr($data['nextCursor'] ?? ''); ?>"
                                    style="display:none;">
                                </div>
                            <?php } ?>
                        <?php } else {  //echo '<pre>';  print_r($data); echo '</pre>'; 
                        ?>
                            <div class="not-fount-trip-container">
                                <div class="not__found__content">
                                    <div class="label">Xin lỗi bạn vì sự bất tiện này. Dailyve sẽ cập nhật ngay khi có
                                        thông
                                        tin xe hoạt động trên tuyến đường <br>
                                        <b><span class="from-name-not"></span> đi <span class="to-name-not"></span></b> ngày <b class="route-not-date"></b>
                                    </div>
                                    <div class="content">Xin bạn vui lòng thay đổi tuyến đường tìm kiếm</div>
                                </div>
                                <div class="if_bus_ani">
                                    <!-- <img src="/wp-content/uploads/assets/images/no-routes.png" alt="no route"> -->
                                    <iframe style="border: none; width: 100%; height: 100%;"
                                        src="https://lottie.host/embed/3c67b86e-7bff-4dac-8b6c-4cf8444beb75/VSTij16CGS.json"></iframe>
                                </div>
                            </div>
                        <?php } ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!--  main bottom sheet / modal    -->
<div class="bottom-sheet-wrapper" id="bottom-sheet-sort">
    <div class="backdrop"></div>
    <div class="bottom-sheet">
        <div class="close-sheet">
            <i class="fas fa-times-circle"></i>
        </div>
        <div class="bottom-sheet-content">
            <div class="bottom-sheet-content-header">
                <div>Sắp xếp</div>
            </div>
            <div class="bottom-sheet-content-body">
                <div class="sort__route__radio-group">
                    <label class="radio-wrapper">
                        <input type="radio" value="time:asc" name="sort" checked>
                        <p>Giờ đi sớm nhất</p>
                    </label>
                    <label class="radio-wrapper">
                        <input type="radio" value="time:desc" name="sort">
                        <p>Giờ đi muộn nhất</p>
                    </label>
                    <label class="radio-wrapper">
                        <input type="radio" value="rating:desc" name="sort">
                        <p>Đánh giá cao nhất</p>
                    </label>
                    <label class="radio-wrapper">
                        <input type="radio" value="fare:asc" name="sort">
                        <p>Giá tăng dần</p>
                    </label>
                    <label class="radio-wrapper">
                        <input type="radio" value="fare:desc" name="sort">
                        <p>Giá giảm dần</p>
                    </label>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Bottom Sheet Company  -->
<div class="bottom-sheet-wrapper" id="bottom-sheet-company">
    <div class="backdrop"></div>
    <div class="bottom-sheet">
        <div class="close-sheet">
            <i class="fas fa-times-circle"></i>
        </div>
        <div class="bottom-sheet-content">
            <div class="bottom-sheet-content-header">
                <div>Nhà xe</div>
            </div>
            <div class="bottom-sheet-content-body">
                <div class="company__route__list filter_bus-operator">
                    <input type="text" id="searchBoxMobile" class="input-filter"
                        placeholder="Tìm trong danh sách">
                    <div id="company-list-mobile" class="company-list-filter">
                        <?php foreach ($dataStatictis['data']['companies']['data'] as $company) { ?>
                            <label>
                                <input type="checkbox" value="<?= esc_attr($company['id']); ?>"
                                    <?= in_array($company['id'], $arrCompanies) ? 'checked' : '' ?>
                                    data-name="<?= esc_attr($company['name']); ?>"><?= esc_html($company['name']); ?>
                                (<?= esc_html($company['trip_count']); ?>)
                            </label>
                        <?php } ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Bottom Sheet Time -->
<div class="bottom-sheet-wrapper" id="bottom-sheet-time">
    <div class="backdrop"></div>
    <div class="bottom-sheet">
        <div class="close-sheet">
            <i class="fas fa-times-circle"></i>
        </div>
        <div class="bottom-sheet-content">
            <div class="bottom-sheet-content-header">
                <div>Giờ đi</div>
            </div>
            <div class="bottom-sheet-main">
                <div class="bottom-sheet-content-body">
                    <div class="company__route__list filter_bus-operator">
                        <div id="time-range-mobile">

                            <div class="sliders_step1">
                                <div id="slider-range-mobile"></div>
                            </div>
                            <div class="box-time-filter">
                                <div class="input-item-time">
                                    <p>Từ</p>
                                    <span class="slider-time start-time">00:00</span>
                                </div>
                                <div class="input-item-time">
                                    <p>Tới</p>
                                    <span class="slider-time2 end-time">23:59</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-sheet-content-footer">
            <button class="sheet-button clear-filter-button" id="btn-time-filter-clear">
                Xóa lọc
            </button>
            <button class="sheet-button clear-filter-button" style="background: #0d2e59; color: #ffffff;" id="btn-time-filter-apply">
                Áp dụng
            </button>
        </div>
    </div>
</div>

<!-- Bottom Sheet Filters All -->
<div class="bottom-sheet-wrapper" id="bottom-sheet-filter-all">
    <div class="backdrop"></div>
    <div class="bottom-sheet">
        <div class="close-sheet">
            <i class="fas fa-times-circle"></i>
        </div>
        <div class="bottom-sheet-content">
            <div class="bottom-sheet-content-header">
                <!-- <h3>Lọc</h3> -->
            </div>
            <div class="bottom-sheet-main">
                <div class="bottom-sheet-content-body">
                    <div class="company__route__list filter_bus-operator">
                        <input type="text" id="searchBoxPickUpMobile" class="input-filter"
                            placeholder="Điểm đi">
                        <div id="company-list-fromArea-mobile" class="company-list-filter">
                            <?php foreach ($dataStatictis['data']['pickup_points'] as $key => $point) {
                                $k = ams_point_key($point);
                                $pointB64 = base64_encode(wp_json_encode($point));
                                $isChecked = isset($selectedFromKeys[$k]);
                            ?>
                                <label style="font-size: 14px;">
                                    <input
                                        type="checkbox"
                                        class="js-point js-pickup-point"
                                        value="1"
                                        <?php echo $isChecked ? 'checked' : ''; ?>
                                        data-point-b64="<?php echo esc_attr($pointB64); ?>"
                                        data-name="<?php echo esc_attr($point['district']); ?>">
                                    <?= esc_html($point['district']); ?>
                                    (<?= esc_html($point['trip_count']); ?>)
                                </label>
                            <?php } ?>
                        </div>
                    </div>
                    <div class="company__route__list filter_bus-operator" style="margin-top: 10px;">
                        <input type="text" id="searchBoxDropOffMobile" class="input-filter"
                            placeholder="Điểm đến">
                        <div id="company-list-toArea-mobile" class="company-list-filter">
                            <?php foreach ($dataStatictis['data']['dropoff_points'] as $point) {
                                $k = ams_point_key($point);
                                $pointB64 = base64_encode(wp_json_encode($point));
                                $isChecked = isset($selectedToKeys[$k]);
                            ?>
                                <label style="font-size: 14px;">
                                    <input
                                        type="checkbox"
                                        class="js-point js-dropoff-point"
                                        value="1"
                                        <?php echo $isChecked ? 'checked' : ''; ?>
                                        data-point-b64="<?php echo esc_attr($pointB64); ?>"
                                        data-name="<?php echo esc_attr($point['district']); ?>">
                                    <?= esc_html($point['district']); ?>
                                    (<?= esc_html($point['trip_count']); ?>)
                                </label>
                            <?php } ?>
                        </div>
                    </div>
                    <div class="group_style filter_bus-operator" style="margin-top: 10px;">
                        <p>Đánh giá</p>
                        <div class="list-rating-filters">
                            <div class="item-rating-filter <?= in_array(4, $arrRating) ? 'active' : ''; ?>"
                                data-rating="4-5" data-rating-min-mb="4" data-rating-max="5">
                                <div class="ratings">
                                    <div class="empty-stars" style="font-size: 16pt;"></div>
                                    <div class="full-stars" style="width: 80%; font-size: 16pt;"></div>
                                </div>
                                <span>trở lên</span>
                            </div>
                            <div class="item-rating-filter <?= in_array(3, $arrRating) ? 'active' : ''; ?>"
                                data-rating="3-5" data-rating-min-mb="3" data-rating-max="5">
                                <div class="ratings">
                                    <div class="empty-stars" style="font-size: 16pt;"></div>
                                    <div class="full-stars" style="width: 60%; font-size: 16pt;"></div>
                                </div>
                                <span>trở lên</span>
                            </div>
                            <div class="item-rating-filter <?= in_array(2, $arrRating) ? 'active' : ''; ?>"
                                data-rating="2-5" data-rating-min-mb="2" data-rating-max="5">
                                <div class="ratings">
                                    <div class="empty-stars" style="font-size: 16pt;"></div>
                                    <div class="full-stars" style="width: 40%; font-size: 16pt;"></div>
                                </div>
                                <span>trở lên</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="bottom-sheet-content-footer">
            <button class="sheet-button clear-filter-button" id="btn-area-filter-clear">
                Xóa lọc
            </button>
            <button class="sheet-button clear-filter-button" style="background: #0d2e59; color: #ffffff;" id="btn-area-filter-apply">
                Áp dụng
            </button>
        </div>
    </div>
</div>

<script>
    const urlParams = new URLSearchParams(window.location.search);
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    const myParamDate = urlParams.get("date") ? urlParams.get("date") : currentDate.toLocaleDateString("vi-VN").split("/").map(part => part.padStart(2, "0")).join("-");
    const myParamReturnDate = urlParams.get("returnDate") ?? new Date().toLocaleDateString("vi-VN").split("/").map(part => part.padStart(2, "0")).join("-");

    document.getElementById("datepicker").value = myParamDate;
    document.getElementById("datepickerReturn").value = myParamReturnDate;

    const myParamNameFrom = urlParams.get("nameFrom");
    document.getElementById("inputFrom").value = myParamNameFrom;
    const myParamNameTo = urlParams.get("nameTo");
    document.getElementById("inputTo").value = myParamNameTo;

    jQuery(document).ready(function() {
        if (jQuery(".route-not-date").length > 0) {
            jQuery(".route-not-date").text(myParamDate);
            jQuery(".from-name-not").text(document.getElementById("nameFrom").value);
            jQuery(".to-name-not").text(document.getElementById("nameTo").value);
        }
    })
</script>