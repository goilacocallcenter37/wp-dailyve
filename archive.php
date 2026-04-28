<?php

get_header();

$current_cat = get_queried_object();

$list_categories = get_terms([
    'taxonomy'   => 'category',
    'hide_empty' => false,
    'orderby'    => 'name',
    'order'      => 'ASC',
]);

$total_categories = count($list_categories) ?? 0;

// $cat_ids = array($current_cat->term_id);
$child_cats = get_terms([
    'taxonomy'   => 'category',
    'child_of'   => $current_cat->term_id,
    'hide_empty' => true,
    // 'fields'     => 'ids',
]);

// if (!is_wp_error($child_cats)) {
//     $cat_ids = array_merge($cat_ids, $child_cats);
// }

// Truy vấn 5 bài viết có lượt xem cao nhất trong danh mục và danh mục con
$popular_posts = new WP_Query([
    'posts_per_page' => 5,
    'cat'            => $current_cat->term_id,
    // 'meta_key'       => 'post_views_count',
    // 'orderby'        => 'meta_value_num',
    'order'          => 'DESC',
]);

$count = 0;
?>

<div class="carousel-menu">
    <div class="row">
        <div class="large-12 col" style="padding-bottom: 0px;">
            <div class="article_menu">
                <div class="article_menu_item">
                    <a href="/" title="Trang chủ" class="border-r"><i class="fas fa-home"></i></a>
                </div>
                <?php if (!empty($list_categories) && !is_wp_error($list_categories)) : ?>
                    <?php foreach ($list_categories as $key => $child) : ?>
                        <div class="article_menu_item">
                            <a href="<?php echo get_category_link($child->term_id); ?>" title="<?php echo $child->name; ?>" class="<?php echo $total_categories - 1 != $key ? 'border-r' : '';
                            echo $current_cat->term_id == $child->term_id ? ' active' : ''; ?>">
                                <span><?php echo $child->name; ?></span>
                            </a>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<div id="content" class="blog-wrapper blog-archive page-wrapper">
    <div class="container section-title-container">
        <h1 class="section-title section-title-center"><b></b><span class="section-title-main" style="color:rgb(0, 0, 0);"><?php echo single_cat_title(); ?></span><b></b></h1>
    </div>
</div>

<div class="row align-center">
    <div class="large-12 col">
        <!-- Post xem nhiều nhất -->
        <?php if ($popular_posts->have_posts()) : ?>
            <div class="box-posts-view">
                <div id="cssportal-grid">
                    <?php while ($popular_posts->have_posts()) : $popular_posts->the_post();
                        $count++; ?>
                        <div id="div<?php echo $count; ?>" class="popular-post-item">
                            <a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>">
                                <?php the_post_thumbnail('large'); ?>
                            </a>
                            <div class="meta">
                                <h4 class="post-title">
                                    <a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a>
                                </h4>
                            </div>
                        </div>
                    <?php endwhile;
                    wp_reset_postdata(); ?>
                </div>
            </div>
        <?php endif; ?>
        
        <?php if (!empty($child_cats) && !is_wp_error($child_cats)) : ?>

        <?php foreach ($child_cats as $childCat) :
            $posts = new WP_Query([
                'posts_per_page' => 8,
                'cat'            => $childCat->term_id,
                'order'          => 'DESC',
            ]);
        ?>
            <div class="category-child-item">
                <h2 class="category-title">
                    <a href="<?php echo get_category_link($childCat->term_id); ?>" title="<?php echo $childCat->name; ?>">
                        <?php echo $childCat->name; ?>
                    </a>
                </h2>
                <div class="container-category">
                    <?php while ($posts->have_posts()) : $posts->the_post(); ?>
                        <div class="post-item card-category">
                            <div class="box box-text-bottom box-blog-post has-hover">
                                <div class="box-image">
                                    <div class="image-cover" style="padding-top:60%;">
                                        <a href="<?php the_permalink(); ?>" class="plain" title="<?php the_title(); ?>">
                                            <?php the_post_thumbnail(); ?>
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
            </div>
            <?php endforeach; ?>                              
        <?php else : ?>
        <div class="container-category">
            <?php while (have_posts()) : the_post(); ?>
                <div class="post-item card-category">
                    <div class="box box-text-bottom box-blog-post has-hover">
                        <div class="box-image">
                            <div class="image-cover" style="padding-top:60%;">
                                <a href="<?php the_permalink(); ?>" class="plain" title="<?php the_title(); ?>">
                                    <?php the_post_thumbnail(); ?>
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
        <?php endif; ?>
        
        <div class="category-content">
            <?php echo category_description(); ?>
        </div>
    </div>
</div>

<?php get_footer(); ?>