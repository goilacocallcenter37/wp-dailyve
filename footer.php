<?php

/**
 * The template for displaying the footer.
 *
 * @package flatsome
 */

global $flatsome_opt;
?>

</main>

<?php echo do_shortcode('[auth_form]'); ?>

<!-- FILTER MOBILE -->

<?php
if (is_page(301) || is_page(303) || wp_get_post_parent_id(get_the_ID()) == 15738) { ?>
    <div class="box-filter-overlay">
        <div class="nav__filters__menu" id="nav-filters-menu-mobile">
            <ul class="nav__list">
                <li class="nav__item">
                    <button class="btn-filter-mobile btn-filter-mobile-all">
                        <img src="/wp-content/uploads/assets/images/tune.svg" alt="tune icon">
                        <p>Lọc</p>
                    </button>
                </li>

                <li class="nav__item">
                    <button class="btn-filter-mobile btn-filter-mobile-sort">
                        <img src="/wp-content/uploads/assets/images/sort_around.svg" alt="sort around icon">
                        <p>Sắp xếp</p>
                    </button>
                </li>

                <li class="nav__item">
                    <button class="btn-filter-mobile btn-filter-mobile-time">
                        <img src="/wp-content/uploads/assets/images/schedule.svg" alt="schedule icon">
                        <p>Giờ đi</p>
                    </button>
                </li>

                <li class="nav__item">
                    <button class="btn-filter-mobile btn-filter-mobile-company">
                        <p>Nhà xe</p>
                    </button>
                </li>
            </ul>
        </div>
    </div>

<?php } ?>

<?php if (
    is_page(299) ||
    is_page(301) ||
    is_page(303) ||
    is_front_page() ||
    is_page('danh-sach-yeu-cau-dat-ve') ||
    is_page(15736)
    // is_page(16846) ||
    // is_page(16844)
) { ?>
    <script defer src="<?= get_stylesheet_directory_uri() . '/assets/js/autocompleteSearchForm.js' ?>"></script>
<?php } ?>
<?php
if (is_page() && (wp_get_post_parent_id(get_the_ID()) == 15736 || is_page('ve-xe-khach') ||
    wp_get_post_parent_id(get_the_ID()) == 15738 ||
    wp_get_post_parent_id(get_the_ID()) == 15764 ||
    wp_get_post_parent_id(get_the_ID()) == 15896
)) {
    echo do_shortcode('[block id="list-tuyen-duong"]');
}

if (is_front_page()) {
    echo do_shortcode('[block id="footer-trang-chu"]');
}
?>
<footer id="footer" class="footer-wrapper">
    <?php do_action('flatsome_footer'); ?>
</footer>


<!-- <script src="https://accounts.google.com/gsi/client" async defer></script> -->
<script>
    function handleCredentialResponse(response) {
        const idToken = response.credential;

        jQuery.ajax({
            url: "<?php echo admin_url('admin-ajax.php'); ?>",
            method: "POST",
            data: {
                action: "customer_login_google",
                google_token: idToken
            },
            success: function(response) {
                // console.log(response);

                if (response.success) {
                    toastr.success('Đăng nhập thành công', 'Success');
                    window.dataLayer.push({
                        event: 'login',
                        method: 'google'
                    });
                    window.location.reload();
                } else {
                    toastr.error(response.data.message, 'Error');
                }
            },
            error: function() {
                // buttonVerify.prop('disabled', false);
                toastr.error("Lỗi hệ thống", 'Error');
            }

        });
    }
</script>

<?php wp_footer(); ?>

</body>

</html>