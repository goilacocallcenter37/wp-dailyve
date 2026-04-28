jQuery(document).ready(function ($) {
  // Fancybox.bind("[data-fancybox]", { });

  jQuery(".accordion-item").each(function () {
    jQuery(this).find(".accordion-title").next("p").remove();
    if (jQuery(this).find(".accordion-title").parent().is("p")) {
      jQuery(this).find(".accordion-title").prependTo(this);
      jQuery(this).find(".accordion-inner").prev("p").remove();
    }
  });

  // JS Báo Chí

  jQuery(document).ready(function ($) {
    $(".slider-container").slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      infinite: true,
      arrows: true,
      prevArrow: $(".slider-tyle-1-bao-chi-nav--Prev"),
      nextArrow: $(".slider-tyle-1-bao-chi-nav--next"),

      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
          },
        },
      ],
    });
  });

  //Collaborator

  jQuery(document).on("click", ".bmd-collab-booking-btn", function () {
    jQuery(".collab-trip-search").addClass("collab-show");
    jQuery("html, body").addClass("collab-ow-hidden");
  });

  jQuery(document).on("click", ".collab-trip-search__overlay", function () {
    jQuery(".collab-trip-search").removeClass("collab-show");
    jQuery("html, body").removeClass("collab-ow-hidden");
  });

  // jQuery(document).on('click', '.tab-custom .nav li, .tab-custom .nav li a', function(){
  //     if(jQuery(this).hasClass('active')) {
  //         console.log("co ac");

  //         jQuery(this).css('background-color', 'red');
  //     } else {
  //         console.log("ko ac");
  //         jQuery(this).css('background-color', '');
  //     }
  // });

  // jQuery('.bmd-collab-login-form-submit').click(function(){

  //     jQuery('.bmd-collab-login-form-notice').hide();

  //     let parent = jQuery(this).parents('.bmd-collab-login-form');

  //     let email = parent.find('[name="email"]');
  //     let password = parent.find('[name="password"]');
  //     let submit = jQuery(this);

  //     if(email.val() == '') {
  //         email.next().text('Email không được bỏ trống');
  //         email.next().show();
  //         return;
  //     }

  //     if(!isValidEmail(email.val())) {
  //         email.next().text('Email không hợp lệ');
  //         email.next().show();
  //         return;
  //     }

  //     if(password.val() == '') {
  //         password.next().text('Mật khẩu không được bỏ trống');
  //         password.next().show();
  //         return;
  //     }

  //     jQuery.ajax({
  //         url: generic_data.ajax_url,
  //         type: 'POST',
  //         dataType: 'json',
  //         data: {
  //             action: 'bmd_collab_login',
  //             _ajax_nonce: generic_data.nonce,
  //             email: email.val(),
  //             password: password.val()
  //         },
  //         beforeSend: function() {

  //         },
  //         success: function (response) {
  //             if(response.data.content) {
  //                 // location.reload();
  //                 console.log(response.data.content);
  //             } else {
  //                 submit.next().text('Email hoặc Mật khẩu không chính xác');
  //                 submit.next().show();
  //             }
  //         }
  //     });

  // });

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  hideLoginBtn();

  function hideLoginBtn() {
    if (jQuery(".collab-message").length > 0) {
      jQuery(".auth-menu-container").remove();
    }
  }

  // jQuery('.collab-message__logout-btn').click(function(){

  //     jQuery.ajax({
  //         url: generic_data.ajax_url,
  //         type: 'POST',
  //         dataType: 'json',
  //         data: {
  //             action: 'bmd_collab_logout',
  //             _ajax_nonce: generic_data.nonce,
  //         },
  //         beforeSend: function() {

  //         },
  //         success: function (response) {
  //             if(response.data) {
  //                 location.reload();
  //             }
  //         }
  //     });

  // });

  jQuery(document).on("click", ".bmd-pagination-item.selectable", function () {
    let page = Number(jQuery(this).attr("data-page"));

    jQuery.ajax({
      url: generic_data.ajax_url,
      type: "GET",
      dataType: "json",
      data: {
        action: "bmd_collab_request_list",
        page: page,
        ajax: 1,
      },
      beforeSend: function () {},
      success: function (response) {
        jQuery(".bmd-request-wrap").html(response.data);
      },
    });
  });

  jQuery(document).on("click", ".bmd-collab-booking-btn", function () {
    let booking_request_id = jQuery(this).attr("data-request-id");
    let request_name = jQuery(this).attr("data-request-name");
    let request_phone = jQuery(this).attr("data-request-phone");
    jQuery('[name="bookingrequestid"]').val(booking_request_id);
    jQuery('[name="collab-guest-name"]').val(request_name);
    jQuery('[name="collab-guest-phone"]').val(request_phone);
  });

  //End Collaborator

  var old_scroll_top = 0;

  // jQuery(document).on('click','.online-booking-page__provider-list__item', function(){

  //     let depart_time = jQuery(this).attr('data-depart-time');
  //     let depart_place = jQuery(this).attr('data-depart-place');
  //     let total_time = jQuery(this).attr('data-total-time');
  //     let arrival_time = jQuery(this).attr('data-arrival-time');
  //     let arrival_place = jQuery(this).attr('data-arrival-place');
  //     let rating_score = jQuery(this).attr('data-rating-score');
  //     let rating_count = jQuery(this).attr('data-rating-count');
  //     let company_id = jQuery(this).attr('data-company');
  //     let trip_code = jQuery(this).attr('data-trip-code');
  //     let img = jQuery(this).attr('data-bus-image');

  //     bmd_overall_reviews(company_id);
  //     bmd_reviews(company_id);
  //     bmd_utilities(company_id);
  //     bmd_policy(trip_code);
  //     bmd_seat_booking(jQuery(this));
  //     autoSetHeightLine();

  //     jQuery('.bmd-review-ticket [data-depart-time]').text(depart_time);
  //     jQuery('.bmd-review-ticket [data-depart-place]').text(depart_place);
  //     jQuery('.bmd-review-ticket [data-total-time]').text(total_time);
  //     jQuery('.bmd-review-ticket [data-arrival-time]').text(arrival_time);
  //     jQuery('.bmd-review-ticket [data-arrival-place]').text(arrival_place);
  //     jQuery('.bmd-review-ticket [data-rating-score]').text(rating_score);
  //     jQuery('.bmd-review-ticket [data-rating-count]').text(rating_count);
  //     jQuery('.bmd-review-ticket [data-bus-image]').find('img').attr('src', img);
  //     jQuery('.bmd-review-ticket__btn').removeAttr('disabled');

  //     jQuery('.bmd-review-ticket').addClass('show');
  //     jQuery('.bmd-trips-wrapper').addClass('hide');

  //     old_scroll_top = jQuery(document).scrollTop();

  //     jQuery('html,body').animate({scrollTop: 0},'fast');

  // });

  jQuery(".bmd-review-ticket__back-btn").click(function () {
    jQuery(".bmd-review-ticket").removeClass("show");
    jQuery(".bmd-trips-wrapper").removeClass("hide");
    jQuery(".bmd-review-ticket__trip-item-line").innerHeight(0);

    jQuery("html,body").animate({ scrollTop: old_scroll_top }, "fast");
  });

  bmd_move_elements_on_tablet();

  function bmd_move_elements_on_tablet() {
    if (jQuery(window).width() < 850) {
      jQuery(".bmd-review-ticket__booking-seat").appendTo(
        ".bmd-review-ticket__body-left",
      );
      jQuery(".bmd-review-ticket__utilities").appendTo(
        ".bmd-review-ticket__body-left",
      );
      jQuery(".bmd-review-ticket__ratings").prependTo(
        ".bmd-review-ticket__body-right",
      );
      jQuery(".bmd-review-ticket__policies").appendTo(
        ".bmd-review-ticket__body-right",
      );
    }
  }

  function bmd_overall_reviews(company_id) {
    jQuery.ajax({
      url: generic_data.ajax_url,
      type: "GET",
      dataType: "json",
      data: {
        action: "bmd_get_overall_reviews",
        company_id: company_id,
      },
      beforeSend: function () {
        jQuery(".bmd-review-ticket__rating-overall").html(
          '<div class="warrap-loader"><span class="loader"></span></div>',
        );
      },
      success: function (response) {
        jQuery(".bmd-review-ticket__rating-overall").html(response.data);
      },
    });
  }

  function bmd_reviews(company_id, page = 1) {
    jQuery.ajax({
      url: generic_data.ajax_url,
      type: "GET",
      dataType: "json",
      data: {
        action: "bmd_get_reviews",
        company_id: company_id,
        page: page,
      },
      beforeSend: function () {
        jQuery(".bmd-review-ticket__comments-wrap").html(
          '<div class="warrap-loader"><span class="loader"></span></div>',
        );
      },
      success: function (response) {
        jQuery(".bmd-review-ticket__comments-wrap").html(response.data);
      },
    });
  }

  function bmd_utilities(company_id) {
    jQuery.ajax({
      url: generic_data.ajax_url,
      type: "GET",
      dataType: "json",
      data: {
        action: "bmd_get_utilities",
        company_id: company_id,
      },
      beforeSend: function () {
        jQuery(".bmd-review-ticket__amenities").html(
          '<div class="warrap-loader"><span class="loader"></span></div>',
        );
      },
      success: function (response) {
        jQuery(".bmd-review-ticket__amenities").html(response.data);
      },
    });
  }

  function bmd_policy(trip_code) {
    jQuery.ajax({
      url: generic_data.ajax_url,
      type: "GET",
      dataType: "json",
      data: {
        action: "bmd_get_policies",
        trip_code: trip_code,
      },
      beforeSend: function () {
        jQuery(".bmd-review-ticket__policy-list").html(
          '<div class="warrap-loader"><span class="loader"></span></div>',
        );
      },
      success: function (response) {
        jQuery(".bmd-review-ticket__policy-list").html(response.data);
      },
    });
  }

  function bmd_reset_data() {
    seatsList = [];

    formBooking = {
      schedule: null,
      seatsAndInfoData: null,
      selectedSeats: [],
      pickupPoint: null,
      dropoffPoint: null,
      note: "",
    };
  }

  function bmd_seat_booking(selector) {
    var url = new URL(window.location.href);

    searchParams = url.searchParams;

    // if (url.searchParams.get("date") != undefined || url.searchParams.get("date") != null) {
    //     let [d, m, y] = url.searchParams.get("date").split("-")
    //     date = `${d}-${m}-${y}`
    // }

    let date =
      searchParams.get("date") ??
      new Date()
        .toLocaleDateString("vi-VN")
        .split("/")
        .map((part) => part.padStart(2, "0"))
        .join("-");
    var $this = $(selector);
    let tripCode = $this.attr("data-trip-code");
    let companyId = $this.attr("data-company");
    const scheduleData = atob($this.attr("data-schedule"));
    let schedule = JSON.parse(scheduleData);
    // var contentElement = $('#seats-info-conetnt-' + tripCode);

    currentStep = 1;

    // if ($this.hasClass('btn-close')) {
    //     handleSeatClose();
    //     return
    // } else {
    //     $this.prop('disabled', true);
    //     handleSeatClose();

    // }

    bmd_reset_data();

    let data = {
      action: "choose_trip_ajax_booking",
      tripCode: tripCode,
      companyId: companyId,
      date: date,
      nonce: generic_data.nonce,
    };

    jQuery.ajax({
      url: generic_data.ajax_url,
      type: "POST",
      data: data,
      beforeSend: function () {
        jQuery(".bmd-review-ticket__booking-seat").html(
          '<div class="warrap-loader"><span class="loader"></span></div>',
        );
        // jQuery('#route-trip-' + tripCode)[0].scrollIntoView({ behavior: 'smooth' });
        // $('#ticket-loading-' + tripCode).html('<div class="warrap-loader"><span class="loader"></span></div>');
      },

      success: function (response) {
        $this.removeAttr("disabled");
        if (response.success) {
          $("#ticket-loading-" + tripCode).empty();
          const data = response.data;
          // console.log(data);

          seatsList = data.seats;
          formBooking.schedule = schedule;
          formBooking.seatsAndInfoData = data.data;
          // $this.text('Đóng');
          // $this.addClass('btn-close');
          jQuery(".bmd-review-ticket__booking-seat").html(data.html);
          // contentElement.html(data.html);
        } else {
          if (
            confirm(
              `Dailyve đang cập nhật chuyến đi này vui lòng liên hệ: ${hotline} để được hỗ trợ!`,
            )
          ) {
            window.location.href = `tel:${hotline}`;
          }
        }
        $("#ticket-loading-" + tripCode).empty();
      },
      error: function (xhr, status, error) {
        // console.log('Error: ' + error);
        // console.log('Status: ' + status);
        // $('#seats-info-conetnt-' + tripCode).html('<div class="error">Đã xảy ra lỗi, vui lòng thử lại sau.</div>');
        if (
          confirm(
            `Dailyve đang bảo trì quý khách vui lòng liên hệ: ${hotline} để được hỗ trợ!`,
          )
        ) {
          window.location.href = `tel:${hotline}`;
        }
        $("#ticket-loading-" + tripCode).empty();
        $this.removeAttr("disabled");
      },
    });
  }

  function scrollToAnchor(selector) {
    let anchor = jQuery("#" + selector);
    jQuery("html,body").animate(
      { scrollTop: anchor.offset().top - 100 },
      "fast",
    );
  }

  jQuery(document).on("click", ".bmd-comment-readmore", function () {
    let company_id = Number(jQuery(this).attr("data-company"));
    let page = Number(jQuery(this).attr("data-page"));
    bmd_reviews(company_id, page);
    scrollToAnchor("bmd-review-ticket__rating-overall");
  });

  jQuery(".bmd-rating-toggle").click(function () {
    jQuery(this).toggleClass("active");
    jQuery(".bmd-review-ticket__rating-body").slideToggle(300);
  });

  jQuery(".bmd-policy-toggle").click(function () {
    jQuery(this).toggleClass("active");
    jQuery(".bmd-review-ticket__policy-list").slideToggle(300);
  });

  if (
    jQuery(".booking-confirmation").length > 0 ||
    jQuery(".bmd-payment-page").length > 0
  ) {
    autoSetHeightLine();
  }

  function autoSetHeightLine() {
    setTimeout(function () {
      jQuery(".bmd-review-ticket__trip-item-icon").each(function () {
        let icon_height = jQuery(this).innerHeight();
        let line_height = icon_height;
        let line = jQuery(this).find(".bmd-review-ticket__trip-item-line");
        line.innerHeight(line_height);
      });
    }, 500);
  }

  jQuery(".bmd-wrap .sort__sort-container .sort-title").click(function () {
    jQuery(this).toggleClass("active");
    jQuery(this).next().slideToggle(300);
  });

  jQuery(".filter_bus-operator h3").click(function () {
    jQuery(this).toggleClass("active");
    jQuery(this).next().slideToggle(300);
  });

  jQuery(".bmd-search-swap-location").click(function () {
    const o = jQuery("#inputFrom").val(),
      l = jQuery("#from").val(),
      n = jQuery("#nameFrom").val(),
      v = jQuery("#inputTo").val(),
      t = jQuery("#to").val(),
      e = jQuery("#nameTo").val();
    (jQuery("#inputFrom").val(v),
      jQuery("#from").val(t),
      jQuery("#nameFrom").val(e),
      jQuery("#inputTo").val(o),
      jQuery("#to").val(l),
      jQuery("#nameTo").val(n));
  });

  jQuery.datepicker.regional["vi"] = {
    closeText: "Đóng",
    prevText: "&#x3C;Trước",
    nextText: "Tiếp&#x3E;",
    currentText: "Hôm nay",
    monthNames: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    monthNamesShort: [
      "Th1",
      "Th2",
      "Th3",
      "Th4",
      "Th5",
      "Th6",
      "Th7",
      "Th8",
      "Th9",
      "Th10",
      "Th11",
      "Th12",
    ],
    dayNames: [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ],
    dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    dayNamesMin: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    weekHeader: "Tu",
    dateFormat: "dd-mm-yy",
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: "",
  };
  jQuery.datepicker.setDefaults(jQuery.datepicker.regional["vi"]);

  if ($("body").hasClass("page-template-collab-request-list")) {
    jQuery('[name="departDate"]').datepicker({
      minDate: 0,
    });

    jQuery('[name="returnDate"]').datepicker({});
  }

  initCounter();

  $(".category-posts-list-slide").slick({
    infinite: true,
    autoplay: false,
    arrows: true,
    prevArrow:
      '<button type="button" class="slick-prev"><img width="48" height="48" style="width: 48px;" src="/wp-content/uploads/images/left-arrow-slick.png" alt="arrow left"></button>',
    nextArrow:
      '<button type="button" class="slick-next"><img width="48" height="48" style="width: 48px;" src="/wp-content/uploads/images/right-arrow-slick.png" alt="arrow right"></button>',
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1,
          variableWidth: true,
          centerMode: false,
        },
      },
    ],
  });

  $(".posts-list-slide").slick({
    infinite: true,
    autoplay: true,
    arrows: true,
    prevArrow:
      '<button type="button" class="slick-prev"><img width="48" height="48" style="width: 48px;" src="/wp-content/uploads/images/left-arrow-slick.png" alt="arrow left"></button>',
    nextArrow:
      '<button type="button" class="slick-next"><img width="48" height="48" style="width: 48px;" src="/wp-content/uploads/images/right-arrow-slick.png" alt="arrow right"></button>',
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1,
          variableWidth: true,
          centerMode: false,
        },
      },
    ],
  });

  $(".slider-company-gallery").slick({
    infinite: true,
    autoplay: true,
    arrows: true,
    dots: true,
    prevArrow:
      '<button type="button" class="slick-prev"><img width="48" height="48" style="width: 48px;" src="/wp-content/uploads/images/left-arrow-slick.png" alt="arrow left"></button>',
    nextArrow:
      '<button type="button" class="slick-next"><img width="48" height="48" style="width: 48px;" src="/wp-content/uploads/images/right-arrow-slick.png" alt="arrow right"></button>',
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 5000,
  });

  jQuery(".silde-company-reviews").slick({
    infinite: true,
    autoplay: false,
    arrows: true,
    prevArrow:
      '<button type="button" class="slick-prev"><i class="fas fa-angle-left"></i></button>',
    nextArrow:
      '<button type="button" class="slick-next"><i class="fas fa-angle-right"></i></button>',
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 768,

        settings: {
          slidesToShow: 2,
        },
      },

      {
        breakpoint: 550,

        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  jQuery("li[tabs-cat-id]").click(function (e) {
    let $this = jQuery(this);
    let id = $this.attr("tabs-cat-id");

    jQuery("ul.tabs-list li").removeClass("active");
    $this.addClass("active");
    jQuery(".news-all-tab-content").removeClass("active");
    jQuery("#psc-" + id).addClass("active");
  });

  let scrollSpeed = 50;
  let step = 1;

  jQuery(".scroller").each(function () {
    let $scroller = jQuery(this);
    let autoScrollInterval;
    let childrenCount = $scroller.children().length;

    if (childrenCount > 3) {
      function startAutoScroll() {
        autoScrollInterval = setInterval(function () {
          let scrollTop = $scroller.scrollTop();
          let maxScrollTop =
            $scroller[0].scrollHeight - $scroller.innerHeight();

          if (scrollTop >= maxScrollTop) {
            $scroller.scrollTop(0); // Cuộn lại từ đầu nếu đến cuối
          } else {
            $scroller.scrollTop(scrollTop + step); // Cuộn tiếp
          }
        }, scrollSpeed);
      }

      function stopAutoScroll() {
        clearInterval(autoScrollInterval);
      }

      startAutoScroll();
      $scroller.hover(stopAutoScroll, startAutoScroll);
    }
  });

  // 	jQuery('.bus-provider-box__slide').on('init', function () {

  //         jQuery(this).css('opacity', '1');

  //     });

  jQuery(".bus-provider-box__slide").on("init", function () {
    jQuery(".slick-loading-spinner").remove();
    jQuery(this).fadeIn(); // Hiển thị slider
  });

  jQuery(".slider-for-gallery").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    prevArrow:
      '<button type="button" class="slick-prev"><i class="fas fa-angle-left"></i></button>',
    nextArrow:
      '<button type="button" class="slick-next"><i class="fas fa-angle-right"></i></button>',
    asNavFor: ".slider-nav-gallery",
  });

  jQuery(".slider-nav-gallery").slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: ".slider-for-gallery",
    dots: false,
    centerMode: true,
    focusOnSelect: true,
    arrows: false,
  });

  jQuery(document).on("click", ".btn-toggle-see", function () {
    jQuery(this).toggleClass("active");
    let height = jQuery(".collapse-body-content").height() + 16;

    if (jQuery(this).hasClass("active")) {
      jQuery(".collapse-body-wrapper").css("height", height + "px");
      jQuery(this).html('Rút gọn <i class="fas fa-angle-up"></i>');
    } else {
      jQuery(".collapse-body-wrapper").css("height", "182px");
      jQuery(this).html('Xem thêm <i class="fas fa-angle-down"></i>');
    }
  });

  jQuery(document).on("click", ".company-detail-tabs li", function () {
    var dataTab = jQuery(this).attr("data-tab");
    jQuery(".company-detail-tabs li").removeClass("active");
    jQuery(".company-details__tab").removeClass("active");

    jQuery(this).addClass("active");
    jQuery("#" + dataTab)
      .addClass("active")
      .show();
  });

  // jQuery('#toc').toc();

  jQuery(".category__tags-container a .tags-item").click(function (e) {
    // e.preventDefault();
    let idParent = jQuery(this).attr("data-parent");
    jQuery(`#panel-${idParent} a .tags-item`).removeClass("active");
    jQuery(this).addClass("active");
  });

  jQuery(document).on("click", ".cb-value", function () {
    var mainParent = $(this).parent(".toggle-btn");
    if ($(mainParent).find("input.cb-value").is(":checked")) {
      $(mainParent).addClass("active");
      $(".day-lunar").css("opacity", 1);
    } else {
      $(mainParent).removeClass("active");
      $(".day-lunar").css("opacity", 0);
    }
  });

  jQuery(document).on("click", ".booking-dailyve-route", function () {
    let data_datepicker = jQuery(this).attr("data-datepicker");
    selected_link_feature = jQuery(this).attr("data-link");

    jQuery('[name="' + data_datepicker + '"]').datepicker("show");
  });

  jQuery(document).on("click", ".book-dailyve-btn", function () {
    let data_datepicker = jQuery(this).attr("data-datepicker");
    selected_link_feature = jQuery(this).attr("data-link");

    jQuery('[name="' + data_datepicker + '"]').datepicker("show");
  });
});

