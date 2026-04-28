<?php
get_header();
// Kiểm tra nếu bài viết thuộc category ID 6
if (has_category(6)) {
    // Tải một template tùy chỉnh
    get_template_part('template-parts/single', 'category-6');
} else {
    get_template_part('template-parts/single', 'default');
}

get_footer();