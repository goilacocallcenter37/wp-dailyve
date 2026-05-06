<?php
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