function initCounter() {
  jQuery(".counter").countUp({
    time: 500,
    // delay: 0,
  });
}

jQuery(document).on("click", ".provider-details__nav li", function () {
  const $li = jQuery(this);
  const data_tab = $li.attr("data-tab");

  const $wrap = $li.closest(".provider-details");
  const $target = $wrap.find("#" + data_tab);

  $li.addClass("active").siblings().removeClass("active");
  $target.siblings().hide();
  $target.show();
});

function renderUtilities(tripId, amenities) {
  var $list1 = jQuery(
    "#convenience-tab-" + tripId + " ul.provider_details_convenience__list",
  );
  var $list2 = jQuery(
    "#convenience-tab-" + tripId + " .provider_details_convenience__list_2",
  );

  if (!amenities || !amenities.length) {
    $list1.html(
      "<li><span>Hiện tại chúng tôi chưa có thông tin tiện ích của xe này.</span></li>",
    );
    $list2.empty();
    return;
  }

  var utilityHtml1 = amenities
    .map(function (item) {
      if (item.description) {
        return (
          '<li class="provider_details_convenience__list-item">' +
          "<div style=\"background-image: url('" +
          item.icon_url +
          '\');" class="provider_details_convenience__list-item__title">' +
          item.name +
          "</div>" +
          '<div class="provider_details_convenience__list-item__content">' +
          item.description +
          "</div>" +
          "</li>"
        );
      }
      return "";
    })
    .join("");

  var utilityHtml2 = amenities
    .map(function (item) {
      if (!item.description) {
        return (
          '<div class="facility">' +
          '<img src="' +
          item.icon_url +
          '" alt="' +
          item.name +
          '">' +
          '<div class="name">' +
          item.name +
          "</div>" +
          "</div>"
        );
      }
      return "";
    })
    .join("");

  $list1.html(utilityHtml1);
  $list2.html(utilityHtml2);
}

