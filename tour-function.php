<?php

// Add custom Theme Functions here
include 'common.php';

function tour_enqueue_scripts()
{
    // wp_enqueue_script('jquery'); 
    if (is_page(14604)) {
        wp_enqueue_style('owl-carousel2', '//cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css');
        wp_enqueue_style('owl-carousel2-theme', '//cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css');
        wp_enqueue_script('owl-carousel2', '//cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js', array('jquery'), '2.3.4', true);

        wp_enqueue_script('matchHeight', '//cdnjs.cloudflare.com/ajax/libs/jquery.matchHeight/0.7.2/jquery.matchHeight-min.js', array('jquery'), '0.7.2', true);

        wp_enqueue_style('datepicker', get_stylesheet_directory_uri() . '/css/datepicker.material.css');
        wp_enqueue_style('main', get_stylesheet_directory_uri() . '/css/main.css');

        wp_enqueue_script('datepicker', get_stylesheet_directory_uri() . '/js/datepicker.js', array('jquery'), '1.0.0', true);

        wp_enqueue_script('script-tour', get_stylesheet_directory_uri() . '/js/script-tour.js', array('jquery'), '1.0.0', true);

        // wp_localize_script('script-tour', 'ajax_object', [
        //     'ajax_url' => admin_url('admin-ajax.php')
        // ]);
    }
}
add_action('wp_enqueue_scripts', 'tour_enqueue_scripts');


if (!enum_exists('ColSheet')) {
    enum ColSheet: int
    {
        case Location = 0;
        case Company = 1;
        case ComboTour = 2;
        case TourName = 3;
        case TourType = 4;
        case Place = 5;
        case PriceAdult = 7;
        case PriceChild = 8;
    }
}


//Main Slider
add_shortcode('home_main_content', 'home_main_content');
function home_main_content()
{
    global $wpdb;
    global $default_image_url;

    $content = null;

    $table_tour_places = $wpdb->prefix . 'places';
    $table_location = $wpdb->prefix . 'locations';
    $table_tour = $wpdb->prefix . 'tours';
    $table_tourPlace = $wpdb->prefix . 'tour_places';


    $list_location = $wpdb->get_results("SELECT DISTINCT l.* FROM $table_location l INNER JOIN $table_tour t ON t.location_id = l.id AND t.status = 1  WHERE l.status = 1 order by l.id ");
    // echo '<pre>';
    // print_r($list_location);
    // echo '</pre>';
    // $places_by_location = [];

    foreach ($list_location as $location) {
        $places = $wpdb->get_results(
            $wpdb->prepare("SELECT DISTINCT p.* FROM $table_tour_places p INNER JOIN $table_tourPlace tp ON tp.place_id = p.id INNER JOIN $table_tour t ON t.id = tp.tour_id AND t.status = 1  WHERE p.status = 1 AND p.location_id = %d LIMIT 10", $location->id)
        );

        $places_by_location[$location->slug] = $places;
    }

    ob_start(); ?>

    <div class="home-main-content">
        <div class="home-main-content__bg" style="background-image: url('<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/pexels-apasaric-1285625.jpg');"></div>
        <div class="home-main-content__nav">
            <div class="container">
                <div class="home-main-content__nav-container">
                    <div class="home-main-content__nav-wrap">
                        <?php foreach ($list_location as $index => $location): ?>
                            <div data-slider="<?php echo esc_attr($location->slug); ?>" data-slogan="<?php echo esc_attr($location->slug); ?>" data-bg="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/pexels-apasaric-1285625.jpg" class="home-main-content__nav-item <?php echo $index === 0 ? ' active' : ''; ?>">
                                <?php echo esc_html($location->name); ?>
                            </div>
                        <?php endforeach; ?>

                    </div>
                </div>
            </div>
        </div>
        <h2 class="home-main-content__slogan">
            <div class="container">
                <?php foreach ($list_location as $index => $location): ?>
                    <div data-slogan="<?php echo esc_attr($location->slug); ?>" class="home-main-content__slogan-txt <?php echo $index === 0 ? ' active' : ''; ?>"><?php echo esc_html($location->name); ?><br>Thiên đường biển gọi tên bạn</div>
                <?php endforeach; ?>
            </div>
        </h2>
        <div class="home-main-content__tours">
            <div class="home-main-content__tour-info">
                <div class="home-main-content__tour-info-wrap">
                    <h3 class="home-main-content__tour-info-title"></h3>
                    <div class="home-main-content__tour-info-desc"></div>
                    <a href="#contact" class="home-main-content__tour-info-btn">Đặt Tour Ngay</a>
                </div>
            </div>
            <div class="home-main-content__tour-list-wrap">
                <!-- Nha Trang -->
                <?php foreach ($list_location as $location): ?>
                    <?php $places = $places_by_location[$location->slug] ?? []; ?>
                    <div data-slider="<?php echo esc_attr($location->slug); ?>" class="home-main-content__tour-list owl-carousel owl-theme">
                        <?php foreach ($places as $place): ?>
                            <div class="home-main-content__tour-info-2" data-title="<?php echo esc_attr($place->name); ?>" data-id="<?php echo esc_attr($place->id); ?>" data-content="<?php echo esc_attr($place->description); ?>">
                                <div class="home-main-content__tour-info-2-img">
                                    <img src="<?php echo esc_url(!empty($place->image_url) ? $place->image_url : $default_image_url); ?>" alt="<?php echo esc_attr($place->name); ?>">
                                </div>

                                <div class="home-main-content__tour-info-2-txt">
                                    <div class="home-main-content__tour-info-2-title"><?php echo esc_html($place->name); ?></div>
                                    <div class="home-main-content__tour-info-2-desc">7 km cách trung tâm Thành Phố</div>
                                </div>
                            </div>
                        <?php endforeach; ?>

                    </div>
                <?php endforeach; ?>
            </div>
            <div class="home-main-content__tour-count">
                <span class="home-main-content__tour-current"></span>/<span class="home-main-content__tour-total"></span>
            </div>
        </div>
    </div>

<?php $content = ob_get_clean();
    return $content;
}


//
//Hot Deal
add_shortcode('hot_deal', 'hot_deal');

function hot_deal()
{
    $content = null;
    ob_start(); ?>

    <h3 class="title-1">Hot Deal Chơi Lễ</h3>
    <div class="hot-deal">
        <div class="hot-deal__slider-wrap">
            <div class="hot-deal__slider owl-carousel owl-theme">
                <div class="hot-deal__slider-item" data-place="Chùa A">
                    <img alt="slide" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/chua-nha-trang-anh-thumb-1_1628667265.png">
                </div>
                <div class="hot-deal__slider-item" data-place="Chùa B">
                    <img alt="slide" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/chua-nha-trang-anh-thumb-1_1628667265.png">
                </div>
                <div class="hot-deal__slider-item" data-place="Chùa C">
                    <img alt="slide" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/chua-nha-trang-anh-thumb-1_1628667265.png">
                </div>
            </div>
            <div class="hot-deal__slider-nav">
                <div class="hot-deal__slider-nav-txt">Chùa Vằng</div>
                <div class="hot-deal__slider-nav-btns">
                    <div class="hot-deal__slider-nav-btn hot-deal__slider-nav-btn-prev"><i class="fas fa-arrow-left"></i></div>
                    <div class="hot-deal__slider-nav-btn hot-deal__slider-nav-btn-next"><i class="fas fa-arrow-right"></i></div>
                </div>
            </div>
        </div>
        <div class="hot-deal__content">
            <div class="hot-deal__rating">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
            </div>
            <h2 class="title-2 hot-deal__title">NGHỈ LỄ THẬT TUYỆT VỜI<br>VÀO LỄ 30/4 Ở NHA TRANG</h2>
            <div class="hot-deal__desc">
                <div class="hot-deal__desc-item"><strong>2 ngày (1 đêm)</strong></div>
                <div class="hot-deal__desc-item">2 triệu người đã trải nghiệm</div>
            </div>
            <div class="hot-deal__info">
                <div class="hot-deal__price">5.000.000đ</div>
                <div class="hot-deal__btn-wrap">
                    <a href="#contact" class="hot-deal__btn">Đặt Tour Ngay</a>
                </div>
            </div>
        </div>
    </div>

<?php $content = ob_get_clean();
    return $content;
}

