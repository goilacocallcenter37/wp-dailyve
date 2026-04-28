<?php

/**
 * Template Name: Chi tiết bến xe
 */
get_header();

$bus_station_name = get_field('bus_station_name');
$hotline = get_field('bus_station_phone') ? get_field('bus_station_phone') : '1900 0155';

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

  .bus-station-card {
    padding: 0 20px 0 0;
  }

  .trip-info {
    width: 100%;
    flex: 50%;
    height: -webkit-fill-available;
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
    flex: 25%;
    display: none;
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
    flex: 25%;
    padding: 0 16px 20px 16px;
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

  .p-mobile {
    width: 100%;
    padding: 0 16px;
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

    .trip-extra {
      display: block
    }

    .trip-price {
      padding: 0 0 16px 0px;
    }

    .p-mobile {
      padding: 0;
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

  <section class="section section-tt" id="section_627671033" style="padding-top: 30px; padding-bottom: 0;">
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
                'title' => 'Bến xe',
                'url' => home_url('/ve-xe-khach/ben-xe/')
              ),
              array(
                'title' => $bus_station_name,
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
        <div id="col-1533696486" class="col medium-4 small-12 large-4">
          <div class="col-inner">
            <div class="box-info-bus-station">
              <div class="flex justify-between items-center info-company-header">
                <h1 style="margin-bottom: 0;"><?php the_title(); ?></h1>
              </div>
              <div class="info-company-content">
                <ul>
                  <li>
                    <div class="flex items-start">
                      <img width="24" height="24" style="margin-right: 15px;" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/images/icon-location-blue.png" alt="Icon địa điểm">
                      <div>
                        <span style="font-weight: 600; margin-right: 3px;">Địa chỉ:</span> <span><?php the_field('bus_station_address'); ?></span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="flex items-start">
                      <img width="24" height="24" style="margin-right: 15px;" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/images/icon-phone-blue.png" alt="Hotline">
                      <div>
                        <span style="font-weight: 600; margin-right: 3px;">Hotline:</span> <a href="tel:<?= stringToPhone($hotline) ?>" style="color: #000000;"><?= $hotline ?></a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="info-company-footer">
                <?php the_field('bus_station_description'); ?>
              </div>
            </div>
            <?php if (get_field('bus_station_gallery')):
              $bus_station_gallery = get_field('bus_station_gallery');
            ?>
              <div class="box-gallery-company">
                <div class="slider-company-gallery">
                  <?php for ($i = 0; $i < count($bus_station_gallery); $i++) { ?>
                    <div>
                      <img class="item" style="height: 280px;" src="<?= $bus_station_gallery[$i]['sizes']['large'] ?>"
                        width="<?= $bus_station_gallery[$i]['sizes']['large-width']; ?>"
                        height="<?= $bus_station_gallery[$i]['sizes']['large-height']; ?>"
                        alt="<?= $bus_station_gallery[$i]['name']; ?>">
                    </div>
                  <?php } ?>
                </div>
              </div>
            <?php endif; ?>
          </div>
        </div>
        <div id="col-1473034489" class="col medium-8 small-12 large-8">
          <div class="col-inner">
            <h2><span class="section-title-main">Tuyến xe phổ biến từ <?php the_field('bus_station_name'); ?></span></h2>
            <section id="section-company_brand" class="scroll-company_brand">
              <?php $bus_station_routes = get_field('bus_station_routes');
              if ($bus_station_routes) { ?>
                <table class="table-bus-station">
                  <thead>
                    <tr>
                      <th>Tuyến đường</th>
                      <th>Hãng xe</th>
                      <th>Giá</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <?php foreach ($bus_station_routes as $index => $item) {
                      $company_id = get_field('company_id', $item['bus_station_company_name']);
                      if ($company_id) {
                        $url_booking = get_permalink($item['bus_station_route_name']) . '?companies=' . get_field('company_id', $item['bus_station_company_name'])['value'];
                      } else {
                        $url_booking = get_permalink($item['bus_station_route_name']);
                      }

                    ?>
                      <tr>
                        <td>
                          <div class="box-mobile-start">
                            <a class="text-mobile" href="<?php echo get_permalink($item['bus_station_company_name']); ?>" title="<?php echo get_the_title($item['bus_station_company_name']); ?>"><?= get_field('company_name', $item['bus_station_company_name']); ?></a>
                            <h3><a title="<?php echo get_the_title($item['bus_station_route_name']); ?>" href="<?php echo get_permalink($item['bus_station_route_name']); ?>" class="route-name">
                              <?php
                              $departure = get_field('routes_departure_point', $item['bus_station_route_name']);
                              $destination = get_field('routes_destination_point', $item['bus_station_route_name']);
                              if ($departure && $destination) {
                                  echo 'Xe ' . $departure['label'] . ' đi ' . $destination['label'];
                              } else {
                                  echo get_the_title($item['bus_station_route_name']);
                              }
                              ?></a></h3>
                          </div>
                        </td>
                        <td><a title="<?php echo get_the_title($item['bus_station_company_name']); ?>" href="<?php echo get_permalink($item['bus_station_company_name']); ?>"><?= get_field('company_name', $item['bus_station_company_name']); ?></a></td>
                        <td><?php echo $item['bus_station_route_price']; ?></td>
                        <td>
                          <div class="box-mobile-end">
                            <a href="tel:<?= stringToPhone($item['bus_station_route_phone'] ?: '19000155') ?>">
                              <?= $item['bus_station_route_phone'] ?: '1900 0155' ?>
                            </a>
                            <a href="<?php echo $url_booking; ?>" class="text-mobile" style="color: var(--primary-color);">
                              Đặt vé
                            </a>
                          </div>
                        </td>
                        <td>
                          <button onclick="window.open('<?php echo $url_booking; ?>', '_blank')" class="book-btn" style="margin: 0; border: none; padding: 4px 16px; text-transform: none;">
                            Đặt vé
                          </button>
                        </td>
                      </tr>
                    <?php  } ?>
                  </tbody>
                </table>
              <?php } else { ?>
                <div class="no-office-container">
                  <div class="no-office-content">
                    <img width="180" height="95" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/images/bus_banner_200.png" alt="No office locations" class="no-office-image">
                    <h3>Chưa có thông tin tuyến xe phổ biến</h3>
                    <p>Hiện tại chưa có thông tin về tuyến xe phổ biến của bến xe này. Vui lòng liên hệ hotline để được hỗ trợ.</p>
                    <a href="tel:19000155" class="hotline-button">
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
              <h2 class="section-title section-title-normal"><b></b><span class="section-title-main">Ưu đãi Dailyve.com</span><b></b></h2>
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
                  Các hãng xe hàng đầu từ <?php echo $bus_station_name; ?></span><b></b></h2>
            </div>
            <?php $bus_companies = get_field('bus_company');
            if ($bus_companies) { ?>
              <div class="list-trip">
                <?php foreach ($bus_companies as $key => $item) { ?>
                  <div class="trip-card bus-station-card">
                    <div class="trip-info flex-box-center">
                      <div style="height: 100%;">
                        <?php
                        $company_thumbnail = get_post_thumbnail_id($item['company_name']);
                        $logo_url = wp_get_attachment_url($company_thumbnail);
                        ?>
                        <img width="200" height="200" src="<?php echo $logo_url; ?>" alt="<?php echo get_the_title($item['company_name']); ?>" style="border-bottom-left-radius: 10px; border-top-left-radius: 10px; object-fit: cover; height: 100%;">
                      </div>
                      <div class="p-mobile">
                        <h3><a title="<?php echo get_the_title($item['company_name']); ?>" class="route-name" href="<?php echo get_permalink($item['company_name']); ?>"><?php echo get_the_title($item['company_name']); ?></a></h3>
                        <a style="color: #000;" href="<?php echo home_url('/dat-ve-truc-tuyen/') . '?from=' . $item['schedule_departure_point']['value'] . '&to=' . $item['schedule_destination_point']['value']; ?>" title="<?= $item['schedule_departure_point']['label']  . ' đi ' . $item['schedule_destination_point']['label']; ?>"><?= $item['schedule_departure_point']['label']  . ' đi ' . $item['schedule_destination_point']['label']; ?></a>
                      </div>
                    </div>
                    <div class="trip-extra py-4">
                      <div class="flex items-center" style="gap: 6px; margin-bottom: 10px;"><img width="24" height="24" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/images/icon-bus-black.png" alt="icon bus"> <?= $item['route_total']; ?> chuyến xe</div>
                      <div class="schedule-content"><?= $item['schedule_content']; ?></div>
                    </div>
                    <div class="trip-price py-4">
                      <?php if ($item['price']) { ?>
                        <div>
                          <div class="price">Từ <?= $item['price']; ?></div>
                        </div>
                      <?php } ?>
                      <div class="trip-actions">
                        <?php
                        if ( $item['company_name'] != 0 && 1 > 2) {
                          $url = 'https://dailyve.com/dat-ve-truc-tuyen/?from=' . $item['schedule_departure_point']['value'] . '&to=' . $item['schedule_destination_point']['value'] . '&companies=' . $item['company_name'] . '&date=';
                        } else {
                          $url = 'https://dailyve.com/dat-ve-truc-tuyen/?from=' . $item['schedule_departure_point']['value'] . '&to=' . $item['schedule_destination_point']['value'] . '&date=';
                        }
                        ?>
                        <a href="tel:<?php echo stringToPhone('1900 0155') ?>" class="call-btn" title="<?php echo $item['phone'] ?: '1900 0155' ?>"><i class="fa fa-phone"></i> <?php echo $item['phone'] ?: '1900 0155'; ?></a>
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
                  <h3>Chưa có thông tin các hãng xe</h3>
                  <p>Hiện tại chưa có thông tin các hãng xe từ <?= $bus_station_name; ?>. Vui lòng liên hệ hotline để được hỗ trợ.</p>
                  <a href="tel:19000155" class="hotline-button" title="19000155">
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
              <div class="container section-title-container" style="margin-bottom: 0px;">
                <h2 class="section-title section-title-center" style="justify-content: center;"><span class="section-title-main">Thông tin <?php echo $bus_station_name; ?></span></h2>
              </div>
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