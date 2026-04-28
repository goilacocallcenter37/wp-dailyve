<?php
/**
 * Posts content single.
 *
 * @package          Flatsome\Templates
 * @flatsome-version 3.16.0
 */
?>

<div class="entry-content single-page">

	<?php the_content(); ?>

	<?php
	wp_link_pages();
	?>

	<?php if ( get_theme_mod( 'blog_share', 1 ) ) {
		// SHARE ICONS
		echo '<div class="blog-share text-center">';
		echo '<div class="is-divider medium"></div>';
		echo do_shortcode( '[share]' );
		echo '</div>';
	} ?>
</div>

<?php if ( get_theme_mod( 'blog_single_footer_meta', 1 ) ) : ?>
	<footer class="entry-meta text-<?php echo get_theme_mod( 'blog_posts_title_align', 'center' ); ?>">
		<?php
		/* translators: used between list items, there is a space after the comma */
		$category_list = get_the_category_list( __( ', ', 'flatsome' ) );

		/* translators: used between list items, there is a space after the comma */
		$tag_list = get_the_tag_list( '', __( ', ', 'flatsome' ) );


		// But this blog has loads of categories so we should probably display them here.
		if ( '' != $tag_list ) {
			$meta_text = __( 'This entry was posted in %1$s and tagged %2$s.', 'flatsome' );
		} else {
			$meta_text = __( 'This entry was posted in %1$s. Bookmark the <a href="%3$s" title="Permalink to %4$s" rel="bookmark">permalink</a>.', 'flatsome' );
		}

		printf( $meta_text, $category_list, $tag_list, get_permalink(), the_title_attribute( 'echo=0' ) );
		?>
	</footer>
<?php endif; ?>

<?php if ( get_theme_mod( 'blog_author_box', 1 ) ) : ?>
	<div class="entry-author author-box">
		<div class="flex-row align-top">
			<div class="flex-col mr circle">
				<div class="blog-author-image">
					<?php echo get_avatar( get_the_author_meta( 'ID' ), apply_filters( 'flatsome_author_bio_avatar_size', 90 ) ); ?>
				</div>
			</div>
			<div class="flex-col flex-grow">
				<div class="author-name uppercase pt-half" style="font-size: 16px; font-weight: 600;">
					<?php the_author_meta( 'display_name' ); ?>
				</div>
				<p class="author-desc small"><?php the_author_meta( 'description' ); ?></p>
			</div>
		</div>
	</div>
<?php endif; ?>

<?php if ( get_theme_mod( 'blog_single_next_prev_nav', 1 ) ) :
	flatsome_content_nav( 'nav-below' );
endif; ?>

<div class="related-posts-wrapper">
    <h3 class="related-posts-title"><span>Bài viết liên quan</span></h3>
    <?php
    $categories = get_the_category(get_the_ID());
    if ($categories) :
        $category_ids = array();
        foreach($categories as $individual_category) $category_ids[] = $individual_category->term_id;
        $args = array(
            'category__in' => $category_ids,
            'post__not_in' => array(get_the_ID()),
            'posts_per_page' => 8,
            'ignore_sticky_posts' => 1
        );
        $my_query = new wp_query($args);
        if( $my_query->have_posts() ) :
            echo '<div class="posts-list-slide">';
            while( $my_query->have_posts() ) : $my_query->the_post(); ?>
                <div class="related-post-slide-item">
                    <div class="col-inner">
                        <div class="box has-hover has-hover box-text-bottom">
                            <div class="box-image">
                                <div class="image-cover" style="padding-top:60%;">
                                    <a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>">
                                        <?php the_post_thumbnail('medium'); ?>
                                    </a>
                                </div>
                            </div>
                            <div class="box-text text-left">
                                <div class="box-text-inner blog-post-inner">
                                    <h5 class="post-title is-large"><a href="<?php the_permalink(); ?>" class="plain"><?php the_title(); ?></a></h5>
                                    <div class="is-divider small"></div>
                                    <p class="from_the_blog_excerpt"><?php echo wp_trim_words(get_the_excerpt(), 15); ?></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endwhile;
            echo '</div>';
        endif;
        wp_reset_query();
    endif;
    ?>
</div>
