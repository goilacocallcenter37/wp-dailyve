var formBooking = {
  seatsAndInfoData: null,
  partnerId: "",
  tripId: "",
  bookingId: "",
  wayId: "",
  selectedSeats: [],
  pickupPoint: null,
  dropoffPoint: null,
  transferPickupPoint: null,
  transferDropoffPoint: null,
  pickupSurcharge: null,
  dropoffSurcharge: null,
  pickupPointMoreDesc: null,
  dropoffPointMoreDesc: null,
  subtotal: 0,
  subtotalSeats: 0,
  routeName: "",
  customer: {
    name: "",
    phone: "",
    email: "",
    customer_id_number: "",
  },
  note: "",
};

var seatsList = [];
var hotline = "19000155";
var paymentMethod = null;
var stepTicket = 0;

// ===== filter helpers (pickup/dropoff points as object arrays) =====
var url = new URL(window.location.href);
var searchParams = new URLSearchParams(url.search);

function encodeBase64Unicode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}
function decodeBase64Unicode(base64) {
  return decodeURIComponent(escape(atob(base64)));
}

function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}

function getPointObjectFromCheckbox(el) {
  var $cb = jQuery(el);
  var b64 = $cb.attr("data-point-b64");
  if (b64) {
    try {
      var obj = JSON.parse(decodeBase64Unicode(b64));
      // normalize legacy payload
      if (obj && obj.pointName && !obj.district) obj.district = obj.pointName;
      if (obj && obj.tripCount && !obj.trip_count)
        obj.trip_count = obj.tripCount;
      return obj;
    } catch (e) {}
  }

  // fallback legacy: data-point="Quận 1,Quận 3"
  var name = $cb.attr("data-point") || "";
  name = String(name).trim();
  if (!name) return null;

  return { district: name, trip_count: 0 };
}

function pointKey(p) {
  // response mới: chỉ dùng district để lọc điểm đi/đến
  var district = p && p.district ? String(p.district) : "";
  return district;
}

function getPointKeyFromCheckbox($cb) {
  var obj = getPointObjectFromCheckbox($cb);
  return obj ? pointKey(obj) : "";
}

function collectPointsFromCheckbox(containerSelector) {
  var points = [];
  jQuery(containerSelector + " input[type='checkbox']:checked").each(
    function () {
      var obj = getPointObjectFromCheckbox(this);
      if (!obj || !obj.district) return;
      points.push({ district: obj.district, trip_count: obj.trip_count || 0 });
    },
  );
  return points;
}

function parsePointsFromParam(val) {
  if (!val) return [];

  // 1) base64(JSON)
  try {
    var decoded = decodeBase64Unicode(val);
    var json1 = JSON.parse(decoded);
    return normalizePointsPayload(json1);
  } catch (e) {}

  // 2) JSON raw
  try {
    var json2 = JSON.parse(val);
    return normalizePointsPayload(json2);
  } catch (e) {}

  // 3) legacy CSV
  return normalizePointsPayload(
    String(val)
      .split(",")
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean),
  );
}

function setCheckboxCheckedByKey(selector, key, checked) {
  jQuery(selector).each(function () {
    if (getPointKeyFromCheckbox(this) === key) {
      jQuery(this).prop("checked", checked);
    }
  });
}

// Restore checked state for pickup/dropoff filters from URL params (fa/ta)
function normalizePointsPayload(payload) {
  if (!payload) return [];
  var out = [];

  if (Array.isArray(payload)) {
    payload.forEach(function (item) {
      if (!item) return;

      if (typeof item === "string") {
        var d = item.trim();
        if (d) out.push({ district: d, trip_count: 0 });
        return;
      }

      if (typeof item === "object") {
        var district = item.district || item.pointName || item.name || "";
        district = String(district).trim();
        if (!district) return;

        var tripCount = item.trip_count || item.tripCount || 0;

        out.push({ district: district, trip_count: tripCount });
      }
    });
  }

  return out;
}

function restoreAreaSelectionsFromUrl() {
  var urlParams = new URLSearchParams(window.location.search);
  var fa = urlParams.get("fa");
  var ta = urlParams.get("ta");

  var fromArr = parsePointsFromParam(fa);
  var toArr = parsePointsFromParam(ta);

  var fromKeys = {};
  fromArr.forEach(function (p) {
    if (!p || !p.district) return;
    fromKeys[pointKey(p)] = true;
  });

  var toKeys = {};
  toArr.forEach(function (p) {
    if (!p || !p.district) return;
    toKeys[pointKey(p)] = true;
  });

  jQuery(".js-pickup-point").each(function () {
    var key = getPointKeyFromCheckbox(this);
    if (!key) return;
    jQuery(this).prop("checked", !!fromKeys[key]);
  });

  jQuery(".js-dropoff-point").each(function () {
    var key = getPointKeyFromCheckbox(this);
    if (!key) return;
    jQuery(this).prop("checked", !!toKeys[key]);
  });

  // cập nhật label (nếu có)
  var fromNames = Object.keys(fromKeys).filter(Boolean);
  var toNames = Object.keys(toKeys).filter(Boolean);

  if (fromNames.length)
    jQuery("#fromAreaSelectedText").text(fromNames.join(", "));
  if (toNames.length) jQuery("#toAreaSelectedText").text(toNames.join(", "));
}

// ========================================================================

