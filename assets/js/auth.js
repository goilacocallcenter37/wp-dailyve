jQuery(document).ready(function ($) {
  window.dataLayer = window.dataLayer || [];

  const modal = document.querySelector(".modal");
  const backButton = document.querySelector(".back-button");
  const phoneInput = jQuery('input[name="customer-phone"]');
  const errorMsg = jQuery("#msg-phone-error");
  const nextButton = jQuery("#btn-sms-verify");
  const inputs = document.querySelectorAll(".input-field input");
  const buttonVerify = jQuery("#btn-verify-otp");
  const resendButton = jQuery("#btn-resend-otp");
  var countdownVerify = localStorage.getItem("cd-Verify")
    ? parseInt(localStorage.getItem("cd-Verify"))
    : 300;
  let timer;

  jQuery.ajax({
    url: auth_data.ajax_url,
    type: "GET",
    data: {
      action: "get_auth_menu",
    },
    beforeSend: function () {
      jQuery(".auth-menu-container").html(`<div class="skeleton-loading">
        <div class="skeleton-user-drp">
            <div class="skeleton-avatar"></div>
            <div class="skeleton-text"></div>
        </div>
    </div>`);
    },
    success: function (response) {
      jQuery(".auth-menu-container").html(response);
    },
    error: function () {
      console.log("Error loading auth menu");
    },
  });

  function startCountdown() {
    // Reset countdown
    countdownVerify = 300;
    jQuery(".resend-otp").hide();

    // Clear existing timer if any
    if (timer) clearInterval(timer);

    timer = setInterval(function () {
      var minutes = Math.floor(countdownVerify / 60);
      var seconds = countdownVerify % 60;
      if (minutes < 10) minutes = "0" + minutes;
      if (seconds < 10) seconds = "0" + seconds;
      jQuery("#time-expired").text(minutes + ":" + seconds);
      // jQuery('#time-expired').text(countdownVerify);
      localStorage.setItem("cd-Verify", countdownVerify);
      countdownVerify--;

      if (countdownVerify < 0) {
        localStorage.removeItem("cd-Verify");
        clearInterval(timer);
        jQuery("#time-expired").text("00:00");
        jQuery(".resend-otp").show();
      }
    }, 1000);
  }

  jQuery("#btn-sms-login").click(function () {
    jQuery(".content-sms-login").show();
    jQuery(".content-method-login").hide();
    jQuery(".content-sms-verify").hide();
    jQuery(errorMsg).hide();
    jQuery(backButton).css("display", "flex");
  });

  jQuery(backButton).click(function () {
    jQuery(".content-sms-login").hide();
    jQuery(".content-sms-verify").hide();
    jQuery(".content-method-login").show();
    jQuery(backButton).hide();
    // Clear timer when going back
    if (timer) clearInterval(timer);
    localStorage.removeItem("cd-Verify");
  });

  function validateVietnamesePhone(phone) {
    const pattern = /^(0|\+84)([3|5|7|8|9])([0-9]{8})$/;
    return pattern.test(phone.replace(/[. ]/g, "")); // Remove dots and spaces before testing
  }

  phoneInput.on("input", function () {
    const phone = jQuery(this).val();
    if (validateVietnamesePhone(phone)) {
      errorMsg.hide();
      nextButton.prop("disabled", false);
    } else {
      if (phone.length >= 10) {
        errorMsg.text("Số điện thoại không chính xác. Vui lòng nhập lại.");
        errorMsg.show();
      }
      nextButton.prop("disabled", true);
    }
  });

  resendButton.click(function () {
    // Reset OTP input fields
    inputs.forEach((input, index) => {
      if (index === 0) {
        input.removeAttribute("disabled");
      } else {
        input.setAttribute("disabled", true);
      }
      input.value = "";
    });
    inputs[0].focus();

    // Restart countdown
    startCountdown();
    buttonVerify.prop("disabled", true);
  });

  function toggleModal() {
    modal.classList.toggle("show-modal");
    document.documentElement.style.overflowY = modal.classList.contains(
      "show-modal"
    )
      ? "hidden"
      : "auto";
  }

  function windowOnClick(event) {
    if (event.target === modal) {
      toggleModal();
    }
  }

  inputs.forEach((input, index1) => {
    input.addEventListener("keyup", (e) => {
      const currentInput = input,
        nextInput = input.nextElementSibling,
        prevInput = input.previousElementSibling;

      if (currentInput.value.length > 1) {
        currentInput.value = "";
        return;
      }

      if (
        nextInput &&
        nextInput.hasAttribute("disabled") &&
        currentInput.value !== ""
      ) {
        nextInput.removeAttribute("disabled");
        nextInput.focus();
      }

      if (e.key === "Backspace" || e.key === "Delete") {
        inputs.forEach((input, index2) => {
          if (index1 <= index2 && prevInput) {
            input.setAttribute("disabled", true);
            input.value = "";
            prevInput.focus();
          }
        });
      }

      if (!inputs[5].disabled && inputs[5].value !== "") {
        buttonVerify.prop("disabled", false);
        return;
      }
      buttonVerify.prop("disabled", true);
    });
  });

  function sendOTP(button) {
    const phone = jQuery("#customer-phone").val();
    if (validateVietnamesePhone(phone)) {
      button.prop("disabled", true);
      jQuery.ajax({
        url: auth_data.ajax_url,
        method: "POST",
        data: {
          action: "customer_send_otp",
          nonce: auth_data.send_otp_nonce,
          phone: phone,
        },
        beforeSend: function () {
          errorMsg.hide();
        },
        success: function (response) {
          button.prop("disabled", false);
          if (response.success) {
            window.dataLayer.push({
              event: "send_otp",
              method: "otp",
            });
            toastr.success("Gửi OTP thành công", "Success");
            jQuery(".content-sms-verify").show();
            jQuery(".content-sms-login").hide();
            jQuery(backButton).hide();
            inputs[0].focus();
            startCountdown();
          } else {
            button.prop("disabled", false);
            errorMsg.text(response.data.message);
            errorMsg.show();
          }
        },

        error: function () {
          button.prop("disabled", false);
          toastr.error("Lỗi hệ thống", "Error");
        },
      });
    } else {
      return false;
    }
  }

  jQuery(nextButton).on("click", function (e) {
    e.preventDefault();
    sendOTP(nextButton);
  });

  jQuery(resendButton).on("click", function (e) {
    e.preventDefault();
    sendOTP(resendButton);
  });

  buttonVerify.on("click", function (e) {
    e.preventDefault();
    const phone = jQuery("#customer-phone").val();
    let otp = "";

    inputs.forEach((input) => {
      otp += input.value;
    });

    if (otp.length === 6) {
      buttonVerify.prop("disabled", true);
      jQuery.ajax({
        url: auth_data.ajax_url,
        method: "POST",
        data: {
          action: "customer_verify_otp",
          nonce: auth_data.verify_otp_nonce,
          phone: phone,
          otp: otp,
        },
        beforeSend: function () {
          jQuery("#msg-verify").hide();
        },
        success: function (response) {
          buttonVerify.prop("disabled", false);
          if (response.success) {
            window.dataLayer.push({
              event: "verify_otp",
              method: "otp",
            });
            toastr.success("Xác thực OTP thành công", "Success");
            if (timer) clearInterval(timer);
            localStorage.removeItem("cd-Verify");
            modal.classList.remove("show-modal");
            window.location.reload();
          } else {
            jQuery("#msg-verify").text(response.data.message);
            jQuery("#msg-verify").show();

            inputs.forEach((input, index) => {
              if (index === 0) {
                input.removeAttribute("disabled");
              } else {
                input.setAttribute("disabled", true);
              }
              input.value = "";
            });
            inputs[0].focus();
          }
        },

        error: function () {
          buttonVerify.prop("disabled", false);
          toastr.error("Lỗi hệ thống", "Error");
        },
      });
    } else {
      toastr.error("Vui lòng nhập đủ 6 số OTP", "Error");
    }
  });

  $("#profile-form").on("submit", function (e) {
    e.preventDefault();

    var $form = $(this);
    var $submitBtn = $(".save-profile-btn");
    var $logoutBtn = $(".logout-btn");
    var $btnText = $(".btn-text");
    var $btnLoading = $(".btn-loading");

    var formData = {
      action: "update_customer_profile",
      name: $("#name").val(),
      email: $("#email").val(),
      birth_date: new Date($("#birth_date").val())?.toISOString(),
      gender: $('input[name="gender"]:checked').val(),
      // profile_nonce: $('input[name="profile_nonce"]').val()
    };

    $.ajax({
      url: auth_data.ajax_url,
      type: "POST",
      data: formData,
      beforeSend: function () {
        $submitBtn.prop("disabled", true);
        $logoutBtn.prop("disabled", true);
        $btnText.hide();
        $btnLoading.show();
      },
      success: function (response) {
        $btnLoading.hide();
        $btnText.show();
        $submitBtn.prop("disabled", false);
        $logoutBtn.prop("disabled", false);

        if (response?.success) {
          toastr.success(
            response.data.message || "Cập nhật thành công",
            "Success"
          );
          // if (response.data.updated_data) {}
        } else {
          toastr.error("Có lỗi xảy ra", "Error");
        }
      },
      error: function (xhr, status, error) {
        toastr.error("Lỗi kết nối. Vui lòng thử lại", "Error");
        $btnLoading.hide();
        $btnText.show();
        $submitBtn.prop("disabled", false);
        $logoutBtn.prop("disabled", false);
      },
    });
  });

  $(document).on("click", ".pagination-link", function (e) {
    e.preventDefault();

    var page = $(this).data("page");
    var container = $(this).closest(".ticket-lookup-container");
    var per_page = container.data("per-page");
    var status = container.data("status");
    var phone = container.data("phone");

    loadTickets(page, per_page, status, phone, container);
  });

  function loadTickets(page, per_page, status, phone, container) {
    container.find("#loading-overlay").show();

    $("html, body").animate(
      {
        scrollTop: container.offset().top - 50,
      },
      300
    );

    $.ajax({
      url: auth_data.ajax_url,
      type: "POST",
      data: {
        action: "ticket_pagination",
        page: page,
        per_page: per_page,
        status: status,
        phone: phone,
        nonce: auth_data.nonce,
      },
      success: function (response) {
        if (response.success) {
          container.find("#ticket-list").html(response.tickets);
          container.find("#ajax-pagination").html(response.pagination);
          container.find("#ticket-list").hide().fadeIn(500);
          initializeDatePicker();
        } else {
          toastr.error("Có lỗi xảy ra khi tải dữ liệu", "Error");
        }
      },
      error: function () {
        toastr.error("Có lỗi xảy ra khi kết nối server", "Error");
      },
      complete: function () {
        container.find("#loading-overlay").hide();
      },
    });
  }

  function formatVnMoney(value) {
    var n = Number(value || 0);
    if (isNaN(n)) n = 0;
    return n.toLocaleString("vi-VN") + "đ";
  }

  $(document).on("click", ".btn-refund-ticket", function (e) {
    e.preventDefault();
    var $btn = $(this);
    var postId = parseInt($btn.data("post-id"), 10) || 0;
    if (!postId) {
      toastr.error("Thiếu thông tin vé", "Error");
      return;
    }

    $btn.prop("disabled", true);

    $.ajax({
      url: auth_data.ajax_url,
      type: "POST",
      dataType: "json",
      data: {
        action: "preview_refund_ticket",
        post_id: postId,
        nonce: auth_data.nonce,
      },
      success: function (res) {
        if (!res || !res.success) {
          toastr.error(res?.data?.message || "Không lấy được phí hủy", "Error");
          return;
        }

        var d = res.data || {};
        var feeText = formatVnMoney(d.cancel_fee);
        var refundText = formatVnMoney(d.refund_amount);
        var allowCancel = !!d.allow_cancel;
        var allowMessage = String(d.allow_message || "");
        // var statusDescription = String(d.status_description || "");
        var refundBefore = String(d.refund_before || "");

        var previewText = "Mã booking: " + (d.booking_code || "");
        if (d.cancel_fee > 0) {
          previewText +=
            "\nPhí hủy dự kiến: " +
            feeText +
            "\nTiền hoàn dự kiến: " +
            refundText;
        }
        previewText +=
          (refundBefore ? "\nHạn hủy hoàn tiền: " + refundBefore : "") +
          (allowMessage ? "\nThông báo: " + allowMessage : "");

        if (!allowCancel) {
          alert(previewText);
          return;
        }

        Swal.fire({
          title: "Lý do hủy vé",
          html: `<div style="text-align: left; font-size: 14px; margin-bottom: 10px;">${previewText.replace(/\n/g, "<br>")}</div>`,
          input: "textarea",
          inputPlaceholder: "Nhập lý do hủy vé của bạn tại đây...",
          inputValue: "Khách hàng yêu cầu hủy vé",
          showCancelButton: true,
          confirmButtonText: "Xác nhận hủy",
          cancelButtonText: "Quay lại",
          confirmButtonColor: "#d33",
          preConfirm: (reason) => {
            if (!reason || reason.trim() === "") {
              Swal.showValidationMessage("Vui lòng nhập lý do hủy vé");
            }
            return reason;
          },
        }).then((result) => {
          if (result.isConfirmed) {
            var reason = result.value;
            $.ajax({
              url: auth_data.ajax_url,
              type: "POST",
              dataType: "json",
              data: {
                action: "confirm_refund_ticket",
                post_id: postId,
                reason: reason,
                nonce: auth_data.nonce,
              },
              success: function (confirmRes) {
                if (!confirmRes || !confirmRes.success) {
                  toastr.error(confirmRes?.data?.message || "Hủy vé hoàn tiền thất bại", "Error");
                  return;
                }
                toastr.success(confirmRes?.data?.message || "Hủy vé hoàn tiền thành công", "Success");
                setTimeout(function () {
                  window.location.reload();
                }, 800);
              },
              error: function () {
                toastr.error("Lỗi kết nối khi xác nhận hoàn tiền", "Error");
              },
            });
          }
        });
      },
      error: function () {
        toastr.error("Lỗi kết nối khi lấy phí hủy", "Error");
      },
      complete: function () {
        $btn.prop("disabled", false);
      },
    });
  });

  $(document).keydown(function (e) {
    if (e.which == 37) {
      $('.pagination-link[data-page="' + (getCurrentPage() - 1) + '"]').click();
    } else if (e.which == 39) {
      $('.pagination-link[data-page="' + (getCurrentPage() + 1) + '"]').click();
    }
  });

  function getCurrentPage() {
    var current = $(".ajax-pagination .current").text();
    return parseInt(current) || 1;
  }

  jQuery(document).on("click", ".trigger", toggleModal);
  window.addEventListener("click", windowOnClick);

  jQuery("#openModalBtn").click(function () {
    jQuery(".footer-wrapper").css("zIndex", "0");

    // Initial render of all banks
    function renderBanks(banks) {
      let contentHtml = "";
      banks.forEach((item) => {
        contentHtml += `<div class="bank-logo"><img src="${item.img}" alt="${item.name}"></div>`;
      });
      jQuery("#listBank").html(contentHtml);
    }

    // Initial load
    renderBanks(dataCard);

    // Handle search input
    jQuery("#searchBank").on("input", function () {
      const searchTerm = jQuery(this).val().toLowerCase();
      const filteredBanks = dataCard.filter((bank) =>
        bank.name.toLowerCase().includes(searchTerm)
      );
      renderBanks(filteredBanks);
    });

    jQuery("#modalCard").fadeIn();
  });

  // Close modal
  jQuery(".closeModalBtn").click(function () {
    jQuery("#modalCard").fadeOut();
    jQuery(".footer-wrapper").css("zIndex", "1");
  });

  jQuery("#continueBtn").click(function () {
    if (!jQuery(".bank-logo.active").length) {
      toastr.error("Vui lòng chọn ngân hàng", "Error");
      return;
    }

    toastr.info("Chức năng đang được phát triển", "Đang cập nhật");
  });

  jQuery(document).on("click", ".bank-logo", function () {
    jQuery(".bank-logo").not(this).removeClass("active");
    jQuery(this).toggleClass("active");
    // jQuery('.bank-logo').not(this).css('border', '0.5px solid #e3e3e3');
  });
});

