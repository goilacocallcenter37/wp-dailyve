<?php
global $wp;
$today = date_create(date('Y-m-d'));
$today_filter = date_create(date('Y-m-d'));
date_sub($today, date_interval_create_from_date_string('1 day'));
$updated_date = date_format($today, 'd-m-Y');
$dataStatictis = $dataStatictis ?? [];
date_add($today_filter, date_interval_create_from_date_string('1 day'));
$current_url = home_url($wp->request);
$next_date = date_format($today_filter, 'd-m-Y');

$filter_url = add_query_arg('date', $next_date, $current_url);

function dailyve_normalize_string($str)
{
  if (!$str) return '';
  $unicode = [
    'a' => 'á|à|ả|ã|ạ|ă|ắ|ặ|ằ|ẳ|ẵ|â|ấ|ầ|ẩ|ẫ|ậ',
    'd' => 'đ',
    'e' => 'é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ',
    'i' => 'í|ì|ỉ|ĩ|ị',
    'o' => 'ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ',
    'u' => 'ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự',
    'y' => 'ý|ỳ|ỷ|ỹ|ỵ',
    'A' => 'Á|À|Ả|Ã|Ạ|Ă|Ắ|Ặ|Ằ|Ẳ|Ẵ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ',
    'D' => 'Đ',
    'E' => 'É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ',
    'I' => 'Í|Ì|Ỉ|Ĩ|Ị',
    'O' => 'Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ',
    'U' => 'Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự',
    'Y' => 'Ý|Ỳ|Ỷ|Ỹ|Ỵ',
  ];
  foreach ($unicode as $nonUnicode => $uni) {
    $str = preg_replace("/($uni)/ui", $nonUnicode, $str);
  }
  $str = strtolower($str);
  $str = preg_replace('/[^a-z0-9\s]/', '', $str); // Xóa ký tự đặc biệt như [ ]
  return trim($str);
}

// Trích xuất tỉnh đi/đến từ tiêu đề trang tuyến đường
$route_title = get_the_title();
$city_alias_map = [
  'Sài Gòn' => ['Sài Gòn', 'Hồ Chí Minh', 'TP.HCM', 'TP HCM', 'HCM'],
  'Nha Trang' => ['Nha Trang', 'Khánh Hòa'],
  'Phan Thiết' => ['Phan Thiết', 'Bình Thuận'],
  'Đà Lạt' => ['Đà Lạt', 'Lâm Đồng'],
  'Vũng Tàu' => ['Vũng Tàu', 'Bà Rịa'],
  'Cần Thơ' => ['Cần Thơ'],
  'Quy Nhơn' => ['Quy Nhơn', 'Bình Định'],
  'Buôn Ma Thuột' => ['Buôn Ma Thuột', 'Đắk Lắk', 'BMT'],
  'Đà Nẵng' => ['Đà Nẵng'],
  'Phan Rang' => ['Phan Rang', 'Ninh Thuận'],
  'Mũi Né' => ['Mũi Né', 'Phan Thiết', 'Bình Thuận'],
  'Liên Khương' => ['Liên Khương', 'Đức Trọng', 'Lâm Đồng'],
  'Cam Ranh' => ['Cam Ranh', 'Khánh Hòa'],
];

$route_city_groups = []; // Cấu trúc: [ 'Tên TP gốc' => [từ khóa 1, từ khóa 2] ]
if (preg_match('/từ\s+(.+)\s+đi\s+(.+)/ui', $route_title, $matches)) {
  $city1 = trim($matches[1]);
  $city2 = trim($matches[2]);

  $route_city_groups[$city1] = isset($city_alias_map[$city1]) ? $city_alias_map[$city1] : [$city1];
  $route_city_groups[$city2] = isset($city_alias_map[$city2]) ? $city_alias_map[$city2] : [$city2];
}

// 1. Lấy mảng có vexere_company_id và id từ dữ liệu API
$companies_list = $dataStatictis['data']['companies']['data'] ?? [];
$extracted_company_ids = array_map(function ($item) {
  return [
    'id' => $item['id'],
    'vexere_company_id' => $item['vexere_company_id']
  ];
}, $companies_list);

// 2. Lấy danh sách vexere_company_id để dùng trong WP_Query
$vexere_ids = array_column($companies_list, 'vexere_company_id');

// 3. Truy vấn danh sách post type là page có trang cha ID là 15764 và custom field company_id
$company_pages = [];
if (!empty($vexere_ids)) {
  $args = [
    'post_type'      => 'page',
    'post_parent'    => 15764,
    'posts_per_page' => -1,
    'meta_query'     => [
      [
        'key'     => 'company_id',
        'value'   => $vexere_ids,
        'compare' => 'IN',
      ],
    ],
  ];
  $company_pages_query = new WP_Query($args);
  $company_pages = $company_pages_query->posts;
}


// 4. Tạo mapping để dễ dàng lấy Page từ vexere_company_id (Giữ lại nếu cần dùng ở nơi khác, hoặc xóa nếu chỉ dùng trong vòng lặp bên dưới)
$company_page_map = [];
foreach ($company_pages as $page) {
  $cid = get_post_meta($page->ID, 'company_id', true);
  if ($cid) {
    $company_page_map[$cid] = $page;
  }
}
?>

