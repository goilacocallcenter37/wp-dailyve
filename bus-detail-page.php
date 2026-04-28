<?php

/**
 * Template Name: Chi tiết nhà xe
 */
get_header();

$company_name = get_field('company_name');
$company_id = get_field('company_id') ? get_field('company_id') : 0;

$patterns = array(
  '/nhà\s*xe/i',
  '/\b(nhà|xe)\b/i'
);
$company_name = preg_replace($patterns, '', $company_name);
$company_name = trim($company_name);

?>
<style>
  .banner p {
    margin-top: 0px;
  }

  .banner form {
    margin-bottom: 0;
  }

  #text-box-1408325301 .text-box-content {
    background-color: rgb(255, 255, 255);
    border-radius: 10px;
    font-size: 100%;
  }

  #text-box-1408325301 {
    width: 90%;
  }

  .item-search button {
    height: 65px;
  }

  #add-return-date .add-return {
    height: 65px;
  }

  .section-tt::before {
    top: -10%;
  }

  .table--phone tbody>tr {
    background-color: #fff;
  }

  .list-trip {
    max-height: 846px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .trip-card {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    background: #fff;
    border: 1px solid rgba(229, 229, 229, 1);
    border-radius: 10px;
    padding: 16px 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    gap: 16px;
  }

  .trip-info {
    width: 100%;
    flex: 40%;
  }

  .trip-info h3 {
    font-size: 18px;
    font-weight: bold;
    color: #ff7a00;
    margin: 0 0 6px 0;
  }

  .trip-time {
    font-size: 14px;
    color: #555;
    margin-bottom: 8px;
  }

  .trip-location {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    margin-bottom: 5px;
  }

  .trip-location i {
    font-size: 16px;
  }

  .trip-extra {
    width: 100%;
    font-size: 14px;
    color: #444;
    flex: 30%
  }

  .trip-extra strong {
    font-weight: bold;
  }

  .trip-price {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: right;
    min-width: 160px;
    flex: 30%
  }

  .trip-price .price {
    font-size: 18px;
    font-weight: bold;
    color: #000;
    margin-bottom: 10px;
  }

  .trip-price .seat {
    font-size: 13px;
    color: #666;
  }

  .schedule-content ul li {
    margin-bottom: 0px;
  }

  /* Nút hành động */
  .trip-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  .trip-actions a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    font-size: 1em;
    border-radius: 4px;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .trip-actions .call-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    background: #eaf5ff;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
  }

  .trip-actions .call-btn:hover {
    background: #d6ebff;
  }

  .trip-actions .book-btn {
    background: var(--primary-color);
    color: #fff;
    margin: 0;
    border-radius: 4px;
  }

  .trip-actions .book-btn:hover {
    background: #005ec4;
  }


  @media (min-width: 550px) and (max-width: 849px) {
    #text-box-1408325301 {
      width: 100%;
    }

    #banner-644105022 {
      padding-top: 500px;
    }
  }

  @media (min-width: 850px) {
    #text-box-1408325301 {
      width: 60%;
    }

    #banner-644105022 {
      padding-top: 500px;
    }
  }

  @media (min-width: 1080px) {
    #text-box-1408325301 {
      width: 98%;
    }
  }

  #banner-644105022 {
    padding-top: 380px;
    z-index: 2;
  }

  .banner h4 {
    padding-left: .5rem;
    padding-right: .5rem;
    font-size: 1.1em;
  }
