var url = new URL(window.location.href);
// console.log(url.search);
//?from=24&nameFrom=H%C3%A0+N%E1%BB%99i&nameTo=H%E1%BA%A3i+Ph%C3%B2ng&to=27&departDate=08-08-2025&returnDateTemp=07-08-2025
// var partsArray = url.pathname.split('-');
// var countUrlHTML = url.pathname.split('.').length;
// var lastPart = partsArray[partsArray.length - 1];
// var groupLast = lastPart.split('.')[0];
// var fromTo = groupLast.split('t');

var fromId = url.searchParams.get("from");
var toId = url.searchParams.get("to");
var nameFrom = decodeURIComponent(url.searchParams.get("nameFrom") || "");
var nameTo = decodeURIComponent(url.searchParams.get("nameTo") || "");
var departDate = url.searchParams.get("date");
var returnDateTemp = url.searchParams.get("returnDateTemp");

var date = "";

if (
  url.searchParams.get("date") != undefined ||
  url.searchParams.get("date") != null
) {
  let [d, m, y] = url.searchParams.get("date").split("-");
  date = `${d}-${m}-${y}`;
}

jQuery(document).ready(function ($) {
  $("#btn").on("click", function () {
    var fromValue = $("input[name=from]").val() || fromId;
    var toValue = $("input[name=to]").val() || toId;
    var f = document.getElementById("from").value;
    var t = document.getElementById("to").value;

    // Hoán đổi giá trị
    $("#to").val(fromValue);
    $("#from").val(toValue);
    $("#inputFrom").val($("#nameTo").val());
    $("#inputTo").val($("#nameFrom").val());
  });
});
var dateToday = new Date();
// jQuery(document).ready(function ($) {
//     $('#datepicker')
//         .datepicker({
//             dateFormat: 'dd-mm-yy',
//             showOtherMonths: true,
//             selectOtherMonths: true,
//             minDate: dateToday
//         })
//         .datepicker('setDate', date ? date : 1);
// });

jQuery(document).ready(function ($) {
  if (!$("body").hasClass("page-template-collab-request-list")) {
    if ($("#datepicker").length > 0) {
      jQuery.ctcCalendar({
        calendarCount: window.innerWidth > 768 ? 2 : 1,
        inputType: "text",
        dateFormat: "d-m-Y",
        calendarSize: "large",
        dateSelector: "#datepicker",
        language: "vi",
        startWeekOnMonday: true,
        defaultDate: date
          ? new Date(date.split("-").reverse().join("/"))
          : new Date(new Date().setDate(new Date().getDate() + 1)),
        showLunarDate: true,
        calendarDisplay: window.innerWidth > 768 ? "inline" : "modal",
        // monthSelector:"#three-double-month",
        // theme: 'orange'
        // expanderSelector: "#datepicker"
      });
    }

    if ($("#datepickerReturn").length > 0) {
      $("#datepickerReturn").agjCalendar({
        calendarCount: window.innerWidth > 768 ? 2 : 1,
        inputType: "text",
        dateFormat: "d-m-Y",
        calendarSize: "large",
        language: "vi",
        startWeekOnMonday: true,
        showLunarDate: true,
        defaultDate: date
          ? new Date(date.split("-").reverse().join("/"))
          : new Date(new Date().setDate(new Date().getDate() + 1)),
        calendarDisplay: window.innerWidth > 768 ? "inline" : "modal",
      });
    }
  }

  $(".add-return").click(function () {
    $("#add-return-date .add-return").addClass("hidden");
    $("#add-return-date .date-return").removeClass("hidden");
    $("#datepickerReturn").attr("name", "returnDate");
  });

  $(".close-add-return").click(function () {
    $("#datepickerReturn").val("");
    $("#add-return-date .add-return").removeClass("hidden");
    $("#add-return-date .date-return").addClass("hidden");
    $("#datepickerReturn").attr("name", "returnDateTemp");
  });
});

// const data = [];

// async function fetchData() {
//   try {
//     const response = await fetch('');

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const jsonData = await response.json();

//     jsonData?.data.forEach(item => {
//       data.push({
//         id: item.newKey,
//         area_id: item.StateId,
//         name: item.label,
//         name_filter: normalizeUnicode(item.value).toLowerCase(),
//         category: item.Category,
//         name_nospace: normalizeUnicode(item.value).replace(/\s+/g, '').toLowerCase()
//       });
//     });

//     // Log the fetched and mapped data for debugging
//     console.log("Fetched data:", data);

//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// }

// fetchData().then(() => {
//   console.log("Fetched data:", data);
// });

