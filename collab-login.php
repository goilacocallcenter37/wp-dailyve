<?php

/**
 * Template Name: Đăng Nhập - CTV
 */

if(isset($_SESSION['collaborator'])) {

    wp_redirect( home_url() );
    exit;

}

 get_header(); ?>

<section class="section collab-login-page">
    <div class="row">
        <div class="col small-12 large-12 bmd-pd-bt-0">
            <div class="col-inner">

                <div class="bmd-collab-login-form" id="bmd-collab-login-form">
                    <form method="POST" action="<?php bloginfo('wpurl'); ?>/handle-login">
                        <div class="bmd-collab-login-form-banner">
                            <img src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/images/login-banner2.png" alt="form banner">
                        </div>
                        <div class="bmd-collab-login-form-item">
                            <input type="email" name="email" placeholder="Địa chỉ Email">

                            <?php if(isset($_SESSION['error']['email'])) : ?>
                                <div class="bmd-collab-login-form-notice"><?php echo $_SESSION['error']['email']; ?></div>
                            <?php endif; ?>
                            
                        </div>
                        <div class="bmd-collab-login-form-item">
                            <input type="password" name="password" placeholder="Mật khẩu">

                            <?php if(isset($_SESSION['error']['password'])) : ?>
                                <div class="bmd-collab-login-form-notice"><?php echo $_SESSION['error']['password']; ?></div>
                            <?php endif; ?>

                        </div>
                        <div class="bmd-collab-login-form-item">
                            <input class="bmd-collab-login-form-submit" type="submit" name="submit" value="Đăng Nhập">

                            <?php if(isset($_SESSION['error']['common'])) : ?>
                                <div class="bmd-collab-login-form-notice bmd-collab-login-form-notice--ct-style"><?php echo $_SESSION['error']['common']; ?></div>
                            <?php endif; ?>

                        </div>
                    </form>
                </div>
                
            </div>
        </div>
    </div>
</section>

 <?php get_footer();