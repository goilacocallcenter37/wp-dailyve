<?php

// Add custom Theme Functions here
date_default_timezone_set('Asia/Ho_Chi_Minh');
function calulateDiscount($price, $discount)
{
    if (is_numeric($price) && is_numeric($discount)) {
        $resuilt = ($price - $discount) / $price * 100;
        return round($resuilt, 0);
    }

    return 0;
}

add_action('acf/init', 'my_acf_add_options_page');
function my_acf_add_options_page()
{
    if (! function_exists('acf_add_options_page')) {
        return;
    }

    acf_add_options_page(array(
        'page_title'  => 'Slider Báo Chí',
        'menu_title'  => 'Slider Báo Chí',
        'menu_slug'   => 'cai-dat-website',
        'capability'  => 'edit_posts',
        'redirect'    => false
    ));
}

function ams_decode_points_query($key)
{
    if (empty($_GET[$key])) return [];

    $raw = wp_unslash($_GET[$key]);

    // 1) thử base64(JSON)
    $decoded = base64_decode($raw, true);
    if ($decoded !== false) {
        $json = json_decode($decoded, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            return ams_normalize_points_payload($json);
        }
    }

    // 2) thử JSON raw
    $json = json_decode($raw, true);
    if (json_last_error() === JSON_ERROR_NONE) {
        return ams_normalize_points_payload($json);
    }

    // 3) fallback legacy: CSV district1,district2,...
    $parts = array_filter(array_map('trim', explode(',', $raw)));
    return ams_normalize_points_payload($parts);
}


/**
 * Normalize payload from FE:
 * - array of objects: [{district, trip_count, ...}, ...]
 * - array of strings: ["Quận 1", "Quận 3", ...]
 * -> return array of objects chỉ gồm district + trip_count
 */
function ams_normalize_points_payload($payload)
{
    if (!is_array($payload)) return [];

    $out = [];
    foreach ($payload as $item) {
        $district = '';
        $tripCount = 0;

        if (is_string($item)) {
            $district = trim($item);
        } elseif (is_array($item)) {
            // ưu tiên field mới
            if (!empty($item['district'])) $district = trim((string)$item['district']);
            // fallback legacy (nếu FE/URL cũ)
            if ($district === '' && !empty($item['pointName'])) $district = trim((string)$item['pointName']);
            if ($district === '' && !empty($item['name'])) $district = trim((string)$item['name']);

            if (isset($item['trip_count'])) $tripCount = intval($item['trip_count']);
            elseif (isset($item['tripCount'])) $tripCount = intval($item['tripCount']);
        }

        if ($district === '') continue;

        $out[] = [
            'district' => $district,
            'trip_count' => $tripCount,
        ];
    }

    return $out;
}

function ams_point_key($p)
{
    // response mới: chỉ dùng district để lọc điểm đi/đến
    $district = isset($p['district']) ? trim((string)$p['district']) : '';
    return $district;
}

function convertDateTimeToHour($para)
{
    if (empty($para)) return '';
    $clean_para = str_replace(['h', 'H'], ':', $para);

    try {
        $date = new DateTime($clean_para);
        return $date->format('H:i');
    } catch (Exception $e) {
        return $para;
    }
}

function chay_anh_bao_chi()
{
    $bao_chi = get_field('slider_bao_chi', 'option');
    if (! $bao_chi) return;

    ob_start();
    echo '<div class="slider-container">';

    foreach ($bao_chi as $item) {
        $img_url = isset($item['img']['url']) ? $item['img']['url'] : '';

        if (isset($item['link']) && $item['link']) {
            if (is_array($item['link']) && ! empty($item['link']['url'])) {
                $link_url    = $item['link']['url'];
                $link_target = isset($item['link']['target']) ? $item['link']['target'] : '';
                $link_title  = isset($item['link']['title']) ? $item['link']['title'] : '';
            } elseif (is_string($item['link'])) {
                $link_url = $item['link'];
            }
        }

        echo '<div class="slider-row"><div class="slider-row-img">';
        if ($link_url) {
            $target_attr = $link_target ? ' target="' . esc_attr($link_target) . '"' : '';
            $rel_attr = ($link_target === '_blank') ? ' rel="noopener noreferrer"' : '';
            echo '<a class="slider-link" href="' . esc_url($link_url) . '"' . $target_attr . $rel_attr;
            if ($link_title) echo ' title="' . esc_attr($link_title) . '"';
            echo '>';
            echo '<img src="' . esc_url($img_url) . '" alt="' . esc_attr($img_url) . '">';
            echo '</a>';
        } else {
            echo '<img src="' . esc_url($img_url) . '" alt="' . esc_attr($img_alt) . '">';
        }

        echo '</div></div>';
    }

    echo '</div>';

    // Nav
    echo '<div class="slider-tyle-1-bao-chi-nav--next" aria-label="Next slide"><img src="https://object.dailyve.com/dailyve/wp-content/uploads/2025/11/arrow.png" alt="Next"></div>';
    echo '<div class="slider-tyle-1-bao-chi-nav--Prev" aria-label="Prev slide"><img src="https://object.dailyve.com/dailyve/wp-content/uploads/2025/11/arrow.png" alt="Prev"></div>';

    echo ob_get_clean();
}
add_shortcode('slide_bao_chi', 'chay_anh_bao_chi');

// Add custom Theme Functions here
add_action('wp_enqueue_scripts', 'custom_scripts', 10);

function custom_scripts()
{
    $ua = $_SERVER['HTTP_USER_AGENT'];

    if (stripos($ua, "Lighthouse") !== false || stripos($ua, "Googlebot") !== false) {
        return null;
    } else {
        if (!is_front_page()) {
            wp_enqueue_style('fancybox', '//cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css');
            wp_enqueue_script('fancybox', '//cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js', array('jquery'), '5.0.0', true);
        }

        wp_enqueue_style('font-awesome', '//cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
        wp_enqueue_style('jquery-ui', '//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.min.css');
        wp_enqueue_script('jquery-ui', '//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js', array('jquery'), '1.13.2', true);
        wp_enqueue_script('jquery-ui-touch-punch', '//cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js', array('jquery-ui'), '0.2.3', true);


        wp_enqueue_script('tcal', get_stylesheet_directory_uri() . '/assets/js/tcal.js', array('jquery'), '1.0.0', true);
        wp_enqueue_script('sweetalert2', '//cdn.jsdelivr.net/npm/sweetalert2@11', array('jquery'), '2.11', true);
        wp_enqueue_script('paginathing', get_stylesheet_directory_uri() . '/assets/js/paginathing.min.js', array('jquery'), '1.0.2', true);
        wp_enqueue_script('pagination', get_stylesheet_directory_uri() . '/assets/js/pagination.min.js', array('jquery'), '1.4.2', true);
        wp_enqueue_script('notify-js', get_stylesheet_directory_uri() . '/assets/js/notify.min.js', array('jquery'), '1.0.2', true);
        wp_enqueue_style('agjCalendar', get_stylesheet_directory_uri() . '/assets/agjCalendar/jquery.agjCalendar.min.css');
        wp_enqueue_script('agjCalendar', get_stylesheet_directory_uri() . '/assets/agjCalendar/jquery.agjCalendar.js', array('jquery'), '1.0.0', true);
        wp_enqueue_script('withPolyfill', get_stylesheet_directory_uri() . '/assets/js/withPolyfill.min.js', array('jquery'), '4.0.0', true);

        wp_enqueue_script('counter-up', get_stylesheet_directory_uri() . '/assets/js/couterup.js', array('jquery'), '1.2.0', true);
        wp_enqueue_style('static', get_stylesheet_directory_uri() . '/assets/css/static.css');
        wp_enqueue_style('toastr', get_stylesheet_directory_uri() . '/assets/css/toastr.css');
        wp_enqueue_script('custom_auth', get_stylesheet_directory_uri() . '/assets/js/auth.js', array('jquery'), '1.0.0', true);
        wp_enqueue_script('toastr_js', get_stylesheet_directory_uri() . '/assets/js/toastr.js', array('jquery'), '1.0.0', true);
    }

    //slick
    wp_enqueue_style('slick', get_stylesheet_directory_uri() . '/assets/slick/slick.css');
    wp_enqueue_script('slick', get_stylesheet_directory_uri() . '/assets/slick/slick.min.js', array('jquery'), '1.8.1', true);

    wp_enqueue_script('functions', get_stylesheet_directory_uri() . '/assets/js/functions.js', array('jquery'), '1.0.0', true);
    wp_enqueue_script('custom_ams_javascript', get_stylesheet_directory_uri() . '/assets/js/script-ams.js', array('jquery', 'jquery-ui', 'jquery-ui-touch-punch'), '1.0.1', true);


    wp_localize_script(
        'custom_ams_javascript',
        'generic_data',
        array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('ams_vexe'),
            'delete_ticket_nonce' => wp_create_nonce('ams_vexe_delete_ticket'),
            'user_id' => get_current_user_id(),
            // 'tickets' => !empty($_SESSION['tickets']) ? json_encode($_SESSION['tickets']) : [],
        )
    );

    wp_localize_script('functions', 'ajax_object', [
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('ajax_nonce')
    ]);

    wp_localize_script(
        'custom_auth',
        'auth_data',
        array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'send_otp_nonce' => wp_create_nonce('customer_send_otp_nonce'),
            'verify_otp_nonce' => wp_create_nonce('customer_verify_otp_nonce'),
            'nonce' => wp_create_nonce('auth_nonce'),
        )
    );
}

add_filter('script_loader_tag', function ($tag, $handle) {
    $defer_scripts = ['fancybox', 'sweetalert2', 'toastr_js', 'notify-js', 'paginathing', 'pagination', 'counter-up', 'autocomplete-search-form'];
    if (in_array($handle, $defer_scripts)) {
        return str_replace(' src', ' defer src', $tag);
    }
    return $tag;
}, 10, 2);

add_filter('rank_math/frontend/robots', function ($robots) {
    if (!empty($_GET)) {
        $robots['index'] = 'noindex';
        $robots['follow'] = 'follow';
    }
    return $robots;
});

add_action('wp_head', function () {
    echo '<link rel="preload" as="font" href="/wp-content/themes/flatsome-child/assets/fonts/OpenSans/OpenSans.woff2" type="font/woff2" crossorigin="anonymous">';
    echo '<link rel="preload" as="font" href="/wp-content/themes/flatsome-child/assets/fonts/OpenSans/OpenSans-Bold.woff2" type="font/woff2" crossorigin="anonymous">';
    echo '<link rel="preload" as="font" href="/wp-content/themes/flatsome-child/assets/fonts/Diavlo/Diavlo-Medium.woff2" type="font/woff2" crossorigin="anonymous">';
    echo '<link rel="preload" as="font" href="/wp-content/themes/flatsome-child/assets/fonts/OpenSans/OpenSans-Light.woff2" type="font/woff2" crossorigin="anonymous">';
});

function add_hidden_title_homepage()
{
    if (is_front_page()) {
        echo '<h1 style="height: 0; opacity: 0; width: 0;">' . get_the_title() . '</h1>';
    }
}
add_shortcode('hidden_title_homepage', function () {
    if (is_front_page()) {
        return '<h1 style="height: 0; opacity: 0; width: 0;">' . get_the_title() . '</h1>';
    }
    return '';
});

// add_filter('wp_get_attachment_image_attributes', function($attr, $attachment){
//   if ($attachment->ID === 19915) {
//     $attr['loading'] = 'eager';
//     $attr['fetchpriority'] = 'high';
//     $attr['decoding'] = 'async';
//   }
//   return $attr;
// }, 10, 2);

add_action('template_redirect', function () {
    // if (is_admin()) return;

    $uri = $_SERVER['REQUEST_URI'] ?? '/';
    $path = parse_url($uri, PHP_URL_PATH) ?: '/';

    if (
        strpos($path, '/wp-admin/') === 0 ||
        strpos($path, '/wp-includes/') === 0 ||
        strpos($path, '/wp-content/') === 0 ||
        strpos($path, '/feed/') === 0 ||
        strpos($path, '/wp-json/') === 0
    ) {
        return;
    }

    $lower_path = mb_strtolower($path, 'UTF-8');
    if ($path !== $lower_path) {
        $qs = isset($_SERVER['QUERY_STRING']) && $_SERVER['QUERY_STRING'] !== '' ? ('?' . $_SERVER['QUERY_STRING']) : '';
        wp_redirect(home_url($lower_path) . $qs, 301);
        exit;
    }
}, 1);

