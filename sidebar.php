<?php

/**
 * The Sidebar containing the main widget areas.
 *
 * @package flatsome
 */

if (is_singular('post')) {
    $related_posts = new WP_Query(array(
        'post_type'      => 'page',
        'post__in'       => array(15736, 16844, 16846),
        'orderby'        => 'post__in',
        'posts_per_page' => 3,
    ));

    if ($related_posts->have_posts()) {
?>
        <div id="secondary" class="widget-area" role="complementary">
            <aside class="widget custom-related-posts-widget">
                <h3 class="widget-title"><span>Dịch vụ liên quan</span></h3>
                <div class="is-divider small"></div>
                <div class="related-posts-list">
                    <?php while ($related_posts->have_posts()) : $related_posts->the_post(); ?>
                        <div class="related-post-item">
                            <div class="related-post-thumb<?php echo !has_post_thumbnail() ? ' no-thumb' : ''; ?>">
                                <a href="<?php the_permalink(); ?>">
                                    <?php if (has_post_thumbnail()) : ?>
                                        <?php the_post_thumbnail('thumbnail'); ?>
                                    <?php else : ?>
                                        <div class="thumb-placeholder"></div>
                                    <?php endif; ?>
                                </a>
                            </div>
                            <div class="related-post-info">
                                <div class="related-post-meta">
                                    <span class="related-post-cat">Dịch vụ</span>
                                    <span class="related-post-date"><?php // echo get_the_date('d/m/Y'); 
                                                                    ?></span>
                                </div>
                                <h4 class="related-post-title">
                                    <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                                </h4>
                            </div>
                        </div>
                    <?php endwhile;
                    wp_reset_postdata(); ?>
                </div>
            </aside>
        </div>
<?php
    }
} else {
    // Fallback for other pages
    if (is_active_sidebar('sidebar-main')) {
        dynamic_sidebar('sidebar-main');
    } elseif (is_active_sidebar('sidebar-1')) {
        dynamic_sidebar('sidebar-1');
    }
}
?>