</style>
<div id="content" role="main" class="content-area">
  <div class="banner has-hover" id="banner-644105022">
    <div class="banner-inner fill">
      <div class="banner-bg fill">
        <img fetchpriority="high" width="950" height="682" src="/wp-content/uploads/2025/08/banner_bus_detail.png" class="bg attachment-large size-large lazyloaded" alt="<?php the_title(); ?>">
      </div>

      <div class="banner-layers container">
        <div class="fill banner-link"></div>
        <div id="text-box-1408325301" class="text-box banner-layer x50 md-x50 lg-x50 y50 md-y50 lg-y50 res-text">
          <div class="text-box-content text box-shadow-3">
            <div class="text-inner">
              <div class="form-search-nhaxe">
                <div class="title-form text-center">Tìm vé xe khách</div>
                <div class="content-form">
                  <?php echo do_shortcode('[bmd_old_search_form]'); ?>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <section class="section section-tt" id="section_627671033" style="padding-top: 30px;">
    <div class="section-bg fill"></div>
    <div class="section-content relative">
      <div class="row" id="row-2029692902">
        <div class="col medium-12 small-12 large-12" style="padding-bottom: 0;">
          <div class="col-inner">
            <?php
            $current_title = get_the_title();
            $breadcrumbs = array(
              array(
                'title' => 'Dailyve',
                'url' => home_url('/')
              ),
              array(
                'title' => 'Vé xe khách',
                'url' => home_url('/ve-xe-khach/')
              ),
              array(
                'title' => 'Nhà xe',
                'url' => home_url('/ve-xe-khach/nha-xe/')
              ),
              array(
                'title' => $company_name,
                'url' => ''
              )
            );
            ?>

            <ul class="breadcrumb">
              <?php foreach ($breadcrumbs as $index => $crumb): ?>
                <?php if ($index < count($breadcrumbs) - 1): ?>
                  <li>
                    <a href="<?php echo $crumb['url']; ?>">
                      <?php echo $crumb['title']; ?>
                    </a>
                  </li>
                <?php else: ?>
                  <li aria-current="page">
                    <?php echo $crumb['title']; ?>
                  </li>
                <?php endif; ?>
              <?php endforeach; ?>
            </ul>

          </div>
        </div>
        <div id="col-1533696486" class="col medium-5 small-12 large-5">
          <div class="col-inner">
            <div class="box-info-company">
              <div class="flex justify-between items-center info-company-header">
                <h1><?php the_title(); ?></h1>
                <div class="flex info-company-review">
                  <div class="flex items-center" style="gap: 6px;">
                    <span>4.5</span>
                    <i class="fas fa-star"></i>
                  </div>
                  <span style="padding-bottom: 4px; color: var(--fs-color-primary); font-size: 12px;">(200 lượt đánh giá)</span>
                </div>
              </div>
              <div class="info-company-content">
                <ul>
                  <li>
                    <div class="flex items-center">
                      <img width="24" height="24" style="margin-right: 15px;" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/images/icon-check-blue.png" alt="Icon chắc chắn có chỗ">
                      <span style="font-weight: 600;">Chắc chắn có chỗ</span>
                    </div>
                  </li>
                  <li>
                    <div class="flex items-center">
                      <img width="24" height="24" style="margin-right: 15px;" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/images/icon-location-blue.png" alt="Icon địa điểm">
                      <span style="font-weight: 600;">Cho phép theo dõi hành trình xe</span>
                    </div>
                  </li>
                  <li>
                    <div class="flex items-center">
                      <img width="24" height="24" style="margin-right: 15px;" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/images/icon-hotline-blue.png" alt="Icon hỗ trợ 24/7">
                      <span style="font-weight: 600;">Hỗ trợ 24/7</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="info-company-footer">
                <div class="info-company-content__seemore">
                  <a href="#lo-trinh-thoi-gian-dat-xe" title="Xem giá & lịch chạy">Xem giá & lịch chạy</a>
                </div>
              </div>
            </div>
            <?php if (get_field('company_gallery')):
              $company_gallery = get_field('company_gallery');
            ?>
              <div class="box-gallery-company">
                <div class="slider-company-gallery">
                  <?php for ($i = 0; $i < count($company_gallery); $i++) { ?>
                    <div>
                      <img class="item" src="<?= $company_gallery[$i]['sizes']['large'] ?>"
                        width="<?= $company_gallery[$i]['sizes']['large-width']; ?>"
                        height="<?= $company_gallery[$i]['sizes']['large-height']; ?>"
                        alt="<?= $company_gallery[$i]['name']; ?>">
                    </div>
                  <?php } ?>
                </div>
              </div>
            <?php endif; ?>
          </div>
        </div>
        <div id="col-1473034489" class="col medium-7 small-12 large-7">
          <div class="col-inner">
            <h2><span class="section-title-main">Số điện thoại - Địa chỉ <?php the_field('company_name'); ?></span></h2>
            <section id="section-company_brand" class="scroll-company_brand">
              <?php $company_brands = get_field('company_brand');
              if ($company_brands) {
                foreach ($company_brands as $index => $item) { ?>

                  <table class="table--phone">
                    <thead>
                      <tr>
                        <th class="route--title" colspan="3">
                          <h3><?= $item['company_brand_name'] ?></h3>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <?php if ($item['company_brand_office']) {
                        foreach ($item['company_brand_office'] as $key => $office) {
                      ?>
                          <tr>
                            <td class="route--title">
                              <section><?= $office['company_brand_office_name'] ?></section>
                              <section><?= $office['company_brand_office_address'] ?></section>
                              <?php // if ($office['company_brand_office_routes']) { 
                              ?>
                              <!-- <div class="popover"><button class="popover__trigger">Chọn chuyến</button>
                                  <ul class="popover__menu">
                                    <?php // foreach ($office['company_brand_office_routes'] as $key2 => $route) { 
                                    ?>
                                      <li class="popover__menu-item">
                                        <button class="booking-dailyve-route" data-link="https://dailyve.com/dat-ve-truc-tuyen/?from=<?php // $route['routes_departure_point']['value'] 
                                                                                                                                      ?>&to=<?php // $route['routes_destination_point']['value'] 
                                                                                                                                            ?>&date=" data-datepicker="dailyve_calendar_route_<?php // $index . '-' . $key . '-' . $key2 
                                                                                                                                                                                              ?>">
                                          <?php // $route['routes_departure_point']['label']; 
                                          ?> đi <?php // $route['routes_destination_point']['label']; 
                                                ?>
                                          <input type="text" class="dailyve_calendar" name="dailyve_calendar_route_<?php // $index . '-' . $key . '-' . $key2 
                                                                                                                    ?>">
                                        </button>
                                      </li>
                                    <?php // } 
                                    ?>
                                  </ul>
                                </div> -->
                              <?php // } 
                              ?>
                            </td>
                            <td class="route--phone">
                              <section>
                                <?php if ($office['company_brand_office_phone_list']) {
                                  if ($key == 0) {
                                      echo '<a href="tel:19000155" title="19000155"><i class="fas fa-phone"></i><span>1900 0155</span></a>';
                                  }
                                  foreach ($office['company_brand_office_phone_list'] as $phone) {
                                ?>
                                    <a href="tel:<?= formatPhoneNumber($phone['company_brand_office_phone']) ?>" title="<?= formatPhoneNumber($phone['company_brand_office_phone']) ?>"><i class="fas fa-phone"></i><span><?= $phone['company_brand_office_phone'] ?></span></a>
                                <?php }
                                }
                                ?>
                              </section>
                            </td>
                          </tr>
                      <?php }
                      }
                      ?>
                    </tbody>
                  </table>
                <?php  }
              } else { ?>
                <div class="no-office-container">
                  <div class="no-office-content">
                    <img width="180" height="95" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/images/bus_banner_200.png" alt="No office locations" class="no-office-image">
                    <h3>Chưa có thông tin văn phòng</h3>
                    <p>Hiện tại chưa có thông tin về văn phòng của nhà xe này. Vui lòng liên hệ hotline để được hỗ trợ.</p>
                    <a href="tel:19000155" class="hotline-button" title="19000155">
                      <i class="fas fa-phone"></i>
                      Gọi 1900.0155
                    </a>
                  </div>
                </div>
              <?php } ?>
            </section>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section-tt2" id="section_167006909" style="padding-bottom: 0;">
    <div class="section-bg fill"></div>
    <div class="section-content relative">
      <div class="row" id="row-1499123619">
        <div id="col-1479446990" class="col small-12 large-12">
          <div class="col-inner">
            <div class="container section-title-container">
              <h2 class="section-title section-title-normal"><b></b><span class="section-title-main">Ưu đãi nhà xe <?php echo $company_name; ?> khi đặt vé tại Dailyve.com</span><b></b></h2>
            </div>
            <?php echo do_shortcode('[category_posts category_id="32" posts_per_page=10]'); ?>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="section" id="lo-trinh-thoi-gian-dat-xe" style="padding-top: 0px; padding-bottom: 0px;">
    <div class="section-bg fill"></div>
    <div class="section-content relative">
      <div class="row" id="row-1499123620">
        <div id="col-1479446920" class="col small-12 large-12">
          <div class="col-inner">
            <div class="container section-title-container">
              <h2 class="section-title section-title-normal"><b></b><span class="section-title-main">
                  <?php echo $company_name; ?> - Lộ trình & thời gian đặt xe </span><b></b></h2>
            </div>
            <?php $driving_schedules = get_field('driving_schedule');
            if ($driving_schedules) { ?>
              <div class="list-trip">
                <?php foreach ($driving_schedules as $key => $item) { ?>
                  <div class="trip-card">
                    <div class="trip-info">
                      <h3><?= $item['route_name']; ?></h3>
                      <div class="trip-location"><i class="fa fa-map-marker-alt" style="color:#1d9bf0"></i><?= $item['schedule_departure_point']['label']; ?></div>
                      <div class="trip-location"><i class="fa fa-map-marker-alt" style="color:#ff3b30"></i><?= $item['schedule_destination_point']['label']; ?></div>
                    </div>
                    <div class="trip-extra">
                      <div class="flex items-center" style="gap: 6px; margin-bottom: 10px;"><img width="24" height="24" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/images/icon-bus-black.png" alt="icon bus"> <?= $item['route_total'] > 0 ? $item['route_total'] : 'Đang cập nhật'; ?> chuyến xe</div>
                      <?php if(!empty($item['schedule_content'])) { ?>
                      <div class="schedule-content"><?= $item['schedule_content']; ?></div>
                      <?php } ?>
                    </div>
                    <div class="trip-price">
                      <?php if ($item['price']) { ?>
                        <div>
                          <div class="price">Từ <?= $item['price']; ?></div>
                          <!-- <div class="seat">Còn 40 chỗ trống</div> -->
                        </div>
                      <?php } ?>
                      <div class="trip-actions">
                        <?php
                        if ($company_id != 0) {
                          $url = 'https://dailyve.com/dat-ve-truc-tuyen/?from=' . $item['schedule_departure_point']['value'] . '&to=' . $item['schedule_destination_point']['value'] . '&companies=' . $company_id['value'] . '&date=';
                        } else {
                          $url = 'https://dailyve.com/dat-ve-truc-tuyen/?from=' . $item['schedule_departure_point']['value'] . '&to=' . $item['schedule_destination_point']['value'] . '&date=';
                        }
                        ?>
                        <a href="tel:19000155" class="call-btn" alt="19000155"><i class="fa fa-phone"></i> 1900.0155</a>
                        <button class="book-btn book-dailyve-btn" data-link="<?= $url ?>" data-datepicker="dailyve_calendar_route_<?= $key; ?>-ttt">Đặt vé</button>
                        <input type="text" class="dailyve_calendar" name="dailyve_calendar_route_<?= $key; ?>-ttt">
                      </div>
                    </div>
                  </div>
                <?php } ?>
              </div>
            <?php } else { ?>
              <div class="no-office-container">
                <div class="no-office-content">
                  <img width="180" height="95" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/images/bus_banner_200.png" alt="No office locations" class="no-office-image">
                  <h3>Chưa có thông tin lộ trình & thời gian đặt xe</h3>
                  <p>Hiện tại chưa có thông tin về lộ trình & thời gian đặt xe <?= $company_name; ?>. Vui lòng liên hệ hotline để được hỗ trợ.</p>
                  <a href="tel:19000155" class="hotline-button">
                    <i class="fas fa-phone"></i>
                    Gọi 1900.0155
                  </a>
                </div>
              </div>
            <?php } ?>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="section_167006930">
    <div class="section-bg fill"></div>
    <div class="section-content relative">
      <div class="row" id="row-1499123630">
        <div id="col-1479446930" class="col small-12 large-12">
          <div class="col-inner">
            <div class="box-content-company">
              <div class="single-page seemore_content content-table">
                <?php the_content(); ?>
              </div>
              <div class="text-center">
                <button class="seemore_toggle" href="#">Xem thêm <i class="fas fa-chevron-down"></i></button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</div>

<?php
get_footer();
?>
<script src="<?= get_stylesheet_directory_uri() . '/assets/js/autocompleteSearchForm.js' ?>"></script>
<script>
  function initializePopovers() {
    var popovers = document.querySelectorAll('.popover');
    var popoverTriggers = document.querySelectorAll('.popover__trigger');

    for (var i = 0; i < popoverTriggers.length; i++) {
      popoverTriggers[i].addEventListener('click', function(event) {
        closeAllOthers(this.parentElement);
        this.parentElement.classList.toggle('popover--active');
      });
    }

    function closeAllOthers(ignore) {
      for (var i = 0; i < popovers.length; i++) {
        if (popovers[i] !== ignore) {
          popovers[i].classList.remove('popover--active');
        }
      }
    }
  }

  initializePopovers();
</script>