function fetchUtilityData(tripId, seatTemplateId, partnerId, companyId) {
  var $list1 = jQuery(
    "#convenience-tab-" + tripId + " ul.provider_details_convenience__list",
  );
  var $list2 = jQuery(
    "#convenience-tab-" + tripId + " .provider_details_convenience__list_2",
  );

  // HIỆU ỨNG LOADING
  $list1.html('<div class="warrap-loader"><span class="loader"></span></div>');
  $list2.empty();

  return jQuery.ajax({
    url: generic_data.ajax_url,
    type: "GET",
    dataType: "json",
    data: {
      action: "get_bus_amenities",
      seat_template_id: seatTemplateId,
      partnerId: partnerId,
      company_id: companyId,
    },
    success: function (res) {
      if (res && res.success && Array.isArray(res.data) && res.data.length) {
        renderUtilities(tripId, res.data);
      } else {
        $list1.html(
          "<li><span>Hiện tại chúng tôi chưa có thông tin tiện ích của xe này.</span></li>",
        );
        $list2.empty();
      }
    },
    error: function () {
      $list1.html(
        "<li><span>Hiện tại chúng tôi chưa có thông tin tiện ích của xe này.</span></li>",
      );
      $list2.empty();
    },
  });
}

//Detail trip init
jQuery(document).on("click", "[data-companyid]", function () {
  const $this = jQuery(this);
  const parent = $this.closest(".online-booking-page__provider-list__item");

  const $detailTab = parent.find('[id^="detail-tab-"]').first();
  const $routeTrip = parent.find('[id^="route-trip-"]').first();
  const $ratingsTab = parent.find('[id^="ratings-tab-"]').first();

  const $commentList = parent.find('[id^="comment-list-"]').first();
  const $commentPagination = parent.find('[id^="comment-pagination-"]').first();

  const $listRatingCats = parent.find('[id^="list-rating-cats-"]').first();

  const $pickupDropoffTab = parent
    .find('[id^="pickup-dropoff-points-tab-"]')
    .first();
  const $pickupList = $pickupDropoffTab.find(".pickup-point-list").first();
  const $dropoffList = $pickupDropoffTab.find(".dropoff-point-list").first();

  const $policyTab = parent.find('[id^="policy-tab-"]').first();
  const $policyContainer = $policyTab.find(".content-policy-container").first();

  let companyId = $this.attr("data-companyid");
  let tripId = $this.attr("data-tripid");
  let seatTemplateId = $this.attr("data-seat-template-id");
  let partnerId = $this.attr("data-partner-id");
  let partnerName = $this.attr("data-partner-name")?.toLowerCase();
  let departureDate = $this.attr("data-departure-date");
  let departureTime = $this.attr("data-departure-time");
  let pickupDate = $this.data("pickup-date");
  let wayId = $this.data("way-id");
  let bookingId = $this.data("booking-id");
  let fare = $this.data("fare");
  let to = $this.data("to");
  let from = $this.data("from");

  let searchParams = new URLSearchParams(window.location.search);
  let date =
    searchParams.get("date") ??
    new Date()
      .toLocaleDateString("vi-VN")
      .split("/")
      .map((part) => part.padStart(2, "0"))
      .join("-");

  // jQuery("#detail-tab-" + tripId).show();
  // jQuery(this).addClass('active');
  // jQuery(this).parents('.online-booking-page__provider-list__item').find('.online-booking-page__provider-list__details-tab').siblings();
  // jQuery(this).siblings().removeClass('active');

  $this.toggleClass("active");
  // jQuery('.online-booking-page__provider-list__details-tab').hide();

  if ($detailTab.hasClass("active")) {
    $detailTab.removeClass("active").css("display", "none");
  } else {
    $detailTab.addClass("active");
    $detailTab.addClass("active").css("display", "block");
  }

  if ($this.attr("data-load") == 1) {
    closeDeltailTrip();
    return;
  } else {
    initGallerySlider2(tripId);
  }

  if ($this.hasClass("active")) {
    closeDeltailTrip();

    if ($routeTrip.length) {
      $routeTrip[0].scrollIntoView({ behavior: "smooth" });
    } else {
      parent[0].scrollIntoView({ behavior: "smooth" });
    }

    $ratingsTab.append(
      '<div class="warrap-loader"><span class="loader"></span></div>',
    );

    fetchUtilityData(tripId, seatTemplateId, partnerId, companyId);

    jQuery
      .when(
        jQuery.ajax({
          type: "get",
          url: generic_data.ajax_url,
          data: {
            action: "get_review_ajax_company",
            companyId: companyId,
            partnerName: partnerName,
          },
        }),

        jQuery.ajax({
          type: "post",
          url: generic_data.ajax_url,
          data: {
            action: "get_info_ajax_company",
            companyId: companyId,
            tripCode: tripId,
            partnerId: partnerId,
            pickupDate: pickupDate,
            partnerName: partnerName,
            departureTime: departureTime,
            wayId: wayId,
            bookingId: bookingId,
            fare: fare,
            to: to,
            from: from,
          },
        }),

        // jQuery.ajax({
        //     type: "get",
        //     url: generic_data.ajax_url,
        //     data: {
        //         action: "get_images_ajax_company",
        //         companyId: companyId,
        //     }
        // }),
        jQuery.ajax({
          type: "get",
          url: generic_data.ajax_url,
          data: {
            action: "get_cancellation_policy",
            tripCode: tripId,
            partnerId: partnerId,
            departureDate: departureDate,
          },
        }),
        jQuery.ajax({
          type: "get",
          url: generic_data.ajax_url,
          data: {
            action: "get_policy_mapping",
            tripCode: tripId,
            seat_template_id: seatTemplateId,
            partnerId: partnerId,
            company_id: companyId,
          },
        }),
      )
      .then(
        function (
          reviewResponse,
          catsResponse,
          cancellationPolicyResponse,
          //imagesResponse,
          policyResponse,
        ) {
          $this.attr("data-load", "1");
          const reviewData = JSON.parse(reviewResponse[0]);

          $commentList.html(reviewData.html);
          const catsData = JSON.parse(catsResponse[0]);
          $listRatingCats.html(catsData.listCats);
          $pickupList.html(catsData.pickUpHtml);
          $dropoffList.html(catsData.dropOffHtml);

          $policyContainer.html(cancellationPolicyResponse[0]);
          $policyContainer.append(policyResponse[0]);

          // const imagesData = JSON.parse(imagesResponse[0]);
          // if (imagesData.data?.length > 0) {
          //     const imageMainHTML = imagesData.data.map(path => {
          //         const cleanPath = path.replace(/^\/+/g, '');
          //         return `<div class="provider-details__gallery-main__item">
          //                     <img data-lazyloaded="1" src="https://${cleanPath}" width="1000" height="600" class="attachment-large size-large">
          //                 </div>`;
          //     }).join('');
          //     const imageThumbHTML = imagesData.data.map(path => {
          //         const cleanPath = path.replace(/^\/+/g, '');
          //         return `<div class="provider-details__gallery-thumbnails__item">
          //                     <img data-lazyloaded="1" src="https://${cleanPath}" width="1000" height="600">
          //                 </div>`;
          //     }).join('');
          //     jQuery('#images-tab-' + tripId + ' .provider-details__gallery-main').html(imageMainHTML);
          //     jQuery('#images-tab-' + tripId + ' .provider-details__gallery-thumbnails').html(imageThumbHTML);
          //     initGallerySlider2(tripId);
          // }

          parent.find(".warrap-loader").remove();

          $commentPagination.twbsPagination({
            totalPages: reviewData.total,
            visiblePages: 8,
            prev: false,
            next: false,
            startPage: 1,
            onPageClick: function (event, page) {
              jQuery.ajax({
                url: generic_data.ajax_url,
                type: "GET",
                data: {
                  action: "get_review_ajax_company",
                  companyId: companyId,
                  partnerName: partnerName,
                  page: page,
                },
                beforeSend: function () {
                  if ($ratingsTab.length) {
                    $ratingsTab[0].scrollIntoView({ behavior: "smooth" });
                  }
                  $commentList.html(
                    '<div class="warrap-loader"><span class="loader"></span></div>',
                  );
                },

                success: function (response) {
                  const dataJson = JSON.parse(response);
                  if (dataJson.html) $commentList.html(dataJson.html);
                  parent.find(".warrap-loader").remove();
                },
                error: function (xhr, status, error) {
                  console.error("Error loading comments:", error);
                  parent.find(".warrap-loader").remove();
                },
              });
            },
          });
        },
      )
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Error occurred: " + textStatus, errorThrown);
        parent.find(".warrap-loader").remove();
      });
  } else {
    closeDeltailTrip();
  }
});