add_action('template_redirect', function () {
    if (!is_page('dat-ve-truc-tuyen') || !isset($_GET['to'], $_GET['from'])) {
        return;
    }

    $to = $_GET['to'];
    $from = $_GET['from'];

    if (empty($to) || empty($from)) {
        return;
    }

    $cache_key = "route_lookup_{$from}_{$to}";
    $post_id = wp_cache_get($cache_key, 'route_cache');

    if ($post_id === false) {
        global $wpdb;
        $post_id = $wpdb->get_var($wpdb->prepare("
            SELECT p.ID 
            FROM {$wpdb->posts} p
            INNER JOIN {$wpdb->postmeta} pm1 ON p.ID = pm1.post_id 
            INNER JOIN {$wpdb->postmeta} pm2 ON p.ID = pm2.post_id
            WHERE p.post_type = 'page' 
            AND p.post_parent = 15738
            AND p.post_status = 'publish'
            AND pm1.meta_key = 'routes_destination_point' 
            AND pm1.meta_value = %s
            AND pm2.meta_key = 'routes_departure_point' 
            AND pm2.meta_value = %s
            LIMIT 1
        ", $to, $from));

        // Cache kết quả trong 24 giờ
        if ($post_id) {
            wp_cache_set($cache_key, $post_id, 'route_cache', HOUR_IN_SECONDS * 24);
        }
    }

    if (!$post_id) {
        return;
    }

    $base_url = get_permalink($post_id);
    $params = [];

    if (!empty($_GET['date'])) {
        $params['date'] = sanitize_text_field($_GET['date']);
    }

    if (!empty($_GET['returnDate'])) {
        $params['returnDate'] = sanitize_text_field($_GET['returnDate']);
    }

    $redirect_url = $params ? $base_url . '?' . http_build_query($params) : $base_url;

    wp_redirect($redirect_url, 301);
    exit;
});

add_action('wp_head', function () {
    if (is_paged()) {
        global $wp;
        $current_url = home_url(add_query_arg([], $wp->request));

        // Lấy link trang gốc (không có /page/x/)
        $canonical_url = preg_replace('#/page/[0-9]+/?$#', '/', $current_url);

        echo '<link rel="canonical" href="' . esc_url($canonical_url) . "\" />\n";
    }
}, 2);


add_filter('the_content', 'custom_shortcode_for_child_pages');

function custom_shortcode_for_child_pages($content)
{
    if (is_page() && wp_get_post_parent_id(get_the_ID()) == 15738) {
        if (isset($_SESSION['tickets'])) {
            unset($_SESSION['tickets']);
        }
        $departure = get_field('routes_departure_point');
        $destination = get_field('routes_destination_point');
        // var_dump($field);
        wp_enqueue_script('autocomplete-search-form', get_stylesheet_directory_uri() . '/assets/js/autocompleteSearchForm.js', array('jquery'), null, true);
        wp_localize_script('autocomplete-search-form', 'searchData', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'fromId' => $departure,
            'toId' => $destination,
        ));

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
                'title' => 'Tuyến đường',
                'url' => home_url('/ve-xe-khach/tuyen-duong/')
            ),
            array(
                'title' => $current_title,
                'url' => ''
            )
        );

        $breadcrumb_html = '<ul class="breadcrumb">';
        foreach ($breadcrumbs as $crumb) {
            if ($crumb['url'] == '') {
                $breadcrumb_html .= '<li aria-current="page">' . $crumb['title'] . '</li>';
            } else {
                $breadcrumb_html .= '<li><a href="' . $crumb['url'] . '">' . $crumb['title'] . '</a></li>';
            }
        }
        $breadcrumb_html .= '</ul>';

        $QA = get_field('list_question_answer');
        $contentQA = '<div class="accordion">';
        if (!empty($QA)) {
            foreach ($QA as $item) {
                $contentQA .= '<div class="accordion-item">
                    <a class="accordion-title plain" aria-expanded="false">
                        <button class="toggle"><i class="icon-angle-down"></i></button>
                        ' . $item['route_question'] . '
                    </a>
                    <div class="accordion-inner">
                          <p class="qa-answer">' . $item['route_answer'] . '</p>
                    </div>
                </div>';
            }
        } else {
            $contentQA .= '<p>Đang cập nhật...</p>';
        }

        $contentQA .= '</div>';

        $shortcodeSearch = do_shortcode('[bmd_old_search_form]');
        $shortcodeRoute = do_shortcode('[bus_booking auto_load="true" show_loader="true"]');
        $content = '<div>' . $breadcrumb_html . '</div>' . $shortcodeSearch . '<div class="container online-booking__search-form">
        <div id="Info" class="w-100">
            <div class="tl f4 ttn" style="text-align: center; width: 100%; padding: 10px 0;">
                <h1 style="margin: 0; font-size: 24px; color: var(--fs-color-success);">' . get_the_title() . '</h1>
            </div>
        </div>
    </div>' . $shortcodeRoute . '<div class="content-table">' . $content . '</div><div class="content-qa">
        <div class="accordion_title_custom">Tham khảo thêm một số ' . $current_title . '</div>' . $contentQA . '
    </div>';
    }
    return $content;
}

function convertIdToSlug($from, $to, $company = '')
{
    $nameFromSlug = vietnamese_string_to_slug($from['name']);
    $nameToSlug = vietnamese_string_to_slug($to['name']);

    if (!empty($company)) {
        $companyName = $company['name'];
        $companyId = $company['value'];
        if (!empty($companyName)) {
            $companyNameSlug = vietnamese_string_to_slug($companyName);
            return home_url('/ve-xe-khach-' . $companyNameSlug . '-tu-' . $nameFromSlug . '-di-' . $nameToSlug . '-' . $companyId . '-' . $from['id'] . 't' . $to['id'] . '.html?date=');
        } else {
            return home_url('/ve-xe-khach-tu-' . $nameFromSlug . '-di-' . $nameToSlug . '-' . $from['id'] . 't' . $to['id'] . '.html?date=');
        }
    } else {
        return home_url('/ve-xe-khach-tu-' . $nameFromSlug . '-di-' . $nameToSlug . '-' . $from['id'] . 't' . $to['id'] . '.html?date=');
    }
}

function stringToPhone($phone)
{
    return preg_replace('/[^0-9]/', '', $phone);
}

if (function_exists('acf_add_options_page')) {

    acf_add_options_page(
        array(
            'page_title' => 'Q&A Nhà xe',
            'menu_title' => 'Q&A Nhà xe',
            'menu_slug' => 'qa-nha-xe',
            'capability' => 'edit_posts',
            'redirect' => false
        )
    );

    // acf_add_options_page(
    //     array(
    //         'page_title' => 'Tuyến xe phổ biến',
    //         'menu_title' => 'Tuyến xe phổ biến',
    //         'menu_slug' => 'tuyen-xe-pho-bien',
    //         'capability' => 'edit_posts',
    //         'redirect' => false
    //     )
    // );
}

function dailyve_ux_builder_element()
{
    add_ux_builder_shortcode('dailyve_card_element', array(
        'name' => __('Card System'),
        'category' => __('Content'),
        'priority' => 1,
        'options' => array(
            'image' => array(
                'type' => 'image',
                'heading' => __('Icon'),
                'default' => '',
                'description' => __('Upload an image for the card.'),
            ),
            'text' => array(
                'type' => 'textfield',
                'holder' => 'button',
                'heading' => 'Tiêu đề',
                'param_name' => 'text',
                'focus' => 'false',
                'value' => 'Button',
                'default' => '',
                'auto_focus' => false,
            ),
            'letter_case' => array(
                'type' => 'radio-buttons',
                'heading' => 'Letter Case',
                'default' => 'lowercase',
                'options' => array(
                    'uppercase' => array('title' => 'ABC'),
                    'lowercase' => array('title' => 'Abc'),
                ),
            ),
            'additional_text' => array(
                'type' => 'textarea',
                'holder' => 'button',
                'heading' => 'Content',
                'param_name' => 'additional_text',
                'focus' => 'false',
                'value' => 'Additional Button Text',
                'default' => '',
                'auto_focus' => false,
                'editor' => true,
            ),
            'list_card' => array(
                'type' => 'textarea',
                'holder' => 'button',
                'heading' => 'List',
                'param_name' => 'list_card',
                'focus' => 'false',
                'value' => 'List Button Text',
                'default' => '',
                'auto_focus' => false,
                'editor' => true,
            ),
            'link' => array(
                'type' => 'textfield',
                'heading' => 'Link',
                'param_name' => 'link',
                'default' => '',
                'description' => __('Enter a link for the card.'),
            ),
            'class' => array(
                'type' => 'textfield',
                'heading' => 'Class',
                'param_name' => 'class',
                'default' => '',
            ),
        ),
    ));


    add_ux_builder_shortcode('dailyve_card_route_element', array(
        'name' => __('Card Tuyến Đường'),
        'category' => __('Content'),
        'priority' => 2,
        'options' => array(
            'image' => array(
                'type' => 'image',
                'heading' => __('Hình ảnh'),
                'default' => '',
                'description' => __('Upload an image for the card.'),
            ),
            'text' => array(
                'type' => 'textfield',
                'holder' => 'button',
                'heading' => 'Tiêu đề',
                'param_name' => 'text',
                'focus' => 'false',
                'value' => 'Button',
                'default' => '',
                'auto_focus' => false,
            ),
            'letter_case' => array(
                'type' => 'radio-buttons',
                'heading' => 'Letter Case',
                'default' => 'lowercase',
                'options' => array(
                    'uppercase' => array('title' => 'ABC'),
                    'lowercase' => array('title' => 'Abc'),
                ),
            ),
            'price' => array(
                'type' => 'textfield',
                'holder' => 'button',
                'heading' => 'Giá',
                'param_name' => 'price',
                'focus' => 'true',
                'value' => '',
                'default' => '',
                'auto_focus' => false,
            ),
            'discount' => array(
                'type' => 'textfield',
                'holder' => 'button',
                'heading' => 'Giá khuyến mãi',
                'param_name' => 'discount',
                'focus' => 'true',
                'value' => '',
                'default' => '',
                'auto_focus' => false,
            ),
            'link' => array(
                'type' => 'textfield',
                'heading' => 'Link',
                'param_name' => 'link',
                'default' => '',
                'description' => __('Enter a link for the card.'),
            ),
            'class' => array(
                'type' => 'textfield',
                'heading' => 'Class',
                'param_name' => 'class',
                'default' => '',
            ),
        ),
    ));

    add_ux_builder_shortcode('dailyve_tabs_news_element', array(
        'name' => __('Tabs Tin tức'),
        'category' => __('Content'),
        'priority' => 2,
        'options' => array(
            'title' => array(
                'type' => 'textfield',
                'holder' => 'button',
                'heading' => 'Tiêu đề',
                'param_name' => 'title',
                'focus' => 'false',
                'value' => 'Button',
                'default' => '',
                'auto_focus' => false,
            ),
            'categories' => array(
                'type' => 'select',
                'heading' => 'Chuyên mục bài viết',
                'param_name' => 'categories',
                'value' => '',
                'default' => '',
                'options' => array(
                    'name' => 'Name',
                    'slug' => 'Slug',
                    'term_group' => 'Term Group',
                    'term_id' => 'Term ID',
                    'taxonomy' => 'Taxonomy',
                    'description' => 'Description',
                    'parent' => 'Parent',
                    'count' => 'Count',
                    'filter' => 'Filter',
                ),
                'config' => array(
                    'multiple' => true,
                    'placeholder' => 'Select..',
                    'termSelect' => array(
                        // 'post_type' => 'product_cat',
                        'taxonomies' => 'category'
                    ),
                )
            ),
            'class' => array(
                'type' => 'textfield',
                'heading' => 'Class',
                'param_name' => 'class',
                'default' => '',
            ),
        ),
    ));
}
// add_action('ux_builder_setup', 'dailyve_ux_builder_element');

function dailyve_card_element_func($atts)
{

    extract(shortcode_atts(array(
        'text' => '',
        'image' => '',
        'letter_case' => '',
        'additional_text' => '',
        'list_card' => '',
        'link' => '',
        'class' => ''
    ), $atts));

    if (!empty($image) && is_numeric($image)) {
        $image = wp_get_attachment_url($image);
    }

    ob_start();
?>
    <div class="dailyve-card-element <?php echo $class; ?>">
        <div class="dailyve-card__header">
            <?php if (!empty($image)): ?>
                <img src="<?php echo esc_url($image); ?>" alt="Card Icon">
            <?php endif; ?>
            <?php if (!empty($text)): ?>
                <h3 class="<?= $letter_case ?>"><?= $text; ?></h3>
            <?php endif; ?>
        </div>
        <?php if (!empty($additional_text)): ?>
            <div class="dailyve-card__content">
                <?php echo $additional_text; ?>
            </div>
        <?php endif; ?>
        <div class="lvn-divider"></div>
        <?php if (!empty($list_card)): ?>
            <div class="dailyve-card__list">
                <?php echo $list_card; ?>
            </div>
        <?php endif; ?>
        <?php if (!empty($link)): ?>
            <a href="<?php echo esc_url($link); ?>" class="btn-detail-dailyve button">Xem chi tiết <i
                    style="margin-left: 5px; line-height: 18px; font-size: 15px;" class="fas fa-external-link-alt"></i></a>
        <?php endif; ?>
    </div>
<?php
    return ob_get_clean();
}
add_shortcode('dailyve_card_element', 'dailyve_card_element_func');

