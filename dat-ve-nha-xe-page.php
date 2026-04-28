<?php



/**

 * Template Name: Page Đặt Vé Nhà Xe

 */

get_header();



if (isset($_SESSION['tickets'])) {

    unset($_SESSION['tickets']);

}



$data = get_query_var('data');

$dataStatictis = get_query_var('dataStatictis');

$arrCompanies = get_query_var('arrCompanies');

$arrRating = get_query_var('arrRating');

$arrFromArea = get_query_var('arrFromArea');

$arrToArea = get_query_var('arrToArea');

$companyId = get_query_var('companyId');

$selectedFromName = array();

$selectedToName = array();



$company = findCompanyById($companyId);



$today = date_create(date('Y-m-d'));

date_sub($today, date_interval_create_from_date_string('1 day'));

$updated_date = date_format($today, 'd-m-Y');

$returnDate = isset($_GET['returnDate']) && !empty($_GET['returnDate']) ? $_GET['returnDate'] : '';



if (count($arrFromArea) > 0) {

    $selectedFromName = array_column($arrFromArea, 'name');

}



if (count($arrToArea) > 0) {

    $selectedToName = array_column($arrToArea, 'name');

}



?>



<link href="https://unpkg.com/tachyons@4.10.0/css/tachyons.min.css" rel="stylesheet">

<style>

    #ui-datepicker-div,

    .page-header-excerpt {

        display: none !important;

    }



    .content-area {

        padding: 30px 0;

    }

</style>