function closeDeltailTrip() {
  jQuery(".online-booking-page__provider-list__seats-info").empty();
  jQuery(".online-booking-page__provider-list__item__price-btn").removeClass(
    "btn-close",
  );
  jQuery(".online-booking-page__provider-list__item__price-btn").text(
    "Chọn tuyến",
  );
}

function initGallerySlider2(selector) {
  jQuery("#images-tab-" + selector + " .provider-details__gallery-main").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    prevArrow: '<button type="button" class="slick-prev"></button>',
    nextArrow: '<button type="button" class="slick-next"></button>',
    asNavFor:
      "#images-tab-" + selector + " .provider-details__gallery-thumbnails",
  });

  jQuery(
    "#images-tab-" + selector + " .provider-details__gallery-thumbnails",
  ).slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: "#images-tab-" + selector + " .provider-details__gallery-main",
    dots: false,
    arrows: false,
    centerMode: true,
    centerPadding: "0px",
    prevArrow: '<button type="button" class="slick-prev"></button>',
    nextArrow: '<button type="button" class="slick-next"></button>',
    focusOnSelect: true,
  });
}

if (jQuery(".blog-wrapper").hasClass("single-post")) {
  initGallerySlider();
}

function initGallerySlider() {
  jQuery(".provider-details__gallery-main").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    prevArrow: '<button type="button" class="slick-prev"></button>',
    nextArrow: '<button type="button" class="slick-next"></button>',
    asNavFor: ".provider-details__gallery-thumbnails",
  });

  jQuery(".provider-details__gallery-thumbnails").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: ".provider-details__gallery-main",
    dots: false,
    arrows: false,
    centerMode: true,
    centerPadding: "0px",
    prevArrow: '<button type="button" class="slick-prev"></button>',
    nextArrow: '<button type="button" class="slick-next"></button>',
    focusOnSelect: true,
  });
}