function dailyve_card_route_element_func($atts)
{
    extract(shortcode_atts(array(
        'text' => '',
        'image' => '',
        'letter_case' => '',
        'price' => '',
        'discount' => '',
        'link' => '',
        'class' => ''
    ), $atts));

    if (!empty($image) && is_numeric($image)) {
        $image = wp_get_attachment_url($image);
    }

    ob_start();
?>
    <div class="box-route-item <?php echo $class; ?>">
        <div class="dailyve-card-route">
            <a class="card-main" href="<?= esc_url($link); ?>" title="<?= !empty($text) ? $text : ''; ?>">
                <div class="dailyve-card__header">
                    <?php if (!empty($image)): ?>
                        <img src="<?php echo esc_url($image); ?>" alt="<?= !empty($text) ? $text : ''; ?>">
                    <?php endif; ?>
                    <?php if (!empty($discount) && is_numeric($discount) && !empty($price) && is_numeric($price)): ?>
                        <div class="position-badge">
                            <div class="badge-discount">Tiết kiệm <?= calulateDiscount($price, $discount); ?>%</div>
                            <div class="badge-end"></div>
                        </div>
                    <?php endif; ?>
                </div>
                <div class="dailyve-card__content">
                    <?php if (!empty($text)): ?>
                        <h3 class="<?= $letter_case ?>"><?= $text; ?></h3>
                    <?php endif; ?>
                    <?php if (!empty($price) && is_numeric($price)): ?>
                        <div class="dailyve-card__content-price">
                            <div class="<?= empty($discount) ? 'price-primary' : 'underline-price'; ?>">
                                <?= number_format($price, 0, ',', '.'); ?> VND
                            </div>
                            <?php if (!empty($discount) && is_numeric($discount)): ?>
                                <h4 class="price-primary"><?= number_format($discount, 0, ',', '.'); ?> VND</h4>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>
                </div>
                <?php if (!empty($list_card)): ?>
                    <div class="dailyve-card__list">
                        <?php echo $list_card; ?>
                    </div>
                <?php endif; ?>
            </a>
        </div>
    </div>
<?php
    return ob_get_clean();
}

add_shortcode('dailyve_card_route_element', 'dailyve_card_route_element_func');

function dailyve_tabs_news_element_func($atts)
{
    extract(shortcode_atts(array(
        'title' => '',
        'letter_case' => '',
        'categories' => '',
        'class' => ''
    ), $atts));

    ob_start();
    $listCategory = get_categories(array(
        'order' => 'DESC',
        // 'hide_empty' => false,
        'include' => $categories,
    ));
?>

    <div class="news-content-custom">
        <div class="tabs-top">
            <div class="tabs-info">
                <h2 class="title-news-home"><?= !empty($title) ? $title : 'Tin tức sự kiện' ?></h2>
                <div class="tabs-navigation">
                    <ul class="tabs-list">
                        <?php foreach ($listCategory as $key => $category) { ?>
                            <li class="<?= $key === 0 ? 'active' : ''; ?>" id="category-<?= $category->term_id; ?>"
                                tabs-cat-id="<?= $category->term_id; ?>"><?= esc_html($category->name); ?></li>
                        <?php } ?>
                    </ul>
                </div>
            </div>
            <a href="#" class="see-more">Xem tất cả</a>
        </div>
        <?php foreach ($listCategory as $key => $category) {
            $posts = get_posts(array(
                'numberposts' => 6,
                'category' => $category->term_id,
                'orderby' => 'ID',
                'order' => 'DESC',
            ));

            // echo '<pre>';
            // print_r($posts);
            // echo '</pre>';
        ?>
            <div class="news-all-tab-content <?= $key === 0 ? 'active' : '' ?>" id="psc-<?= $category->term_id; ?>">
                <div class="news-all-detail">
                    <div class="news-content__left">
                        <?php if (!empty($posts[0])): ?>
                            <div class="news-content__item">
                                <a href="<?= get_permalink($posts[0]->ID); ?>" class="news-content__link">
                                    <div class="news-content__item-images img-hover">
                                        <picture>
                                            <img src="<?= get_the_post_thumbnail_url($posts[0]->ID); ?>"
                                                alt="<?= $posts[0]->post_title; ?>">
                                        </picture>
                                    </div>
                                    <div class="news-content__intro">
                                        <div class="boxs">
                                            <div>
                                                <span><?= get_the_date('l, d/m/Y', $posts[0]->ID); ?></span>
                                            </div>
                                            <a href="<?= get_category_link($category->term_id); ?>" class="news_type">Tất cả</a>
                                        </div>
                                        <a href="<?= get_permalink($posts[0]->ID); ?>">
                                            <h3><?= $posts[0]->post_title; ?></h3>
                                        </a>
                                        <div class="brief text-line-2">
                                            <?= get_the_excerpt($posts[0]->ID); ?>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        <?php endif; ?>
                    </div>
                    <ul class="news-content__right scroller">
                        <?php for ($i = 1; $i < count($posts); $i++): ?>
                            <li class="news-content__item">
                                <a href="<?= get_permalink($posts[$i]->ID); ?>" class="news-content__link">
                                    <div class="news-content__item-images">
                                        <picture>
                                            <img src="<?= get_the_post_thumbnail_url($posts[$i]->ID); ?>"
                                                alt="<?= $posts[$i]->post_title; ?>">
                                        </picture>
                                    </div>
                                    <div class="news-content__intro">
                                        <h3><?= $posts[$i]->post_title; ?></h3>
                                        <div class="brief text-line-2">
                                            <?= get_the_excerpt($posts[$i]->ID); ?>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        <?php endfor; ?>
                    </ul>
                </div>
            </div>
        <?php } ?>
    </div>

<?php return ob_get_clean();
}

add_shortcode('dailyve_tabs_news_element', 'dailyve_tabs_news_element_func');

