<?php



$replacements = [
    '{nha_xe}' => get_field('company_name'),
    '{khoang_gia}' => get_field('company_price_approx'),
    '{link_nha_xe}' => '<a href="' . esc_url(get_permalink()) . '">' . esc_url(get_permalink()) . '</a>',
    '{site_url}' => '<a href="' . home_url() . '">' . home_url()  . '</a>',
    '{tuyen_duong}' => get_field('company_routes'),
];

$companyId = 0;

$dataListRating = [];

// $postId = get_the_ID();

if (get_field('company_id')) {

    $company = get_field('company_id');

    $companyId = $company['value'];

    $urlOverRating = endPoint . "/Api/Company/Info?companyId=" . $companyId;

    $responseOverRating = call_api_with_token_agent($urlOverRating, 'GET');



    $urlRating = endPoint . "/Api/Company/Reviews?companyId=$companyId&page=1&pageSize=1&ratingMin=1&ratingMax=5";

    $responseRating = call_api_with_token_agent($urlRating, 'GET');



    if (!is_wp_error($responseOverRating)) {

        $dataListOverview = json_decode(wp_remote_retrieve_body($responseOverRating), true);

    } else {

        $dataListOverview = [];

    }



    if (!is_wp_error($responseRating)) {

        $dataListRating = json_decode(wp_remote_retrieve_body($responseRating), true);

    }

}



//$company = ''; //không chuyển hướng sang trang đặt vé nhà xe



?>

<link href="https://unpkg.com/tachyons@4.10.0/css/tachyons.min.css" rel="stylesheet">

<style>

    h1 {

        font-size: 1.7em;

        margin: 0;

    }



    #Info {

        display: none !important;

    }

</style>

