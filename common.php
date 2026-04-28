<?php
//$default_image_url = "https://scontent.fsgn2-5.fna.fbcdn.net/v/t39.30808-6/493677130_1638684350168776_6939916415704877303_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=104&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=9d_5mYbbSL8Q7kNvwFNx4PF&_nc_oc=AdkZ5mAYeNByVfSwd_9fh21dR7LdP2EmeE2EKIwUE3Cq7SYa7yOH-4A0epirNP5c4Mk&_nc_zt=23&_nc_ht=scontent.fsgn2-5.fna&_nc_gid=P-jOGddaqJsMPJF7RMsluA&oh=00_AfFC4f7_Hz9ob7ND_MqgSl2bpmz4iLe_w_bYCkeN5gn47w&oe=6816272C";
$default_image_url = get_bloginfo('wpurl'). "/wp-content/uploads/2025/05/pexels-apasaric-1285625.jpg";
$default_image_url2 = get_bloginfo('wpurl') . "/wp-content/uploads/2025/05/chua-nha-trang-anh-thumb-1_1628667265.png";
function formatVND($amount) {
    return number_format($amount, 0, ',', '.');
}

function convertToTitleCase($type) {
    $type = strtolower(trim($type));
    return ucwords($type);
}
?>