//dự phòng
function custom_slider_render($atts = array(), $content = null)
{
    // $atts = shortcode_atts(array(
    //     'text_color' => 'rgb(0, 0, 0)',
    //     'outerglow_color' => 'rgb(225, 255, 255)',
    // ), $atts);
    // style="color: <?php echo esc_attr($atts['text_color']);"
    ob_start(); ?>
    <div class="custom-slider">
        <div class="silde-route-home">
            <?php echo do_shortcode($content); ?>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
// add_shortcode('custom_slider', 'custom_slider_render');

//SHORTCODE SILDE REVIEW COMPANY 
add_shortcode('silde_company_reviews', 'slide_company_reviews_func');

function slide_company_reviews_func($atts)
{
    $numPost = 10;
    if (isset($atts['numPost'])) {
        $numPost = $atts['numPost'];
    }

    $args = array(
        'post_type' => 'company-review',
        'posts_per_page' => $numPost,
    );
    $query = new WP_Query($args);
    $output = '';
    if ($query->have_posts()) {
        $output = '<div class="silde-company-reviews">';
        while ($query->have_posts()) {
            $query->the_post();
            $logo_id = get_field('logo', get_the_ID());
            $full_name = get_field('full_name', get_the_ID());
            $role = get_field('role', get_the_ID());
            $logo_url = wp_get_attachment_url($logo_id);
            $output .= '<div class="silde-company-reviews__item">
                            <div class="silde-company-reviews__item-header">
                                <div class="">
                                    <picture>
                                        <img src="' . esc_url($logo_url) . '" alt="' . get_the_title() . '">
                                    </picture>
                                </div>
                                <div class="full-name">
                                    <strong>' . $full_name . '</strong>
                                </div>
                                <div class="role">' . $role . '</div>
                            </div>
                            <div class="silde-company-reviews__item-main">
                                <h3>' . get_the_title() . '</h3>
                            </div>
                            <div class="silde-company-reviews__item-footer">
                                ' . get_the_excerpt() . '
                            </div>
                            <a href="' . get_permalink() . '" class="btn_slide_review" title="' . get_the_title() . '">Tìm hiểu thêm</a>
                        </div>';
        }
        $output .= '</div>';
    }
    wp_reset_postdata();
    return $output;
}



function routes_popular_func()
{
    $results = null;
    $routes_popular = get_field('popular_routes', 'option');

    if ($routes_popular) {
        ob_start();
    ?>
        <div class="silde-route-popular">
            <?php foreach ($routes_popular as $key => $route) { ?>
                <div class="box-item">
                    <div style="background-image: url(<?= $route['popular_route_image']; ?>);" class="box-item__bg">
                        <div class="box-item__layer">
                            Tuyến xe từ<br>
                            <strong><?= $route['popular_departure']['label']; ?></strong>
                        </div>
                    </div>
                    <div class="box-item__content">
                        <?php for ($i = 0; $i < count($route['popular_destinations']); $i++) { ?>
                            <div class="box-item__content__index">
                                <a href="<?= convertIdToSlug($route['popular_departure'], $route['popular_destinations'][$i]['popular_destination']); ?>"
                                    class="flex box-item__content__index__wrap">
                                    <div class="box-item__content__index__info">
                                        <div class="box-item__content__index__title">
                                            <?= $route['popular_destinations'][$i]['popular_destination']['label']; ?>
                                        </div>
                                        <p class="box-item__content__index__desc">
                                            <?= $route['popular_destinations'][$i]['popular_destination_km']; ?> -
                                            <?= $route['popular_destinations'][$i]['popular_destination_time']; ?>
                                        </p>
                                    </div>
                                    <div class="box-item__content__index__price">
                                        <span><?= $route['popular_destinations'][$i]['popular_destination_price']; ?></span>
                                        <span>Đặt vé</span>
                                    </div>
                                </a>
                            </div>
                        <?php } ?>
                    </div>
                </div>

            <?php } ?>
        </div>
        <?php $results = ob_get_clean();
    }
    return $results;
}
add_shortcode('routes_popular', 'routes_popular_func');

// New Home Page
function show_posts_by_category($atts)
{
    $atts = shortcode_atts(array(
        'category_id' => 0,
        'posts_per_page' => 10,
        'orderby' => 'date',
        'order' => 'DESC'
    ), $atts);

    $args = array(
        'cat' => $atts['category_id'],
        'posts_per_page' => $atts['posts_per_page'],
        'orderby' => $atts['orderby'],
        'order' => $atts['order'],
        'no_found_rows' => false,
        'update_post_meta_cache' => true,
        'update_post_term_cache' => false,
        'post_status' => 'publish'
    );

    $query = new WP_Query($args);

    ob_start();

    if ($query->have_posts()) {
        echo '<div class="category-posts-list-slide">';

        $count = 0;

        while ($query->have_posts()) {
            $query->the_post();
            $count++;
            $attr = array();

            if ($count <= 1) {
                $attr['fetchpriority'] = 'high';
                $attr['loading'] = 'eager'; // tắt lazy load
            }
        ?>
            <div id="post-<?php the_ID(); ?>" style="padding: 10px;">
                <div class="post-thumbnail shine">
                    <?php if (has_post_thumbnail()): ?>
                        <a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>">
                            <?php the_post_thumbnail('medium', $attr); ?>
                        </a>
                    <?php endif; ?>
                </div>
            </div>
        <?php
        }

        echo '</div>';

        wp_reset_postdata();
    } else {
        echo '<p>No posts found in this category.</p>';
    }

    return ob_get_clean();
}
add_shortcode('category_posts', 'show_posts_by_category');

add_filter('posts_fields', function ($fields, \WP_Query $query) {
    global $wpdb;

    if (isset($query->query_vars['my_custom_query']) && $query->query_vars['my_custom_query']) {
        $fields = "$wpdb->posts.ID, 
                   $wpdb->posts.post_title, 
                   $wpdb->posts.post_excerpt";
    }

    return $fields;
}, 10, 2);

function show_post_gird_layout($attr)
{
    $atts = shortcode_atts([
        'type' => '',
        'post_type' => 'page',
        'page_parent_id' => 0,
        'posts_per_page' => 30,
        'orderby' => 'ID',
        'order' => 'DESC',
        'is_address' => 'false'
    ], $attr);

    $paged = get_query_var('paged') ? get_query_var('paged') : 1;

    $cache_key = 'post_grid_' . md5(serialize($atts)) . '_' . $paged;
    $output = get_transient($cache_key);

    if ($output === false) {
        $args = [
            'post_type' => $atts['post_type'],
            'posts_per_page' => $atts['posts_per_page'],
            'orderby' => $atts['orderby'],
            'order' => $atts['order'],
            'post_status' => 'publish',
            'post_parent' => $atts['page_parent_id'],
            'paged' => $paged,
            'no_found_rows' => false,
            'update_post_meta_cache' => true, // TỐI ƯU: cache meta data
            'update_post_term_cache' => false, // TỐI ƯU: không cần term cache
            'meta_key' => '_thumbnail_id',
            'fields' => 'ids'
        ];

        $posts_query = new WP_Query($args);
        if ($posts_query->have_posts()) {
            $post_ids = $posts_query->posts;

            $full_args = [
                'post_type' => $atts['post_type'],
                'post__in' => $post_ids,
                'orderby' => 'post__in',
                'posts_per_page' => -1,
                'no_found_rows' => true,
                'update_post_meta_cache' => true,
                'update_post_term_cache' => false,
            ];

            $full_query = new WP_Query($full_args);

            // Pre-load meta data cho tất cả posts cùng lúc
            $meta_keys = ['routes_price', 'routes_distance', 'routes_time', 'company_address'];
            if ($atts['type'] === 'tuyenduong' || $atts['is_address'] === 'true') {
                update_meta_cache('post', $post_ids);
                foreach ($meta_keys as $key) {
                    wp_cache_add_multiple(
                        array_fill_keys(
                            array_map(function ($id) use ($key) {
                                return $id . '_' . $key;
                            }, $post_ids),
                            false
                        ),
                        'post_meta'
                    );
                }
            }

            $isAddress = $atts['is_address'] === 'true';

            ob_start();
            echo '<div class="posts-list--grid">';

            while ($full_query->have_posts()) {
                $full_query->the_post();
                echo renderPostContent($atts['type'], $isAddress);
            }

            echo '</div>';

            // Pagination
            $total_pages = $posts_query->max_num_pages;
            if ($total_pages > 1) {
                echo '<div class="pagination-wrapper"><div class="pagination">';
                echo paginate_links([
                    'base' => trailingslashit(get_pagenum_link(1)) . '%_%',
                    'format' => 'page/%#%/',
                    'current' => $paged,
                    'total' => $total_pages,
                    'prev_text' => '<i class="fas fa-chevron-left"></i>',
                    'next_text' => '<i class="fas fa-chevron-right"></i>',
                    'type' => 'list',
                    'mid_size' => 2,
                    'end_size' => 1,
                    'before_page_number' => '<span class="page-number">',
                    'after_page_number' => '</span>'
                ]);
                echo '</div></div>';
            }

            wp_reset_postdata();
        } else {
            echo '<p>Đang cập nhật.</p>';
        }

        $output = ob_get_clean();

        set_transient($cache_key, $output, HOUR_IN_SECONDS * 6);
    }

    return $output;
}

add_shortcode('show_list_post', 'show_post_gird_layout');

function show_post_by_type_and_id($attr)
{
    $atts = shortcode_atts([
        'type' => '',
        'post_type' => 'page',
        'page_parent_id' => 0,
        'posts_per_page' => 12,
        'orderby' => 'ID',
        'order' => 'DESC',
    ], $attr);

    $args = [
        'post_type' => $atts['post_type'],
        'posts_per_page' => $atts['posts_per_page'],
        'orderby' => $atts['orderby'],
        'order' => $atts['order'],
        'post_status' => 'publish',
        'post_parent' => $atts['page_parent_id'],
        'update_post_meta_cache' => true,
        'update_post_term_cache' => false,
        'no_found_rows' => true,
    ];

    ob_start();
    $posts_query = new WP_Query($args);

    if ($posts_query->have_posts()): ?>
        <div class="posts-list-slide">
            <?php while ($posts_query->have_posts()):
                $posts_query->the_post(); ?>
                <?= renderPostContent($atts['type']) ?>
            <?php endwhile; ?>
        </div>
    <?php wp_reset_postdata();
    else: ?>
        <p>Đang cập nhật.</p>
    <?php endif;

    return ob_get_clean();
}

add_shortcode('show_post_page', 'show_post_by_type_and_id');

function show_post_book_ticket_company($atts)
{
    $atts = shortcode_atts([
        'post-type' => 'page',
        'posts_per_page' => 12,
        'orderby' => 'ID',
        'order' => 'DESC'
    ], $atts);

    // Helper function tạo query args chung
    $getBaseArgs = function ($postType, $postParent = 0, $hasOutstanding = true) use ($atts) {

        $args = [
            'post_type' => $postType,
            'posts_per_page' => $atts['posts_per_page'],
            'orderby' => $atts['orderby'],
            'order' => $atts['order'],
            'post_status' => 'publish',
            'post_parent' => $postParent,
            'no_found_rows' => true,
        ];

        if ($hasOutstanding) {
            $args['meta_query'][] = [
                'key' => 'outstanding',
                'value' => true,
                'compare' => '='
            ];
        }

        return $args;
    };

    // Tạo các query args
    $queries = [
        'tuyenduong' => $getBaseArgs($atts['post-type'], 15738, true),
        'nhaxe' => $getBaseArgs($atts['post-type'], 15764, true),
        'benxe' => $getBaseArgs($atts['post-type'], 15896, true)
    ];

    ob_start(); ?>

    <div class="lvn-tab-content">
        <div class="lvn-tab-content__title">
            <button class="lvn-tab-item active" onclick="openTabs(event, 'tuyenduong')">Tuyến đường</button>
            <button class="lvn-tab-item" onclick="openTabs(event, 'nhaxe')">Nhà xe</button>
            <button class="lvn-tab-item" onclick="openTabs(event, 'benxe')">Bến xe</button>
        </div>
        <!-- <div class="lvn-tab-content__seemore">
            <a href="<?php // echo home_url('/ve-xe-khach/'); 
                        ?>">Xem thêm dịch vụ</a>
        </div> -->
    </div>

    <?php foreach (['tuyenduong', 'nhaxe', 'benxe'] as $index => $tabType): ?>
        <div id="<?= $tabType ?>" class="lvn_tab_custom" <?= $index > 0 ? 'style="display:none"' : '' ?>>
            <?php
            $posts_query = new WP_Query($queries[$tabType]);

            if ($posts_query->have_posts()): ?>
                <div class="posts-list-slide">
                    <?php while ($posts_query->have_posts()):
                        $posts_query->the_post(); ?>
                        <?= renderPostContent($tabType) ?>
                    <?php endwhile; ?>
                </div>
            <?php wp_reset_postdata();
            else: ?>
                <p>Đang cập nhật.</p>
            <?php endif; ?>
        </div>
    <?php endforeach; ?>

    <?php return ob_get_clean();
}

// Helper functions để render content
function renderPostContent($type, $isAddress = false)
{
    $post_id = get_the_ID();

    $cache_key = 'post_render_' . $post_id . '_' . md5($type . ($isAddress ? '1' : '0'));
    $content = wp_cache_get($cache_key, 'post_renders');

    if ($content === false) {
        ob_start();
    ?>
        <div class="tuyen-duong-item">
            <?php
            // TỐI ƯU: Chỉ lấy thumbnail khi cần
            if (has_post_thumbnail($post_id)) {
                $thumb = get_the_post_thumbnail($post_id, 'medium', [
                    'loading' => 'lazy',
                    'decoding' => 'async'
                ]);
            ?>
                <picture class="post-thumbnail">
                    <a href="<?php echo esc_url(get_permalink($post_id)); ?>"
                        title="<?php echo esc_attr(get_the_title($post_id)); ?>">
                        <?php echo $thumb; ?>
                    </a>
                </picture>
            <?php
            }
            ?>

            <div class="tuyen-duong-item__content">
                <?php
                if ($type === 'tuyenduong') {
                    echo renderTuyenDuongContent($post_id);
                } else {
                    echo renderGenericContent($post_id, $isAddress);
                }
                ?>
            </div>
        </div>
    <?php
        $content = ob_get_clean();

        wp_cache_set($cache_key, $content, 'post_renders', HOUR_IN_SECONDS * 2);
    }

    return $content;
}


function renderTuyenDuongContent($post_id = null)
{
    if (!$post_id)
        $post_id = get_the_ID();

    // Cache meta values
    static $meta_cache = [];
    if (!isset($meta_cache[$post_id])) {
        $meta_cache[$post_id] = [
            'price' => get_field('routes_price', $post_id),
            'distance' => get_field('routes_distance', $post_id),
            'time' => get_field('routes_time', $post_id)
        ];
    }
    $meta = $meta_cache[$post_id];

    ob_start();
    ?>
    <div class="tuyen-duong-item__content__title">
        <h3 class="one-line">
            <a href="<?php echo esc_url(get_permalink($post_id)); ?>"
                title="<?php echo esc_attr(get_the_title($post_id)); ?>">
                <?php echo get_the_title($post_id); ?>
            </a>
        </h3>
        <?php if ($meta['price']): ?>
            <span><?php echo number_format($meta['price'], 0, ',', '.') ?>đ</span>
        <?php endif; ?>
    </div>
    <div class="tuyen-duong-item__content__desc">
        <?php if ($meta['distance'] && $meta['time']): ?>
            <span><?php echo $meta['distance'] . ' - ' . $meta['time'] ?></span>
        <?php endif; ?>
        <a href="<?php echo esc_url(get_permalink($post_id)); ?>" title="Đặt vé" target="_blank">Đặt vé</a>
    </div>
<?php
    return ob_get_clean();
}

function renderGenericContent($post_id = null, $isAddress = false)
{
    if (!$post_id)
        $post_id = get_the_ID();

    // Cache địa chỉ
    static $address_cache = [];
    if ($isAddress && !isset($address_cache[$post_id])) {
        $address_cache[$post_id] = get_field('company_address', $post_id);
    }

    ob_start();
?>
    <div class="tuyen-duong-item__content__title">
        <h3 class="one-line">
            <a href="<?php echo esc_url(get_permalink($post_id)); ?>"
                title="<?php echo esc_attr(get_the_title($post_id)); ?>">
                <?php echo get_the_title($post_id); ?>
            </a>
        </h3>
    </div>
    <?php if ($isAddress && !empty($address_cache[$post_id])): ?>
        <div class="tuyen-duong-item__content__address">
            <i class="fas fa-map-marker-alt" style="color: var(--fs-color-primary);"></i>
            <span><?php echo esc_html($address_cache[$post_id]); ?></span>
        </div>
    <?php endif; ?>

    <div class="tuyen-duong-item__content__desc two-line">
        <?php
        $excerpt = get_the_excerpt($post_id);
        if (!$excerpt) {
            $excerpt = wp_trim_words(get_post_field('post_content', $post_id), 20);
        }
        echo $excerpt;
        ?>
    </div>
<?php
    return ob_get_clean();
}

// TỐI ƯU: Hook để clear cache khi post được update
add_action('post_updated', function ($post_id) {
    wp_cache_delete('post_render_' . $post_id . '_' . md5(''), 'post_renders');
    wp_cache_delete('post_render_' . $post_id . '_' . md5('tuyenduong0'), 'post_renders');
    wp_cache_delete('post_render_' . $post_id . '_' . md5('tuyenduong1'), 'post_renders');

    // Clear transient cache
    global $wpdb;
    $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_post_grid_%'");
});

add_shortcode('book_ticket_company', 'show_post_book_ticket_company');

//Shortcode vé máy bay
function show_post_book_ticket_airline($atts)
{
    $atts = shortcode_atts([
        'post-type' => 'page',
        'posts_per_page' => 12,
        'orderby' => 'ID',
        'order' => 'DESC'
    ], $atts);

    // Helper function tạo query args chung
    $getBaseArgs = function ($postType, $postParent, $hasOutstanding = false) use ($atts) {
        $args = [
            'post_type' => $postType,
            'posts_per_page' => $atts['posts_per_page'],
            'orderby' => $atts['orderby'],
            'order' => $atts['order'],
            'post_parent' => $postParent,
            'post_status' => 'publish',
            'no_found_rows' => true,
            'update_post_meta_cache' => true,
            'update_post_term_cache' => false,
            'meta_key' => '_thumbnail_id'
        ];

        if ($hasOutstanding) {
            $args['meta_query'][] = [
                'key' => 'outstanding',
                'value' => true,
                'compare' => '='
            ];
        }

        return $args;
    };

    // Tạo các query args
    $queries = [
        'tuyenduongairline' => $getBaseArgs($atts['post-type'], 16844, true),
        // 'hangbay' => $getBaseArgs('post', $atts['category_hangbay'], true),
        // 'sanbay' => $getBaseArgs('post', $atts['category_sanbay'], true)
    ];

    ob_start(); ?>

    <div class="lvn-tab-content">
        <div class="lvn-tab-content__title">
            <button class="lvn-tab-item active" onclick="openTabs(event, 'tuyenduongairline')">Tuyến đường</button>
            <!-- <button class="lvn-tab-item" onclick="openTabs(event, 'hangbay')">Hãng bay</button>
            <button class="lvn-tab-item" onclick="openTabs(event, 'sanbay')">Sân bay</button> -->
        </div>
        <!-- <div class="lvn-tab-content__seemore">
            <a href="<?php // echo home_url('/ve-may-bay/'); 
                        ?>">Xem thêm dịch vụ</a>
        </div> -->
    </div>

    <?php foreach (['tuyenduongairline'] as $index => $tabType): ?>
        <div id="<?= $tabType ?>" class="lvn_tab_custom" <?= $index > 0 ? 'style="display:none"' : '' ?>>
            <?php
            $posts_query = new WP_Query($queries[$tabType]);
            if ($posts_query->have_posts()): ?>
                <div class="posts-list-slide">
                    <?php while ($posts_query->have_posts()):
                        $posts_query->the_post(); ?>
                        <?= renderPostContent($tabType) ?>
                    <?php endwhile; ?>
                </div>
            <?php wp_reset_postdata();
            else: ?>
                <p>Đang cập nhật.</p>
            <?php endif; ?>
        </div>
    <?php endforeach; ?>

<?php return ob_get_clean();
}

add_shortcode('book_ticket_airline', 'show_post_book_ticket_airline');

//shortcode vé tàu
function show_post_book_ticket_train($atts)
{
    $atts = shortcode_atts([
        'post-type' => 'page',
        'posts_per_page' => 12,
        'orderby' => 'ID',
        'order' => 'DESC'
    ], $atts);

    $getBaseArgs = function ($postType, $postParent, $hasOutstanding = false) use ($atts) {
        $args = [
            'post_type' => $postType,
            'posts_per_page' => $atts['posts_per_page'],
            'orderby' => $atts['orderby'],
            'order' => $atts['order'],
            'post_parent' => $postParent,
            'post_status' => 'publish',
            'no_found_rows' => true,
            'update_post_meta_cache' => true,
            'update_post_term_cache' => false,
            'meta_key' => '_thumbnail_id'
        ];

        if ($hasOutstanding) {
            $args['meta_query'][] = [
                'key' => 'outstanding',
                'value' => true,
                'compare' => '='
            ];
        }

        return $args;
    };

    $queries = [
        'tuyenduongtrain' => $getBaseArgs($atts['post-type'], 16846, true),
        // 'hangtau' => $getBaseArgs('post', $atts['category_hangtau'], true),
        // 'nhaga' => $getBaseArgs('post', $atts['category_nhaga'], true)
    ];

    ob_start(); ?>

    <div class="lvn-tab-content">
        <div class="lvn-tab-content__title">
            <button class="lvn-tab-item active" onclick="openTabs(event, 'tuyenduongtrain')">Tuyến đường</button>
            <!-- <button class="lvn-tab-item" onclick="openTabs(event, 'hangtau')">Hãng tàu</button>
            <button class="lvn-tab-item" onclick="openTabs(event, 'nhaga')">Nhà ga</button> -->
        </div>
        <!-- <div class="lvn-tab-content__seemore">
            <a href="<?php // echo home_url('/ve-tau-hoa/'); 
                        ?>">Xem thêm dịch vụ</a>
        </div> -->
    </div>

    <?php foreach (['tuyenduongtrain'] as $index => $tabType): ?>
        <div id="<?= $tabType ?>" class="lvn_tab_custom" <?= $index > 0 ? 'style="display:none"' : '' ?>>
            <?php
            $posts_query = new WP_Query($queries[$tabType]);
            if ($posts_query->have_posts()): ?>
                <div class="posts-list-slide">
                    <?php while ($posts_query->have_posts()):
                        $posts_query->the_post(); ?>
                        <?= renderPostContent($tabType) ?>
                    <?php endwhile; ?>
                </div>
            <?php wp_reset_postdata();
            else: ?>
                <p>Đang cập nhật.</p>
            <?php endif; ?>
        </div>
    <?php endforeach; ?>

<?php return ob_get_clean();
}

add_shortcode('book_ticket_train', 'show_post_book_ticket_train');

//shortcode tour du lịch
function show_post_book_ticket_tour($atts)
{
    $atts = shortcode_atts([
        'category_tuyenduong' => 0,
        'category_diaiem' => 35,
        'category_thoigian' => 36,
        'post-type' => 'post',
        'posts_per_page' => 10,
        'orderby' => 'ID',
        'no_found_rows' => true,
        'order' => 'DESC'
    ], $atts);

    // Helper function tạo query args chung
    $getBaseArgs = function ($postType, $category, $hasOutstanding = false) use ($atts) {
        $args = [
            'post_type' => $postType,
            'cat' => $category,
            'posts_per_page' => $atts['posts_per_page'],
            'orderby' => $atts['orderby'],
            'order' => $atts['order'],
            'post_status' => 'publish',
            'meta_key' => '_thumbnail_id'
        ];

        if ($hasOutstanding) {
            $args['meta_query'][] = [
                'key' => 'outstanding',
                'value' => true,
                'compare' => '='
            ];
        }

        return $args;
    };

    // Tạo các query args
    $queries = [
        'tuyenduongtour' => $getBaseArgs($atts['post-type'], $atts['category_tuyenduong']),
        'diaiem' => $getBaseArgs('post', $atts['category_diaiem'], true),
        'thoigian' => $getBaseArgs('post', $atts['category_thoigian'], true)
    ];

    ob_start(); ?>

    <div class="lvn-tab-content">
        <div class="lvn-tab-content__title">
            <button class="lvn-tab-item active" onclick="openTabs(event, 'tuyenduongtour')">Tuyến đường</button>
            <button class="lvn-tab-item" onclick="openTabs(event, 'diaiem')">Địa điểm</button>
            <button class="lvn-tab-item" onclick="openTabs(event, 'thoigian')">Thời gian</button>
        </div>
        <!-- <div class="lvn-tab-content__seemore">
            <a href="#">Xem thêm dịch vụ</a>
        </div> -->
    </div>

    <?php foreach (['tuyenduongtour', 'diaiem', 'thoigian'] as $index => $tabType): ?>
        <div id="<?= $tabType ?>" class="lvn_tab_custom" <?= $index > 0 ? 'style="display:none"' : '' ?>>
            <?php
            $posts_query = new WP_Query($queries[$tabType]);
            if ($posts_query->have_posts()): ?>
                <div class="posts-list-slide">
                    <?php while ($posts_query->have_posts()):
                        $posts_query->the_post(); ?>
                        <?= renderPostContent($tabType) ?>
                    <?php endwhile; ?>
                </div>
            <?php wp_reset_postdata();
            else: ?>
                <p>Đang cập nhật.</p>
            <?php endif; ?>
        </div>
    <?php endforeach; ?>

<?php return ob_get_clean();
}

add_shortcode('book_ticket_tour', 'show_post_book_ticket_tour');
// Register Sidebars
function custom_sidebars()
{

    $args = array(
        'id' => 'sidebar-nhaxe',
        'class' => '',
        'name' => __('Nhà xe sidebar', 'text_domain'),
        'description' => __('Sidebar for block', 'text_domain'),
    );
    register_sidebar($args);
}
add_action('widgets_init', 'custom_sidebars');

include 'dailyve/init.php';

//AMS API

add_shortcode('show_provider_details_api', 'show_provider_details_api_function');
function show_provider_details_api_function($provider_id = 0, $current_url = [])
{

    if (get_query_var('nha-xe-')):
        $query = get_query_var('nha-xe-');
        $query_array = explode('/', $query);
        $post = get_page_by_path('nha-xe-' . $query_array[0], OBJECT, 'post');
        $provider_id = $post->ID;
        $company_id = get_post_meta($post->ID, '_company_id', true);
        $page = isset($_GET['page']) ? intval($_GET['page']) : 1;

        $url = endPoint . "/api/Raw/Company/Reviews?companyId=$company_id&page=$page&pageSize=21&ratingMin=1&ratingMax=5";
        $response_review = wp_remote_get($url);

        $url_info = endPoint . "/api/Raw/Company/Info?companyId=$company_id";
        $response_company_info = wp_remote_get($url_info);
    endif;
    $output = '';
    //Thông tin chi tiết nhà xe 
    ob_start(); ?>
    <div class="provider-details">
        <ul class="provider-details__nav">
            <li data-tab="images-tab-<?php echo $provider_id; ?>" class="active">Hình ảnh</li>
            <li data-tab="convenience-tab-<?php echo $provider_id; ?>">Tiện ích</li>
            <li data-tab="pickup-dropoff-points-tab-<?php echo $provider_id; ?>">Điểm đón, trả</li>
            <li data-tab="policy-tab-<?php echo $provider_id; ?>">Chính sách</li>
            <li data-tab="ratings-tab-<?php echo $provider_id; ?>">Đánh giá</li>
        </ul>
        <div class="provider-details__tabs">
            <div id="images-tab-<?php echo $provider_id; ?>" class="provider-details__tab images-tab">
                <?php $gallery = get_field('provider_details_gallery');
                if (!empty($gallery)): ?>
                    <div class="provider-details__gallery">
                        <div class="provider-details__gallery-main">
                            <?php foreach ($gallery as $item): ?>
                                <div class="provider-details__gallery-main__item">
                                    <?php echo wp_get_attachment_image($item, 'large'); ?>
                                </div>
                            <?php endforeach; ?>
                        </div>
                        <div class="provider-details__gallery-thumbnails">
                            <?php foreach ($gallery as $item): ?>
                                <div class="provider-details__gallery-thumbnails__item">
                                    <?php echo wp_get_attachment_image($item, 'large', '', ['class' => 'no-fancybox']); ?>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
            <div id="convenience-tab-<?php echo $provider_id; ?>" class="provider-details__tab">
                <?php $convenience = get_field('provider_details_convenience');
                if (!empty($convenience)): ?>
                    <ul class="provider_details_convenience__list">
                        <?php foreach ($convenience as $item):
                            $conv_item = get_post($item); ?>
                            <li class="provider_details_convenience__list-item">
                                <div style="background-image: url('<?php echo get_the_post_thumbnail_url($conv_item); ?>');"
                                    class="provider_details_convenience__list-item__title">
                                    <?php echo $conv_item->post_title; ?>
                                </div>
                                <div class="provider_details_convenience__list-item__content">
                                    <?php echo $conv_item->post_content; ?>
                                </div>
                            </li>
                        <?php endforeach ?>
                    </ul>
                <?php endif; ?>
            </div>
            <div id="pickup-dropoff-points-tab-<?php echo $provider_id; ?>" class="provider-details__tab">

                <?php
                $routes = get_field('provider_details_route');
                if (get_query_var('nha-xe-')):
                    if (!empty($routes)): ?>
                        <div class="accordion" rel="1">
                            <?php foreach ($routes as $route): ?>
                                <div class="accordion-item">
                                    <a href="#" class="accordion-title plain">
                                        <button class="toggle"><i
                                                class="icon-angle-down"></i></button><span><?php echo $route['depart-place']['label'] . ' - ' . $route['destination-place']['label']; ?></span>
                                    </a>
                                    <div class="accordion-inner">
                                        <?php $buses_info = $route['bus-info'];
                                        if ($buses_info):
                                            foreach ($buses_info as $bus_info): ?>
                                                <div class="bus-type-title"><?php echo $bus_info['name']; ?></div>
                                                <?php $pickup_points = $bus_info['pickup-point'];
                                                $dropff_points = $bus_info['dropff-point'];
                                                if ($pickup_points || $dropff_points): ?>
                                                    <div class="flex flex-wrap accordion-sub-item__wrapper">
                                                        <?php if ($pickup_points): ?>
                                                            <div class="accordion-sub-item">
                                                                <h4 class="accordion-sub-item__title">Điểm đón</h4>
                                                                <ul class="accordion-sub-item__list">
                                                                    <?php foreach ($pickup_points as $item): ?>
                                                                        <li>
                                                                            <span class="accordion-sub-item__list__time"><?php echo $item['time']; ?></span>
                                                                            <span
                                                                                class="accordion-sub-item__list__place"><?php echo $item['place']; ?></span>
                                                                        </li>
                                                                    <?php endforeach; ?>
                                                                </ul>
                                                            </div>
                                                        <?php endif;
                                                        if ($dropff_points): ?>
                                                            <div class="accordion-sub-item">
                                                                <h4 class="accordion-sub-item__title">Điểm trả</h4>
                                                                <ul class="accordion-sub-item__list">
                                                                    <?php foreach ($dropff_points as $item): ?>
                                                                        <li>
                                                                            <span class="accordion-sub-item__list__time"><?php echo $item['time']; ?></span>
                                                                            <span
                                                                                class="accordion-sub-item__list__place"><?php echo $item['place']; ?></span>
                                                                        </li>
                                                                    <?php endforeach; ?>
                                                                </ul>
                                                            </div>
                                                        <?php endif; ?>
                                                    </div>
                                                <?php endif; ?>
                                        <?php endforeach;
                                        endif; ?>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                        <?php endif;
                else:
                    $selected_route = null;

                    global $wp;
                    if (!empty($wp->request)):
                        $current_url = $wp->request;
                        $current_url = explode('-', $current_url);
                        $current_url = $current_url[array_key_last($current_url)];
                        $current_url = explode('.', $current_url);
                        $current_url = $current_url[0];
                        $current_url = explode('t', $current_url);
                    endif;

                    foreach ($routes as $route):
                        if ($route['depart-place']['value'] == $current_url[0] && $route['destination-place']['value'] == $current_url[1]):
                            $selected_route = $route;
                            break;
                        endif;
                    endforeach;
                    if (!empty($selected_route)):
                        $buses_info = $selected_route['bus-info'];
                        if ($buses_info):
                            foreach ($buses_info as $bus_info): ?>
                                <div class="bus-type-title"><?php echo $bus_info['name']; ?></div>
                                <?php $pickup_points = $bus_info['pickup-point'];
                                $dropff_points = $bus_info['dropff-point'];
                                if ($pickup_points || $dropff_points): ?>
                                    <div class="flex flex-wrap accordion-sub-item__wrapper">
                                        <?php if ($pickup_points): ?>
                                            <div class="accordion-sub-item">
                                                <h4 class="accordion-sub-item__title">Điểm đón</h4>
                                                <ul class="accordion-sub-item__list">
                                                    <?php foreach ($pickup_points as $item): ?>
                                                        <li>
                                                            <span class="accordion-sub-item__list__time"><?php echo $item['time']; ?></span>
                                                            <span class="accordion-sub-item__list__place"><?php echo $item['place']; ?></span>
                                                        </li>
                                                    <?php endforeach; ?>
                                                </ul>
                                            </div>
                                        <?php endif;
                                        if ($dropff_points): ?>
                                            <div class="accordion-sub-item">
                                                <h4 class="accordion-sub-item__title">Điểm trả</h4>
                                                <ul class="accordion-sub-item__list">
                                                    <?php foreach ($dropff_points as $item): ?>
                                                        <li>
                                                            <span class="accordion-sub-item__list__time"><?php echo $item['time']; ?></span>
                                                            <span class="accordion-sub-item__list__place"><?php echo $item['place']; ?></span>
                                                        </li>
                                                    <?php endforeach; ?>
                                                </ul>
                                            </div>
                                        <?php endif; ?>
                                    </div>
                                <?php endif; ?>
                <?php endforeach;
                        endif;
                    endif;
                endif; ?>

            </div>
            <div id="policy-tab-<?php echo $provider_id; ?>" class="provider-details__tab policy-tab">
                <?php $policy = get_field('provider_details_policy');
                if ($policy):
                    echo $policy;
                endif; ?>
            </div>
            <div id="ratings-tab-<?php echo $provider_id; ?>" class="provider-details__tab ratings-tab">
                <?php if (!is_wp_error($response_company_info)) {
                    $data_company = json_decode(wp_remote_retrieve_body($response_company_info), true);
                ?>
                    <div class="ratings-tab__average">
                        <span class="ratings-tab__average__point">
                            <i class="fas fa-star"></i>
                            <?= $data_company['data']['overall']['rv_main_value'] ?? 0; ?>
                        </span>
                        <span
                            class="ratings-tab__average__total-ratings"><?= $data_company['data']['overall']['total_reviews']; ?>
                            đánh giá</span>
                        <!-- <div class="ratings-tab__show-cmt__btn-wrap">
                            <button data-fancybox data-provider-id="<?php //echo $provider_id; 
                                                                    ?>"
                                data-src="#provider-details__comment-form" class="ratings-tab__show-cmt__btn">Viết đánh giá</button>
                        </div> -->
                    </div>
                <?php } ?>
                <?php if (!is_wp_error($response_company_info)) { ?>
                    <div class="rating-tab__cats">
                        <?php foreach ($data_company['data']['rating'] as $item) {
                            $percent = ((float) $item['rv_main_value'] / 5) * 100; ?>
                            <div class="rating-tab__cat">
                                <div class="rating-tab__cat-name"><?= $item['label']; ?></div>
                                <div class="rating-tab__progress__wrap">
                                    <div class="rating-tab__progress__bar">
                                        <div style="width: <?= $percent; ?>%;" class="rating-tab__progress__bar-fill"></div>
                                    </div>
                                    <div class="rating-tab__progress__txt">
                                        <?= $item['rv_main_value']; ?>
                                    </div>
                                </div>
                            </div>
                        <?php } ?>
                    </div>
                    <?php if (is_wp_error($response_review)) {
                        echo '<div class="text-center">Chưa có đánh giá nào</div>';
                    } else {
                        $data_review = json_decode(wp_remote_retrieve_body($response_review), true);
                        $output .= '<div class="rating-tab__comments-list px-8" id="comments-list-' . $provider_id . '">';
                        if (isset($data_review['data']['items']) && count($data_review['data']['items']) > 0) {
                            foreach ($data_review['data']['items'] as $item) {
                                $dateString = !empty($item['trip_date']) ? date('d-m-Y', strtotime($item['trip_date'])) : "";
                                $widthStart = ((int) $item['rating'] / 5) * 100;

                                $output .= '<div class="rating-tab__comments-list__item">
                            <div class="rating-tab__comments-list__item-personal__info">';
                                if (!empty($item['social_avatar'])) {
                                    $output .= '<div class="rating-tab__comments-list__item-personal_social-avatar"><img src="' . $item['social_avatar'] . '" alt="' . $item['name'] . '"></div>';
                                } else {
                                    $output .= '<div class="rating-tab__comments-list__item-personal__info-avatar">' . getInitialsNameToAvatar($item['name']) . '</div>';
                                }
                                $output .= '<div class="rating-tab__comments-list__item-personal__info-name">'
                                    . $item['name'] .
                                    '<div class="rating-tab__comments-list__item-personal__info-star"> 
                                        <div class="ratings">
                                            <div class="empty-stars" style="font-size: 12pt;"></div>
                                            <div class="full-stars" style="width: ' . $widthStart . '%; font-size: 12pt;"></div>
                                        </div>
                                     </div>
                                </div>
                            </div>';
                                $output .= '<div class="rating-tab__comments-list__item-content">' . $item['comment'] . '</div>';
                                if (count($item['images']) > 0) {
                                    $output .= '<div class="rating-tab__comments-list__item-gallery">';
                                    foreach ($item['images'] as $key => $value) {
                                        $output .= '<div class="rating-tab__comments-list__item-gallery__img"> 
                                                    <a data-fancybox="" href="' . $value . '" rel="nofollow">
                                                        <img
                                                            data-lazyloaded="1"
                                                            src="' . $value . '"
                                                            class="attachment-large size-large entered litespeed-loaded" alt="gallery">
                                                    </a>
                                                </div>';
                                    }
                                    $output .= '</div>';
                                }
                                if (!empty($dateString)) {
                                    $output .= '<div class="rating-tab__comments-list__item-depart-date">
                                                    <p>Đi ngày ' . $dateString . '</p>
                                                    <div><i class="fas fa-check-circle"></i></div>
                                                    <p class="verified">Đã mua vé</p>
                                                </div>';
                                }
                                if (count($item['company_reply']) > 0) {
                                    $output .= '<div class="rating-tab__comments-list__comment-reply">';
                                    foreach ($item['company_reply'] as $reply) {
                                        $output .= '<div class="item-comment-reply">
                                    <div class="comment-title"><p class="comment-reply-title">Phản hồi của nhà xe</p></div>
                                    <div class="comment-content">
                                        <p class="comment-reply-content">' . $reply['content'] . '</p>
                                    </div>
                                </div>';
                                    }
                                    $output .= '</div>';
                                }
                                $output .= '</div>';
                            }
                        } else {
                            echo '<div class="text-center">Chưa có đánh giá nào</div>';
                        }

                        $output .= '</div>';
                        echo $output;
                    } ?>
                    <div class="rating-tab__comments-list-pagination" style="margin-top: 10px;" id="comment-pagination"
                        total-review="<?= $data_review['data']['total_pages'] ?? 0; ?>" provider-id=<?= $provider_id; ?>
                        company-id="<?= $company_id ?>">

                    </div>
                <?php } ?>
            </div>
        </div>
    </div>
<?php $temp_content = ob_get_clean();
    return $temp_content;
}


function findCompanyById($id)
{
    global $dataCompany;

    foreach ($dataCompany as $element) {
        if ($id == $element['id']) {
            return $element;
        }
    }

    return false;
}

function getInitialsNameToAvatar($fullName)
{
    $words = mb_split(' ', $fullName);
    // $initials = '';
    // foreach ($words as $word) {
    //     if (!empty($word)) {
    //         $initials .= mb_strtoupper(mb_substr($word, 0, 1, 'UTF-8'), 'UTF-8');
    //     }
    // }

    if (count($words) > 1) {
        $last = count($words) - 1;
        $chuDau = mb_strtoupper(mb_substr($words[0], 0, 1, 'UTF-8'), 'UTF-8');
        $chuCuoi = mb_strtoupper(mb_substr($words[$last], 0, 1, 'UTF-8'), 'UTF-8');

        $name = $chuDau . "" . $chuCuoi;
    } else {
        $name = mb_strtoupper(mb_substr($words[0], 0, 1, 'UTF-8'), 'UTF-8');
    }

    return $name;
}

function compareByRealTime($a, $b)
{
    $dateTimeA = DateTime::createFromFormat('H:i d-m-Y', $a['realTime']);
    $dateTimeB = DateTime::createFromFormat('H:i d-m-Y', $b['realTime']);

    return $dateTimeA <=> $dateTimeB;
}

function formatPhoneNumber($input)
{
    $cleaned = str_replace(['.', ',', ' '], '', $input);
    return $cleaned;
}

function totalTimeRoute($thoiGianBatDau, $thoiGianKetThuc)
{
    try {
        $thoiGianBatDau = preg_replace('/\+\d{2}:\d{2}$/', '', $thoiGianBatDau);
        $thoiGianKetThuc = preg_replace('/\+\d{2}:\d{2}$/', '', $thoiGianKetThuc);

        $dtBatDau = new DateTime($thoiGianBatDau);
        $dtKetThuc = new DateTime($thoiGianKetThuc);

        $khoangThoiGian = $dtKetThuc->getTimestamp() - $dtBatDau->getTimestamp();

        $soGio = floor($khoangThoiGian / 3600);
        $soPhut = ($khoangThoiGian % 3600) / 60;

        if ($soPhut > 0) {
            return $soGio . " giờ " . $soPhut . " phút";
        } else {
            return $soGio . " giờ";
        }
    } catch (\Exception $e) {
        return '';
    }
}

function formatDateISO($date)
{
    if (empty($date)) {
        return '';
    }

    $date = new DateTime($date);
    $formatted = $date->format("H:i d-m-Y");

    return $formatted;
}

function getTime($date)
{
    $timePart = strpos($date, 'T') !== false ? explode('T', $date)[1] : $date;
    return substr($timePart, 0, 5);
}


// XỬ LÝ AGENT API

function save_token_agent($token, $expiration)
{
    update_option('api_auth_token_agent', $token);
    update_option('api_auth_expiration_agent', $expiration);
}

function is_token_expired_agent()
{
    $expiration = get_option('api_auth_expiration_agent');
    if (!$expiration) {
        return true;
    }

    return current_time('mysql') >= $expiration;
}

function refresh_token_agent()
{
    $response = wp_remote_post(endPoint . '/api/auth/login', [
        'body' => json_encode([
            'email' => AGENT_EMAIL,
            'password' => AGENT_PASSWORD
        ]),
        'headers' => [
            'Content-Type' => 'application/json'
        ]
    ]);

    if (!is_wp_error($response)) {
        $body = json_decode(wp_remote_retrieve_body($response), true);
        if (isset($body['data']['accessToken'])) {
            $expiration = current_time('mysql', 1);
            $expiration = date('Y-m-d H:i:s', strtotime($expiration . ' +1 hour'));

            save_token_agent($body['data']['accessToken'], $expiration);
            return $body['data']['accessToken'];
        }
    }

    return false;
}

function call_api_with_token_agent($endpoint, $method = 'GET', $data = [], $otp = '', $token = null)
{
    $method = strtoupper($method);

    if (is_token_expired_agent()) {
        $new_token = refresh_token_agent();
        if (!$new_token) {
            return new WP_Error('token_refresh_failed', 'Không thể làm mới token.');
        }
    }

    if ($token === null) {
        $token = get_option('api_auth_token_agent');
    }

    // Build URL cho GET (query params)
    if ($method === 'GET' && !empty($data)) {
        $data = array_filter($data, function ($v) {
            return $v !== null && $v !== '';
        });

        $endpoint = add_query_arg($data, $endpoint);
    }

    $args = [
        'method'  => $method,
        'headers' => [
            'Authorization' => 'Bearer ' . $token,
            'Content-Type'  => 'application/json',
            'Vivutoday-Otp' => !empty($otp) ? $otp : '',
        ],
        'timeout' => 180,
    ];

    if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
        $args['body'] = !empty($data) ? wp_json_encode($data) : '{}';
    }
    return wp_remote_request($endpoint, $args);
}