<div class="content-area" style="padding: 16px 0;">

    <div class="container online-booking__search-form">

        <div id="Info" class="w-100" style="color: var(--fs-color-success);">

            <div class="pb3 tc-l tl f4 w-100 ttn">Vé xe <b><?= $company['name']; ?></b> từ <b id="fromName"></b> Đến <b id="toName"></b></div>

        </div>

        <div id="searchForm" class="w-100 tl shadow-search">

            <form class=" w-100" action="/dat-ve-truc-tuyen" autocomplete="off">

                <div class="vxr-widget__wrapper autocomplete cf w-100 flex flex-wrap justify-center items-center" style="border-radius: 6px; background-color: #ffffff;">

                    <div class="w-100 w-20 relative item-search">

                        <div class="relative row-search">

                            <img class="img-form-search" src="/wp-content/uploads/assets/images/circle.png" />

                            <div class="col-search">

                                <label>Điểm Khởi Hành</label>

                                <input id="inputFrom" class="input-search-form w-100" type="text" placeholder="Chọn Điểm Khởi Hành" />

                            </div>

                        </div>

                        <input id="from" style="margin-top: 20px;" name="from" type="hidden" value="" placeholder="Country" />

                        <input id="nameFrom" name="nameFrom" type="hidden" placeholder="Country" />

                        <div id="route-exchange-wrapper">

                            <div id="route-exchange">

                                <i class="fas fa-exchange-alt"></i>

                            </div>

                        </div>

                    </div>

                    <div class="w-100 w-20 relative item-search">

                        <div class="relative row-search">

                            <img class="img-form-search" src="/wp-content/uploads/assets/images/circle2.png" />

                            <div class="col-search">

                                <label>Điểm Đến</label>

                                <input id="inputTo" class="input-search-form w-100" type="text" placeholder="Chn Điểm Đến" />

                            </div>

                        </div>

                        <input id="nameTo" name="nameTo" type="hidden" placeholder="Country" />

                        <input id="to" name="to" type="hidden" value="" placeholder="Country" />

                    </div>

                    <div class="w-100 w-20 relative item-search">

                        <div class="relative row-search">

                            <img class="img-form-search" src="/wp-content/uploads/assets/images/calendar.png" />

                            <div class="col-search">

                                <label>Ngày Khởi Hành</label>

                                <input id="datepicker" class="input-search-form w-100" name="departDate" type="text" placeholder="Chọn ngày đi" />

                            </div>

                        </div>

                    </div>

                    <div class="w-100 w-20 relative item-search" id="add-return-date">

                        <label for="datepickerReturn" class="relative row-search add-return <?= empty($returnDate) ? '' : 'hidden'; ?>" style="margin-bottom: 0;">

                            <div>

                                <i class="fas fa-plus"></i>

                            </div>

                            <p style="margin-bottom: 0;">Thêm ngày về</p>

                        </label>

                        <div class="relative row-search date-return <?= empty($returnDate) ? 'hidden' : ''; ?>">

                            <img class="img-form-search" src="/wp-content/uploads/assets/images/calendar.png" />

                            <div class="col-search">

                                <label>Ngày Về</label>

                                <input id="datepickerReturn" class="input-search-form w-100" name="<?= !empty($returnDate) ? 'returnDate' : 'returnDateTemp'; ?>" type="text" placeholder="Chn ngày về" />

                            </div>

                            <div class="close-add-return">

                                <i class="fas fa-times-circle"></i>

                            </div>

                        </div>

                    </div>

                    <div class="relative dim vxr-search-button item-search">

                        <button class="w-100 pl3 mb0-l flex items-center vxr-widget__child vxr-widget__button vxr-widget__button–search" type="submit" value="Tìm Kiếm Vé">

                            <i class="vxr-widget__indicator vxr-widget__indicator--bus icon-search" style="font-size: 1.4rem;"></i>

                            <span style="padding-left: 0.125em;">TÌM CHUYẾN XE</span></button>

                    </div>

                </div>

            </form>

        </div>

    </div>

    <div class="container">

        <div class="online-booking-page__content">

            <div class="vivu-providers-header">

                <div class="vivu-author">

                    <div class="vivu-author__img">

                        <img src="/wp-content/uploads/2024/10/DailyVe-12.png"

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

                        <?php if (isset($dataStatictis['data']['vehicleTypes'])) {

                            foreach ($dataStatictis['data']['vehicleTypes'] as $type) { ?>

                                <option value="<?= $type['value'] == 'LIMOUSINE' ? 1 : 2; ?>">

                                    <?= $type['value'] == 'LIMOUSINE' ? 'Xe limousine' : 'Xe thưng'; ?>

                                    (<?= $type['count']; ?>)

                                </option>

                        <?php }

                        } ?>

                    </select>

                </div>

            </div>

            <div class="main-vexe-content" is-company-page="<?= $companyId; ?>">

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

                                    <p>Đánh giá cao nht</p>

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

                        <div class="filters__container">

                            <div class="filters__group">

                                <div class="filter-title">

                                    <div class="title">Lọc</div>

                                    <p class="btn-clear" id="remove-all-filter">Xóa lọc</p>

                                </div>

                                <div class="filter-item">

                                    <div class="group_style filter_bus-operator">

                                        <h3>Giờ đi</h3>

                                        <div id="time-range">

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

                                    <div class="group_style filter_bus-operator">

                                        <h3>Đánh giá</h3>

                                        <div class="list-rating-filters">

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

                                        <h3>Điểm đi</h3>

                                        <input type="text" id="searchBoxPickUpPC" class="input-filter"

                                            placeholder="Tìm trong danh sách">

                                        <div id="company-list-fromArea-pc" class="company-list-filter">

                                            <?php foreach ($dataStatictis['data']['fromArea'] as $key => $point) { ?>

                                                <label style="font-size: 14px;">

                                                    <input type="checkbox" value="<?= $point['name']; ?>"

                                                        <?= in_array($point['name'], $selectedFromName) ? 'checked' : ''; ?>

                                                        data-name="<?= $point['name']; ?>"><?= $point['name']; ?>

                                                    (<?= $point['tripCount']; ?>)

                                                </label>

                                            <?php } ?>

                                        </div>

                                    </div>

                                    <div class="group_style filter_bus-operator">

                                        <h3>Điểm đến</h3>

                                        <input type="text" id="searchBoxDropOffPC" class="input-filter"

                                            placeholder="Tìm trong danh sách">

                                        <div id="company-list-toArea-pc" class="company-list-filter">

                                            <?php foreach ($dataStatictis['data']['toArea'] as $point) { ?>

                                                <label style="font-size: 14px;">

                                                    <input type="checkbox" value="<?= $point['name']; ?>"

                                                        <?= in_array($point['name'], $selectedToName) ? 'checked' : ''; ?>

                                                        data-name="<?= $point['name']; ?>"><?= $point['name']; ?>

                                                    (<?= $point['tripCount']; ?>)

                                                </label>

                                            <?php } ?>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                <div class="sidebar-vexe-right">

                    <div class="list-search">



                    </div>

                    <div class="list-route-trip-container">

                        <?php if (is_array($data['data']) && isset($data['data']['data']) && count($data['data']['data']) > 0) { ?>

                            <ul class="online-booking-page__provider-list">

                                <?php foreach ($data['data']['data'] as $key => $item) {

                                    $cache_key = 'company_' . $item['company']['id'];

                                    $response = get_transient($cache_key);

                                    if (false === $response) {

                                        $args = [

                                            'post_type'      => 'post',

                                            'posts_per_page' => 1,

                                            'category__in'   => [6],

                                            'meta_query'     => [

                                                [

                                                    'key'   => 'company_id',

                                                    'value' => $item['company']['id'],

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

                                        id="route-trip-<?= $item['route']['schedules'][0]['tripCode']; ?>"

                                        data-utilities="<?= esc_html(json_encode($item['route']['utilities'])); ?>">

                                        <?php if (!empty($item['route']['titleNotificationStr'])) { ?>

                                            <div class="online-booking-page__provider-list__item_header_notify">

                                                <div class="header_notify-note">

                                                    <div class="notify-tag">

                                                        <span>Thông báo</span>

                                                    </div>

                                                    <div class="tooltip notify-link">

                                                        <?= $item['route']['titleNotificationStr'] ?>

                                                        <span

                                                            class="tooltiptext tooltip-top"><?= $item['route']['notificationStr'] ?></span>

                                                    </div>

                                                </div>

                                            </div>

                                        <?php } ?>

                                        <div class="online-booking-page__provider-list__item__img">

                                            <img

                                                src="<?= !empty($thumbnail_url) ? esc_url($thumbnail_url) : '/wp-content/uploads/assets/images/logo-icon-f2.png'; ?>"

                                                fetchpriority="high" decoding="async" width="950" height="713"

                                                class="attachment-post-thumbnail size-post-thumbnail wp-post-image entered"

                                                alt="<?= $item['company']['displayName']; ?>">

                                            <?php if ($item['route']['schedules'][0]['config'] === 'ONLINE') { ?>

                                                <div class="instant-confirm">

                                                    <div><i class="fas fa-check-square"></i> Xác nhận tức thì</div>

                                                    <div class="point"></div>

                                                </div>

                                            <?php } ?>

                                        </div>

                                        <div class="online-booking-page__provider-list__item__info">

                                            <div class="online-booking-page__provider-list__item__bus-name-info">

                                                <h2 class="online-booking-page__provider-list__item__title">

                                                    <?= $item['company']['displayName']; ?>

                                                </h2>

                                                <button type="button" class="ant-btn bus-rating-button">

                                                    <div class="bus-rating">

                                                        <i class="fas fa-star"></i><span><?= $item['company']['ratings']['overall'] ?>

                                                            (<?= $item['company']['ratings']['comments'] ?>)</span>

                                                    </div>

                                                </button>

                                            </div>

                                            <div class="online-booking-page__provider-list__item__bus-type-info">

                                                <p><?= $item['route']['vehicleType']; ?></p>

                                            </div>

                                            <div class="online-booking-page__provider-list__item__route-info">

                                                <div class="online-booking-page__provider-list__item__route-info__item">

                                                    <span

                                                        class="online-booking-page__provider-list__item__route-info__item-time"><?= getTime($item['route']['schedules'][0]['pickupDate']); ?>

                                                        • </span>

                                                    <span

                                                        class="online-booking-page__provider-list__item__route-info__item-place"><?= $item['route']['from']['name']; ?></span>

                                                </div>

                                                <div class="online-booking-page__provider-list__item__route-info__travel-time">

                                                    <?= totalTimeRoute($item['route']['schedules'][0]['pickupDate'], $item['route']['schedules'][0]['arrivalTime']); ?>

                                                </div>

                                                <div

                                                    class="online-booking-page__provider-list__item__route-info__item online-booking-page__provider-list__item__route-info__item--ct">

                                                    <span

                                                        class="online-booking-page__provider-list__item__route-info__item-time"><?= getTime($item['route']['schedules'][0]['arrivalTime']); ?>

                                                        • </span>

                                                    <span

                                                        class="online-booking-page__provider-list__item__route-info__item-place"><?= $item['route']['to']['name']; ?></span>

                                                </div>

                                            </div>

                                        </div>

                                        <div class="online-booking-page__provider-list__item__handle">

                                            <div class="online-booking-page__provider-list__item__price">

                                                <div class="fare">

                                                    <?= $item['route']['fare']['discount'] > 0 ? number_format($item['route']['fare']['discount'], 0, ",", ".") : number_format($item['route']['fare']['original'], 0, ",", "."); ?>đ

                                                </div>



                                                <?php if ($item['route']['fare']['discount'] > 0) { ?>

                                                    <div class="fareSmall">

                                                        <div class="small">

                                                            <?= number_format($item['route']['fare']['original'], 0, ",", "."); ?>đ

                                                        </div>

                                                    </div>

                                                <?php } ?>

                                            </div>

                                            <div class="online-booking-page__provider-list__item__available-seat">

                                                <div

                                                    class="seat-available <?= $item['route']['departureTimes'][0]['availableSeats'] <= 5 ? 'text-red' : '' ?>">

                                                    Còn <?= $item['route']['departureTimes'][0]['availableSeats']; ?> chỗ trống

                                                </div>

                                            </div>

                                            <div class="online-booking-page__provider-list__item__btns">



                                                <div data-companyid="<?= $item['company']['id']; ?>" data-load="0"

                                                    data-tripid="<?= $item['route']['schedules'][0]['tripCode']; ?>"

                                                    class="online-booking-page__provider-list__item__details-btn">

                                                    Thông tin chi tiết

                                                </div>

                                                <?php

                                                // $scheduleData = esc_html(json_encode($item['route']['schedules'][0]));

                                                $scheduleData = json_encode($item['route']['schedules'][0]);

                                                $encodedData = base64_encode($scheduleData);

                                                ?>

                                                <button class="online-booking-page__provider-list__item__price-btn"

                                                    data-trip="<?= $item['route']['schedules'][0]['tripCode']; ?>"

                                                    data-company="<?= $item['company']['id']; ?>"

                                                    data-schedule="<?= $encodedData; ?>">

                                                    Chọn chuyến

                                                </button>

                                            </div>

                                        </div>

                                        <div class="online-booking-page__provider-list__item__full-route">

                                            <div class="notify-trip">

                                                <div class="full-trip"><span>*</span>Vé chặng thuộc chuyến

                                                    <?= $item['route']['departureTime'] . " " . $item['route']['departureDate']; ?>

                                                    <?= $item['route']['name']; ?>

                                                </div>

                                                <?php if (2 == 1) { ?>

                                                    <div class="content-has-cop">

                                                        <div>Không cần thanh toán trước</div>

                                                    </div>

                                                <?php } ?>

                                            </div>

                                            <div style="width: 100%;"

                                                id="ticket-loading-<?= $item['route']['schedules'][0]['tripCode']; ?>">



                                            </div>

                                        </div>

                                        <div class="online-booking-page__provider-list__seats-info"

                                            id="seats-info-conetnt-<?= $item['route']['schedules'][0]['tripCode']; ?>">



                                        </div>

                                        <div class="online-booking-page__provider-list__details-tab"

                                            id="detail-tab-<?= $item['route']['schedules'][0]['tripCode']; ?>">

                                            <div class="provider-details">

                                                <ul class="provider-details__nav">

                                                    <li data-tab="images-tab-<?= $item['route']['schedules'][0]['tripCode']; ?>"

                                                        class="active">Hình ảnh</li>

                                                    <li

                                                        data-tab="convenience-tab-<?= $item['route']['schedules'][0]['tripCode']; ?>">

                                                        Tiện ích</li>

                                                    <li

                                                        data-tab="ratings-tab-<?= $item['route']['schedules'][0]['tripCode']; ?>">

                                                        Đnh giá</li>

                                                    <li

                                                        data-tab="pickup-dropoff-points-tab-<?= $item['route']['schedules'][0]['tripCode']; ?>">

                                                        Điểm đón, trả</li>

                                                    <li

                                                        data-tab="policy-tab-<?= $item['route']['schedules'][0]['tripCode']; ?>">

                                                        Chính sách</li>

                                                </ul>

                                                <div class="provider-details__tabs width-tab">

                                                    <div id="images-tab-<?= $item['route']['schedules'][0]['tripCode']; ?>"

                                                        class="provider-details__tab images-tab">

                                                        <div class="provider-details__gallery">

                                                            <?php if (is_array($gallery) && count($gallery) > 0) { ?>

                                                                <div class="provider-details__gallery-main">

                                                                    <?php foreach ($gallery as $g) { ?>

                                                                        <div class="provider-details__gallery-main__item">

                                                                            <img src="<?= $g['url']; ?>" width="<?= $g['width']; ?>" height="<?= $g['height']; ?>" class="attachment-large size-large" alt="<?= $g['title']; ?>">

                                                                        </div>

                                                                    <?php } ?>

                                                                </div>

                                                                <div class="provider-details__gallery-thumbnails">

                                                                    <?php foreach ($gallery as $g) { ?>

                                                                        <div class="provider-details__gallery-thumbnails__item">

                                                                            <img src="<?= $g['sizes']['medium']; ?>" width="<?= $g['sizes']['medium-width']; ?>" height="200" alt="<?= $g['title']; ?>">

                                                                        </div>

                                                                    <?php } ?>

                                                                </div>

                                                            <?php } else { ?>

                                                                <p style="text-align: center;"><strong>Dailyve</strong> sẽ sớm cập nhật thông tin nhà xe <?= $item['company']['name']; ?> đến quý khách. <br> <a href="tel:19000155">Liên hệ hỗ trợ</a></p>

                                                            <?php } ?>

                                                        </div>

                                                    </div>

                                                    <div id="convenience-tab-<?= $item['route']['schedules'][0]['tripCode']; ?>"

                                                        class="provider-details__tab">

                                                        <ul class="provider_details_convenience__list"></ul>

                                                        <div class="provider_details_convenience__list_2"></div>

                                                    </div>

                                                    <div id="pickup-dropoff-points-tab-<?= $item['route']['schedules'][0]['tripCode']; ?>"

                                                        class="provider-details__tab">

                                                        <div class="bus-type-title">Lưu ý</div>

                                                        <div class="header-content">Các mốc thời gian đón, trả bên dưới là thời

                                                            gian dự kiến.

                                                            Lịch này có thể thay đổi tùy tình hình thưc tế.</div>

                                                        <div class="flex flex-wrap accordion-sub-item__wrapper">

                                                            <div class="accordion-sub-item">

                                                                <h4 class="accordion-sub-item__title">Điểm đón</h4>

                                                                <ul class="accordion-sub-item__list pickup-point-list">



                                                                </ul>

                                                            </div>

                                                            <div class="accordion-sub-item">

                                                                <h4 class="accordion-sub-item__title">Điểm trả</h4>

                                                                <ul class="accordion-sub-item__list dropoff-point-list">



                                                                </ul>

                                                            </div>

                                                        </div>

                                                    </div>

                                                    <div id="policy-tab-<?= $item['route']['schedules'][0]['tripCode']; ?>"

                                                        class="provider-details__tab">

                                                        <p class="policy-title"><strong>Chính sách nhà xe</strong></p>

                                                        <div class="content-policy-container">



                                                        </div>

                                                    </div>

                                                    <div id="ratings-tab-<?= $item['route']['schedules'][0]['tripCode']; ?>"

                                                        class="provider-details__tab">

                                                        <div class="ratings-tab__average">

                                                            <span class="ratings-tab__average__point">

                                                                <i class="fas fa-star"></i>

                                                                <?= $item['company']['ratings']['overall'] ?>

                                                            </span>

                                                            <span class="ratings-tab__average__total-ratings">

                                                                <?= $item['company']['ratings']['comments'] ?>

                                                                đánh giá

                                                            </span>

                                                            <div class="ratings-tab__show-cmt__btn-wrap">

                                                                <!-- <button data-fancybox="" data-provider-id="3740"

                                                            data-src="#provider-details__comment-form"

                                                            class="ratings-tab__show-cmt__btn">Viết đnh giá</button> -->

                                                                <div class="ratings">

                                                                    <div class="empty-stars" style="font-size: 16pt;"></div>

                                                                    <div class="full-stars"

                                                                        style="width: <?= ($item['company']['ratings']['overall'] / 5) * 100; ?>%; font-size: 16pt;">

                                                                    </div>

                                                                </div>

                                                            </div>

                                                        </div>

                                                        <div class="rating-tab__cats"

                                                            id="list-rating-cats-<?= $item['route']['schedules'][0]['tripCode']; ?>">



                                                        </div>

                                                        <div class="rating-tab__comments-list"

                                                            id="comment-list-<?= $item['route']['schedules'][0]['tripCode']; ?>">



                                                        </div>

                                                        <div class="rating-tab__comments-list-pagination"

                                                            id="comment-pagination-<?= $item['route']['schedules'][0]['tripCode']; ?>">

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </li>

                                <?php } ?>

                            </ul>

                            <?php if ($data['data']['totalPages'] > 1) { ?>

                                <div class="box-load-more">

                                    <button type="button" data-current-page="1" data-total-page="<?= $data['data']['totalPages']; ?>"

                                        class="btn-load-more-route">Xem thêm chuyến</button>

                                </div>

                            <?php } ?>

                        <?php } else { ?>

                            <div class="not-fount-trip-container">

                                <div class="not__found__content">

                                    <div class="label">Xin lỗi bạn vì sự bất tin này. Dailyve sẽ cập nhật ngay khi có

                                        thông tin xe hoạt động trên tuyến đường <br>

                                        <b><span class="from-name-not"></span> đi <span class="to-name-not"></span></b> ngày <b class="route-not-date"></b>

                                    </div>

                                    <div class="content">Xin bn vui lòng thay đổi tuyến đường tìm kiếm</div>

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



<!-- END FILTER MOBILE -->

<div class="bai-viet-tuyen-duong"><?php echo do_shortcode("[baivietTuyenduongNhaXe]"); ?></div>

<div class="container" style="margin-top: -50px; margin-bottom: 30px;">

    <h2><b>Đặt vé xe Tết <?= date('Y', current_time('timestamp') + 31536000); ?></b></h2>

    <p>Thông tin về vé xe Tết <?= date('Y', current_time('timestamp') + 31536000); ?> cho tuyến đường từ <?= $data['data']['area']['from']['name']; ?> đến <?= $data['data']['area']['to']['name']; ?> hiện vẫn đang được các nhà xe cập nhật. <a href="https://dailyve.com" title="Dailyle.com">Dailyve.com</a> sẽ sớm thông báo cho các bạn thông tin chính xác và đầy đủ nhất về vé xe Tết <?= date('Y', current_time('timestamp') + 31536000); ?> bao gồm: Giá vé, lịch trình, ngày giờ bán vé của các hãng xe khách đi tuyến đường <?= $data['data']['area']['from']['name']; ?> và <?= $data['data']['area']['to']['name']; ?> ngay khi có thông tin từ các hãng xe.</p>

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

                <h3>Sắp xếp</h3>

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

                <h3>Nhà xe</h3>

            </div>

            <div class="bottom-sheet-content-body">

                <div class="company__route__list filter_bus-operator">

                    <input type="text" id="searchBoxMobile" class="input-filter"

                        placeholder="Tìm trong danh sách">

                    <div id="company-list-mobile" class="company-list-filter">



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

                <h3>Giờ đi</h3>

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

                Xóa lc

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

                            <?php foreach ($dataStatictis['data']['fromArea'] as $key => $point) { ?>

                                <label style="font-size: 14px;">

                                    <input type="checkbox" value="<?= $point['name']; ?>"

                                        <?= in_array($point['name'], $selectedFromName) ? 'checked' : ''; ?>

                                        data-name="<?= $point['name']; ?>"><?= $point['name']; ?>

                                    (<?= $point['tripCount']; ?>)

                                </label>

                            <?php } ?>

                        </div>

                    </div>

                    <div class="company__route__list filter_bus-operator" style="margin-top: 10px;">

                        <input type="text" id="searchBoxDropOffMobile" class="input-filter"

                            placeholder="Đim đến">

                        <div id="company-list-toArea-mobile" class="company-list-filter">

                            <?php foreach ($dataStatictis['data']['toArea'] as $point) { ?>

                                <label style="font-size: 14px;">

                                    <input type="checkbox" value="<?= $point['name']; ?>"

                                        <?= in_array($point['name'], $selectedToName) ? 'checked' : ''; ?>

                                        data-name="<?= $point['name']; ?>"><?= $point['name']; ?>

                                    (<?= $point['tripCount']; ?>)

                                </label>

                            <?php } ?>

                        </div>

                    </div>

                    <div class="group_style filter_bus-operator" style="margin-top: 10px;">

                        <h3>Đánh giá</h3>

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

    jQuery(document).ready(function($) {

        $("#route-exchange").on("click", function(a) {

            a.preventDefault();

            const o = $("#inputFrom").val(),

                l = $("#from").val(),

                n = $("#nameFrom").val(),

                v = $("#inputTo").val(),

                t = $("#to").val(),

                e = $("#nameTo").val();

            $("#inputFrom").val(v), $("#from").val(t), $("#nameFrom").val(e), $("#inputTo").val(o), $("#to").val(l), $("#nameTo").val(n)

        });



        jQuery(window).scroll(function() {

            var scroll_top = jQuery(window).scrollTop();

            var section_offset = jQuery('.main-vexe-content').offset().top;

            var section_height = jQuery('.main-vexe-content').innerHeight();

            var section_total = section_offset + section_height;



            if (scroll_top > section_offset && scroll_top < (section_height - section_offset - 320)) {

                jQuery('.route-fixed-left').addClass('fixed-top');

            } else {

                jQuery('.route-fixed-left').removeClass('fixed-top')

            }

        });



    });

</script>

<script>

    const urlParams = new URLSearchParams(window.location.search);

    const currentDate = new Date();

    currentDate.setDate(currentDate.getDate() + 1);

    const myParamDate = urlParams.get('date') ? urlParams.get('date') : currentDate.toLocaleDateString('vi-VN').split('/').map(part => part.padStart(2, '0')).join('-');

    const myParamReturnDate = urlParams.get('returnDate') ?? new Date().toLocaleDateString('vi-VN').split('/').map(part => part.padStart(2, '0')).join('-');



    document.getElementById('datepicker').value = myParamDate;

    const myParamNameFrom = urlParams.get('nameFrom');

    document.getElementById('datepickerReturn').value = myParamReturnDate;

    //console.log(myParamNameFrom);

    document.getElementById('nameFrom').value = myParamNameFrom;

    const myParamNameTo = urlParams.get('nameTo');

    document.getElementById('nameTo').value = myParamNameTo;



    jQuery(document).ready(function($) {

        if (jQuery('.route-not-date').length > 0) {

            jQuery('.route-not-date').text(myParamDate);

            jQuery('.from-name-not').text(document.getElementById('nameFrom').value);

            jQuery('.to-name-not').text(document.getElementById('nameTo').value);

        }

    })

</script>



<?php

get_footer();

?>