<div id="content" class="blog-wrapper blog-single page-wrapper single-post">

    <div style="margin-bottom: 10px;">

        <div class="row">

            <div class="col search-form-col large-12">

                <div class="coi-inner">

                    <?php //echo do_shortcode('[bmd_search]'); ?>

                    <div id="Info" class="w-100" style="color: var(--fs-color-success);">

                        <div class="pb3 tc-l tl f4 w-100 ttn"><b id="fromName"></b> Đến <b id="toName"></b></div>

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

                                            <input id="inputTo" class="input-search-form w-100" type="text" placeholder="Chọn Điểm Đến" />

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

                                    <label for="datepickerReturn" class="relative row-search add-return" style="margin-bottom: 0;">

                                        <div>

                                            <i class="fas fa-plus"></i>

                                        </div>

                                        <p style="margin-bottom: 0;">Thêm ngày về</p>

                                    </label>

                                    <div class="relative row-search date-return hidden">

                                        <img class="img-form-search" src="/wp-content/uploads/assets/images/calendar.png" />

                                        <div class="col-search">

                                            <label>Ngày Về</label>

                                            <input id="datepickerReturn" class="input-search-form w-100" name="returnDateTemp" type="text" placeholder="Chọn ngày về" />

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

            </div>

        </div>

    </div>

    <div class="row">

        <div class="post-sidebar large-4 col">

            <div class="coi-inner is-sticky-column is-affixed">

                <div class="is-sticky-column__inner">

                    <aside class="">

                        <div class="breadcrumb">

                            <a href="/">Dailyve.com</a> > <a href="<?php the_permalink();  ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a>

                        </div>

                        <ul>

                            <?php dynamic_sidebar('sidebar-nhaxe');  ?>

                            <li>

                                <div class="bus-provider-box">

                                    <article style="margin-bottom: 20px;">

                                        <h1 class="company-name"><?php the_title(); ?></h1>

                                        <?php if (get_field('company_address')) { ?>

                                            <h2 class="company-address">Trụ sở: <?= get_field('company_address'); ?></h2>

                                        <?php } ?>

                                        <?php if (get_field('company_id')) {

                                            $company = get_field('company_id');



                                            if (count($dataListOverview) > 0) {



                                                $totalReview = !empty($dataListOverview['data']['overall']['totalReviews']) ? $dataListOverview['data']['overall']['totalReviews'] : 0;

                                                $countStar = (float) $dataListOverview['data']['overall']['rvMainValue'] ?? 0;

                                                $width = $countStar / 5 * 100;

                                        ?>

                                                <div class="resuilt-rating">

                                                    <div class="ratings">

                                                        <div class="empty-stars" style="font-size: 15pt;"></div>

                                                        <div class="full-stars" style="width: <?= $width ?>%; font-size: 15pt;">

                                                        </div>

                                                    </div>

                                                    <span>(<?= $totalReview; ?>)</span>

                                                </div>

                                        <?php }

                                        } ?>

                                    </article>

                                    <?php if (get_field('company_gallery')):

                                        $company_gallery = get_field('company_gallery');
                                    ?>

                                        <div class="slick-loading-spinner">

                                            <ul class="o-vertical-spacing o-vertical-spacing--l" style="width: 100%;">

                                                <li class="blog-post o-media">

                                                    <div class="o-media__figure" style="width: 100%;">

                                                        <span class="skeleton-box" style="width:100%;height:200px;"></span>

                                                    </div>

                                                </li>

                                            </ul>

                                        </div>

                                        <div class="bus-provider-box__slide">

                                            <div class="slider-for-gallery">

                                                <?php for ($i = 0; $i < count($company_gallery); $i++) { ?>

                                                    <div>

                                                        <img src="<?= $company_gallery[$i]['sizes']['large'] ?>"

                                                            width="<?= $company_gallery[$i]['sizes']['large-width']; ?>"

                                                            height="<?= $company_gallery[$i]['sizes']['large-height']; ?>"

                                                            alt="<?= $company_gallery[$i]['name']; ?>">

                                                    </div>

                                                <?php } ?>

                                            </div>

                                            <div class="slider-nav-gallery">

                                                <?php for ($i = 0; $i < count($company_gallery); $i++) { ?>

                                                    <div>

                                                        <img src="<?= $company_gallery[$i]['sizes']['thumbnail']; ?>"

                                                            width="<?= $company_gallery[$i]['sizes']['thumbnail-width'] ?>"

                                                            height="<?= $company_gallery[$i]['sizes']['thumbnail-height'] ?>"

                                                            alt="<?= $company_gallery[$i]['name'] ?>">

                                                    </div>

                                                <?php } ?>

                                            </div>

                                        </div>

                                    <?php endif; ?>



                                    <?php if (get_field('provider-name')): ?>

                                        <div class="bus-provider-box__name"><?php the_field('provider-name'); ?></div>

                                    <?php endif; ?>



                                    <?php if (get_field('provider-address') || get_field('provider-website')): ?>

                                        <ul class="bus-provider-box__list">

                                            <?php if (get_field('provider-address')): ?>

                                                <li class="bus-provider-box__address"><?php the_field('provider-address'); ?></li>

                                            <?php endif; ?>

                                        </ul>

                                    <?php endif; ?>



                                    <?php if (get_field('provider-map')): ?>

                                        <div class="bus-provider-box__map">

                                            <?php the_field('provider-map'); ?>

                                        </div>

                                    <?php endif; ?>



                                    <?php if (get_field('provider-guide')): ?>

                                        <div class="bus-provider-box__nav">

                                            <div class="bus-provider-box__nav__item bus-provider-box__phone">

                                                <a href="tel:19000179">Gọi điện thoại</a>

                                            </div>

                                            <div class="bus-provider-box__nav__item bus-provider-box__guide">

                                                <a href="<?php the_field('provider-guide'); ?>" rel="nofollow" target="_blank">Chỉ đường</a>

                                            </div>

                                        </div>

                                    <?php endif; ?>



                                </div>

                            </li>

                        </ul>

                        <ul class="toc-list" id="toc" data-toc="#content-about" data-toc-headings="h2,h3"></ul>

                    </aside>

                </div>

            </div>

        </div>

        <div class="col large-8"> <!-- medium-col-first -->

            <div class="col-inner">

                <div class="box-uu-dai">

                    <?= do_shortcode('[block id="slide-uu-dai"]'); ?>

                </div>

                <a href="">

                    <h2 class="dailyve-title-war">

                        Dailyve - Cam kết hoàn 150% nếu nhà xe không giữ vé <img style="width: 17px; margin-left: 2px;" src="/wp-content/uploads/assets/images/exclamation-mark.png" alt="exclamation-mark">

                    </h2>

                </a>



                <!-- TUYẾN NỔI BẬT -->



                <div id="content-route-future">



                </div>



                <!-- COMPANY DETAIL TAB -->



                <div class="company-detail-container">

                    <div class="company-detail-tabs">

                        <ul class="company-navs">

                            <li data-tab="phone-tab" class="active">Số điện thoại - địa chỉ</li>

                            <li data-tab="about-tab">Giới thiệu</li>

                            <li data-tab="schedule-tab">Lịch trình xe chạy</li>

                            <!-- <li data-tab="reviews-tab">Đánh giá nhà xe</li> -->

                            <li data-tab="tet-tab">Đặt vé xe tết</li>

                        </ul>

                    </div>

                    <div class="company-detail-content">

                        <div id="phone-tab" class="company-details__tab active">

                            <div class="content-table2">

                                <h2

                                    class="dailyve-title-company"

                                    id="<?php $idText = 'Địa chỉ, số điện thoại nhà ' . get_field('company_name');

                                        echo str_replace(' ', '_', $idText); ?>">

                                    Địa chỉ, số điện thoại nhà <?php the_field('company_name'); ?>

                                </h2>

                                <section id="section-company_brand"></section>

                            </div>

                        </div>

                        <div id="about-tab" class="company-details__tab">

                            <div class="content" id="content-about">

                                <?php the_content(); ?>

                            </div>

                        </div>

                        <div id="schedule-tab" class="company-details__tab">

                            <!-- <section id="section-company_price_list">



                            </section>

                            <div id="paginate_company_price_list" style="margin-top: 16px;"></div> -->

                            <?php

                            $schedules_content = get_field('schedule');
                            // var_dump( $schedules_content );
                            if ($schedules_content) {

                            ?>

                                <div class="box-schedule-table">

                                    <h2 class="dailyve-title-company">

                                        Lịch trình xe chạy mới nhất tháng <?= date('m'); ?> năm <?= date('Y'); ?>

                                    </h2>

                                    <?php

                                    $content = '[accordion auto_open="true"]';

                                    foreach ($schedules_content as $schedule) {

                                        $content .= '[accordion-item title="' . $schedule['schedule_name'] . '"]';

                                        $content .= $schedule['schedule_content'];

                                        $content .= '[/accordion-item]';

                                    }



                                    $content .= '[/accordion]';

                                    echo do_shortcode($content);

                                    ?>

                                </div>

                            <?php } ?>

                        </div>

                        <div id="reviews-tab" class="company-details__tab">

                            <!-- REVIEW NHÀ XE -->

                            <?php if (get_field('company_id') || count($dataListRating) > 0) { ?>

                                <div class="section-rating">

                                    <?php if (count($dataListOverview) > 0) { ?>

                                        <div class="overView__container">

                                            <div class="overView__header-rating-left text-title-base">Đánh giá nhà xe</div>

                                            <div class="overView__header-rating-right">

                                                <p><?= $dataListOverview['data']['overall']['rvMainValue'] ?? 0; ?></p>

                                                <img src="/wp-content/uploads/assets/images/star.svg" alt="icon star">

                                            </div>

                                        </div>

                                        <div class="overView__container-categories">

                                            <?php foreach ($dataListOverview['data']['rating'] as $item) {

                                                $width = ((float) $item['rvMainValue'] / 5) * 100;

                                            ?>

                                                <div class="rating-tab__cat" style="padding: 0; width: 31.5%;">

                                                    <div class="rating-tab__cat-name">

                                                        <p><?= $item['label'] ?></p>

                                                        <p style="font-weight: bold;"><?= $item['rvMainValue'] ?></p>

                                                    </div>

                                                    <div class="rating-tab__progress__wrap">

                                                        <div class="rating-tab__progress__bar" style="width: 100%;">

                                                            <div style="width: <?= $width ?>%;" class="rating-tab__progress__bar-fill"></div>

                                                        </div>

                                                    </div>

                                                </div>

                                            <?php } ?>

                                        </div>

                                        <?php if (count($dataListRating) > 0 && 1 > 2) { ?>

                                            <div class="comment__review-detail-container">

                                                <div class="text-title-base">Chi tiết đánh giá</div>

                                                <div>

                                                    <div class="list-comment__reviews-container">

                                                        <?php if (!empty($dataListRating) && is_array($dataListRating)) {

                                                            foreach ($dataListRating['data']['items'] as $item) {

                                                                $dateString = !empty($item['tripDate']) ? date('d-m-Y', strtotime($item['tripDate'])) : "";

                                                                $widthStart = ((int) $item['rating'] / 5) * 100;

                                                        ?>

                                                                <div class="rating-tab__comments-list__item">

                                                                    <div class="rating-tab__comments-list__item-personal__info">

                                                                        <?php if (!empty($item['socialAvatar'])) { ?>

                                                                            <div class="rating-tab__comments-list__item-personal_social-avatar"><img src="<?= $item['socialAvatar'] ?>" alt="<?= $item['name'] ?>"></div>

                                                                        <?php } else { ?>

                                                                            <div class="rating-tab__comments-list__item-personal__info-avatar"><?= getInitialsNameToAvatar($item['name']) ?></div>

                                                                        <?php } ?>

                                                                        <div class="rating-tab__comments-list__item-personal__info-name">

                                                                            <?= $item['name']; ?>

                                                                            <div class="rating-tab__comments-list__item-personal__info-star">

                                                                                <div class="ratings">

                                                                                    <div class="empty-stars" style="font-size: 12pt;"></div>

                                                                                    <div class="full-stars" style="width: <?= $widthStart ?>%; font-size: 12pt;"></div>

                                                                                </div>

                                                                            </div>

                                                                        </div>

                                                                    </div>

                                                                    <div class="rating-tab__comments-list__item-content"><?= $item['comment'] ?></div>

                                                                    <?php // if (count($item['images']) > 0) { 

                                                                    ?>

                                                                    <!-- <div class="rating-tab__comments-list__item-gallery"> -->

                                                                    <?php // foreach ($item['images'] as $key => $value) { 

                                                                    ?>

                                                                    <!-- <div class="rating-tab__comments-list__item-gallery__img"> -->

                                                                    <!-- <a data-fancybox="" href="<?php // $value 

                                                                                                    ?>" rel="nofollow">

                                                                                        <img

                                                                                            data-lazyloaded="1"

                                                                                            src="<?php // $value 

                                                                                                    ?>"

                                                                                            class="attachment-large size-large entered litespeed-loaded" alt="gallery">

                                                                                    </a> -->

                                                                    <!-- </div> -->

                                                                    <?php // } 

                                                                    ?>

                                                                    <!-- </div> -->

                                                                    <?php // } 

                                                                    ?>

                                                                    <?php if (!empty($dateString)) { ?>

                                                                        <div class="rating-tab__comments-list__item-depart-date">

                                                                            <p>Đi ngày <?= $dateString ?></p>

                                                                            <div><i class="fas fa-check-circle"></i></div>

                                                                            <p class="verified">Đã mua vé</p>

                                                                        </div>

                                                                    <?php } ?>

                                                                    <?php if (count($item['companyReply']) > 0) { ?>

                                                                        <div class="rating-tab__comments-list__comment-reply">

                                                                            <?php foreach ($item['companyReply'] as $reply) { ?>

                                                                                <div class="item-comment-reply">

                                                                                    <div class="comment-title">

                                                                                        <p class="comment-reply-title">Phản hồi của nhà xe</p>

                                                                                    </div>

                                                                                    <div class="comment-content">

                                                                                        <p class="comment-reply-content"><?php $reply['content'] ?></p>

                                                                                    </div>

                                                                                </div>

                                                                            <?php } ?>

                                                                        </div>

                                                                    <?php } ?>

                                                                </div>

                                                        <?php }

                                                        } ?>

                                                    </div>

                                                    <div class="rating-tab__comments-list-pagination" id="comment-pagination-detail" style="margin-top: 16px;"></div>

                                                </div>

                                                <div class="show-all-reviews__Container">

                                                    <div class="btn-show-all">

                                                        <div>Xem tất cả <?= $dataListRating['data']['total']; ?> đánh giá</div>

                                                    </div>

                                                </div>

                                            </div>

                                        <?php } ?>

                                    <?php } ?>

                                </div>

                            <?php } else {

                                echo '<p class="text-center" style="padding: 20px 0;">Chưa có đánh giá</p>';

                            } ?>

                        </div>

                        <div id="tet-tab" class="company-details__tab">

                            <div class="">

                                <h2 style="font-size: 20px; margin-bottom: 10px;">Đặt vé xe Tết <?= date('Y', current_time('timestamp') + 31536000); ?> của <?php the_field('company_name'); ?> vào ngày <?php echo date('d/m/Y'); ?></h2>

                                <div>

                                    Vé xe tết <?= date('Y', current_time('timestamp') + 31536000); ?> của hãng <?php the_field('company_name'); ?> vẫn chưa được công bố. Dailyve.com sẽ sớm thông báo cho các bạn thông tin <a href="/">vé xe Tết <?= date('Y', current_time('timestamp') + 31536000); ?> </a> bao gồm giá vé, lịch trình, ngày giờ bán vé của <?php the_field('company_name'); ?> đi các tuyến đường <?= the_field('company_routes'); ?> ngay khi có thông tin từ hãng xe.

                                </div>

                            </div>

                        </div>

                    </div>

                </div>



                <!-- COMPANY Q&A -->

                <div id="main-content">

                    <?php

                    // $qa_nha_xe = get_field('qa_company', 'option');

                    if (!empty($qa_nha_xe) && 1 > 2) { ?>

                        <div class="company-qa-container">

                            <h2 class="dailyve-title-company">Những câu hỏi thường gặp về nhà <?= the_field('company_name'); ?></h2>

                            <div class="vivu-faq">

                                <div class="vivu-faq__title">

                                    Những câu hỏi thường gặp về nhà <?= the_field('company_name'); ?> </div>

                                <div class="vivu-faq__content">

                                    <?php foreach ($qa_nha_xe as $qa) {

                                        $qa['question'] = str_replace(array_keys($replacements), array_values($replacements), $qa['question']);

                                        $qa['answer'] = str_replace(array_keys($replacements), array_values($replacements), $qa['answer']);

                                    ?>

                                        <div class="vivu-faq__q vivu-faq__item">

                                            <p>Câu hỏi: <?= $qa['question']; ?></p>

                                        </div>

                                        <div class="vivu-faq__a vivu-faq__item">

                                            <p>Trả lời: <?= $qa['answer']; ?></p>

                                        </div>

                                    <?php } ?>

                                </div>

                            </div>

                        </div>

                    <?php } ?>



                    <?php if (count($dataListRating) > 0 && count($dataListOverview) && 1 > 2) { ?>

                        <div class="company-reating-review-container">

                            <h2 class="dailyve-title-company">Review, đánh giá chất lượng <?= the_field('company_name') ?></h2>

                            <p>Nhà xe được đánh giá với số điểm trung bình là <?= isset($dataListOverview['data']['overall']['rvMainValue']) ? $dataListOverview['data']['overall']['rvMainValue'] : 0; ?>/5 dựa trên <?= $dataListRating['data']['total']; ?> đánh giá của khách hàng đã trải nghiệm dịch vụ của nhà xe này,</p>

                        </div>

                    <?php } ?>



                    <!-- SCHEDULE ROUTE ACTIVE -->



                    <!-- <div class="trip-content-container" id="driving-schedule-content">



                    </div> -->



                    <!-- THONG TIN LICH TRINH -->

                    <!-- <div class="vivu-tbl" id="content-table-schedule">



                    </div> -->



                    <!-- BANG GIA NHA XE -->



                </div>

            </div>

        </div>

    </div>

