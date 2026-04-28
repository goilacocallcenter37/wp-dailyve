<?php

/**
 * Template Name: Page Thanh toán thành công custom
 */

get_header();

$journey_group_id = sanitize_text_field(wp_unslash($_GET['code']));


if (empty($journey_group_id)) {
  // cho phép vào trang nhưng sẽ báo không tìm thấy
}

// ===== get posts by journey_group_id (round-trip) or by title (legacy) =====
$existing_posts = [];

if (!empty($journey_group_id)) {
  $existing_posts = get_posts([
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
}

if (!empty($existing_posts)) {
  usort($existing_posts, function ($a, $b) {
    $ia = (int)get_post_meta($a->ID, 'journey_ticket_index', true);
    $ib = (int)get_post_meta($b->ID, 'journey_ticket_index', true);
    return $ia <=> $ib;
  });
}

$has_posts = !empty($existing_posts);
// ===== compute group info =====
$totalPrice = 0;
$statuses   = [];
$bookingCodesAll = [];
$ticketCodesAll  = [];
$paymentContent  = '';
$first_post_id   = 0;

$displayTickets = [];
$journeyId       = '';

if ($has_posts) {
  $first_post_id = (int)$existing_posts[0]->ID;
  $journeyId = (string)get_post_meta($first_post_id, 'journey_id', true);

  foreach ($existing_posts as $p) {
    $pid = (int)$p->ID;

    $tp = (float)(get_post_meta($pid, 'total_price', true) ?: 0);
    $totalPrice += $tp;

    $st = (int)(get_post_meta($pid, 'payment_status', true) ?: 0);
    $statuses[] = $st;
    $seatStr = (string)get_post_meta($pid, 'seat', true);
    $seatArr = array_values(array_filter(array_map('trim', explode(',', $seatStr))));
    if ($paymentContent === '') {
      $paymentContent = (string)(get_post_meta($pid, 'payment_content', true) ?: '');
    }

    $bc = (string)(get_post_meta($pid, 'booking_codes', true) ?: '');
    if (!empty($bc)) {
      $parts = preg_split('/\s+/', trim($bc));
      if (is_array($parts)) $bookingCodesAll = array_merge($bookingCodesAll, $parts);
    }

    $tc = (string)(get_post_meta($pid, 'ticket_codes', true) ?: '');
    if (!empty($tc)) {
      $parts = preg_split('/\s+/', trim($tc));
      if (is_array($parts)) $ticketCodesAll = array_merge($ticketCodesAll, $parts);
    }

    $displayTickets[] = [
      'post_id'     => $pid,
      'index'       => (int)get_post_meta($pid, 'journey_ticket_index', true),
      'from'        => (string)get_post_meta($pid, 'pickup_name', true),
      'to'          => (string)get_post_meta($pid, 'dropoff_name', true),
      'fromAddress'        => (string)get_post_meta($pid, 'pickup_address', true),
      'toAddress'          => (string)get_post_meta($pid, 'dropoff_address', true),
      'company'     => (string)get_post_meta($pid, 'company_bus', true),
      'vehicle'     => (string)get_post_meta($pid, 'vehicle_name', true),
      'pickupDate'  => (string)get_post_meta($pid, 'pickup_date', true),
      'arrivalDate' => (string)get_post_meta($pid, 'arrival_date', true),
      'seatArr'     => $seatArr,
      'seatStr'     => $seatStr,
      'ticketCodes'     => (string)get_post_meta($pid, 'ticket_codes', true),
      'customer'    => [
        'name'  => (string)get_post_meta($pid, 'full_name', true),
        'phone' => (string)get_post_meta($pid, 'phone', true),
        'email' => (string)get_post_meta($pid, 'email', true),
      ],
    ];
  }
}

$bookingCodesAll = array_values(array_unique(array_filter($bookingCodesAll)));
$ticketCodesAll  = array_values(array_unique(array_filter($ticketCodesAll)));

$bookingCodeStr = trim(implode(' ', $bookingCodesAll));
$ticketCodeStr  = trim(implode(' ', $ticketCodesAll));

$paymentStatus = 0; // 0 unknown
$payment_key = !empty($journey_group_id) ? $journey_group_id : $bookingCodeStr;

if ($has_posts) {
  $statuses = [];
  foreach ($existing_posts as $p) {
    $s = (int)get_post_meta($p->ID, 'payment_status', true);
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

?>

<?php if (!$has_posts) : ?>
  <div class="container" style="padding:24px 0;">
    <div class="not-fount-trip-container">
      <div class="not__found__content">
        <div class="label" style="font-weight: 500;">Không tìm thấy đơn hàng.</div>
        <div class="content">Vui lòng kiểm tra lại mã đơn hàng.</div>
      </div>
    </div>
  </div>

<?php elseif ($paymentStatus !== 2) : ?>
  <div class="container" style="padding:24px 0;">
    <div class="not-fount-trip-container">
      <div class="not__found__content">
        <div class="label" style="font-weight: 500;">Đơn hàng của bạn chưa ở trạng thái “Đã thanh toán”.</div>
        <div class="content">Mã: <strong><?php echo esc_html($payment_key); ?></strong></div>
        <div style="margin-top:12px;"><a class="btn btn--ghost" href="/">Về trang chủ</a></div>
      </div>
    </div>
  </div>

<?php else : ?>
  <div class="container" style="padding:24px 0;">
    <section class="hero">
      <div class="hero__icon">✓</div>
      <div class="hero__content">
        <h1>Thanh toán thành công</h1>
        <p class="muted">Vé đã được xác nhận. Chúng tôi đã gửi e-ticket vào Zalo/SMS của bạn.</p>

        <div class="status-row">
          <div class="chip chip--success">Đã thanh toán</div>
          <div class="chip">Mã đơn: <strong><?php echo esc_html($payment_key); ?></strong></div>
          <?php if (!empty($bookingCodeStr)) : ?>
            <div class="chip">Booking: <strong><?php echo esc_html($bookingCodeStr); ?></strong></div>
          <?php endif; ?>
          <div class="chip">Thời gian: <strong><?php echo esc_html(get_the_date('H:i d/m/Y', $first_post_id)); ?></strong></div>
        </div>
      </div>
    </section>

    <section class="grid">
      <div class="card">
        <div class="card__head">
          <h2>Thông tin chuyến đi</h2>
        </div>

        <?php $isRoundTrip = count($displayTickets) >= 2; ?>
        <?php foreach ($displayTickets as $k => $t) : ?>
          <div class="trip-block" style="<?php echo ($k > 0) ? 'margin-top:18px;' : ''; ?>">
            <?php if ($isRoundTrip) : ?>
              <div class="tag" style="display:inline-block;margin-bottom:10px;">
                <?php echo ($k === 0) ? 'CHIỀU ĐI' : 'CHIỀU VỀ'; ?>
              </div>
            <?php endif; ?>

            <div class="route">
              <div class="route__col">
                <div class="route__time"><?php echo esc_html(function_exists('getTime') ? getTime($t['pickupDate']) : $t['pickupDate']); ?></div>
                <div class="route__place"><?php echo esc_html($t['to']); ?></div>
              </div>

              <div class="route__mid">
                <div class="route__line"></div>
                <div class="route__dot"></div>
                <div class="route__dot"></div>
              </div>

              <div class="route__col route__col--right">
                <div class="route__time"><?php echo esc_html(function_exists('getTime') ? getTime($t['arrivalDate']) : $t['arrivalDate']); ?></div>
                <div class="route__place"><?php echo esc_html($t['from']); ?></div>
              </div>
            </div>

            <div class="info">
              <div class="info__item">
                <div class="info__label muted">Nhà xe</div>
                <div class="info__value"><?php echo esc_html($t['company']); ?></div>
              </div>
              <div class="info__item">
                <div class="info__label muted">Loại xe</div>
                <div class="info__value"><?php echo esc_html($t['vehicle']); ?></div>
              </div>

              <div class="info__item">
                <div class="info__label muted">Điểm đón</div>
                <div class="info__value">
                  <?php echo esc_html($t['to']); ?>
                  <?php if (!empty($t['pickup_address'])) : ?>
                    <div class="muted" style="font-size:13px;margin-top:2px;"><?php echo esc_html($t['toAddress']); ?></div>
                  <?php endif; ?>
                </div>
              </div>

              <div class="info__item">
                <div class="info__label muted">Điểm trả</div>
                <div class="info__value">
                  <?php echo esc_html($t['from']); ?>
                  <?php if (!empty($t['dropoff_transfer_name'])) : ?>
                    <div class="muted" style="font-size:13px;margin-top:2px;">Trung chuyển: <?php echo esc_html($t['dropoff_transfer_name']); ?></div>
                  <?php endif; ?>
                  <?php if (!empty($t['dropoff_address'])) : ?>
                    <div class="muted" style="font-size:13px;margin-top:2px;"><?php echo esc_html($t['dropoff_address']); ?></div>
                  <?php endif; ?>
                </div>
              </div>

              <div class="info__item">
                <div class="info__label muted">Số ghế</div>
                <div class="info__value"><?php echo esc_html($t['seatStr']); ?></div>
              </div>

              <div class="info__item">
                <div class="info__label muted">Mã vé</div>
                <div class="info__value code"><?php echo esc_html($t['ticketCodes']); ?></div>
              </div>
            </div>
          </div>
        <?php endforeach; ?>

        <div class="divider" style="margin: 20px 0 14px 0;"></div>

        <?php
        $cName  = (string)($displayTickets[0]['customer']['name'] ?? '');
        $cPhone = (string)($displayTickets[0]['customer']['phone'] ?? '');
        $cEmail = (string)($displayTickets[0]['customer']['email'] ?? '');
        ?>
        <h3 class="card__sub">Hành khách</h3>
        <div class="passenger">
          <div class="avatar"><?php echo esc_html(mb_substr($cName ?: 'K', 0, 1)); ?></div>
          <div class="passenger__meta">
            <div class="passenger__name"><?php echo esc_html($cName); ?></div>
            <div class="passenger__sub muted">
              <?php echo esc_html($cPhone); ?>
              <?php if (!empty($cEmail)) : ?> • <?php echo esc_html($cEmail); ?><?php endif; ?>
            </div>
          </div>
        </div>
      </div>

      <aside class="side">
        <div class="card card--sticky">
          <h3>Thông tin thanh toán</h3>

          <div class="price-row">
            <div class="muted">Tổng tiền</div>
            <div class="price"><?php echo esc_html(number_format((float)$totalPrice, 0, ',', '.')); ?>đ</div>
          </div>

          <?php if (!empty($paymentContent)) : ?>
            <div class="muted" style="margin-top:10px;font-size:13px;">
              Nội dung CK: <strong><?php echo esc_html($paymentContent); ?></strong>
            </div>
          <?php endif; ?>

          <div class="divider"></div>

          <div class="muted" style="font-size:13px;">
            Cần hỗ trợ? <a class="link" href="tel:19000155">Liên hệ tổng đài</a>
          </div>

          <a href="/" class="btn btn--ghost btn--full text-center" style="margin-top:12px;">Đặt thêm chuyến</a>
        </div>
      </aside>
    </section>
  </div>

  <!-- giữ nguyên style bạn đang dùng -->
  <style>
    :root {
      --card: #ffffff;
      --text: #1b4c85;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 12px;
    }

    .hero {
      display: flex;
      gap: 14px;
      align-items: flex-start;
      background: #f3fbf7;
      border: 1px solid #d3f1df;
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 18px;
    }

    .hero__icon {
      width: 42px;
      height: 42px;
      border-radius: 999px;
      background: #24c16d;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }

    .hero__content h1 {
      margin: 0 0 6px 0;
      font-size: 22px;
      color: #0d2e59;
    }

    .muted {
      color: #5b6b7b;
    }

    .status-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 10px;
    }

    .chip {
      background: #fff;
      border: 1px solid #e6eef7;
      border-radius: 999px;
      padding: 6px 10px;
      font-size: 13px;
    }

    .chip--success {
      background: #24c16d;
      color: #fff;
      border-color: #24c16d;
    }

    .grid {
      display: grid;
      grid-template-columns: 1.6fr 0.9fr;
      gap: 16px;
    }

    .card {
      background: var(--card);
      border: 1px solid #e6eef7;
      border-radius: 16px;
      padding: 16px;
    }

    .card__head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .card__head h2 {
      margin: 0;
      font-size: 18px;
      color: #0d2e59;
    }

    .tag {
      background: #eaf3ff;
      color: #0d2e59;
      border-radius: 999px;
      padding: 5px 10px;
      font-size: 12px;
      border: 1px solid #d9e8ff;
    }

    .route {
      display: grid;
      grid-template-columns: 1fr 120px 1fr;
      gap: 10px;
      align-items: center;
      margin-top: 8px;
    }

    .route__time {
      font-weight: 700;
      color: #0d2e59;
    }

    .route__place {
      margin-top: 2px;
      color: #0d2e59;
    }

    .route__col--right {
      text-align: right;
    }

    .route__mid {
      position: relative;
      height: 24px;
    }

    .route__line {
      position: absolute;
      left: 6px;
      right: 6px;
      top: 50%;
      height: 2px;
      background: #d9e8ff;
      transform: translateY(-50%);
    }

    .route__dot {
      position: absolute;
      top: 50%;
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: #0d2e59;
      transform: translateY(-50%);
    }

    .route__dot:first-of-type {
      left: 0;
    }

    .route__dot:last-of-type {
      right: 0;
    }

    .info {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-top: 14px;
    }

    .info__label {
      font-size: 12px;
    }

    .info__value {
      font-weight: 600;
      color: #0d2e59;
    }

    .code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }

    .divider {
      height: 1px;
      background: #eef3f8;
      margin: 14px 0;
    }

    .card__sub {
      margin: 0 0 10px 0;
      font-size: 16px;
      color: #0d2e59;
    }

    .passenger {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 999px;
      background: #0d2e59;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }

    .side .card--sticky {
      position: sticky;
      top: 16px;
    }

    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
    }

    .price {
      font-weight: 800;
      color: #0d2e59;
      font-size: 18px;
    }

    .btn {
      display: inline-block;
      border-radius: 12px;
      padding: 10px 12px;
      text-decoration: none;
      font-weight: 700;
    }

    .btn--ghost {
      border: 1px solid #d9e8ff;
      background: #fff;
      color: #0d2e59;
    }

    .btn--full {
      width: 100%;
    }

    .link {
      color: #0d2e59;
      text-decoration: underline;
    }

    @media (max-width:900px) {
      .grid {
        grid-template-columns: 1fr
      }

      .side .card--sticky {
        position: static
      }
    }
  </style>
<?php endif; ?>

<?php get_footer(); ?>