function call_api_v2($endpoint, $method = 'GET', $data = [], $headers = [], $timeout = 180)
{
    $method = strtoupper($method);

    if (!defined('END_POINT_V2') || !defined('X_API_KEY')) {
        return new WP_Error('missing_api_config', 'Thiếu END_POINT_V2 hoặc X_API_KEY trong wp-config.php.');
    }

    if (preg_match('#^https?://#i', $endpoint)) {
        $url = $endpoint;
    } else {
        $base = rtrim(END_POINT_V2, '/');
        $url = $base . '/' . ltrim($endpoint, '/');
    }

    if ($method === 'GET' && !empty($data)) {
        $data = array_filter($data, function ($v) {
            return $v !== null && $v !== '';
        });

        $url = add_query_arg($data, $url);
    }

    $default_headers = [
        'x-api-key'     => X_API_KEY,
        'Content-Type'  => 'application/json',
    ];

    $args = [
        'method'  => $method,
        'headers' => array_merge($default_headers, is_array($headers) ? $headers : []),
        'timeout' => (int) $timeout,
    ];

    if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
        $args['body'] = !empty($data) ? wp_json_encode($data) : '{}';
    }

    return wp_remote_request($url, $args);
}

function dv_get_client_ip()
{
    $keys = [
        'HTTP_CF_CONNECTING_IP',
        'HTTP_X_REAL_IP',
        'HTTP_X_FORWARDED_FOR',
        'REMOTE_ADDR'
    ];

    foreach ($keys as $key) {
        if (!empty($_SERVER[$key])) {
            $ip = explode(',', $_SERVER[$key])[0];
            return trim($ip);
        }
    }

    return '0.0.0.0';
}

