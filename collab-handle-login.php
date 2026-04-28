<?php

/**
 * Template Name: Xử Lý Đăng Nhập - CTV
 */

unset($_SESSION['error']);

if(isset($_SESSION['collaborator'])) {

    wp_redirect( home_url() );
    exit;

} else {

    $submit = isset($_POST['submit']) ? $_POST['submit'] : null;
    $email = isset($_POST['email']) ? $_POST['email'] : null;
    $password = isset($_POST['password']) ? $_POST['password'] : null;

    if($submit == null) {

        wp_redirect( home_url() );
        exit;

    }
    if($email == null) {

        $_SESSION['error']['email'] = 'Email không được bỏ trống';
        wp_redirect(home_url() . '/dang-nhap-ctv/');
        exit;

    }

    if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {

        $_SESSION['error']['email'] = 'Email không hợp lệ';
        wp_redirect(home_url() . '/dang-nhap-ctv/');
        exit;

    }

    if($password == null) {

        $_SESSION['error']['password'] = 'Mật khẩu không được bỏ trống';
        wp_redirect(home_url() . '/dang-nhap-ctv/');
        exit;

    }

    $password = urlencode($_POST['password']);

    $response_encoded_password = wp_remote_post(endPoint . "/Api/Auth/EncryptPassword?password=$password");

    $body_encoded_password = json_decode(wp_remote_retrieve_body($response_encoded_password), true);

    $encoded_password = $body_encoded_password['message'];

    $data = [
        'email' => $email,
        'password' => $encoded_password,
        'audience' => 'dailyve.com'
    ];

    $response_login = wp_remote_post(endPoint . "/Api/Auth/Login", [
        'headers' => [
            'Content-Type' => 'application/json',
        ],
        'body' => json_encode($data)
    ]);

    $response_login_body = json_decode(wp_remote_retrieve_body($response_login), true);

    if($response_login_body['statusCode'] == 200) {
        
        $_SESSION['collaborator'] = $response_login_body['data'];
        unset($_SESSION['error']);
        wp_redirect(home_url() . '/danh-sach-yeu-cau-dat-ve/');
        exit;

    } else {
        
        $_SESSION['error']['common'] = 'Email hoặc Mật khẩu không chính xác';
        wp_redirect(home_url() . '/dang-nhap-ctv/');
        exit;

    }

    

}