function menuToggle() {
  const toggleMenu = jQuery(".menu-drp");
  toggleMenu.toggleClass("active");
  if (toggleMenu.hasClass("active")) {
    jQuery(".user-drp")
      .find("#icon-drp")
      .removeClass("fa-caret-down")
      .addClass("fa-caret-up");
  } else {
    jQuery(".user-drp")
      .find("#icon-drp")
      .removeClass("fa-caret-up")
      .addClass("fa-caret-down");
  }
}

const dataCard = [
  {
    id: 1,
    name: "Vietcombank",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/VCOM.png",
  },
  {
    id: 2,
    name: "BIDV",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/BIDV.png",
  },
  {
    id: 3,
    name: "VPBANK",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/VPBANK.png",
  },
  {
    id: 4,
    name: "Sacombank",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/SACB.png",
  },
  {
    id: 5,
    name: "Vietinbank",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/CTG.png",
  },
  {
    id: 6,
    name: "ACB",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/ACB.png",
  },
  {
    id: 7,
    name: "MBbank",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/MB.png",
  },
  {
    id: 8,
    name: "TPBANK",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/TPBANK.png",
  },
  {
    id: 9,
    name: "AGRIBANK",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/ARGI.png",
  },
  {
    id: 10,
    name: "SHBANK",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/SHB.png",
  },
  {
    id: 11,
    name: "HDBANK",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/HDB.png",
  },
  {
    id: 12,
    name: "EXIMBANK",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/EXIMBANK.png",
  },
  {
    id: 13,
    name: "NCB",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/NCB.png",
  },
  {
    id: 14,
    name: "OCEAN BANK",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/OJB.png",
  },
  {
    id: 15,
    name: "NAM A BANK",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/NAMABANK.png",
  },
  {
    id: 16,
    name: "OCB",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/OCB.png",
  },
  {
    id: 17,
    name: "SCB",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/SCB.png",
  },
  {
    id: 18,
    name: "IVB",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/IVB.png",
  },
  {
    id: 19,
    name: "ABBANK",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/ABBANK.png",
  },
  {
    id: 20,
    name: "VIB",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/VIB.png",
  },
  {
    id: 21,
    name: "PVCOMBANK",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/PVCOMBANK.png",
  },
  {
    id: 22,
    name: "SAIGONBANK",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/SAIGONBANK.png",
  },
  {
    id: 23,
    name: "BACABANK",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/BACABANK.png",
  },
  {
    id: 24,
    name: "SeABANK",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/SEAB.png",
  },
  {
    id: 25,
    name: "LienVietPostBANK",
    img: "https://229a2c9fe669f7b.cmccloud.com.vn/images/bank/LPB.png",
  },
];