function dv_rate_limit($action_key, $seconds = 5, $max_requests = 5)
{
    $ip = dv_get_client_ip();
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $rl_key = 'dv_rl_' . md5($action_key . '|' . $ip . '|' . $ua);
    $data = get_transient($rl_key);

    if (!$data) {
        $data = [
            'count' => 1,
            'start' => time(),
        ];

        set_transient($rl_key, $data, $seconds);
        return true;
    }

    if ($data['count'] >= $max_requests) {
        return false;
    }

    $data['count']++;

    set_transient($rl_key, $data, $seconds);

    return true;
}

function dv_cached_api_call($cache_key, $ttl_seconds, $endpoint, $method, $params)
{
    $cached = get_transient($cache_key);
    if ($cached !== false) {
        return $cached;
    }

    $resp = call_api_v2($endpoint, $method, $params);

    if (!is_wp_error($resp) && isset($resp['body'])) {
        set_transient($cache_key, $resp, $ttl_seconds);
    }

    return $resp;
}


function load_route_data()
{
    if (is_page(299) || is_page(301) || is_page(303)) {

        $url = $_SERVER['REQUEST_URI'];
        $dulieu = parse_url($_SERVER['REQUEST_URI']);
        $truyvan = isset($dulieu['query']) ? $dulieu['query'] : '';
        $path = $dulieu['path'];

        $pattern = '/(\d+)t(\d+)/';
        $patternId = '/-(\d+)-\d+t\d+\.html/';

        $companyId = 0;
        $from = '';
        $to = '';

        // if (preg_match($pattern, $path, $matches)) {
        //     $from = $matches[1];
        //     $to = $matches[2];
        // }

        if (preg_match($patternId, $path, $matches)) {
            $companyId = $matches[1];
        }

        parse_str($truyvan, $output);

        if (isset($output['from']) && !empty($output['from'])) {
            $from = $output['from'];
        }
        if (isset($output['to']) && !empty($output['to'])) {
            $to = $output['to'];
        }

        $page = isset($output['p']) ? (int) $output['p'] : 1;
        $cursor = isset($output['cursor']) ? $output['cursor'] : '';

        if (isset($output['date'])) {
            if (!empty($output['date'])) {
                $date = $output['date'];
            } else {
                $date = date('d-m-Y', strtotime('+1 day'));
            }
        } else {
            $date = date('d-m-Y', strtotime('+1 day'));
        }

        $companies = isset($output['companies']) ? $output['companies'] : '';
        $rating = isset($output['rating']) ? $output['rating'] : '1-5';
        $time = isset($output['time']) ? $output['time'] : '00:00-23:59';
        $sort = isset($output['sort']) ? $output['sort'] : 'time:asc';
        $isLimousine = isset($output['islimousine']) ? intval($output['islimousine']) : null;
        $fromArea = isset($output['fa']) ? sanitize_text_field($output['fa']) : '';
        $toArea = isset($output['ta']) ? sanitize_text_field($output['ta']) : '';
        $newDateString = date('Y-m-d', strtotime($date));

        $arrCompanies = [];
        $arrFromArea = [];
        $arrToArea = [];
        $inputArrFrom = [];
        $inputArrTo = [];

        if (!empty($companies)) {
            $arrCompanies = explode(",", $companies);
        }

        $selectedFromPoints = ams_decode_points_query('fa');
        $selectedToPoints   = ams_decode_points_query('ta');

        $inputArrFrom = array_values(array_unique(array_filter(array_map(function ($p) {
            return isset($p['district']) ? trim((string)$p['district']) : '';
        }, $selectedFromPoints))));
        $inputArrTo = array_values(array_unique(array_filter(array_map(function ($p) {
            return isset($p['district']) ? trim((string)$p['district']) : '';
        }, $selectedToPoints))));
        $inputNamesFrom = array_values(array_unique(array_filter(array_map(function ($p) {
            return isset($p['pointName']) ? trim((string)$p['pointName']) : '';
        }, $selectedFromPoints))));
        $inputNamesTo = array_values(array_unique(array_filter(array_map(function ($p) {
            return isset($p['pointName']) ? trim((string)$p['pointName']) : '';
        }, $selectedToPoints))));

        $arrFromArea = array_map(function ($district) {
            return ["district" => $district];
        }, $inputArrFrom);

        $arrToArea = array_map(function ($district) {
            return ["district" => $district];
        }, $inputArrTo);
        $arrTime = explode("-", $time);
        $arrRating = explode("-", $rating);

        $params = array(
            // "page" => $page,
            "pageSize" => 20,
            "from" => $from,
            "to" => $to,
            "date" => $newDateString,
            "onlineTicket" => 1,
            'timeMin'        => $arrTime[0] ?? '00:00',
            'timeMax'        => $arrTime[1] ?? '23:59',
            // 'is_legacy_from' => 1,
            // 'is_legacy_to'   => 1,
            "sort" => $sort,
            // 'partner' => 'goopay'
        );
        if (!empty($companies)) {
            $params['companies'] = $companies;
        }
        if (!empty($inputArrFrom)) {
            $params['pickupDistricts'] = implode(',', $inputArrFrom);
        }
        if (!empty($inputArrTo)) {
            $params['dropoffDistricts'] = implode(',', $inputArrTo);
        }
        if (!empty($inputNamesFrom)) {
            $params['pickupNames'] = implode(',', $inputNamesFrom);
        }
        if (!empty($inputNamesTo)) {
            $params['dropoffNames'] = implode(',', $inputNamesTo);
        }

        if (!empty($isLimousine)) {
            $params['limousine'] = $isLimousine;
        }

        if (!empty($cursor)) {
            $params['cursor'] = $cursor;
            unset($params['page']);
        } else {
            $params['page'] = $page;
        }

        $paramsStatistic = array(
            "from" => $from,
            "to" => $to,
            "date" => $newDateString,
            "onlineTicket" => 1,
            "sort" => $sort,
            "timeMin" => $arrTime[0] ?? '00:00',
            "timeMax" => $arrTime[1] ?? '23:59',
        );
        if (!empty($companies)) {
            $paramsStatistic['companies'] = $companies;
        }
        if (!empty($inputArrFrom)) {
            $paramsStatistic['pickupDistricts'] = implode(',', $inputArrFrom);
        }
        if (!empty($inputArrTo)) {
            $paramsStatistic['dropoffDistricts'] = implode(',', $inputArrTo);
        }
        if (!empty($inputNamesFrom)) {
            $paramsStatistic['pickupNames'] = implode(',', $inputNamesFrom);
        }
        if (!empty($inputNamesTo)) {
            $paramsStatistic['dropoffNames'] = implode(',', $inputNamesTo);
        }

        if (is_page(303)) {
            $params['isLimousine'] = true;
            $paramsStatistic['limousine'] = 1;
        } else {
            if (!empty($isLimousine)) {
                $params['isLimousine'] = $isLimousine === 1 ? true : false;
                $paramsStatistic['limousine'] = $isLimousine;
            }
        }

        // CACHE + RATE LIMIT 5s
        $cache_key_trips = 'dv_trips_' . md5(json_encode([
            'cursor' => $cursor,
            'from' => $from,
            'to' => $to,
            'date' => $newDateString,
            'time' => $time,
            'rating' => $rating,
            'sort' => $sort,
            'isLimousine' => $isLimousine,
            'companies' => $companies,
            'fa' => $fromArea,
            'ta' => $toArea,
            'companyId' => $companyId,
        ]));

        $has_cache_trips  = (get_transient($cache_key_trips) !== false);

        if (!$has_cache_trips) {
            $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
            $action_key = 'ajax_load_route_' . md5(json_encode([
                'ip'        => $ip,
                'from'      => $from ?? '',
                'to'        => $to ?? '',
                'date'      => $date ?? '',
                'time'      => $time ?? '',
                'sort'      => $sort ?? '',
                'companies' => $companies ?? '',
                'fromarea'  => $arrFromArea ?? [],
                'toarea'    => $arrToArea ?? [],
                'limousine' => $isLimousine ?? 0,
            ]));

            $limit_seconds = 2;

            if (!dv_rate_limit($action_key, $limit_seconds)) {
                wp_send_json_error([
                    'message' => 'Bạn thao tác quá nhanh, vui lòng thử lại sau vài giây.',
                    'code'    => 429
                ], 429);
            }
        }

        $response = dv_cached_api_call($cache_key_trips, 15, 'trips', 'GET', $params);
        $responseStatistic = call_api_v2('route/filter_statistic', 'GET', $paramsStatistic);

        if (!is_wp_error($response) && !is_wp_error($responseStatistic)) {
            $data = json_decode($response['body'], true);
            $dataStatistic = json_decode($responseStatistic['body'], true);
            set_query_var('data', $data);
            set_query_var('dataStatictis', $dataStatistic);
        } else {
            wp_remote_retrieve_response_message($response);
        }

        set_query_var('arrCompanies', $arrCompanies);
        set_query_var('arrTime', $arrTime);
        set_query_var('arrRating', $arrRating);
        set_query_var('arrFromArea', $arrFromArea);
        set_query_var('arrToArea', $arrToArea);
        set_query_var('companyId', $companyId);
    }
}

