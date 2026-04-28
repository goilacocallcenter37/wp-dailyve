<!-- <div class="entry-category is-xsmall">
	<?php // echo get_the_category_list( __( ', ', 'flatsome' ) ) ?>
</div> -->

<?php
if ( is_single() ) {
	echo '<h1 class="entry-title">' . get_the_title() . '</h1>';
} elseif(get_query_var('nha-xe-')) {
	echo '<h1 class="entry-title">' . get_the_title() . '</h1>';
} else {
	echo '<h2 class="entry-title"><a href="' . get_the_permalink() . '" rel="bookmark" class="plain">' . get_the_title() . '</a></h2>';
}
?>

<div class="entry-divider is-divider small"></div>