function changeValue() {
  var url = new URL(window.location.href);
  var from = document.getElementById("inputFrom");
  var to = document.getElementById("inputTo");
  var froms = document.getElementById("inputFrom").value;
  var tos = document.getElementById("inputTo").value;
  from.value = froms === froms ? tos : froms;
  to.value = tos === tos ? froms : tos;
}

function normalizeKey(text) {
  return normalizeUnicode(text || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function normalizeKeyNoSpace(text) {
  return normalizeUnicode(text || "")
    .replace(/\s+/g, "")
    .trim()
    .toLowerCase();
}

const P1 = 1;
const P2 = 1000;
const P3 = 2000;
const P4 = 3000;
const P5 = 4000;
const P6 = 5000;

function indexLevel1(
  nameOrigin,
  nameNormalize,
  txtOrigin,
  txtNormalize,
  nextCharCode,
) {
  const index1 = nameOrigin.indexOf(txtOrigin);
  const index2 = nameNormalize.indexOf(txtNormalize);

  if (index2 === 0) {
    if (index1 === 0) {
      return P1;
    }
    return P2 + nextCharCode;
  } else if (index2 > 0) {
    return P5 + nextCharCode;
  }
  return P6;
}

function indexLevel2(
  nameOrigin,
  nameNormalize,
  txtOrigin,
  txtNormalize,
  nextCharCode,
) {
  const index1 = nameOrigin.indexOf(txtOrigin);
  const index2 = nameNormalize.indexOf(txtNormalize);

  if (index2 === 0) {
    if (index1 === 0) {
      return P3;
    }
    return P4 + nextCharCode;
  } else if (index2 > 0) {
    return P5 + nextCharCode;
  }
  return P6;
}

function getNextCharCode(name, valNormalize) {
  const len = name.length;
  const index = name.indexOf(valNormalize);
  const next = index + valNormalize.length;

  if (index >= 0 && next < len) {
    return next + name.charCodeAt(next);
  }
  return 0;
}

function indexOf(obj, txtOrigin, txtNormalize) {
  const origin = obj.name; // có dấu
  const normalize = obj.name_filter; // không dấu (từ API)
  const arr1 = origin.split(" ");
  const arr2 = normalize.split(" ");

  const nextCharCode = getNextCharCode(normalize, txtNormalize);

  const l = Math.min(arr1.length, arr2.length);
  let rs = P6;

  for (let i = 0; i < l; i += 1) {
    const nameOrigin = arr1[i];
    const nameNormalize = arr2[i];

    const nameOriginNormalize = normalizeUnicode(nameOrigin);

    if (i === 0) {
      rs = indexLevel1(
        nameOriginNormalize,
        nameNormalize,
        txtNormalize,
        txtNormalize,
        nextCharCode,
      );
    } else if (rs === P6) {
      rs = indexLevel2(
        nameOriginNormalize,
        nameNormalize,
        txtNormalize,
        txtNormalize,
        nextCharCode,
      );
    }
  }
  return rs;
}

function removeVietnameseSign(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  return str;
}
function normalizeUnicode(text) {
  let str = text;
  if (str && str !== "") {
    str = str.trim();
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
  }
  return "";
}

function compare(a, b) {
  if (a.index < b.index) {
    return -1;
  }
  if (a.index > b.index) {
    return 1;
  }
  return 0;
}
function sortPlaces(arr, txtOrigin, txtNormalize) {
  const l = arr.length;
  const res = [];

  for (let i = 0; i < l; i += 1) {
    const obj = arr[i];
    const index = indexOf(obj, txtOrigin, txtNormalize);
    obj.index = index;
    res[i] = obj;
  }
  res.sort(compare);
  return res;
}

function searchAreas(textSearch, Data) {
  const q = normalizeKey(textSearch);
  const qNoSpace = normalizeKeyNoSpace(textSearch);

  const result = Data.filter((item) => {
    const name = (item.name || "").toLowerCase();
    const nf = (item.name_filter || "").toLowerCase();
    const nn = (item.name_nospace || "").toLowerCase();

    if (name.includes((textSearch || "").toLowerCase())) return true;
    if (nf.includes(q)) return true;
    if (nn.includes(qNoSpace)) return true;

    return false;
  });

  let CITY = sortPlaces(
    result.filter((i) => i.category === "Tỉnh - Thành Phố"),
    q,
    q,
  );
  let WARD = sortPlaces(
    result.filter((i) => i.category === "Quận - Huyện"),
    q,
    q,
  );
  let BUS_STATION = sortPlaces(
    result.filter((i) => i.category === "Bến xe"),
    q,
    q,
  );
  let DISTRICT = sortPlaces(
    result.filter((i) => i.category === "Phường - Xã"),
    q,
    q,
  );
  let POPULAR = sortPlaces(
    result.filter((i) => i.category === "Điểm dừng phổ biến"),
    q,
    q,
  );
  let AIRPORT = sortPlaces(
    result.filter((i) => i.category === "Sân Bay"),
    q,
    q,
  );

  return { CITY, WARD, BUS_STATION, DISTRICT, POPULAR, AIRPORT };
}

function click(elmnt) {
  console.log("elmnt", elmnt);
}
function autocompleteFrom(
  inp,
  arr,
  noteText = '<span style="color: red;">*</span> Lưu ý: Sử dụng tên địa phương trước sáp nhập',
) {
  let currentFocus;
  let valueInputFrom;
  let valueInputFromId;
  let valueInputTo;
  let valueInputToId;

  function makeNoteDiv(text) {
    const note = document.createElement("DIV");
    note.className = "autocomplete-note";
    note.style.fontSize = "11px";
    note.style.lineHeight = "1.3";
    note.style.background =
      "linear-gradient(90deg, rgb(255, 247, 219) 0%, rgb(255, 255, 255) 100%)";
    note.style.borderBottom = "1px solid #eee";
    note.style.padding = "10px";
    note.innerHTML = text;
    return note;
  }

  const infoEl = document.getElementById("Info");

  if (!fromId && !toId) {
    infoEl.style.display = "none";
  } else if (jQuery("#Info").length > 0) {
    infoEl.style.display = "block";
  }

  if (fromId && toId) {
    arr
      .filter((item) => item.id == fromId)
      .map((item) => (valueInputFrom = item.name));
    document.getElementById("inputFrom").value = valueInputFrom;
    document.getElementById("fromName").innerHTML = valueInputFrom;
    document.getElementById("nameFrom").value = valueInputFrom;
    document.getElementById("datepicker").innerHTML = date;
  }
  if (toId && fromId) {
    arr
      .filter((item) => item.id == toId)
      .map((item) => (valueInputTo = item.name));
    document.getElementById("inputTo").value = valueInputTo;
    document.getElementById("toName").innerHTML = valueInputTo;
    document.getElementById("nameTo").value = valueInputTo;
  }
  if (url.searchParams.get("date")) {
    document.getElementById("datepicker").innerHTML = date;
  }
  // Show list items when focus
  inp.addEventListener("focus", function (e) {
    let i, b, city, c, s, p, d, w, buses;

    currentFocus = 0;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items-from");
    a.style.width = "100%";
    a.style.overflowY = "auto";
    a.style.maxHeight = "40vh";
    this.parentNode.appendChild(a);
    // >>> THÊM GHI CHÚ TRƯỚC DANH SÁCH <<<
    if (noteText) a.appendChild(makeNoteDiv(noteText));

    let cities = [];
    let districts = [];
    let bus = [];
    let ward = [];
    let popular = [];
    let airport = [];

    const result = searchAreas("", arr);
    cities = result.CITY;
    districts = result.DISTRICT;
    bus = result.BUS_STATION;
    ward = result.WARD;
    popular = result.POPULAR;
    airport = result.AIRPORT;
    b = document.createElement("DIV");
    c = document.createElement("DIV");
    d = document.createElement("DIV");
    w = document.createElement("DIV");
    s = document.createElement("DIV");
    p = document.createElement("DIV");
    buses = document.createElement("DIV");
    if (cities.length > 0) {
      for (i = 0; i < cities.length; i++) {
        c += ` <div name="from" 
            onclick="document.getElementById('from').value = '${cities[i].id}'; document.getElementById('nameFrom').value = '${cities[i].name}'">
            ${cities[i].name} ${cities[i].legacy == true ? '<span class="legacy">cũ</span>' : ""}
        </div>`;
      }
      c = c.replace("[object HTMLDivElement]", "");
    } else {
      c = "";
    }
    if (districts.length > 0) {
      for (i = 0; i < districts.length; i++) {
        d += `<div name="from" 
            onclick="document.getElementById('from').value = '${districts[i].id}'; document.getElementById('nameFrom').value = '${districts[i].name}'">
            ${districts[i].name} ${districts[i].legacy == true ? '<span class="legacy">cũ</span>' : ""}
        </div>`;
      }
      d = d.replace("[object HTMLDivElement]", "");
    } else {
      d = "";
    }
    if (bus.length > 0) {
      for (i = 0; i < bus.length; i++) {
        buses += `  <div name="from" 
            onclick="document.getElementById('from').value = '${bus[i].id}'; document.getElementById('nameFrom').value = '${bus[i].name}'">
            ${bus[i].name}
        </div>`;
      }
      buses = buses.replace("[object HTMLDivElement]", "");
    } else {
      buses = "";
    }
    if (ward.length > 0) {
      for (i = 0; i < ward.length; i++) {
        w += `<div name="from" 
            onclick="document.getElementById('from').value = '${ward[i].id}'; document.getElementById('nameFrom').value = '${ward[i].name}'">
            ${ward[i].name} ${ward[i].legacy == true ? '<span class="legacy">cũ</span>' : ""}
        </div>`;
      }
      w = w.replace("[object HTMLDivElement]", "");
    } else {
      w = "";
    }
    if (airport.length > 0) {
      for (i = 0; i < airport.length; i++) {
        s += `<div name="from" 
            onclick="document.getElementById('from').value = '${airport[i].id}'; document.getElementById('nameFrom').value = '${airport[i].name}'">
            ${airport[i].name}
        </div>`;
      }
      s = s.replace("[object HTMLDivElement]", "");
    } else {
      s = "";
    }
    if (popular.length > 0) {
      for (i = 0; i < popular.length; i++) {
        p += `<div name="from" 
            onclick="document.getElementById('from').value = '${popular[i].id}'; document.getElementById('nameFrom').value = '${popular[i].name}'">
            ${popular[i].name} ${popular[i].legacy == true ? '<span class="legacy">cũ</span>' : ""}
        </div>`;
      }
      p = p.replace("[object HTMLDivElement]", "");
    } else {
      p = "";
    }
    b.innerHTML = `
      ${cities.length > 0 ? '<h4 class="b ph2 "> Tỉnh - Thành Phố </h4>' : ""}${c}
      ${districts.length > 0 ? '<h4 class="b ph2 "> Phường - Xã </h4>' : ""}${d}
      ${ward.length > 0 ? '<h4 class="b ph2 "> Quận - Huyện </h4>' : ""}${w}
      ${bus.length > 0 ? '<h4 class="b ph2 "> Bến xe </h4>' : ""}${buses}
      ${airport.length > 0 ? '<h4 class="b ph2 "> Sân bay </h4>' : ""}${s}
      ${popular.length > 0 ? '<h4 class="b ph2 "> Điểm dừng phổ biến </h4>' : ""}${p}
      `;
    b.addEventListener("click", function (e) {
      inp.value = document.getElementById("nameFrom").value;
      closeAllLists();
    });
    a.appendChild(b);
    if (inp.value) {
      let x = document.getElementById(a.id);
      if (x) {
        x = x.getElementsByTagName("div");
        for (let i = 0; i < x.length; i++) {
          if (x[i].innerText == inp.value) {
            x[i].classList.add("autocomplete-active");
            a.scrollTop = x[i].offsetTop;
            currentFocus = i;
          }
        }
      }
    }
  });

  //Suggest when typing
  inp.addEventListener("input", function (e) {
    var a,
      b,
      c,
      d,
      w,
      s,
      p,
      buses,
      city,
      citiesFiltered = [],
      districtsFiltered = [],
      busStationFiltered = [],
      wardFiltered = [],
      i,
      val = this.value;

    closeAllLists();
    currentFocus = 0;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items-from");
    a.style.width = "100%";
    a.style.overflowY = "auto";
    a.style.maxHeight = "40vh";
    this.parentNode.appendChild(a);

    // >>> THÊM GHI CHÚ TRƯỚC DANH SÁCH <<<
    if (noteText) a.appendChild(makeNoteDiv(noteText));

    let state = true;
    let cities = [];
    let districts = [];
    let bus = [];
    let ward = [];
    let popular = [];
    let airport = [];
    const result = searchAreas(val, arr);
    cities = result.CITY;
    districts = result.DISTRICT;
    bus = result.BUS_STATION;
    ward = result.WARD;
    popular = result.POPULAR;
    airport = result.AIRPORT;
    b = document.createElement("DIV");
    c = document.createElement("DIV");
    d = document.createElement("DIV");
    w = document.createElement("DIV");
    s = document.createElement("DIV");
    p = document.createElement("DIV");
    buses = document.createElement("DIV");
    if (cities.length > 0) {
      for (i = 0; i < cities.length; i++) {
        c += ` <div name="from" 
            onclick="document.getElementById('from').value = '${cities[i].id}'; document.getElementById('nameFrom').value = '${cities[i].name}'">
            ${cities[i].name} ${cities[i].legacy == true ? '<span class="legacy">cũ</span>' : ""}
        </div>`;
      }
      c = c.replace("[object HTMLDivElement]", "");
    } else {
      c = "";
    }
    if (districts.length > 0) {
      for (i = 0; i < districts.length; i++) {
        d += `<div name="from" 
            onclick="document.getElementById('from').value = '${districts[i].id}'; document.getElementById('nameFrom').value = '${districts[i].name}'">
            ${districts[i].name} ${districts[i].legacy == true ? '<span class="legacy">cũ</span>' : ""}
        </div>`;
      }
      d = d.replace("[object HTMLDivElement]", "");
    } else {
      d = "";
    }
    if (bus.length > 0) {
      for (i = 0; i < bus.length; i++) {
        buses += `  <div name="from" 
            onclick="document.getElementById('from').value = '${bus[i].id}'; document.getElementById('nameFrom').value = '${bus[i].name}'">
            ${bus[i].name} ${bus[i].legacy == true ? '<span class="legacy">cũ</span>' : ""}
        </div>`;
      }
      buses = buses.replace("[object HTMLDivElement]", "");
    } else {
      buses = "";
    }
    if (ward.length > 0) {
      for (i = 0; i < ward.length; i++) {
        w += `<div name="from" 
            onclick="document.getElementById('from').value = '${ward[i].id}'; document.getElementById('nameFrom').value = '${ward[i].name}'">
            ${ward[i].name} ${ward[i].legacy == true ? '<span class="legacy">cũ</span>' : ""}
        </div>`;
      }
      w = w.replace("[object HTMLDivElement]", "");
    } else {
      w = "";
    }
    if (airport.length > 0) {
      for (i = 0; i < airport.length; i++) {
        s += `<div name="from" 
            onclick="document.getElementById('from').value = '${airport[i].id}'; document.getElementById('nameFrom').value = '${airport[i].name}'">
            ${airport[i].name} ${airport[i].legacy == true ? '<span class="legacy">cũ</span>' : ""}
        </div>`;
      }
      s = s.replace("[object HTMLDivElement]", "");
    } else {
      s = "";
    }
    if (popular.length > 0) {
      for (i = 0; i < popular.length; i++) {
        p += `<div name="from" 
            onclick="document.getElementById('from').value = '${popular[i].id}'; document.getElementById('nameFrom').value = '${popular[i].name}'">
            ${popular[i].name} ${popular[i].legacy == true ? '<span class="legacy">cũ</span>' : ""}
        </div>`;
      }
      p = p.replace("[object HTMLDivElement]", "");
    } else {
      p = "";
    }
    b.innerHTML = `
      ${cities.length > 0 ? '<h4 class="b ph2 "> Tỉnh - Thành Phố </h4>' : ""}${c}
      ${districts.length > 0 ? '<h4 class="b ph2 "> Phường - Xã </h4>' : ""}${d}
      ${ward.length > 0 ? '<h4 class="b ph2 "> Quận - Huyện </h4>' : ""}${w}
      ${bus.length > 0 ? '<h4 class="b ph2 "> Bến xe </h4>' : ""}${buses}
      ${airport.length > 0 ? '<h4 class="b ph2 "> Sân bay </h4>' : ""}${s}
      ${popular.length > 0 ? '<h4 class="b ph2 "> Điểm dừng phổ biến </h4>' : ""}${p}
      `;
    b.addEventListener("click", function (e) {
      inp.value = document.getElementById("nameFrom").value;
      closeAllLists();
    });
    a.appendChild(b);
    if (inp.value) {
      let x = document.getElementById(a.id);
      if (x) {
        x = x.getElementsByTagName("div");
        for (let i = 0; i < x.length; i++) {
          if (x[i].innerText == inp.value) {
            x[i].classList.add("autocomplete-active");
            a.scrollTop = x[i].offsetTop;
            currentFocus = i;
          }
        }
      }
    }
  });
  // inp.addEventListener('blur', function (e) {
  //   var x = document.getElementById(this.id + 'autocomplete-list');
  //   if (x) x = x.getElementsByTagName('div');
  //   if (inp.value.length > 0) {
  //     x[1].click()
  //   }
  // });
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) {
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      x[1].click();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    } else if (e.keyCode == 9) {
      console.log("log  x[1]", x[1]);
      console.log("log  x", x);
      e.preventDefault();
      x[1].click();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });

  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
    x[currentFocus].scrollIntoView(false);
  }

  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items-from");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