add_action('wp', 'load_route_data');

add_action('manage_book-ticket_posts_custom_column', 'render_ticket_column', 10, 2);
function render_ticket_column($column, $post_id)
{
    if ($column === 'full_name') {
        $fullname = get_post_meta($post_id, 'full_name', true);
        echo esc_html($fullname);
    }

    if ($column === 'phone') {
        $fullname = get_post_meta($post_id, 'phone', true);
        echo esc_html($fullname);
    }

    if ($column === 'partner_id') {
        $partner_id = get_post_meta($post_id, 'partner_id', true);
        echo esc_html(strtoupper($partner_id));
    }

    if ($column === 'ticket_status') {
        $status = (int)get_post_meta($post_id, 'payment_status', true);
        $status_label = 'Chờ thanh toán';
        $status_color = '#f39c12';

        if ($status === 2) {
            $status_label = 'Đã thanh toán';
            $status_color = '#27ae60';
        } elseif ($status === 3) {
            $status_label = 'Đã hủy';
            $status_color = '#e74c3c';
        } elseif ($status === 5) {
            $status_label = 'Hủy vé hoàn tiền';
            $status_color = '#f36412ff';
        }

        printf('<span style="color: %s; font-weight: bold;">%s</span>', $status_color, $status_label);
    }
}

add_filter('manage_edit-book-ticket_columns', 'add_fullname_column');
function add_fullname_column($columns)
{
    $new_columns = [];

    foreach ($columns as $key => $title) {
        // Chèn các cột mới trước cột 'date'
        if ($key === 'date') {
            $new_columns['full_name'] = __('Full Name');
            $new_columns['phone'] = __('Phone');
            $new_columns['partner_id'] = __('Partner ID');
            $new_columns['ticket_status'] = __('Trạng thái');
        }
        $new_columns[$key] = $title;
    }

    return $new_columns;
}

add_action('restrict_manage_posts', 'add_book_ticket_filters');
function add_book_ticket_filters($post_type)
{
    if ($post_type === 'book-ticket') {
        $current_partner = isset($_GET['partner_id_filter']) ? sanitize_text_field($_GET['partner_id_filter']) : '';

        // Một số đối tác phổ biến
        $partners = [
            'vexere' => 'Vexere',
            'goopay' => 'Goopay'
        ];

        echo '<select name="partner_id_filter">';
        echo '<option value="">' . __('Tất cả đối tác') . '</option>';
        foreach ($partners as $value => $label) {
            printf(
                '<option value="%s"%s>%s</option>',
                esc_attr($value),
                selected($current_partner, $value, false),
                esc_html($label)
            );
        }
        echo '</select>';
    }
}

add_action('pre_get_posts', 'filter_book_tickets_by_partner_id');
function filter_book_tickets_by_partner_id($query)
{
    global $pagenow;
    if (is_admin() && $pagenow === 'edit.php' && isset($_GET['post_type']) && $_GET['post_type'] === 'book-ticket' && !empty($_GET['partner_id_filter'])) {
        $partner_id = sanitize_text_field($_GET['partner_id_filter']);
        $meta_query = (array)$query->get('meta_query');
        $meta_query[] = [
            'key'     => 'partner_id',
            'value'   => $partner_id,
            'compare' => '=',
        ];
        $query->set('meta_query', $meta_query);
    }
}

function __search_by_title_only($search, $wp_query)
{
    global $wpdb;

    if (empty($search) || empty($wp_query->query_vars['search_terms'])) {
        return $search;
    }

    $search_terms = $wp_query->query_vars['search_terms'];
    $like_operator = !empty($wp_query->query_vars['exact']) ? '' : '%';

    $search_clauses = array_map(function ($term) use ($wpdb, $like_operator) {
        $term_like = $wpdb->esc_like($term);
        return $wpdb->prepare("{$wpdb->posts}.post_title LIKE %s", "{$like_operator}{$term_like}{$like_operator}");
    }, $search_terms);

    $search_sql = implode(' AND ', $search_clauses);
    $search = " AND ({$search_sql})";

    if (!is_user_logged_in()) {
        $search .= " AND ({$wpdb->posts}.post_password = '')";
    }

    return $search;
}
add_filter('posts_search', '__search_by_title_only', 500, 2);

add_action('rest_api_init', function () {
    register_rest_route('custom-api/v1', '/create-edit-post/', [
        'methods' => 'POST',
        'callback' => 'custom_edit_post_by_id',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        },
    ]);
});

function custom_edit_post_by_id($request)
{
    $params = $request->get_json_params();
    $post_id = $request->get_param('id') ?? null;

    $allowed_statuses = ['publish', 'draft', 'pending'];
    $action = 'created';

    $postarr = [];

    // If it is edit
    if ($post_id && get_post($post_id)) {
        $post_id = intval($post_id);
        $postarr['ID'] = $post_id;
        //Updated
        $postarr['post_type'] = 'page';
        //End Updated
        $action = 'updated';
    }


    foreach ($params as $key => $value) {
        switch ($key) {
            case 'title':
                $postarr['post_title'] = sanitize_text_field($value);
                break;

            case 'content':
                $postarr['post_content'] = wp_kses_post($value);
                break;

            case 'status':
                if (in_array($value, $allowed_statuses)) {
                    $postarr['post_status'] = $value;
                }
                break;

            case 'categories':
                if (is_array($value)) {
                    $postarr['post_category'] = array_map('intval', $value);
                }
                break;
        }
    }

    //Create or update
    if (!isset($postarr['ID'])) {
        $post_id = wp_insert_post($postarr);
        if (is_wp_error($post_id)) {
            return new WP_Error('create_failed', 'Failed to create post.', ['status' => 500]);
        }
    } else {
        $post_id = wp_update_post($postarr);
        if (is_wp_error($post_id)) {
            return new WP_Error('update_failed', 'Failed to update post.', ['status' => 500]);
        }
    }

    // control meta
    if (!empty($params['meta']) && is_array($params['meta'])) {
        foreach ($params['meta'] as $meta_key => $meta_value) {
            if (($meta_key === 'schedule' || $meta_key === 'company_brand') && is_array($meta_value)) {
                update_field($meta_key, $meta_value, $post_id);
            } else {
                update_post_meta($post_id, sanitize_key($meta_key), maybe_serialize($meta_value));
            }
        }
    }

    return new WP_REST_Response([
        'post_id' => $post_id,
        'action' => $action,
        'message' => "Post {$action} successfully!"
    ], $action === 'created' ? 201 : 200);
}

