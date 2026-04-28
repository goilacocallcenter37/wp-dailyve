<?php get_header(); ?>
<?php
$s = get_search_query();
$args = array(
    's' => $s
);
// The Query
$the_query = new WP_Query($args);
if ($the_query->have_posts()) { ?>
    <div class="row align-center">
        <div class="large-12 col">
            <?php _e("<h2 style='font-weight:bold;color:#000;text-align: center;margin: 25px 0;'>Kết quả tìm kiếm của: " . get_query_var('s') . "</h2>"); ?>
            <div class="container-category">
                <?php while ($the_query->have_posts()) :  $the_query->the_post(); ?>
                    <div class="post-item card-category">
                        <div class="box box-text-bottom box-blog-post has-hover">
                            <div class="box-image">
                                <div class="image-cover" style="padding-top:60%;">
                                    <a href="<?php the_permalink(); ?>" class="plain" title="<?php the_title(); ?>">
                                        <?php the_post_thumbnail() ?>
                                    </a>
                                </div>
                            </div>
                            <div class="box-text text-left">
                                <div class="box-text-inner blog-post-inner">
                                    <h5 class="post-title is-large">
                                        <a href="<?php the_permalink(); ?>" class="plain"><?php the_title(); ?></a>
                                    </h5>
                                    <div class="from_the_blog_excerpt">
                                        <?php if (get_field('company_address')) {
                                            echo '<i class="fas fa-map-marker-alt"></i> ' . get_field('company_address');
                                        } else {
                                            the_excerpt();
                                        } ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endwhile; ?>
            </div>
            <div style="margin-top: 20px;">
                <?php flatsome_posts_pagination(); ?>
            </div>
        </div>
    </div>
<?php

} else { ?>
    <div style="margin-top: 25px;">
        <div class="row align-center">
            <div class="large-8 col">
                <?php get_template_part('template-parts/posts/content', 'none'); ?>
                <div class="if_bus_ani">
                    <iframe style="border: none; width: 100%; height: 100%;" src="https://lottie.host/embed/3c67b86e-7bff-4dac-8b6c-4cf8444beb75/VSTij16CGS.json"></iframe>
                </div>
            </div>
        </div>
    </div>
<?php } ?>

<?php get_footer(); ?>