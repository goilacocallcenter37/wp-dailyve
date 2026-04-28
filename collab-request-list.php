<?php

/**
 * Template Name: Danh Sách Yêu Cầu Đặt Vé - CTV
 */

if(!isset($_SESSION['collaborator'])) {

    wp_redirect( home_url() );
    exit;

}

 get_header(); ?>

<section class="section">
    <div class="row">
        <div class="col small-12 large-12">
            <div class="col-inner">
                <div class="bmd-request-wrap">
                    <?php echo bmd_collab_request_list(); ?>
                </div>
                <div id="collab-trip-search" class="collab-trip-search">
                    <div class="collab-trip-search__overlay"></div>
                    <div class="row">
                        <div class="col small-12 large-12">
                            <div class="col-inner">
                                <?php echo do_shortcode('[bmd_search]'); ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

 <?php get_footer();