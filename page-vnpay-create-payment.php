<?php
date_default_timezone_set('Asia/Ho_Chi_Minh');

if (isset($_POST['code'])) {
    global $wp;
    // $vnp_TxnRef = rand(1,10000);
    $code = isset($_POST['code']) ? sanitize_text_field($_POST['code']) : '';
    $ipAddr = $_SERVER['REMOTE_ADDR'];
    $bankCode = 'NCB'; //VNPAYQR
    $locale = 'vn';
    //Expire
    $startTime = date("YmdHis");
    $expire = date('YmdHis', strtotime('+15 minutes', strtotime($startTime)));
 
    $args = array(
        'post_type' => 'book-ticket',
        'title'     => $code,
        'posts_per_page' => 1,
    );

    $query = new WP_Query($args);

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $amount = get_post_meta(get_the_ID(), 'total_price', true);
            $post_id = get_the_ID();
        }
        wp_reset_postdata();

        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => vnp_TmnCode,
            "vnp_Amount" => $amount * 100,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $ipAddr,
            "vnp_Locale" => $locale,
            "vnp_OrderInfo" => $code,
            "vnp_OrderType" => "other",
            "vnp_ReturnUrl" =>  home_url() . "/payment-results",
            "vnp_TxnRef" => $post_id,
            "vnp_ExpireDate" => $expire
        );

        if (isset($bankCode) && $bankCode != "") {
            $inputData['vnp_BankCode'] = $bankCode;
        }

        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = vnp_Url . "?" . $query;
        $vnp_HashSecret = vnp_HashSecret;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash =   hash_hmac('sha512', $hashdata, $vnp_HashSecret);
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }
        header('Location: ' . $vnp_Url);
    } else {
        echo 'Không tìm thấy đơn hàng nào.';
    }
} else {
    header('Location: https://vivutoday.com');
}
