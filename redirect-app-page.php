<?php

/**
 * Template Name: App Redirect
 */

$userAgent = strtolower($_SERVER['HTTP_USER_AGENT']);

if (strpos($userAgent, 'iphone') !== false || strpos($userAgent, 'ipad') !== false) {
    // iOS
    header("Location: https://apps.apple.com/vn/app/dailyve-%C4%91%E1%BA%B7t-v%C3%A9-xe-24-7/id6748101538");
    exit;
} elseif (strpos($userAgent, 'android') !== false) {
    // Android
    header("Location: https://play.google.com/store/apps/details?id=com.dailyve");
    exit;
} else {
    // Mặc định (nếu không nhận diện được)
    header("Location: https://dailyve.com");
    exit;
}