//Tour Packages
add_shortcode('tour_packages', 'tour_packages');

function tour_packages($atts)
{

    $content = null;
    global $wpdb;
    global $default_image_url;
    $atts = shortcode_atts(['id' => 2], $atts);
    $id = intval($atts['id']); // Place_ID
    $table_place = $wpdb->prefix . 'tour_places';
    $table_tour = $wpdb->prefix . 'tours';
    $table_relationship = $wpdb->prefix . 'tour_types_relationship';
    $table_type = $wpdb->prefix . 'tour_types';

    //$list_location = $wpdb->get_results("SELECT * FROM $table_relationship WHERE status = 1");

    $list_tour = $wpdb->get_results(
        $wpdb->prepare("
            SELECT 
                t.id,
                t.combo_tour_id,
                type.slug,
                type.name,
                t.image_url,
                t.tour_name,
                t.fare_child,
                t.fare_adult,
                t.slug tour_slug
            FROM $table_place p
            INNER JOIN $table_tour t ON p.tour_id = t.id
            LEFT JOIN $table_relationship rt ON t.id = rt.tour_id
            LEFT JOIN $table_type type ON type.id = rt.tour_type_id
            WHERE p.place_id = %d
        ", $id)
    );

    $grouped = [
        'One' => [],       // One Day
        'More' => [] // More Day
    ];

    foreach ($list_tour as $tour) {
        $combo_id = (int) $tour->combo_tour_id;

        if ($combo_id === 1) {
            $slug = $tour->slug ?? 'no-slug';

            if (!isset($grouped['One'][$slug])) {
                $grouped['One'][$slug] = [
                    'slug' => $slug,
                    'name' => $tour->name,
                    'tours' => []
                ];
            }
            $grouped['One'][$slug]['tours'][] = $tour;
        } else {
            $grouped['More'][] = $tour;
        }
    }

    // echo '<pre>';
    // print_r($list_tour);
    // echo '</pre>';

    ob_start(); ?>
    <div id="tour_packages">
        <div class="container">
            <div class="col sm-12">
                <div class="col-inner">
                    <h3 class="title-1 title-1--ct-style">Các Gói Tour</h3>
                    <h2 class="title-2 title-2--ct-style">
                        Các gói tour của chúng tôi<br>một cuộc phiêu lưu tuyệt vời và đáng nhớ
                    </h2>
                </div>
            </div>
        </div>
        <div class="tour-packages">
            <div class="container">
                <div class="col sm-12">
                    <div class="col-inner">
                        <div class="tour-packages__nav-wrap">
                            <div class="tour-packages__nav">
                                <?php if (!empty($grouped['More'])): ?>
                                    <div data-slider="dai-ngay" class="tour-packages__nav-item active">
                                        <div class="tour-packages__nav-item-wrap">Dài ngày</div>
                                    </div>
                                <?php endif; ?>
                                <?php if (!empty($grouped['One'])): ?>
                                    <div data-slider="trong-ngay" class="tour-packages__nav-item tour-packages__nav-item--ct-style ">
                                        <div class="tour-packages__nav-item-wrap">Trong ngày</div>
                                        <div class="tour-packages__nav-sub-items-wrap">
                                            <div class="tour-packages__nav-sub-items">
                                                <div data-filter=".all" class="tour-packages__nav-sub-item">Tất cả</div>
                                                <?php foreach ($grouped['One'] as $index => $item): ?>
                                                    <div data-filter=".<?php echo esc_attr($item['slug']); ?>" class="tour-packages__nav-sub-item">
                                                        <?php echo esc_html($item['name']); ?>
                                                    </div>
                                                <?php endforeach; ?>

                                            </div>
                                        </div>
                                    </div>
                                <?php endif; ?>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tour-packages__sliders">
                <?php if (!empty($grouped['More'])): ?>
                    <div data-slider="dai-ngay" class="tour-packages__slider">
                        <?php foreach ($grouped['More'] as $index => $item): ?>

                            <div class="tour-packages__slider-item">
                                <div class="tour-packages__slider-item__wrap">
                                    <a class="tour-packages__slider-item-link" href="<?= esc_url(home_url('/tour-detail/' . $item->tour_slug . '/')) ?>">
                                        <div class="tour-packages__slider-item-img">
                                            <img alt="slide" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/pexels-ajay-donga-1113836-2174656.jpg">
                                            <?php if (!empty($item->image_url)): ?>
                                                <img alt="slide" src="<?php echo esc_url($item->image_url); ?>">
                                            <?php else: ?>
                                                <img alt="slide" src="<?php echo esc_url($default_image_url); ?>">
                                            <?php endif; ?>
                                        </div>
                                        <div class="tour-packages__slider-item-txt">
                                            <h3 class="tour-packages__slider-item-title"><?php echo esc_html($item->tour_name); ?></h3>
                                            <div class="tour-packages__slider-item-reviews">
                                                <div class="tour-packages__slider-item-rating">
                                                    <i class="fas fa-star"></i>
                                                    <i class="fas fa-star"></i>
                                                    <i class="fas fa-star"></i>
                                                    <i class="fas fa-star"></i>
                                                    <i class="fas fa-star"></i>
                                                </div>
                                                <div class="tour-packages__slider-item-views">
                                                    (1M+)
                                                </div>
                                            </div>
                                            <div class="tour-packages__slider-item-price">
                                                <?php
                                                $fares = [];
                                                if ($item->fare_child != 0) {
                                                    $fares[] = formatVND($item->fare_child) . ' đ';
                                                }
                                                if ($item->fare_adult != 0) {
                                                    $fares[] = formatVND($item->fare_adult) . ' đ';
                                                }
                                                echo implode(' - ', $fares);
                                                ?>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>


                <?php endif; ?>
                <?php if (!empty($grouped['One'])): ?>

                    <div data-slider="trong-ngay" class="tour-packages__slider">
                        <?php foreach ($grouped['One'] as $indexGr => $itemGr): ?>
                            <?php foreach ($itemGr['tours'] as $index => $item): ?>

                                <div class="tour-packages__slider-item <?php echo $item->slug; ?>">
                                    <div class="tour-packages__slider-item__wrap">
                                        <a class="tour-packages__slider-item-link" href="<?= esc_url(home_url('/tour-detail/' . $item->tour_slug . '/')) ?>">
                                            <div class="tour-packages__slider-item-img">
                                                <?php if (!empty($item->image_url)): ?>
                                                    <img alt="slide" src="<?php echo esc_url($item->image_url); ?>" alt="<?php echo esc_attr($item->name); ?>">
                                                <?php else: ?>
                                                    <img alt="slide" src="<?php echo esc_url($default_image_url); ?>">
                                                <?php endif; ?>
                                            </div>
                                            <div class="tour-packages__slider-item-txt">
                                                <h3 class="tour-packages__slider-item-title"><?php echo esc_html($item->tour_name); ?></h3>
                                                <div class="tour-packages__slider-item-reviews">
                                                    <div class="tour-packages__slider-item-rating">
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                        <i class="fas fa-star"></i>
                                                    </div>
                                                    <div class="tour-packages__slider-item-views">
                                                        (1M+)
                                                    </div>
                                                </div>
                                                <div class="tour-packages__slider-item-price">
                                                    <?php
                                                    $fares = [];
                                                    if ($item->fare_child != 0) {
                                                        $fares[] = formatVND($item->fare_child) . ' đ';
                                                    }
                                                    if ($item->fare_adult != 0) {
                                                        $fares[] = formatVND($item->fare_adult) . ' đ';
                                                    }
                                                    echo implode(' - ', $fares);
                                                    ?>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php endforeach; ?>

                    </div>
                <?php endif; ?>

            </div>
        </div>


    </div>
    <div class="container-spinner">
        <div class="spinner"></div>
    </div>
<?php $content = ob_get_clean();
    return $content;
}

add_shortcode('moment', 'moment');

function moment()
{
    $content = null;
    ob_start(); ?>

    <div class="moment">
        <h3 class="title-1 title-1--ct-style-2">Top Khoảnh Khắc Trải Nghiệm</h3>
        <h2 class="title-3">
            Khách Hàng <span class="title-3__highlight">Hạnh Phúc</span> Chúng Tôi <span class="title-3__highlight">Hạnh Phúc</span>
        </h2>
        <div class="moment__slider owl-carousel owl-theme">
            <div class="moment__slide">
                <div class="moment__slide-left">
                    <div class="moment__slide-img">
                        <img alt="slide" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/pexels-apasaric-1285625.jpg">
                        <div class="moment__slide-caption">2 ngày 1 đêm Vinpearl Land</div>
                    </div>
                </div>
                <div class="moment__slide-right">
                    <div class="moment__slide-img-2">
                        <img alt="slide" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/pexels-ajay-donga-1113836-2174656.jpg">
                    </div>
                    <div class="moment__rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="moment__desc">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen.
                    </div>
                    <div class="moment__guest-info">
                        <div class="moment__guest-info-img">
                            <img src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/user.png" alt="user">
                        </div>
                        <div class="moment__guest-info-txt">
                            <div class="moment__guest-info-name">Nguyễn Thuỳ Dương</div>
                            <div class="moment__guest-info-address">Hồ Chị Minh, Việt Nam</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="moment__slide">
                <div class="moment__slide-left">
                    <div class="moment__slide-img">
                        <img alt="slide" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/pexels-apasaric-1285625.jpg">
                        <div class="moment__slide-caption">2 ngày 1 đêm Vinpearl Land</div>
                    </div>
                </div>
                <div class="moment__slide-right">
                    <div class="moment__slide-img-2">
                        <img alt="slide" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/pexels-ajay-donga-1113836-2174656.jpg">
                    </div>
                    <div class="moment__rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="moment__desc">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen.
                    </div>
                    <div class="moment__guest-info">
                        <div class="moment__guest-info-img">
                            <img src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/user.png" alt="user">
                        </div>
                        <div class="moment__guest-info-txt">
                            <div class="moment__guest-info-name">Nguyễn Thuỳ Dương</div>
                            <div class="moment__guest-info-address">Hồ Chị Minh, Việt Nam</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="moment__slide">
                <div class="moment__slide-left">
                    <div class="moment__slide-img">
                        <img alt="slide" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/pexels-apasaric-1285625.jpg">
                        <div class="moment__slide-caption">2 ngày 1 đêm Vinpearl Land</div>
                    </div>
                </div>
                <div class="moment__slide-right">
                    <div class="moment__slide-img-2">
                        <img alt="slide" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/pexels-ajay-donga-1113836-2174656.jpg">
                    </div>
                    <div class="moment__rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="moment__desc">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen.
                    </div>
                    <div class="moment__guest-info">
                        <div class="moment__guest-info-img">
                            <img src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/user.png" alt="user">
                        </div>
                        <div class="moment__guest-info-txt">
                            <div class="moment__guest-info-name">Nguyễn Thuỳ Dương</div>
                            <div class="moment__guest-info-address">Hồ Chị Minh, Việt Nam</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

<?php $content = ob_get_clean();
    return $content;
}


add_shortcode('feedback', 'feedback');

function feedback()
{
    $content = null;
    ob_start(); ?>

    <div class="moment">
        <h2 class="title-3">KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI</h2>
        <div class="moment__slider owl-carousel owl-theme">
            <div class="moment__slide">
                <div class="moment__slide-left">
                    <div class="moment__slide-img">
                        <img alt="slide" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/pexels-apasaric-1285625.jpg">
                        <div class="moment__slide-caption">2 ngày 1 đêm Vinpearl Land</div>
                    </div>
                </div>
                <div class="moment__slide-right">
                    <div class="moment__slide-img-2">
                        <img alt="slide" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/pexels-ajay-donga-1113836-2174656.jpg">
                    </div>
                    <div class="moment__rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="moment__desc">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen.
                    </div>
                    <div class="moment__guest-info">
                        <div class="moment__guest-info-img">
                            <img src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/user.png" alt="user">
                        </div>
                        <div class="moment__guest-info-txt">
                            <div class="moment__guest-info-name">Nguyễn Thuỳ Dương</div>
                            <div class="moment__guest-info-address">Hồ Chí Minh, Việt Nam</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="moment__slide">
                <div class="moment__slide-left">
                    <div class="moment__slide-img">
                        <img alt="slide" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/pexels-apasaric-1285625.jpg">
                        <div class="moment__slide-caption">2 ngày 1 đêm Vinpearl Land</div>
                    </div>
                </div>
                <div class="moment__slide-right">
                    <div class="moment__slide-img-2">
                        <img alt="slide" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/pexels-ajay-donga-1113836-2174656.jpg">
                    </div>
                    <div class="moment__rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="moment__desc">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen.
                    </div>
                    <div class="moment__guest-info">
                        <div class="moment__guest-info-img">
                            <img src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/user.png" alt="user">
                        </div>
                        <div class="moment__guest-info-txt">
                            <div class="moment__guest-info-name">Nguyễn Thuỳ Dương</div>
                            <div class="moment__guest-info-address">Hồ Chí Minh, Việt Nam</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="moment__slide">
                <div class="moment__slide-left">
                    <div class="moment__slide-img">
                        <img alt="slide" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/pexels-apasaric-1285625.jpg">
                        <div class="moment__slide-caption">2 ngày 1 đêm Vinpearl Land</div>
                    </div>
                </div>
                <div class="moment__slide-right">
                    <div class="moment__slide-img-2">
                        <img alt="slide" src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/pexels-ajay-donga-1113836-2174656.jpg">
                    </div>
                    <div class="moment__rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="moment__desc">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen.
                    </div>
                    <div class="moment__guest-info">
                        <div class="moment__guest-info-img">
                            <img src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/user.png" alt="user">
                        </div>
                        <div class="moment__guest-info-txt">
                            <div class="moment__guest-info-name">Nguyễn Thuỳ Dương</div>
                            <div class="moment__guest-info-address">Hồ Chí Minh, Việt Nam</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <?php $content = ob_get_clean();
    return $content;
}


add_shortcode('news', 'news');

function news()
{
    $content = null;

    $args = array(
        'post_type' => 'post',
        'posts_per_page' => 3
    );

    $query = new WP_Query($args);


    if ($query->have_posts()) :
        ob_start(); ?>
        <div class="news">
            <h2 class="news__title title-2 title-2--ct-style-2">CHÚNG TÔI LÀM KHÔNG CHỈ VỀ DU LỊCH</h2>
            <div class="news__slider owl-carousel owl-theme">
                <?php while ($query->have_posts()) : $query->the_post();
                    $cats = get_the_category(); ?>
                    <div class="news__slide">
                        <a class="news__slide-link" href="<?php the_permalink(); ?>">
                            <?php if (has_post_thumbnail()) : ?>
                                <div class="news__slide-img">
                                    <?php the_post_thumbnail(); ?>
                                </div>
                            <?php endif; ?>
                            <div class="news__slide-txt">
                                <?php foreach ($cats as $cat) : ?>
                                    <div class="news__slide-badge"><?php echo $cat->name; ?></div>
                                <?php endforeach; ?>
                                <h3 class="news__slide-title"><?php the_title(); ?></h3>
                                <div class="news__slide-desc"><?php the_excerpt(); ?></div>
                            </div>
                        </a>
                    </div>
                <?php endwhile; ?>
            </div>
        </div>
    <?php wp_reset_postdata();
        $content = ob_get_clean();
    endif;

    return $content;
}

add_shortcode('contact', 'contact');

function contact()
{
    $content = null;
    ob_start(); ?>

    <div id="contact" class="contact-area">
        <div class="contact-area__row">
            <div class="contact-area__title">
                <h2 class="contact-area__title-txt">Bạn Cần Giải Pháp</h2>
                <div class="contact-area__title-icon">
                    <img src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/05/logo-dlv-white.png" alt="dailyve">
                </div>
            </div>
            <div class="contact-area__box">
                <h2 class="contact-area__box-title">Chuyến Du Lịch Đang Đợi Bạn</h2>
                <div class="contact-area__box-desc">
                    Hãy để chúng tôi mang đến trải nghiệm du lịch trên cả tuyệt tuyệt tuyệt vời !
                </div>
                <?php echo do_shortcode('[button class="contact-area__box-btn" text="Lên kế hoạch ngay" link="#contact-form"][lightbox id="contact-form" width="600px" padding="20px"][contact-form-7 html_class="contact-form" id="ec40f12" title="Form đặt tour"][/lightbox]'); ?>
            </div>
        </div>
    </div>

<?php $content = ob_get_clean();
    return $content;
}

add_filter('wpcf7_autop_or_not', '__return_false');

add_shortcode('testT', 'testT');

function testT()
{
    $content = null;

    global $wpdb;
    global $default_image_url;
    $tourslug = "tour-test";
    $start_date = '2025-03-23';

    $table_tourLocation = $wpdb->prefix . 'locations';
    $table_tourDetail = $wpdb->prefix . 'tour_Details';
    $table_tour = $wpdb->prefix . 'tours';
    $table_itineraries = $wpdb->prefix . 'tour_itineraries';

    $list_tourDetail = $wpdb->get_results($wpdb->prepare("
        SELECT 
            td.*, 
            t.tour_name
        FROM 
            $table_tourDetail td
        JOIN 
            $table_tour t ON td.tour_id = t.id
        WHERE 
            DATE(td.departure_datetime) BETWEEN %s AND DATE_ADD(%s, INTERVAL 8 DAY)
            AND t.slug LIKE '$tourslug'
        ORDER BY 
            td.departure_datetime ASC
    ", $start_date, $start_date));

    $list_itineraries = $wpdb->get_results("SELECT l.* FROM $table_tour t INNER JOIN $table_itineraries l ON t.id = l.tour_id  WHERE t.slug LIKE '$tourslug' AND t.status = 1 ORDER BY l.day_number ");
    echo 123;
    echo '<pre>';
    print_r($list_tourDetail);
    echo '</pre>';

    ob_start(); ?>

    <div class="tour-page">
        <div class="row">
            <div class="col sm-12 pd-bt-0">
                <div class="col-inner">
                    <div class="breadcrumbs">
                        <?php if (function_exists('bcn_display')) {
                            bcn_display();
                        } ?>
                    </div>
                    <div class="tour-details">
                        <div class="tour-title-wrap">
                            <h1 class="tour-title">Tour 2 ngày 1 đêm Nha Trang – Vĩnh Hy</h1>
                            <div class="tour-quick-action">
                                <button class="tour-bookmark-btn tour-quick-btn"><i class="fab fa-facebook-f"></i></button>
                                <button class="tour-share-btn tour-quick-btn"><i class="fas fa-share-alt"></i></button>
                            </div>
                        </div>
                        <div class="tour-details-info pc">
                            <div class="tour-details-info__left">
                                <a href="#feedback" class="tour-btn tour-view-reviews-btn">
                                    <span class="tour-btn__star-icon"><i class="fas fa-star"></i></span>
                                    <span class="tour-btn__rating-score">5</span>
                                    <span class="tour-btn__rating-reviews">(+3000 người đánh giá)</span>
                                    <span class="block tour-btn__view-reviews">Xem đánh giá >>></span>
                                </a>
                                <button class="tour-btn tour-view-map-btn">
                                    <span class="tour-btn__rating-score">Bản Đồ Tour</span>
                                    <span class="block tour-btn__view-reviews">Xem bản đồ >>></span>
                                </button>
                            </div>
                            <div class="tour-details-info__right">
                                <div class="tour-price-wrap">
                                    <div class="tour-sale-label">Giá ưu đãi hôm nay</div>
                                    <div class="tour-price">Từ <span class="tour-price__highlight">3.000.000đ</span></div>
                                    <div class="tour-discount-price">Tiết kiệm <span class="tour-discount-price__highlight">1.500.000đ</span></div>
                                </div>
                                <div class="tour-view-now-btn-wrap">
                                    <a class="tour-view-now-btn" href="#tour">Xem Tour Ngay</a>
                                </div>
                            </div>
                        </div>
                        <div class="tour-slider">
                            <div class="tour-main-slider">
                                <div class="tour-main-slider__slide">
                                    <div class="tour-main-slider__slide-img">
                                        <img src="<?php echo esc_url($default_image_url); ?>" alt="slide">
                                    </div>
                                    <div class="tour-main-slider__slide-txt">
                                        Ngày 1
                                    </div>
                                </div>
                                <div class="tour-main-slider__slide">
                                    <div class="tour-main-slider__slide-img">
                                        <img src="<?php echo esc_url($default_image_url); ?>" alt="slide">
                                    </div>
                                    <div class="tour-main-slider__slide-txt">
                                        Ngày 2
                                    </div>
                                </div>
                                <div class="tour-main-slider__slide">
                                    <div class="tour-main-slider__slide-img">
                                        <img src="<?php echo esc_url($default_image_url); ?>" alt="slide">
                                    </div>
                                    <div class="tour-main-slider__slide-txt">
                                        Ngày 3
                                    </div>
                                </div>
                                <div class="tour-main-slider__slide">
                                    <div class="tour-main-slider__slide-img">
                                        <img src="<?php echo esc_url($default_image_url); ?>" alt="slide">
                                    </div>
                                    <div class="tour-main-slider__slide-txt">
                                        Ngày 4
                                    </div>
                                </div>
                                <div class="tour-main-slider__slide">
                                    <div class="tour-main-slider__slide-img">
                                        <img src="<?php echo esc_url($default_image_url); ?>" alt="slide">
                                    </div>
                                    <div class="tour-main-slider__slide-txt">
                                        Ngày 5
                                    </div>
                                </div>
                            </div>
                            <div class="tour-nav-slider">
                                <div class="tour-nav-slider__slide">
                                    <div class="tour-nav-slider__slide-img">
                                        <img src="<?php echo esc_url($default_image_url); ?>" alt="slide">
                                    </div>
                                    <div class="tour-nav-slider__slide-txt">
                                        Ngày 1
                                    </div>
                                </div>
                                <div class="tour-nav-slider__slide">
                                    <div class="tour-nav-slider__slide-img">
                                        <img src="<?php echo esc_url($default_image_url); ?>" alt="slide">
                                    </div>
                                    <div class="tour-nav-slider__slide-txt">
                                        Ngày 2
                                    </div>
                                </div>
                                <div class="tour-nav-slider__slide">
                                    <div class="tour-nav-slider__slide-img">
                                        <img src="<?php echo esc_url($default_image_url); ?>" alt="slide">
                                    </div>
                                    <div class="tour-nav-slider__slide-txt">
                                        Ngày 3
                                    </div>
                                </div>
                                <div class="tour-nav-slider__slide">
                                    <div class="tour-nav-slider__slide-img">
                                        <img src="<?php echo esc_url($default_image_url); ?>" alt="slide">
                                    </div>
                                    <div class="tour-nav-slider__slide-txt">
                                        Ngày 4
                                    </div>
                                </div>
                                <div class="tour-nav-slider__slide">
                                    <div class="tour-nav-slider__slide-img">
                                        <img src="<?php echo esc_url($default_image_url); ?>" alt="slide">
                                    </div>
                                    <div class="tour-nav-slider__slide-txt">
                                        Ngày 5
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tour-details-info mobile">
                            <div class="tour-details-info__left">
                                <a href="#feedback" class="tour-btn tour-view-reviews-btn">
                                    <span class="tour-btn__star-icon"><i class="fas fa-star"></i></span>
                                    <span class="tour-btn__rating-score">5</span>
                                    <span class="tour-btn__rating-reviews">(+3000 người đánh giá)</span>
                                    <span class="block tour-btn__view-reviews">Xem đánh giá >>></span>
                                </a>
                                <button class="tour-btn tour-view-map-btn">
                                    <span class="tour-btn__rating-score">Bản Đồ Tour</span>
                                    <span class="block tour-btn__view-reviews">Xem bản đồ >>></span>
                                </button>
                            </div>
                            <div class="tour-details-info__right">
                                <div class="tour-price-wrap">
                                    <div class="tour-sale-label">Giá ưu đãi hôm nay</div>
                                    <div class="tour-price">Từ <span class="tour-price__highlight">3.000.000đ</span></div>
                                    <div class="tour-discount-price">Tiết kiệm <span class="tour-discount-price__highlight">1.500.000đ</span></div>
                                </div>
                                <div class="tour-view-now-btn-wrap">
                                    <a class="tour-view-now-btn" href="#tour">Xem Tour Ngay</a>
                                </div>
                            </div>
                        </div>
                        <div class="tour-tabs-wrap">
                            <ul class="tour-tabs">
                                <li class="tour-tab active" data-tab="price">
                                    Giá Cả
                                </li>
                                <li class="tour-tab" data-tab="trip">
                                    Lịch Trình
                                </li>
                            </ul>
                        </div>
                        <div class="tour-contents" id="tour">
                            <div class="tour-content active" data-tab="price">
                                <div class="tour-timeline">
                                    <div class="tour-calendar">
                                        <button class="tour-calendar-btn">
                                            <span class="tour-calendar-btn__icon">
                                                <i class="fa-solid fa-calendar-days"></i>
                                            </span>
                                            <span class="tour-calendar-btn__txt">Xem Lịch</span>
                                        </button>
                                    </div>
                                    <div class="tour-days">
                                        <div class="tour-day active" data-day="23/3/2025">
                                            <div class="tour-day__name-1">Sun</div>
                                            <div class="tour-day__name-2">23 March</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tour-schedules">
                                    <div class="tour-schedule active" data-day="05/05/2025">
                                        <div class="tour-schedule__item">
                                            <div class="tour-schedule__item-img">
                                                <img src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/03/pexels-pixabay-50594.jpg" alt="lịch trình">
                                            </div>
                                            <div class="tour-schedule__item-info">
                                                <div class="tour-schedule__item-date">
                                                    <div class="tour-schedule__item-depart-date">
                                                        <span class="tour-schedule__item-info-hightlight">Ngày đi</span><br>25 Tháng 3, 2025
                                                    </div>
                                                    <div class="tour-schedule__item-date__separator"></div>
                                                    <div class="tour-schedule__item-return-date">
                                                        <span class="tour-schedule__item-info-hightlight">Ngày về</span><br>27 Tháng 3, 2025
                                                    </div>
                                                </div>
                                                <div class="tour-schedule__item-status">
                                                    <span class="tour-schedule__item-info-hightlight">Tình trạng vé</span>
                                                </div>
                                                <a href="#contact" class="tour-schedule__item-contact-link">Liên hệ >>></a>
                                            </div>
                                            <div class="tour-schedule__item-info-2">
                                                <div class="tour-schedule__item-price">
                                                    Từ <span class="tour-schedule__item-price-highlight">3.000.000đ</span>
                                                </div>
                                                <button class="tour-schedule__item-view-details">Xem chi tiết <i class="fa-solid fa-arrow-down"></i></button>
                                            </div>
                                            <div class="tour-schedule__item-details-wrap">
                                                <div class="tour-schedule__item-details">
                                                    <div class="tour-schedule__item-details-left">
                                                        <h3 class="tour-schedule__item-details-name">Nha Trang - Vĩnh Hy</h3>
                                                        <ul class="tour-schedule__item-details-list">
                                                            <li class="tour-schedule__item-details-index">
                                                                <div class="tour-schedule__item-details-date">
                                                                    <span class="tour-schedule__item-details-day">25</span>
                                                                    <span class="tour-schedule__item-details-month">Tháng 3</span>
                                                                </div>
                                                                <div class="tour-schedule__item-details-desc">
                                                                    <div class="tour-schedule__item-details-title">Ngày khởi hành chuyến đi</div>
                                                                    <div class="tour-schedule__item-details-para">Thứ 3, Nha Trang, Khánh Hoà</div>
                                                                </div>
                                                            </li>
                                                            <li class="tour-schedule__item-details-index">
                                                                <div class="tour-schedule__item-details-date">
                                                                    <span class="tour-schedule__item-details-day">27</span>
                                                                    <span class="tour-schedule__item-details-month">Tháng 3</span>
                                                                </div>
                                                                <div class="tour-schedule__item-details-desc">
                                                                    <div class="tour-schedule__item-details-title">Ngày kết thúc chuyến đi</div>
                                                                    <div class="tour-schedule__item-details-para">Thứ 5, Vĩnh Hy, Ninh Thuận</div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                        <div class="tour-schedule__item-details-term">
                                                            Vui lòng đọc kỹ <a class="red-txt" href="#"><strong>Điều khoản</strong></a> của chúng tôi trước khi đặt vé
                                                        </div>
                                                    </div>
                                                    <div class="tour-schedule__item-details-right">
                                                        <div class="tour-schedule__item-details-form">
                                                            <div class="tour-schedule__item-details-form-title">Điều Chỉnh</div>
                                                            <div class="tour-schedule__item-details-form-wrap">
                                                                <div class="tour-schedule__item-details-form-row">
                                                                    <div class="tour-schedule__item-details-form-subtitle">
                                                                        <div class="tour-schedule__item-details-form-label">Người lớn</div>
                                                                        <div class="tour-schedule__item-details-form-price" data-price="3000000">3.000.000đ</div>
                                                                    </div>
                                                                    <div class="tour-schedule__item-details-form-quantity">
                                                                        <button class="tour-schedule__item-details-form-quantity-control minus"><i class="fa-solid fa-minus"></i></button>
                                                                        <input readonly type="text" value="1">
                                                                        <button class="tour-schedule__item-details-form-quantity-control plus"><i class="fa-solid fa-plus"></i></button>
                                                                    </div>
                                                                </div>
                                                                <div class="tour-schedule__item-details-form-row">
                                                                    <div class="tour-schedule__item-details-form-subtitle">
                                                                        <div class="tour-schedule__item-details-form-label">Trẻ em</div>
                                                                        <div class="tour-schedule__item-details-form-price" data-price="1500000">1.500.000đ</div>
                                                                    </div>
                                                                    <div class="tour-schedule__item-details-form-quantity">
                                                                        <button class="tour-schedule__item-details-form-quantity-control minus"><i class="fa-solid fa-minus"></i></button>
                                                                        <input readonly type="text" value="1">
                                                                        <button class="tour-schedule__item-details-form-quantity-control plus"><i class="fa-solid fa-plus"></i></button>
                                                                    </div>
                                                                </div>
                                                                <div class="tour-schedule__item-details-form-row total">
                                                                    <div class="tour-schedule__item-details-form-subtitle">
                                                                        <div class="tour-schedule__item-details-form-label tour-schedule__item-details-form-label--ct-style">Tổng chi phí</div>
                                                                        <div class="tour-schedule__item-details-form-price tour-schedule__item-details-form-price--ct-style">3.500.000đ</div>
                                                                    </div>
                                                                    <div class="tour-schedule__item-details-form-btn-wrap">
                                                                        <a href="#contact" class="tour-schedule__item-details-form-btn">Đặt Ngay</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="tour-schedule__item">
                                            <div class="tour-schedule__item-img">
                                                <img src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/03/pexels-pixabay-50594.jpg" alt="lịch trình">
                                            </div>
                                            <div class="tour-schedule__item-info">
                                                <div class="tour-schedule__item-date">
                                                    <div class="tour-schedule__item-depart-date">
                                                        <span class="tour-schedule__item-info-hightlight">Ngày đi</span><br>25 Tháng 3, 2025
                                                    </div>
                                                    <div class="tour-schedule__item-date__separator"></div>
                                                    <div class="tour-schedule__item-return-date">
                                                        <span class="tour-schedule__item-info-hightlight">Ngày về</span><br>27 Tháng 3, 2025
                                                    </div>
                                                </div>
                                                <div class="tour-schedule__item-status">
                                                    <span class="tour-schedule__item-info-hightlight">Tình trạng vé</span>
                                                </div>
                                                <a href="#contact" class="tour-schedule__item-contact-link">Liên hệ >>></a>
                                            </div>
                                            <div class="tour-schedule__item-info-2">
                                                <div class="tour-schedule__item-price">
                                                    Từ <span class="tour-schedule__item-price-highlight">3.000.000đ</span>
                                                </div>
                                                <button class="tour-schedule__item-view-details">Xem chi tiết <i class="fa-solid fa-arrow-down"></i></button>
                                            </div>
                                            <div class="tour-schedule__item-details-wrap">
                                                <div class="tour-schedule__item-details">
                                                    <div class="tour-schedule__item-details-left">
                                                        <h3 class="tour-schedule__item-details-name">Nha Trang - Vĩnh Hy</h3>
                                                        <ul class="tour-schedule__item-details-list">
                                                            <li class="tour-schedule__item-details-index">
                                                                <div class="tour-schedule__item-details-date">
                                                                    <span class="tour-schedule__item-details-day">25</span>
                                                                    <span class="tour-schedule__item-details-month">Tháng 3</span>
                                                                </div>
                                                                <div class="tour-schedule__item-details-desc">
                                                                    <div class="tour-schedule__item-details-title">Ngày khởi hành chuyến đi</div>
                                                                    <div class="tour-schedule__item-details-para">Thứ 3, Nha Trang, Khánh Hoà</div>
                                                                </div>
                                                            </li>
                                                            <li class="tour-schedule__item-details-index">
                                                                <div class="tour-schedule__item-details-date">
                                                                    <span class="tour-schedule__item-details-day">27</span>
                                                                    <span class="tour-schedule__item-details-month">Tháng 3</span>
                                                                </div>
                                                                <div class="tour-schedule__item-details-desc">
                                                                    <div class="tour-schedule__item-details-title">Ngày kết thúc chuyến đi</div>
                                                                    <div class="tour-schedule__item-details-para">Thứ 5, Vĩnh Hy, Ninh Thuận</div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                        <div class="tour-schedule__item-details-term">
                                                            Vui lòng đọc kỹ <a class="red-txt" href="#"><strong>Điều khoản</strong></a> của chúng tôi trước khi đặt vé
                                                        </div>
                                                    </div>
                                                    <div class="tour-schedule__item-details-right">
                                                        <div class="tour-schedule__item-details-form">
                                                            <div class="tour-schedule__item-details-form-title">Điều Chỉnh</div>
                                                            <div class="tour-schedule__item-details-form-wrap">
                                                                <div class="tour-schedule__item-details-form-row">
                                                                    <div class="tour-schedule__item-details-form-subtitle">
                                                                        <div class="tour-schedule__item-details-form-label">Người lớn</div>
                                                                        <div class="tour-schedule__item-details-form-price" data-price="3000000">3.000.000đ</div>
                                                                    </div>
                                                                    <div class="tour-schedule__item-details-form-quantity">
                                                                        <button class="tour-schedule__item-details-form-quantity-control minus"><i class="fa-solid fa-minus"></i></button>
                                                                        <input readonly type="text" value="1">
                                                                        <button class="tour-schedule__item-details-form-quantity-control plus"><i class="fa-solid fa-plus"></i></button>
                                                                    </div>
                                                                </div>
                                                                <div class="tour-schedule__item-details-form-row">
                                                                    <div class="tour-schedule__item-details-form-subtitle">
                                                                        <div class="tour-schedule__item-details-form-label">Trẻ em</div>
                                                                        <div class="tour-schedule__item-details-form-price" data-price="1500000">1.500.000đ</div>
                                                                    </div>
                                                                    <div class="tour-schedule__item-details-form-quantity">
                                                                        <button class="tour-schedule__item-details-form-quantity-control minus"><i class="fa-solid fa-minus"></i></button>
                                                                        <input readonly type="text" value="1">
                                                                        <button class="tour-schedule__item-details-form-quantity-control plus"><i class="fa-solid fa-plus"></i></button>
                                                                    </div>
                                                                </div>
                                                                <div class="tour-schedule__item-details-form-row total">
                                                                    <div class="tour-schedule__item-details-form-subtitle">
                                                                        <div class="tour-schedule__item-details-form-label tour-schedule__item-details-form-label--ct-style">Tổng chi phí</div>
                                                                        <div class="tour-schedule__item-details-form-price tour-schedule__item-details-form-price--ct-style">3.500.000đ</div>
                                                                    </div>
                                                                    <div class="tour-schedule__item-details-form-btn-wrap">
                                                                        <a href="#contact" class="tour-schedule__item-details-form-btn">Đặt Ngay</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tour-content" data-tab="trip">
                                <div class="trip-header flex flex-wrap">
                                    <div class="trip-header__left">
                                        <h2 class="trip-title">Lịch Trình Mỗi Ngày</h2>
                                        <div class="trip-desc">Hành trình 2 ngày 1 đêm từ Nha Trang đến Vĩnh Hy tham quan 3 đảo và 4 địa danh</div>
                                    </div>
                                    <div class="trip-header__right">
                                        <a class="trip-btn" href="#">
                                            <i class="fa-solid fa-file-pdf"></i> Tải lịch trình
                                        </a>
                                    </div>
                                </div>
                                <div class="trip-content">
                                    <?php foreach ($list_itineraries as $day): ?>
                                        <div class="trip-item">
                                            <div class="trip-item-wrap">
                                                <div class="trip-item__img">

                                                    <img src="<?php echo $day->image_url ?: $default_image_url ?>" alt="Hình ảnh">
                                                </div>
                                                <div class="trip-item__txt">
                                                    <div class="trip-item__date">Ngày <?php echo $day->day_number; ?></div>
                                                    <h3 class="trip-item__subtitle"><?php echo esc_html($day->title); ?></h3>
                                                    <div class="trip-item__attrs">
                                                        <div class="trip-item__attr">
                                                            <span class="trip-item__attr-icon"><i class="fa-solid fa-location-dot"></i></span>
                                                            <span class="trip-item__attr-txt"><?php echo esc_html($day->location_name ?: ''); ?></span>
                                                        </div>
                                                        <div class="trip-item__attr">
                                                            <span class="trip-item__attr-icon"><i class="fa-solid fa-bus"></i></span>
                                                            <span class="trip-item__attr-txt">Di chuyển bằng xe khách</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="trip-item__handle">
                                                    <button class="trip-view-details">
                                                        <span class="trip-view-details__txt">Xem chi tiết</span>
                                                        <span class="trip-view-details__icon"><i class="fa-solid fa-arrow-down"></i></span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="trip-item__details-wrap">
                                                <div class="trip-item__details">
                                                    <div class="trip-item__details-left">
                                                        <div class="trip-details-desc">
                                                            <?php echo wp_kses_post($day->description); ?>
                                                        </div>
                                                        <div class="trip-activities">
                                                            <div class="trip-activity">
                                                                <div class="trip-activity__label">
                                                                    <div class="trip-activity__label-icon"><i class="fa-solid fa-bus"></i></div>
                                                                    <div class="trip-activity__label-txt">Tập trung</div>
                                                                </div>
                                                                <div class="trip-activity__content">
                                                                    Khởi hành lúc 14:00 chiều
                                                                </div>
                                                            </div>
                                                            <div class="trip-activity">
                                                                <div class="trip-activity__label">
                                                                    <div class="trip-activity__label-icon"><i class="fa-solid fa-person"></i></div>
                                                                    <div class="trip-activity__label-txt">Hoạt động chào mừng</div>
                                                                </div>
                                                                <div class="trip-activity__content">
                                                                    Đón đoàn lúc 16:00 chiều
                                                                </div>
                                                            </div>
                                                            <div class="trip-activity">
                                                                <div class="trip-activity__label">
                                                                    <div class="trip-activity__label-icon"><i class="fa-solid fa-building"></i></div>
                                                                    <div class="trip-activity__label-txt">Địa điểm cư trú</div>
                                                                </div>
                                                                <div class="trip-activity__content">
                                                                    Địa điểm cư trú
                                                                </div>
                                                            </div>
                                                            <div class="trip-activity">
                                                                <div class="trip-activity__label">
                                                                    <div class="trip-activity__label-icon"><i class="fa-solid fa-utensils"></i></div>
                                                                    <div class="trip-activity__label-txt">Bữa ăn đi kèm</div>
                                                                </div>
                                                                <div class="trip-activity__content">
                                                                    Bữa tối
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="trip-item__details-right">
                                                        <div class="trip-item__details-img">
                                                            <img src="<?php bloginfo('wpurl'); ?>/wp-content/uploads/2025/03/pexels-pixabay-50594.jpg" alt="Hình ảnh">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>

                                </div>
                            </div>
                        </div>
                        <div class="moment-wrap" id="feedback">
                            <?php echo do_shortcode('[feedback]'); ?>
                        </div>
                        <div class="news-wrap">
                            <?php echo do_shortcode('[news]'); ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row row-full-width">
            <div class="col sm-12 contact-area-col pd-bt-0">
                <div class="col-inner">
                    <?php
                    echo do_shortcode('[contact]');
                    ?>
                </div>
            </div>
        </div>
    </div>

<?php $content = ob_get_clean();
    return $content;
}

add_shortcode('tourschedule', 'tourschedule');
function tourschedule($atts)
{
    $content = null;
    global $wpdb;
    global $default_image_url2;

    $atts = shortcode_atts([
        'id' => 1,
        'date' => ''
    ], $atts);
    $id = intval($atts['id']);
    $date = sanitize_text_field($atts['date']);

    $start_date = '2025-03-23';

    $table_tourLocation = $wpdb->prefix . 'locations';
    $table_tourDetail = $wpdb->prefix . 'tour_Details';
    $table_tour = $wpdb->prefix . 'tours';
    $table_itineraries = $wpdb->prefix . 'tour_itineraries';

    $list_tourDetail = $wpdb->get_results(
        $wpdb->prepare("
            SELECT 
                td.*, 
                t.tour_name,
                t.image_url
            FROM 
                $table_tourDetail td
            JOIN 
                $table_tour t ON td.tour_id = t.id
            WHERE 
                DATE(td.departure_datetime) = %s 
                AND t.id = %d
            ORDER BY 
                td.departure_datetime ASC
        ", $date, $id)
    );


    //   echo $date;
    //     echo '<pre>';
    //     print_r($list_tourDetail);
    //     echo '</pre>';

    ob_start(); ?>
    <?php if (!empty($list_tourDetail)): ?>

        <?php foreach ($list_tourDetail as $item):
            $departureDate = new DateTime($item->departure_datetime);
            $returnDate = new DateTime($item->return_datetime);

            $depart_day = $departureDate->format('d');
            $depart_month = $departureDate->format('m');
            $depart_year = $departureDate->format('Y');
            $depart_text = $departureDate->format('d \T\h\á\n\g m, Y');

            $return_day = $returnDate->format('d');
            $return_month = $returnDate->format('m');
            $return_year = $returnDate->format('Y');
            $return_text = $returnDate->format('d \T\h\á\n\g m, Y');
            $minPrice = ((float)$item->fare_child > 0) ? (float)$item->fare_child : (float)$item->fare_adult;
            $thu_vi = [
                1 => 'Hai',
                2 => 'Ba',
                3 => 'Tư',
                4 => 'Năm',
                5 => 'Sáu',
                6 => 'Bảy',
                7 => 'Chủ nhật'
            ];
            $thu_text_De =  $thu_vi[$departureDate->format('N')];
            $thu_text_Re =  $thu_vi[$returnDate->format('N')];

        ?>
            <div class="tour-schedule active" data-day="<?= esc_attr($date) ?>">

                <div class="tour-schedule__item">
                    <div class="tour-schedule__item-img">
                        <img src="<?= esc_url(!empty($item->image_url) ? $item->image_url : $default_image_url2) ?>" alt="lịch trình">
                    </div>
                    <div class="tour-schedule__item-info">
                        <div class="tour-schedule__item-date">
                            <div class="tour-schedule__item-depart-date">
                                <span class="tour-schedule__item-info-hightlight">Ngày đi</span><br><?= $depart_text ?>
                            </div>
                            <div class="tour-schedule__item-date__separator"></div>
                            <div class="tour-schedule__item-return-date">
                                <span class="tour-schedule__item-info-hightlight">Ngày về</span><br><?= $return_text ?>
                            </div>
                        </div>
                        <div class="tour-schedule__item-status">
                            <span class="tour-schedule__item-info-hightlight">Tình trạng vé</span><br>
                            <?= ($item->booked_guests >= $item->max_guests) ? '<span class="red-txt">Hết chỗ</span>' : 'Còn chỗ' ?>
                        </div>
                        <a href="#contact" class="tour-schedule__item-contact-link">Liên hệ >>></a>
                    </div>
                    <div class="tour-schedule__item-info-2">
                        <div class="tour-schedule__item-price">
                            Từ <span class="tour-schedule__item-price-highlight"><?= formatVND($minPrice) ?>đ</span>
                        </div>
                        <button class="tour-schedule__item-view-details">Xem chi tiết <i class="fa-solid fa-arrow-down"></i></button>
                    </div>
                    <div class="tour-schedule__item-details-wrap">
                        <div class="tour-schedule__item-details">
                            <div class="tour-schedule__item-details-left">
                                <h3 class="tour-schedule__item-details-name">Nha Trang - Vĩnh Hy</h3>
                                <ul class="tour-schedule__item-details-list">
                                    <li class="tour-schedule__item-details-index">
                                        <div class="tour-schedule__item-details-date">
                                            <span class="tour-schedule__item-details-day"><?= $depart_day ?></span>
                                            <span class="tour-schedule__item-details-month">Tháng <?= $depart_month ?></span>
                                        </div>
                                        <div class="tour-schedule__item-details-desc">
                                            <div class="tour-schedule__item-details-title">Ngày khởi hành chuyến đi</div>
                                            <div class="tour-schedule__item-details-para">Thứ <?= $thu_text_De ?>, Nha Trang, Khánh Hoà</div>
                                        </div>
                                    </li>
                                    <li class="tour-schedule__item-details-index">
                                        <div class="tour-schedule__item-details-date">
                                            <span class="tour-schedule__item-details-day"><?= $return_day ?></span>
                                            <span class="tour-schedule__item-details-month">Tháng <?= $return_month ?></span>

                                        </div>
                                        <div class="tour-schedule__item-details-desc">
                                            <div class="tour-schedule__item-details-title">Ngày kết thúc chuyến đi</div>
                                            <div class="tour-schedule__item-details-para">Thứ <?= $thu_text_Re ?>, Vĩnh Hy, Ninh Thuận</div>
                                        </div>
                                    </li>
                                </ul>
                                <div class="tour-schedule__item-details-term">
                                    Vui lòng đọc kỹ <a class="red-txt" href="#"><strong>Điều khoản</strong></a> của chúng tôi trước khi đặt vé
                                </div>
                            </div>
                            <div class="tour-schedule__item-details-right">
                                <div class="tour-schedule__item-details-form">
                                    <div class="tour-schedule__item-details-form-title">Điều Chỉnh</div>
                                    <div class="tour-schedule__item-details-form-wrap">
                                        <div class="tour-schedule__item-details-form-row">
                                            <div class="tour-schedule__item-details-form-subtitle">
                                                <div class="tour-schedule__item-details-form-label">Người lớn</div>
                                                <div class="tour-schedule__item-details-form-price" data-price="<?= $item->fare_adult ?>"><?= formatVND($item->fare_adult) ?> đ</div>
                                            </div>
                                            <div class="tour-schedule__item-details-form-quantity">
                                                <button class="tour-schedule__item-details-form-quantity-control minus"><i class="fa-solid fa-minus"></i></button>
                                                <input readonly type="text" value="1">
                                                <button class="tour-schedule__item-details-form-quantity-control plus"><i class="fa-solid fa-plus"></i></button>
                                            </div>
                                        </div>
                                        <?php if ($item->fare_child > 0): ?>
                                            <div class="tour-schedule__item-details-form-row">
                                                <div class="tour-schedule__item-details-form-subtitle">
                                                    <div class="tour-schedule__item-details-form-label">Trẻ em</div>
                                                    <div class="tour-schedule__item-details-form-price" data-price="<?= $item->fare_child ?>"><?= formatVND($item->fare_child) ?> đ</div>
                                                </div>
                                                <div class="tour-schedule__item-details-form-quantity">
                                                    <button class="tour-schedule__item-details-form-quantity-control minus"><i class="fa-solid fa-minus"></i></button>
                                                    <input readonly type="text" value="1">
                                                    <button class="tour-schedule__item-details-form-quantity-control plus"><i class="fa-solid fa-plus"></i></button>
                                                </div>
                                            </div>
                                        <?php endif; ?>

                                        <div class="tour-schedule__item-details-form-row total">
                                            <div class="tour-schedule__item-details-form-subtitle">
                                                <div class="tour-schedule__item-details-form-label tour-schedule__item-details-form-label--ct-style">Tổng chi phí</div>
                                                <div class="tour-schedule__item-details-form-price tour-schedule__item-details-form-price--ct-style">3.500.000đ</div>
                                            </div>
                                            <div class="tour-schedule__item-details-form-btn-wrap">
                                                <a href="#contact" class="tour-schedule__item-details-form-btn">Đặt Ngay</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    <?php else: ?>
        <div class="tour-schedule__no-data">
            <p>Không có thông tin tour cho ngày <?= esc_html($date) ?>.</p>
        </div>
    <?php endif; ?>

<?php $content = ob_get_clean();
    return $content;
}


function ajax_load_tour_schedule()
{
    $id = isset($_GET['id']) ? intval($_GET['id']) : 2;
    $date = isset($_GET['date']) ? sanitize_text_field($_GET['date']) : '';

    $shortcode = '[tourschedule id="' . $id . '"';
    if ($date) {
        $shortcode .= ' date="' . esc_attr($date) . '"';
    }
    $shortcode .= ']';

    $html = do_shortcode($shortcode);

    echo $html;
    wp_die(); // Kết thúc AJAX

}
add_action('wp_ajax_ajax_load_tour_schedule', 'ajax_load_tour_schedule');
add_action('wp_ajax_nopriv_ajax_load_tour_schedule', 'ajax_load_tour_schedule');


function ajax_load_tour_packages()
{
    $id = isset($_GET['id']) ? intval($_GET['id']) : 2;
    $html = do_shortcode('[tour_packages id="' . $id . '"]');
    echo $html;
    wp_die();
}
add_action('wp_ajax_ajax_load_tour_packages', 'ajax_load_tour_packages');
add_action('wp_ajax_nopriv_ajax_load_tour_packages', 'ajax_load_tour_packages');
