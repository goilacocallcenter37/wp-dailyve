<?php

/**
 * Template Name: Page Trung tâm hỗ trợ
 */

get_header();

$terms = get_terms(array(
    'taxonomy'   => 'category-support',
    'hide_empty' => false,
    'parent'   => 0
));
?>
<style>
    #main {
        background-color: #ecf4fd;
    }
</style>
<div class="blog-wrapper blog-archive page-wrapper" style="background-color: var(--primary-color);">
    <div class="container section-title">
        <h1 class="section-title-main" style="color: #ffffff">Trung tâm hỗ trợ</h1>
    </div>
</div>
<div class="container">
    <section class="section" style="padding: 20px 0 0 0;">
        <div class="section-bg fill"></div>
        <div class="section-content relative">
            <div class="row row-small">
                <div class="col small-12 large-12">
                    <div class="col-inner">
                        <div class="tabbed-content tab-support">
                            <ul class="nav nav-line-bottom nav-normal nav-size-normal nav-left" role="tablist">
                                <?php foreach ($terms as $key => $term) { ?>
                                    <li id="<?= $term->term_id; ?>" class="tab has-icon <?= $key === 2 ? 'active' : ''; ?>" role="presentation">
                                        <a href="#<?= $term->term_id; ?>" aria-controls="<?= $term->term_id; ?>" tabindex="-1">
                                            <img src="<?= $key === 0 ? '/wp-content/uploads/assets/images/request.png' : '/wp-content/uploads/assets/images/front-of-bus.png'; ?>" alt="icon request">
                                            <span><?= esc_html($term->name); ?></span>
                                        </a>
                                    </li>
                                <?php } ?>
                            </ul>
                            <div class="tab-panels">
                                <?php foreach ($terms as $key => $term) {
                                    $term_childs = get_terms(array(
                                        'taxonomy'    => 'category-support',
                                        'parent'      => $term->term_id,
                                        'depth'       => 1,
                                        'hide_empty'  => false
                                    ));
                                ?>
                                    <div id="<?= $term->term_id; ?>" class="panel entry-content <?= $key === 2 ? 'active' : ''; ?>" role="tabpanel">
                                        <div class="content-tab-sp">
                                            <div class="category__tags-container" id="panel-<?= $term->term_id; ?>">
                                                <?php foreach ($term_childs as $index => $child) { ?>
                                                    <a href="#<?= $term->term_id . '-' . $child->term_id; ?>">
                                                        <div class="tags-item <?= $index === 0 ? 'active' : ''; ?>" data-parent="<?= $term->term_id; ?>">
                                                            <p><?= esc_html($child->name); ?></p>
                                                        </div>
                                                    </a>
                                                <?php } ?>
                                            </div>
                                            <?php foreach ($term_childs as $index => $child) {
                                                $args = array(
                                                    'post_type' => 'trung-tam-ho-tro',
                                                    'tax_query' => array(
                                                        array(
                                                            'taxonomy' => 'category-support',
                                                            'field' => 'term_id',
                                                            'terms' => $child->term_id
                                                        )
                                                    ),
                                                    'posts_per_page' => -1,
                                                );
                                                $query = new WP_Query($args);
                                            ?>
                                                <div class="category__list-container">
                                                    <h2 id="<?= $term->term_id . '-' . $child->term_id; ?>"><?= esc_html($child->name); ?></h2>
                                                    <?php if ($query->have_posts()) { ?>
                                                        <div class="category-item__content">
                                                            <?php while ($query->have_posts()) :  $query->the_post(); ?>
                                                                <a href="<?php the_permalink(); ?>" class="category-question-item__container">
                                                                    <h3><?php the_title(); ?></h3>
                                                                    <div class="arrow-right-icon">
                                                                        <i class="fas fa-chevron-right"></i>
                                                                    </div>
                                                                </a>
                                                            <?php endwhile; ?>
                                                        </div>
                                                    <?php } ?>
                                                </div>
                                            <?php } ?>
                                        </div>
                                    </div>
                                <?php } ?>
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

<script>
    // jQuery(document).ready(function($) {
    //     $(window).on('scroll', function() {
    //         var entryContent = $('.entry-content.active');
    //         var scrollTop = $(window).scrollTop();
    //         var offsetTop = entryContent.offset().top;

    //         if (scrollTop >= offsetTop) {
    //             $(".entry-content.active .content-tab-sp .category__tags-container").addClass('scroll-x');
    //         } else {
    //             $(".entry-content.active .content-tab-sp .category__tags-container").removeClass('scroll-x');
    //         }
    //     });
    // });
</script>