jQuery(".vivu-loadmore-btn").click(function () {
  let paged = Number(jQuery(this).attr("data-current-page")) + 1;
  let max_pages = Number(jQuery(this).attr("data-max-pages"));
  let from = Number(jQuery(this).attr("data-from"));
  let to = Number(jQuery(this).attr("data-to"));
  let bus_type = jQuery(this).attr("data-bus-type");

  jQuery.ajax({
    type: "get",
    dataType: "json",
    url: generic_data.ajax_url,
    data: {
      action: "providers_list_pagination",
      paged: paged,
      from: from,
      to: to,
      bus_type: bus_type,
    },
    beforeSend: function () {
      jQuery(".vivu-loadmore-btn__wrap").before(
        '<div class="vivu-loading-txt">Đang tải dữ liệu</div>',
      );
    },
    success: function (response) {
      if (response.success) {
        jQuery(".online-booking-page__provider-list").append(
          response.data.content,
        );
      } else {
        alert("Đã có lỗi xảy ra");
      }
      jQuery(".vivu-loading-txt").remove();
      paged = response.data.paged;
      jQuery(".vivu-loadmore-btn").attr("data-current-page", paged);
      if (paged == max_pages) {
        jQuery(".vivu-loadmore-btn").remove();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("The following error occured: " + textStatus, errorThrown);
    },
  });

  return false;
});

jQuery("body").on(
  "submit",
  ".provider-details__comment-form form",
  function () {
    jQuery(this).submit(function () {
      return false;
    });

    return true;
  },
);

function initializeDatePicker() {
  if (jQuery(".dailyve_calendar").length == 0) {
    return;
  }

  jQuery(".dailyve_calendar").datepicker({
    closeText: "Đóng",
    prevText: "Trước",
    nextText: "Sau",
    currentText: "Hôm nay",
    monthNames: [
      "Tháng một",
      "Tháng hai",
      "Tháng ba",
      "Tháng tư",
      "Tháng năm",
      "Tháng sáu",
      "Tháng bảy",
      "Tháng tám",
      "Tháng chín",
      "Tháng mười",
      "Tháng mười một",
      "Tháng mười hai",
    ],
    monthNamesShort: [
      "Một",
      "Hai",
      "Ba",
      "Bốn",
      "Năm",
      "Sáu",
      "Bảy",
      "Tám",
      "Chín",
      "Mười",
      "Mười một",
      "Mười hai",
    ],
    dayNames: [
      "Chủ nhật",
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
    ],
    dayNamesShort: ["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"],
    dayNamesMin: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    weekHeader: "Tuần",
    dateFormat: "dd-mm-yy",
    minDate: new Date(),
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: "",
    onSelect: function (dateText, inst) {
      // window.open(selected_link_feature + dateText);
      window.location.href = selected_link_feature + dateText;
    },
  });
}

initializeDatePicker();

//DATA OFFLINE

var utilityData = [
  {
    icon_url: "/wp-content/uploads/assets/images/u-massage.png",
    is_company: false,
    is_vehicle_type: true,
    is_office: false,
    created_date: "2020-03-20T12:26:42.660Z",
    created_user: "77849",
    updated_date: null,
    name: "Ghế massage",
    id: "15",
    icon_name: "Ghế Massage",
    english_name: "Massage features on chairs",
    description:
      "Ghế massage giúp cho hành khách ngồi trên xe thoải mái trong thời gian dài ",
    english_description:
      "Massage features on chairs make a journey as comfortable, relaxing and stress-relieving as possible for customers.",
    is_main: null,
    index: 5,
    resource_ids: [7815, 9465],

    branch_ids: [],
  },

  {
    icon_url: "/wp-content/uploads/assets/images/u-tivi.png",

    is_company: true,

    is_vehicle_type: true,

    is_office: true,

    created_date: "2020-03-20T12:29:13.903Z",

    created_user: "29703",

    updated_date: null,

    name: "Tivi LED",

    id: "27",

    icon_name: "Tivi",

    english_name: "Televison",

    description: null,

    english_description: "Bus Company have equipted TV on bus",

    is_main: null,

    index: 7,

    resource_ids: [
      6296,

      7815,

      9465,
    ],

    branch_ids: [],
  },

  {
    icon_url: "/wp-content/uploads/assets/images/u-wc.png",

    is_company: true,

    is_vehicle_type: true,

    is_office: true,

    created_date: "2020-03-20T12:29:31.200Z",

    created_user: "77849",

    updated_date: null,

    name: "Toilet",

    id: "29",

    icon_name: "Nhà vệ sinh",

    english_name: "Toilets",

    description: "Nhà vệ sinh trên xe",

    english_description: "Bus Company have equipted toilet on bus",

    is_main: null,

    index: 9,

    resource_ids: [
      7815,

      6296,

      9465,
    ],

    branch_ids: [],
  },

  {
    icon_url: "/wp-content/uploads/assets/images/u-sacdienthoai.png",

    is_company: true,

    is_vehicle_type: true,

    is_office: true,

    created_date: "2020-03-20T12:28:55.333Z",

    created_user: "29703",

    updated_date: null,

    name: "Sạc điện thoại",

    id: "25",

    icon_name: "Sạc điện thoại",

    english_name: "Charging Point",

    description: null,

    english_description: "Bus Company have equipted charging point on bus",

    is_main: null,

    index: 13,

    resource_ids: [
      5850,

      6296,

      6992,

      7815,

      9465,

      9816,
    ],

    branch_ids: [],
  },

  {
    icon_url: "/wp-content/uploads/assets/images/u-dendocsach.png",

    is_company: false,

    is_vehicle_type: true,

    is_office: false,

    created_date: "2020-03-20T12:26:29.143Z",

    created_user: "77849",

    updated_date: null,

    name: "Đèn đọc sách",

    id: "14",

    icon_name: "1724744594196.",

    english_name: "Reading Light ",

    description:
      "Hỗ trợ hành khách đọc sách dễ dàng và an toàn khi ngồi trên xe",

    english_description: "Bus Company have equipted reading light on bus",

    is_main: null,

    index: 14,

    resource_ids: [
      7815,

      9465,
    ],

    branch_ids: [],
  },

  {
    icon_url: "/wp-content/uploads/assets/images/u-the.png",

    is_company: true,

    is_vehicle_type: true,

    is_office: false,

    created_date: "2021-11-09T10:52:38.207Z",

    created_user: "87770",

    updated_date: null,

    name: "Siêu deal 12.12",

    id: "65",

    icon_name: "1691571588700.",

    english_name: "12.12 super sale",

    description:
      "Duy nhất trong ngày 12.12, đặt vé để tận hưởng hàng nghìn voucher 20k - 50k - 100k - 300k. ",

    english_description:
      "Only on 12th December , book bus tickets on VeXeRe with thousands of vouchers 20k - 50k - 100k - 300k.",

    is_main: 0,

    index: null,

    resource_ids: [],

    branch_ids: [],
  },

  {
    icon_url: "/wp-content/uploads/assets/images/u-sinhnhat.png",

    is_company: true,

    is_vehicle_type: true,

    is_office: false,

    created_date: "2020-07-02T14:11:41.900Z",

    created_user: "87770",

    updated_date: null,

    name: "Sinh nhật Dailyve",

    id: "62",

    icon_name: "1691571587731.",

    english_name: "Dailyve birthday",

    description: "Ưu đãi mừng sinh nhật Dailyve",

    english_description: "Hot deals on Dailyve Birthday",

    is_main: 0,

    index: null,

    resource_ids: [],

    branch_ids: [],
  },

  {
    icon_url: "/wp-content/uploads/assets/images/u-dep.png",

    is_company: false,

    is_vehicle_type: true,

    is_office: false,

    created_date: "2020-04-14T15:29:43.700Z",

    created_user: "29703",

    updated_date: null,

    name: "Dép",

    id: "60",

    icon_name: "1724838415764.",

    english_name: "Sandal",

    description:
      "Khi dừng ở trạm dừng chân sẽ có dép của nhà xe cho hành khách xuống xe ",

    english_description: "Bus Company have equipted sandals on bus",

    is_main: 0,

    index: null,

    resource_ids: [
      58,

      3569,

      5850,

      6296,

      6992,

      7815,

      7855,

      9465,

      9816,
    ],

    branch_ids: [],
  },

  {
    icon_url: "/wp-content/uploads/assets/images/i-remcua.png",

    is_company: false,

    is_vehicle_type: true,

    is_office: false,

    created_date: "2020-04-14T15:26:40.070Z",

    created_user: "29703",

    updated_date: null,

    name: "Rèm cửa",

    id: "57",

    icon_name: "1724838412282.",

    english_name: "Bus Curtains",

    description: "",

    english_description: "Bus Company have equipted curtains on bus",

    is_main: 0,

    index: null,

    resource_ids: [
      58,

      3569,

      5850,

      6296,

      6992,

      7815,

      7855,

      9465,

      9816,
    ],

    branch_ids: [],
  },

  {
    icon_url: "/wp-content/uploads/assets/images/u-loa.png",

    is_company: true,

    is_vehicle_type: true,

    is_office: true,

    created_date: "2020-04-14T15:23:39.387Z",

    created_user: "29703",

    updated_date: null,

    name: "Dàn âm thanh (Loa)",

    id: "55",

    icon_name: "1724838409261.",

    english_name: "Sound System ",

    description: "",

    english_description: "Bus Company have equipted sound system on bus",

    is_main: 0,

    index: null,

    resource_ids: [
      58,

      3569,

      5850,

      6296,

      6992,

      7815,

      7855,

      9465,

      9816,
    ],

    branch_ids: [],
  },

  {
    icon_url: "/wp-content/uploads/assets/images/u-dayantoan.png",

    is_company: false,

    is_vehicle_type: true,

    is_office: false,

    created_date: "2020-04-14T15:22:48.010Z",

    created_user: "29703",

    updated_date: null,

    name: "Dây đai an toàn",

    id: "54",

    icon_name: "1724838406249.",

    english_name: "Seatbelt",

    description:
      "Trên xe có trang bị dây đai an toàn cho hành khách khi ngồi trên xe",

    english_description:
      "Bus Company have equipted seatbelt for each seats on bus",

    is_main: 0,

    index: null,

    resource_ids: [
      58,

      3569,

      5850,

      6296,

      6992,

      7815,

      7855,

      9465,

      9816,
    ],

    branch_ids: [],
  },

  {
    icon_url: "/wp-content/uploads/assets/images/u-guikemxemay.png",

    is_company: true,

    is_vehicle_type: true,

    is_office: false,

    created_date: "2020-04-14T15:20:43.957Z",

    created_user: "29703",

    updated_date: null,

    name: "Gửi kèm xe máy",

    id: "53",

    icon_name: "1724838402487.",

    english_name: "Motorcycle/Bike Shipping ",

    description: "Nhà xe cho khách gửi kèm theo xe máy",

    english_description: "Baggage can included motorbike / bike ",

    is_main: 0,

    index: null,

    resource_ids: [
      58,

      3569,

      7855,
    ],

    branch_ids: [],
  },

  {
    icon_url: "/wp-content/uploads/assets/images/u-chandap.png",

    is_company: false,

    is_vehicle_type: true,

    is_office: false,

    created_date: "2020-03-23T15:15:04.193Z",

    created_user: "29703",

    updated_date: null,

    name: "Chăn đắp",

    id: "36",

    icon_name: "1724838398605.",

    english_name: "Blankets",

    description: null,

    english_description: "Bus Company have equipted blankets on bus",

    is_main: null,

    index: null,

    resource_ids: [
      58,

      3569,

      5850,

      6296,

      6992,

      7815,

      7855,

      9465,

      9816,
    ],

    branch_ids: [],
  },

  {
    icon_url: "/wp-content/uploads/assets/images/u-wifi.png",

    is_company: true,

    is_vehicle_type: true,

    is_office: true,

    created_date: "2020-03-20T12:29:49.287Z",

    created_user: "29703",

    updated_date: null,

    name: "Wifi",

    id: "31",

    icon_name: "1724838393950.",

    english_name: "Wifi",

    description: null,

    english_description: "Bus Company have equipted Wifi on bus",

    is_main: null,

    index: null,

    resource_ids: [
      6296,

      5850,

      3569,

      58,

      6992,

      7815,

      7855,

      9465,

      9816,
    ],

    branch_ids: [],
  },

  {
    icon_url: "/wp-content/uploads/assets/images/u-tainghe.png",

    is_company: false,

    is_vehicle_type: true,

    is_office: false,

    created_date: "2020-03-20T12:29:04.767Z",

    created_user: "108169",

    updated_date: null,

    name: "Tai nghe",

    id: "26",

    icon_name: "1723603503823.",

    english_name: "Headphone ",

    description: null,

    english_description: null,

    is_main: null,

    index: null,

    resource_ids: [],

    branch_ids: [],
  },

  {
    icon_url: "/wp-content/uploads/assets/images/u-nuocuong.png",

    is_company: true,

    is_vehicle_type: true,

    is_office: true,

    created_date: "2020-03-20T12:28:44.240Z",

    created_user: "29703",

    updated_date: null,

    name: "Nước uống",

    id: "24",

    icon_name: "1724838381016.",

    english_name: "Water ",

    description: "Nhà xe có phục vụ nước cho hành khách ",

    english_description: "Customers will served water on bus. ",

    is_main: null,

    index: null,

    resource_ids: [
      6296,

      5850,

      3569,

      58,

      6992,

      7815,

      7855,

      9465,

      9816,
    ],

    branch_ids: [],
  },

  {
    icon_url: "/wp-content/uploads/assets/images/u-dieuhoa.png",

    is_company: true,

    is_vehicle_type: true,

    is_office: true,

    created_date: "2020-03-20T12:28:34.013Z",

    created_user: "29703",

    updated_date: null,

    name: "Điều hòa",

    id: "23",

    icon_name: "1724838377580.",

    english_name: "AirCondition",

    description: null,

    english_description: "Bus Company have equipted air condition on bus",

    is_main: null,

    index: null,

    resource_ids: [
      6296,

      5850,

      3569,

      58,

      6992,

      7815,

      7855,

      9465,

      9816,
    ],

    branch_ids: [],
  },

  {
    icon_url: "/wp-content/uploads/assets/images/u-khanlanh.png",

    is_company: false,

    is_vehicle_type: true,

    is_office: false,

    created_date: "2020-03-20T12:28:04.790Z",

    created_user: "29703",

    updated_date: null,

    name: "Khăn lạnh",

    id: "21",

    icon_name: "1724838374081.",

    english_name: "Wet Napkin",

    description: null,

    english_description: "Bus Company have equipted wet napkin on bus",

    is_main: null,

    index: null,

    resource_ids: [
      6296,

      5850,

      3569,

      58,

      6992,

      7815,

      7855,

      9465,

      9816,
    ],

    branch_ids: [],
  },

  {
    icon_url: "/wp-content/uploads/assets/images/u-goinam.png",

    is_company: false,

    is_vehicle_type: true,

    is_office: false,

    created_date: "2020-03-20T12:27:04.293Z",

    created_user: "29703",

    updated_date: null,

    name: "Gối nằm",

    id: "17",

    icon_name: "1724838370242.",

    english_name: "Pillow",

    description: "Trên xe có trang bị gối nằm",

    english_description: "Bus Company have equipted pillow on bus",

    is_main: null,

    index: null,

    resource_ids: [
      58,

      3569,

      5850,

      6296,

      6992,

      7815,

      7855,

      9465,

      9816,
    ],

    branch_ids: [],
  },
  {
    icon_url: "/wp-content/uploads/assets/images/u-buaphakinh.png",
    is_company: false,
    is_vehicle_type: true,
    is_office: false,
    created_date: "2020-03-20T11:52:51.837Z",
    created_user: "29703",
    updated_date: null,
    name: "Búa phá kính",
    id: "11",
    icon_name: "1724838366431.",
    english_name: "Emergency Hammer",
    description: "Dùng để phá kính ô tô thoát hiểm trong trường hợp khẩn cấp.",
    english_description:
      "Bus Company have equipted emergency hammer on bus to escape when needed.",
    is_main: null,
    index: null,
    resource_ids: [58, 3569, 5850, 6296, 6992, 7815, 7855, 9465, 9816],
    branch_ids: [],
  },
];

function openTabs(event, tabName) {
  const parentSection = event.currentTarget.closest("section");

  parentSection.querySelectorAll(".lvn-tab-item").forEach((tab) => {
    tab.classList.remove("active");
  });

  event.currentTarget.classList.add("active");

  // Hide tab content only within the same section
  parentSection.querySelectorAll(".lvn_tab_custom").forEach((content) => {
    content.style.display = "none";
  });

  // Show selected tab content
  const selectedTab = parentSection.querySelector(`#${tabName}`);
  if (selectedTab) {
    selectedTab.style.display = "block";
    jQuery(selectedTab).find(".posts-list-slide").slick("setPosition");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const contents = document.querySelectorAll(".seemore_content");
  const toggleBtns = document.querySelectorAll(".seemore_toggle");

  contents.forEach((content, index) => {
    const toggleBtn = toggleBtns[index];

    if (content && toggleBtn) {
      const collapsedHeight = 1060;
      let expanded = false;

      const originalHeight = content.scrollHeight + 25;
      if (originalHeight < collapsedHeight) {
        toggleBtn.style.display = "none";
      }

      toggleBtn.addEventListener("click", function () {
        if (expanded) {
          content.style.maxHeight = collapsedHeight + "px";
          toggleBtn.innerHTML = 'Xem thêm <i class="fas fa-chevron-down"></i>';
        } else {
          content.style.maxHeight = originalHeight + "px";
          toggleBtn.innerHTML = 'Thu gọn <i class="fas fa-chevron-up"></i>';
        }
        expanded = !expanded;
      });
    }
  });
});

(function () {
  const container = document.querySelector(".content-table");
  if (!container) return;

  const headings = container.querySelectorAll("h2");
  if (!headings.length) return;

  const firstH2 = container.querySelector("h2");
  if (!firstH2) return;

  // --- Tạo khung mục lục
  const tocBox = document.createElement("nav");
  tocBox.className = "toc-box";
  const header = document.createElement("div");
  header.className = "toc-header";

  const title = document.createElement("div");
  title.className = "toc-title";
  title.textContent = "Mục lục";

  // Nút toggle
  const toggleBtn = document.createElement("button");
  toggleBtn.className = "toc-toggle";
  toggleBtn.type = "button";

  // Danh sách
  const list = document.createElement("ol");
  list.className = "toc-list";
  list.id = "toc-list";

  toggleBtn.setAttribute("aria-controls", list.id);

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

  // Tạo item
  let h2Counter = 0;
  headings.forEach((h) => {
    if (!h.id) h.id = slugify(h.textContent);

    const level = parseInt(h.tagName.substring(1), 10); // 2
    const li = document.createElement("li");
    li.className = `toc-level-${level}`;

    const a = document.createElement("a");
    a.href = `#${h.id}`;

    if (level === 2) {
      h2Counter++;
      a.textContent = `${h2Counter}. ${h.textContent}`;
    } else {
      a.textContent = h.textContent;
    }

    li.appendChild(a);
    list.appendChild(li);
  });

  const LS_KEY = "toc-collapsed";
  const collapsed = localStorage.getItem(LS_KEY) === "1";
  if (collapsed) tocBox.classList.add("is-collapsed");

  const syncBtn = () => {
    const isCollapsed = tocBox.classList.contains("is-collapsed");
    toggleBtn.setAttribute("aria-expanded", String(!isCollapsed));
    toggleBtn.textContent = isCollapsed ? "▶" : "▼";
    // (tuỳ thích) thêm biểu tượng:
    // toggleBtn.textContent = (isCollapsed ? "▶ " : "▼ ") + (isCollapsed ? "Mở rộng" : "Thu gọn");
  };
  syncBtn();

  // Hành vi click
  toggleBtn.addEventListener("click", () => {
    const isCollapsed = tocBox.classList.toggle("is-collapsed");
    localStorage.setItem(LS_KEY, isCollapsed ? "1" : "0");
    syncBtn();
  });

  header.appendChild(title);
  header.appendChild(toggleBtn);
  tocBox.appendChild(header);
  tocBox.appendChild(list);

  firstH2.parentNode.insertBefore(tocBox, firstH2);
})();