function autocompleteTo(
  inp,
  arr,
  cities,
  noteText = '<span style="color: red;">*</span> Lưu ý: Sử dụng tên địa phương trước sáp nhập',
) {
  let currentFocus;

  function makeNoteDiv(text) {
    const note = document.createElement("DIV");
    note.className = "autocomplete-note";
    note.style.fontSize = "11px";
    note.style.lineHeight = "1.3";
    note.style.background =
      "linear-gradient(90deg, rgb(255, 247, 219) 0%, rgb(255, 255, 255) 100%)";
    note.style.borderBottom = "1px solid #eee";
    note.style.padding = "10px";
    note.innerHTML = text;
    return note;
  }

  // Show list items when focus
  inp.addEventListener("focus", function (e) {
    let i, b, city, c, s, p, d, w, buses;

    currentFocus = 0;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items-to");
    a.style.width = "100%";
    a.style.overflowY = "auto";
    a.style.maxHeight = "40vh";
    this.parentNode.appendChild(a);
    // >>> THÊM GHI CHÚ TRƯỚC DANH SÁCH <<<
    if (noteText) a.appendChild(makeNoteDiv(noteText));

    let cities = [];
    let districts = [];
    let bus = [];
    let ward = [];
    let popular = [];
    let airport = [];
    const result = searchAreas("", arr);
    cities = result.CITY;
    districts = result.DISTRICT;
    bus = result.BUS_STATION;
    ward = result.WARD;
    popular = result.POPULAR;
    airport = result.AIRPORT;
    b = document.createElement("DIV");
    c = document.createElement("DIV");
    d = document.createElement("DIV");
    w = document.createElement("DIV");
    s = document.createElement("DIV");
    p = document.createElement("DIV");
    buses = document.createElement("DIV");
    if (cities.length > 0) {
      for (i = 0; i < cities.length; i++) {
        c += ` <div name="to" 
            onclick="document.getElementById('to').value = '${cities[i].id}'; document.getElementById('nameTo').value = '${cities[i].name}'">
            ${cities[i].name} ${cities[i].legacy == true ? '<span class="legacy">cũ</span>' : ""}
        </div>`;
      }
      c = c.replace("[object HTMLDivElement]", "");
    } else {
      c = "";
    }
    if (districts.length > 0) {
      for (i = 0; i < districts.length; i++) {
        d += `<div name="to" 
            onclick="document.getElementById('to').value = '${districts[i].id}'; document.getElementById('nameTo').value = '${districts[i].name}'">
            ${districts[i].name} ${districts[i].legacy == true ? '<span class="legacy">cũ</span>' : ""}
        </div>`;
      }
      d = d.replace("[object HTMLDivElement]", "");
    } else {
      d = "";
    }
    if (bus.length > 0) {
      for (i = 0; i < bus.length; i++) {
        buses += `  <div name="to" 
            onclick="document.getElementById('to').value = '${bus[i].id}'; document.getElementById('nameTo').value = '${bus[i].name}'">
            ${bus[i].name} ${bus[i].legacy == true ? '<span class="legacy">cũ</span>' : ""}
        </div>`;
      }
      buses = buses.replace("[object HTMLDivElement]", "");
    } else {
      buses = "";
    }
    if (ward.length > 0) {
      for (i = 0; i < ward.length; i++) {
        w += `<div name="to" 
            onclick="document.getElementById('to').value = '${ward[i].id}'; document.getElementById('nameTo').value = '${ward[i].name}'">
            ${ward[i].name} ${ward[i].legacy == true ? '<span class="legacy">cũ</span>' : ""}
        </div>`;
      }
      w = w.replace("[object HTMLDivElement]", "");
    } else {
      w = "";
    }
    if (airport.length > 0) {
      for (i = 0; i < airport.length; i++) {
        s += `<div name="to" 
            onclick="document.getElementById('to').value = '${airport[i].id}'; document.getElementById('nameTo').value = '${airport[i].name}'">
            ${airport[i].name} ${airport[i].legacy == true ? '<span class="legacy">cũ</span>' : ""}
        </div>`;
      }
      s = s.replace("[object HTMLDivElement]", "");
    } else {
      s = "";
    }
    if (popular.length > 0) {
      for (i = 0; i < popular.length; i++) {
        p += `<div name="to" 
            onclick="document.getElementById('to').value = '${popular[i].id}'; document.getElementById('nameTo').value = '${popular[i].name}'">
            ${popular[i].name} ${popular[i].legacy == true ? '<span class="legacy">cũ</span>' : ""}
        </div>`;
      }
      p = p.replace("[object HTMLDivElement]", "");
    } else {
      p = "";
    }
    b.innerHTML = `
      ${cities.length > 0 ? '<h4 class="b ph2 "> Tỉnh - Thành Phố </h4>' : ""}${c}
      ${districts.length > 0 ? '<h4 class="b ph2 "> Phường - Xã </h4>' : ""}${d}
      ${ward.length > 0 ? '<h4 class="b ph2 "> Quận - Huyện </h4>' : ""}${w}
      ${bus.length > 0 ? '<h4 class="b ph2 "> Bến Xe </h4>' : ""}${buses}
      ${airport.length > 0 ? '<h4 class="b ph2 "> Sân bay </h4>' : ""}${s}
      ${popular.length > 0 ? '<h4 class="b ph2 "> Điểm dừng phổ biến </h4>' : ""}${p}
      `;
    b.addEventListener("click", function (e) {
      inp.value = document.getElementById("nameTo").value;
      closeAllLists();
    });
    a.appendChild(b);
    if (inp.value) {
      let x = document.getElementById(a.id);
      if (x) {
        x = x.getElementsByTagName("div");
        for (let i = 0; i < x.length; i++) {
          if (x[i].innerText == inp.value) {
            x[i].classList.add("autocomplete-active");
            a.scrollTop = x[i].offsetTop;
            currentFocus = i;
          }
        }
      }
    }
  });
  // inp.addEventListener('blur', function (e) {
  //   var x = document.getElementById(this.id + 'autocomplete-list');
  //   if (x) x = x.getElementsByTagName('div');
  //   if (inp.value.length > 0) {
  //     x[1].click()
  //   }
  // });
  //Suggest when typing
  inp.addEventListener("input", function (e) {
    var a,
      b,
      c,
      d,
      w,
      s,
      p,
      buses,
      city,
      citiesFiltered = [],
      districtsFiltered = [],
      busStationFiltered = [],
      wardFiltered = [],
      i,
      val = this.value;

    closeAllLists();
    currentFocus = 0;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items-to");
    a.style.width = "100%";
    a.style.overflowY = "auto";
    a.style.maxHeight = "40vh";
    this.parentNode.appendChild(a);
    // >>> THÊM GHI CHÚ TRƯỚC DANH SÁCH <<<
    if (noteText) a.appendChild(makeNoteDiv(noteText));
    let state = true;
    let cities = [];
    let districts = [];
    let bus = [];
    let ward = [];
    let popular = [];
    let airport = [];
    const result = searchAreas(val, arr);
    cities = result.CITY;
    districts = result.DISTRICT;
    bus = result.BUS_STATION;
    ward = result.WARD;
    popular = result.POPULAR;
    airport = result.AIRPORT;

    // console.log(airport);

    b = document.createElement("DIV");
    c = document.createElement("DIV");
    d = document.createElement("DIV");
    w = document.createElement("DIV");
    s = document.createElement("DIV");
    p = document.createElement("DIV");
    buses = document.createElement("DIV");
    if (cities.length > 0) {
      for (i = 0; i < cities.length; i++) {
        c += ` <div name="to" 
            onclick="document.getElementById('to').value = '${cities[i].id}'; document.getElementById('nameTo').value = '${cities[i].name}'">
            ${cities[i].name} ${cities[i].legacy == true ? '<span class="legacy">cũ</span>' : ""}
        </div>`;
      }
      c = c.replace("[object HTMLDivElement]", "");
    } else {
      c = "";
    }
    if (districts.length > 0) {
      for (i = 0; i < districts.length; i++) {
        d += `<div name="to" 
            onclick="document.getElementById('to').value = '${districts[i].id}'; document.getElementById('nameTo').value = '${districts[i].name}'">
            ${districts[i].name} ${districts[i].legacy == true ? '<span class="legacy">cũ</span>' : ""}
        </div>`;
      }
      d = d.replace("[object HTMLDivElement]", "");
    } else {
      d = "";
    }
    if (bus.length > 0) {
      for (i = 0; i < bus.length; i++) {
        buses += `  <div name="to" 
            onclick="document.getElementById('to').value = '${bus[i].id}'; document.getElementById('nameTo').value = '${bus[i].name}'">
            ${bus[i].name} ${bus[i].legacy == true ? '<span class="legacy">cũ</span>' : ""}
        </div>`;
      }
      buses = buses.replace("[object HTMLDivElement]", "");
    } else {
      buses = "";
    }
    if (ward.length > 0) {
      for (i = 0; i < ward.length; i++) {
        w += `<div name="to" 
            onclick="document.getElementById('to').value = '${ward[i].id}'; document.getElementById('nameTo').value = '${ward[i].name}'">
            ${ward[i].name} ${ward[i].legacy == true ? '<span class="legacy">cũ</span>' : ""}
        </div>`;
      }
      w = w.replace("[object HTMLDivElement]", "");
    } else {
      w = "";
    }
    if (airport.length > 0) {
      for (i = 0; i < airport.length; i++) {
        s += `<div name="to" 
            onclick="document.getElementById('to').value = '${airport[i].id}'; document.getElementById('nameTo').value = '${airport[i].name}'">
            ${airport[i].name} ${airport[i].legacy == true ? '<span class="legacy">cũ</span>' : ""}
        </div>`;
      }
      s = s.replace("[object HTMLDivElement]", "");
    } else {
      s = "";
    }
    if (popular.length > 0) {
      for (i = 0; i < popular.length; i++) {
        p += `<div name="to" 
            onclick="document.getElementById('to').value = '${popular[i].id}'; document.getElementById('nameTo').value = '${popular[i].name}'">
            ${popular[i].name} ${popular[i].legacy == true ? '<span class="legacy">cũ</span>' : ""}
        </div>`;
      }
      p = p.replace("[object HTMLDivElement]", "");
    } else {
      p = "";
    }
    b.innerHTML = `
      ${cities.length > 0 ? '<h4 class="b ph2 "> Tỉnh - Thành Phố </h4>' : ""}${c}
      ${districts.length > 0 ? '<h4 class="b ph2 "> Phường - Xã </h4>' : ""}${d}
      ${ward.length > 0 ? '<h4 class="b ph2 "> Quận - Huyện </h4>' : ""}${w}
      ${bus.length > 0 ? '<h4 class="b ph2 "> Bến Xe </h4>' : ""}${buses}
      ${airport.length > 0 ? '<h4 class="b ph2 "> Sân bay </h4>' : ""}${s}
      ${popular.length > 0 ? '<h4 class="b ph2 "> Điểm dừng phổ biến </h4>' : ""}${p}
      `;
    b.addEventListener("click", function (e) {
      inp.value = document.getElementById("nameTo").value;
      closeAllLists();
    });
    a.appendChild(b);
    if (inp.value) {
      let x = document.getElementById(a.id);
      if (x) {
        x = x.getElementsByTagName("div");
        for (let i = 0; i < x.length; i++) {
          if (x[i].innerText == inp.value) {
            x[i].classList.add("autocomplete-active");
            a.scrollTop = x[i].offsetTop;
            currentFocus = i;
          }
        }
      }
    }
  });

  inp.addEventListener("keydown", function (e) {
    // console.log('e', e)
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      x[1].click();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    } else if (e.keyCode == 9) {
      console.log("currentFocus", currentFocus);
      console.log("x[1", x[1]);
      console.log("x", x);
      e.preventDefault();
      x[1].click();
      /*If the TAB key is pressed*/
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });

  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
    x[currentFocus].scrollIntoView(false);
  }

  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items-to");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