</div>



<script src="<?= get_stylesheet_directory_uri() . '/assets/js/autocompleteSearchForm.js' ?>"></script>

<script>

    jQuery(document).ready(function($) {



        <?php if (count($dataListRating) > 0) { ?>

            $('.btn-show-all').click(function() {

                jQuery('.show-all-reviews__Container').remove();

                jQuery('#comment-pagination-detail').twbsPagination({

                    totalPages: parseInt('<?= $dataListRating['data']['total'] ?>'),

                    visiblePages: 6,

                    prev: false,

                    next: false,

                    startPage: 1,

                    onPageClick: function(event, page) {

                        jQuery.ajax({

                            url: '<?= admin_url('admin-ajax.php') ?>',

                            type: 'GET',

                            data: {

                                action: "get_review_ajax_company",

                                companyId: '<?= $companyId ?>',

                                page: page

                            },

                            beforeSend: function() {

                                jQuery('.comment__review-detail-container')[0].scrollIntoView({

                                    behavior: 'smooth'

                                });

                                jQuery('.list-comment__reviews-container').html('<div class="warrap-loader"><span class="loader"></span></div>');

                            },

                            success: function(response) {

                                const dataJson = JSON.parse(response);

                                if (dataJson.html) {

                                    jQuery('.list-comment__reviews-container').html(dataJson.html);

                                } else {



                                }

                                jQuery('.warrap-loader').remove();



                            },

                            error: function(xhr, status, error) {

                                console.error('Error loading comments:', error);

                                jQuery('.warrap-loader').remove();

                            }

                        });



                    }

                });

            });



        <?php } ?>



        // document.addEventListener('click', function(e) {



        //     if (e.target.matches('.toc-item')) {

        //         const targetId = e.target.getAttribute('href').substring(1);

        //         const targetElement = document.getElementById(targetId);



        //         if (targetElement && targetElement.style.display === 'none') {

        //             targetElement.style.display = 'block';

        //             targetElement.scrollIntoView({

        //                 behavior: 'smooth'

        //             });

        //             setTimeout(() => {

        //                 targetElement.style.display = 'none';

        //             }, 1000);

        //         }

        //     }

        // });

    })

</script>