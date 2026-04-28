jQuery(document).ready(function(){

    //Main Slider
    var owl;
    var focus_count = 1;
    jQuery('.home-main-content__nav-item').click(function(){
        let old_data_slider = jQuery('.home-main-content__nav-item.active').attr('data-slider');
        jQuery(`.home-main-content__tour-list[data-slider=${old_data_slider}]`).owlCarousel('destroy');
        focus_count = 1;

        jQuery(this).addClass('active');
        jQuery(this).siblings().removeClass('active');
        let bg_url = jQuery(this).attr('data-bg');
        let slogan = jQuery(this).attr('data-slogan');
        jQuery('.home-main-content__bg').css('background-image', `url('${bg_url}')`);
        jQuery(`.home-main-content__slogan-txt[data-slogan="${slogan}"]`).addClass('active');
        jQuery(`.home-main-content__slogan-txt[data-slogan="${slogan}"]`).siblings().removeClass('active');

        startMainSlider();
    });

    startMainSlider();
    
    function onOwlChanged(event) {
        var currentIndex = event.item.index;
        var currentItem = jQuery(event.target).find(".owl-item").eq(currentIndex);
        var dataElement = currentItem.find('.home-main-content__tour-info-2');
        var tourId = dataElement.data('id');

        if (!tourId) return; 
        var tourHtml = document.querySelector('#tour_packages');
        tourHtml.innerHTML = '';
        var spinner = document.querySelector('.container-spinner');

        spinner.style.visibility = "visible";
        spinner.style.display = "block"; 

        fetch(ajax_object.ajax_url + '?action=ajax_load_tour_packages&id='+ tourId )
        .then(res => {
            if (!res.ok) throw new Error('HTTP status ' + res.status);
            return res.text();
        })
        .then(html => {
            spinner.style.visibility = "hidden"; 
            spinner.style.display = "none";  
            tourHtml.innerHTML = html;
            const daiNgay = jQuery('.tour-packages__nav-item[data-slider="dai-ngay"]');
            const trongNgay = jQuery('.tour-packages__nav-item[data-slider="trong-ngay"]');
        
            if (daiNgay.length === 0 && trongNgay.length > 0) {
                trongNgay.find('.tour-packages__nav-item-wrap').trigger('click');
            }
            startTourPackagesSlider();
        })
        .catch(err => {
            console.log('AJAX error:', err);
        });

    }
    function startMainSlider() {
        let data_slider = jQuery('.home-main-content__nav-item.active').attr('data-slider');
        owl = jQuery(`.home-main-content__tour-list[data-slider=${data_slider}]`);

        owl.on('initialized.owl.carousel', function(event){
            jQuery('.home-main-content__tour-current').text(focus_count);
            jQuery('.home-main-content__tour-total').text(event.item.count);
            jQuery('.home-main-content__tour-list .owl-item.active').eq(0).addClass('focus');
            let title = jQuery('.home-main-content__tour-list .owl-item.active.focus .home-main-content__tour-info-2').attr('data-title');
            let content = jQuery('.home-main-content__tour-list .owl-item.active.focus .home-main-content__tour-info-2').attr('data-content');
            jQuery('.home-main-content__tour-info-title').text(title);
            jQuery('.home-main-content__tour-info-desc').text(content);
        });

        owl.owlCarousel({
            margin: 15,
            // autoplay: true,
            loop: true,
            dots : false,
            responsive : {
                0 : {
                    items: 1
                },
                550 : {
                    items: 2.5
                },
                850 : {
                    items: 3.5
                }
            },
            onChanged:  onOwlChanged

        });

        owl.on('translated.owl.carousel', function(event){
            focus_count++;
            if(focus_count > event.item.count) {
                focus_count = 1;
            }
            jQuery('.home-main-content__tour-current').text(focus_count);
            jQuery('.home-main-content__tour-list .owl-item').removeClass('focus');
            jQuery('.home-main-content__tour-list .owl-item.active').eq(0).addClass('focus');
            let title = jQuery('.home-main-content__tour-list .owl-item.active.focus .home-main-content__tour-info-2').attr('data-title');
            let content = jQuery('.home-main-content__tour-list .owl-item.active.focus .home-main-content__tour-info-2').attr('data-content');
            jQuery('.home-main-content__tour-info-title').text(title);
            jQuery('.home-main-content__tour-info-desc').text(content);
        });
    }

    //Hot Deal Slider
    function hotDealChangePlaceText() {
        let place = jQuery('.hot-deal__slider .owl-item.active .hot-deal__slider-item').attr('data-place');
        jQuery('.hot-deal__slider-nav-txt').text(place);
    }

    var hot_deal_slider = jQuery('.hot-deal__slider');
    hot_deal_slider.on('initialized.owl.carousel', function(event){
        hotDealChangePlaceText();
    });

    hot_deal_slider.owlCarousel({
        items: 1,
        loop: true
    });

    hot_deal_slider.on('translated.owl.carousel', function(event){
        hotDealChangePlaceText();
    });
    
    jQuery('.hot-deal__slider-nav-btn-next').click(function(){
        hot_deal_slider.trigger('next.owl.carousel');
    });
    jQuery('.hot-deal__slider-nav-btn-prev').click(function(){
        hot_deal_slider.trigger('prev.owl.carousel');
    });

    //Tour Packages
    jQuery(document).on('click', '.tour-packages__nav-item-wrap', function() {
        if(!jQuery(this).parent().hasClass('active')) {
            let old_data_slider = jQuery('.tour-packages__nav-item.active').attr('data-slider');
            jQuery(`.tour-packages__slider[data-slider=${old_data_slider}]`).slick('slickUnfilter');
            jQuery(`.tour-packages__slider[data-slider=${old_data_slider}]`).slick('unslick');
            jQuery(`.tour-packages__slider[data-slider=${old_data_slider}]`).css('display', 'none');
            jQuery(this).parent().addClass('active');
            jQuery(this).parent().siblings().removeClass('active');
            if(jQuery(this).parent().hasClass('tour-packages__nav-item--ct-style')) {
                jQuery(this).parent().find('.tour-packages__nav-sub-items-wrap').show(300);
            } else {
                jQuery(this).parent().siblings().find('.tour-packages__nav-sub-items-wrap').hide(300);
            }
            if(jQuery(this).parent().hasClass('tour-packages__nav-item--ct-style')) {
                jQuery(this).parent().find('.tour-packages__nav-sub-item').removeClass('active');
                jQuery(this).parent().find('.tour-packages__nav-sub-item:first-child').addClass('active');
            }
            startTourPackagesSlider();
        }
    });

    jQuery(document).on('click', '.tour-packages__nav-sub-item', function(){
        if(!jQuery(this).hasClass('active')) {
            jQuery(this).addClass('active');
            jQuery(this).siblings().removeClass('active');
            let filter = jQuery(this).attr('data-filter');
            if(filter == '.all') {
                tour_packages_slider.slick('slickUnfilter');
            } else {
                tour_packages_slider.slick('slickUnfilter');
                tour_packages_slider.slick('slickFilter', filter);
            }
        }
    });

    var tour_packages_slider;

    startTourPackagesSlider();

    function startTourPackagesSlider() {
        let data_slider = jQuery('.tour-packages__nav-item.active').attr('data-slider');
        jQuery(`.tour-packages__slider[data-slider=${data_slider}]`).css('display', 'block');
        tour_packages_slider = jQuery(`.tour-packages__slider[data-slider=${data_slider}]`);
        tour_packages_slider.slick({
            slidesToShow: 5,
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: '0px',
            dots: true,
            arrows: false,
            loop: true,
            responsive: [
                {
                  breakpoint: 1001,
                  settings: {
                    slidesToShow: 3
                  }
                },
                {
                  breakpoint: 550,
                  settings: {
                    slidesToShow: 1,
                    centerPadding: '40px',
                  }
                }
            ]
        });
    }

    //Moment Slider
    jQuery('.moment__slider').owlCarousel({
        items: 1,
        loop: true
    });

    //News Slider
    jQuery('.news__slider').owlCarousel({
        items: 1,
        loop: true
    });


    //Tour Page Slider
    jQuery('.tour-main-slider').slick({

        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.tour-nav-slider'

    });

    //Tour Page Slider
    jQuery('.tour-nav-slider').slick({

        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: '.tour-main-slider',
        dots: true,
        focusOnSelect: true,
        arrows: false,

        responsive: [
            {
              breakpoint: 850,
              settings: {
                slidesToShow: 3
              }
            },
            {
              breakpoint: 550,
              settings: {
                slidesToShow: 2
              }
            }
        ]

    });


    //Tour Page Timeline Slider

    jQuery('.tour-days').slick({
        slidesToShow: 8,
        slidesToScroll: 1,
        infinite: false,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',

        responsive: [
            {
              breakpoint: 850,
              settings: {
                slidesToShow: 5
              }
            },
            {
              breakpoint: 550,
              settings: {
                slidesToShow: 3
              }
            }
        ]

    });

    function normalizeDate(schedule) {
        const isValidDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(schedule);

        if (!isValidDateFormat) {
            const match = schedule.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
            if (match) {
                const day = match[1];
                const month = match[2];
                const year = match[3];
                //Convert YYYY-MM-dd
                schedule = `${year}-${month}-${day}`;
            } else {
                console.warn('Định dạng ngày không hợp lệ:', schedule);
            }
        }
        return schedule;

    }
    
    jQuery('.tour-days').on('click', '.tour-day', function() {

        let schedule = jQuery(this).attr('data-day');
         schedule = normalizeDate(schedule) ;
    //     let tourId = 1;
    // fetch(ajax_object.ajax_url + `?action=ajax_load_tour_schedule&date=${encodeURIComponent(schedule)}&id=${tourId}`)
    //     .then(res => {
    //         if (!res.ok) {
    //             throw new Error(`Lỗi server: ${res.status}`);
    //         }
    //         return res.text();
    //     })
    //     .then(html => {
    //         if (!html || html.trim() === '') {
    //             throw new Error('Không có nội dung trả về');
    //         }

    //         jQuery('.tour-schedules').html(html);

    //         jQuery('.tour-day').removeClass('active');
    //         jQuery(this).addClass('active');
    //     })
    //     .catch(err => {
    //         console.log('Đã xảy ra lỗi:', err);
    //         jQuery('.tour-schedule-container').html(`<div class="error">Không thể tải lịch trình. Vui lòng thử lại sau.</div>`);
    //     });
        
    jQuery(this).addClass('active');
    jQuery(this).siblings().removeClass('active');

    const $targetSchedule = jQuery(`.tour-schedule[data-day="${schedule}"]`);

    if ($targetSchedule.length > 0) {
        $targetSchedule.addClass('active').siblings().removeClass('active');
        jQuery('.no-schedule-msg').html(``);
    } else {
        jQuery('.tour-schedule').removeClass('active');
        jQuery('.no-schedule-msg').html(`
             Hiện tại chưa có lịch cho tour này
        `);
    }

    });

    var tour_calendar_btn = new Datepicker('.tour-calendar-btn', {
        onChange: (e) => {
            let date = new Date(e);
            let formattedDate = date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            jQuery('.tour-day[data-day="' + formattedDate + '"]').trigger('click');

            // let slick = jQuery(`.tour-day[data-day="${formattedDate}"]`).attr('data-slick-index');
            // jQuery('.tour-days').slick('slickGoTo', slick);
            // jQuery(`.tour-day[data-day="${formattedDate}"]`).addClass('active');
            // jQuery(`.tour-day[data-day="${formattedDate}"]`).siblings().removeClass('active');

            // jQuery(`.tour-schedule[data-day="${formattedDate}"]`).addClass('active');
            // jQuery(`.tour-schedule[data-day="${formattedDate}"]`).siblings().removeClass('active');
        }
    });

    
    //Tour Page Quantity Form
    jQuery(document).on('click', '.tour-schedule__item-details-form-quantity-control.plus', function() {
        let quantity = jQuery(this).siblings('input').val();
        quantity++;
        jQuery(this).siblings('input').val(quantity);
        let container = jQuery(this).closest('.tour-schedule__item-details-form-wrap');

        let price_inputs = jQuery(this).parents('.tour-schedule__item-details-form-wrap').find('.tour-schedule__item-details-form-row:not(.total)');
        let total_input = jQuery(this).parents('.tour-schedule__item-details-form-wrap').find('.tour-schedule__item-details-form-row.total').find('.tour-schedule__item-details-form-price');
        let total = 0;

        jQuery(price_inputs).each(function(){
            let price = Number(jQuery(this).find('.tour-schedule__item-details-form-price').attr('data-price'));
            let quantity = Number(jQuery(this).find('input').val());
            let subtotal = price * quantity;
            total += subtotal;
        });

        total = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        total_input.text(total + 'đ');
        
        let adultInputValue = Number(container.find('.adult-price').val());
        if (adultInputValue > 0) {
            container.find('.tour-schedule__item-details-form-btn').removeClass('btn-disabled');
        } else {
            container.find('.tour-schedule__item-details-form-btn').addClass('btn-disabled');
        }
    });

    jQuery(document).on('click', '.tour-schedule__item-details-form-quantity-control.minus', function() {

        let quantity = jQuery(this).siblings('input').val();
        quantity--;
        if(quantity < 0) {
            quantity = 0;
        }
        jQuery(this).siblings('input').val(quantity);
        let container = jQuery(this).closest('.tour-schedule__item-details-form-wrap');

        let price_inputs = jQuery(this).parents('.tour-schedule__item-details-form-wrap').find('.tour-schedule__item-details-form-row:not(.total)');
        let total_input = jQuery(this).parents('.tour-schedule__item-details-form-wrap').find('.tour-schedule__item-details-form-row.total').find('.tour-schedule__item-details-form-price');
        let total = 0;

        jQuery(price_inputs).each(function(){
            let price = Number(jQuery(this).find('.tour-schedule__item-details-form-price').attr('data-price'));
            let quantity = Number(jQuery(this).find('input').val());
            let subtotal = price * quantity;
            total += subtotal;
        });

        total = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        total_input.text(total + 'đ');
        let adultInputValue = Number(container.find('.adult-price').val());
        if (adultInputValue > 0) {
            container.find('.tour-schedule__item-details-form-btn').removeClass('btn-disabled');
        } else {
            container.find('.tour-schedule__item-details-form-btn').addClass('btn-disabled');
        }

    });


    //Show Details Tour
    jQuery(document).on('click', '.tour-schedule__item-view-details', function() {
        jQuery(this).parents('.tour-schedule__item').find('.tour-schedule__item-details-wrap').slideToggle(300);
    });
    

    //Trip
    let trip_active = 0;
    jQuery('.trip-view-details').click(function(){
        if(trip_active == 0) {
            jQuery(this).find('.trip-view-details__icon').html('<i class="fas fa-arrow-up"></i>');
            jQuery(this).find('.trip-view-details__txt').html('Thu Gọn');
            trip_active = 1;
        } else {
            jQuery(this).find('.trip-view-details__icon').html('<i class="fas fa-arrow-down"></i>');
            jQuery(this).find('.trip-view-details__txt').html('Xem Chi Tiết');
            trip_active = 0;
        }
        jQuery(this).parents('.trip-item').find('.trip-item__details-wrap').slideToggle(300);
        jQuery(this).parents('.trip-item').toggleClass('active');
    });


    //Tour Tabs
    jQuery('.tour-tab').click(function(){
        let tab = jQuery(this).attr('data-tab');
        jQuery(this).addClass('active');
        jQuery(this).siblings().removeClass('active');
        jQuery(`.tour-content[data-tab=${tab}]`).addClass('active');
        jQuery(`.tour-content[data-tab=${tab}]`).siblings().removeClass('active');
    });

    let isLoading = false;

    jQuery('.tour-days').on('afterChange', function(event, slick, currentSlide) {
        const nearEnd = currentSlide + slick.options.slidesToShow >= slick.slideCount - 1;
    
        if (nearEnd && !isLoading) {
            isLoading = true;
            loadMoreDays();
    
            setTimeout(() => isLoading = false, 500);
        }
    });
    function loadMoreDays() {
        var lastDateStr = jQuery('.slick-track .tour-day').last().data('day'); // ví dụ: "31/3/2025"
        
        var parts = lastDateStr.split('/');
        var day = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10) - 1;
        var year = parseInt(parts[2], 10);
        
        var currentDate = new Date(year, month, day);
    
        for (var i = 1; i <= 10; i++) {
            currentDate.setDate(currentDate.getDate() + 1); 
    
            var yyyy = currentDate.getFullYear();
            var mm = String(currentDate.getMonth() + 1).padStart(2, '0');
            var dd = String(currentDate.getDate()).padStart(2, '0');
            var formatted = dd + '/' + mm + '/' + yyyy;
    
            var dayName1 = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
            var rawDayName2 = currentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });

            var parts = rawDayName2.split(' ');
            var dayName2 = `${parts[0]}<br>${parts[1]}`;    
            var dayHtml = `
                <div class="tour-day" data-day="${formatted}">
                    <div class="tour-day__name-1">${dayName1}</div>
                    <div class="tour-day__name-2">${dayName2}</div>
                </div>
            `;
    
            jQuery('.tour-days').slick('slickAdd', dayHtml);
        }
        jQuery('.tour-days').slick('refresh');

    }
    loadFirst10Days();
    function loadFirst10Days() {
        const firstSchedule = jQuery('.tour-schedules').find('.tour-schedule').first();
        if (firstSchedule.length <= 0) {
            jQuery('.no-schedule-msg').html(`
                Hiện tại chưa có lịch cho tour này
           `);
           return;
        } 
        jQuery('.no-schedule-msg').html(``);
        const [year, month, day] = firstSchedule.data('day').split('-');
        const startDate = new Date(year, month - 1, day);
        jQuery('.tour-days').slick('slickRemove', null, null, true); 
        const currentDate = startDate;
        currentDate.setDate(currentDate.getDate() - 1);
        Array.from({ length: 10 }).forEach(() => {
            currentDate.setDate(currentDate.getDate() + 1);  
    
            const formatted = currentDate.toLocaleDateString('en-GB');  // dd/mm/yyyy
            const [day, month, year] = formatted.split('/');  
    
            const dayName1 = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
            const rawDayName2 = currentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
    
            const [dayNumber, monthName] = rawDayName2.split(' '); 
            const dayName2 = `${dayNumber}<br>${monthName}`;
    
            const dayHtml = `
                <div class="tour-day" data-day="${formatted}">
                    <div class="tour-day__name-1">${dayName1}</div>
                    <div class="tour-day__name-2">${dayName2}</div>
                </div>
            `;
            jQuery('.tour-days').slick('slickAdd', dayHtml);
        });
        jQuery('.tour-days').slick('refresh');
        jQuery('.slick-track .tour-day').first().trigger('click');
    }
    
    

});