jQuery(document).ready(function ($) {
  // use global url/searchParams + helpers (see top of file)
  var timeParam = searchParams.get("time");
  var startMinutes = 0;
  var endMinutes = 1440;
  var returnDate = searchParams.get("returnDate") ?? null;

  // Ensure mobile + PC checkboxes reflect URL params on reload
  restoreAreaSelectionsFromUrl();

  function formatTimes(values) {
    const toHHMM = (m) => {
      let h = Math.floor(m / 60);
      let mm = m - h * 60;
      if (h.toString().length === 1) h = "0" + h;
      if (mm.toString().length === 1) mm = "0" + mm;
      if (mm == 0) mm = "00";

      if (h >= 24) {
        h = 23;
        mm = "59";
      }
      return `${h}:${mm}`;
    };
    return [toHHMM(values[0]), toHHMM(values[1])];
  }

  if (timeParam) {
    var times = timeParam.split("-");
    if (times.length === 2) {
      var startTime = times[0].split(":");
      var endTime = times[1].split(":");

      if (startTime.length === 2 && endTime.length === 2) {
        startMinutes = parseInt(startTime[0]) * 60 + parseInt(startTime[1]);
        endMinutes = parseInt(endTime[0]) * 60 + parseInt(endTime[1]);
      }

      $(".slider-time").html(times[0]);
      $(".slider-time2").html(times[1]);

      $(".list-search").append(
        '<span data-type="time" data-id="' +
          times[0] +
          "-" +
          times[1] +
          '">' +
          "<p>" +
          times[0] +
          " - " +
          times[1] +
          "</p>" +
          '<div class="close-item-filter"><i class="fas fa-times"></i></div>' +
          "</span>",
      );
    }
  }

  // var form = $("#multi-step-form");
  var currentStep = 1;

  $(document).on("click", "#next-step-1", function () {
    // console.log(formBooking);
    // return;

    if (formBooking.selectedSeats.length > 0) {
      currentStep++;
      $(".step").removeClass("active");
      $("#step" + currentStep).addClass("active");
      calculateSurcharge("#list-pickup-point");
      calculateSurcharge("#list-pickup-transfer-point");
      calculateSurcharge("#list-dropoff-point");
      calculateSurcharge("#list-dropoff-transfer-point");

      let selectedSeats = formBooking.selectedSeats.length;
      $(".item-list-point").each(function () {
        let data_transfer =
          $(this).find('input[type="radio"]').attr("data-transfer") != undefined
            ? $(this).find('input[type="radio"]').attr("data-transfer")
            : undefined;

        if (data_transfer != undefined && data_transfer == "disabled") {
          $(this).find('input[type="radio"]').attr("disabled", "disabled");
          $(this).find('input[type="radio"]').prop("checked", false);
        } else {
          let data_min_customer = Number($(this).attr("data-min-customer"));
          if (selectedSeats < data_min_customer) {
            $(this).find('input[type="radio"]').attr("disabled", "disabled");
            $(this).find('input[type="radio"]').prop("checked", false);
            $(this).find(".point-note-2").show();
          } else {
            $(this).find('input[type="radio"]').removeAttr("disabled");
            $(this).find(".point-note-2").hide();
          }
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        text: "Vui lòng chọn ít nhất 1 chỗ ngồi",
        confirmButtonColor: "#FF9100",
        confirmButtonText: "Đã hiểu",
        customClass: "swal2-wide",
      });
    }
  });

  $(document).on("click", "#next-step-2", function () {
    // console.log(formBooking);
    // return;

    var $this = $(this);
    if (formBooking.selectedSeats.length > 0) {
      if (!formBooking.pickupPoint && !formBooking.transferPickupPoint) {
        Swal.fire({
          icon: "error",
          text: "Vui lòng chọn điểm đón",
          confirmButtonColor: "#FF9100",
          confirmButtonText: "Đã hiểu",
          customClass: "swal2-wide",
        });

        if (screen.width <= 549) {
          $(".point-tab").removeClass("active");
          $(".point-tab-pickup").addClass("active");
          $(".content-dropoff-point").hide();
          $(".content-pickup-point").show();
        }

        return;
      }

      if ($('input[name="pickup_point_more_desc"]:not(:disabled)').length > 0) {
        let val = "";
        $('input[name="pickup_point_more_desc"]:not(:disabled)').each(
          function () {
            if ($(this).val() != "") {
              val = $(this).val();
              formBooking.pickupPointMoreDesc = val;
            }
          },
        );
        if (val == "") {
          Swal.fire({
            icon: "error",
            text: "Vui lòng nhập địa chỉ điểm đón",
            confirmButtonColor: "#FF9100",
            confirmButtonText: "Đã hiểu",
            customClass: "swal2-wide",
          });
          return;
        }
      } else {
        formBooking.pickupPointMoreDesc = null;
      }

      if (!formBooking.dropoffPoint && !formBooking.transferDropoffPoint) {
        Swal.fire({
          icon: "error",
          text: "Vui lòng chọn điểm trả",
          confirmButtonColor: "#FF9100",
          confirmButtonText: "Đã hiểu",
          customClass: "swal2-wide",
        });

        if (screen.width <= 549) {
          $(".point-tab").removeClass("active");
          $(".point-tab-dropoff").addClass("active");
          $(".content-pickup-point").hide();
          $(".content-dropoff-point").show();
        }

        return;
      }

      if (
        $('input[name="dropoff_point_more_desc"]:not(:disabled)').length > 0
      ) {
        let val = "";
        $('input[name="dropoff_point_more_desc"]:not(:disabled)').each(
          function () {
            if ($(this).val() != "") {
              val = $(this).val();
              formBooking.dropoffPointMoreDesc = val;
            }
          },
        );
        if (val == "") {
          Swal.fire({
            icon: "error",
            text: "Vui lòng nhập địa chỉ điểm trả",
            confirmButtonColor: "#FF9100",
            confirmButtonText: "Đã hiểu",
            customClass: "swal2-wide",
          });
          return;
        }
      } else {
        formBooking.dropoffPointMoreDesc = null;
      }

      // console.log(formBooking);
      // return;

      // currentStep++;
      // $(".step").removeClass("active");
      // $("#step" + currentStep).addClass("active");

      // var depDateIso =
      //   (formBooking &&
      //     formBooking.seatsAndInfoData &&
      //     formBooking.seatsAndInfoData.departure_date) ||
      //   null;
      // formBooking.departure_date = depDateIso;

      if (returnDate) {
        currentStep = 1;
        $.ajax({
          url: generic_data.ajax_url,
          method: "POST",
          data: {
            action: "save_ticket",
            nonce: generic_data.nonce,
            ticket: formBooking,
          },
          beforeSend: function () {
            $(".omrs-input-helper").hide();
            $this.prop("disabled", true);
          },
          success: function (response) {
            if (response.success) {
              if (stepTicket === 1) {
                location.assign(`${url.origin}/bookingconfirmation`);
                // $this.removeAttr("disabled");
                return;
              }

              stepTicket++;
              const data = getParamsFilter(searchParams, 1, 0, returnDate);
              // console.log(data);
              // console.log(formBooking);
              filterRouteAjax(data);
            } else {
              if (
                confirm(
                  `Hiện tại chuyến đi này chưa được hỗ trợ đặt vé online bạn vui lòng liên hệ: ${hotline} để được hỗ trợ đặt vé trực tiếp!`,
                )
              ) {
                window.location.href = `tel:${hotline}`;
              }
            }
          },
          error: function (error) {
            console.log(error);
            $this.removeAttr("disabled");
          },
        });
      } else {
        $.ajax({
          url: generic_data.ajax_url,
          method: "POST",
          data: {
            action: "save_ticket",
            nonce: generic_data.nonce,
            ticket: formBooking,
          },
          // contentType: 'application/json; charset=utf-8',
          beforeSend: function () {
            $(".omrs-input-helper").hide();
            $this.prop("disabled", true);
          },

          success: function (response) {
            // console.log(response);
            if (response.success) {
              location.assign(`${url.origin}/bookingconfirmation`);
              // $this.removeAttr("disabled");
            } else {
              if (
                confirm(
                  `Hiện tại chuyến đi này chưa được hỗ trợ đặt vé online bạn vui lòng liên hệ: ${hotline} để được hỗ trợ đặt vé trực tiếp!`,
                )
              ) {
                window.location.href = `tel:${hotline}`;
              }
            }
          },
          error: function (xhr, status, error) {
            console.log("Error: " + error);
            $this.removeAttr("disabled");
          },
        });
      }

      // const pickupPointAddress = getFullAddress(
      //   formBooking.pickupPoint?.areaDetail,
      //   formBooking.pickupPoint?.address
      // );
      // const dropoffPointAddress = getFullAddress(
      //   formBooking.dropoffPoint?.areaDetail,
      //   formBooking.dropoffPoint?.address
      // );

      // const seatsCode = formBooking.selectedSeats
      //   .map((seat) => seat.seatCode)
      //   .join(", ");
      // const departureTime = convertDateTime(
      //   formBooking.seatsAndInfoData?.departureTime
      // );

      // $(".section-ticket-header-left .date-ticket-info").text(departureTime);
      // $(".total-ticket p").text(
      //   `${formBooking.selectedSeats?.length} (${seatsCode})`
      // );
      // $(
      //   ".section-ticket-company-info .section-ticket-company-info-name .base_text"
      // ).text(formBooking.seatsAndInfoData?.companyName);
      // $(
      //   ".section-ticket-company-info .section-ticket-company-info-name .base_text_1"
      // ).text(formBooking.seatsAndInfoData?.name);

      // $(".pickup-point-name .base_text").text(formBooking.pickupPoint?.name);
      // $(".pickup-point-name .base_text_2").text(pickupPointAddress);
      // $(".dropoff-point-name .base_text").text(formBooking.dropoffPoint?.name);
      // $(".dropoff-point-name .base_text_2").text(dropoffPointAddress);
      // $(".time-pick-up .base__Headline01").text(
      //   formBooking.pickupPoint?.realTime?.split(" ")[0]
      // );
      // $(".time-drop-off .base__Headline01").text(
      //   formBooking.dropoffPoint?.realTime?.split(" ")[0]
      // );

      // console.log(formBooking);
    } else {
      Swal.fire({
        icon: "error",
        text: "Vui lòng chọn ít nhất 1 chỗ ngồi",
        confirmButtonColor: "#FF9100",
        confirmButtonText: "Đã hiểu",
        customClass: "swal2-wide",
      });
    }
  });

  jQuery(document).on("click", ".filter_bus-operator > p", function () {
    jQuery(this).toggleClass("active");
    jQuery(this).next().slideToggle(300);
  });

  function formatVND(number, withSymbol = true) {
    return new Intl.NumberFormat("vi-VN", {
      style: withSymbol ? "currency" : "decimal",
      currency: "VND",
    }).format(number);
  }

  function calculateSurcharge(selector) {
    const ticket_count = formBooking.selectedSeats.length;
    jQuery(`${selector} .item-list-point`).each(function () {
      const surcharge = Number(
        jQuery(this).find("input").attr("data-surcharge"),
      );
      const surcharge_tiers = JSON.parse(
        jQuery(this).find("input").attr("data-surcharge-tiers"),
      );
      let final_surcharge = surcharge;
      if (surcharge_tiers.length > 0) {
        for (let i = 0; i < surcharge_tiers.length; i++) {
          let from = Number(surcharge_tiers[i].from);
          let to =
            surcharge_tiers[i].to != null
              ? Number(surcharge_tiers[i].to)
              : null;
          let surcharge = Number(surcharge_tiers[i].surcharge);
          let unit = surcharge_tiers[i].unit;

          if (to != null) {
            if (ticket_count >= from && ticket_count <= to) {
              if (unit == "group") {
                final_surcharge = surcharge;
              } else {
                final_surcharge = surcharge * ticket_count;
              }

              jQuery(this)
                .find(".content-surcharge-price")
                .text("Phí phụ thu: " + formatVND(final_surcharge, true));
              jQuery(this)
                .find('input[type="radio"]')
                .attr("data-final-surcharge", final_surcharge);
              break;
            }
          } else {
            if (ticket_count >= from) {
              if (unit == "group") {
                final_surcharge = surcharge;
              } else {
                final_surcharge = surcharge * ticket_count;
              }

              jQuery(this)
                .find(".content-surcharge-price")
                .text("Phí phụ thu: " + formatVND(final_surcharge, true));
              jQuery(this)
                .find('input[type="radio"]')
                .attr("data-final-surcharge", final_surcharge);
              break;
            }
          }
        }
      }
    });
  }

  $(document).on("click", "#next-step-3", function () {
    let $this = $(this);
    let name = $("input[name='customer-name']");
    let phone = $("input[name='customer-phone']");
    let email = $("input[name='customer-email']");
    let note = $("textarea[name='customer-note']").val();

    $(".omrs-input-helper").hide();

    if (name.val().length <= 0) {
      name.focus();
      $("#msg-err-name").text("Vui lòng nhập họ tên");
      $("#msg-err-name").show();
      return;
    }

    if (name.val().length > 150) {
      name.focus();
      $("#msg-err-name").text("Không vượt quá 150 ký tự");
      $("#msg-err-name").show();
      return;
    }

    if (!validateEmail(email.val()) || email.val().length < 6) {
      email.focus();
      $("#msg-err-email").text("Vui lòng nhập địa chỉ email");
      $("#msg-err-email").show();
      return;
    }

    if (!phoneNumber(phone.val())) {
      phone.focus();
      $("#msg-err-phone").text("Vui lòng nhập số điện thoại");
      $("#msg-err-phone").show();
      return;
    }

    formBooking.customer = {
      name: name.val(),
      phone: phone.val(),
      email: email.val(),
    };
    formBooking.note = note;

    // return;
  });

  $(document).on("click", ".prev-step", function () {
    currentStep--;
    $(".step").removeClass("active");
    $("#step" + currentStep).addClass("active");
  });

  $(document).on("click", "[data-trip]", function () {
    var $this = $(this);
    let parent = $this.parents(".online-booking-page__provider-list__item");
    let date =
      searchParams.get("date") ??
      new Date()
        .toLocaleDateString("vi-VN")
        .split("/")
        .map((part) => part.padStart(2, "0"))
        .join("-");

    let tripCode = $this.attr("data-trip");
    let partnerId = $this.data("partner-id");
    let departureTime = $this.data("departure-time");
    let departureDate = $this.data("departure-date");
    let wayId = $this.data("way-id");
    let bookingId = $this.data("booking-id");
    let unchoosable = $this.data("unchoosable");

    const $contentElement = parent.find(
      ".online-booking-page__provider-list__seats-info",
    );
    const $loadingElement = parent.find('[id^="ticket-loading-"]');

    currentStep = 1;

    if ($this.hasClass("btn-close")) {
      handleSeatClose();
      return;
    } else {
      $this.prop("disabled", true);
      handleSeatClose();

      let data = {
        action:
          unchoosable !== 1
            ? "choose_trip_ajax_booking"
            : "choose_trip_ajax_booking_2",
        tripCode: tripCode,
        partnerId: partnerId,
        departureTime: departureTime,
        wayId: wayId,
        bookingId: bookingId,
        nonce: generic_data.nonce,
      };

      $.ajax({
        url: generic_data.ajax_url,
        type: "POST",
        data: data,
        beforeSend: function () {
          if (parent.find(".notice-box").length > 0) {
            let notice_title = parent.find(".notice-box__title").text();
            let notice_desc = parent.find(".notice-box__desc").html();

            Swal.fire({
              icon: "warning",
              title: notice_title,
              html: `<div style="text-align:left;">${notice_desc}</div>`,
              confirmButtonColor: "#FF9100",
              confirmButtonText: "Tôi đã đọc và đã hiểu",
              customClass: "swal2-wide",
            });
          }

          parent[0].scrollIntoView({ behavior: "smooth" });
          $loadingElement.html(
            '<div class="warrap-loader"><span class="loader"></span></div>',
          );
        },

        success: function (response) {
          $this.removeAttr("disabled");
          if (response.success) {
            $loadingElement.empty();
            const data = response.data;
            // console.log(data);

            seatsList = data.seats;

            const { coach_seat_template, stage_fares, ...rest } = data.data;
            formBooking.seatsAndInfoData = rest;
            formBooking.seatsAndInfoData.departure_date = departureDate;
            formBooking.tripId = tripCode;
            formBooking.bookingId = bookingId;
            formBooking.wayId = wayId;
            formBooking.routeName = $this.data("route-name");
            formBooking.partnerId = partnerId;

            $this.text("Đóng");
            $this.addClass("btn-close");
            $contentElement.html(data.html);

            if (formBooking.partnerId === "goopay") {
              sortPointListByTimeAsc("#list-pickup-point");
              sortPointListByTimeAsc("#list-dropoff-point");
            }
          } else {
            if (
              confirm(
                `Dailyve đang cập nhật chuyến đi này vui lòng liên hệ: ${hotline} để được hỗ trợ!`,
              )
            ) {
              window.location.href = `tel:${hotline}`;
            }
          }
          $loadingElement.empty();
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
          $loadingElement.empty();
          $this.removeAttr("disabled");
        },
      });
    }
  });

  $(document).on("click", ".guest-count__plus", function () {
    let item = $(this).parents(".guest-count__item");
    let quantity = item.find(".guest-count__quantity");
    let total = 0;
    $(".guest-count__item").each(function () {
      total += Number($(this).find(".guest-count__quantity").text());
    });
    let available = Number(item.attr("data-available-seat"));
    let current = Number(quantity.text());
    current += 1;
    total += 1;
    if (current > available) {
      Swal.fire({
        icon: "error",
        text: `Đã hết ghế trống ở vị trí này`,
        confirmButtonColor: "#FF9100",
        confirmButtonText: "Đã hiểu",
        customClass: "swal2-wide",
      });
      return;
    }
    let maxSeats = formBooking.partnerId === "goopay" ? 5 : 8;
    if (total > maxSeats) {
      Swal.fire({
        icon: "error",
        text: `Bạn chỉ được đặt tối đa ${maxSeats} chỗ`,
        confirmButtonColor: "#FF9100",
        confirmButtonText: "Đã hiểu",
        customClass: "swal2-wide",
      });
      return;
    }

    let group = item.attr("data-group");
    let full_code = item.attr("data-full-code");
    full_code = full_code != "" ? full_code.split(",") : [];
    let fare = Number(item.attr("data-fare"));
    let selected_full_code = {
      full_code: full_code[0],
      group: group,
      fare: fare,
    };
    formBooking.selectedSeats.push(selected_full_code);
    full_code.shift();
    quantity.text(current);
    full_code = full_code.join(",");
    item.attr("data-full-code", full_code);
    console.log(formBooking);
    updateSelectedSeatsUI();
  });

  $(document).on("click", ".guest-count__minus", function () {
    let item = $(this).parents(".guest-count__item");
    let quantity = item.find(".guest-count__quantity");
    let current = Number(quantity.text());
    current -= 1;
    if (current < 0) {
      current = 0;
    }

    let full_code = item.attr("data-full-code");
    full_code = full_code != "" ? full_code.split(",") : [];
    let group = item.attr("data-group");
    let selected_seats = formBooking.selectedSeats;
    for (let i = 0; i < selected_seats.length; i++) {
      let seat = selected_seats[i];
      if (seat.group == group) {
        full_code.push(seat.full_code);
        formBooking.selectedSeats.splice(i, 1);
      }
    }
    quantity.text(current);
    full_code = full_code.join(",");
    item.attr("data-full-code", full_code);
    console.log(formBooking);
    updateSelectedSeatsUI();
  });

  $(document).on("click", ".btn-load-more-route", function () {
    var $this = $(this);
    var $loader = null;
    let currentPage = parseInt($this.attr("data-current-page"));
    let cursor = $this.attr("data-cursor");
    let totalPage = parseInt($this.attr("data-total-page"));
    let data = null;

    if (!cursor && !currentPage) {
      $this.remove();
    } else {
      if (returnDate && stepTicket === 1) {
        data = getParamsFilter(
          searchParams,
          currentPage,
          1,
          returnDate,
          cursor,
        );
      } else {
        data = getParamsFilter(searchParams, currentPage, 1, null, cursor);
      }

      $.ajax({
        url: generic_data.ajax_url,
        type: "POST",
        data: data,
        beforeSend: function () {
          $this.prop("disabled", true);
          $this.closest(".box-load-more").find(".loadmore-loader").remove();
          $loader = jQuery(
            '<div class="warrap-loader loadmore-loader"><span class="loader"></span></div>',
          );
          $this.before($loader);
        },

        success: function (response) {
          if (response) {
            $this.attr("data-current-page", currentPage + 1);
            const $response = jQuery("<div>").html(response);
            const $items = $response.find(
              "li.online-booking-page__provider-list__item",
            );
            if ($items.length) {
              jQuery(
                ".list-route-trip-container .online-booking-page__provider-list",
              ).append($items);
            }
            const $meta = $response.find(".load-more-response-meta").last();
            if ($meta.length) {
              const nextCursor = $meta.attr("data-next-cursor") || "";
              const hasMoreRaw = (
                $meta.attr("data-has-more") || ""
              ).toLowerCase();
              const hasMore = hasMoreRaw === "1" || hasMoreRaw === "true";
              if (hasMore && nextCursor) {
                $this.attr("data-cursor", nextCursor);
              } else {
                $this.remove();
              }
            } else {
              // Fallback theo cơ chế totalPage cũ nếu không có meta cursor
              if (currentPage + 1 === totalPage) {
                $this.remove();
              }
            }
          }
          if ($loader) $loader.remove();
          if ($this.length) $this.prop("disabled", false);
        },
        error: function (xhr, status, error) {
          console.log("Error: " + error);
          if ($loader) $loader.remove();
          if ($this.length) $this.prop("disabled", false);
        },
      });
    }
  });

  $(document).on("click", ".point-tab-pickup", function () {
    $(".point-tab").removeClass("active");
    $(this).addClass("active");
    $(".content-dropoff-point").hide();
    $(".content-pickup-point").show();
  });

  $(document).on("click", ".point-tab-dropoff", function () {
    $(".point-tab").removeClass("active");
    $(this).addClass("active");
    $(".content-pickup-point").hide();
    $(".content-dropoff-point").show();
  });

  $(document).on(
    "change",
    "#company-list input[type='checkbox'], #company-list-mobile input[type='checkbox']",
    function () {
      var companyName = $(this).data("name");
      var companyUrl = $(this).data("url");
      var companyId = $(this).val();
      let data = null;
      if ($(this).is(":checked")) {
        $(".list-search").append(
          '<span data-type="company" data-id="' +
            companyId +
            '">' +
            "<p>" +
            companyName +
            "</p>" +
            '<div class="close-item-filter"><i class="fas fa-times"></i></div>' +
            "</span>",
        );
      } else {
        $(".list-search")
          .find('span[data-id="' + companyId + '"]')
          .remove();
      }

      var selectedCompanies = [];

      if (screen.width > 849) {
        $("#company-list input[type='checkbox']:checked").each(function () {
          selectedCompanies.push($(this).val());
        });
      } else {
        $("#company-list-mobile input[type='checkbox']:checked").each(
          function () {
            selectedCompanies.push($(this).val());
          },
        );
      }

      searchParams.delete("companies");

      if (selectedCompanies.length > 0) {
        searchParams.set("companies", selectedCompanies.join(","));
      }

      url.search = searchParams.toString();
      window.history.pushState({}, "", url);

      if (returnDate && stepTicket === 1) {
        data = getParamsFilter(searchParams, 1, 0, returnDate);
      } else {
        data = getParamsFilter(searchParams);
      }

      filterRouteAjax(data);
    },
  );

  $(document).on(
    "change",
    "#company-list-fromArea-pc input[type='checkbox']",
    function () {
      var id = getPointKeyFromCheckbox(this);
      var displayName =
        $(this).attr("data-name") ||
        (getPointObjectFromCheckbox(this) || {}).district ||
        "";

      let data = null;

      if ($(this).is(":checked")) {
        $(".list-search").append(
          '<span data-type="fromArea" data-id="' +
            id +
            '">' +
            "<p>Điểm đi: " +
            displayName +
            "</p>" +
            '<div class="close-item-filter"><i class="fas fa-times"></i></div>' +
            "</span>",
        );
      } else {
        $(".list-search")
          .find('span[data-id="' + id + '"]')
          .remove();
      }

      var selectedFromPoints = collectPointsFromCheckbox(
        "#company-list-fromArea-pc",
      );

      searchParams.delete("fa");
      if (selectedFromPoints.length > 0) {
        searchParams.set(
          "fa",
          encodeBase64Unicode(JSON.stringify(selectedFromPoints)),
        );
      }

      url.search = searchParams.toString();
      window.history.pushState({}, "", url);

      if (returnDate) {
        data = getParamsFilter(searchParams, 1, 0, returnDate);
      } else {
        data = getParamsFilter(searchParams);
      }
      filterRouteAjax(data);
    },
  );

  $(document).on(
    "change",
    "#company-list-toArea-pc input[type='checkbox']",
    function () {
      var id = getPointKeyFromCheckbox(this);
      var displayName =
        $(this).attr("data-name") ||
        (getPointObjectFromCheckbox(this) || {}).district ||
        "";

      if ($(this).is(":checked")) {
        $(".list-search").append(
          '<span data-type="toArea" data-id="' +
            id +
            '">' +
            "<p>Điểm đến: " +
            displayName +
            "</p>" +
            '<div class="close-item-filter"><i class="fas fa-times"></i></div>' +
            "</span>",
        );
      } else {
        $(".list-search")
          .find('span[data-id="' + id + '"]')
          .remove();
      }

      var selectedToPoints = collectPointsFromCheckbox(
        "#company-list-toArea-pc",
      );

      searchParams.delete("ta");
      if (selectedToPoints.length > 0) {
        searchParams.set(
          "ta",
          encodeBase64Unicode(JSON.stringify(selectedToPoints)),
        );
      }

      url.search = searchParams.toString();
      window.history.pushState({}, "", url);

      let data = null;

      if (returnDate && stepTicket === 1) {
        data = getParamsFilter(searchParams, 1, 0, returnDate);
      } else {
        data = getParamsFilter(searchParams);
      }
      filterRouteAjax(data);
    },
  );

  $(document).on(
    "click",
    ".sort__route__radio-group input[name='sort']",
    function () {
      let sortValue = $(this).val();

      if (sortValue) {
        searchParams.set("sort", sortValue);
        url.search = searchParams.toString();
        window.history.pushState({}, "", url);

        let data = null;

        if (returnDate && stepTicket === 1) {
          data = getParamsFilter(searchParams, 1, 0, returnDate);
        } else {
          data = getParamsFilter(searchParams);
        }

        filterRouteAjax(data);
      } else {
        return;
      }
    },
  );

  $(document).on("click", "[data-rating-min]", function () {
    let minRating = $(this).attr("data-rating-min");
    let maxRating = $(this).attr("data-rating-max");

    searchParams.set("rating", `${minRating}-${maxRating}`);
    url.search = searchParams.toString();
    window.history.pushState({}, "", url);

    $(this).addClass("active");
    $(this).siblings().removeClass("active");

    $(".list-search").find('span[data-type="rating"]').remove();
    if ($(this).hasClass("active")) {
      $(".list-search").append(
        '<span data-type="rating" data-id="' +
          minRating +
          "-" +
          maxRating +
          '">' +
          "<p>" +
          minRating +
          " - 5 sao" +
          "</p>" +
          '<div class="close-item-filter"><i class="fas fa-times"></i></div>' +
          "</span>",
      );
    }

    let data = null;

    if (returnDate && stepTicket === 1) {
      data = getParamsFilter(searchParams, 1, 0, returnDate);
    } else {
      data = getParamsFilter(searchParams);
    }

    filterRouteAjax(data);
  });

  $("[data-rating-min-mb]").on("click", function () {
    $(this).toggleClass("active");
    $(this).siblings().removeClass("active");
  });

  $(document).on("keyup", "#searchBox, #searchBoxMobile", function () {
    var value = $(this).val().toLowerCase();

    $("#company-list label, #company-list-mobile label").each(function () {
      var text = $(this).text().toLowerCase();

      if (text.indexOf(value) > -1) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  $(document).on("keyup", "#searchBoxDropOffMobile", function () {
    var value = $(this).val().toLowerCase();

    $("#company-list-toArea-mobile label").each(function () {
      var text = $(this).text().toLowerCase();

      if (text.indexOf(value) > -1) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  $(document).on("keyup", "#searchBoxDropOffPC", function () {
    var value = $(this).val().toLowerCase();

    $("#company-list-toArea-pc label").each(function () {
      var text = $(this).text().toLowerCase();

      if (text.indexOf(value) > -1) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  $(document).on("keyup", "#searchBoxPickUpMobile", function () {
    var value = $(this).val().toLowerCase();

    $("#company-list-fromArea-mobile label").each(function () {
      var text = $(this).text().toLowerCase();

      if (text.indexOf(value) > -1) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  $(document).on("keyup", "#searchBoxPickUpPC", function () {
    var value = $(this).val().toLowerCase();

    $("#company-list-fromArea-pc label").each(function () {
      var text = $(this).text().toLowerCase();

      if (text.indexOf(value) > -1) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  $(document).on("change", "select[name='filter-vehicle-types']", function () {
    let isLimousine = $(this).val();

    if (isLimousine) {
      searchParams.set("islimousine", isLimousine);
    } else {
      searchParams.delete("islimousine");
    }
    url.search = searchParams.toString();
    window.history.pushState({}, "", url);

    let data = null;

    if (returnDate && stepTicket === 1) {
      data = getParamsFilter(searchParams, 1, 0, returnDate);
    } else {
      data = getParamsFilter(searchParams);
    }

    filterRouteAjax(data);
  });

  $("#slider-range").slider({
    range: true,
    min: 0,
    max: 1440,
    step: 15,
    values: [startMinutes, endMinutes],

    slide: function (e, ui) {
      const [timeMin, timeMax] = formatTimes(ui.values);
      $(".slider-time").html(timeMin);
      $(".slider-time2").html(timeMax);
    },

    stop: function (e, ui) {
      const [timeMin, timeMax] = formatTimes(ui.values);

      $(".list-search").find('span[data-type="time"]').remove();
      $(".list-search").append(
        '<span data-type="time" data-id="' +
          timeMin +
          "-" +
          timeMax +
          '">' +
          "<p>" +
          timeMin +
          " - " +
          timeMax +
          "</p>" +
          '<div class="close-item-filter"><i class="fas fa-times"></i></div>' +
          "</span>",
      );

      searchParams.set("time", `${timeMin}-${timeMax}`);
      url.search = searchParams.toString();
      window.history.pushState({}, "", url);

      const data = returnDate
        ? getParamsFilter(searchParams, 1, 0, returnDate)
        : getParamsFilter(searchParams);

      filterRouteAjax(data);
    },
  });

  $("#slider-range-mobile").slider({
    range: true,
    min: 0,
    max: 1440,
    step: 15,
    values: [startMinutes, endMinutes],
    slide: function (e, ui) {
      const [timeMin, timeMax] = formatTimes(ui.values);

      $(".slider-time").html(timeMin);
      $(".slider-time2").html(timeMax);

      // Cập nhật cho nút Áp dụng trên mobile
      $(".start-time").html(timeMin);
      $(".end-time").html(timeMax);
    },
  });


  $(document).on("click", "#btn-time-filter-apply", function () {
    let timeMin = $(".start-time").text();
    let timeMax = $(".end-time").text();

    $(".list-search").find('span[data-type="time"]').remove();
    $(".list-search").append(
      '<span data-type="time" data-id="' +
      timeMin +
      "-" +
      timeMax +
      '">' +
      "<p>" +
      timeMin +
      " - " +
      timeMax +
      "</p>" +
      '<div class="close-item-filter"><i class="fas fa-times"></i></div>' +
      "</span>",
    );

    searchParams.set("time", `${timeMin}-${timeMax}`);
    url.search = searchParams.toString();
    window.history.pushState({}, "", url);

    let data = null;

    if (returnDate && stepTicket === 1) {
      data = getParamsFilter(searchParams, 1, 0, returnDate);
    } else {
      data = getParamsFilter(searchParams);
    }

    filterRouteAjax(data);
    $(".bottom-sheet-wrapper").removeClass("show-modal");
  });


  $("#remove-all-filter").on("click", function () {
    searchParams.delete("time");
    searchParams.delete("companies");
    searchParams.delete("fa");
    searchParams.delete("ta");
    searchParams.delete("sort");
    searchParams.delete("islimousine");
    searchParams.delete("rating");

    url.search = searchParams.toString();
    window.history.pushState({}, "", url);

    $(".list-search").html("");

    let data = null;
    if (returnDate && stepTicket === 1) {
      data = getParamsFilter(searchParams, 1, 0, returnDate);
    } else {
      data = getParamsFilter(searchParams);
    }
    filterRouteAjax(data);
  });

  $(document).on("click", "#btn-time-filter-clear", function () {
    $(".slider-time").text("00:00");
    $(".slider-time2").text("23:59");

    // Reset cả nhãn của mobile
    $(".start-time").text("00:00");
    $(".end-time").text("23:59");

    $("#slider-range").slider("option", "values", [0, 1440]);
    $("#slider-range-mobile").slider("option", "values", [0, 1440]);
    searchParams.delete("time");

    url.search = searchParams.toString();
    window.history.pushState({}, "", url);

    let data = null;
    if (returnDate && stepTicket === 1) {
      data = getParamsFilter(searchParams, 1, 0, returnDate);
    } else {
      data = getParamsFilter(searchParams);
    }
    filterRouteAjax(data);
    $(".bottom-sheet-wrapper").removeClass("show-modal");
  });


  $("#btn-area-filter-clear").on("click", function () {
    // Clear both mobile + PC checkboxes
    $(
      "#company-list-fromArea-mobile input[type='checkbox'], #company-list-fromArea-pc input[type='checkbox']",
    ).prop("checked", false);
    $(
      "#company-list-toArea-mobile input[type='checkbox'], #company-list-toArea-pc input[type='checkbox']",
    ).prop("checked", false);
    $(".item-rating-filter").removeClass("active");

    searchParams.delete("fa");
    searchParams.delete("ta");
    searchParams.delete("rating");

    url.search = searchParams.toString();
    window.history.pushState({}, "", url);

    // Remove related chips
    $(".list-search")
      .find(
        "span[data-type='fromArea'], span[data-type='toArea'], span[data-type='rating']",
      )
      .remove();

    let data = null;
    if (returnDate && stepTicket === 1) {
      data = getParamsFilter(searchParams, 1, 0, returnDate);
    } else {
      data = getParamsFilter(searchParams);
    }
    filterRouteAjax(data);
  });

  $(document).on("click", "#btn-area-filter-apply", function () {
    $(".list-search").find('span[data-type="fromArea"]').remove();
    $("#company-list-fromArea-mobile input[type='checkbox']:checked").each(
      function () {
        var displayName =
          $(this).attr("data-name") ||
          (getPointObjectFromCheckbox(this) || {}).district ||
          "";
        $(".list-search").append(
          '<span data-type="fromArea" data-id="' +
            getPointKeyFromCheckbox(this) +
            '">' +
            "<p>Điểm đi: " +
            displayName +
            "</p>" +
            '<div class="close-item-filter"><i class="fas fa-times"></i></div>' +
            "</span>",
        );
      },
    );

    $(".list-search").find('span[data-type="toArea"]').remove();
    $("#company-list-toArea-mobile input[type='checkbox']:checked").each(
      function () {
        var displayName =
          $(this).attr("data-name") ||
          (getPointObjectFromCheckbox(this) || {}).district ||
          "";
        $(".list-search").append(
          '<span data-type="toArea" data-id="' +
            getPointKeyFromCheckbox(this) +
            '">' +
            "<p>Điểm đến: " +
            displayName +
            "</p>" +
            '<div class="close-item-filter"><i class="fas fa-times"></i></div>' +
            "</span>",
        );
      },
    );

    $("[data-rating-min-mb]").each(function () {
      if ($(this).hasClass("active")) {
        let minRating = $(this).attr("data-rating-min-mb");
        let maxRating = $(this).attr("data-rating-max");

        $(".list-search").find('span[data-type="rating"]').remove();

        if ($(this).hasClass("active")) {
          searchParams.set("rating", `${minRating}-${maxRating}`);

          $(".list-search").append(
            '<span data-type="rating" data-id="' +
              minRating +
              "-" +
              maxRating +
              '">' +
              "<p>" +
              minRating +
              " - 5 sao" +
              "</p>" +
              '<div class="close-item-filter"><i class="fas fa-times"></i></div>' +
              "</span>",
          );
        } else {
          searchParams.delete("rating");
        }
      }
    });

    var selectedFromPoints = [];
    var selectedToPoints = [];

    if (screen.width > 849) {
      selectedFromPoints = collectPointsFromCheckbox(
        "#company-list-fromArea-pc",
      );
      selectedToPoints = collectPointsFromCheckbox("#company-list-toArea-pc");
    } else {
      selectedFromPoints = collectPointsFromCheckbox(
        "#company-list-fromArea-mobile",
      );
      selectedToPoints = collectPointsFromCheckbox(
        "#company-list-toArea-mobile",
      );
    }

    searchParams.delete("fa");
    searchParams.delete("ta");

    if (selectedFromPoints.length > 0) {
      searchParams.set(
        "fa",
        encodeBase64Unicode(JSON.stringify(selectedFromPoints)),
      );
    }

    if (selectedToPoints.length > 0) {
      searchParams.set(
        "ta",
        encodeBase64Unicode(JSON.stringify(selectedToPoints)),
      );
    }

    url.search = searchParams.toString();
    window.history.pushState({}, "", url);

    let data = null;
    if (returnDate && stepTicket === 1) {
      data = getParamsFilter(searchParams, 1, 0, returnDate);
    } else {
      data = getParamsFilter(searchParams);
    }
    filterRouteAjax(data);
  });

  $(document).on("click", ".close-item-filter", function () {
    var parent = $(this).parent();
    var id = parent.data("id");
    // Xóa tùy chọn khỏi list-search
    parent.remove();

    if (parent.attr("data-type") == "company") {
      $('#company-list input[type="checkbox"][value="' + id + '"]').prop(
        "checked",
        false,
      );
      $('#company-list-mobile input[type="checkbox"][value="' + id + '"]').prop(
        "checked",
        false,
      );
      let selectedCompanies = [];

      if (screen.width > 849) {
        $("#company-list input[type='checkbox']:checked").each(function () {
          selectedCompanies.push($(this).val());
        });
      } else {
        $("#company-list-mobile input[type='checkbox']:checked").each(
          function () {
            selectedCompanies.push($(this).val());
          },
        );
      }

      searchParams.delete("companies");

      if (selectedCompanies.length > 0) {
        searchParams.set("companies", selectedCompanies.join(","));
      }
    }

    if (parent.attr("data-type") == "fromArea") {
      // uncheck by stable key (district)
      setCheckboxCheckedByKey(
        "#company-list-fromArea-mobile input[type='checkbox'], #company-list-fromArea-pc input[type='checkbox']",
        id,
        false,
      );

      var selectedFromPoints = [];
      if (screen.width > 849) {
        selectedFromPoints = collectPointsFromCheckbox(
          "#company-list-fromArea-pc",
        );
      } else {
        selectedFromPoints = collectPointsFromCheckbox(
          "#company-list-fromArea-mobile",
        );
      }

      searchParams.delete("fa");
      if (selectedFromPoints.length > 0) {
        searchParams.set(
          "fa",
          encodeBase64Unicode(JSON.stringify(selectedFromPoints)),
        );
      }
    }

    if (parent.attr("data-type") == "toArea") {
      setCheckboxCheckedByKey(
        "#company-list-toArea-mobile input[type='checkbox'], #company-list-toArea-pc input[type='checkbox']",
        id,
        false,
      );

      var selectedToPoints = [];
      if (screen.width > 849) {
        selectedToPoints = collectPointsFromCheckbox("#company-list-toArea-pc");
      } else {
        selectedToPoints = collectPointsFromCheckbox(
          "#company-list-toArea-mobile",
        );
      }

      searchParams.delete("ta");
      if (selectedToPoints.length > 0) {
        searchParams.set(
          "ta",
          encodeBase64Unicode(JSON.stringify(selectedToPoints)),
        );
      }
    }

    if (parent.attr("data-type") == "rating") {
      $('.item-rating-filter[data-rating="' + id + '"]').removeClass("active");
      searchParams.delete("rating");
    }

    if (parent.attr("data-type") == "time") {
      $("#slider-range").slider("option", "values", [0, 1440]);
      $("#slider-range-mobile").slider("option", "values", [0, 1440]);

      $(".slider-time").html("00:00");
      $(".slider-time2").html("23:59");
      searchParams.delete("time");
    }

    url.search = searchParams.toString();
    window.history.pushState({}, "", url);

    let data = null;
    if (returnDate && stepTicket === 1) {
      data = getParamsFilter(searchParams, 1, 0, returnDate);
    } else {
      data = getParamsFilter(searchParams);
    }
    filterRouteAjax(data);
  });

  if (screen.width > 849) {
    $("#company-list input[type='checkbox']:checked").each(function () {
      $(".list-search").append(
        '<span data-type="company" data-id="' +
          $(this).val() +
          '">' +
          "<p>" +
          $(this).attr("data-name") +
          "</p>" +
          '<div class="close-item-filter"><i class="fas fa-times"></i></div>' +
          "</span>",
      );
    });

    $("#company-list-fromArea-pc input[type='checkbox']:checked").each(
      function () {
        $(".list-search").append(
          '<span data-type="fromArea" data-id="' +
            getPointKeyFromCheckbox(this) +
            '">' +
            "<p>" +
            $(this).attr("data-name") +
            "</p>" +
            '<div class="close-item-filter"><i class="fas fa-times"></i></div>' +
            "</span>",
        );
      },
    );

    $("#company-list-toArea-pc input[type='checkbox']:checked").each(
      function () {
        $(".list-search").append(
          '<span data-type="toArea" data-id="' +
            getPointKeyFromCheckbox(this) +
            '">' +
            "<p>" +
            $(this).attr("data-name") +
            "</p>" +
            '<div class="close-item-filter"><i class="fas fa-times"></i></div>' +
            "</span>",
        );
      },
    );
  } else {
    $("#company-list-mobile input[type='checkbox']:checked").each(function () {
      $(".list-search").append(
        '<span data-type="company" data-id="' +
          $(this).val() +
          '">' +
          "<p>" +
          $(this).attr("data-name") +
          "</p>" +
          '<div class="close-item-filter"><i class="fas fa-times"></i></div>' +
          "</span>",
      );
    });

    $("#company-list-fromArea-mobile input[type='checkbox']:checked").each(
      function () {
        $(".list-search").append(
          '<span data-type="fromArea" data-id="' +
            getPointKeyFromCheckbox(this) +
            '">' +
            "<p>" +
            $(this).attr("data-name") +
            "</p>" +
            '<div class="close-item-filter"><i class="fas fa-times"></i></div>' +
            "</span>",
        );
      },
    );

    $("#company-list-toArea-mobile input[type='checkbox']:checked").each(
      function () {
        $(".list-search").append(
          '<span data-type="toArea" data-id="' +
            getPointKeyFromCheckbox(this) +
            '">' +
            "<p>" +
            $(this).attr("data-name") +
            "</p>" +
            '<div class="close-item-filter"><i class="fas fa-times"></i></div>' +
            "</span>",
        );
      },
    );
  }

  if ($("[data-rating-min]").hasClass("active")) {
    rating = searchParams.get("rating");
    $(".list-search").append(
      '<span data-type="rating" data-id="' +
        rating +
        '">' +
        "<p>" +
        rating +
        " sao" +
        "</p>" +
        '<div class="close-item-filter"><i class="fas fa-times"></i></div>' +
        "</span>",
    );
  }

  $(document).on("click", ".btn-filter-mobile-sort", () => {
    $("#bottom-sheet-sort").addClass("show-modal");
  });

  $(document).on("click", ".btn-filter-mobile-company", () => {
    $("#bottom-sheet-company").addClass("show-modal");
  });

  $(document).on("click", ".btn-filter-mobile-all", () => {
    $("#bottom-sheet-filter-all").addClass("show-modal");
  });

  function initMobileSlider() {
    if (typeof $.fn.slider === "undefined") return;

    $("#slider-range-mobile").slider({
      range: true,
      min: 0,
      max: 1440,
      step: 15,
      values: [startMinutes, endMinutes],
      slide: function (e, ui) {
        const [timeMin, timeMax] = formatTimes(ui.values);

        $(".slider-time").html(timeMin);
        $(".slider-time2").html(timeMax);

        // Cập nhật cho nút Áp dụng trên mobile
        $(".start-time").html(timeMin);
        $(".end-time").html(timeMax);
      },
    });
  }

  $(document).on("click", ".btn-filter-mobile-time", () => {
    $("#bottom-sheet-time").addClass("show-modal");
    // Khởi tạo hoặc cập nhật slider khi mở bottom sheet
    initMobileSlider();
  });


  $(document).on("click", ".close-sheet, .backdrop", () => {
    $(".bottom-sheet-wrapper").removeClass("show-modal");
  });

  // START PAYMENT PAGE JS

  function renderPaymentMethod() {
    if ($('input[name="method"]').length <= 0) {
      return;
    }
    paymentMethod = $('input[name="method"]:checked').val();

    $(".payment_method_detail_content_container").hide();

    if (paymentMethod === "online") {
      $("#content_online_method").show();
      $("#btn_payment_action").text("Tôi đã chuyển khoản");
    } else if (paymentMethod === "vnpayqr") {
      $("#content_vnpayqr_method").show();
      $("#btn_payment_action").text("Thanh toán");
    } else {
      $("#content_offline_method").show();
      $("#btn_payment_action").text("Đặt chỗ");
    }
  }

  renderPaymentMethod();

  window.addEventListener("pageshow", renderPaymentMethod);
  $('input[name="method"]').on("change", renderPaymentMethod);

  $("#btn_payment_action").on("click", function () {
    var $this = $(this);
    let code = $this.attr("data-code");

    if (!paymentMethod) {
      jQuery.notify("Vui lòng chọn phương thức thanh toán!", {
        position: "right",
      });
      return;
    }

    $.ajax({
      url: generic_data.ajax_url,
      type: "POST",
      data: {
        action: "payment_pay_booking",
        method: paymentMethod,
        code: code,
      },
      beforeSend: function () {
        $this.prop("disabled", true);
      },

      success: function (response) {
        // console.log(response);
        if (response.success) {
          if (response.data?.status === 1) {
            window.location.href = `${url.origin}/payment-results?code=${code}`;
          } else if (response.data?.status === 2) {
            Swal.fire({
              title: `<div class="title-modal-sw2">Đặt chỗ thành công</div>`,
              html: `<div class="content-modal-sw2">
                                    <div class="content-sw2">
                                        <div class="payment_content">
                                            <div class="cop_text">
                                                <p>Bạn hãy đến phòng vé của nhà xe <strong>${
                                                  response.data?.company
                                                }</strong> để thanh toán số tiền <strong>${response.data?.price?.toLocaleString(
                                                  "vi",
                                                  "VI",
                                                )}đ</strong> cho mã đặt chỗ <strong>${
                                                  response.data?.code
                                                }</strong> trước <strong>${
                                                  response.data?.expiredTime !==
                                                  null
                                                    ? response.data?.expiredTime
                                                    : ""
                                                }</strong>.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>`,
              customClass: "swal2-payment-offline",
              showCancelButton: false,
              confirmButtonColor: "#0d2e59",
              // cancelButtonColor: '#d33',
              confirmButtonText: "Xác nhận",
            }).then(function (result) {
              if (result.isConfirmed) {
                location.assign(url.origin);
              } else {
                location.assign(url.origin);
              }
            });
          } else if (response.data?.status === 3) {
            var myform = document.createElement("form");
            myform.action = `${url.origin}/vnpay-create-payment`;
            myform.method = "post";

            var bookingInput = document.createElement("input");
            var amountInput = document.createElement("input");

            bookingInput.value = response.data?.code;
            bookingInput.name = "code";
            amountInput.value = response.data?.price;
            amountInput.name = "amount";

            myform.appendChild(bookingInput);
            myform.appendChild(amountInput);

            document.body.appendChild(myform);
            myform.submit();

            setTimeout(() => {
              document.body.removeChild(myform);
            }, 0);

            return;
          } else {
            if (
              confirm(
                `Xin lỗi quý khách vì sự bất tiện này! Dailyve đang cập nhật lại chuyến xe, quý khách vui lòng liên hệ ${hotline}`,
              )
            ) {
              window.location.href = `tel:${hotline}`;
            }
          }
        } else {
          alert(response.data);
        }
        // $this.removeAttr("disabled");
      },
      error: function (xhr, status, error) {
        // console.log('Error: ' + error);
        $this.removeAttr("disabled");
        if (
          confirm(
            `Dailyve đang bảo trì quý khách vui lòng liên hệ: ${hotline} để được hỗ trợ!`,
          )
        ) {
          window.location.href = `tel:${hotline}`;
        }
      },
    });
  });

  $("#btn_payment").on("click", function () {
    var $this = $(this);
    let name = $("input[name='customer-name']");
    let phone = $("input[name='customer-phone']");
    let email = $("input[name='customer-email']");
    let contributor_code = $("input[name='contributor_code']") || "";
    let note = $("textarea[name='customer-note']").val();

    if (name.val().length <= 0) {
      name.focus();
      $("#msg-err-name").text("Vui lòng nhập họ tên").show();
      return;
    }

    if (name.val().length > 150) {
      name.focus();
      $("#msg-err-name").text("Không vượt quá 150 ký tự").show();
      return;
    }

    if (!validateEmail(email.val()) || email.val().length < 6) {
      email.focus();
      $("#msg-err-email").text("Vui lòng nhập địa chỉ email").show();
      return;
    }

    if (!phoneNumber(phone.val())) {
      phone.focus();
      $("#msg-err-phone").text("Vui lòng nhập số điện thoại").show();
      return;
    }

    let departure_dates = [];
    $(".content-info-ticket").each(function () {
      let date = $(this).attr("data-departure-date") || "";
      let time = $(this).attr("data-departure-time") || "";
      departure_dates.push(time + " " + date);
    });

    $.ajax({
      url: "/wp-json/api/v1/booking",
      type: "POST",
      data: {
        name: name.val(),
        phone: phone.val(),
        email: email.val(),
        contributor_code: contributor_code.val(),
        user_id: generic_data.user_id,
        note: note,
        departure_dates: departure_dates,
      },
      beforeSend: function () {
        $(".omrs-input-helper").hide();
        $this.prop("disabled", true);
      },

      success: function (response) {
        console.log("booking response:", response);
        
        if (!response || response.success !== true) {
          $this.removeAttr("disabled");

          if (
            response &&
            response.data &&
            response.data.status === "unpaid_reservation"
          ) {
            const unpaidData = response.data;
            Swal.fire({
              title: "Thông báo",
              html: `<div style="text-align: left;">${unpaidData.message}</div>`,
              icon: "warning",
              showCancelButton: true,
              showDenyButton: true,
              confirmButtonColor: "#28a745",
              denyButtonColor: "#dc3545",
              cancelButtonColor: "#6c757d",
              confirmButtonText: "Thanh toán ngay",
              denyButtonText: "Hủy giữ ghế",
              cancelButtonText: "Đóng",
              customClass: "swal2-wide",
            }).then((result) => {
              if (result.isConfirmed) {
                // Chuyển đến trang thanh toán
                window.location.href = unpaidData.payment_url;
              } else if (result.isDenied) {
                // Gọi API hủy vé
                Swal.fire({
                  title: "Xác nhận hủy",
                  text: "Bạn có chắc chắn muốn hủy giữ ghế cho vé này không?",
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonText: "Đồng ý hủy",
                  cancelButtonText: "Quay lại",
                }).then((confirmResult) => {
                  if (confirmResult.isConfirmed) {
                    $.ajax({
                      url: generic_data.ajax_url,
                      type: "POST",
                      data: {
                        action: "delete_ticket",
                        nonce: generic_data.delete_ticket_nonce,
                        code: unpaidData.journey_group_id,
                        journey_group_id: unpaidData.journey_group_id,
                      },
                      beforeSend: function () {
                        Swal.showLoading();
                      },
                      success: function (delResp) {
                        if (delResp.success) {
                          Swal.fire(
                            "Thành công",
                            "Đã hủy giữ ghế thành công. Bạn có thể đặt vé mới ngay bây giờ.",
                            "success",
                          );
                        } else {
                          Swal.fire(
                            "Lỗi",
                            delResp.message || "Không thể hủy vé",
                            "error",
                          );
                        }
                      },
                      error: function () {
                        Swal.fire("Lỗi", "Lỗi kết nối máy chủ", "error");
                      },
                    });
                  }
                });
              }
            });
            return;
          }

          if (
            confirm(
              `Dailyve đang cập nhật chuyến xe này, quý khách vui lòng liên hệ: ${hotline} để được hỗ trợ!`,
            )
          ) {
            window.location.href = `tel:${hotline}`;
          }
          return;
        }

        // Thành công / Partial theo format mới
        const data = response.data || {};
        const status = data.status || "success"; // "success" | "partial"
        const journeyId = data.journey_group_id || "";
        
        // Nếu bạn muốn luôn chuyển trang khi có code:
        if (status === "success") {
          if (journeyId) {
            window.location.href = `/payment-method?code=${encodeURIComponent(
              journeyId,
            )}`;
          } else {
            // không có code vẫn coi là success nhưng cần xử lý tuỳ bạn
            alert(
              "Đặt vé thành công nhưng thiếu mã booking. Vui lòng liên hệ hotline để được hỗ trợ.",
            );
            $this.removeAttr("disabled");
          }
          return;
        }

        //Partial: có vé thành công + có vé thất bại
        if (status === "partial") {
          // data.errors là list lỗi đã chuẩn hoá từ backend
          const errors = Array.isArray(data.errors) ? data.errors : [];

          // lấy message lỗi ngắn gọn cho confirm
          const errText = errors
            .slice(0, 3)
            .map(
              (e) =>
                `• Ghế ${e.seatIds || ""} (${e.tripId || ""}): ${
                  e.error || "Lỗi"
                }`,
            )
            .join("\n");

          // Nếu có journeyId => vẫn chuyển qua payment, đồng thời báo có phần lỗi
          if (journeyId) {
            const goPay = confirm(
              `Một số vé đặt thành công, một số vé bị lỗi.\n\n${errText}\n\nBạn vẫn muốn tiếp tục thanh toán cho vé đã đặt thành công không?`,
            );
            if (goPay) {
              window.location.href = `/payment-method?code=${encodeURIComponent(
                journeyId,
              )}`;
            } else {
              if (
                confirm(
                  `Bạn muốn gọi ${hotline} để được hỗ trợ xử lý phần vé lỗi không?`,
                )
              ) {
                window.location.href = `tel:${hotline}`;
              }
              $this.removeAttr("disabled");
            }
          } else {
            $this.removeAttr("disabled");
            if (
              confirm(
                `Có vé bị lỗi và hệ thống không trả mã booking.\n\n${errText}\n\nVui lòng gọi ${hotline} để được hỗ trợ!`,
              )
            ) {
              window.location.href = `tel:${hotline}`;
            }
          }
          return;
        }

        // fallback (trường hợp status lạ)
        $this.removeAttr("disabled");
        if (
          confirm(
            `Hệ thống trả trạng thái không xác định. Vui lòng liên hệ: ${hotline} để được hỗ trợ!`,
          )
        ) {
          window.location.href = `tel:${hotline}`;
        }
      },

      error: function (xhr, status, error) {
        console.log("booking ajax error:", status, error, xhr?.responseText);
        $this.removeAttr("disabled");
        if (
          confirm(
            `Dailyve đang bảo trì, quý khách vui lòng liên hệ: ${hotline} để được hỗ trợ!`,
          )
        ) {
          window.location.href = `tel:${hotline}`;
        }
      },
    });
  });

  if (jQuery("#comment-pagination").length > 0) {
    var companyId = jQuery("#comment-pagination").attr("company-id");
    var providerId = jQuery("#comment-pagination").attr("provider-id");
    var totalPage = parseInt(
      jQuery("#comment-pagination").attr("total-review"),
    );

    if (totalPage > 0) {
      jQuery("#comment-pagination").twbsPagination({
        totalPages: totalPage,
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
              page: page,
            },
            beforeSend: function () {
              jQuery("#ratings-tab-" + providerId)[0].scrollIntoView({
                behavior: "smooth",
              });
              jQuery("#comments-list-" + providerId).html(
                '<div class="warrap-loader"><span class="loader"></span></div>',
              );
            },
            success: function (response) {
              const dataJson = JSON.parse(response);

              if (dataJson.html) {
                jQuery("#comments-list-" + providerId).html(dataJson.html);
              } else {
              }
              jQuery(".warrap-loader").remove();
            },
            error: function (xhr, status, error) {
              console.error("Error loading comments:", error);
              jQuery(".warrap-loader").remove();
            },
          });
        },
      });
    }
  }

  $(".btn-add-coupon").click(() => {
    const couponCode = $("#coupon_code").val().trim();
    const ticketCode = $("#ticket_code").val();

    if (couponCode.length <= 0) {
      jQuery.notify("Vui lòng nhập mã giảm giá!", { position: "bottom" });
      return;
    }

    $.ajax({
      url: generic_data.ajax_url,
      method: "POST",
      data: {
        action: "check_add_coupon",
        coupon: couponCode,
        ticket_code: ticketCode,
      },
      beforeSend: function () {
        $(".error-notify-lv").hide();
        $(".btn-add-coupon").prop("disabled", true);
        // jQuery.notify("Đang kiểm tra mã giảm giá...", { position: "bottom" });
      },
      success: function (response) {
        if (response.success) {
          $(".total_price").text(formatCurrency(response.data.total_price));

          // Cập nhật mã QR
          const qrImage = $(".content_detail_qr img");
          const baseQrUrl =
            "https://img.vietqr.io/image/MB-VQRQAAVUO1996-qr_only.png";
          const newQrUrl = `${baseQrUrl}?amount=${
            response.data.total_price
          }&addInfo=${encodeURIComponent(response.data.payment_content)}`;
          qrImage.attr("src", newQrUrl);
          qrImage.attr("data-lazy-src", newQrUrl);

          jQuery.notify(response.data.message, {
            position: "bottom",
            className: "success",
          });
        } else {
          $(".error-notify-lv").text(response.data).show();
        }
      },
      error: function (error) {
        console.error("Error applying coupon:", error);
        jQuery.notify("Có lỗi xảy ra, vui lòng thử lại sau", {
          position: "bottom",
          className: "error",
        });
      },
      complete: function () {
        $(".btn-add-coupon").prop("disabled", false);
      },
    });
  });

  $(document).on("click", ".btn-cancel-ticket", function (e) {
    e.preventDefault();

    const $btn = $(this);
    const bookingCode = $btn.data("booking-code");
    const postId = $btn.data("post-id");
    const seatIds = $btn.data("seat-ids");
    const partnerId = $btn.data("partner-id");

    $btn.prop("disabled", true).text("Đang hủy...");

    $.ajax({
      url: generic_data.ajax_url,
      method: "POST",
      dataType: "json",
      data: {
        action: "refund_ticket",
        partnerId: partnerId,
        booking_code: bookingCode,
        seatIds: JSON.stringify(seatIds),
        post_id: postId,
      },
    })
      .done(function (res) {
        if (res && res.success) {
          alert(
            `${res.data?.message} bạn được hoàn: ${res.data?.refund}đ` ||
              "Hủy vé thành công",
          );

          $btn.text("Đã hủy").prop("disabled", true);
          const $card = $btn.closest(".ticket-card");
          $card
            .find(".status-label")
            .removeClass("processing paid unknown")
            .addClass("cancelled")
            .text("Đã hủy");
        } else {
          alert(res?.data?.message || "Hủy vé thất bại");
          $btn.prop("disabled", false).text("Hủy vé");
        }
      })
      .fail(function (xhr) {
        let msg = "Có lỗi khi hủy vé";
        try {
          const r = JSON.parse(xhr.responseText);
          msg = r?.data?.message || msg;
        } catch (_) {}
        alert(msg);
        $btn.prop("disabled", false).text("Hủy vé");
      });
  });
});

function getParamsFilter(
  searchParams,
  page = "",
  loadmore = 0,
  returnDate = null,
  cursor,
) {
  let companies = searchParams.get("companies");
  let fromAreaRaw = searchParams.get("fa");
  let toAreaRaw = searchParams.get("ta");
  let pickupPoints = parsePointsFromParam(fromAreaRaw);
  let dropoffPoints = parsePointsFromParam(toAreaRaw);
  let sort = searchParams.get("sort") ?? "time:asc";
  let date = returnDate ?? searchParams.get("date");
  let isLimousine =
    jQuery(".main-vexe-content").attr("is-limousine-page") == 1
      ? 1
      : searchParams.get("islimousine");
  let time = searchParams.get("time") ?? "00:00-23:59";
  let rating = searchParams.get("rating") ?? "1-5";
  let from = jQuery("#from").val();
  let to = jQuery("#to").val();
  let isCompanyPage = jQuery(".main-vexe-content").attr("is-company-page") ?? 0;
  let seatType = jQuery(".main-vexe-content").attr("seat-type") ?? -1;

  let data = {};

  if (returnDate) {
    data = {
      action: "filter_route_trip",
      companies: companies,
      date: date,
      from: to,
      to: from,
      time: time,
      sort: sort,
      fromarea: JSON.stringify(pickupPoints),
      toarea: JSON.stringify(dropoffPoints),
      islimousine: isLimousine,
      p: page,
      cursor: cursor,
      loadmore: loadmore,
      rating: rating,
      iscompanypage: isCompanyPage,
      seatType: seatType,
      nonce: generic_data.nonce,
    };
  } else {
    data = {
      action: "filter_route_trip",
      companies: companies,
      date: date,
      from: from,
      to: to,
      time: time,
      sort: sort,
      fromarea: JSON.stringify(pickupPoints),
      toarea: JSON.stringify(dropoffPoints),
      islimousine: isLimousine,
      p: page,
      cursor: cursor,
      loadmore: loadmore,
      rating: rating,
      iscompanypage: isCompanyPage,
      seatType: seatType,
      nonce: generic_data.nonce,
    };
  }

  return data;
}

function filterRouteAjax(data = {}) {
  let searchParams2 = new URLSearchParams(url.search);
  let returnDate2 = searchParams2.get("returnDate") ?? null;
  jQuery.ajax({
    url: generic_data.ajax_url,
    type: "POST",
    data: data,
    beforeSend: function () {
      jQuery(".list-route-trip-container")[0].scrollIntoView({
        behavior: "smooth",
      });
      jQuery("#bottom-sheet-sort").removeClass("show-modal");
      jQuery("#bottom-sheet-time").removeClass("show-modal");
      jQuery("#bottom-sheet-filter-all").removeClass("show-modal");

      let skeloader = '<ul class="o-vertical-spacing o-vertical-spacing--l">';
      Array.from({
        length: 6,
      }).map((_, i) => {
        skeloader += `
                <li class="blog-post o-media">
                    <div class="o-media__figure">
                        <span class="skeleton-box" style="width:200px;height:150px;"></span>
                    </div>
                    <div class="o-media__body">
                        <div class="o-vertical-spacing">
                            <h3 class="blog-post__headline">
                                <span class="skeleton-box" style="width:55%;"></span>
                            </h3>
                            <p>
                                <span class="skeleton-box" style="width:80%;"></span>
                                <span class="skeleton-box" style="width:90%;"></span>
                                <span class="skeleton-box" style="width:83%;"></span>
                                <span class="skeleton-box" style="width:80%;"></span>
                            </p>
                        </div>
                    </div>
                </li>`;
      });
      skeloader += "</ul>";

      jQuery(".list-route-trip-container").html(skeloader);
    },

    success: function (response) {
      if (response) {
        jQuery(".list-route-trip-container").html(response);

        if (jQuery(".online-booking-page__provider-list").length > 0) {
          let totalVe = jQuery(".online-booking-page__provider-list").attr(
            "total",
          );
          jQuery("#total-route").text(totalVe);
        }

        if (returnDate2) {
          if (jQuery(".online-booking-page__provider-list").length > 0) {
            let totalVe = jQuery(".online-booking-page__provider-list").attr(
              "total",
            );

            jQuery("#chieu-route").text("về");
            jQuery("#total-route").text(totalVe);
          }
        }
      }
    },
    error: function (xhr, status, error) {
      console.log("Error: " + error);
    },
  });
}

function handleSeatClick(element, seatCode, fullSeatCode) {
  var seat = null;
  if (element.classList.contains("unavailable")) {
    return;
  }

  for (var i = 0; i < seatsList.length; i++) {
    var foundSeat = seatsList[i].find(function (item) {
      return item.full_code == fullSeatCode;
    });

    if (foundSeat) {
      seat = structuredClone(foundSeat);
      break;
    }
  }

  if (seat && seat.is_available) {
    if (seat.seat_groups && !element.classList.contains("choose-seat")) {
      jQuery(document)
        .off("click", "[data-member]")
        .on("click", "[data-member]", function () {
          var $this = jQuery(this);
          let price = getVerifiedFare(
            $this.attr("data-member"),
            seat.seat_groups,
          );
          let seat_group_id = $this.attr("data-group-id");
          let full_code_with_seat_group = `${seat.full_code}|${seat_group_id}`;

          jQuery(".group-chosen .seat-group").removeClass("active");
          $this.addClass("active");

          seat.tempFare = price;
          if (seat.seat_groups.length > 1 && seat_group_id) {
            seat.full_code_group = full_code_with_seat_group;
          }
        });

      let htmlSeatGroups = "";
      seat.seat_groups.forEach((group, index) => {
        htmlSeatGroups += `
                    <div class="seat-group" data-member="${index}" data-group-id="${
                      group.seat_group_id
                    }">
                        <p class="base__Body">${group.seat_group}</p>
                        <p class="base__Caption">${group.fare.toLocaleString(
                          "vi",
                          "VI",
                        )}đ</p>
                    </div>
                    `;
      });
      Swal.fire({
        title: `<div class="title-modal-sw2">Mã giường: ${seat.seat_code}</div>`,
        html: `<div class="content-modal-sw2">
                        <div class="content-sw2">
                            <p class="description">Đây là giường có thể nằm tối đa 2 khách. Giá vé sẽ tương ứng với số lượng khách.</p>
                            <div class="group-chosen">
                                ${htmlSeatGroups}
                            </div>
                        </div>
                    </div>`,
        customClass: "swal2-wide",
        showCancelButton: false,
        confirmButtonColor: "#0d2e59",
        // cancelButtonColor: '#d33',
        confirmButtonText: "Xác nhận",
      }).then(function (result) {
        if (result.isConfirmed) {
          if (seat.tempFare !== undefined) {
            seat.fare = seat.tempFare;
            delete seat.tempFare;
          }
          toggleSeat(element, seat);
          updateSelectedSeatsUI();
        }
      });
    } else {
      toggleSeat(element, seat);
      updateSelectedSeatsUI();
    }
  } else {
    // console.log("Seat not found: ", seatCode);
    alert("Bạn không thể chọn ghế này!");
  }
}

function toggleSeat(element, seat) {
  const seatIndex = formBooking.selectedSeats.findIndex(
    (s) => s.full_code === seat.full_code,
  );
  const isSelected = seatIndex !== -1;

  if (!isSelected) {
    let maxSeats = formBooking.partnerId === "goopay" ? 5 : 8;
    if (formBooking.selectedSeats.length >= maxSeats) {
      alert(`Bạn được chọn tối đa ${maxSeats} chỗ cho mỗi lần đặt`);
      return;
    }
    formBooking.selectedSeats.push({ ...seat });
    element.classList.add("choose-seat");
  } else {
    formBooking.selectedSeats.splice(seatIndex, 1);
    element.classList.remove("choose-seat");
  }

  console.log("formBooking.selectedSeats: ", formBooking.selectedSeats);
}

function sortListPickUpPoint() {
  let list = jQuery("#list-pickup-point");
  let listItems = list.children(".item-list-point");
  list.append(listItems.get().reverse());
}

function sortListDropOffPoint() {
  let list = jQuery("#list-dropoff-point");
  let listItems = list.children(".item-list-point");
  list.append(listItems.get().reverse());
}

function viewMap(element) {
  let lat = element.getAttribute("data-lat");
  let long = element.getAttribute("data-long");
  let mapName = element.getAttribute("data-name");

  Swal.fire({
    title: mapName,
    html: `
          <div id="sw2-map-container">
            <iframe src="https://www.google.com/maps?q=${lat},${long}&hl=vi;z%3D14&amp&output=embed" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
        `,
    showCloseButton: true,
    showConfirmButton: false,
  });
}

function handleChangePickUp(element) {
  const pointData = atob(element.getAttribute("data-point"));
  const dataPoint = JSON.parse(pointData);
  const point_type = jQuery(element).attr("data-point-type");
  const surcharge_type = jQuery(element).attr("data-surcharge-type");

  if (point_type == "transfer-point") {
    formBooking.transferPickupPoint = dataPoint;
    if (surcharge_type == 2) {
      formBooking.pickupSurcharge = jQuery(element).attr(
        "data-final-surcharge",
      );
    } else {
      formBooking.pickupSurcharge = 0;
    }
    updateSelectedSeatsUI();
    formBooking.pickupPoint = null;
  } else {
    formBooking.pickupPoint = dataPoint;
    if (surcharge_type == 2) {
      formBooking.pickupSurcharge = jQuery(element).attr(
        "data-final-surcharge",
      );
    } else {
      formBooking.pickupSurcharge = 0;
    }
    updateSelectedSeatsUI();
    formBooking.transferPickupPoint = null;
  }

  if (formBooking.partnerId === "goopay") {
    filterDropOffForGoopay(dataPoint);
  }

  let element_id = jQuery(element).attr("id");

  jQuery(".pickup-point-more-desc").hide();
  jQuery(".pickup-point-more-desc")
    .find('input[type="text"]')
    .attr("disabled", "disabled");

  jQuery(element)
    .closest(".item-list-point")
    .find(".pickup-point-more-desc")
    .show();
  jQuery(element)
    .closest(".item-list-point")
    .find(".pickup-point-more-desc")
    .find('input[type="text"]')
    .removeAttr("disabled");
}

function handleChangeDropOff(element) {
  const pointData = atob(element.getAttribute("data-point"));
  const dataPoint = JSON.parse(pointData);
  const point_type = jQuery(element).attr("data-point-type");
  const surcharge_type = jQuery(element).attr("data-surcharge-type");

  if (point_type == "dropoff-transfer-point") {
    formBooking.transferDropoffPoint = dataPoint;
    if (surcharge_type == 2) {
      formBooking.dropoffSurcharge = jQuery(element).attr(
        "data-final-surcharge",
      );
    } else {
      formBooking.dropoffSurcharge = 0;
    }

    updateSelectedSeatsUI();
    formBooking.dropoffPoint = null;
  } else {
    formBooking.dropoffPoint = dataPoint;

    if (surcharge_type == 2) {
      formBooking.dropoffSurcharge = jQuery(element).attr(
        "data-final-surcharge",
      );
    } else {
      formBooking.dropoffSurcharge = 0;
    }

    updateSelectedSeatsUI();
    formBooking.transferDropoffPoint = null;
  }

  let element_id = jQuery(element).attr("id");

  jQuery(".dropoff-point-more-desc").hide();
  jQuery(".dropoff-point-more-desc")
    .find('input[type="text"]')
    .attr("disabled", "disabled");

  jQuery(element)
    .closest(".item-list-point")
    .find(".dropoff-point-more-desc")
    .show();
  jQuery(element)
    .closest(".item-list-point")
    .find(".dropoff-point-more-desc")
    .find('input[type="text"]')
    .removeAttr("disabled");
}

function parseRealTime(val) {
  if (!val || typeof val !== "string") return null;
  var parts = val.split(" ");
  if (parts.length < 2) return null;
  var t = parts[0].split(":");
  var d = parts[1].split("-");
  if (t.length < 2 || d.length < 3) return null;
  var hh = ("0" + parseInt(t[0], 10)).slice(-2);
  var mm = ("0" + parseInt(t[1], 10)).slice(-2);
  var DD = ("0" + parseInt(d[0], 10)).slice(-2);
  var MM = ("0" + parseInt(d[1], 10)).slice(-2);
  var YYYY = d[2];
  var iso = YYYY + "-" + MM + "-" + DD + "T" + hh + ":" + mm + ":00";
  var ts = Date.parse(iso);
  if (isNaN(ts)) return null;
  return ts;
}

function filterDropOffForGoopay(selectedPickupPoint) {
  function getNumericTime(obj) {
    if (!obj) return null;
    var d = obj.duration;
    if (d !== undefined && d !== null) {
      var num = Number(d);
      if (!isNaN(num)) return num;
    }
    var rt = parseRealTime(obj.real_time || obj.realTime);
    return rt === null ? null : rt;
  }

  var pickupTime = getNumericTime(selectedPickupPoint);
  var $items = jQuery("#list-dropoff-point .item-list-point");
  var endItem = null;
  var maxTs = -Infinity;

  $items.each(function () {
    var $input = jQuery(this).find('input[type="radio"]');
    var b64 = $input.attr("data-point");
    var obj = null;
    try {
      obj = JSON.parse(atob(b64));
    } catch (e) {}
    var ts = getNumericTime(obj);
    if (ts !== null && ts > maxTs) {
      maxTs = ts;
      endItem = jQuery(this);
    }
    if (pickupTime !== null && ts !== null) {
      if (ts > pickupTime) {
        jQuery(this).show();
      } else {
        jQuery(this).hide();
        if ($input.is(":checked")) $input.prop("checked", false);
      }
    } else {
      jQuery(this).show();
    }
  });

  if (endItem && endItem.length) {
    endItem.show();
  }

  var hasChecked =
    jQuery("#list-dropoff-point input[type='radio']:checked").length > 0;
  if (hasChecked) {
    // Nếu điểm đang chọn bị ẩn, hủy chọn nhưng KHÔNG tự động chọn điểm khác
    var $checked = jQuery("#list-dropoff-point input[type='radio']:checked");
    var $checkedItem = $checked.closest(".item-list-point");
    if ($checkedItem.is(":hidden")) {
      $checked.prop("checked", false);
    }
  }
}

function sortPointListByTimeAsc(selector) {
  var items = jQuery(selector + " .item-list-point").get();
  items.sort(function (a, b) {
    function extractTime(el) {
      var $input = jQuery(el).find('input[type="radio"]');
      var b64 = $input.attr("data-point");
      var obj = null;
      try {
        obj = JSON.parse(atob(b64));
      } catch (e) {}
      var d = obj && obj.duration;
      if (d !== undefined && d !== null) {
        var num = Number(d);
        if (!isNaN(num)) return num;
      }
      var rt = parseRealTime(obj && (obj.real_time || obj.realTime));
      return rt === null ? Number.POSITIVE_INFINITY : rt;
    }
    var ta = extractTime(a);
    var tb = extractTime(b);
    if (ta === null && tb === null) return 0;
    if (ta === null) return 1;
    if (tb === null) return -1;
    return ta - tb;
  });
  jQuery(selector).append(items);
}

function updateSelectedSeatsUI() {
  const pickupSurcharge =
    formBooking.pickupSurcharge != undefined
      ? Number(formBooking.pickupSurcharge)
      : 0;
  const dropoffSurcharge =
    formBooking.dropoffSurcharge != undefined
      ? Number(formBooking.dropoffSurcharge)
      : 0;
  const seatNames = formBooking.selectedSeats
    .map((seat) => seat.seat_code)
    .join(", ");

  const seatSum = formBooking.selectedSeats.reduce(
    (sum, seat) => sum + Number(seat.fare || 0),
    0,
  );
  const totalPrice = seatSum + pickupSurcharge + dropoffSurcharge;

  formBooking.subtotalSeats = seatSum;
  formBooking.subtotal = totalPrice;

  let htmlSeatsContent = "";
  let htmlTotalContent = "";

  if (formBooking.selectedSeats.length > 0) {
    htmlSeatsContent = `Ghế: <div class="footer-seat">${seatNames}</div>`;
    htmlTotalContent = `Tổng cộng: <div class="footer-total">${totalPrice.toLocaleString(
      "vi",
      "Vi",
    )}đ</div>`;
  }

  jQuery(".form-footer-left").html(htmlSeatsContent);
  jQuery(".footer-price-seat").html(htmlTotalContent);
}

const validateEmail = (email) => {
  if (email.length > 0) {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
  } else {
    return true;
  }
};

function phoneNumber(phone) {
  var phoneno = /^\d{10}$/;

  return phone.match(phoneno);
}

function handleSeatClose() {
  jQuery(".online-booking-page__provider-list__seats-info").empty();
  jQuery(".online-booking-page__provider-list__item__price-btn").removeClass(
    "btn-close",
  );
  jQuery(".online-booking-page__provider-list__item__price-btn").text(
    "Chọn chuyến",
  );
  jQuery(".online-booking-page__provider-list__details-tab").removeClass(
    "active",
  );
  jQuery(".online-booking-page__provider-list__details-tab").hide();
  jQuery(".online-booking-page__provider-list__item__details-btn").removeClass(
    "active",
  );
  seatsList = [];

  formBooking = {
    seatsAndInfoData: null,
    partnerId: "",
    tripId: "",
    bookingId: "",
    wayId: "",
    selectedSeats: [],
    pickupPoint: null,
    dropoffPoint: null,
    transferPickupPoint: null,
    transferDropoffPoint: null,
    pickupSurcharge: null,
    dropoffSurcharge: null,
    pickupPointMoreDesc: null,
    dropoffPointMoreDesc: null,
    routeName: "",
    subtotal: 0,
    subtotalSeats: 0,
    customer: {
      name: "",
      phone: "",
      email: "",
      customer_id_number: "",
    },
    note: "",
  };
}

function helperGetDetailArea(pointId, data) {
  return data.find((item) => item.pointId == pointId);
}

function getFullAddress(areaDetail, address) {
  const wardName = areaDetail.ward_name ? `${areaDetail.ward_name}, ` : "";
  const cityName = areaDetail.city_name ? `${areaDetail.city_name}, ` : "";
  const stateName = areaDetail.state_name ? areaDetail.state_name : "";
  const addrressTemp = address ? `${address}, ` : "";
  return `${addrressTemp}${wardName}${cityName}${stateName}`;
}

function convertDateTime(dateTimeStr) {
  const [time, date] = dateTimeStr.split(" ");
  const [day, month, year] = date.split("-");
  const dateObj = new Date(`${year}-${month}-${day}T${time}:00`);
  const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const dayOfWeek = daysOfWeek[dateObj.getDay()];

  // Định dạng ngày tháng năm
  const formattedDate = `${dayOfWeek}, ${day}/${month}/${year}`;

  return formattedDate;
}

function coppyText(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, 99999);
  document.execCommand("copy");
  document.body.removeChild(textarea);

  jQuery.notify("Đã sao chép", { position: "right", className: "success" });
}

function getVerifiedFare(memberCount, seatGroups) {
  if (seatGroups.length > 0) {
    return seatGroups[memberCount].fare;
  }

  return;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(value)
    .replace("₫", "đ");
}