// function copy_post_meta($from_post_id, $to_post_id) {
//     // Lấy tất cả meta của post gốc
//     $meta = get_post_meta($from_post_id);

//     if (!empty($meta)) {
//         foreach ($meta as $key => $values) {
//             // ACF thường lưu 2 meta cho mỗi field (_field_name và field_name)
//             // Chúng ta copy cả hai
//             foreach ($values as $value) {
//                 // Tránh ghi đè, xóa meta cũ trước khi thêm (nếu muốn giữ dữ liệu thì bỏ dòng delete)
//                 delete_post_meta($to_post_id, $key);
//                 add_post_meta($to_post_id, $key, maybe_unserialize($value));
//             }
//         }
//     }
// }

add_action('add_meta_boxes', function () {
    add_meta_box(
        'copy_meta_box',
        'Copy ACF từ post khác',
        'render_copy_meta_box',
        'page',
        'side'
    );
});

// Render meta box
function render_copy_meta_box($post)
{
    $value = get_post_meta($post->ID, '_copy_from_post_id', true);
    echo '<label for="copy_from_post_id">Nhập ID bài gốc:</label>';
    echo '<input type="number" name="copy_from_post_id" id="copy_from_post_id" value="' . esc_attr($value) . '" style="width:100%;">';
}

add_action('save_post', function ($post_id) {
    if (array_key_exists('copy_from_post_id', $_POST)) {
        update_post_meta($post_id, '_copy_from_post_id', intval($_POST['copy_from_post_id']));
    }
});

add_action('save_post', function ($post_id) {
    // Chỉ chạy khi publish/update (tránh autosave)
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE)
        return;

    $from_post_id = get_post_meta($post_id, '_copy_from_post_id', true);
    if (!$from_post_id || $from_post_id == $post_id)
        return;

    $meta = get_post_meta($from_post_id);
    if (!empty($meta)) {
        foreach ($meta as $key => $values) {
            if ($key === '_copy_from_post_id')
                continue;

            delete_post_meta($post_id, $key);
            foreach ($values as $value) {
                add_post_meta($post_id, $key, maybe_unserialize($value));
            }
        }
    }
});

/* --- Shortcode: [dv_search] ---------------------------------------------- */
add_shortcode('dv_search', function ($atts = []) {
    wp_enqueue_script('jquery');

    $atts = shortcode_atts([
        'action'            => home_url('/tim-kiem'),
        'placeholder_city'  => 'Thành Phố Hoặc Khu Vực',
        'placeholder_place' => 'Bạn muốn đến đâu?',
        'button_text'       => 'Tìm Kiếm',
    ], $atts, 'dv_search');


    $data = [
        'popular' => ['Thượng Hải', 'Đà Nẵng', 'Singapore', 'Berlin', 'Tokyo'],
        'groups'  => [
            'Trung Quốc' => ['Thượng Hải', 'Bắc Kinh', 'Hồng Kông', 'Hàng Châu', 'Tây An'],
            'Việt Nam'   => ['Hà Nội', 'Đà Nẵng', 'TP. Hồ Chí Minh', 'Phú Quốc'],
        ],
        'poi' => [
            // Trung Quốc
            'Thượng Hải' => [
                'Tháp Truyền Hình Minh Châu Phương Đông',
                'Bến Thượng Hải',
                'Vườn Dự Viên (Yu Garden)',
                'Tháp Thượng Hải (Shanghai Tower)',
                'Sông Hoàng Phố',
                'Tháp Kim Mậu',
            ],
            'Bắc Kinh' => [
                'Tử Cấm Thành',
                'Vạn Lý Trường Thành',
                'Quảng trường Thiên An Môn',
                'Thiên Đàn',
                'Di Hòa Viên',
            ],
            'Hồng Kông' => [
                'Victoria Peak',
                'Disneyland Hồng Kông',
                'Ngong Ping 360',
                'Đại Lộ Ngôi Sao',
                'Ladies’ Market',
            ],
            'Hàng Châu' => ['Tây Hồ', 'Linh Ẩn Tự', 'Khu bảo tồn đất ngập Xixi'],
            'Tây An'    => ['Đội quân đất nung', 'Thành cổ Tây An', 'Tháp Đại Nhạn'],
            // Việt Nam
            'Hà Nội' => ['Hồ Hoàn Kiếm', 'Văn Miếu', 'Lăng Chủ tịch Hồ Chí Minh', 'Phố cổ Hà Nội'],
            'Đà Nẵng' => ['Bà Nà Hills', 'Cầu Rồng', 'Ngũ Hành Sơn', 'Bãi biển Mỹ Khê', 'Cù Lao Chàm'],
            'TP. Hồ Chí Minh' => ['Nhà thờ Đức Bà', 'Bưu điện Trung tâm', 'Chợ Bến Thành', 'Địa đạo Củ Chi'],
            'Phú Quốc' => ['Bãi Sao', 'VinWonders Phú Quốc', 'Grand World', 'Kiss Bridge – Sunset Town'],
        ],
    ];

    // ID duy nhất để tránh xung đột khi dùng nhiều shortcode trên cùng trang
    $uid = 'dv-trip-search-' . wp_generate_password(6, false, false);

    ob_start(); ?>
    <form id="<?php echo esc_attr($uid); ?>"
        class="dv-trip-search"
        action="<?php echo esc_url($atts['action']); ?>"
        method="get" role="search" autocomplete="off">

        <!-- Field: Thành phố/Khu vực -->
        <div class="dv-field dv-city" data-dv="city">
            <button type="button" class="dv-input" aria-haspopup="listbox" aria-expanded="false">
                <span class="dv-input-label"><?php echo esc_html($atts['placeholder_city']); ?></span>
                <span class="dv-input-value"></span>
                <span class="dv-caret" aria-hidden="true"></span>
            </button>
            <input type="hidden" name="city" class="dv-hidden-city" />
            <div class="dv-panel dv-city-panel" hidden></div>
        </div>

        <!-- Field: Điểm đến -->
        <div class="dv-field dv-place" data-dv="place">
            <input type="text" class="dv-text custom-search-input" name="place"
                placeholder="<?php echo esc_attr($atts['placeholder_place']); ?>" />
            <div class="dv-panel dv-place-panel" hidden></div>
        </div>

        <button class="dv-btn" type="submit"><?php echo esc_html($atts['button_text']); ?></button>
    </form>

    <script>
        (function($) {
            var conf = <?php echo wp_json_encode([
                            'data'            => $data,
                            'placeHolderCity' => $atts['placeholder_city'],
                            'placeHolderPlace' => $atts['placeholder_place'],
                        ], JSON_UNESCAPED_UNICODE); ?>;

            // Helpers: recent cities
            function getRecent() {
                try {
                    return JSON.parse(localStorage.getItem('dv_recent_regions') || '[]')
                } catch (e) {
                    return []
                }
            }

            function addRecent(city) {
                var rec = getRecent();
                rec = [city].concat(rec.filter(function(c) {
                    return c !== city;
                }));
                if (rec.length > 8) rec = rec.slice(0, 8);
                localStorage.setItem('dv_recent_regions', JSON.stringify(rec));
            }

            function buildCityPanel($panel) {
                var html = '';
                // TK gần đây
                html += '<div class="dv-section"><span class="dv-section-title">Tìm Kiếm Gần Đây</span><div class="dv-grid dv-recent"></div></div>';
                // Phổ biến
                html += '<div class="dv-section"><span class="dv-section-title">Điểm đến Phổ biến</span><div class="dv-grid dv-popular"></div></div>';
                // Nhóm quốc gia/khu vực
                Object.keys(conf.data.groups).forEach(function(group) {
                    html += '<div class="dv-section"><span class="dv-section-title">' + group + '</span><div class="dv-grid">';
                    conf.data.groups[group].forEach(function(city) {
                        html += '<div class="dv-item" data-city="' + city + '">' + city + '</div>';
                    });
                    html += '</div></div>';
                });
                $panel.html(html);

                // đổ dữ liệu "phổ biến"
                var $popular = $panel.find('.dv-popular');
                (conf.data.popular || []).forEach(function(city) {
                    $popular.append('<div class="dv-item" data-city="' + city + '">' + city + '</div>');
                });

                // đổ "gần đây"
                var $recent = $panel.find('.dv-recent').empty(),
                    rec = getRecent();
                if (!rec.length) {
                    $recent.append('<div class="dv-empty">Chưa có lịch sử</div>');
                } else rec.forEach(function(city) {
                    $recent.append('<div class="dv-item" data-city="' + city + '">' + city + '</div>');
                });
            }

            function buildPlacePanel($panel, city) {
                $panel.empty();
                if (!city) {
                    $panel.append('<div class="dv-empty">Vui lòng chọn khu vực trước.</div>');
                    return;
                }
                var list = conf.data.poi[city] || [];
                if (!list.length) {
                    $panel.append('<div class="dv-empty">Chưa có dữ liệu điểm đến cho ' + city + '.</div>');
                    return;
                }
                var html = '<div class="dv-section"><span class="dv-section-title">Điểm Tham Quan Hàng Đầu</span>';
                list.forEach(function(name) {
                    html += '<div class="dv-suggestion" data-place="' + name + '"><span class="dv-icon"><i class="fas fa-university"></i></span><span class="dv-txt">' + name + '</span></div>';
                });
                html += '</div>';
                $panel.html(html);
            }

            function filterPlacePanel($panel, term) {
                term = (term || '').toLowerCase();
                $panel.find('.dv-suggestion').each(function() {
                    var ok = $(this).text().toLowerCase().indexOf(term) > -1;
                    $(this).toggle(ok);
                });
            }

            $(function() {
                var $wrap = $('#<?php echo esc_js($uid); ?>'),
                    $cityField = $wrap.find('.dv-city'),
                    $cityBtn = $cityField.find('.dv-input'),
                    $cityPanel = $cityField.find('.dv-city-panel'),
                    $cityHidden = $wrap.find('.dv-hidden-city'),
                    $placeField = $wrap.find('.dv-place'),
                    $placeInput = $placeField.find('.dv-text'),
                    $placePanel = $placeField.find('.dv-place-panel');

                buildCityPanel($cityPanel);

                // Toggle panel khu vực
                $cityBtn.on('click', function(e) {
                    e.stopPropagation();
                    $('.dv-panel').attr('hidden', true);
                    buildCityPanel($cityPanel); // refresh "gần đây"
                    $cityPanel.removeAttr('hidden');
                    $cityBtn.attr('aria-expanded', 'true');
                });

                // Chọn khu vực
                $cityPanel.on('click', '.dv-item', function() {
                    var city = $(this).data('city');
                    $cityHidden.val(city);
                    $cityBtn.find('.dv-input-value').text(city);
                    $cityBtn.addClass('dv-has-value');
                    $cityPanel.attr('hidden', true);
                    $cityBtn.attr('aria-expanded', 'false');
                    addRecent(city);

                    // reset & nạp gợi ý điểm đến
                    $placeInput.val('');
                    buildPlacePanel($placePanel, city);
                });

                // Mở panel điểm đến khi focus/click
                $placeInput.on('focus click', function(e) {
                    e.stopPropagation();
                    $('.dv-panel').attr('hidden', true);
                    buildPlacePanel($placePanel, $cityHidden.val());
                    $placePanel.removeAttr('hidden');
                });

                // Lọc theo ký tự đang gõ
                $placeInput.on('input', function() {
                    if ($placePanel.is(':hidden')) buildPlacePanel($placePanel, $cityHidden.val());
                    filterPlacePanel($placePanel, $(this).val());
                });

                // Chọn điểm đến
                $placePanel.on('click', '.dv-suggestion', function() {
                    $placeInput.val($(this).data('place'));
                    $placePanel.attr('hidden', true);
                });

                // Đóng popup khi click ra ngoài
                $(document).on('click', function(e) {
                    if (!$(e.target).closest('.dv-field').length) {
                        $('.dv-panel').attr('hidden', true);
                        $('.dv-input').attr('aria-expanded', 'false');
                    }
                });

                // Kiểm tra trước khi submit
                $wrap.on('submit', function(e) {
                    if (!$cityHidden.val()) {
                        e.preventDefault();
                        $cityBtn.trigger('click');
                    }
                });
            });
        })(jQuery);
    </script>
<?php
    return ob_get_clean();
});

function getInitialsWord($string)
{
    $string = trim($string);
    if ($string === '') {
        return '';
    }
    $words = preg_split('/\s+/u', $string);

    if (count($words) === 1) {
        return mb_strtoupper(mb_substr($words[0], 0, 1));
    }

    $first = mb_substr($words[0], 0, 1);
    $last  = mb_substr(end($words), 0, 1);

    return mb_strtoupper($first . $last);
}

include 'api-functions.php';
include 'optimize-company.php';
include 'auth-functions.php';

include 'tour-function.php';
include 'ctv-functions.php';

include 'custom-function.php';

//Duy Functions
include 'bmd-functions.php';