<style>
  .dailyve-gallery-wrap {
    margin: 0 auto 24px;
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    max-width: 800px;
  }

  /* Main Slider */
  .dailyve-gallery-main {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    margin: 0 auto 15px;
    max-width: 600px;
    /* Làm gọn ảnh chính */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  .dailyve-gallery-main__item img {
    width: 100%;
    height: 350px;
    object-fit: fill;
    display: block;
  }

  /* Slide Counter */
  .dailyve-gallery-counter {
    text-align: right;
    font-size: 13px;
    color: #666;
    margin-bottom: 10px;
    padding-right: 10px;
  }

  /* Navigation Arrows */
  .dailyve-gallery-main .slick-prev,
  .dailyve-gallery-main .slick-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid #ddd;
    border-radius: 50%;
    z-index: 10;
    cursor: pointer;
    font-size: 18px;
    color: #999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .dailyve-gallery-main .slick-prev:hover,
  .dailyve-gallery-main .slick-next:hover {
    background: #fff;
    color: #333;
    border-color: #333;
  }

  .dailyve-gallery-main .slick-prev {
    left: -40px;
  }

  /* Đẩy ra ngoài ảnh nếu đủ chỗ */
  .dailyve-gallery-main .slick-next {
    right: -40px;
  }

  @media (max-width: 850px) {
    .dailyve-gallery-main .slick-prev {
      left: 5px;
    }

    .dailyve-gallery-main .slick-next {
      right: 5px;
    }
  }

  /* Thumbnails */
  .dailyve-gallery-thumbs {
    margin: 0 auto;
    max-width: 500px;
  }

  .dailyve-gallery-thumbs__item {
    padding: 0 4px;
    cursor: pointer;
    outline: none;
  }

  .dailyve-gallery-thumbs__item img {
    width: 70px;
    /* Thumbnail nhỏ gọn */
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #ddd;
    transition: all 0.2s;
  }

  .dailyve-gallery-thumbs .slick-current .dailyve-gallery-thumbs__item img {
    border: 2px solid #007aff;
    /* Viền xanh chuẩn như ảnh mẫu */
    transform: none;
    box-shadow: none;
  }

  /* Responsive Fixes */
  @media (max-width: 768px) {
    .dailyve-gallery-main__item img {
      height: 220px;
    }
  }

  /* Info & Pickup AJAX Styling */
  .dailyve-info-ajax-container {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
  }

  .dailyve-rating-summary-title {
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 15px;
    color: #111;
  }

  /* Pickup Mock Styling */
  .dailyve-pickup-mock {
    display: flex;
    gap: 20px;
  }

  .dailyve-pickup-mock__col {
    flex: 1;
  }

  .dailyve-pickup-mock__box {
    background: #f9f9f9;
    padding: 15px;
    border-radius: 8px;
    height: 100%;
  }

  .dailyve-pickup-mock__box h4 {
    margin-bottom: 10px;
    font-size: 14px;
    color: #333;
  }

  .dailyve-pickup-mock__box strong {
    display: block;
    margin-bottom: 5px;
    font-size: 15px;
    color: #007aff;
  }

  .dailyve-pickup-mock__box p {
    margin: 0;
    font-size: 13px;
    color: #666;
    line-height: 1.4;
  }

  @media (max-width: 600px) {
    .dailyve-pickup-mock {
      flex-direction: column;
    }
  }

  /* AJAX Reviews Styling */
  .dailyve-reviews-ajax-container {
    padding: 10px 0;
  }

  /* Offices List Styling */
  .dailyve-offices-list {
    padding: 10px 0;
  }

  .dailyve-offices-group {
    margin-bottom: 25px;
  }

  .dailyve-offices-group:last-child {
    margin-bottom: 0;
  }

  .dailyve-offices-group__title {
    font-size: 16px;
    font-weight: 700;
    color: #111;
    margin-bottom: 15px;
    padding-left: 10px;
    border-left: 4px solid var(--primary-color);
    /* Màu đỏ thương hiệu hoặc màu nhấn */
  }

  .dailyve-offices-group__items {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }

  .dailyve-office-item {
    background: #fdfdfd;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    padding: 15px;
    transition: all 0.2s;
  }

  .dailyve-office-item:hover {
    border-color: #ddd;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .dailyve-office-item__name {
    font-weight: 700;
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
  }

  .dailyve-office-item__address,
  .dailyve-office-item__phones {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
    display: flex;
    gap: 8px;
    margin-bottom: 5px;
  }

  /* .dailyve-office-item__address i,
  .dailyve-office-item__phones i {
    color: var(--primary-color);
    width: 14px;
    margin-top: 2px;
  } */

  @media (max-width: 768px) {
    .dailyve-offices-group__items {
      grid-template-columns: 1fr;
    }
  }

  /* Utilities Mock Styling */
  .dailyve-utilities-mock {
    padding: 0;
  }

  .dailyve-utilities-mock__featured {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .dailyve-utilities-mock__item {
    margin: 0 !important;
    background-color: #f8f9fa;
    padding: 15px;
    border-bottom: 1px solid #ebebeb;
  }

  .dailyve-utilities-mock__item:last-child {
    border-bottom: none;
  }

  .dailyve-utilities-mock__title {
    background-position: left center;
    background-size: 30px auto;
    background-repeat: no-repeat;
    padding-left: 36px;
    font-weight: 700;
    margin-bottom: 8px;
    font-size: 14px;
    color: #111;
    min-height: 30px;
    display: flex;
    align-items: center;
  }

  .dailyve-utilities-mock__desc {
    font-size: 13px;
    color: #555;
    line-height: 1.5;
    padding-left: 36px;
    margin: 0;
  }

  .dailyve-utilities-mock__grid {
    display: flex;
    flex-wrap: wrap;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px dashed #ebebeb;
    align-items: center;
  }

  .dailyve-utilities-mock__grid span {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    width: 33.33%;
    margin-bottom: 15px;
    color: #333;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .dailyve-utilities-mock__grid span img {
    width: 30px;
    height: 30px;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    .dailyve-utilities-mock__grid span {
      width: 50%;
    }
  }

  .dailyve-reviews-pagination {
    text-align: center;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px dashed #ebebeb;
  }

  .dailyve-load-more-reviews {
    background-color: transparent;
    border: 1px solid var(--primary-color, #0064d2);
    color: var(--primary-color, #0064d2);
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 0;
    text-transform: none;
  }

  .dailyve-load-more-reviews:hover {
    background-color: var(--primary-color, #0064d2);
    color: #fff;
  }

  .dailyve-load-more-reviews.is-loading {
    opacity: 0.6;
    pointer-events: none;
  }
</style>

<div class="dailyve-company-ui">
  <div class="dailyve-company-ui__topbar">
    <div class="dailyve-company-ui__author">
      <div class="dailyve-company-ui__author-icon">
        <img src="<?= esc_url(home_url('/wp-content/uploads/assets/images/logo-icon-f2.png')); ?>" alt="Dailyve Team">
      </div>
      <div class="dailyve-company-ui__author-text">
        <div class="dailyve-company-ui__author-name">Dailyve Team</div>
        <div class="dailyve-company-ui__author-date">Cập nhật lần cuối: <?= esc_html($updated_date); ?></div>
      </div>
    </div>
    <a href="<?= esc_url($filter_url); ?>" class="dailyve-company-ui__filter-btn">Xem bộ lọc phổ biến</a>
  </div>

  <div class="dailyve-company-ui__notice">
    <div class="dailyve-company-ui__notice-text">
      <span class="dailyve-company-ui__notice-dot">i</span>
      <span>Chọn ngày đi để xem giá vé, ưu đãi hiện có và tình trạng ghế trống.</span>
    </div>
    <a href="javascript:void(0)" class="dailyve-company-ui__notice-link">Chọn ngày</a>
  </div>

  <div class="dailyve-company-ui__list">
    <?php if ($company_pages_query->have_posts()) : $index = 0;
      while ($company_pages_query->have_posts()) : $company_pages_query->the_post();
        $p_id = get_the_ID();
        $company_name = get_the_title();
        $company_phone = get_post_meta($p_id, 'company_phone', true) ?? '1900 0155';
        $rating = get_post_meta($p_id, 'rating', true) ?: 0;
        $reviews = get_post_meta($p_id, 'reviews', true) ?: 0;
        $vehicle_data = function_exists('get_field') ? get_field('vehicle_type', $p_id) : get_post_meta($p_id, 'vehicle_type', true);
        if (is_array($vehicle_data)) {
          // Xử lý nếu ACF trả về mảng (Labels hoặc Objects)
          if (isset($vehicle_data[0]) && is_array($vehicle_data[0]) && isset($vehicle_data[0]['label'])) {
            $vehicle = implode(', ', array_column($vehicle_data, 'label'));
          } else {
            $vehicle = implode(', ', $vehicle_data);
          }
        } else {
          $vehicle = $vehicle_data ?: 'Limousine';
        }
        $duration = get_post_meta($p_id, 'duration', true) ?: '---';
        $badge = get_post_meta($p_id, 'badge', true) ?: 'Xác nhận tức thì';
        $payment_note = get_post_meta($p_id, 'payment_note', true);
        $image = get_the_post_thumbnail_url($p_id) ?: home_url('/wp-content/uploads/assets/images/logo-icon-f2.png');
        $company_gallery = function_exists('get_field') ? get_field('company_gallery', $p_id) : [];
        $vexere_company_id = get_post_meta($p_id, 'company_id', true);
        $booking_url = $current_url . '?date=';

        // Lọc danh sách văn phòng theo tỉnh đi/đến (sử dụng Alias Map & Cấu trúc Repeater lồng nhau)
        $all_brands = function_exists('get_field') ? get_field('company_brand', $p_id) : [];
        $matched_offices = []; // [ 'TP Gốc' => [offices] ]
        // Khởi tạo trước key để giữ đúng thứ tự (Tỉnh đi trước, Tỉnh đến sau)
        if (!empty($route_city_groups)) {
          foreach (array_keys($route_city_groups) as $city_name) {
            $matched_offices[$city_name] = [];
          }
        }

        if (!empty($all_brands) && !empty($route_city_groups)) {
          foreach ($all_brands as $brand) {
            $brand_name = $brand['company_brand_name'] ?? '';
            $offices = $brand['company_brand_office'] ?? [];

            foreach ($route_city_groups as $original_city => $keywords) {
              // 1. Kiểm tra xem Tên phòng vé có khớp với thành phố không
              $brand_match = false;
              foreach ($keywords as $kw) {
                if (mb_stripos(dailyve_normalize_string($brand_name), dailyve_normalize_string($kw)) !== false) {
                  $brand_match = true;
                  break;
                }
              }

              // 2. Chạy qua từng chi nhánh của phòng vé này
              foreach ($offices as $office) {
                $is_match = $brand_match; // Nếu brand đã khớp thì tất cả office của nó đều khớp

                if (!$is_match) {
                  // Nếu brand không khớp, kiểm tra chi tiết từng chi nhánh
                  $norm_office_name = dailyve_normalize_string($office['company_brand_office_name'] ?? '');
                  $norm_office_addr = dailyve_normalize_string($office['company_brand_office_address'] ?? '');

                  foreach ($keywords as $kw) {
                    $norm_kw = dailyve_normalize_string($kw);
                    if (
                      mb_stripos($norm_office_name, $norm_kw) !== false ||
                      mb_stripos($norm_office_addr, $norm_kw) !== false
                    ) {
                      $is_match = true;
                      break;
                    }
                  }
                }

                if ($is_match) {
                  // Kiểm tra trùng lặp trước khi thêm
                  $is_duplicate = false;
                  if (isset($matched_offices[$original_city])) {
                    foreach ($matched_offices[$original_city] as $added) {
                      if (($added['company_brand_office_address'] ?? '') === ($office['company_brand_office_address'] ?? '')) {
                        $is_duplicate = true;
                        break;
                      }
                    }
                  }
                  if (!$is_duplicate) {
                    $matched_offices[$original_city][] = $office;
                  }
                }
              }
            }
          }
        }
        $matched_offices = array_filter($matched_offices); // Loại bỏ các thành phố không có văn phòng nào

        // Tự động lấy điểm đón/trả từ văn phòng đầu tiên hoặc từ tiêu đề tuyến đường
        $cities_in_order = array_keys($route_city_groups);
        $origin_city = $cities_in_order[0] ?? '';
        $dest_city = $cities_in_order[1] ?? '';

        $pickup = !empty($matched_offices[$origin_city]) && isset($matched_offices[$origin_city][0]['company_brand_office_name'])
          ? $matched_offices[$origin_city][0]['company_brand_office_name']
          : ($origin_city ?: 'Đang cập nhật');

        $dropoff = !empty($matched_offices[$dest_city]) && isset($matched_offices[$dest_city][0]['company_brand_office_name'])
          ? $matched_offices[$dest_city][0]['company_brand_office_name']
          : ($dest_city ?: 'Đang cập nhật');
    ?>
        <article class="dailyve-company-card-v2" data-company-card data-company-id="<?= esc_attr($vexere_company_id); ?>">
          <?php if ($rating > 0 && $reviews > 0) : ?>
            <script type="application/ld+json">
              {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": "<?= esc_js($company_name) ?>",
                "image": "<?= esc_js($image) ?>",
                "url": "<?= esc_js(get_permalink($p_id)) ?>",
                "telephone": "<?= esc_js($company_phone) ?>",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "<?= esc_js($rating) ?>",
                  "bestRating": "5",
                  "ratingCount": "<?= esc_js($reviews) ?>"
                }
              }
            </script>
          <?php endif; ?>
          <div class="dailyve-company-card-v2__summary">
            <div class="dailyve-company-card-v2__left">
              <div class="dailyve-company-card-v2__image-wrap">
                <span class="dailyve-company-card-v2__badge"><?= esc_html($badge); ?></span>
                <img src="<?= esc_url($image); ?>" alt="<?= esc_attr($company_name); ?>">
              </div>
            </div>

            <div class="dailyve-company-card-v2__center">
              <h3 class="dailyve-company-card-v2__title"><?= esc_html($company_name); ?></h3>
              <div class="dailyve-company-card-v2__rating">
                <strong><?= esc_html($rating); ?></strong>
                <span class="dailyve-company-card-v2__star">&#9733;</span>
                <span><?= esc_html($reviews); ?> đánh giá</span>
              </div>
              <div class="dailyve-company-card-v2__vehicle"><?= esc_html($vehicle); ?></div>
              <div class="dailyve-company-card-v2__route">
                <div class="dailyve-company-card-v2__route-item">
                  <span class="dailyve-company-card-v2__route-pin dailyve-company-card-v2__route-pin--from"></span>
                  <div class="dailyve-company-card-v2__route-label"><?= esc_html($pickup); ?></div>
                </div>
                <div class="dailyve-company-card-v2__duration"><?= esc_html($duration); ?></div>
                <div class="dailyve-company-card-v2__route-item">
                  <span class="dailyve-company-card-v2__route-pin dailyve-company-card-v2__route-pin--to"></span>
                  <div class="dailyve-company-card-v2__route-label"><?= esc_html($dropoff); ?></div>
                </div>
              </div>
            </div>

            <div class="dailyve-company-card-v2__right">
              <div class="dailyve-company-card-v2__quote">
                <span class="dailyve-company-card-v2__quote-mark">&ldquo;</span>
                <p><?= get_the_excerpt() ?: 'Dịch vụ nhà xe chất lượng, an toàn và chuyên nghiệp trên mọi hành trình.'; ?></p>
                <a href="<?= esc_url($booking_url); ?>" target="_blank">Xem thêm</a>
              </div>

              <div class="dailyve-company-card-v2__footer">
                <button type="button" class="dailyve-company-card-v2__detail" data-detail-toggle aria-expanded="false">Thông tin chi tiết</button>
                <div class="dailyve-company-card-v2__cta-block">
                  <?php if (!empty($payment_note)) : ?>
                    <div class="dailyve-company-card-v2__payment-note"><?= esc_html($payment_note); ?></div>
                  <?php endif; ?>
                  <button type="button" class="dailyve-company-card-v2__cta book-dailyve-btn" data-link="<?= esc_url($booking_url); ?>" data-datepicker="dailyve_company_calendar_<?= esc_attr($index); ?>">Xem giá</button>
                  <input type="text" class="dailyve_calendar" name="dailyve_company_calendar_<?= esc_attr($index); ?>">
                </div>
              </div>
            </div>
          </div>

          <div class="dailyve-company-card-v2__details" data-detail-panel hidden>
            <div class="dailyve-company-card-v2__details-inner">
              <button type="button" class="dailyve-company-card-v2__close" data-detail-close aria-label="Dong">&#215;</button>
              <div class="dailyve-company-card-v2__tabs">
                <button type="button" class="dailyve-company-card-v2__tab is-active" data-tab-target="images-<?= esc_attr($index); ?>">Hình ảnh</button>
                <button type="button" class="dailyve-company-card-v2__tab" data-tab-target="pickup-<?= esc_attr($index); ?>">Đón/trả</button>
                <button type="button" class="dailyve-company-card-v2__tab" data-tab-target="utilities-<?= esc_attr($index); ?>">Tiện ích</button>
                <button type="button" class="dailyve-company-card-v2__tab" data-tab-target="policy-<?= esc_attr($index); ?>">Chính sách</button>
                <button type="button" class="dailyve-company-card-v2__tab" data-tab-target="reviews-<?= esc_attr($index); ?>">Đánh giá</button>
              </div>

              <div class="dailyve-company-card-v2__tab-panels">
                <div class="dailyve-company-card-v2__tab-panel" data-tab-panel="pickup-<?= esc_attr($index); ?>">
                  <?php if (!empty($matched_offices)) : ?>
                    <div class="dailyve-offices-list">
                      <?php foreach ($matched_offices as $city_name => $offices) : ?>
                        <div class="dailyve-offices-group">
                          <h4 class="dailyve-offices-group__title">Điểm đón trả tại <?= esc_html($city_name); ?></h4>
                          <div class="dailyve-offices-group__items">
                            <?php foreach ($offices as $office) : ?>
                              <div class="dailyve-office-item">
                                <div class="dailyve-office-item__name"><?= esc_html($office['company_brand_office_name']); ?></div>
                                <div class="dailyve-office-item__address"><?= esc_html($office['company_brand_office_address']); ?></div>
                              </div>
                            <?php endforeach; ?>
                          </div>
                        </div>
                      <?php endforeach; ?>
                    </div>
                  <?php else : ?>
                    <div class="dailyve-no-data-msg">
                      <p>Vui lòng chọn ngày đi để xem điểm đón trả</p>
                    </div>
                  <?php endif; ?>
                </div>
                <div class="dailyve-company-card-v2__tab-panel is-active" data-tab-panel="images-<?= esc_attr($index); ?>">
                  <div class="dailyve-gallery-wrap">
                    <!-- <div class="dailyve-gallery-counter"></div> -->
                    <div class="dailyve-gallery-main">
                      <?php if (!empty($company_gallery)) : foreach ($company_gallery as $gallery_img) : ?>
                          <div class="dailyve-gallery-main__item">
                            <img src="<?= esc_url($gallery_img['url']); ?>" alt="<?= esc_attr($gallery_img['alt']); ?>">
                          </div>
                        <?php endforeach;
                      else : ?>
                        <div class="dailyve-gallery-main__item">
                          <img src="<?= esc_url($image); ?>" alt="<?= esc_attr($company_name); ?>">
                        </div>
                      <?php endif; ?>
                    </div>
                    <div class="dailyve-gallery-thumbs">
                      <?php if (!empty($company_gallery)) : foreach ($company_gallery as $gallery_img) : ?>
                          <div class="dailyve-gallery-thumbs__item">
                            <img src="<?= esc_url($gallery_img['sizes']['thumbnail'] ?: $gallery_img['url']); ?>" alt="<?= esc_attr($gallery_img['alt']); ?>">
                          </div>
                        <?php endforeach;
                      else : ?>
                        <div class="dailyve-gallery-thumbs__item">
                          <img src="<?= esc_url($image); ?>" alt="<?= esc_attr($company_name); ?>">
                        </div>
                      <?php endif; ?>
                    </div>
                  </div>
                </div>

                <div class="dailyve-company-card-v2__tab-panel" data-tab-panel="utilities-<?= esc_attr($index); ?>">
                  <div class="dailyve-utilities-mock">
                    <?php
                    $utilities = get_the_terms($p_id, 'bus_utility');
                    if ($utilities && !is_wp_error($utilities)) :
                      $featured_utilities = [];
                      $other_utilities = [];

                      foreach ($utilities as $utility) {
                        $icon = get_field('utility_icon', 'bus_utility_' . $utility->term_id);
                        $desc = get_field('utility_description', 'bus_utility_' . $utility->term_id);

                        if (!empty($desc)) {
                          $featured_utilities[] = [
                            'name' => $utility->name,
                            'icon' => $icon,
                            'desc' => $desc
                          ];
                        } else {
                          $other_utilities[] = [
                            'name' => $utility->name,
                            'icon' => $icon
                          ];
                        }
                      }
                    ?>
                      <?php if (!empty($featured_utilities)) : ?>
                        <div class="dailyve-utilities-mock__featured">
                          <?php foreach ($featured_utilities as $f_item) : ?>
                            <div class="dailyve-utilities-mock__item">
                              <div class="dailyve-utilities-mock__title" style="background-image: url('<?= esc_url($f_item['icon']); ?>');"><?= esc_html($f_item['name']); ?></div>
                              <div class="dailyve-utilities-mock__desc"><?= esc_html($f_item['desc']); ?></div>
                            </div>
                          <?php endforeach; ?>
                        </div>
                      <?php endif; ?>

                      <?php if (!empty($other_utilities)) : ?>
                        <div class="dailyve-utilities-mock__grid">
                          <?php foreach ($other_utilities as $o_item) : ?>
                            <span>
                              <?php if ($o_item['icon']) : ?>
                                <img src="<?= esc_url($o_item['icon']); ?>" alt="<?= esc_attr($o_item['name']); ?>">
                              <?php endif; ?>
                              <?= esc_html($o_item['name']); ?>
                            </span>
                          <?php endforeach; ?>
                        </div>
                      <?php endif; ?>
                    <?php else : ?>
                      <div class="dailyve-no-data-msg">
                        <p>Thông tin tiện ích đang được cập nhật...</p>
                      </div>
                    <?php endif; ?>
                  </div>
                </div>


                <div class="dailyve-company-card-v2__tab-panel" data-tab-panel="policy-<?= esc_attr($index); ?>">
                  <div class="dailyve-policy-mock">
                    <section>
                      <h4>Cac quy dinh chung</h4>
                      <ul>
                        <li>Co mat tai ben xe hoac van phong som de lam thu tuc len xe.</li>
                        <li>Xuat trinh thong tin dat cho truoc khi len xe.</li>
                        <li>Khong mang do an co mui, chat de chay no hoac vat nuoi len xe.</li>
                        <li>Khong hut thuoc va giu gin ve sinh chung trong suot hanh trinh.</li>
                      </ul>
                    </section>
                    <section>
                      <h4>Hanh ly xach tay</h4>
                      <ul>
                        <li>Tong trong luong hanh ly khuyen nghi khong vuot qua 20kg.</li>
                        <li>Vui long thong bao truoc neu co hanh ly cong kenh hoac dac biet.</li>
                        <li>Muc ho tro doi tra phu thuoc chinh sach tung nha xe tai thoi diem dat cho.</li>
                      </ul>
                    </section>
                  </div>
                </div>

                <div class="dailyve-company-card-v2__tab-panel" data-tab-panel="reviews-<?= esc_attr($index); ?>">
                  <div class="dailyve-reviews-ajax-wrapper">
                    <div class="dailyve-info-ajax-container rating-tab__cats" data-loaded="true">
                      <?php
                      $rating_data = get_post_meta($p_id, 'vexere_rating_data', true);
                      if (!empty($rating_data) && isset($rating_data['rating'])) :
                        foreach ($rating_data['rating'] as $item) :
                          $cat_width = ((float) $item['rv_main_value'] / 5) * 100;
                      ?>
                          <div class="rating-tab__cat">
                            <div class="rating-tab__cat-name"><?= esc_html($item['label']) ?></div>
                            <div class="rating-tab__progress__wrap">
                              <div class="rating-tab__progress__bar">
                                <div style="width: <?= $cat_width ?>%;" class="rating-tab__progress__bar-fill"></div>
                              </div>
                              <div class="rating-tab__progress__txt"><?= esc_html($item['rv_main_value']) ?></div>
                            </div>
                          </div>
                      <?php
                        endforeach;
                      else:
                        echo '<div class="dailyve-loading">Đang cập nhật đánh giá chi tiết...</div>';
                      endif;
                      ?>
                    </div>
                    <?php
                    $review_html_cache = get_transient('dailyve_reviews_html_' . $vexere_company_id);
                    $total_pages = ceil((int)$reviews / 10);
                    ?>
                    <div class="dailyve-reviews-ajax-container" data-loaded="<?= $review_html_cache ? 'true' : 'false' ?>">
                      <?= $review_html_cache ? $review_html_cache : '<div class="dailyve-loading">Đang tải đánh giá...</div>' ?>
                    </div>
                    <?php if ($total_pages > 1) : ?>
                      <div class="dailyve-reviews-pagination">
                        <button type="button" class="dailyve-load-more-reviews" data-current-page="1" data-total-pages="<?= esc_attr($total_pages); ?>">Xem thêm</button>
                      </div>
                    <?php endif; ?>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
    <?php $index++;
      endwhile;
      wp_reset_postdata();
    endif; ?>
  </div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    if (typeof initializeDatePicker === 'function') {
      initializeDatePicker();
    }

    document.querySelectorAll('[data-company-card]').forEach(function(card) {
      var toggle = card.querySelector('[data-detail-toggle]');
      var closeBtn = card.querySelector('[data-detail-close]');
      var panel = card.querySelector('[data-detail-panel]');

      if (toggle && panel) {
        toggle.addEventListener('click', function() {
          var isOpen = !panel.hasAttribute('hidden');
          if (isOpen) {
            panel.setAttribute('hidden', 'hidden');
          } else {
            panel.removeAttribute('hidden');

            // Khởi tạo hoặc refresh Slick Slide khi mở panel
            var $panel = jQuery(panel);
            var $main = $panel.find('.dailyve-gallery-main');
            var $thumbs = $panel.find('.dailyve-gallery-thumbs');

            if ($main.length && $thumbs.length) {
              setTimeout(function() {
                if (!$main.hasClass('slick-initialized')) {
                  // var $counter = $panel.find('.dailyve-gallery-counter');

                  // $main.on('init reInit afterChange', function(event, slick, currentSlide) {
                  //   var i = (currentSlide || 0) + 1;
                  //   $counter.text(i + '/' + slick.slideCount);
                  // });

                  $main.slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: true,
                    fade: true,
                    asNavFor: $thumbs,
                    prevArrow: '<button type="button" class="slick-prev">&#x276E;</button>',
                    nextArrow: '<button type="button" class="slick-next">&#x276F;</button>'
                  });
                  $thumbs.slick({
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    asNavFor: $main,
                    dots: false,
                    centerMode: true,
                    focusOnSelect: true,
                    arrows: false,
                    infinite: true,
                    responsive: [{
                      breakpoint: 768,
                      settings: {
                        slidesToShow: 3
                      }
                    }]
                  });
                } else {
                  $main.slick('setPosition');
                  $thumbs.slick('setPosition');
                  jQuery(window).trigger('resize');
                }
              }, 100);
            }
          }
          card.classList.toggle('is-expanded', !isOpen);
          toggle.setAttribute('aria-expanded', String(!isOpen));
        });
      }

      if (closeBtn && panel && toggle) {
        closeBtn.addEventListener('click', function() {
          panel.setAttribute('hidden', 'hidden');
          card.classList.remove('is-expanded');
          toggle.setAttribute('aria-expanded', 'false');
        });
      }

      card.querySelectorAll('[data-tab-target]').forEach(function(tabButton) {
        tabButton.addEventListener('click', function() {
          var target = tabButton.getAttribute('data-tab-target');
          card.querySelectorAll('[data-tab-target]').forEach(function(item) {
            item.classList.remove('is-active');
          });
          card.querySelectorAll('[data-tab-panel]').forEach(function(panelItem) {
            panelItem.classList.remove('is-active');
          });
          tabButton.classList.add('is-active');
          var targetPanel = card.querySelector('[data-tab-panel="' + target + '"]');
          if (targetPanel) {
            targetPanel.classList.add('is-active');

            // Shared info loader (Ratings)
            function fetchCompanyInfo() {
              var $infoContainer = card.querySelector('.dailyve-info-ajax-container');
              var infoLoaded = $infoContainer ? ($infoContainer.getAttribute('data-loaded') === 'true') : true;

              if (!infoLoaded) {
                var companyId = card.getAttribute('data-company-id');
                var params = new URLSearchParams(window.location.search);

                jQuery.ajax({
                  url: flatsomeVars.ajaxurl,
                  type: 'POST',
                  data: {
                    action: 'get_info_ajax_company',
                    companyId: companyId,
                    from: params.get('dailyve_from') || params.get('from') || '',
                    to: params.get('dailyve_to') || params.get('to') || '',
                    pickupDate: params.get('dailyve_date') || params.get('date') || ''
                  },
                  success: function(resp) {
                    try {
                      var data = JSON.parse(resp);
                      if (data.listCats) {
                        if ($infoContainer) {
                          $infoContainer.innerHTML = data.listCats;
                        }
                      }
                    } catch (e) {
                      console.error(e);
                    }
                    if ($infoContainer) $infoContainer.setAttribute('data-loaded', 'true');
                  }
                });
              }
            }

            // AJAX Reviews logic
            if (target.indexOf('reviews-') === 0) {
              fetchCompanyInfo();
              var $reviewContainer = targetPanel.querySelector('.dailyve-reviews-ajax-container');
              if ($reviewContainer && $reviewContainer.getAttribute('data-loaded') === 'false') {
                var companyId = card.getAttribute('data-company-id');
                if (companyId) {
                  jQuery.ajax({
                    url: flatsomeVars.ajaxurl,
                    type: 'GET',
                    data: {
                      action: 'get_review_ajax_company',
                      companyId: companyId,
                      page: 1
                    },
                    success: function(resp) {
                      try {
                        var data = JSON.parse(resp);
                        if (data.html) {
                          $reviewContainer.innerHTML = data.html;
                        } else {
                          $reviewContainer.innerHTML = '<div class="dailyve-no-reviews">Chưa có đánh giá nào cho nhà xe này.</div>';
                        }
                      } catch (e) {
                        $reviewContainer.innerHTML = '<div class="dailyve-no-reviews">Chưa có đánh giá nào.</div>';
                      }
                      $reviewContainer.setAttribute('data-loaded', 'true');
                    },
                    error: function() {
                      $reviewContainer.innerHTML = '<div class="dailyve-error">Không thể tải đánh giá. Vui lòng thử lại sau.</div>';
                    }
                  });
                } else {
                  $reviewContainer.innerHTML = '<div class="dailyve-no-reviews">Không tìm thấy mã nhà xe.</div>';
                  $reviewContainer.setAttribute('data-loaded', 'true');
                }
              }
            }
          }
        });
      });
    });

    // Handle "Load More Reviews" button
    document.addEventListener('click', function(e) {
      if (e.target && e.target.classList.contains('dailyve-load-more-reviews')) {
        var btn = e.target;
        var currentPage = parseInt(btn.getAttribute('data-current-page'));
        var totalPages = parseInt(btn.getAttribute('data-total-pages'));
        var card = btn.closest('.dailyve-company-card-v2');
        var companyId = card ? card.getAttribute('data-company-id') : null;
        var container = card ? card.querySelector('.dailyve-reviews-ajax-container') : null;

        if (companyId && container && currentPage < totalPages) {
          var nextPage = currentPage + 1;
          btn.classList.add('is-loading');
          btn.innerText = 'Đang tải...';

          jQuery.ajax({
            url: flatsomeVars.ajaxurl,
            type: 'GET',
            data: {
              action: 'get_review_ajax_company',
              companyId: companyId,
              page: nextPage
            },
            success: function(resp) {
              try {
                var data = JSON.parse(resp);
                if (data.html) {
                  container.insertAdjacentHTML('beforeend', data.html);
                  btn.setAttribute('data-current-page', nextPage);
                  if (nextPage >= totalPages) {
                    btn.parentElement.style.display = 'none';
                  } else {
                    btn.innerText = 'Xem thêm đánh giá';
                  }
                }
              } catch (err) {
                console.error(err);
                btn.innerText = 'Xem thêm đánh giá';
              }
              btn.classList.remove('is-loading');
            },
            error: function() {
              btn.innerText = 'Lỗi tải trang. Thử lại?';
              btn.classList.remove('is-loading');
            }
          });
        }
      }
    });

  });