document.getElementById("inputTo").value = url.searchParams.get("tn");
document.getElementById("inputFrom").value = url.searchParams.get("fn");
document.getElementById("to").value = toId ? toId : "";
document.getElementById("from").value = fromId ? fromId : "";

const data = [];

async function fetchData() {
  try {
    const apiUrl = "/wp-json/api/v1/state-city-new";
    const response = await fetch(apiUrl, { method: "GET" });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();
    const locations = Array.isArray(jsonData) ? jsonData : jsonData?.data || [];

    const mapByRefId = new Map();

    locations.forEach((item) => {
      const id = String(item?._id);
      const name = item?.name || "";
      const nameWithType = item?.nameWithType || "";
      const normalized = item?.normalizedName || "";
      const level = item?.level || 0;
      let category = "";

      if (level === 1) category = "Tỉnh - Thành Phố";
      else if (level === 2) category = "Quận - Huyện";
      else if (level === 3) category = "Phường - Xã";
      else if (level === 4) category = "Điểm dừng phổ biến";
      else category = "Khác";

      const code = item?.code || "";
      const slug = item?.slug || "";

      const record = {
        id,
        area_id: code,
        name,
        nameWithType,
        name_filter: normalized,
        category,
        name_nospace: normalized.replace(/\s+/g, ""),
        slug,
      };

      if (id && !mapByRefId.has(id)) {
        mapByRefId.set(id, record);
      }
    });

    data.length = 0;
    data.push(...mapByRefId.values());

    autocompleteFrom(document.getElementById("inputFrom"), data);
    autocompleteTo(document.getElementById("inputTo"), data);
  } catch (error) {
    console.error("Error fetching locations:", error);
  }
}

fetchData();