</script>

<?php
return;
/*
/**
 * Template part: Route company list when page has no search query params.
 *
 * Expects:
 * - $route_companies
 */

$today = date_create(date('Y-m-d'));
date_sub($today, date_interval_create_from_date_string('1 day'));
$updated_date = date_format($today, 'd-m-Y');
$route_title = get_the_title();
?>

<div class="dailyve-route-company-list">
  <div class="container">
    <div class="dailyve-route-company-list__header">
      <div class="dailyve-route-company-list__author">
        <div class="dailyve-route-company-list__author-logo">
          <img src="<?= esc_url(home_url('/wp-content/uploads/assets/images/logo-icon-f2.png')); ?>" alt="Dailyve">
        </div>
        <div>
          <div class="dailyve-route-company-list__author-name">Dailyve Team</div>
          <div class="dailyve-route-company-list__author-date">Ngày cập nhật: <?= esc_html($updated_date); ?></div>
        </div>
      </div>
    </div>

    <?php if (!empty($route_companies)) : ?>
      <div class="dailyve-route-company-list__summary">
        Đặt mua vé xe <?= esc_html(mb_strtolower($route_title, 'UTF-8')); ?> chất lượng cao với <?= esc_html(count($route_companies)); ?> nhà xe đang khai thác.
      </div>

      <div class="dailyve-route-company-list__items">
        <?php foreach ($route_companies as $company) : ?>
          <article class="dailyve-route-company-card">
            <div class="dailyve-route-company-card__main">
              <div class="dailyve-route-company-card__media">
                <img
                  src="<?= esc_url(!empty($company['logo_url']) ? $company['logo_url'] : home_url('/wp-content/uploads/assets/images/logo-icon-f2.png')); ?>"
                  alt="<?= esc_attr($company['company_name'] ?: 'Nhà xe'); ?>">
              </div>

              <div class="dailyve-route-company-card__content">
                <h3 class="dailyve-route-company-card__title">
                  <?php if (!empty($company['company_url'])) : ?>
                    <a href="<?= esc_url($company['company_url']); ?>" title="<?= esc_attr($company['company_name']); ?>">
                      <?= esc_html($company['company_name']); ?>
                    </a>
                  <?php else : ?>
                    <?= esc_html($company['company_name']); ?>
                  <?php endif; ?>
                </h3>

                <?php if (!empty($company['route_label'])) : ?>
                  <div class="dailyve-route-company-card__route"><?= esc_html($company['route_label']); ?></div>
                <?php endif; ?>

                <?php if ($company['route_total'] !== '') : ?>
                  <div class="dailyve-route-company-card__meta"><?= esc_html($company['route_total']); ?> chuyến mỗi ngày</div>
                <?php endif; ?>

                <?php if (!empty($company['schedule_content'])) : ?>
                  <div class="dailyve-route-company-card__desc">
                    <?= wp_kses_post($company['schedule_content']); ?>
                  </div>
                <?php endif; ?>
              </div>
            </div>

            <div class="dailyve-route-company-card__aside">
              <?php if (!empty($company['price'])) : ?>
                <div class="dailyve-route-company-card__price">Từ <?= esc_html($company['price']); ?></div>
              <?php endif; ?>

              <div class="dailyve-route-company-card__actions">
                <a href="tel:<?= esc_attr(stringToPhone($company['phone'])); ?>" class="dailyve-route-company-card__call">
                  <?= esc_html($company['phone']); ?>
                </a>

                <?php if (!empty($company['booking_url'])) : ?>
                  <a href="<?= esc_url($company['booking_url']); ?>" class="dailyve-route-company-card__book">
                    Xem giá
                  </a>
                <?php endif; ?>
              </div>
            </div>
          </article>
        <?php endforeach; ?>
      </div>
    <?php else : ?>
      <div class="dailyve-route-company-list__empty">
        Hiện tại chưa có dữ liệu nhà xe cho tuyến này. Vui lòng thử tìm chuyến theo ngày hoặc liên hệ hotline để được hỗ trợ.
      </div>
    <?php endif; ?>
  </div>
</div>