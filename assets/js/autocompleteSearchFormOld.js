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

var date = ""

if (url.searchParams.get("date") != undefined || url.searchParams.get("date") != null) {
    let [d, m, y] = url.searchParams.get("date").split("-")
    date = `${d}-${m}-${y}`
}

jQuery(document).ready(function ($) {
    $('#btn').on('click', function () {
        var fromValue = $('input[name=from]').val() || fromId;
        var toValue = $('input[name=to]').val() || toId;
        var f = document.getElementById('from').value;
        var t = document.getElementById('to').value;

        // Hoán đổi giá trị
        $('#to').val(fromValue);
        $('#from').val(toValue);
        $('#inputFrom').val($('#nameTo').val());
        $('#inputTo').val($('#nameFrom').val());
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

    if (!$('body').hasClass('page-template-collab-request-list')) {

        if ($('#datepicker').length > 0) {
            jQuery.ctcCalendar({
                calendarCount: window.innerWidth > 768 ? 2 : 1,
                inputType: "text",
                dateFormat: 'd-m-Y',
                calendarSize: 'large',
                dateSelector: "#datepicker",
                language: 'vi',
                startWeekOnMonday: true,
                defaultDate: date ? new Date(date.split('-').reverse().join('/')) : new Date(new Date().setDate(new Date().getDate() + 1)),
                showLunarDate: true,
                calendarDisplay: window.innerWidth > 768 ? 'inline' : 'modal',
                // monthSelector:"#three-double-month",
                // theme: 'orange'
                // expanderSelector: "#datepicker"
            });
        }

        if ($('#datepickerReturn').length > 0) {
            $('#datepickerReturn').agjCalendar({
                calendarCount: window.innerWidth > 768 ? 2 : 1,
                inputType: "text",
                dateFormat: 'd-m-Y',
                calendarSize: 'large',
                language: 'vi',
                startWeekOnMonday: true,
                showLunarDate: true,
                defaultDate: date ? new Date(date.split('-').reverse().join('/')) : new Date(new Date().setDate(new Date().getDate() + 1)),
                calendarDisplay: window.innerWidth > 768 ? 'inline' : 'modal',
            });
        }

    }

    $('.add-return').click(function () {
        $('#add-return-date .add-return').addClass('hidden');
        $('#add-return-date .date-return').removeClass('hidden');
        $('#datepickerReturn').attr('name', 'returnDate');
    });

    $(".close-add-return").click(function () {
        $('#datepickerReturn').val("");
        $('#add-return-date .add-return').removeClass('hidden');
        $('#add-return-date .date-return').addClass('hidden');
        $('#datepickerReturn').attr('name', 'returnDateTemp');
    })
})

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
    var from = document.getElementById('inputFrom');
    var to = document.getElementById('inputTo');
    var froms = document.getElementById('inputFrom').value;
    var tos = document.getElementById('inputTo').value;
    from.value = froms === froms ? tos : froms;
    to.value = tos === tos ? froms : tos;
}

const P1 = 1
const P2 = 1000
const P3 = 2000
const P4 = 3000
const P5 = 4000
const P6 = 5000

function indexLevel1(nameOrigin, nameNormalize, txtOrigin, txtNormalize, nextCharCode) {
    const index1 = nameOrigin.indexOf(txtOrigin)
    const index2 = nameNormalize.indexOf(txtNormalize)

    if (index2 === 0) {
        if (index1 === 0) {
            return P1
        }
        return P2 + nextCharCode
    } else if (index2 > 0) {
        return P5 + nextCharCode
    }
    return P6
}

function indexLevel2(nameOrigin, nameNormalize, txtOrigin, txtNormalize, nextCharCode) {
    const index1 = nameOrigin.indexOf(txtOrigin)
    const index2 = nameNormalize.indexOf(txtNormalize)

    if (index2 === 0) {
        if (index1 === 0) {
            return P3
        }
        return P4 + nextCharCode
    } else if (index2 > 0) {
        return P5 + nextCharCode
    }
    return P6
}

function getNextCharCode(name, val) {
    const len = name.length
    const index = name.indexOf(val)
    const next = index + val.length

    if (next < len) {
        return next + name.charCodeAt(next)
    }
    return 0
}
function removeVietnameseSign(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    return str;
}
function normalizeUnicode(text) {
    let str = text
    if (str && str !== '') {
        str = str.trim()
        str = str.toLowerCase()
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
        str = str.replace(/Đ/g, 'D');
        return str
    }
    return ''
}
function indexOf(obj, txtOrigin, txtNormalize) {
    const origin = obj.name
    const normalize = obj.name_filter
    const arr1 = origin.split(' ')
    const arr2 = normalize.split(' ')
    const nextCharCode = getNextCharCode(normalize, txtOrigin)
    const l = arr1.length
    let rs = P6

    for (let i = 0; i < l; i += 1) {
        const nameOrigin = arr1[i]
        const nameNormalize = arr2[i]

        if (i === 0) {
            rs = indexLevel1(nameOrigin, nameNormalize, txtOrigin, txtNormalize, nextCharCode)
        } else if (rs === P6) {
            rs = indexLevel2(nameOrigin, nameNormalize, txtOrigin, txtNormalize, nextCharCode)
        }
    }
    return rs
}
function compare(a, b) {
    if (a.index < b.index) {
        return -1
    }
    if (a.index > b.index) {
        return 1
    }
    return 0
}
function sortPlaces(arr, txtOrigin, txtNormalize) {
    const l = arr.length
    const res = []

    for (let i = 0; i < l; i += 1) {
        const obj = arr[i]
        const index = indexOf(obj, txtOrigin, txtNormalize)
        obj.index = index
        res[i] = obj
    }
    res.sort(compare)
    return res
}

function searchAreas(textSearch, Data) {
    const result = Data.filter((item) => {
        if (item.name.toUpperCase().indexOf(textSearch.toUpperCase()) !== -1) return true
        if (item.name_filter.toUpperCase().indexOf(normalizeUnicode(textSearch).toUpperCase()) !== -1) return true
        // if (item.name.toUpperCase().indexOf(textSearch.toUpperCase()) !== -1) return true
        const list = item.name_nospace.split(' ').map(i => i.toUpperCase())
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < list.length; i++) {
            if ((list[i] || '').toUpperCase().indexOf(textSearch.toUpperCase()) !== -1) return true
        }

        return false
    })

    // filter by category and get 5 row firts
    let CITY = result.filter(item => item.category === 'Tỉnh - Thành Phố')
    CITY = sortPlaces(CITY, textSearch, normalizeUnicode(textSearch))
    let WARD = result.filter(item => item.category === 'Quận - Huyện')
    WARD = sortPlaces(WARD, textSearch, normalizeUnicode(textSearch))
    let BUS_STATION = result.filter(item => item.category === 'Bến xe')
    BUS_STATION = sortPlaces(BUS_STATION, textSearch, normalizeUnicode(textSearch))
    let DISTRICT = result.filter(item => item.category === 'Phường - Xã')
    DISTRICT = sortPlaces(DISTRICT, textSearch, normalizeUnicode(textSearch))
    let POPULAR = result.filter(item => item.category === 'Điểm dừng phổ biến')
    POPULAR = sortPlaces(POPULAR, textSearch, normalizeUnicode(textSearch))
    let AIRPORT = result.filter(item => item.category === 'Sân Bay')
    AIRPORT = sortPlaces(AIRPORT, textSearch, normalizeUnicode(textSearch))
    // console.log(AIRPORT);
    return {
        CITY,
        WARD,
        BUS_STATION,
        DISTRICT,
        POPULAR,
        AIRPORT
    }
}
function click(elmnt) {
    console.log('elmnt', elmnt)
}
function autocompleteFrom(inp, arr, noteText = '<span style="color: red;">*</span> Lưu ý: Sử dụng tên địa phương trước sáp nhập') {
    let currentFocus;
    let valueInputFrom;
    let valueInputFromId;
    let valueInputTo;
    let valueInputToId;

    function makeNoteDiv(text) {
        const note = document.createElement('DIV');
        note.className = 'autocomplete-note';
        note.style.fontSize = '11px';
        note.style.lineHeight = '1.3';
        note.style.background = 'linear-gradient(90deg, rgb(255, 247, 219) 0%, rgb(255, 255, 255) 100%)'
        note.style.borderBottom = '1px solid #eee';
        note.style.padding = '10px';
        note.innerHTML = text;
        return note;
    }

    const infoEl = document.getElementById('Info');

    if (!fromId && !toId) {
        infoEl.style.display = 'none';
    } else if (jQuery('#Info').length > 0) {
        infoEl.style.display = 'block';
    }

    if (fromId && toId) {
        arr
            .filter(item => item.id == fromId)
            .map(item => (valueInputFrom = item.name));
        document.getElementById('inputFrom').value = valueInputFrom;
        document.getElementById('fromName').innerHTML = valueInputFrom;
        document.getElementById('nameFrom').value = valueInputFrom;
        document.getElementById('datepicker').innerHTML = date;
    }
    if (toId && fromId) {
        arr
            .filter(item => item.id == toId)
            .map(item => (valueInputTo = item.name));
        document.getElementById('inputTo').value = valueInputTo;
        document.getElementById('toName').innerHTML = valueInputTo;
        document.getElementById('nameTo').value = valueInputTo;

    }
    if (url.searchParams.get('date')) {
        document.getElementById('datepicker').innerHTML = date;
    }
    // Show list items when focus
    inp.addEventListener('focus', function (e) {
        let i, b, city, c, s, p,
            d,
            w,
            buses;

        currentFocus = 0;
        a = document.createElement('DIV');
        a.setAttribute('id', this.id + 'autocomplete-list');
        a.setAttribute('class', 'autocomplete-items-from');
        a.style.width = '100%';
        a.style.overflowY = 'auto';
        a.style.maxHeight = '40vh';
        this.parentNode.appendChild(a);
        // >>> THÊM GHI CHÚ TRƯỚC DANH SÁCH <<<
        if (noteText) a.appendChild(makeNoteDiv(noteText));

        let cities = []
        let districts = []
        let bus = []
        let ward = []
        let popular = []
        let airport = []
        const result = searchAreas('', arr)
        cities = result.CITY
        districts = result.DISTRICT
        bus = result.BUS_STATION
        ward = result.WARD
        popular = result.POPULAR
        airport = result.AIRPORT
        b = document.createElement('DIV');
        c = document.createElement('DIV')
        d = document.createElement('DIV')
        w = document.createElement('DIV')
        s = document.createElement('DIV')
        p = document.createElement('DIV')
        buses = document.createElement('DIV')
        if (cities.length > 0) {
            for (i = 0; i < cities.length; i++) {
                c += ` <div name="from" 
            onclick="document.getElementById('from').value = ${cities[i].id}; document.getElementById('nameFrom').value = '${(cities[i].name)}'">
            ${(cities[i].name)}
        </div>`;
            }
            c = c.replace("[object HTMLDivElement]", "")
        } else {
            c = ""
        }
        if (districts.length > 0) {
            for (i = 0; i < districts.length; i++) {
                d += `<div name="from" 
            onclick="document.getElementById('from').value = ${districts[i].id}; document.getElementById('nameFrom').value = '${(districts[i].name)}'">
            ${(districts[i].name)}
        </div>`;
            }
            d = d.replace("[object HTMLDivElement]", "")
        } else {
            d = ""
        }
        if (bus.length > 0) {
            for (i = 0; i < bus.length; i++) {
                buses += `  <div name="from" 
            onclick="document.getElementById('from').value = ${bus[i].id}; document.getElementById('nameFrom').value = '${(bus[i].name)}'">
            ${(bus[i].name)}
        </div>`;
            }
            buses = buses.replace("[object HTMLDivElement]", "")
        } else {
            buses = ""
        }
        if (ward.length > 0) {
            for (i = 0; i < ward.length; i++) {
                w += `<div name="from" 
            onclick="document.getElementById('from').value = ${ward[i].id}; document.getElementById('nameFrom').value = '${(ward[i].name)}'">
            ${(ward[i].name)}
        </div>`;
            }
            w = w.replace("[object HTMLDivElement]", "")
        } else {
            w = ""
        }
        if (airport.length > 0) {
            for (i = 0; i < airport.length; i++) {
                s += `<div name="from" 
            onclick="document.getElementById('from').value = ${airport[i].id}; document.getElementById('nameFrom').value = '${(airport[i].name)}'">
            ${(airport[i].name)}
        </div>`;
            }
            s = s.replace("[object HTMLDivElement]", "")
        } else {
            s = ""
        }
        if (popular.length > 0) {
            for (i = 0; i < popular.length; i++) {
                p += `<div name="from" 
            onclick="document.getElementById('from').value = ${popular[i].id}; document.getElementById('nameFrom').value = '${(popular[i].name)}'">
            ${(popular[i].name)}
        </div>`;
            }
            p = p.replace("[object HTMLDivElement]", "")
        } else {
            p = ""
        }
        b.innerHTML = `
      ${cities.length > 0 ? '<h4 class="b ph2 "> Tỉnh - Thành Phố </h4>' : ''}${c}
      ${districts.length > 0 ? '<h4 class="b ph2 "> Phường - Xã </h4>' : ''}${d}
      ${ward.length > 0 ? '<h4 class="b ph2 "> Quận - Huyện </h4>' : ''}${w}
      ${bus.length > 0 ? '<h4 class="b ph2 "> Bến xe </h4>' : ''}${buses}
      ${airport.length > 0 ? '<h4 class="b ph2 "> Sân bay </h4>' : ''}${s}
      ${popular.length > 0 ? '<h4 class="b ph2 "> Điểm dừng phổ biến </h4>' : ''}${p}
      `
        b.addEventListener('click', function (e) {
            inp.value = document.getElementById('nameFrom').value;
            closeAllLists();
        });
        a.appendChild(b);
        if (inp.value) {
            let x = document.getElementById(a.id);
            if (x) {
                x = x.getElementsByTagName('div');
                for (let i = 0; i < x.length; i++) {
                    if (x[i].innerText == inp.value) {
                        x[i].classList.add('autocomplete-active');
                        a.scrollTop = x[i].offsetTop;
                        currentFocus = i;
                    }
                }
            }
        }
    });

    //Suggest when typing
    inp.addEventListener('input', function (e) {
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
        a = document.createElement('DIV');
        a.setAttribute('id', this.id + 'autocomplete-list');
        a.setAttribute('class', 'autocomplete-items-from');
        a.style.width = '100%';
        a.style.overflowY = 'auto';
        a.style.maxHeight = '40vh';
        this.parentNode.appendChild(a);

        // >>> THÊM GHI CHÚ TRƯỚC DANH SÁCH <<<
        if (noteText) a.appendChild(makeNoteDiv(noteText));
        
        let state = true;
        let cities = []
        let districts = []
        let bus = []
        let ward = []
        let popular = []
        let airport = []
        const result = searchAreas(val, arr)
        cities = result.CITY
        districts = result.DISTRICT
        bus = result.BUS_STATION
        ward = result.WARD
        popular = result.POPULAR
        airport = result.AIRPORT
        b = document.createElement('DIV');
        c = document.createElement('DIV')
        d = document.createElement('DIV')
        w = document.createElement('DIV')
        s = document.createElement('DIV')
        p = document.createElement('DIV')
        buses = document.createElement('DIV')
        if (cities.length > 0) {
            for (i = 0; i < cities.length; i++) {
                c += ` <div name="from" 
            onclick="document.getElementById('from').value = ${cities[i].id}; document.getElementById('nameFrom').value = '${(cities[i].name)}'">
            ${(cities[i].name)}
        </div>`;
            }
            c = c.replace("[object HTMLDivElement]", "")
        } else {
            c = ""
        }
        if (districts.length > 0) {
            for (i = 0; i < districts.length; i++) {
                d += `<div name="from" 
            onclick="document.getElementById('from').value = ${districts[i].id}; document.getElementById('nameFrom').value = '${(districts[i].name)}'">
            ${(districts[i].name)}
        </div>`;
            }
            d = d.replace("[object HTMLDivElement]", "")
        } else {
            d = ""
        }
        if (bus.length > 0) {
            for (i = 0; i < bus.length; i++) {
                buses += `  <div name="from" 
            onclick="document.getElementById('from').value = ${bus[i].id}; document.getElementById('nameFrom').value = '${(bus[i].name)}'">
            ${(bus[i].name)}
        </div>`;
            }
            buses = buses.replace("[object HTMLDivElement]", "")
        } else {
            buses = ""
        }
        if (ward.length > 0) {
            for (i = 0; i < ward.length; i++) {
                w += `<div name="from" 
            onclick="document.getElementById('from').value = ${ward[i].id}; document.getElementById('nameFrom').value = '${(ward[i].name)}'">
            ${(ward[i].name)}
        </div>`;
            }
            w = w.replace("[object HTMLDivElement]", "")
        } else {
            w = ""
        }
        if (airport.length > 0) {
            for (i = 0; i < airport.length; i++) {
                s += `<div name="from" 
            onclick="document.getElementById('from').value = ${airport[i].id}; document.getElementById('nameFrom').value = '${(airport[i].name)}'">
            ${(airport[i].name)}
        </div>`;
            }
            s = s.replace("[object HTMLDivElement]", "")
        } else {
            s = ""
        }
        if (popular.length > 0) {
            for (i = 0; i < popular.length; i++) {
                p += `<div name="from" 
            onclick="document.getElementById('from').value = ${popular[i].id}; document.getElementById('nameFrom').value = '${(popular[i].name)}'">
            ${(popular[i].name)}
        </div>`;
            }
            p = p.replace("[object HTMLDivElement]", "")
        } else {
            p = ""
        }
        b.innerHTML = `
      ${cities.length > 0 ? '<h4 class="b ph2 "> Tỉnh - Thành Phố </h4>' : ''}${c}
      ${districts.length > 0 ? '<h4 class="b ph2 "> Phường - Xã </h4>' : ''}${d}
      ${ward.length > 0 ? '<h4 class="b ph2 "> Quận - Huyện </h4>' : ''}${w}
      ${bus.length > 0 ? '<h4 class="b ph2 "> Bến xe </h4>' : ''}${buses}
      ${airport.length > 0 ? '<h4 class="b ph2 "> Sân bay </h4>' : ''}${s}
      ${popular.length > 0 ? '<h4 class="b ph2 "> Điểm dừng phổ biến </h4>' : ''}${p}
      `
        b.addEventListener('click', function (e) {
            inp.value = document.getElementById('nameFrom').value;
            closeAllLists();
        });
        a.appendChild(b);
        if (inp.value) {
            let x = document.getElementById(a.id);
            if (x) {
                x = x.getElementsByTagName('div');
                for (let i = 0; i < x.length; i++) {
                    if (x[i].innerText == inp.value) {
                        x[i].classList.add('autocomplete-active');
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
    inp.addEventListener('keydown', function (e) {
        var x = document.getElementById(this.id + 'autocomplete-list');
        if (x) x = x.getElementsByTagName('div');
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            x[1].click()
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        } else if (e.keyCode == 9) {
            console.log('log  x[1]', x[1])
            console.log('log  x', x)
            e.preventDefault();
            x[1].click()
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
        x[currentFocus].classList.add('autocomplete-active');
        x[currentFocus].scrollIntoView(false);
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove('autocomplete-active');
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName('autocomplete-items-from');
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener('click', function (e) {
        closeAllLists(e.target);
    });
}

function autocompleteTo(inp, arr, cities, noteText = '<span style="color: red;">*</span> Lưu ý: Sử dụng tên địa phương trước sáp nhập') {
    let currentFocus;

    function makeNoteDiv(text) {
        const note = document.createElement('DIV');
        note.className = 'autocomplete-note';
        note.style.fontSize = '11px';
        note.style.lineHeight = '1.3';
        note.style.background = 'linear-gradient(90deg, rgb(255, 247, 219) 0%, rgb(255, 255, 255) 100%)'
        note.style.borderBottom = '1px solid #eee';
        note.style.padding = '10px';
        note.innerHTML = text;
        return note;
    }

    // Show list items when focus
    inp.addEventListener('focus', function (e) {
        let i, b, city, c, s, p,
            d,
            w,
            buses;

        currentFocus = 0;
        a = document.createElement('DIV');
        a.setAttribute('id', this.id + 'autocomplete-list');
        a.setAttribute('class', 'autocomplete-items-to');
        a.style.width = '100%';
        a.style.overflowY = 'auto';
        a.style.maxHeight = '40vh';
        this.parentNode.appendChild(a);
        // >>> THÊM GHI CHÚ TRƯỚC DANH SÁCH <<<
        if (noteText) a.appendChild(makeNoteDiv(noteText));

        let cities = []
        let districts = []
        let bus = []
        let ward = []
        let popular = []
        let airport = []
        const result = searchAreas('', arr)
        cities = result.CITY
        districts = result.DISTRICT
        bus = result.BUS_STATION
        ward = result.WARD
        popular = result.POPULAR
        airport = result.AIRPORT
        b = document.createElement('DIV');
        c = document.createElement('DIV')
        d = document.createElement('DIV')
        w = document.createElement('DIV')
        s = document.createElement('DIV')
        p = document.createElement('DIV')
        buses = document.createElement('DIV')
        if (cities.length > 0) {
            for (i = 0; i < cities.length; i++) {
                c += ` <div name="to" 
            onclick="document.getElementById('to').value = ${cities[i].id}; document.getElementById('nameTo').value = '${(cities[i].name)}'">
            ${(cities[i].name)}
        </div>`;
            }
            c = c.replace("[object HTMLDivElement]", "")
        } else {
            c = ""
        }
        if (districts.length > 0) {
            for (i = 0; i < districts.length; i++) {
                d += `<div name="to" 
            onclick="document.getElementById('to').value = ${districts[i].id}; document.getElementById('nameTo').value = '${(districts[i].name)}'">
            ${(districts[i].name)}
        </div>`;
            }
            d = d.replace("[object HTMLDivElement]", "")
        } else {
            d = ""
        }
        if (bus.length > 0) {
            for (i = 0; i < bus.length; i++) {
                buses += `  <div name="to" 
            onclick="document.getElementById('to').value = ${bus[i].id}; document.getElementById('nameTo').value = '${(bus[i].name)}'">
            ${(bus[i].name)}
        </div>`;
            }
            buses = buses.replace("[object HTMLDivElement]", "")
        } else {
            buses = ""
        }
        if (ward.length > 0) {
            for (i = 0; i < ward.length; i++) {
                w += `<div name="to" 
            onclick="document.getElementById('to').value = ${ward[i].id}; document.getElementById('nameTo').value = '${(ward[i].name)}'">
            ${(ward[i].name)}
        </div>`;
            }
            w = w.replace("[object HTMLDivElement]", "")
        } else {
            w = ""
        }
        if (airport.length > 0) {
            for (i = 0; i < airport.length; i++) {
                s += `<div name="to" 
            onclick="document.getElementById('to').value = ${airport[i].id}; document.getElementById('nameTo').value = '${(airport[i].name)}'">
            ${(airport[i].name)}
        </div>`;
            }
            s = s.replace("[object HTMLDivElement]", "")
        } else {
            s = ""
        }
        if (popular.length > 0) {
            for (i = 0; i < popular.length; i++) {
                p += `<div name="to" 
            onclick="document.getElementById('to').value = ${popular[i].id}; document.getElementById('nameTo').value = '${(popular[i].name)}'">
            ${(popular[i].name)}
        </div>`;
            }
            p = p.replace("[object HTMLDivElement]", "")
        } else {
            p = ""
        }
        b.innerHTML = `
      ${cities.length > 0 ? '<h4 class="b ph2 "> Tỉnh - Thành Phố </h4>' : ''}${c}
      ${districts.length > 0 ? '<h4 class="b ph2 "> Phường - Xã </h4>' : ''}${d}
      ${ward.length > 0 ? '<h4 class="b ph2 "> Quận - Huyện </h4>' : ''}${w}
      ${bus.length > 0 ? '<h4 class="b ph2 "> Bến Xe </h4>' : ''}${buses}
      ${airport.length > 0 ? '<h4 class="b ph2 "> Sân bay </h4>' : ''}${s}
      ${popular.length > 0 ? '<h4 class="b ph2 "> Điểm dừng phổ biến </h4>' : ''}${p}
      `
        b.addEventListener('click', function (e) {
            inp.value = document.getElementById('nameTo').value;
            closeAllLists();
        });
        a.appendChild(b);
        if (inp.value) {
            let x = document.getElementById(a.id);
            if (x) {
                x = x.getElementsByTagName('div');
                for (let i = 0; i < x.length; i++) {
                    if (x[i].innerText == inp.value) {
                        x[i].classList.add('autocomplete-active');
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
    inp.addEventListener('input', function (e) {
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
        a = document.createElement('DIV');
        a.setAttribute('id', this.id + 'autocomplete-list');
        a.setAttribute('class', 'autocomplete-items-to');
        a.style.width = '100%';
        a.style.overflowY = 'auto';
        a.style.maxHeight = '40vh';
        this.parentNode.appendChild(a);
        // >>> THÊM GHI CHÚ TRƯỚC DANH SÁCH <<<
        if (noteText) a.appendChild(makeNoteDiv(noteText));
        let state = true;
        let cities = []
        let districts = []
        let bus = []
        let ward = []
        let popular = []
        let airport = []
        const result = searchAreas(val, arr)
        cities = result.CITY
        districts = result.DISTRICT
        bus = result.BUS_STATION
        ward = result.WARD
        popular = result.POPULAR
        airport = result.AIRPORT

        // console.log(airport);

        b = document.createElement('DIV');
        c = document.createElement('DIV')
        d = document.createElement('DIV')
        w = document.createElement('DIV')
        s = document.createElement('DIV')
        p = document.createElement('DIV')
        buses = document.createElement('DIV')
        if (cities.length > 0) {
            for (i = 0; i < cities.length; i++) {
                c += ` <div name="to" 
            onclick="document.getElementById('to').value = ${cities[i].id}; document.getElementById('nameTo').value = '${(cities[i].name)}'">
            ${(cities[i].name)}
        </div>`;
            }
            c = c.replace("[object HTMLDivElement]", "")
        } else {
            c = ""
        }
        if (districts.length > 0) {
            for (i = 0; i < districts.length; i++) {
                d += `<div name="to" 
            onclick="document.getElementById('to').value = ${districts[i].id}; document.getElementById('nameTo').value = '${(districts[i].name)}'">
            ${(districts[i].name)}
        </div>`;
            }
            d = d.replace("[object HTMLDivElement]", "")
        } else {
            d = ""
        }
        if (bus.length > 0) {
            for (i = 0; i < bus.length; i++) {
                buses += `  <div name="to" 
            onclick="document.getElementById('to').value = ${bus[i].id}; document.getElementById('nameTo').value = '${(bus[i].name)}'">
            ${(bus[i].name)}
        </div>`;
            }
            buses = buses.replace("[object HTMLDivElement]", "")
        } else {
            buses = ""
        }
        if (ward.length > 0) {
            for (i = 0; i < ward.length; i++) {
                w += `<div name="to" 
            onclick="document.getElementById('to').value = ${ward[i].id}; document.getElementById('nameTo').value = '${(ward[i].name)}'">
            ${(ward[i].name)}
        </div>`;
            }
            w = w.replace("[object HTMLDivElement]", "")
        } else {
            w = ""
        }
        if (airport.length > 0) {
            for (i = 0; i < airport.length; i++) {
                s += `<div name="to" 
            onclick="document.getElementById('to').value = ${airport[i].id}; document.getElementById('nameTo').value = '${(airport[i].name)}'">
            ${(airport[i].name)}
        </div>`;
            }
            s = s.replace("[object HTMLDivElement]", "")
        } else {
            s = ""
        }
        if (popular.length > 0) {
            for (i = 0; i < popular.length; i++) {
                p += `<div name="to" 
            onclick="document.getElementById('to').value = ${popular[i].id}; document.getElementById('nameTo').value = '${(popular[i].name)}'">
            ${(popular[i].name)}
        </div>`;
            }
            p = p.replace("[object HTMLDivElement]", "")
        } else {
            p = ""
        }
        b.innerHTML = `
      ${cities.length > 0 ? '<h4 class="b ph2 "> Tỉnh - Thành Phố </h4>' : ''}${c}
      ${districts.length > 0 ? '<h4 class="b ph2 "> Phường - Xã </h4>' : ''}${d}
      ${ward.length > 0 ? '<h4 class="b ph2 "> Quận - Huyện </h4>' : ''}${w}
      ${bus.length > 0 ? '<h4 class="b ph2 "> Bến Xe </h4>' : ''}${buses}
      ${airport.length > 0 ? '<h4 class="b ph2 "> Sân bay </h4>' : ''}${s}
      ${popular.length > 0 ? '<h4 class="b ph2 "> Điểm dừng phổ biến </h4>' : ''}${p}
      `
        b.addEventListener('click', function (e) {
            inp.value = document.getElementById('nameTo').value;
            closeAllLists();
        });
        a.appendChild(b);
        if (inp.value) {
            let x = document.getElementById(a.id);
            if (x) {
                x = x.getElementsByTagName('div');
                for (let i = 0; i < x.length; i++) {
                    if (x[i].innerText == inp.value) {
                        x[i].classList.add('autocomplete-active');
                        a.scrollTop = x[i].offsetTop;
                        currentFocus = i;
                    }
                }
            }
        }
    });

    inp.addEventListener('keydown', function (e) {
        // console.log('e', e)
        var x = document.getElementById(this.id + 'autocomplete-list');
        if (x) x = x.getElementsByTagName('div');
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
            x[1].click()
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        } else if (e.keyCode == 9) {

            console.log('currentFocus', currentFocus)
            console.log('x[1', x[1])
            console.log('x', x)
            e.preventDefault();
            x[1].click()
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
        x[currentFocus].classList.add('autocomplete-active');
        x[currentFocus].scrollIntoView(false);
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove('autocomplete-active');
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName('autocomplete-items-to');
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener('click', function (e) {
        closeAllLists(e.target);
    });
}

document.getElementById('inputTo').value = url.searchParams.get('tn');
document.getElementById('inputFrom').value = url.searchParams.get('fn');
document.getElementById('to').value = (toId) ? toId : '';
document.getElementById('from').value = (fromId) ? fromId : '';


const data = [
    {
        "id": "28299",
        "area_id": 65,
        "name": "Savannakhet - Lào",
        "name_filter": "savannakhet - lao",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "savannakhet-lao"
    },
    {
        "id": "28291",
        "area_id": 65,
        "name": "Pakse - Lào",
        "name_filter": "pakse - lao",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "pakse-lao"
    },
    {
        "id": "28300",
        "area_id": 64,
        "name": "Vientiane - Lào",
        "name_filter": "vientiane - lao",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "vientiane-lao"
    },
    {
        "id": "528",
        "area_id": 63,
        "name": "Vinh",
        "name_filter": "vinh",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "vinh"
    },
    {
        "id": "24",
        "area_id": 24,
        "name": "Hà Nội",
        "name_filter": "ha noi",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "hanoi"
    },
    {
        "id": "27",
        "area_id": 27,
        "name": "Hải Phòng",
        "name_filter": "hai phong",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "haiphong"
    },
    {
        "id": "3",
        "area_id": 3,
        "name": "Bắc Giang",
        "name_filter": "bac giang",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "bacgiang"
    },
    {
        "id": "4",
        "area_id": 4,
        "name": "Bắc Kạn",
        "name_filter": "bac kan",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "backan"
    },
    {
        "id": "6",
        "area_id": 6,
        "name": "Bắc Ninh",
        "name_filter": "bac ninh",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "bacninh"
    },
    {
        "id": "14",
        "area_id": 14,
        "name": "Cao Bằng",
        "name_filter": "cao bang",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "caobang"
    },
    {
        "id": "18",
        "area_id": 18,
        "name": "Điện Biên",
        "name_filter": "dien bien",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "dienbien"
    },
    {
        "id": "22",
        "area_id": 22,
        "name": "Hà Giang",
        "name_filter": "ha giang",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "hagiang"
    },
    {
        "id": "23",
        "area_id": 23,
        "name": "Hà Nam",
        "name_filter": "ha nam",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "hanam"
    },
    {
        "id": "26",
        "area_id": 26,
        "name": "Hải Dương",
        "name_filter": "hai duong",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "haiduong"
    },
    {
        "id": "30",
        "area_id": 30,
        "name": "Hòa Bình",
        "name_filter": "hoa binh",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "hoabinh"
    },
    {
        "id": "31",
        "area_id": 31,
        "name": "Hưng Yên",
        "name_filter": "hung yen",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "hungyen"
    },
    {
        "id": "37",
        "area_id": 37,
        "name": "Lạng Sơn",
        "name_filter": "lang son",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "langson"
    },
    {
        "id": "38",
        "area_id": 38,
        "name": "Lào Cai",
        "name_filter": "lao cai",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "laocai"
    },
    {
        "id": "40",
        "area_id": 40,
        "name": "Nam Định",
        "name_filter": "nam dinh",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "namdinh"
    },
    {
        "id": "42",
        "area_id": 42,
        "name": "Ninh Bình",
        "name_filter": "ninh binh",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "ninhbinh"
    },
    {
        "id": "44",
        "area_id": 44,
        "name": "Phú Thọ",
        "name_filter": "phu tho",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "phutho"
    },
    {
        "id": "54",
        "area_id": 54,
        "name": "Thái Bình",
        "name_filter": "thai binh",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "thaibinh"
    },
    {
        "id": "60",
        "area_id": 60,
        "name": "Tuyên Quang",
        "name_filter": "tuyen quang",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "tuyenquang"
    },
    {
        "id": "62",
        "area_id": 62,
        "name": "Vĩnh Phúc",
        "name_filter": "vinh phuc",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "vinhphuc"
    },
    {
        "id": "63",
        "area_id": 63,
        "name": "Yên Bái",
        "name_filter": "yen bai",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "yenbai"
    },
    {
        "id": "15",
        "area_id": 15,
        "name": "Đà Nẵng",
        "name_filter": "da nang",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "danang"
    },
    {
        "id": "8",
        "area_id": 8,
        "name": "Bình Định",
        "name_filter": "binh dinh",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "binhdinh"
    },
    {
        "id": "11",
        "area_id": 11,
        "name": "Bình Thuận",
        "name_filter": "binh thuan",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "binhthuan"
    },
    {
        "id": "16",
        "area_id": 16,
        "name": "Đắk Lắk",
        "name_filter": "dak lak",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "daklak"
    },
    {
        "id": "17",
        "area_id": 17,
        "name": "Đăk Nông",
        "name_filter": "dak nong",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "daknong"
    },
    {
        "id": "21",
        "area_id": 21,
        "name": "Gia Lai",
        "name_filter": "gia lai",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "gialai"
    },
    {
        "id": "25",
        "area_id": 25,
        "name": "Hà Tĩnh",
        "name_filter": "ha tinh",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "hatinh"
    },
    {
        "id": "32",
        "area_id": 32,
        "name": "Khánh Hòa",
        "name_filter": "khanh hoa",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "khanhhoa"
    },
    {
        "id": "34",
        "area_id": 34,
        "name": "Kon Tum",
        "name_filter": "kon tum",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "kontum"
    },
    {
        "id": "35",
        "area_id": 35,
        "name": "Lai Châu",
        "name_filter": "lai chau",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "laichau"
    },
    {
        "id": "36",
        "area_id": 36,
        "name": "Lâm Đồng",
        "name_filter": "lam dong",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "lamdong"
    },
    {
        "id": "41",
        "area_id": 41,
        "name": "Nghệ An",
        "name_filter": "nghe an",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "nghean"
    },
    {
        "id": "43",
        "area_id": 43,
        "name": "Ninh Thuận",
        "name_filter": "ninh thuan",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "ninhthuan"
    },
    {
        "id": "45",
        "area_id": 45,
        "name": "Phú Yên",
        "name_filter": "phu yen",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "phuyen"
    },
    {
        "id": "46",
        "area_id": 46,
        "name": "Quảng Bình",
        "name_filter": "quang binh",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "quangbinh"
    },
    {
        "id": "47",
        "area_id": 47,
        "name": "Quảng Nam",
        "name_filter": "quang nam",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "quangnam"
    },
    {
        "id": "48",
        "area_id": 48,
        "name": "Quảng Ngãi",
        "name_filter": "quang ngai",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "quangngai"
    },
    {
        "id": "49",
        "area_id": 49,
        "name": "Quảng Ninh",
        "name_filter": "quang ninh",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "quangninh"
    },
    {
        "id": "50",
        "area_id": 50,
        "name": "Quảng Trị",
        "name_filter": "quang tri",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "quangtri"
    },
    {
        "id": "52",
        "area_id": 52,
        "name": "Sơn La",
        "name_filter": "son la",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "sonla"
    },
    {
        "id": "55",
        "area_id": 55,
        "name": "Thái Nguyên",
        "name_filter": "thai nguyen",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "thainguyen"
    },
    {
        "id": "56",
        "area_id": 56,
        "name": "Thanh Hóa",
        "name_filter": "thanh hoa",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "thanhhoa"
    },
    {
        "id": "57",
        "area_id": 57,
        "name": "Thừa Thiên-Huế",
        "name_filter": "thua thien-hue",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "thuathien-hue"
    },
    {
        "id": "29",
        "area_id": 29,
        "name": "Hồ Chí Minh",
        "name_filter": "ho chi minh",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "hochiminh"
    },
    {
        "id": "29",
        "area_id": 29,
        "name": "Sài Gòn",
        "name_filter": "sai gon",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "saigon"
    },
    {
        "id": "13",
        "area_id": 13,
        "name": "Cần Thơ",
        "name_filter": "can tho",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "cantho"
    },
    {
        "id": "1",
        "area_id": 1,
        "name": "An Giang",
        "name_filter": "an giang",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "angiang"
    },
    {
        "id": "2",
        "area_id": 2,
        "name": "Bà Rịa-Vũng Tàu",
        "name_filter": "ba ria - vung tau",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "baria-vungtau"
    },
    {
        "id": "5",
        "area_id": 5,
        "name": "Bạc Liêu",
        "name_filter": "bac lieu",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "baclieu"
    },
    {
        "id": "7",
        "area_id": 7,
        "name": "Bến Tre",
        "name_filter": "ben tre",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "bentre"
    },
    {
        "id": "9",
        "area_id": 9,
        "name": "Bình Dương",
        "name_filter": "binh duong",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "binhduong"
    },
    {
        "id": "10",
        "area_id": 10,
        "name": "Bình Phước",
        "name_filter": "binh phuoc",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "binhphuoc"
    },
    {
        "id": "12",
        "area_id": 12,
        "name": "Cà Mau",
        "name_filter": "ca mau",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "camau"
    },
    {
        "id": "19",
        "area_id": 19,
        "name": "Đồng Nai",
        "name_filter": "dong nai",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "dongnai"
    },
    {
        "id": "20",
        "area_id": 20,
        "name": "Đồng Tháp",
        "name_filter": "dong thap",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "dongthap"
    },
    {
        "id": "28",
        "area_id": 28,
        "name": "Hậu Giang",
        "name_filter": "hau giang",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "haugiang"
    },
    {
        "id": "33",
        "area_id": 33,
        "name": "Kiên Giang",
        "name_filter": "kien giang",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "kiengiang"
    },
    {
        "id": "39",
        "area_id": 39,
        "name": "Long An",
        "name_filter": "long an",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "longan"
    },
    {
        "id": "51",
        "area_id": 51,
        "name": "Sóc Trăng",
        "name_filter": "soc trang",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "soctrang"
    },
    {
        "id": "53",
        "area_id": 53,
        "name": "Tây Ninh",
        "name_filter": "tay ninh",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "tayninh"
    },
    {
        "id": "58",
        "area_id": 58,
        "name": "Tiền Giang",
        "name_filter": "tien giang",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "tiengiang"
    },
    {
        "id": "59",
        "area_id": 59,
        "name": "Trà Vinh",
        "name_filter": "tra vinh",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "travinh"
    },
    {
        "id": "61",
        "area_id": 61,
        "name": "Vĩnh Long",
        "name_filter": "vinh long",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "vinhlong"
    },
    {
        "id": "49110",
        "area_id": 49110,
        "name": "Kampot - Campuchia",
        "name_filter": "campuchia - kampot",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "campuchia-kampot"
    },
    {
        "id": "49110",
        "area_id": 49110,
        "name": "Kampot - Campuchia",
        "name_filter": "kampot - campuchia",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "kampot-campuchia"
    },
    {
        "id": "28349",
        "area_id": 65,
        "name": " Thakhek - Khammuane - Lào",
        "name_filter": "thakhek - khammuane - lao",
        "category": "Quận - Huyện",
        "name_nospace": "thakhek-khammuane-lao"
    },
    {
        "id": "49118",
        "area_id": 1065,
        "name": "Phnôm Pênh - Campuchia",
        "name_filter": "campuchia - phnom penh",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "campuchia-phnompenh"
    },
    {
        "id": "49118",
        "area_id": 1065,
        "name": "Phnôm Pênh - Campuchia",
        "name_filter": "phnom penh - campuchia",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "phnompenh-campuchia"
    },
    {
        "id": "49124",
        "area_id": 49587,
        "name": "Sihanoukville - Campuchia",
        "name_filter": "sihanoukville - campuchia",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "sihanoukville-campuchia"
    },
    {
        "id": "49144",
        "area_id": 49144,
        "name": "Battambang - Campuchia",
        "name_filter": "battambang - campuchia",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "battambang-campuchia"
    },
    {
        "id": "49123",
        "area_id": 49123,
        "name": "Siem Reap - Campuchia",
        "name_filter": "siem reap - campuchia",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "siemreap-campuchia"
    },
    {
        "id": 765,
        "area_id": 29,
        "name": "Bến xe Miền Đông",
        "name_filter": "ben xe mien dong - ho chi minh",
        "category": "Bến xe",
        "name_nospace": "benxemiendong-hochiminh"
    },
    // {
    //     "id": 767,
    //     "area_id": 29,
    //     "name": "Bến xe Miền Đông Mới",
    //     "name_filter": "ben xe mien dong moi - ho chi minh",
    //     "category": "Bến xe",
    //     "name_nospace": "benxemiendongmoi-hochiminh"
    // },
    {
        "id": 768,
        "area_id": 29,
        "name": "Bến xe Miền Tây",
        "name_filter": "ben xe mien tay - ho chi minh",
        "category": "Bến xe",
        "name_nospace": "benxemientay-hochiminh"
    },
    {
        "id": 818,
        "area_id": 29,
        "name": "Bến xe An Sương",
        "name_filter": "ben xe an suong - ho chi minh",
        "category": "Bến xe",
        "name_nospace": "benxeansuong-hochiminh"
    },
    {
        "id": 786,
        "area_id": 24,
        "name": "Bến xe Mỹ Đình",
        "name_filter": "ben xe my dinh - ha noi",
        "category": "Bến xe",
        "name_nospace": "benxemydinh-hanoi"
    },
    {
        "id": 930,
        "area_id": 24,
        "name": "Bến xe Gia Lâm",
        "name_filter": "ben xe gia lam - ha noi",
        "category": "Bến xe",
        "name_nospace": "benxegialam-hanoi"
    },
    {
        "id": 785,
        "area_id": 24,
        "name": "Bến xe Giáp Bát",
        "name_filter": "ben xe giap bat - ha noi",
        "category": "Bến xe",
        "name_nospace": "benxegiapbat-hanoi"
    },
    {
        "id": 803,
        "area_id": 24,
        "name": "Bến xe Nước Ngầm",
        "name_filter": "ben xe nuoc ngam - ha noi",
        "category": "Bến xe",
        "name_nospace": "benxenuocngam-hanoi"
    },
    {
        "id": 811,
        "area_id": 24,
        "name": "Bến xe Lương Yên",
        "name_filter": "ben xe luong yen - ha noi",
        "category": "Bến xe",
        "name_nospace": "benxeluongyen-hanoi"
    },
    {
        "id": 966,
        "area_id": 24,
        "name": "Bến xe Yên Nghĩa",
        "name_filter": "ben xe yen nghia - ha noi",
        "category": "Bến xe",
        "name_nospace": "benxeyennghia-hanoi"
    },
    {
        "id": 767,
        "area_id": 15,
        "name": "Bến xe Trung tâm Đà Nẵng",
        "name_filter": "ben xe trung tam - da nang",
        "category": "Bến xe",
        "name_nospace": "benxetrungtam-danang"
    },
    {
        "id": 989,
        "area_id": 15,
        "name": "Bến xe Khách phía nam Đà Nẵng",
        "name_filter": "ben xe khach phia nam - da nang",
        "category": "Bến xe",
        "name_nospace": "benxekhachphianam-danang"
    },
    {
        "id": 968,
        "area_id": 15,
        "name": "Bến xe Khách Đà Nẵng",
        "name_filter": "ben xe khach - da nang",
        "category": "Bến xe",
        "name_nospace": "benxekhach-danang"
    },
    {
        "id": 876,
        "area_id": 13,
        "name": "Bến xe Cần Thơ",
        "name_filter": "ben xe - can tho",
        "category": "Bến xe",
        "name_nospace": "benxe-cantho"
    },
    {
        "id": 1243,
        "area_id": 13,
        "name": "Bến xe Thạch An",
        "name_filter": "ben xe thach an - can tho",
        "category": "Bến xe",
        "name_nospace": "benxethachan-cantho"
    },
    {
        "id": 1242,
        "area_id": 13,
        "name": "Bến xe Thốt Nốt",
        "name_filter": "ben xe thot not - can tho",
        "category": "Bến xe",
        "name_nospace": "benxethotnot-cantho"
    },
    {
        "id": 1235,
        "area_id": 13,
        "name": "Bến xe Bình Thủy",
        "name_filter": "ben xe binh thuy - can tho",
        "category": "Bến xe",
        "name_nospace": "benxebinhthuy-cantho"
    },
    {
        "id": 1238,
        "area_id": 13,
        "name": "Bến xe Phong Điền",
        "name_filter": "ben xe phong dien - can tho",
        "category": "Bến xe",
        "name_nospace": "benxephongdien-cantho"
    },
    {
        "id": 1236,
        "area_id": 13,
        "name": "Bến xe Khu đô thị nam Cần Thơ",
        "name_filter": "ben xe khu do thi nam - can tho",
        "category": "Bến xe",
        "name_nospace": "benxekhudothinam-cantho"
    },
    {
        "id": 1044,
        "area_id": 13,
        "name": "Bến xe Cờ Đỏ",
        "name_filter": "ben xe co do - can tho",
        "category": "Bến xe",
        "name_nospace": "benxecodo-cantho"
    },
    {
        "id": 779,
        "area_id": 13,
        "name": "Bến xe 91B Cần Thơ",
        "name_filter": "ben xe 91b - can tho",
        "category": "Bến xe",
        "name_nospace": "benxe91b-cantho"
    },
    {
        "id": 984,
        "area_id": 13,
        "name": "Bến xe Tàu Cần Thơ",
        "name_filter": "ben xe tau - can tho",
        "category": "Bến xe",
        "name_nospace": "benxetau-cantho"
    },
    {
        "id": 782,
        "area_id": 13,
        "name": "Bến xe Hùng Vương Cần Thơ",
        "name_filter": "ben xe hung vuong - can tho",
        "category": "Bến xe",
        "name_nospace": "benxehungvuong-cantho"
    },
    {
        "id": 887,
        "area_id": 13,
        "name": "Bến xe Ô Môn",
        "name_filter": "ben xe o mon - can tho",
        "category": "Bến xe",
        "name_nospace": "benxeomon-cantho"
    },
    {
        "id": 370,
        "area_id": 29,
        "name": "Cần Giờ - Hồ Chí Minh",
        "name_filter": "can gio - ho chi minh",
        "category": "Quận - Huyện",
        "name_nospace": "cangio-hochiminh"
    },
    {
        "id": "345",
        "area_id": 27,
        "name": "An Dương - Hải Phòng",
        "name_filter": "an duong - hai phong",
        "category": "Quận - Huyện",
        "name_nospace": "anduong-haiphong"
    },
    {
        "id": "346",
        "area_id": 27,
        "name": "An Lão - Hải Phòng",
        "name_filter": "an lao - hai phong",
        "category": "Quận - Huyện",
        "name_nospace": "anlao-haiphong"
    },
    {
        "id": "347",
        "area_id": 27,
        "name": "Bạch Long Vĩ - Hải Phòng",
        "name_filter": "bach long vi - hai phong",
        "category": "Quận - Huyện",
        "name_nospace": "bachlongvi-haiphong"
    },
    {
        "id": "348",
        "area_id": 27,
        "name": "Cát Hải - Hải Phòng",
        "name_filter": "cat hai - hai phong",
        "category": "Quận - Huyện",
        "name_nospace": "cathai-haiphong"
    },
    {
        "id": "349",
        "area_id": 27,
        "name": "Dương Kinh - Hải Phòng",
        "name_filter": "duong kinh - hai phong",
        "category": "Quận - Huyện",
        "name_nospace": "duongkinh-haiphong"
    },
    {
        "id": "350",
        "area_id": 27,
        "name": "Đồ Sơn - Hải Phòng",
        "name_filter": "do son - hai phong",
        "category": "Quận - Huyện",
        "name_nospace": "doson-haiphong"
    },
    {
        "id": "351",
        "area_id": 27,
        "name": "Hải An - Hải Phòng",
        "name_filter": "hai an - hai phong",
        "category": "Quận - Huyện",
        "name_nospace": "haian-haiphong"
    },
    {
        "id": "352",
        "area_id": 27,
        "name": "Hồng Bàng - Hải Phòng",
        "name_filter": "hong bang - hai phong",
        "category": "Quận - Huyện",
        "name_nospace": "hongbang-haiphong"
    },
    {
        "id": "353",
        "area_id": 27,
        "name": "Kiến An - Hải Phòng",
        "name_filter": "kien an - hai phong",
        "category": "Quận - Huyện",
        "name_nospace": "kienan-haiphong"
    },
    {
        "id": "354",
        "area_id": 27,
        "name": "Kiến Thụy - Hải Phòng",
        "name_filter": "kien thuy - hai phong",
        "category": "Quận - Huyện",
        "name_nospace": "kienthuy-haiphong"
    },
    {
        "id": "355",
        "area_id": 27,
        "name": "Lê Chân - Hải Phòng",
        "name_filter": "le chan - hai phong",
        "category": "Quận - Huyện",
        "name_nospace": "lechan-haiphong"
    },
    {
        "id": "356",
        "area_id": 27,
        "name": "Ngô Quyền - Hải Phòng",
        "name_filter": "ngo quyen - hai phong",
        "category": "Quận - Huyện",
        "name_nospace": "ngoquyen-haiphong"
    },
    {
        "id": "357",
        "area_id": 27,
        "name": "Thuỷ Nguyên - Hải Phòng",
        "name_filter": "thuy nguyen - hai phong",
        "category": "Quận - Huyện",
        "name_nospace": "thuynguyen-haiphong"
    },
    {
        "id": "358",
        "area_id": 27,
        "name": "Tiên Lãng - Hải Phòng",
        "name_filter": "tien lang - hai phong",
        "category": "Quận - Huyện",
        "name_nospace": "tienlang-haiphong"
    },
    {
        "id": "359",
        "area_id": 27,
        "name": "Vĩnh Bảo - Hải Phòng",
        "name_filter": "vinh bao - hai phong",
        "category": "Quận - Huyện",
        "name_nospace": "vinhbao-haiphong"
    },
    {
        "id": "64",
        "area_id": 1,
        "name": "An Phú - An Giang",
        "name_filter": "an phu - an giang",
        "category": "Quận - Huyện",
        "name_nospace": "anphu-angiang"
    },
    {
        "id": "65",
        "area_id": 1,
        "name": "Châu Đốc - An Giang",
        "name_filter": "chau doc - an giang",
        "category": "Quận - Huyện",
        "name_nospace": "chaudoc-angiang"
    },
    {
        "id": "66",
        "area_id": 1,
        "name": "Châu Phú - An Giang",
        "name_filter": "chau phu - an giang",
        "category": "Quận - Huyện",
        "name_nospace": "chauphu-angiang"
    },
    {
        "id": "67",
        "area_id": 1,
        "name": "Châu Thành - An Giang",
        "name_filter": "chau thanh - an giang",
        "category": "Quận - Huyện",
        "name_nospace": "chauthanh-angiang"
    },
    {
        "id": "68",
        "area_id": 1,
        "name": "Chợ Mới - An Giang",
        "name_filter": "cho moi - an giang",
        "category": "Quận - Huyện",
        "name_nospace": "chomoi-angiang"
    },
    {
        "id": "69",
        "area_id": 1,
        "name": "Long Xuyên - An Giang",
        "name_filter": "long xuyen - an giang",
        "category": "Quận - Huyện",
        "name_nospace": "longxuyen-angiang"
    },
    {
        "id": "70",
        "area_id": 1,
        "name": "Phú Tân - An Giang",
        "name_filter": "phu tan - an giang",
        "category": "Quận - Huyện",
        "name_nospace": "phutan-angiang"
    },
    {
        "id": "71",
        "area_id": 1,
        "name": "Tân Châu - An Giang",
        "name_filter": "tan chau - an giang",
        "category": "Quận - Huyện",
        "name_nospace": "tanchau-angiang"
    },
    {
        "id": "72",
        "area_id": 1,
        "name": "Thoại Sơn - An Giang",
        "name_filter": "thoai son - an giang",
        "category": "Quận - Huyện",
        "name_nospace": "thoaison-angiang"
    },
    {
        "id": "72",
        "area_id": 1,
        "name": "Núi Sập - Thoại Sơn - An Giang",
        "name_filter": "nui sap - thoai son - an giang",
        "category": "Quận - Huyện",
        "name_nospace": "nuisap-thoaison-angiang"
    },
    {
        "id": "73",
        "area_id": 1,
        "name": "Tịnh Biên - An Giang",
        "name_filter": "tinh bien - an giang",
        "category": "Quận - Huyện",
        "name_nospace": "tinhbien-angiang"
    },
    {
        "id": "73",
        "area_id": 1,
        "name": "Chi Lăng - Tịnh Biên - An Giang",
        "name_filter": "chi lang - tinh bien - an giang",
        "category": "Quận - Huyện",
        "name_nospace": "chilang-tinhbien-angiang"
    },
    {
        "id": "73",
        "area_id": 1,
        "name": "Nhà Bàng - Tịnh Biên - An Giang",
        "name_filter": "nha bang - tinh bien - an giang",
        "category": "Quận - Huyện",
        "name_nospace": "nhabang-tinhbien-angiang"
    },
    {
        "id": "74",
        "area_id": 1,
        "name": "Tri Tôn - An Giang",
        "name_filter": "tri ton - an giang",
        "category": "Quận - Huyện",
        "name_nospace": "triton-angiang"
    },
    {
        "id": "75",
        "area_id": 2,
        "name": "Tân Thành - Bà Rịa-Vũng Tàu",
        "name_filter": "tan thanh - ba ria-vung tau",
        "category": "Quận - Huyện",
        "name_nospace": "tanthanh-baria-vungtau"
    },
    {
        "id": "76",
        "area_id": 2,
        "name": "Vũng Tàu - Bà Rịa-Vũng Tàu",
        "name_filter": "vung tau - ba ria-vung tau",
        "category": "Quận - Huyện",
        "name_nospace": "vungtau-baria-vungtau"
    },
    {
        "id": "77",
        "area_id": 2,
        "name": "Xuyên Mộc - Bà Rịa-Vũng Tàu",
        "name_filter": "xuyen moc - ba ria-vung tau",
        "category": "Quận - Huyện",
        "name_nospace": "xuyenmoc-baria-vungtau"
    },
    {
        "id": "78",
        "area_id": 2,
        "name": "Bà Rịa - Bà Rịa-Vũng Tàu",
        "name_filter": "ba ria - ba ria-vung tau",
        "category": "Quận - Huyện",
        "name_nospace": "baria-baria-vungtau"
    },
    {
        "id": "79",
        "area_id": 2,
        "name": "Châu Đức - Bà Rịa-Vũng Tàu",
        "name_filter": "chau duc - ba ria-vung tau",
        "category": "Quận - Huyện",
        "name_nospace": "chauduc-baria-vungtau"
    },
    {
        "id": "80",
        "area_id": 2,
        "name": "Côn Đảo - Bà Rịa-Vũng Tàu",
        "name_filter": "con dao - ba ria-vung tau",
        "category": "Quận - Huyện",
        "name_nospace": "condao-baria-vungtau"
    },
    {
        "id": "81",
        "area_id": 2,
        "name": "Đất Đỏ - Bà Rịa-Vũng Tàu",
        "name_filter": "dat do - ba ria-vung tau",
        "category": "Quận - Huyện",
        "name_nospace": "datdo-baria-vungtau"
    },
    {
        "id": "82",
        "area_id": 2,
        "name": "Long Điền - Bà Rịa-Vũng Tàu",
        "name_filter": "long dien - ba ria-vung tau",
        "category": "Quận - Huyện",
        "name_nospace": "longdien-baria-vungtau"
    },
    {
        "id": "101",
        "area_id": 5,
        "name": "Bạc Liêu - Bạc Liêu",
        "name_filter": "bac lieu - bac lieu",
        "category": "Quận - Huyện",
        "name_nospace": "baclieu-baclieu"
    },
    {
        "id": "102",
        "area_id": 5,
        "name": "Đông Hải - Bạc Liêu",
        "name_filter": "dong hai - bac lieu",
        "category": "Quận - Huyện",
        "name_nospace": "donghai-baclieu"
    },
    {
        "id": "103",
        "area_id": 5,
        "name": "Giá Rai - Bạc Liêu",
        "name_filter": "gia rai - bac lieu",
        "category": "Quận - Huyện",
        "name_nospace": "giarai-baclieu"
    },
    {
        "id": "104",
        "area_id": 5,
        "name": "Hoà Bình - Bạc Liêu",
        "name_filter": "hoa binh - bac lieu",
        "category": "Quận - Huyện",
        "name_nospace": "hoabinh-baclieu"
    },
    {
        "id": "105",
        "area_id": 5,
        "name": "Hồng Dân - Bạc Liêu",
        "name_filter": "hong dan - bac lieu",
        "category": "Quận - Huyện",
        "name_nospace": "hongdan-baclieu"
    },
    {
        "id": "106",
        "area_id": 5,
        "name": "Phước Long - Bạc Liêu",
        "name_filter": "phuoc long - bac lieu",
        "category": "Quận - Huyện",
        "name_nospace": "phuoclong-baclieu"
    },
    {
        "id": "107",
        "area_id": 5,
        "name": "Vĩnh Lợi - Bạc Liêu",
        "name_filter": "vinh loi - bac lieu",
        "category": "Quận - Huyện",
        "name_nospace": "vinhloi-baclieu"
    },
    {
        "id": "93",
        "area_id": 4,
        "name": "Ba Bể - Bắc Kạn",
        "name_filter": "ba be - bac kan",
        "category": "Quận - Huyện",
        "name_nospace": "babe-backan"
    },
    {
        "id": "94",
        "area_id": 4,
        "name": "Bạch Thông - Bắc Kạn",
        "name_filter": "bach thong - bac kan",
        "category": "Quận - Huyện",
        "name_nospace": "bachthong-backan"
    },
    {
        "id": "95",
        "area_id": 4,
        "name": "Bắc Kạn - Bắc Kạn",
        "name_filter": "bac kan - bac kan",
        "category": "Quận - Huyện",
        "name_nospace": "backan-backan"
    },
    {
        "id": "96",
        "area_id": 4,
        "name": "Chợ Đồn - Bắc Kạn",
        "name_filter": "cho don - bac kan",
        "category": "Quận - Huyện",
        "name_nospace": "chodon-backan"
    },
    {
        "id": "97",
        "area_id": 4,
        "name": "Chợ Mới - Bắc Kạn",
        "name_filter": "cho moi - bac kan",
        "category": "Quận - Huyện",
        "name_nospace": "chomoi-backan"
    },
    {
        "id": "98",
        "area_id": 4,
        "name": "Na Rì - Bắc Kạn",
        "name_filter": "na ri - bac kan",
        "category": "Quận - Huyện",
        "name_nospace": "nari-backan"
    },
    {
        "id": "99",
        "area_id": 4,
        "name": "Ngân Sơn - Bắc Kạn",
        "name_filter": "ngan son - bac kan",
        "category": "Quận - Huyện",
        "name_nospace": "nganson-backan"
    },
    {
        "id": "100",
        "area_id": 4,
        "name": "Pác Nặm - Bắc Kạn",
        "name_filter": "pac nam - bac kan",
        "category": "Quận - Huyện",
        "name_nospace": "pacnam-backan"
    },
    {
        "id": "83",
        "area_id": 3,
        "name": "Bắc Giang - Bắc Giang",
        "name_filter": "bac giang - bac giang",
        "category": "Quận - Huyện",
        "name_nospace": "bacgiang-bacgiang"
    },
    {
        "id": "84",
        "area_id": 3,
        "name": "Hiệp Hòa - Bắc Giang",
        "name_filter": "hiep hoa - bac giang",
        "category": "Quận - Huyện",
        "name_nospace": "hiephoa-bacgiang"
    },
    {
        "id": "85",
        "area_id": 3,
        "name": "Lạng Giang - Bắc Giang",
        "name_filter": "lang giang - bac giang",
        "category": "Quận - Huyện",
        "name_nospace": "langgiang-bacgiang"
    },
    {
        "id": "86",
        "area_id": 3,
        "name": "Lục Nam - Bắc Giang",
        "name_filter": "luc nam - bac giang",
        "category": "Quận - Huyện",
        "name_nospace": "lucnam-bacgiang"
    },
    {
        "id": "87",
        "area_id": 3,
        "name": "Lục Ngạn - Bắc Giang",
        "name_filter": "luc ngan - bac giang",
        "category": "Quận - Huyện",
        "name_nospace": "lucngan-bacgiang"
    },
    {
        "id": "88",
        "area_id": 3,
        "name": "Sơn Động - Bắc Giang",
        "name_filter": "son dong - bac giang",
        "category": "Quận - Huyện",
        "name_nospace": "sondong-bacgiang"
    },
    {
        "id": "89",
        "area_id": 3,
        "name": "Tân Yên - Bắc Giang",
        "name_filter": "tan yen - bac giang",
        "category": "Quận - Huyện",
        "name_nospace": "tanyen-bacgiang"
    },
    {
        "id": "90",
        "area_id": 3,
        "name": "Việt Yên - Bắc Giang",
        "name_filter": "viet yen - bac giang",
        "category": "Quận - Huyện",
        "name_nospace": "vietyen-bacgiang"
    },
    {
        "id": "91",
        "area_id": 3,
        "name": "Yên Dũng - Bắc Giang",
        "name_filter": "yen dung - bac giang",
        "category": "Quận - Huyện",
        "name_nospace": "yendung-bacgiang"
    },
    {
        "id": "92",
        "area_id": 3,
        "name": "Yên Thế - Bắc Giang",
        "name_filter": "yen the - bac giang",
        "category": "Quận - Huyện",
        "name_nospace": "yenthe-bacgiang"
    },
    {
        "id": "108",
        "area_id": 6,
        "name": "Bắc Ninh - Bắc Ninh",
        "name_filter": "bac ninh - bac ninh",
        "category": "Quận - Huyện",
        "name_nospace": "bacninh-bacninh"
    },
    {
        "id": "109",
        "area_id": 6,
        "name": "Gia Bình - Bắc Ninh",
        "name_filter": "gia binh - bac ninh",
        "category": "Quận - Huyện",
        "name_nospace": "giabinh-bacninh"
    },
    {
        "id": "110",
        "area_id": 6,
        "name": "Lương Tài - Bắc Ninh",
        "name_filter": "luong tai - bac ninh",
        "category": "Quận - Huyện",
        "name_nospace": "luongtai-bacninh"
    },
    {
        "id": "111",
        "area_id": 6,
        "name": "Quế Võ - Bắc Ninh",
        "name_filter": "que vo - bac ninh",
        "category": "Quận - Huyện",
        "name_nospace": "quevo-bacninh"
    },
    {
        "id": "112",
        "area_id": 6,
        "name": "Thuận Thành - Bắc Ninh",
        "name_filter": "thuan thanh - bac ninh",
        "category": "Quận - Huyện",
        "name_nospace": "thuanthanh-bacninh"
    },
    {
        "id": "113",
        "area_id": 6,
        "name": "Tiên Du - Bắc Ninh",
        "name_filter": "tien du - bac ninh",
        "category": "Quận - Huyện",
        "name_nospace": "tiendu-bacninh"
    },
    {
        "id": "114",
        "area_id": 6,
        "name": "Từ Sơn - Bắc Ninh",
        "name_filter": "tu son - bac ninh",
        "category": "Quận - Huyện",
        "name_nospace": "tuson-bacninh"
    },
    {
        "id": "115",
        "area_id": 6,
        "name": "Yên Phong - Bắc Ninh",
        "name_filter": "yen phong - bac ninh",
        "category": "Quận - Huyện",
        "name_nospace": "yenphong-bacninh"
    },
    {
        "id": "116",
        "area_id": 7,
        "name": "Ba Tri - Bến Tre",
        "name_filter": "ba tri - ben tre",
        "category": "Quận - Huyện",
        "name_nospace": "batri-bentre"
    },
    {
        "id": "117",
        "area_id": 7,
        "name": "Bến Tre - Bến Tre",
        "name_filter": "ben tre - ben tre",
        "category": "Quận - Huyện",
        "name_nospace": "bentre-bentre"
    },
    {
        "id": "118",
        "area_id": 7,
        "name": "Bình Đại - Bến Tre",
        "name_filter": "binh dai - ben tre",
        "category": "Quận - Huyện",
        "name_nospace": "binhdai-bentre"
    },
    {
        "id": "119",
        "area_id": 7,
        "name": "Châu Thành - Bến Tre",
        "name_filter": "chau thanh - ben tre",
        "category": "Quận - Huyện",
        "name_nospace": "chauthanh-bentre"
    },
    {
        "id": "120",
        "area_id": 7,
        "name": "Chợ Lách - Bến Tre",
        "name_filter": "cho lach - ben tre",
        "category": "Quận - Huyện",
        "name_nospace": "cholach-bentre"
    },
    {
        "id": "121",
        "area_id": 7,
        "name": "Giồng Trôm - Bến Tre",
        "name_filter": "giong trom - ben tre",
        "category": "Quận - Huyện",
        "name_nospace": "giongtrom-bentre"
    },
    {
        "id": "122",
        "area_id": 7,
        "name": "Mỏ Cày Bắc - Bến Tre",
        "name_filter": "mo cay bac - ben tre",
        "category": "Quận - Huyện",
        "name_nospace": "mocaybac-bentre"
    },
    {
        "id": "123",
        "area_id": 7,
        "name": "Mỏ Cày Nam - Bến Tre",
        "name_filter": "mo cay nam - ben tre",
        "category": "Quận - Huyện",
        "name_nospace": "mocaynam-bentre"
    },
    {
        "id": "124",
        "area_id": 7,
        "name": "Thạnh Phú - Bến Tre",
        "name_filter": "thanh phu - ben tre",
        "category": "Quận - Huyện",
        "name_nospace": "thanhphu-bentre"
    },
    {
        "id": "136",
        "area_id": 9,
        "name": "Bến Cát - Bình Dương",
        "name_filter": "ben cat - binh duong",
        "category": "Quận - Huyện",
        "name_nospace": "bencat-binhduong"
    },
    {
        "id": "137",
        "area_id": 9,
        "name": "Dầu Tiếng - Bình Dương",
        "name_filter": "dau tieng - binh duong",
        "category": "Quận - Huyện",
        "name_nospace": "dautieng-binhduong"
    },
    {
        "id": "138",
        "area_id": 9,
        "name": "Dĩ An - Bình Dương",
        "name_filter": "di an - binh duong",
        "category": "Quận - Huyện",
        "name_nospace": "dian-binhduong"
    },
    {
        "id": "139",
        "area_id": 9,
        "name": "Phú Giáo - Bình Dương",
        "name_filter": "phu giao - binh duong",
        "category": "Quận - Huyện",
        "name_nospace": "phugiao-binhduong"
    },
    {
        "id": "140",
        "area_id": 9,
        "name": "Tân Uyên - Bình Dương",
        "name_filter": "tan uyen - binh duong",
        "category": "Quận - Huyện",
        "name_nospace": "tanuyen-binhduong"
    },
    {
        "id": "141",
        "area_id": 9,
        "name": "Thủ Dầu Một - Bình Dương",
        "name_filter": "thu dau mot - binh duong",
        "category": "Quận - Huyện",
        "name_nospace": "thudaumot-binhduong"
    },
    {
        "id": "142",
        "area_id": 9,
        "name": "Thuận An - Bình Dương",
        "name_filter": "thuan an - binh duong",
        "category": "Quận - Huyện",
        "name_nospace": "thuanan-binhduong"
    },
    {
        "id": "125",
        "area_id": 8,
        "name": "An Lão - Bình Định",
        "name_filter": "an lao - binh dinh",
        "category": "Quận - Huyện",
        "name_nospace": "anlao-binhdinh"
    },
    {
        "id": "126",
        "area_id": 8,
        "name": "An Nhơn - Bình Định",
        "name_filter": "an nhon - binh dinh",
        "category": "Quận - Huyện",
        "name_nospace": "annhon-binhdinh"
    },
    {
        "id": "127",
        "area_id": 8,
        "name": "Hoài Ân - Bình Định",
        "name_filter": "hoai an - binh dinh",
        "category": "Quận - Huyện",
        "name_nospace": "hoaian-binhdinh"
    },
    {
        "id": "128",
        "area_id": 8,
        "name": "Hoài Nhơn - Bình Định",
        "name_filter": "hoai nhon - binh dinh",
        "category": "Quận - Huyện",
        "name_nospace": "hoainhon-binhdinh"
    },
    {
        "id": "129",
        "area_id": 8,
        "name": "Phù Cát - Bình Định",
        "name_filter": "phu cat - binh dinh",
        "category": "Quận - Huyện",
        "name_nospace": "phucat-binhdinh"
    },
    {
        "id": "130",
        "area_id": 8,
        "name": "Phù Mỹ - Bình Định",
        "name_filter": "phu my - binh dinh",
        "category": "Quận - Huyện",
        "name_nospace": "phumy-binhdinh"
    },
    {
        "id": "131",
        "area_id": 8,
        "name": "Qui Nhơn - Bình Định",
        "name_filter": "qui nhon - binh dinh",
        "category": "Quận - Huyện",
        "name_nospace": "quinhon-binhdinh"
    },
    {
        "id": "132",
        "area_id": 8,
        "name": "Tây Sơn - Bình Định",
        "name_filter": "tay son - binh dinh",
        "category": "Quận - Huyện",
        "name_nospace": "tayson-binhdinh"
    },
    {
        "id": "133",
        "area_id": 8,
        "name": "Tuy Phước - Bình Định",
        "name_filter": "tuy phuoc - binh dinh",
        "category": "Quận - Huyện",
        "name_nospace": "tuyphuoc-binhdinh"
    },
    {
        "id": "134",
        "area_id": 8,
        "name": "Vân Canh - Bình Định",
        "name_filter": "van canh - binh dinh",
        "category": "Quận - Huyện",
        "name_nospace": "vancanh-binhdinh"
    },
    {
        "id": "135",
        "area_id": 8,
        "name": "Vĩnh Thạnh - Bình Định",
        "name_filter": "vinh thanh - binh dinh",
        "category": "Quận - Huyện",
        "name_nospace": "vinhthanh-binhdinh"
    },
    {
        "id": "143",
        "area_id": 10,
        "name": "Bình Long - Bình Phước",
        "name_filter": "binh long - binh phuoc",
        "category": "Quận - Huyện",
        "name_nospace": "binhlong-binhphuoc"
    },
    {
        "id": "144",
        "area_id": 10,
        "name": "Bù Đăng - Bình Phước",
        "name_filter": "bu dang - binh phuoc",
        "category": "Quận - Huyện",
        "name_nospace": "budang-binhphuoc"
    },
    {
        "id": "145",
        "area_id": 10,
        "name": "Bù Đốp - Bình Phước",
        "name_filter": "bu dop - binh phuoc",
        "category": "Quận - Huyện",
        "name_nospace": "budop-binhphuoc"
    },
    {
        "id": "146",
        "area_id": 10,
        "name": "Bù Gia Mập - Bình Phước",
        "name_filter": "bu gia map - binh phuoc",
        "category": "Quận - Huyện",
        "name_nospace": "bugiamap-binhphuoc"
    },
    {
        "id": "147",
        "area_id": 10,
        "name": "Chơn Thành - Bình Phước",
        "name_filter": "chon thanh - binh phuoc",
        "category": "Quận - Huyện",
        "name_nospace": "chonthanh-binhphuoc"
    },
    {
        "id": "148",
        "area_id": 10,
        "name": "Đồng Phú - Bình Phước",
        "name_filter": "dong phu - binh phuoc",
        "category": "Quận - Huyện",
        "name_nospace": "dongphu-binhphuoc"
    },
    {
        "id": "149",
        "area_id": 10,
        "name": "Đồng Xoài - Bình Phước",
        "name_filter": "dong xoai - binh phuoc",
        "category": "Quận - Huyện",
        "name_nospace": "dongxoai-binhphuoc"
    },
    {
        "id": "150",
        "area_id": 10,
        "name": "Hớn Quản - Bình Phước",
        "name_filter": "hon quan - binh phuoc",
        "category": "Quận - Huyện",
        "name_nospace": "honquan-binhphuoc"
    },
    {
        "id": "151",
        "area_id": 10,
        "name": "Lộc Ninh - Bình Phước",
        "name_filter": "loc ninh - binh phuoc",
        "category": "Quận - Huyện",
        "name_nospace": "locninh-binhphuoc"
    },
    {
        "id": "152",
        "area_id": 10,
        "name": "Phước Long - Bình Phước",
        "name_filter": "phuoc long - binh phuoc",
        "category": "Quận - Huyện",
        "name_nospace": "phuoclong-binhphuoc"
    },
    {
        "id": "153",
        "area_id": 11,
        "name": "Bắc Bình - Bình Thuận",
        "name_filter": "bac binh - binh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "bacbinh-binhthuan"
    },
    {
        "id": "154",
        "area_id": 11,
        "name": "Đức Linh - Bình Thuận",
        "name_filter": "duc linh - binh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "duclinh-binhthuan"
    },
    {
        "id": "155",
        "area_id": 11,
        "name": "Hàm Tân - Bình Thuận",
        "name_filter": "ham tan - binh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "hamtan-binhthuan"
    },
    {
        "id": "156",
        "area_id": 11,
        "name": "Hàm Thuận Bắc - Bình Thuận",
        "name_filter": "ham thuan bac - binh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "hamthuanbac-binhthuan"
    },
    {
        "id": "157",
        "area_id": 11,
        "name": "Hàm Thuận Nam - Bình Thuận",
        "name_filter": "ham thuan nam - binh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "hamthuannam-binhthuan"
    },
    {
        "id": "158",
        "area_id": 11,
        "name": "La Gi - Bình Thuận",
        "name_filter": "la gi - binh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "lagi-binhthuan"
    },
    {
        "id": "159",
        "area_id": 11,
        "name": "Phan Thiết - Bình Thuận",
        "name_filter": "phan thiet - binh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "phanthiet-binhthuan"
    },
    {
        "id": "28458",
        "area_id": 11,
        "name": "Mũi Né - Bình Thuận",
        "name_filter": "mui ne - binh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "muine-binhthuan"
    },
    {
        "id": "114633",
        "area_id": 11,
        "name": "Phường Mũi Né - Bình Thuận",
        "name_filter": "phuong mui ne - binh thuan",
        "category": "Phường - Xã",
        "name_nospace": "phuongmuine-binhthuan"
    },
    {
        "id": "160",
        "area_id": 11,
        "name": "Phú Quý - Bình Thuận",
        "name_filter": "phu quy - binh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "phuquy-binhthuan"
    },
    {
        "id": "161",
        "area_id": 11,
        "name": "Tánh Linh - Bình Thuận",
        "name_filter": "tanh linh - binh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "tanhlinh-binhthuan"
    },
    {
        "id": "162",
        "area_id": 11,
        "name": "Tuy Phong - Bình Thuận",
        "name_filter": "tuy phong - binh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "tuyphong-binhthuan"
    },
    {
        "id": "163",
        "area_id": 12,
        "name": "Cà Mau - Cà Mau",
        "name_filter": "ca mau - ca mau",
        "category": "Quận - Huyện",
        "name_nospace": "camau-camau"
    },
    {
        "id": "164",
        "area_id": 12,
        "name": "Cái Nước - Cà Mau",
        "name_filter": "cai nuoc - ca mau",
        "category": "Quận - Huyện",
        "name_nospace": "cainuoc-camau"
    },
    {
        "id": "165",
        "area_id": 12,
        "name": "Đầm Dơi - Cà Mau",
        "name_filter": "dam doi - ca mau",
        "category": "Quận - Huyện",
        "name_nospace": "damdoi-camau"
    },
    {
        "id": "166",
        "area_id": 12,
        "name": "Năm Căn - Cà Mau",
        "name_filter": "nam can - ca mau",
        "category": "Quận - Huyện",
        "name_nospace": "namcan-camau"
    },
    {
        "id": "167",
        "area_id": 12,
        "name": "Ngọc Hiển - Cà Mau",
        "name_filter": "ngoc hien - ca mau",
        "category": "Quận - Huyện",
        "name_nospace": "ngochien-camau"
    },
    {
        "id": "168",
        "area_id": 12,
        "name": "Phú Tân - Cà Mau",
        "name_filter": "phu tan - ca mau",
        "category": "Quận - Huyện",
        "name_nospace": "phutan-camau"
    },
    {
        "id": "169",
        "area_id": 12,
        "name": "Thới Bình - Cà Mau",
        "name_filter": "thoi binh - ca mau",
        "category": "Quận - Huyện",
        "name_nospace": "thoibinh-camau"
    },
    {
        "id": "170",
        "area_id": 12,
        "name": "Trần Văn Thời - Cà Mau",
        "name_filter": "tran van thoi - ca mau",
        "category": "Quận - Huyện",
        "name_nospace": "tranvanthoi-camau"
    },
    {
        "id": "171",
        "area_id": 12,
        "name": "U Minh - Cà Mau",
        "name_filter": "u minh - ca mau",
        "category": "Quận - Huyện",
        "name_nospace": "uminh-camau"
    },
    {
        "id": "181",
        "area_id": 14,
        "name": "Bảo Lạc - Cao Bằng",
        "name_filter": "bao lac - cao bang",
        "category": "Quận - Huyện",
        "name_nospace": "baolac-caobang"
    },
    {
        "id": "182",
        "area_id": 14,
        "name": "Bảo Lâm - Cao Bằng",
        "name_filter": "bao lam - cao bang",
        "category": "Quận - Huyện",
        "name_nospace": "baolam-caobang"
    },
    {
        "id": "183",
        "area_id": 14,
        "name": "Cao Bằng - Cao Bằng",
        "name_filter": "cao bang - cao bang",
        "category": "Quận - Huyện",
        "name_nospace": "caobang-caobang"
    },
    {
        "id": "184",
        "area_id": 14,
        "name": "Hà Quảng - Cao Bằng",
        "name_filter": "ha quang - cao bang",
        "category": "Quận - Huyện",
        "name_nospace": "haquang-caobang"
    },
    {
        "id": "185",
        "area_id": 14,
        "name": "Hạ Lang - Cao Bằng",
        "name_filter": "ha lang - cao bang",
        "category": "Quận - Huyện",
        "name_nospace": "halang-caobang"
    },
    {
        "id": "186",
        "area_id": 14,
        "name": "Hòa An - Cao Bằng",
        "name_filter": "hoa an - cao bang",
        "category": "Quận - Huyện",
        "name_nospace": "hoaan-caobang"
    },
    {
        "id": "187",
        "area_id": 14,
        "name": "Nguyên Bình - Cao Bằng",
        "name_filter": "nguyen binh - cao bang",
        "category": "Quận - Huyện",
        "name_nospace": "nguyenbinh-caobang"
    },
    {
        "id": "188",
        "area_id": 14,
        "name": "Phục Hòa - Cao Bằng",
        "name_filter": "phuc hoa - cao bang",
        "category": "Quận - Huyện",
        "name_nospace": "phuchoa-caobang"
    },
    {
        "id": "189",
        "area_id": 14,
        "name": "Quảng Uyên - Cao Bằng",
        "name_filter": "quang uyen - cao bang",
        "category": "Quận - Huyện",
        "name_nospace": "quanguyen-caobang"
    },
    {
        "id": "190",
        "area_id": 14,
        "name": "Thạch An - Cao Bằng",
        "name_filter": "thach an - cao bang",
        "category": "Quận - Huyện",
        "name_nospace": "thachan-caobang"
    },
    {
        "id": "191",
        "area_id": 14,
        "name": "Thông Nông - Cao Bằng",
        "name_filter": "thong nong - cao bang",
        "category": "Quận - Huyện",
        "name_nospace": "thongnong-caobang"
    },
    {
        "id": "192",
        "area_id": 14,
        "name": "Trà Lĩnh - Cao Bằng",
        "name_filter": "tra linh - cao bang",
        "category": "Quận - Huyện",
        "name_nospace": "tralinh-caobang"
    },
    {
        "id": "193",
        "area_id": 14,
        "name": "Trùng Khánh - Cao Bằng",
        "name_filter": "trung khanh - cao bang",
        "category": "Quận - Huyện",
        "name_nospace": "trungkhanh-caobang"
    },
    {
        "id": "202",
        "area_id": 16,
        "name": "Buôn Đôn - Đắk Lắk",
        "name_filter": "buon don - dak lak",
        "category": "Quận - Huyện",
        "name_nospace": "buondon-daklak"
    },
    {
        "id": "203",
        "area_id": 16,
        "name": "Buôn Hồ - Đắk Lắk",
        "name_filter": "buon ho - dak lak",
        "category": "Quận - Huyện",
        "name_nospace": "buonho-daklak"
    },
    {
        "id": "204",
        "area_id": 16,
        "name": "Buôn Ma Thuột - Đắk Lắk",
        "name_filter": "buon ma thuot - dak lak",
        "category": "Quận - Huyện",
        "name_nospace": "buonmathuot-daklak"
    },
    {
        "id": "205",
        "area_id": 16,
        "name": "Cư Kuin - Đắk Lắk",
        "name_filter": "cu kuin - dak lak",
        "category": "Quận - Huyện",
        "name_nospace": "cukuin-daklak"
    },
    {
        "id": "206",
        "area_id": 16,
        "name": "Cư M'gar - Đắk Lắk",
        "name_filter": "cu m'gar - dak lak",
        "category": "Quận - Huyện",
        "name_nospace": "cum'gar-daklak"
    },
    {
        "id": "207",
        "area_id": 16,
        "name": "Ea H'leo - Đắk Lắk",
        "name_filter": "ea h'leo - dak lak",
        "category": "Quận - Huyện",
        "name_nospace": "eah'leo-daklak"
    },
    {
        "id": "208",
        "area_id": 16,
        "name": "Ea Kar - Đắk Lắk",
        "name_filter": "ea kar - dak lak",
        "category": "Quận - Huyện",
        "name_nospace": "eakar-daklak"
    },
    {
        "id": "209",
        "area_id": 16,
        "name": "Ea Súp - Đắk Lắk",
        "name_filter": "ea sup - dak lak",
        "category": "Quận - Huyện",
        "name_nospace": "easup-daklak"
    },
    {
        "id": "210",
        "area_id": 16,
        "name": "Krông Ana - Đắk Lắk",
        "name_filter": "krong ana - dak lak",
        "category": "Quận - Huyện",
        "name_nospace": "krongana-daklak"
    },
    {
        "id": "211",
        "area_id": 16,
        "name": "Krông Bông - Đắk Lắk",
        "name_filter": "krong bong - dak lak",
        "category": "Quận - Huyện",
        "name_nospace": "krongbong-daklak"
    },
    {
        "id": "212",
        "area_id": 16,
        "name": "Krông Búk - Đắk Lắk",
        "name_filter": "krong buk - dak lak",
        "category": "Quận - Huyện",
        "name_nospace": "krongbuk-daklak"
    },
    {
        "id": "213",
        "area_id": 16,
        "name": "Krông Năng - Đắk Lắk",
        "name_filter": "krong nang - dak lak",
        "category": "Quận - Huyện",
        "name_nospace": "krongnang-daklak"
    },
    {
        "id": "214",
        "area_id": 16,
        "name": "Krông Pắk - Đắk Lắk",
        "name_filter": "krong pak - dak lak",
        "category": "Quận - Huyện",
        "name_nospace": "krongpak-daklak"
    },
    {
        "id": "215",
        "area_id": 16,
        "name": "Lắk - Đắk Lắk",
        "name_filter": "lak - dak lak",
        "category": "Quận - Huyện",
        "name_nospace": "lak-daklak"
    },
    {
        "id": "216",
        "area_id": 16,
        "name": "M'Đrăk - Đắk Lắk",
        "name_filter": "m'drak - dak lak",
        "category": "Quận - Huyện",
        "name_nospace": "m'drak-daklak"
    },
    {
        "id": "217",
        "area_id": 17,
        "name": "Cư Jút - Đăk Nông",
        "name_filter": "cu jut - dak nong",
        "category": "Quận - Huyện",
        "name_nospace": "cujut-daknong"
    },
    {
        "id": "218",
        "area_id": 17,
        "name": "Đăk Glong - Đăk Nông",
        "name_filter": "dak glong - dak nong",
        "category": "Quận - Huyện",
        "name_nospace": "dakglong-daknong"
    },
    {
        "id": "218",
        "area_id": 17,
        "name": "Quảng Khê - Đăk Glong - Đăk Nông",
        "name_filter": "quang khe - dak glong - dak nong",
        "category": "Quận - Huyện",
        "name_nospace": "quangkhe-dakglong-daknong"
    },
    {
        "id": "218",
        "area_id": 17,
        "name": "Quảng Sơn - Đăk Glong - Đăk Nông",
        "name_filter": "quang son - dak glong - dak nong",
        "category": "Quận - Huyện",
        "name_nospace": "quangson-dakglong-daknong"
    },
    {
        "id": "219",
        "area_id": 17,
        "name": "Đăk Mil - Đăk Nông",
        "name_filter": "dak mil - dak nong",
        "category": "Quận - Huyện",
        "name_nospace": "dakmil-daknong"
    },
    {
        "id": "220",
        "area_id": 17,
        "name": "Đăk R'Lấp - Đăk Nông",
        "name_filter": "dak r'lap - dak nong",
        "category": "Quận - Huyện",
        "name_nospace": "dakr'lap-daknong"
    },
    {
        "id": "220",
        "area_id": 17,
        "name": "Kiến Đức - Đăk R'Lấp - Đăk Nông",
        "name_filter": "kien duc - dak r'lap - dak nong",
        "category": "Quận - Huyện",
        "name_nospace": "kienduc-dakr'lap-daknong"
    },
    {
        "id": "220",
        "area_id": 17,
        "name": "Nhân Cơ - Đăk R'Lấp - Đăk Nông",
        "name_filter": "nhan co - dak r'lap - dak nong",
        "category": "Quận - Huyện",
        "name_nospace": "nhanco-dakr'lap-daknong"
    },
    {
        "id": "221",
        "area_id": 17,
        "name": "Đăk Song - Đăk Nông",
        "name_filter": "dak song - dak nong",
        "category": "Quận - Huyện",
        "name_nospace": "daksong-daknong"
    },
    {
        "id": "222",
        "area_id": 17,
        "name": "Gia Nghĩa - Đăk Nông",
        "name_filter": "gia nghia - dak nong",
        "category": "Quận - Huyện",
        "name_nospace": "gianghia-daknong"
    },
    {
        "id": "223",
        "area_id": 17,
        "name": "Krông Nô - Đăk Nông",
        "name_filter": "krong no - dak nong",
        "category": "Quận - Huyện",
        "name_nospace": "krongno-daknong"
    },
    {
        "id": "224",
        "area_id": 17,
        "name": "Tuy Đức - Đăk Nông",
        "name_filter": "tuy duc - dak nong",
        "category": "Quận - Huyện",
        "name_nospace": "tuyduc-daknong"
    },
    {
        "id": "225",
        "area_id": 18,
        "name": "Điện Biên - Điện Biên",
        "name_filter": "dien bien - dien bien",
        "category": "Quận - Huyện",
        "name_nospace": "dienbien-dienbien"
    },
    {
        "id": "226",
        "area_id": 18,
        "name": "Điện Biên Đông - Điện Biên",
        "name_filter": "dien bien dong - dien bien",
        "category": "Quận - Huyện",
        "name_nospace": "dienbiendong-dienbien"
    },
    {
        "id": "227",
        "area_id": 18,
        "name": "Điện Biên Phủ - Điện Biên",
        "name_filter": "dien bien phu - dien bien",
        "category": "Quận - Huyện",
        "name_nospace": "dienbienphu-dienbien"
    },
    {
        "id": "228",
        "area_id": 18,
        "name": "Mường Ảng - Điện Biên",
        "name_filter": "muong ang - dien bien",
        "category": "Quận - Huyện",
        "name_nospace": "muongang-dienbien"
    },
    {
        "id": "229",
        "area_id": 18,
        "name": "Mường Chà - Điện Biên",
        "name_filter": "muong cha - dien bien",
        "category": "Quận - Huyện",
        "name_nospace": "muongcha-dienbien"
    },
    {
        "id": "230",
        "area_id": 18,
        "name": "Mường Lay - Điện Biên",
        "name_filter": "muong lay - dien bien",
        "category": "Quận - Huyện",
        "name_nospace": "muonglay-dienbien"
    },
    {
        "id": "231",
        "area_id": 18,
        "name": "Mường Nhé - Điện Biên",
        "name_filter": "muong nhe - dien bien",
        "category": "Quận - Huyện",
        "name_nospace": "muongnhe-dienbien"
    },
    {
        "id": "232",
        "area_id": 18,
        "name": "Nậm Pồ - Điện Biên",
        "name_filter": "nam po - dien bien",
        "category": "Quận - Huyện",
        "name_nospace": "nampo-dienbien"
    },
    {
        "id": "233",
        "area_id": 18,
        "name": "Tủa Chùa - Điện Biên",
        "name_filter": "tua chua - dien bien",
        "category": "Quận - Huyện",
        "name_nospace": "tuachua-dienbien"
    },
    {
        "id": "234",
        "area_id": 18,
        "name": "Tuần Giáo - Điện Biên",
        "name_filter": "tuan giao - dien bien",
        "category": "Quận - Huyện",
        "name_nospace": "tuangiao-dienbien"
    },
    {
        "id": "235",
        "area_id": 19,
        "name": "Biên Hòa - Đồng Nai",
        "name_filter": "bien hoa - dong nai",
        "category": "Quận - Huyện",
        "name_nospace": "bienhoa-dongnai"
    },
    {
        "id": "236",
        "area_id": 19,
        "name": "Cẩm Mỹ - Đồng Nai",
        "name_filter": "cam my - dong nai",
        "category": "Quận - Huyện",
        "name_nospace": "cammy-dongnai"
    },
    {
        "id": "237",
        "area_id": 19,
        "name": "Định Quán - Đồng Nai",
        "name_filter": "dinh quan - dong nai",
        "category": "Quận - Huyện",
        "name_nospace": "dinhquan-dongnai"
    },
    {
        "id": "238",
        "area_id": 19,
        "name": "Long Khánh - Đồng Nai",
        "name_filter": "long khanh - dong nai",
        "category": "Quận - Huyện",
        "name_nospace": "longkhanh-dongnai"
    },
    {
        "id": "239",
        "area_id": 19,
        "name": "Long Thành - Đồng Nai",
        "name_filter": "long thanh - dong nai",
        "category": "Quận - Huyện",
        "name_nospace": "longthanh-dongnai"
    },
    {
        "id": "240",
        "area_id": 19,
        "name": "Nhơn Trạch - Đồng Nai",
        "name_filter": "nhon trach - dong nai",
        "category": "Quận - Huyện",
        "name_nospace": "nhontrach-dongnai"
    },
    {
        "id": "241",
        "area_id": 19,
        "name": "Tân Phú - Đồng Nai",
        "name_filter": "tan phu - dong nai",
        "category": "Quận - Huyện",
        "name_nospace": "tanphu-dongnai"
    },
    {
        "id": "242",
        "area_id": 19,
        "name": "Thống Nhất - Đồng Nai",
        "name_filter": "thong nhat - dong nai",
        "category": "Quận - Huyện",
        "name_nospace": "thongnhat-dongnai"
    },
    {
        "id": "243",
        "area_id": 19,
        "name": "Trảng Bom - Đồng Nai",
        "name_filter": "trang bom - dong nai",
        "category": "Quận - Huyện",
        "name_nospace": "trangbom-dongnai"
    },
    {
        "id": "244",
        "area_id": 19,
        "name": "Vĩnh Cửu - Đồng Nai",
        "name_filter": "vinh cuu - dong nai",
        "category": "Quận - Huyện",
        "name_nospace": "vinhcuu-dongnai"
    },
    {
        "id": "245",
        "area_id": 19,
        "name": "Xuân Lộc - Đồng Nai",
        "name_filter": "xuan loc - dong nai",
        "category": "Quận - Huyện",
        "name_nospace": "xuanloc-dongnai"
    },
    {
        "id": "246",
        "area_id": 20,
        "name": "Tp.Cao Lãnh - Đồng Tháp",
        "name_filter": "tp.cao lanh - dong thap",
        "category": "Quận - Huyện",
        "name_nospace": "tp.caolanh-dongthap"
    },
    {
        "id": "247",
        "area_id": 20,
        "name": "H.Cao Lãnh - Đồng Tháp",
        "name_filter": "h.cao lanh - dong thap",
        "category": "Quận - Huyện",
        "name_nospace": "h.caolanh-dongthap"
    },
    {
        "id": "248",
        "area_id": 20,
        "name": "Châu Thành - Đồng Tháp",
        "name_filter": "chau thanh - dong thap",
        "category": "Quận - Huyện",
        "name_nospace": "chauthanh-dongthap"
    },
    {
        "id": "249",
        "area_id": 20,
        "name": "Hồng Ngự - Đồng Tháp",
        "name_filter": "hong ngu - dong thap",
        "category": "Quận - Huyện",
        "name_nospace": "hongngu-dongthap"
    },
    {
        "id": "250",
        "area_id": 20,
        "name": "Hồng Ngự - Đồng Tháp",
        "name_filter": "hong ngu - dong thap",
        "category": "Quận - Huyện",
        "name_nospace": "hongngu-dongthap"
    },
    {
        "id": "251",
        "area_id": 20,
        "name": "Lai Vung - Đồng Tháp",
        "name_filter": "lai vung - dong thap",
        "category": "Quận - Huyện",
        "name_nospace": "laivung-dongthap"
    },
    {
        "id": "252",
        "area_id": 20,
        "name": "Lấp Vò - Đồng Tháp",
        "name_filter": "lap vo - dong thap",
        "category": "Quận - Huyện",
        "name_nospace": "lapvo-dongthap"
    },
    {
        "id": "253",
        "area_id": 20,
        "name": "Sa Đéc - Đồng Tháp",
        "name_filter": "sa dec - dong thap",
        "category": "Quận - Huyện",
        "name_nospace": "sadec-dongthap"
    },
    {
        "id": "254",
        "area_id": 20,
        "name": "Tam Nông - Đồng Tháp",
        "name_filter": "tam nong - dong thap",
        "category": "Quận - Huyện",
        "name_nospace": "tamnong-dongthap"
    },
    {
        "id": "255",
        "area_id": 20,
        "name": "Tân Hồng - Đồng Tháp",
        "name_filter": "tan hong - dong thap",
        "category": "Quận - Huyện",
        "name_nospace": "tanhong-dongthap"
    },
    {
        "id": "256",
        "area_id": 20,
        "name": "Thanh Bình - Đồng Tháp",
        "name_filter": "thanh binh - dong thap",
        "category": "Quận - Huyện",
        "name_nospace": "thanhbinh-dongthap"
    },
    {
        "id": "257",
        "area_id": 20,
        "name": "Tháp Mười - Đồng Tháp",
        "name_filter": "thap muoi - dong thap",
        "category": "Quận - Huyện",
        "name_nospace": "thapmuoi-dongthap"
    },
    {
        "id": "258",
        "area_id": 21,
        "name": "An Khê - Gia Lai",
        "name_filter": "an khe - gia lai",
        "category": "Quận - Huyện",
        "name_nospace": "ankhe-gialai"
    },
    {
        "id": "259",
        "area_id": 21,
        "name": "Ayun Pa - Gia Lai",
        "name_filter": "ayun pa - gia lai",
        "category": "Quận - Huyện",
        "name_nospace": "ayunpa-gialai"
    },
    {
        "id": "260",
        "area_id": 21,
        "name": "Chư Păh - Gia Lai",
        "name_filter": "chu pah - gia lai",
        "category": "Quận - Huyện",
        "name_nospace": "chupah-gialai"
    },
    {
        "id": "261",
        "area_id": 21,
        "name": "Chư Prông - Gia Lai",
        "name_filter": "chu prong - gia lai",
        "category": "Quận - Huyện",
        "name_nospace": "chuprong-gialai"
    },
    {
        "id": "262",
        "area_id": 21,
        "name": "Chư Pưh - Gia Lai",
        "name_filter": "chu puh - gia lai",
        "category": "Quận - Huyện",
        "name_nospace": "chupuh-gialai"
    },
    {
        "id": "263",
        "area_id": 21,
        "name": "Chư Sê - Gia Lai",
        "name_filter": "chu se - gia lai",
        "category": "Quận - Huyện",
        "name_nospace": "chuse-gialai"
    },
    {
        "id": "264",
        "area_id": 21,
        "name": "Đăk Đoa - Gia Lai",
        "name_filter": "dak doa - gia lai",
        "category": "Quận - Huyện",
        "name_nospace": "dakdoa-gialai"
    },
    {
        "id": "265",
        "area_id": 21,
        "name": "Đắk Pơ - Gia Lai",
        "name_filter": "dak po - gia lai",
        "category": "Quận - Huyện",
        "name_nospace": "dakpo-gialai"
    },
    {
        "id": "266",
        "area_id": 21,
        "name": "Đức Cơ - Gia Lai",
        "name_filter": "duc co - gia lai",
        "category": "Quận - Huyện",
        "name_nospace": "ducco-gialai"
    },
    {
        "id": "267",
        "area_id": 21,
        "name": "Ia Grai - Gia Lai",
        "name_filter": "ia grai - gia lai",
        "category": "Quận - Huyện",
        "name_nospace": "iagrai-gialai"
    },
    {
        "id": "268",
        "area_id": 21,
        "name": "Ia Pa - Gia Lai",
        "name_filter": "ia pa - gia lai",
        "category": "Quận - Huyện",
        "name_nospace": "iapa-gialai"
    },
    {
        "id": "269",
        "area_id": 21,
        "name": "KBang - Gia Lai",
        "name_filter": "kbang - gia lai",
        "category": "Quận - Huyện",
        "name_nospace": "kbang-gialai"
    },
    {
        "id": "270",
        "area_id": 21,
        "name": "Kông Chro - Gia Lai",
        "name_filter": "kong chro - gia lai",
        "category": "Quận - Huyện",
        "name_nospace": "kongchro-gialai"
    },
    {
        "id": "271",
        "area_id": 21,
        "name": "Krông Pa - Gia Lai",
        "name_filter": "krong pa - gia lai",
        "category": "Quận - Huyện",
        "name_nospace": "krongpa-gialai"
    },
    {
        "id": "272",
        "area_id": 21,
        "name": "Mang Yang - Gia Lai",
        "name_filter": "mang yang - gia lai",
        "category": "Quận - Huyện",
        "name_nospace": "mangyang-gialai"
    },
    {
        "id": "273",
        "area_id": 21,
        "name": "Phú Thiện - Gia Lai",
        "name_filter": "phu thien - gia lai",
        "category": "Quận - Huyện",
        "name_nospace": "phuthien-gialai"
    },
    {
        "id": "274",
        "area_id": 21,
        "name": "Pleiku - Gia Lai",
        "name_filter": "pleiku - gia lai",
        "category": "Quận - Huyện",
        "name_nospace": "pleiku-gialai"
    },
    {
        "id": "275",
        "area_id": 22,
        "name": "Bắc Mê - Hà Giang",
        "name_filter": "bac me - ha giang",
        "category": "Quận - Huyện",
        "name_nospace": "bacme-hagiang"
    },
    {
        "id": "276",
        "area_id": 22,
        "name": "Bắc Quang - Hà Giang",
        "name_filter": "bac quang - ha giang",
        "category": "Quận - Huyện",
        "name_nospace": "bacquang-hagiang"
    },
    {
        "id": "277",
        "area_id": 22,
        "name": "Đồng Văn - Hà Giang",
        "name_filter": "dong van - ha giang",
        "category": "Quận - Huyện",
        "name_nospace": "dongvan-hagiang"
    },
    {
        "id": "278",
        "area_id": 22,
        "name": "Hà Giang - Hà Giang",
        "name_filter": "ha giang - ha giang",
        "category": "Quận - Huyện",
        "name_nospace": "hagiang-hagiang"
    },
    {
        "id": "279",
        "area_id": 22,
        "name": "Hoàng Su Phì - Hà Giang",
        "name_filter": "hoang su phi - ha giang",
        "category": "Quận - Huyện",
        "name_nospace": "hoangsuphi-hagiang"
    },
    {
        "id": "280",
        "area_id": 22,
        "name": "Mèo Vạc - Hà Giang",
        "name_filter": "meo vac - ha giang",
        "category": "Quận - Huyện",
        "name_nospace": "meovac-hagiang"
    },
    {
        "id": "281",
        "area_id": 22,
        "name": "Quản Bạ - Hà Giang",
        "name_filter": "quan ba - ha giang",
        "category": "Quận - Huyện",
        "name_nospace": "quanba-hagiang"
    },
    {
        "id": "282",
        "area_id": 22,
        "name": "Quang Bình - Hà Giang",
        "name_filter": "quang binh - ha giang",
        "category": "Quận - Huyện",
        "name_nospace": "quangbinh-hagiang"
    },
    {
        "id": "283",
        "area_id": 22,
        "name": "Vị Xuyên - Hà Giang",
        "name_filter": "vi xuyen - ha giang",
        "category": "Quận - Huyện",
        "name_nospace": "vixuyen-hagiang"
    },
    {
        "id": "284",
        "area_id": 22,
        "name": "Xín Mần - Hà Giang",
        "name_filter": "xin man - ha giang",
        "category": "Quận - Huyện",
        "name_nospace": "xinman-hagiang"
    },
    {
        "id": "285",
        "area_id": 22,
        "name": "Yên Minh - Hà Giang",
        "name_filter": "yen minh - ha giang",
        "category": "Quận - Huyện",
        "name_nospace": "yenminh-hagiang"
    },
    {
        "id": "286",
        "area_id": 23,
        "name": "Bình Lục - Hà Nam",
        "name_filter": "binh luc - ha nam",
        "category": "Quận - Huyện",
        "name_nospace": "binhluc-hanam"
    },
    {
        "id": "287",
        "area_id": 23,
        "name": "Duy Tiên - Hà Nam",
        "name_filter": "duy tien - ha nam",
        "category": "Quận - Huyện",
        "name_nospace": "duytien-hanam"
    },
    {
        "id": "288",
        "area_id": 23,
        "name": "Kim Bảng - Hà Nam",
        "name_filter": "kim bang - ha nam",
        "category": "Quận - Huyện",
        "name_nospace": "kimbang-hanam"
    },
    {
        "id": "289",
        "area_id": 23,
        "name": "Lý Nhân - Hà Nam",
        "name_filter": "ly nhan - ha nam",
        "category": "Quận - Huyện",
        "name_nospace": "lynhan-hanam"
    },
    {
        "id": "290",
        "area_id": 23,
        "name": "Phủ Lý - Hà Nam",
        "name_filter": "phu ly - ha nam",
        "category": "Quận - Huyện",
        "name_nospace": "phuly-hanam"
    },
    {
        "id": "291",
        "area_id": 23,
        "name": "Thanh Liêm - Hà Nam",
        "name_filter": "thanh liem - ha nam",
        "category": "Quận - Huyện",
        "name_nospace": "thanhliem-hanam"
    },
    {
        "id": "321",
        "area_id": 25,
        "name": "Can Lộc - Hà Tĩnh",
        "name_filter": "can loc - ha tinh",
        "category": "Quận - Huyện",
        "name_nospace": "canloc-hatinh"
    },
    {
        "id": "322",
        "area_id": 25,
        "name": "Cẩm Xuyên - Hà Tĩnh",
        "name_filter": "cam xuyen - ha tinh",
        "category": "Quận - Huyện",
        "name_nospace": "camxuyen-hatinh"
    },
    {
        "id": "323",
        "area_id": 25,
        "name": "Đức Thọ - Hà Tĩnh",
        "name_filter": "duc tho - ha tinh",
        "category": "Quận - Huyện",
        "name_nospace": "ductho-hatinh"
    },
    {
        "id": "324",
        "area_id": 25,
        "name": "Hà Tĩnh - Hà Tĩnh",
        "name_filter": "ha tinh - ha tinh",
        "category": "Quận - Huyện",
        "name_nospace": "hatinh-hatinh"
    },
    {
        "id": "325",
        "area_id": 25,
        "name": "Hồng Lĩnh - Hà Tĩnh",
        "name_filter": "hong linh - ha tinh",
        "category": "Quận - Huyện",
        "name_nospace": "honglinh-hatinh"
    },
    {
        "id": "326",
        "area_id": 25,
        "name": "Hương Khê - Hà Tĩnh",
        "name_filter": "huong khe - ha tinh",
        "category": "Quận - Huyện",
        "name_nospace": "huongkhe-hatinh"
    },
    {
        "id": "327",
        "area_id": 25,
        "name": "Hương Sơn - Hà Tĩnh",
        "name_filter": "huong son - ha tinh",
        "category": "Quận - Huyện",
        "name_nospace": "huongson-hatinh"
    },
    {
        "id": "328",
        "area_id": 25,
        "name": "Kỳ Anh - Hà Tĩnh",
        "name_filter": "ky anh - ha tinh",
        "category": "Quận - Huyện",
        "name_nospace": "kyanh-hatinh"
    },
    {
        "id": "329",
        "area_id": 25,
        "name": "Lộc Hà - Hà Tĩnh",
        "name_filter": "loc ha - ha tinh",
        "category": "Quận - Huyện",
        "name_nospace": "locha-hatinh"
    },
    {
        "id": "330",
        "area_id": 25,
        "name": "Nghi Xuân - Hà Tĩnh",
        "name_filter": "nghi xuan - ha tinh",
        "category": "Quận - Huyện",
        "name_nospace": "nghixuan-hatinh"
    },
    {
        "id": "331",
        "area_id": 25,
        "name": "Thạch Hà - Hà Tĩnh",
        "name_filter": "thach ha - ha tinh",
        "category": "Quận - Huyện",
        "name_nospace": "thachha-hatinh"
    },
    {
        "id": "332",
        "area_id": 25,
        "name": "Vũ Quang - Hà Tĩnh",
        "name_filter": "vu quang - ha tinh",
        "category": "Quận - Huyện",
        "name_nospace": "vuquang-hatinh"
    },
    {
        "id": "333",
        "area_id": 26,
        "name": "Bình Giang - Hải Dương",
        "name_filter": "binh giang - hai duong",
        "category": "Quận - Huyện",
        "name_nospace": "binhgiang-haiduong"
    },
    {
        "id": "334",
        "area_id": 26,
        "name": "Cẩm Giàng - Hải Dương",
        "name_filter": "cam giang - hai duong",
        "category": "Quận - Huyện",
        "name_nospace": "camgiang-haiduong"
    },
    {
        "id": "335",
        "area_id": 26,
        "name": "Chí Linh - Hải Dương",
        "name_filter": "chi linh - hai duong",
        "category": "Quận - Huyện",
        "name_nospace": "chilinh-haiduong"
    },
    {
        "id": "336",
        "area_id": 26,
        "name": "Gia Lộc - Hải Dương",
        "name_filter": "gia loc - hai duong",
        "category": "Quận - Huyện",
        "name_nospace": "gialoc-haiduong"
    },
    {
        "id": "337",
        "area_id": 26,
        "name": "Hải Dương - Hải Dương",
        "name_filter": "hai duong - hai duong",
        "category": "Quận - Huyện",
        "name_nospace": "haiduong-haiduong"
    },
    {
        "id": "338",
        "area_id": 26,
        "name": "Kim Thành - Hải Dương",
        "name_filter": "kim thanh - hai duong",
        "category": "Quận - Huyện",
        "name_nospace": "kimthanh-haiduong"
    },
    {
        "id": "339",
        "area_id": 26,
        "name": "Kinh Môn - Hải Dương",
        "name_filter": "kinh mon - hai duong",
        "category": "Quận - Huyện",
        "name_nospace": "kinhmon-haiduong"
    },
    {
        "id": "340",
        "area_id": 26,
        "name": "Nam Sách - Hải Dương",
        "name_filter": "nam sach - hai duong",
        "category": "Quận - Huyện",
        "name_nospace": "namsach-haiduong"
    },
    {
        "id": "341",
        "area_id": 26,
        "name": "Ninh Giang - Hải Dương",
        "name_filter": "ninh giang - hai duong",
        "category": "Quận - Huyện",
        "name_nospace": "ninhgiang-haiduong"
    },
    {
        "id": "342",
        "area_id": 26,
        "name": "Thanh Hà - Hải Dương",
        "name_filter": "thanh ha - hai duong",
        "category": "Quận - Huyện",
        "name_nospace": "thanhha-haiduong"
    },
    {
        "id": "343",
        "area_id": 26,
        "name": "Thanh Miện - Hải Dương",
        "name_filter": "thanh mien - hai duong",
        "category": "Quận - Huyện",
        "name_nospace": "thanhmien-haiduong"
    },
    {
        "id": "344",
        "area_id": 26,
        "name": "Tứ Kỳ - Hải Dương",
        "name_filter": "tu ky - hai duong",
        "category": "Quận - Huyện",
        "name_nospace": "tuky-haiduong"
    },
    {
        "id": "360",
        "area_id": 28,
        "name": "Châu Thành - Hậu Giang",
        "name_filter": "chau thanh - hau giang",
        "category": "Quận - Huyện",
        "name_nospace": "chauthanh-haugiang"
    },
    {
        "id": "361",
        "area_id": 28,
        "name": "Châu Thành A - Hậu Giang",
        "name_filter": "chau thanh a - hau giang",
        "category": "Quận - Huyện",
        "name_nospace": "chauthanha-haugiang"
    },
    {
        "id": "362",
        "area_id": 28,
        "name": "Long Mỹ - Hậu Giang",
        "name_filter": "long my - hau giang",
        "category": "Quận - Huyện",
        "name_nospace": "longmy-haugiang"
    },
    {
        "id": "363",
        "area_id": 28,
        "name": "Ngã Bảy - Hậu Giang",
        "name_filter": "nga bay - hau giang",
        "category": "Quận - Huyện",
        "name_nospace": "ngabay-haugiang"
    },
    {
        "id": "364",
        "area_id": 28,
        "name": "Phụng Hiệp - Hậu Giang",
        "name_filter": "phung hiep - hau giang",
        "category": "Quận - Huyện",
        "name_nospace": "phunghiep-haugiang"
    },
    {
        "id": "365",
        "area_id": 28,
        "name": "Vị Thanh - Hậu Giang",
        "name_filter": "vi thanh - hau giang",
        "category": "Quận - Huyện",
        "name_nospace": "vithanh-haugiang"
    },
    {
        "id": "366",
        "area_id": 28,
        "name": "Vị Thủy - Hậu Giang",
        "name_filter": "vi thuy - hau giang",
        "category": "Quận - Huyện",
        "name_nospace": "vithuy-haugiang"
    },
    {
        "id": "391",
        "area_id": 30,
        "name": "Cao Phong - Hòa Bình",
        "name_filter": "cao phong - hoa binh",
        "category": "Quận - Huyện",
        "name_nospace": "caophong-hoabinh"
    },
    {
        "id": "392",
        "area_id": 30,
        "name": "Đà Bắc - Hòa Bình",
        "name_filter": "da bac - hoa binh",
        "category": "Quận - Huyện",
        "name_nospace": "dabac-hoabinh"
    },
    {
        "id": "393",
        "area_id": 30,
        "name": "Hoà Bình - Hòa Bình",
        "name_filter": "hoa binh - hoa binh",
        "category": "Quận - Huyện",
        "name_nospace": "hoabinh-hoabinh"
    },
    {
        "id": "394",
        "area_id": 30,
        "name": "Kim Bôi - Hòa Bình",
        "name_filter": "kim boi - hoa binh",
        "category": "Quận - Huyện",
        "name_nospace": "kimboi-hoabinh"
    },
    {
        "id": "395",
        "area_id": 30,
        "name": "Kỳ Sơn - Hòa Bình",
        "name_filter": "ky son - hoa binh",
        "category": "Quận - Huyện",
        "name_nospace": "kyson-hoabinh"
    },
    {
        "id": "396",
        "area_id": 30,
        "name": "Lạc Sơn - Hòa Bình",
        "name_filter": "lac son - hoa binh",
        "category": "Quận - Huyện",
        "name_nospace": "lacson-hoabinh"
    },
    {
        "id": "397",
        "area_id": 30,
        "name": "Lạc Thủy - Hòa Bình",
        "name_filter": "lac thuy - hoa binh",
        "category": "Quận - Huyện",
        "name_nospace": "lacthuy-hoabinh"
    },
    {
        "id": "398",
        "area_id": 30,
        "name": "Lương Sơn - Hòa Bình",
        "name_filter": "luong son - hoa binh",
        "category": "Quận - Huyện",
        "name_nospace": "luongson-hoabinh"
    },
    {
        "id": "399",
        "area_id": 30,
        "name": "Mai Châu - Hòa Bình",
        "name_filter": "mai chau - hoa binh",
        "category": "Quận - Huyện",
        "name_nospace": "maichau-hoabinh"
    },
    {
        "id": "400",
        "area_id": 30,
        "name": "Tân Lạc - Hòa Bình",
        "name_filter": "tan lac - hoa binh",
        "category": "Quận - Huyện",
        "name_nospace": "tanlac-hoabinh"
    },
    {
        "id": "401",
        "area_id": 30,
        "name": "Yên Thủy - Hòa Bình",
        "name_filter": "yen thuy - hoa binh",
        "category": "Quận - Huyện",
        "name_nospace": "yenthuy-hoabinh"
    },
    {
        "id": "402",
        "area_id": 31,
        "name": "Ân Thi - Hưng Yên",
        "name_filter": "an thi - hung yen",
        "category": "Quận - Huyện",
        "name_nospace": "anthi-hungyen"
    },
    {
        "id": "403",
        "area_id": 31,
        "name": "Hưng Yên - Hưng Yên",
        "name_filter": "hung yen - hung yen",
        "category": "Quận - Huyện",
        "name_nospace": "hungyen-hungyen"
    },
    {
        "id": "404",
        "area_id": 31,
        "name": "Khoái Châu - Hưng Yên",
        "name_filter": "khoai chau - hung yen",
        "category": "Quận - Huyện",
        "name_nospace": "khoaichau-hungyen"
    },
    {
        "id": "405",
        "area_id": 31,
        "name": "Kim Động - Hưng Yên",
        "name_filter": "kim dong - hung yen",
        "category": "Quận - Huyện",
        "name_nospace": "kimdong-hungyen"
    },
    {
        "id": "406",
        "area_id": 31,
        "name": "Mỹ Hào - Hưng Yên",
        "name_filter": "my hao - hung yen",
        "category": "Quận - Huyện",
        "name_nospace": "myhao-hungyen"
    },
    {
        "id": "407",
        "area_id": 31,
        "name": "Phù Cừ - Hưng Yên",
        "name_filter": "phu cu - hung yen",
        "category": "Quận - Huyện",
        "name_nospace": "phucu-hungyen"
    },
    {
        "id": "408",
        "area_id": 31,
        "name": "Tiên Lữ - Hưng Yên",
        "name_filter": "tien lu - hung yen",
        "category": "Quận - Huyện",
        "name_nospace": "tienlu-hungyen"
    },
    {
        "id": "409",
        "area_id": 31,
        "name": "Văn Giang - Hưng Yên",
        "name_filter": "van giang - hung yen",
        "category": "Quận - Huyện",
        "name_nospace": "vangiang-hungyen"
    },
    {
        "id": "410",
        "area_id": 31,
        "name": "Văn Lâm - Hưng Yên",
        "name_filter": "van lam - hung yen",
        "category": "Quận - Huyện",
        "name_nospace": "vanlam-hungyen"
    },
    {
        "id": "411",
        "area_id": 31,
        "name": "Yên Mỹ - Hưng Yên",
        "name_filter": "yen my - hung yen",
        "category": "Quận - Huyện",
        "name_nospace": "yenmy-hungyen"
    },
    {
        "id": "412",
        "area_id": 32,
        "name": "Cam Lâm - Khánh Hòa",
        "name_filter": "cam lam - khanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "camlam-khanhhoa"
    },
    {
        "id": "413",
        "area_id": 32,
        "name": "Cam Ranh - Khánh Hòa",
        "name_filter": "cam ranh - khanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "camranh-khanhhoa"
    },
    {
        "id": "413",
        "area_id": 32,
        "name": "Bình Ba - Cam Ranh - Khánh Hòa",
        "name_filter": "binh ba - cam ranh - khanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "binhba-camranh-khanhhoa"
    },
    {
        "id": "414",
        "area_id": 32,
        "name": "Diên Khánh - Khánh Hòa",
        "name_filter": "dien khanh - khanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "dienkhanh-khanhhoa"
    },
    {
        "id": "415",
        "area_id": 32,
        "name": "Khánh Sơn - Khánh Hòa",
        "name_filter": "khanh son - khanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "khanhson-khanhhoa"
    },
    {
        "id": "416",
        "area_id": 32,
        "name": "Khánh Vĩnh - Khánh Hòa",
        "name_filter": "khanh vinh - khanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "khanhvinh-khanhhoa"
    },
    {
        "id": "417",
        "area_id": 32,
        "name": "Nha Trang - Khánh Hòa",
        "name_filter": "nha trang - khanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "nhatrang-khanhhoa"
    },
    {
        "id": "418",
        "area_id": 32,
        "name": "Ninh Hòa - Khánh Hòa",
        "name_filter": "ninh hoa - khanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "ninhhoa-khanhhoa"
    },
    {
        "id": "418",
        "area_id": 32,
        "name": "Dốc Lết - Ninh Hòa - Khánh Hòa",
        "name_filter": "doc let - ninh hoa - khanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "doclet-ninhhoa-khanhhoa"
    },
    {
        "id": "419",
        "area_id": 32,
        "name": "Trường Sa - Khánh Hòa",
        "name_filter": "truong sa - khanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "truongsa-khanhhoa"
    },
    {
        "id": "420",
        "area_id": 32,
        "name": "Vạn Ninh - Khánh Hòa",
        "name_filter": "van ninh - khanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "vanninh-khanhhoa"
    },
    {
        "id": "420",
        "area_id": 32,
        "name": "Đại Lãnh - Vạn Ninh - Khánh Hòa",
        "name_filter": "dai lanh - van ninh - khanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "dailanh-vanninh-khanhhoa"
    },
    {
        "id": "420",
        "area_id": 32,
        "name": "Đầm Môn - Vạn Ninh - Khánh Hòa",
        "name_filter": "dam mon - van ninh - khanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "dammon-vanninh-khanhhoa"
    },
    {
        "id": "420",
        "area_id": 32,
        "name": "Điệp Sơn - Vạn Ninh - Khánh Hòa",
        "name_filter": "diep son - van ninh - khanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "diepson-vanninh-khanhhoa"
    },
    {
        "id": "420",
        "area_id": 32,
        "name": "Vịnh Vân Phong - Vạn Ninh - Khánh Hòa",
        "name_filter": "vinh van phong - van ninh - khanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "vinhvanphong-vanninh-khanhhoa"
    },
    {
        "id": "420",
        "area_id": 32,
        "name": "Vạn Giã - Khánh Hòa",
        "name_filter": "van gia - khanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "vangia-khanhhoa"
    },
    {
        "id": "421",
        "area_id": 33,
        "name": "An Biên - Kiên Giang",
        "name_filter": "an bien - kien giang",
        "category": "Quận - Huyện",
        "name_nospace": "anbien-kiengiang"
    },
    {
        "id": "422",
        "area_id": 33,
        "name": "An Minh - Kiên Giang",
        "name_filter": "an minh - kien giang",
        "category": "Quận - Huyện",
        "name_nospace": "anminh-kiengiang"
    },
    {
        "id": "423",
        "area_id": 33,
        "name": "Châu Thành - Kiên Giang",
        "name_filter": "chau thanh - kien giang",
        "category": "Quận - Huyện",
        "name_nospace": "chauthanh-kiengiang"
    },
    {
        "id": "424",
        "area_id": 33,
        "name": "Giang Thành - Kiên Giang",
        "name_filter": "giang thanh - kien giang",
        "category": "Quận - Huyện",
        "name_nospace": "giangthanh-kiengiang"
    },
    {
        "id": "425",
        "area_id": 33,
        "name": "Giồng Riềng - Kiên Giang",
        "name_filter": "giong rieng - kien giang",
        "category": "Quận - Huyện",
        "name_nospace": "giongrieng-kiengiang"
    },
    {
        "id": "426",
        "area_id": 33,
        "name": "Gò Quao - Kiên Giang",
        "name_filter": "go quao - kien giang",
        "category": "Quận - Huyện",
        "name_nospace": "goquao-kiengiang"
    },
    {
        "id": "427",
        "area_id": 33,
        "name": "Hà Tiên - Kiên Giang",
        "name_filter": "ha tien - kien giang",
        "category": "Quận - Huyện",
        "name_nospace": "hatien-kiengiang"
    },
    {
        "id": "428",
        "area_id": 33,
        "name": "Hòn Đất - Kiên Giang",
        "name_filter": "hon dat - kien giang",
        "category": "Quận - Huyện",
        "name_nospace": "hondat-kiengiang"
    },
    {
        "id": "429",
        "area_id": 33,
        "name": "Kiên Hải - Kiên Giang",
        "name_filter": "kien hai - kien giang",
        "category": "Quận - Huyện",
        "name_nospace": "kienhai-kiengiang"
    },
    {
        "id": "430",
        "area_id": 33,
        "name": "Kiên Lương - Kiên Giang",
        "name_filter": "kien luong - kien giang",
        "category": "Quận - Huyện",
        "name_nospace": "kienluong-kiengiang"
    },
    {
        "id": "431",
        "area_id": 33,
        "name": "Phú Quốc - Kiên Giang",
        "name_filter": "phu quoc - kien giang",
        "category": "Quận - Huyện",
        "name_nospace": "phuquoc-kiengiang"
    },
    {
        "id": "432",
        "area_id": 33,
        "name": "Rạch Giá - Kiên Giang",
        "name_filter": "rach gia - kien giang",
        "category": "Quận - Huyện",
        "name_nospace": "rachgia-kiengiang"
    },
    {
        "id": "432",
        "area_id": 33,
        "name": "Nam Du - Rạch Giá - Kiên Giang",
        "name_filter": "nam du - rach gia - kien giang",
        "category": "Quận - Huyện",
        "name_nospace": "namdu-rachgia-kiengiang"
    },
    {
        "id": "433",
        "area_id": 33,
        "name": "Tân Hiệp - Kiên Giang",
        "name_filter": "tan hiep - kien giang",
        "category": "Quận - Huyện",
        "name_nospace": "tanhiep-kiengiang"
    },
    {
        "id": "434",
        "area_id": 33,
        "name": "U Minh Thượng - Kiên Giang",
        "name_filter": "u minh thuong - kien giang",
        "category": "Quận - Huyện",
        "name_nospace": "uminhthuong-kiengiang"
    },
    {
        "id": "435",
        "area_id": 33,
        "name": "Vĩnh Thuận - Kiên Giang",
        "name_filter": "vinh thuan - kien giang",
        "category": "Quận - Huyện",
        "name_nospace": "vinhthuan-kiengiang"
    },
    {
        "id": "436",
        "area_id": 34,
        "name": "Đắk Glei - Kon Tum",
        "name_filter": "dak glei - kon tum",
        "category": "Quận - Huyện",
        "name_nospace": "dakglei-kontum"
    },
    {
        "id": "437",
        "area_id": 34,
        "name": "Đắk Hà - Kon Tum",
        "name_filter": "dak ha - kon tum",
        "category": "Quận - Huyện",
        "name_nospace": "dakha-kontum"
    },
    {
        "id": "438",
        "area_id": 34,
        "name": "Đăk Tô - Kon Tum",
        "name_filter": "dak to - kon tum",
        "category": "Quận - Huyện",
        "name_nospace": "dakto-kontum"
    },
    {
        "id": "439",
        "area_id": 34,
        "name": "Kon Plông - Kon Tum",
        "name_filter": "kon plong - kon tum",
        "category": "Quận - Huyện",
        "name_nospace": "konplong-kontum"
    },
    {
        "id": "440",
        "area_id": 34,
        "name": "Kon Rẫy - Kon Tum",
        "name_filter": "kon ray - kon tum",
        "category": "Quận - Huyện",
        "name_nospace": "konray-kontum"
    },
    {
        "id": "441",
        "area_id": 34,
        "name": "Kon Tum - Kon Tum",
        "name_filter": "kon tum - kon tum",
        "category": "Quận - Huyện",
        "name_nospace": "kontum-kontum"
    },
    {
        "id": "442",
        "area_id": 34,
        "name": "Ngọc Hồi - Kon Tum",
        "name_filter": "ngoc hoi - kon tum",
        "category": "Quận - Huyện",
        "name_nospace": "ngochoi-kontum"
    },
    {
        "id": "443",
        "area_id": 34,
        "name": "Sa Thầy - Kon Tum",
        "name_filter": "sa thay - kon tum",
        "category": "Quận - Huyện",
        "name_nospace": "sathay-kontum"
    },
    {
        "id": "444",
        "area_id": 34,
        "name": "Tu Mơ Rông - Kon Tum",
        "name_filter": "tu mo rong - kon tum",
        "category": "Quận - Huyện",
        "name_nospace": "tumorong-kontum"
    },
    {
        "id": "445",
        "area_id": 35,
        "name": "Lai Châu - Lai Châu",
        "name_filter": "lai chau - lai chau",
        "category": "Quận - Huyện",
        "name_nospace": "laichau-laichau"
    },
    {
        "id": "446",
        "area_id": 35,
        "name": "Mường Tè - Lai Châu",
        "name_filter": "muong te - lai chau",
        "category": "Quận - Huyện",
        "name_nospace": "muongte-laichau"
    },
    {
        "id": "447",
        "area_id": 35,
        "name": "Nậm Nhùn - Lai Châu",
        "name_filter": "nam nhun - lai chau",
        "category": "Quận - Huyện",
        "name_nospace": "namnhun-laichau"
    },
    {
        "id": "448",
        "area_id": 35,
        "name": "Phong Thổ - Lai Châu",
        "name_filter": "phong tho - lai chau",
        "category": "Quận - Huyện",
        "name_nospace": "phongtho-laichau"
    },
    {
        "id": "449",
        "area_id": 35,
        "name": "Sìn Hồ - Lai Châu",
        "name_filter": "sin ho - lai chau",
        "category": "Quận - Huyện",
        "name_nospace": "sinho-laichau"
    },
    {
        "id": "450",
        "area_id": 35,
        "name": "Tam Đường - Lai Châu",
        "name_filter": "tam duong - lai chau",
        "category": "Quận - Huyện",
        "name_nospace": "tamduong-laichau"
    },
    {
        "id": "451",
        "area_id": 35,
        "name": "Tân Uyên - Lai Châu",
        "name_filter": "tan uyen - lai chau",
        "category": "Quận - Huyện",
        "name_nospace": "tanuyen-laichau"
    },
    {
        "id": "452",
        "area_id": 35,
        "name": "Than Uyên - Lai Châu",
        "name_filter": "than uyen - lai chau",
        "category": "Quận - Huyện",
        "name_nospace": "thanuyen-laichau"
    },
    {
        "id": "453",
        "area_id": 36,
        "name": "Bảo Lâm - Lâm Đồng",
        "name_filter": "bao lam - lam dong",
        "category": "Quận - Huyện",
        "name_nospace": "baolam-lamdong"
    },
    {
        "id": "454",
        "area_id": 36,
        "name": "Bảo Lộc - Lâm Đồng",
        "name_filter": "bao loc - lam dong",
        "category": "Quận - Huyện",
        "name_nospace": "baoloc-lamdong"
    },
    {
        "id": "455",
        "area_id": 36,
        "name": "Cát Tiên - Lâm Đồng",
        "name_filter": "cat tien - lam dong",
        "category": "Quận - Huyện",
        "name_nospace": "cattien-lamdong"
    },
    {
        "id": "456",
        "area_id": 36,
        "name": "Di Linh - Lâm Đồng",
        "name_filter": "di linh - lam dong",
        "category": "Quận - Huyện",
        "name_nospace": "dilinh-lamdong"
    },
    {
        "id": "457",
        "area_id": 36,
        "name": "Đà Lạt - Lâm Đồng",
        "name_filter": "da lat - lam dong",
        "category": "Quận - Huyện",
        "name_nospace": "dalat-lamdong"
    },
    {
        "id": "458",
        "area_id": 36,
        "name": "Đạ Huoai - Lâm Đồng",
        "name_filter": "da huoai - lam dong",
        "category": "Quận - Huyện",
        "name_nospace": "dahuoai-lamdong"
    },
    {
        "id": "459",
        "area_id": 36,
        "name": "Đạ Tẻh - Lâm Đồng",
        "name_filter": "da teh - lam dong",
        "category": "Quận - Huyện",
        "name_nospace": "dateh-lamdong"
    },
    {
        "id": "460",
        "area_id": 36,
        "name": "Đam Rông - Lâm Đồng",
        "name_filter": "dam rong - lam dong",
        "category": "Quận - Huyện",
        "name_nospace": "damrong-lamdong"
    },
    {
        "id": "461",
        "area_id": 36,
        "name": "Đơn Dương - Lâm Đồng",
        "name_filter": "don duong - lam dong",
        "category": "Quận - Huyện",
        "name_nospace": "donduong-lamdong"
    },
    {
        "id": "462",
        "area_id": 36,
        "name": "Đức Trọng - Lâm Đồng",
        "name_filter": "duc trong - lam dong",
        "category": "Quận - Huyện",
        "name_nospace": "ductrong-lamdong"
    },
    {
        "id": "463",
        "area_id": 36,
        "name": "Lạc Dương - Lâm Đồng",
        "name_filter": "lac duong - lam dong",
        "category": "Quận - Huyện",
        "name_nospace": "lacduong-lamdong"
    },
    {
        "id": "464",
        "area_id": 36,
        "name": "Lâm Hà - Lâm Đồng",
        "name_filter": "lam ha - lam dong",
        "category": "Quận - Huyện",
        "name_nospace": "lamha-lamdong"
    },
    {
        "id": "465",
        "area_id": 37,
        "name": "Bắc Sơn - Lạng Sơn",
        "name_filter": "bac son - lang son",
        "category": "Quận - Huyện",
        "name_nospace": "bacson-langson"
    },
    {
        "id": "466",
        "area_id": 37,
        "name": "Bình Gia - Lạng Sơn",
        "name_filter": "binh gia - lang son",
        "category": "Quận - Huyện",
        "name_nospace": "binhgia-langson"
    },
    {
        "id": "467",
        "area_id": 37,
        "name": "Cao Lộc - Lạng Sơn",
        "name_filter": "cao loc - lang son",
        "category": "Quận - Huyện",
        "name_nospace": "caoloc-langson"
    },
    {
        "id": "468",
        "area_id": 37,
        "name": "Chi Lăng - Lạng Sơn",
        "name_filter": "chi lang - lang son",
        "category": "Quận - Huyện",
        "name_nospace": "chilang-langson"
    },
    {
        "id": "469",
        "area_id": 37,
        "name": "Đình Lập - Lạng Sơn",
        "name_filter": "dinh lap - lang son",
        "category": "Quận - Huyện",
        "name_nospace": "dinhlap-langson"
    },
    {
        "id": "470",
        "area_id": 37,
        "name": "Hữu Lũng - Lạng Sơn",
        "name_filter": "huu lung - lang son",
        "category": "Quận - Huyện",
        "name_nospace": "huulung-langson"
    },
    {
        "id": "471",
        "area_id": 37,
        "name": "Lạng Sơn - Lạng Sơn",
        "name_filter": "lang son - lang son",
        "category": "Quận - Huyện",
        "name_nospace": "langson-langson"
    },
    {
        "id": "472",
        "area_id": 37,
        "name": "Lộc Bình - Lạng Sơn",
        "name_filter": "loc binh - lang son",
        "category": "Quận - Huyện",
        "name_nospace": "locbinh-langson"
    },
    {
        "id": "473",
        "area_id": 37,
        "name": "Tràng Định - Lạng Sơn",
        "name_filter": "trang dinh - lang son",
        "category": "Quận - Huyện",
        "name_nospace": "trangdinh-langson"
    },
    {
        "id": "474",
        "area_id": 37,
        "name": "Vãn Lãng - Lạng Sơn",
        "name_filter": "van lang - lang son",
        "category": "Quận - Huyện",
        "name_nospace": "vanlang-langson"
    },
    {
        "id": "475",
        "area_id": 37,
        "name": "Văn Quan - Lạng Sơn",
        "name_filter": "van quan - lang son",
        "category": "Quận - Huyện",
        "name_nospace": "vanquan-langson"
    },
    {
        "id": "476",
        "area_id": 38,
        "name": "Bảo Thắng - Lào Cai",
        "name_filter": "bao thang - lao cai",
        "category": "Quận - Huyện",
        "name_nospace": "baothang-laocai"
    },
    {
        "id": "477",
        "area_id": 38,
        "name": "Bảo Yên - Lào Cai",
        "name_filter": "bao yen - lao cai",
        "category": "Quận - Huyện",
        "name_nospace": "baoyen-laocai"
    },
    {
        "id": "478",
        "area_id": 38,
        "name": "Bát Xát - Lào Cai",
        "name_filter": "bat xat - lao cai",
        "category": "Quận - Huyện",
        "name_nospace": "batxat-laocai"
    },
    {
        "id": "479",
        "area_id": 38,
        "name": "Bắc Hà - Lào Cai",
        "name_filter": "bac ha - lao cai",
        "category": "Quận - Huyện",
        "name_nospace": "bacha-laocai"
    },
    {
        "id": "480",
        "area_id": 38,
        "name": "Lào Cai - Lào Cai",
        "name_filter": "lao cai - lao cai",
        "category": "Quận - Huyện",
        "name_nospace": "laocai-laocai"
    },
    {
        "id": "481",
        "area_id": 38,
        "name": "Mường Khương - Lào Cai",
        "name_filter": "muong khuong - lao cai",
        "category": "Quận - Huyện",
        "name_nospace": "muongkhuong-laocai"
    },
    {
        "id": "482",
        "area_id": 38,
        "name": "Sa Pa - Lào Cai",
        "name_filter": "sa pa - lao cai",
        "category": "Quận - Huyện",
        "name_nospace": "sapa-laocai"
    },
    {
        "id": "483",
        "area_id": 38,
        "name": "Si Ma Cai - Lào Cai",
        "name_filter": "si ma cai - lao cai",
        "category": "Quận - Huyện",
        "name_nospace": "simacai-laocai"
    },
    {
        "id": "484",
        "area_id": 38,
        "name": "Văn Bàn - Lào Cai",
        "name_filter": "van ban - lao cai",
        "category": "Quận - Huyện",
        "name_nospace": "vanban-laocai"
    },
    {
        "id": "485",
        "area_id": 39,
        "name": "Bến Lức - Long An",
        "name_filter": "ben luc - long an",
        "category": "Quận - Huyện",
        "name_nospace": "benluc-longan"
    },
    {
        "id": "486",
        "area_id": 39,
        "name": "Cần Đước - Long An",
        "name_filter": "can duoc - long an",
        "category": "Quận - Huyện",
        "name_nospace": "canduoc-longan"
    },
    {
        "id": "487",
        "area_id": 39,
        "name": "Cần Giuộc - Long An",
        "name_filter": "can giuoc - long an",
        "category": "Quận - Huyện",
        "name_nospace": "cangiuoc-longan"
    },
    {
        "id": "488",
        "area_id": 39,
        "name": "Châu Thành - Long An",
        "name_filter": "chau thanh - long an",
        "category": "Quận - Huyện",
        "name_nospace": "chauthanh-longan"
    },
    {
        "id": "489",
        "area_id": 39,
        "name": "Đức Hòa - Long An",
        "name_filter": "duc hoa - long an",
        "category": "Quận - Huyện",
        "name_nospace": "duchoa-longan"
    },
    {
        "id": "490",
        "area_id": 39,
        "name": "Đức Huệ - Long An",
        "name_filter": "duc hue - long an",
        "category": "Quận - Huyện",
        "name_nospace": "duchue-longan"
    },
    {
        "id": "491",
        "area_id": 39,
        "name": "Kiến Tường - Long An",
        "name_filter": "kien tuong - long an",
        "category": "Quận - Huyện",
        "name_nospace": "kientuong-longan"
    },
    {
        "id": "492",
        "area_id": 39,
        "name": "Mộc Hóa - Long An",
        "name_filter": "moc hoa - long an",
        "category": "Quận - Huyện",
        "name_nospace": "mochoa-longan"
    },
    {
        "id": "493",
        "area_id": 39,
        "name": "Tân An - Long An",
        "name_filter": "tan an - long an",
        "category": "Quận - Huyện",
        "name_nospace": "tanan-longan"
    },
    {
        "id": "494",
        "area_id": 39,
        "name": "Tân Hưng - Long An",
        "name_filter": "tan hung - long an",
        "category": "Quận - Huyện",
        "name_nospace": "tanhung-longan"
    },
    {
        "id": "495",
        "area_id": 39,
        "name": "Tân Thạnh - Long An",
        "name_filter": "tan thanh - long an",
        "category": "Quận - Huyện",
        "name_nospace": "tanthanh-longan"
    },
    {
        "id": "496",
        "area_id": 39,
        "name": "Tân Trụ - Long An",
        "name_filter": "tan tru - long an",
        "category": "Quận - Huyện",
        "name_nospace": "tantru-longan"
    },
    {
        "id": "497",
        "area_id": 39,
        "name": "Thạnh Hóa - Long An",
        "name_filter": "thanh hoa - long an",
        "category": "Quận - Huyện",
        "name_nospace": "thanhhoa-longan"
    },
    {
        "id": "498",
        "area_id": 39,
        "name": "Thủ Thừa - Long An",
        "name_filter": "thu thua - long an",
        "category": "Quận - Huyện",
        "name_nospace": "thuthua-longan"
    },
    {
        "id": "499",
        "area_id": 39,
        "name": "Vĩnh Hưng - Long An",
        "name_filter": "vinh hung - long an",
        "category": "Quận - Huyện",
        "name_nospace": "vinhhung-longan"
    },
    {
        "id": "500",
        "area_id": 40,
        "name": "Giao Thủy - Nam Định",
        "name_filter": "giao thuy - nam dinh",
        "category": "Quận - Huyện",
        "name_nospace": "giaothuy-namdinh"
    },
    {
        "id": "501",
        "area_id": 40,
        "name": "Hải Hậu - Nam Định",
        "name_filter": "hai hau - nam dinh",
        "category": "Quận - Huyện",
        "name_nospace": "haihau-namdinh"
    },
    {
        "id": "502",
        "area_id": 40,
        "name": "Mỹ Lộc - Nam Định",
        "name_filter": "my loc - nam dinh",
        "category": "Quận - Huyện",
        "name_nospace": "myloc-namdinh"
    },
    {
        "id": "503",
        "area_id": 40,
        "name": "Nam Định - Nam Định",
        "name_filter": "nam dinh - nam dinh",
        "category": "Quận - Huyện",
        "name_nospace": "namdinh-namdinh"
    },
    {
        "id": "504",
        "area_id": 40,
        "name": "Nam Trực - Nam Định",
        "name_filter": "nam truc - nam dinh",
        "category": "Quận - Huyện",
        "name_nospace": "namtruc-namdinh"
    },
    {
        "id": "505",
        "area_id": 40,
        "name": "Nghĩa Hưng - Nam Định",
        "name_filter": "nghia hung - nam dinh",
        "category": "Quận - Huyện",
        "name_nospace": "nghiahung-namdinh"
    },
    {
        "id": "506",
        "area_id": 40,
        "name": "Trực Ninh - Nam Định",
        "name_filter": "truc ninh - nam dinh",
        "category": "Quận - Huyện",
        "name_nospace": "trucninh-namdinh"
    },
    {
        "id": "507",
        "area_id": 40,
        "name": "Vụ Bản - Nam Định",
        "name_filter": "vu ban - nam dinh",
        "category": "Quận - Huyện",
        "name_nospace": "vuban-namdinh"
    },
    {
        "id": "508",
        "area_id": 40,
        "name": "Xuân Trường - Nam Định",
        "name_filter": "xuan truong - nam dinh",
        "category": "Quận - Huyện",
        "name_nospace": "xuantruong-namdinh"
    },
    {
        "id": "509",
        "area_id": 40,
        "name": "Ý Yên - Nam Định",
        "name_filter": "y yen - nam dinh",
        "category": "Quận - Huyện",
        "name_nospace": "yyen-namdinh"
    },
    {
        "id": "510",
        "area_id": 41,
        "name": "Anh Sơn - Nghệ An",
        "name_filter": "anh son - nghe an",
        "category": "Quận - Huyện",
        "name_nospace": "anhson-nghean"
    },
    {
        "id": "511",
        "area_id": 41,
        "name": "Con Cuông - Nghệ An",
        "name_filter": "con cuong - nghe an",
        "category": "Quận - Huyện",
        "name_nospace": "concuong-nghean"
    },
    {
        "id": "512",
        "area_id": 41,
        "name": "Cửa Lò - Nghệ An",
        "name_filter": "cua lo - nghe an",
        "category": "Quận - Huyện",
        "name_nospace": "cualo-nghean"
    },
    {
        "id": "513",
        "area_id": 41,
        "name": "Diễn Châu - Nghệ An",
        "name_filter": "dien chau - nghe an",
        "category": "Quận - Huyện",
        "name_nospace": "dienchau-nghean"
    },
    {
        "id": "514",
        "area_id": 41,
        "name": "Đô Lương - Nghệ An",
        "name_filter": "do luong - nghe an",
        "category": "Quận - Huyện",
        "name_nospace": "doluong-nghean"
    },
    {
        "id": "515",
        "area_id": 41,
        "name": "Hưng Nguyên - Nghệ An",
        "name_filter": "hung nguyen - nghe an",
        "category": "Quận - Huyện",
        "name_nospace": "hungnguyen-nghean"
    },
    {
        "id": "516",
        "area_id": 41,
        "name": "Kỳ Sơn - Nghệ An",
        "name_filter": "ky son - nghe an",
        "category": "Quận - Huyện",
        "name_nospace": "kyson-nghean"
    },
    {
        "id": "517",
        "area_id": 41,
        "name": "Nam Đàn - Nghệ An",
        "name_filter": "nam dan - nghe an",
        "category": "Quận - Huyện",
        "name_nospace": "namdan-nghean"
    },
    {
        "id": "518",
        "area_id": 41,
        "name": "Nghi Lộc - Nghệ An",
        "name_filter": "nghi loc - nghe an",
        "category": "Quận - Huyện",
        "name_nospace": "nghiloc-nghean"
    },
    {
        "id": "519",
        "area_id": 41,
        "name": "Nghĩa Đàn - Nghệ An",
        "name_filter": "nghia dan - nghe an",
        "category": "Quận - Huyện",
        "name_nospace": "nghiadan-nghean"
    },
    {
        "id": "520",
        "area_id": 41,
        "name": "Quế Phong - Nghệ An",
        "name_filter": "que phong - nghe an",
        "category": "Quận - Huyện",
        "name_nospace": "quephong-nghean"
    },
    {
        "id": "521",
        "area_id": 41,
        "name": "Quỳ Châu - Nghệ An",
        "name_filter": "quy chau - nghe an",
        "category": "Quận - Huyện",
        "name_nospace": "quychau-nghean"
    },
    {
        "id": "522",
        "area_id": 41,
        "name": "Quỳ Hợp - Nghệ An",
        "name_filter": "quy hop - nghe an",
        "category": "Quận - Huyện",
        "name_nospace": "quyhop-nghean"
    },
    {
        "id": "523",
        "area_id": 41,
        "name": "Quỳnh Lưu - Nghệ An",
        "name_filter": "quynh luu - nghe an",
        "category": "Quận - Huyện",
        "name_nospace": "quynhluu-nghean"
    },
    {
        "id": "524",
        "area_id": 41,
        "name": "Tân Kỳ - Nghệ An",
        "name_filter": "tan ky - nghe an",
        "category": "Quận - Huyện",
        "name_nospace": "tanky-nghean"
    },
    {
        "id": "525",
        "area_id": 41,
        "name": "Thái Hòa - Nghệ An",
        "name_filter": "thai hoa - nghe an",
        "category": "Quận - Huyện",
        "name_nospace": "thaihoa-nghean"
    },
    {
        "id": "526",
        "area_id": 41,
        "name": "Thanh Chương - Nghệ An",
        "name_filter": "thanh chuong - nghe an",
        "category": "Quận - Huyện",
        "name_nospace": "thanhchuong-nghean"
    },
    {
        "id": "527",
        "area_id": 41,
        "name": "Tương Dương - Nghệ An",
        "name_filter": "tuong duong - nghe an",
        "category": "Quận - Huyện",
        "name_nospace": "tuongduong-nghean"
    },
    {
        "id": "528",
        "area_id": 41,
        "name": "Vinh - Nghệ An",
        "name_filter": "vinh - nghe an",
        "category": "Quận - Huyện",
        "name_nospace": "vinh-nghean"
    },
    {
        "id": "529",
        "area_id": 41,
        "name": "Yên Thành - Nghệ An",
        "name_filter": "yen thanh - nghe an",
        "category": "Quận - Huyện",
        "name_nospace": "yenthanh-nghean"
    },
    {
        "id": "530",
        "area_id": 42,
        "name": "Gia Viễn - Ninh Bình",
        "name_filter": "gia vien - ninh binh",
        "category": "Quận - Huyện",
        "name_nospace": "giavien-ninhbinh"
    },
    {
        "id": "531",
        "area_id": 42,
        "name": "Hoa Lư - Ninh Bình",
        "name_filter": "hoa lu - ninh binh",
        "category": "Quận - Huyện",
        "name_nospace": "hoalu-ninhbinh"
    },
    {
        "id": "532",
        "area_id": 42,
        "name": "Kim Sơn - Ninh Bình",
        "name_filter": "kim son - ninh binh",
        "category": "Quận - Huyện",
        "name_nospace": "kimson-ninhbinh"
    },
    {
        "id": "533",
        "area_id": 42,
        "name": "Nho Quan - Ninh Bình",
        "name_filter": "nho quan - ninh binh",
        "category": "Quận - Huyện",
        "name_nospace": "nhoquan-ninhbinh"
    },
    {
        "id": "534",
        "area_id": 42,
        "name": "Ninh Bình - Ninh Bình",
        "name_filter": "ninh binh - ninh binh",
        "category": "Quận - Huyện",
        "name_nospace": "ninhbinh-ninhbinh"
    },
    {
        "id": "535",
        "area_id": 42,
        "name": "Tam Điệp - Ninh Bình",
        "name_filter": "tam diep - ninh binh",
        "category": "Quận - Huyện",
        "name_nospace": "tamdiep-ninhbinh"
    },
    {
        "id": "536",
        "area_id": 42,
        "name": "Yên Khánh - Ninh Bình",
        "name_filter": "yen khanh - ninh binh",
        "category": "Quận - Huyện",
        "name_nospace": "yenkhanh-ninhbinh"
    },
    {
        "id": "537",
        "area_id": 42,
        "name": "Yên Mô - Ninh Bình",
        "name_filter": "yen mo - ninh binh",
        "category": "Quận - Huyện",
        "name_nospace": "yenmo-ninhbinh"
    },
    {
        "id": "538",
        "area_id": 43,
        "name": "Bác Ái - Ninh Thuận",
        "name_filter": "bac ai - ninh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "bacai-ninhthuan"
    },
    {
        "id": "539",
        "area_id": 43,
        "name": "Ninh Hải - Ninh Thuận",
        "name_filter": "ninh hai - ninh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "ninhhai-ninhthuan"
    },
    {
        "id": "539",
        "area_id": 43,
        "name": "Bình Hưng, Ninh Hải - Ninh Thuận",
        "name_filter": "binh hung, ninh hai - ninh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "binhhung,ninhhai-ninhthuan"
    },
    {
        "id": "540",
        "area_id": 43,
        "name": "Ninh Phước - Ninh Thuận",
        "name_filter": "ninh phuoc - ninh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "ninhphuoc-ninhthuan"
    },
    {
        "id": "541",
        "area_id": 43,
        "name": "Ninh Sơn - Ninh Thuận",
        "name_filter": "ninh son - ninh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "ninhson-ninhthuan"
    },
    {
        "id": "542",
        "area_id": 43,
        "name": "Phan Rang - Tháp Chàm - Ninh Thuận",
        "name_filter": "phan rang - thap cham - ninh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "phanrang-thapcham-ninhthuan"
    },
    {
        "id": "543",
        "area_id": 43,
        "name": "Thuận Bắc - Ninh Thuận",
        "name_filter": "thuan bac - ninh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "thuanbac-ninhthuan"
    },
    {
        "id": "544",
        "area_id": 43,
        "name": "Thuận Nam - Ninh Thuận",
        "name_filter": "thuan nam - ninh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "thuannam-ninhthuan"
    },
    {
        "id": "545",
        "area_id": 44,
        "name": "Cẩm Khê - Phú Thọ",
        "name_filter": "cam khe - phu tho",
        "category": "Quận - Huyện",
        "name_nospace": "camkhe-phutho"
    },
    {
        "id": "546",
        "area_id": 44,
        "name": "Đoan Hùng - Phú Thọ",
        "name_filter": "doan hung - phu tho",
        "category": "Quận - Huyện",
        "name_nospace": "doanhung-phutho"
    },
    {
        "id": "547",
        "area_id": 44,
        "name": "Hạ Hòa - Phú Thọ",
        "name_filter": "ha hoa - phu tho",
        "category": "Quận - Huyện",
        "name_nospace": "hahoa-phutho"
    },
    {
        "id": "548",
        "area_id": 44,
        "name": "Lâm Thao - Phú Thọ",
        "name_filter": "lam thao - phu tho",
        "category": "Quận - Huyện",
        "name_nospace": "lamthao-phutho"
    },
    {
        "id": "549",
        "area_id": 44,
        "name": "Phú Thọ - Phú Thọ",
        "name_filter": "phu tho - phu tho",
        "category": "Quận - Huyện",
        "name_nospace": "phutho-phutho"
    },
    {
        "id": "550",
        "area_id": 44,
        "name": "Phù Ninh - Phú Thọ",
        "name_filter": "phu ninh - phu tho",
        "category": "Quận - Huyện",
        "name_nospace": "phuninh-phutho"
    },
    {
        "id": "551",
        "area_id": 44,
        "name": "Tam Nông - Phú Thọ",
        "name_filter": "tam nong - phu tho",
        "category": "Quận - Huyện",
        "name_nospace": "tamnong-phutho"
    },
    {
        "id": "552",
        "area_id": 44,
        "name": "Tân Sơn - Phú Thọ",
        "name_filter": "tan son - phu tho",
        "category": "Quận - Huyện",
        "name_nospace": "tanson-phutho"
    },
    {
        "id": "553",
        "area_id": 44,
        "name": "Thanh Ba - Phú Thọ",
        "name_filter": "thanh ba - phu tho",
        "category": "Quận - Huyện",
        "name_nospace": "thanhba-phutho"
    },
    {
        "id": "554",
        "area_id": 44,
        "name": "Thanh Sơn - Phú Thọ",
        "name_filter": "thanh son - phu tho",
        "category": "Quận - Huyện",
        "name_nospace": "thanhson-phutho"
    },
    {
        "id": "555",
        "area_id": 44,
        "name": "Thanh Thủy - Phú Thọ",
        "name_filter": "thanh thuy - phu tho",
        "category": "Quận - Huyện",
        "name_nospace": "thanhthuy-phutho"
    },
    {
        "id": "556",
        "area_id": 44,
        "name": "Việt Trì - Phú Thọ",
        "name_filter": "viet tri - phu tho",
        "category": "Quận - Huyện",
        "name_nospace": "viettri-phutho"
    },
    {
        "id": "557",
        "area_id": 44,
        "name": "Yên Lập - Phú Thọ",
        "name_filter": "yen lap - phu tho",
        "category": "Quận - Huyện",
        "name_nospace": "yenlap-phutho"
    },
    {
        "id": "558",
        "area_id": 45,
        "name": "Đông Hòa - Phú Yên",
        "name_filter": "dong hoa - phu yen",
        "category": "Quận - Huyện",
        "name_nospace": "donghoa-phuyen"
    },
    {
        "id": "559",
        "area_id": 45,
        "name": "Đồng Xuân - Phú Yên",
        "name_filter": "dong xuan - phu yen",
        "category": "Quận - Huyện",
        "name_nospace": "dongxuan-phuyen"
    },
    {
        "id": "560",
        "area_id": 45,
        "name": "Phú Hòa - Phú Yên",
        "name_filter": "phu hoa - phu yen",
        "category": "Quận - Huyện",
        "name_nospace": "phuhoa-phuyen"
    },
    {
        "id": "561",
        "area_id": 45,
        "name": "Sông Cầu - Phú Yên",
        "name_filter": "song cau - phu yen",
        "category": "Quận - Huyện",
        "name_nospace": "songcau-phuyen"
    },
    {
        "id": "562",
        "area_id": 45,
        "name": "Sông Hinh - Phú Yên",
        "name_filter": "song hinh - phu yen",
        "category": "Quận - Huyện",
        "name_nospace": "songhinh-phuyen"
    },
    {
        "id": "563",
        "area_id": 45,
        "name": "Sơn Hòa - Phú Yên",
        "name_filter": "son hoa - phu yen",
        "category": "Quận - Huyện",
        "name_nospace": "sonhoa-phuyen"
    },
    {
        "id": "564",
        "area_id": 45,
        "name": "Tây Hòa - Phú Yên",
        "name_filter": "tay hoa - phu yen",
        "category": "Quận - Huyện",
        "name_nospace": "tayhoa-phuyen"
    },
    {
        "id": "565",
        "area_id": 45,
        "name": "Tuy An - Phú Yên",
        "name_filter": "tuy an - phu yen",
        "category": "Quận - Huyện",
        "name_nospace": "tuyan-phuyen"
    },
    {
        "id": "566",
        "area_id": 45,
        "name": "Tuy Hòa - Phú Yên",
        "name_filter": "tuy hoa - phu yen",
        "category": "Quận - Huyện",
        "name_nospace": "tuyhoa-phuyen"
    },
    {
        "id": "567",
        "area_id": 46,
        "name": "Bố Trạch - Quảng Bình",
        "name_filter": "bo trach - quang binh",
        "category": "Quận - Huyện",
        "name_nospace": "botrach-quangbinh"
    },
    {
        "id": "568",
        "area_id": 46,
        "name": "Đồng Hới - Quảng Bình",
        "name_filter": "dong hoi - quang binh",
        "category": "Quận - Huyện",
        "name_nospace": "donghoi-quangbinh"
    },
    {
        "id": "569",
        "area_id": 46,
        "name": "Lệ Thủy - Quảng Bình",
        "name_filter": "le thuy - quang binh",
        "category": "Quận - Huyện",
        "name_nospace": "lethuy-quangbinh"
    },
    {
        "id": "570",
        "area_id": 46,
        "name": "Minh Hóa - Quảng Bình",
        "name_filter": "minh hoa - quang binh",
        "category": "Quận - Huyện",
        "name_nospace": "minhhoa-quangbinh"
    },
    {
        "id": "571",
        "area_id": 46,
        "name": "Quảng Ninh - Quảng Bình",
        "name_filter": "quang ninh - quang binh",
        "category": "Quận - Huyện",
        "name_nospace": "quangninh-quangbinh"
    },
    {
        "id": "572",
        "area_id": 46,
        "name": "Quảng Trạch - Quảng Bình",
        "name_filter": "quang trach - quang binh",
        "category": "Quận - Huyện",
        "name_nospace": "quangtrach-quangbinh"
    },
    {
        "id": "573",
        "area_id": 46,
        "name": "Tuyên Hóa - Quảng Bình",
        "name_filter": "tuyen hoa - quang binh",
        "category": "Quận - Huyện",
        "name_nospace": "tuyenhoa-quangbinh"
    },
    {
        "id": "574",
        "area_id": 47,
        "name": "Bắc Trà My - Quảng Nam",
        "name_filter": "bac tra my - quang nam",
        "category": "Quận - Huyện",
        "name_nospace": "bactramy-quangnam"
    },
    {
        "id": "575",
        "area_id": 47,
        "name": "Duy Xuyên - Quảng Nam",
        "name_filter": "duy xuyen - quang nam",
        "category": "Quận - Huyện",
        "name_nospace": "duyxuyen-quangnam"
    },
    {
        "id": "576",
        "area_id": 47,
        "name": "Đại Lộc - Quảng Nam",
        "name_filter": "dai loc - quang nam",
        "category": "Quận - Huyện",
        "name_nospace": "dailoc-quangnam"
    },
    {
        "id": "577",
        "area_id": 47,
        "name": "Điện Bàn - Quảng Nam",
        "name_filter": "dien ban - quang nam",
        "category": "Quận - Huyện",
        "name_nospace": "dienban-quangnam"
    },
    {
        "id": "578",
        "area_id": 47,
        "name": "Đông Giang - Quảng Nam",
        "name_filter": "dong giang - quang nam",
        "category": "Quận - Huyện",
        "name_nospace": "donggiang-quangnam"
    },
    {
        "id": "579",
        "area_id": 47,
        "name": "Hiệp Đức - Quảng Nam",
        "name_filter": "hiep duc - quang nam",
        "category": "Quận - Huyện",
        "name_nospace": "hiepduc-quangnam"
    },
    {
        "id": "580",
        "area_id": 47,
        "name": "Hội An - Quảng Nam",
        "name_filter": "hoi an - quang nam",
        "category": "Quận - Huyện",
        "name_nospace": "hoian-quangnam"
    },
    {
        "id": "581",
        "area_id": 47,
        "name": "Nam Giang - Quảng Nam",
        "name_filter": "nam giang - quang nam",
        "category": "Quận - Huyện",
        "name_nospace": "namgiang-quangnam"
    },
    {
        "id": "582",
        "area_id": 47,
        "name": "Nam Trà My - Quảng Nam",
        "name_filter": "nam tra my - quang nam",
        "category": "Quận - Huyện",
        "name_nospace": "namtramy-quangnam"
    },
    {
        "id": "583",
        "area_id": 47,
        "name": "Nông Sơn - Quảng Nam",
        "name_filter": "nong son - quang nam",
        "category": "Quận - Huyện",
        "name_nospace": "nongson-quangnam"
    },
    {
        "id": "584",
        "area_id": 47,
        "name": "Núi Thành - Quảng Nam",
        "name_filter": "nui thanh - quang nam",
        "category": "Quận - Huyện",
        "name_nospace": "nuithanh-quangnam"
    },
    {
        "id": "585",
        "area_id": 47,
        "name": "Phú Ninh - Quảng Nam",
        "name_filter": "phu ninh - quang nam",
        "category": "Quận - Huyện",
        "name_nospace": "phuninh-quangnam"
    },
    {
        "id": "586",
        "area_id": 47,
        "name": "Phước Sơn - Quảng Nam",
        "name_filter": "phuoc son - quang nam",
        "category": "Quận - Huyện",
        "name_nospace": "phuocson-quangnam"
    },
    {
        "id": "587",
        "area_id": 47,
        "name": "Quế Sơn - Quảng Nam",
        "name_filter": "que son - quang nam",
        "category": "Quận - Huyện",
        "name_nospace": "queson-quangnam"
    },
    {
        "id": "588",
        "area_id": 47,
        "name": "Tam Kỳ - Quảng Nam",
        "name_filter": "tam ky - quang nam",
        "category": "Quận - Huyện",
        "name_nospace": "tamky-quangnam"
    },
    {
        "id": "589",
        "area_id": 47,
        "name": "Tây Giang - Quảng Nam",
        "name_filter": "tay giang - quang nam",
        "category": "Quận - Huyện",
        "name_nospace": "taygiang-quangnam"
    },
    {
        "id": "590",
        "area_id": 47,
        "name": "Thăng Bình - Quảng Nam",
        "name_filter": "thang binh - quang nam",
        "category": "Quận - Huyện",
        "name_nospace": "thangbinh-quangnam"
    },
    {
        "id": "591",
        "area_id": 47,
        "name": "Tiên Phước - Quảng Nam",
        "name_filter": "tien phuoc - quang nam",
        "category": "Quận - Huyện",
        "name_nospace": "tienphuoc-quangnam"
    },
    {
        "id": "592",
        "area_id": 48,
        "name": "Ba Tơ - Quảng Ngãi",
        "name_filter": "ba to - quang ngai",
        "category": "Quận - Huyện",
        "name_nospace": "bato-quangngai"
    },
    {
        "id": "593",
        "area_id": 48,
        "name": "Bình Sơn - Quảng Ngãi",
        "name_filter": "binh son - quang ngai",
        "category": "Quận - Huyện",
        "name_nospace": "binhson-quangngai"
    },
    {
        "id": "594",
        "area_id": 48,
        "name": "Đức Phổ - Quảng Ngãi",
        "name_filter": "duc pho - quang ngai",
        "category": "Quận - Huyện",
        "name_nospace": "ducpho-quangngai"
    },
    {
        "id": "595",
        "area_id": 48,
        "name": "Lý Sơn - Quảng Ngãi",
        "name_filter": "ly son - quang ngai",
        "category": "Quận - Huyện",
        "name_nospace": "lyson-quangngai"
    },
    {
        "id": "596",
        "area_id": 48,
        "name": "Minh Long - Quảng Ngãi",
        "name_filter": "minh long - quang ngai",
        "category": "Quận - Huyện",
        "name_nospace": "minhlong-quangngai"
    },
    {
        "id": "597",
        "area_id": 48,
        "name": "Mộ Đức - Quảng Ngãi",
        "name_filter": "mo duc - quang ngai",
        "category": "Quận - Huyện",
        "name_nospace": "moduc-quangngai"
    },
    {
        "id": "598",
        "area_id": 48,
        "name": "Nghĩa Hành - Quảng Ngãi",
        "name_filter": "nghia hanh - quang ngai",
        "category": "Quận - Huyện",
        "name_nospace": "nghiahanh-quangngai"
    },
    {
        "id": "599",
        "area_id": 48,
        "name": "Quảng Ngãi - Quảng Ngãi",
        "name_filter": "quang ngai - quang ngai",
        "category": "Quận - Huyện",
        "name_nospace": "quangngai-quangngai"
    },
    {
        "id": "600",
        "area_id": 48,
        "name": "Sơn Hà - Quảng Ngãi",
        "name_filter": "son ha - quang ngai",
        "category": "Quận - Huyện",
        "name_nospace": "sonha-quangngai"
    },
    {
        "id": "601",
        "area_id": 48,
        "name": "Sơn Tây - Quảng Ngãi",
        "name_filter": "son tay - quang ngai",
        "category": "Quận - Huyện",
        "name_nospace": "sontay-quangngai"
    },
    {
        "id": "602",
        "area_id": 48,
        "name": "Sơn Tịnh - Quảng Ngãi",
        "name_filter": "son tinh - quang ngai",
        "category": "Quận - Huyện",
        "name_nospace": "sontinh-quangngai"
    },
    {
        "id": "603",
        "area_id": 48,
        "name": "Tây Trà - Quảng Ngãi",
        "name_filter": "tay tra - quang ngai",
        "category": "Quận - Huyện",
        "name_nospace": "taytra-quangngai"
    },
    {
        "id": "604",
        "area_id": 48,
        "name": "Trà Bồng - Quảng Ngãi",
        "name_filter": "tra bong - quang ngai",
        "category": "Quận - Huyện",
        "name_nospace": "trabong-quangngai"
    },
    {
        "id": "605",
        "area_id": 48,
        "name": "Tư Nghĩa - Quảng Ngãi",
        "name_filter": "tu nghia - quang ngai",
        "category": "Quận - Huyện",
        "name_nospace": "tunghia-quangngai"
    },
    {
        "id": "606",
        "area_id": 49,
        "name": "Ba Chẽ - Quảng Ninh",
        "name_filter": "ba che - quang ninh",
        "category": "Quận - Huyện",
        "name_nospace": "bache-quangninh"
    },
    {
        "id": "607",
        "area_id": 49,
        "name": "Bình Liêu - Quảng Ninh",
        "name_filter": "binh lieu - quang ninh",
        "category": "Quận - Huyện",
        "name_nospace": "binhlieu-quangninh"
    },
    {
        "id": "608",
        "area_id": 49,
        "name": "Cẩm Phả - Quảng Ninh",
        "name_filter": "cam pha - quang ninh",
        "category": "Quận - Huyện",
        "name_nospace": "campha-quangninh"
    },
    {
        "id": "609",
        "area_id": 49,
        "name": "Cô Tô - Quảng Ninh",
        "name_filter": "co to - quang ninh",
        "category": "Quận - Huyện",
        "name_nospace": "coto-quangninh"
    },
    {
        "id": "610",
        "area_id": 49,
        "name": "Đầm Hà - Quảng Ninh",
        "name_filter": "dam ha - quang ninh",
        "category": "Quận - Huyện",
        "name_nospace": "damha-quangninh"
    },
    {
        "id": "611",
        "area_id": 49,
        "name": "Đông Triều - Quảng Ninh",
        "name_filter": "dong trieu - quang ninh",
        "category": "Quận - Huyện",
        "name_nospace": "dongtrieu-quangninh"
    },
    {
        "id": "612",
        "area_id": 49,
        "name": "Hạ Long - Quảng Ninh",
        "name_filter": "ha long - quang ninh",
        "category": "Quận - Huyện",
        "name_nospace": "halong-quangninh"
    },
    {
        "id": "613",
        "area_id": 49,
        "name": "Hải Hà - Quảng Ninh",
        "name_filter": "hai ha - quang ninh",
        "category": "Quận - Huyện",
        "name_nospace": "haiha-quangninh"
    },
    {
        "id": "614",
        "area_id": 49,
        "name": "Hoành Bồ - Quảng Ninh",
        "name_filter": "hoanh bo - quang ninh",
        "category": "Quận - Huyện",
        "name_nospace": "hoanhbo-quangninh"
    },
    {
        "id": "615",
        "area_id": 49,
        "name": "Móng Cái - Quảng Ninh",
        "name_filter": "mong cai - quang ninh",
        "category": "Quận - Huyện",
        "name_nospace": "mongcai-quangninh"
    },
    {
        "id": "616",
        "area_id": 49,
        "name": "Quảng Yên - Quảng Ninh",
        "name_filter": "quang yen - quang ninh",
        "category": "Quận - Huyện",
        "name_nospace": "quangyen-quangninh"
    },
    {
        "id": "617",
        "area_id": 49,
        "name": "Tiên Yên - Quảng Ninh",
        "name_filter": "tien yen - quang ninh",
        "category": "Quận - Huyện",
        "name_nospace": "tienyen-quangninh"
    },
    {
        "id": "618",
        "area_id": 49,
        "name": "Uông Bí - Quảng Ninh",
        "name_filter": "uong bi - quang ninh",
        "category": "Quận - Huyện",
        "name_nospace": "uongbi-quangninh"
    },
    {
        "id": "619",
        "area_id": 49,
        "name": "Vân Đồn - Quảng Ninh",
        "name_filter": "van don - quang ninh",
        "category": "Quận - Huyện",
        "name_nospace": "vandon-quangninh"
    },
    {
        "id": "620",
        "area_id": 50,
        "name": "Cam Lộ - Quảng Trị",
        "name_filter": "cam lo - quang tri",
        "category": "Quận - Huyện",
        "name_nospace": "camlo-quangtri"
    },
    {
        "id": "621",
        "area_id": 50,
        "name": "Cồn Cỏ - Quảng Trị",
        "name_filter": "con co - quang tri",
        "category": "Quận - Huyện",
        "name_nospace": "conco-quangtri"
    },
    {
        "id": "622",
        "area_id": 50,
        "name": "Đa Krông - Quảng Trị",
        "name_filter": "da krong - quang tri",
        "category": "Quận - Huyện",
        "name_nospace": "dakrong-quangtri"
    },
    {
        "id": "623",
        "area_id": 50,
        "name": "Đông Hà - Quảng Trị",
        "name_filter": "dong ha - quang tri",
        "category": "Quận - Huyện",
        "name_nospace": "dongha-quangtri"
    },
    {
        "id": "624",
        "area_id": 50,
        "name": "Gio Linh - Quảng Trị",
        "name_filter": "gio linh - quang tri",
        "category": "Quận - Huyện",
        "name_nospace": "giolinh-quangtri"
    },
    {
        "id": "625",
        "area_id": 50,
        "name": "Hải Lăng - Quảng Trị",
        "name_filter": "hai lang - quang tri",
        "category": "Quận - Huyện",
        "name_nospace": "hailang-quangtri"
    },
    {
        "id": "626",
        "area_id": 50,
        "name": "Hướng Hóa - Quảng Trị",
        "name_filter": "huong hoa - quang tri",
        "category": "Quận - Huyện",
        "name_nospace": "huonghoa-quangtri"
    },
    {
        "id": "627",
        "area_id": 50,
        "name": "Quảng Trị - Quảng Trị",
        "name_filter": "quang tri - quang tri",
        "category": "Quận - Huyện",
        "name_nospace": "quangtri-quangtri"
    },
    {
        "id": "628",
        "area_id": 50,
        "name": "Triệu Phong - Quảng Trị",
        "name_filter": "trieu phong - quang tri",
        "category": "Quận - Huyện",
        "name_nospace": "trieuphong-quangtri"
    },
    {
        "id": "629",
        "area_id": 50,
        "name": "Vĩnh Linh - Quảng Trị",
        "name_filter": "vinh linh - quang tri",
        "category": "Quận - Huyện",
        "name_nospace": "vinhlinh-quangtri"
    },
    {
        "id": "630",
        "area_id": 51,
        "name": "Châu Thành - Sóc Trăng",
        "name_filter": "chau thanh - soc trang",
        "category": "Quận - Huyện",
        "name_nospace": "chauthanh-soctrang"
    },
    {
        "id": "631",
        "area_id": 51,
        "name": "Cù Lao Dung - Sóc Trăng",
        "name_filter": "cu lao dung - soc trang",
        "category": "Quận - Huyện",
        "name_nospace": "culaodung-soctrang"
    },
    {
        "id": "632",
        "area_id": 51,
        "name": "Kế Sách - Sóc Trăng",
        "name_filter": "ke sach - soc trang",
        "category": "Quận - Huyện",
        "name_nospace": "kesach-soctrang"
    },
    {
        "id": "633",
        "area_id": 51,
        "name": "Long Phú - Sóc Trăng",
        "name_filter": "long phu - soc trang",
        "category": "Quận - Huyện",
        "name_nospace": "longphu-soctrang"
    },
    {
        "id": "634",
        "area_id": 51,
        "name": "Mỹ Tú - Sóc Trăng",
        "name_filter": "my tu - soc trang",
        "category": "Quận - Huyện",
        "name_nospace": "mytu-soctrang"
    },
    {
        "id": "635",
        "area_id": 51,
        "name": "Mỹ Xuyên - Sóc Trăng",
        "name_filter": "my xuyen - soc trang",
        "category": "Quận - Huyện",
        "name_nospace": "myxuyen-soctrang"
    },
    {
        "id": "636",
        "area_id": 51,
        "name": "Ngã Năm - Sóc Trăng",
        "name_filter": "nga nam - soc trang",
        "category": "Quận - Huyện",
        "name_nospace": "nganam-soctrang"
    },
    {
        "id": "637",
        "area_id": 51,
        "name": "Sóc Trăng - Sóc Trăng",
        "name_filter": "soc trang - soc trang",
        "category": "Quận - Huyện",
        "name_nospace": "soctrang-soctrang"
    },
    {
        "id": "638",
        "area_id": 51,
        "name": "Thạnh Trị - Sóc Trăng",
        "name_filter": "thanh tri - soc trang",
        "category": "Quận - Huyện",
        "name_nospace": "thanhtri-soctrang"
    },
    {
        "id": "639",
        "area_id": 51,
        "name": "Trần Đề - Sóc Trăng",
        "name_filter": "tran de - soc trang",
        "category": "Quận - Huyện",
        "name_nospace": "trande-soctrang"
    },
    {
        "id": "640",
        "area_id": 51,
        "name": "Vĩnh Châu - Sóc Trăng",
        "name_filter": "vinh chau - soc trang",
        "category": "Quận - Huyện",
        "name_nospace": "vinhchau-soctrang"
    },
    {
        "id": "641",
        "area_id": 52,
        "name": "Bắc Yên - Sơn La",
        "name_filter": "bac yen - son la",
        "category": "Quận - Huyện",
        "name_nospace": "bacyen-sonla"
    },
    {
        "id": "642",
        "area_id": 52,
        "name": "Mai Sơn - Sơn La",
        "name_filter": "mai son - son la",
        "category": "Quận - Huyện",
        "name_nospace": "maison-sonla"
    },
    {
        "id": "643",
        "area_id": 52,
        "name": "Mộc Châu - Sơn La",
        "name_filter": "moc chau - son la",
        "category": "Quận - Huyện",
        "name_nospace": "mocchau-sonla"
    },
    {
        "id": "644",
        "area_id": 52,
        "name": "Mường La - Sơn La",
        "name_filter": "muong la - son la",
        "category": "Quận - Huyện",
        "name_nospace": "muongla-sonla"
    },
    {
        "id": "645",
        "area_id": 52,
        "name": "Phù Yên - Sơn La",
        "name_filter": "phu yen - son la",
        "category": "Quận - Huyện",
        "name_nospace": "phuyen-sonla"
    },
    {
        "id": "646",
        "area_id": 52,
        "name": "Quỳnh Nhai - Sơn La",
        "name_filter": "quynh nhai - son la",
        "category": "Quận - Huyện",
        "name_nospace": "quynhnhai-sonla"
    },
    {
        "id": "647",
        "area_id": 52,
        "name": "Sông Mã - Sơn La",
        "name_filter": "song ma - son la",
        "category": "Quận - Huyện",
        "name_nospace": "songma-sonla"
    },
    {
        "id": "648",
        "area_id": 52,
        "name": "Sốp Cộp - Sơn La",
        "name_filter": "sop cop - son la",
        "category": "Quận - Huyện",
        "name_nospace": "sopcop-sonla"
    },
    {
        "id": "649",
        "area_id": 52,
        "name": "Sơn La - Sơn La",
        "name_filter": "son la - son la",
        "category": "Quận - Huyện",
        "name_nospace": "sonla-sonla"
    },
    {
        "id": "650",
        "area_id": 52,
        "name": "Thuận Châu - Sơn La",
        "name_filter": "thuan chau - son la",
        "category": "Quận - Huyện",
        "name_nospace": "thuanchau-sonla"
    },
    {
        "id": "651",
        "area_id": 52,
        "name": "Yên Châu - Sơn La",
        "name_filter": "yen chau - son la",
        "category": "Quận - Huyện",
        "name_nospace": "yenchau-sonla"
    },
    {
        "id": "652",
        "area_id": 53,
        "name": "Bến Cầu - Tây Ninh",
        "name_filter": "ben cau - tay ninh",
        "category": "Quận - Huyện",
        "name_nospace": "bencau-tayninh"
    },
    {
        "id": "653",
        "area_id": 53,
        "name": "Châu Thành - Tây Ninh",
        "name_filter": "chau thanh - tay ninh",
        "category": "Quận - Huyện",
        "name_nospace": "chauthanh-tayninh"
    },
    {
        "id": "654",
        "area_id": 53,
        "name": "Dương Minh Châu - Tây Ninh",
        "name_filter": "duong minh chau - tay ninh",
        "category": "Quận - Huyện",
        "name_nospace": "duongminhchau-tayninh"
    },
    {
        "id": "655",
        "area_id": 53,
        "name": "Gò Dầu - Tây Ninh",
        "name_filter": "go dau - tay ninh",
        "category": "Quận - Huyện",
        "name_nospace": "godau-tayninh"
    },
    {
        "id": "656",
        "area_id": 53,
        "name": "Hòa Thành - Tây Ninh",
        "name_filter": "hoa thanh - tay ninh",
        "category": "Quận - Huyện",
        "name_nospace": "hoathanh-tayninh"
    },
    {
        "id": "657",
        "area_id": 53,
        "name": "Tân Biên - Tây Ninh",
        "name_filter": "tan bien - tay ninh",
        "category": "Quận - Huyện",
        "name_nospace": "tanbien-tayninh"
    },
    {
        "id": "658",
        "area_id": 53,
        "name": "Tân Châu - Tây Ninh",
        "name_filter": "tan chau - tay ninh",
        "category": "Quận - Huyện",
        "name_nospace": "tanchau-tayninh"
    },
    {
        "id": "659",
        "area_id": 53,
        "name": "Tây Ninh - Tây Ninh",
        "name_filter": "tay ninh - tay ninh",
        "category": "Quận - Huyện",
        "name_nospace": "tayninh-tayninh"
    },
    {
        "id": "660",
        "area_id": 53,
        "name": "Trảng Bàng - Tây Ninh",
        "name_filter": "trang bang - tay ninh",
        "category": "Quận - Huyện",
        "name_nospace": "trangbang-tayninh"
    },
    {
        "id": "661",
        "area_id": 54,
        "name": "Đông Hưng - Thái Bình",
        "name_filter": "dong hung - thai binh",
        "category": "Quận - Huyện",
        "name_nospace": "donghung-thaibinh"
    },
    {
        "id": "662",
        "area_id": 54,
        "name": "Hưng Hà - Thái Bình",
        "name_filter": "hung ha - thai binh",
        "category": "Quận - Huyện",
        "name_nospace": "hungha-thaibinh"
    },
    {
        "id": "663",
        "area_id": 54,
        "name": "Kiến Xương - Thái Bình",
        "name_filter": "kien xuong - thai binh",
        "category": "Quận - Huyện",
        "name_nospace": "kienxuong-thaibinh"
    },
    {
        "id": "664",
        "area_id": 54,
        "name": "Quỳnh Phụ - Thái Bình",
        "name_filter": "quynh phu - thai binh",
        "category": "Quận - Huyện",
        "name_nospace": "quynhphu-thaibinh"
    },
    {
        "id": "665",
        "area_id": 54,
        "name": "Thái Bình - Thái Bình",
        "name_filter": "thai binh - thai binh",
        "category": "Quận - Huyện",
        "name_nospace": "thaibinh-thaibinh"
    },
    {
        "id": "666",
        "area_id": 54,
        "name": "Thái Thụy - Thái Bình",
        "name_filter": "thai thuy - thai binh",
        "category": "Quận - Huyện",
        "name_nospace": "thaithuy-thaibinh"
    },
    {
        "id": "667",
        "area_id": 54,
        "name": "Tiền Hải - Thái Bình",
        "name_filter": "tien hai - thai binh",
        "category": "Quận - Huyện",
        "name_nospace": "tienhai-thaibinh"
    },
    {
        "id": "668",
        "area_id": 54,
        "name": "Vũ Thư - Thái Bình",
        "name_filter": "vu thu - thai binh",
        "category": "Quận - Huyện",
        "name_nospace": "vuthu-thaibinh"
    },
    {
        "id": "669",
        "area_id": 55,
        "name": "Đại Từ - Thái Nguyên",
        "name_filter": "dai tu - thai nguyen",
        "category": "Quận - Huyện",
        "name_nospace": "daitu-thainguyen"
    },
    {
        "id": "670",
        "area_id": 55,
        "name": "Định Hóa - Thái Nguyên",
        "name_filter": "dinh hoa - thai nguyen",
        "category": "Quận - Huyện",
        "name_nospace": "dinhhoa-thainguyen"
    },
    {
        "id": "671",
        "area_id": 55,
        "name": "Đồng Hỷ - Thái Nguyên",
        "name_filter": "dong hy - thai nguyen",
        "category": "Quận - Huyện",
        "name_nospace": "donghy-thainguyen"
    },
    {
        "id": "672",
        "area_id": 55,
        "name": "Phổ Yên - Thái Nguyên",
        "name_filter": "pho yen - thai nguyen",
        "category": "Quận - Huyện",
        "name_nospace": "phoyen-thainguyen"
    },
    {
        "id": "673",
        "area_id": 55,
        "name": "Phú Bình - Thái Nguyên",
        "name_filter": "phu binh - thai nguyen",
        "category": "Quận - Huyện",
        "name_nospace": "phubinh-thainguyen"
    },
    {
        "id": "674",
        "area_id": 55,
        "name": "Phú Lương - Thái Nguyên",
        "name_filter": "phu luong - thai nguyen",
        "category": "Quận - Huyện",
        "name_nospace": "phuluong-thainguyen"
    },
    {
        "id": "675",
        "area_id": 55,
        "name": "Sông Công - Thái Nguyên",
        "name_filter": "song cong - thai nguyen",
        "category": "Quận - Huyện",
        "name_nospace": "songcong-thainguyen"
    },
    {
        "id": "676",
        "area_id": 55,
        "name": "Thái Nguyên - Thái Nguyên",
        "name_filter": "thai nguyen - thai nguyen",
        "category": "Quận - Huyện",
        "name_nospace": "thainguyen-thainguyen"
    },
    {
        "id": "677",
        "area_id": 55,
        "name": "Võ Nhai - Thái Nguyên",
        "name_filter": "vo nhai - thai nguyen",
        "category": "Quận - Huyện",
        "name_nospace": "vonhai-thainguyen"
    },
    {
        "id": "678",
        "area_id": 56,
        "name": "Bá Thước - Thanh Hóa",
        "name_filter": "ba thuoc - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "bathuoc-thanhhoa"
    },
    {
        "id": "679",
        "area_id": 56,
        "name": "Bỉm Sơn - Thanh Hóa",
        "name_filter": "bim son - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "bimson-thanhhoa"
    },
    {
        "id": "680",
        "area_id": 56,
        "name": "Cẩm Thủy - Thanh Hóa",
        "name_filter": "cam thuy - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "camthuy-thanhhoa"
    },
    {
        "id": "681",
        "area_id": 56,
        "name": "Đông Sơn - Thanh Hóa",
        "name_filter": "dong son - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "dongson-thanhhoa"
    },
    {
        "id": "682",
        "area_id": 56,
        "name": "Hà Trung - Thanh Hóa",
        "name_filter": "ha trung - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "hatrung-thanhhoa"
    },
    {
        "id": "683",
        "area_id": 56,
        "name": "Hậu Lộc - Thanh Hóa",
        "name_filter": "hau loc - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "hauloc-thanhhoa"
    },
    {
        "id": "684",
        "area_id": 56,
        "name": "Hoằng Hóa - Thanh Hóa",
        "name_filter": "hoang hoa - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "hoanghoa-thanhhoa"
    },
    {
        "id": "685",
        "area_id": 56,
        "name": "Lang Chánh - Thanh Hóa",
        "name_filter": "lang chanh - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "langchanh-thanhhoa"
    },
    {
        "id": "686",
        "area_id": 56,
        "name": "Mường Lát - Thanh Hóa",
        "name_filter": "muong lat - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "muonglat-thanhhoa"
    },
    {
        "id": "687",
        "area_id": 56,
        "name": "Nga Sơn - Thanh Hóa",
        "name_filter": "nga son - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "ngason-thanhhoa"
    },
    {
        "id": "688",
        "area_id": 56,
        "name": "Ngọc Lặc - Thanh Hóa",
        "name_filter": "ngoc lac - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "ngoclac-thanhhoa"
    },
    {
        "id": "689",
        "area_id": 56,
        "name": "Như Thanh - Thanh Hóa",
        "name_filter": "nhu thanh - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "nhuthanh-thanhhoa"
    },
    {
        "id": "690",
        "area_id": 56,
        "name": "Như Xuân - Thanh Hóa",
        "name_filter": "nhu xuan - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "nhuxuan-thanhhoa"
    },
    {
        "id": "691",
        "area_id": 56,
        "name": "Nông Cống - Thanh Hóa",
        "name_filter": "nong cong - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "nongcong-thanhhoa"
    },
    {
        "id": "692",
        "area_id": 56,
        "name": "Quan Hóa - Thanh Hóa",
        "name_filter": "quan hoa - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "quanhoa-thanhhoa"
    },
    {
        "id": "693",
        "area_id": 56,
        "name": "Quan Sơn - Thanh Hóa",
        "name_filter": "quan son - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "quanson-thanhhoa"
    },
    {
        "id": "694",
        "area_id": 56,
        "name": "Quảng Xương - Thanh Hóa",
        "name_filter": "quang xuong - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "quangxuong-thanhhoa"
    },
    {
        "id": "695",
        "area_id": 56,
        "name": "Sầm Sơn - Thanh Hóa",
        "name_filter": "sam son - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "samson-thanhhoa"
    },
    {
        "id": "696",
        "area_id": 56,
        "name": "Thạch Thành - Thanh Hóa",
        "name_filter": "thach thanh - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "thachthanh-thanhhoa"
    },
    {
        "id": "697",
        "area_id": 56,
        "name": "Thanh Hóa - Thanh Hóa",
        "name_filter": "thanh hoa - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "thanhhoa-thanhhoa"
    },
    {
        "id": "698",
        "area_id": 56,
        "name": "Thiệu Hóa - Thanh Hóa",
        "name_filter": "thieu hoa - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "thieuhoa-thanhhoa"
    },
    {
        "id": "699",
        "area_id": 56,
        "name": "Thọ Xuân - Thanh Hóa",
        "name_filter": "tho xuan - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "thoxuan-thanhhoa"
    },
    {
        "id": "700",
        "area_id": 56,
        "name": "Thường Xuân - Thanh Hóa",
        "name_filter": "thuong xuan - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "thuongxuan-thanhhoa"
    },
    {
        "id": "701",
        "area_id": 56,
        "name": "Tĩnh Gia - Thanh Hóa",
        "name_filter": "tinh gia - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "tinhgia-thanhhoa"
    },
    {
        "id": "702",
        "area_id": 56,
        "name": "Triệu Sơn - Thanh Hóa",
        "name_filter": "trieu son - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "trieuson-thanhhoa"
    },
    {
        "id": "703",
        "area_id": 56,
        "name": "Vĩnh Lộc - Thanh Hóa",
        "name_filter": "vinh loc - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "vinhloc-thanhhoa"
    },
    {
        "id": "704",
        "area_id": 56,
        "name": "Yên Định - Thanh Hóa",
        "name_filter": "yen dinh - thanh hoa",
        "category": "Quận - Huyện",
        "name_nospace": "yendinh-thanhhoa"
    },
    {
        "id": "705",
        "area_id": 57,
        "name": "Huế - Thừa Thiên-Huế",
        "name_filter": "hue - thua thien-hue",
        "category": "Quận - Huyện",
        "name_nospace": "hue-thuathien-hue"
    },
    {
        "id": "706",
        "area_id": 57,
        "name": "Hương Thủy - Thừa Thiên-Huế",
        "name_filter": "huong thuy - thua thien-hue",
        "category": "Quận - Huyện",
        "name_nospace": "huongthuy-thuathien-hue"
    },
    {
        "id": "707",
        "area_id": 57,
        "name": "Hương Trà - Thừa Thiên-Huế",
        "name_filter": "huong tra - thua thien-hue",
        "category": "Quận - Huyện",
        "name_nospace": "huongtra-thuathien-hue"
    },
    {
        "id": "708",
        "area_id": 57,
        "name": "Nam Đông - Thừa Thiên-Huế",
        "name_filter": "nam dong - thua thien-hue",
        "category": "Quận - Huyện",
        "name_nospace": "namdong-thuathien-hue"
    },
    {
        "id": "709",
        "area_id": 57,
        "name": "A Lưới - Thừa Thiên-Huế",
        "name_filter": "a luoi - thua thien-hue",
        "category": "Quận - Huyện",
        "name_nospace": "aluoi-thuathien-hue"
    },
    {
        "id": "710",
        "area_id": 57,
        "name": "Phong Điền - Thừa Thiên-Huế",
        "name_filter": "phong dien - thua thien-hue",
        "category": "Quận - Huyện",
        "name_nospace": "phongdien-thuathien-hue"
    },
    {
        "id": "711",
        "area_id": 57,
        "name": "Phú Lộc - Thừa Thiên-Huế",
        "name_filter": "phu loc - thua thien-hue",
        "category": "Quận - Huyện",
        "name_nospace": "phuloc-thuathien-hue"
    },
    {
        "id": "712",
        "area_id": 57,
        "name": "Phú Vang - Thừa Thiên-Huế",
        "name_filter": "phu vang - thua thien-hue",
        "category": "Quận - Huyện",
        "name_nospace": "phuvang-thuathien-hue"
    },
    {
        "id": "713",
        "area_id": 57,
        "name": "Quảng Điền - Thừa Thiên-Huế",
        "name_filter": "quang dien - thua thien-hue",
        "category": "Quận - Huyện",
        "name_nospace": "quangdien-thuathien-hue"
    },
    {
        "id": "714",
        "area_id": 58,
        "name": "Cai Lậy - Tiền Giang",
        "name_filter": "cai lay - tien giang",
        "category": "Quận - Huyện",
        "name_nospace": "cailay-tiengiang"
    },
    {
        "id": "715",
        "area_id": 58,
        "name": "Cái Bè - Tiền Giang",
        "name_filter": "cai be - tien giang",
        "category": "Quận - Huyện",
        "name_nospace": "caibe-tiengiang"
    },
    {
        "id": "716",
        "area_id": 58,
        "name": "Châu Thành - Tiền Giang",
        "name_filter": "chau thanh - tien giang",
        "category": "Quận - Huyện",
        "name_nospace": "chauthanh-tiengiang"
    },
    {
        "id": "717",
        "area_id": 58,
        "name": "Chợ Gạo - Tiền Giang",
        "name_filter": "cho gao - tien giang",
        "category": "Quận - Huyện",
        "name_nospace": "chogao-tiengiang"
    },
    {
        "id": "718",
        "area_id": 58,
        "name": "Gò Công - Tiền Giang",
        "name_filter": "go cong - tien giang",
        "category": "Quận - Huyện",
        "name_nospace": "gocong-tiengiang"
    },
    {
        "id": "719",
        "area_id": 58,
        "name": "Gò Công Đông - Tiền Giang",
        "name_filter": "go cong dong - tien giang",
        "category": "Quận - Huyện",
        "name_nospace": "gocongdong-tiengiang"
    },
    {
        "id": "720",
        "area_id": 58,
        "name": "Gò Công Tây - Tiền Giang",
        "name_filter": "go cong tay - tien giang",
        "category": "Quận - Huyện",
        "name_nospace": "gocongtay-tiengiang"
    },
    {
        "id": "721",
        "area_id": 58,
        "name": "Mỹ Tho - Tiền Giang",
        "name_filter": "my tho - tien giang",
        "category": "Quận - Huyện",
        "name_nospace": "mytho-tiengiang"
    },
    {
        "id": "722",
        "area_id": 58,
        "name": "Tân Phú Đông - Tiền Giang",
        "name_filter": "tan phu dong - tien giang",
        "category": "Quận - Huyện",
        "name_nospace": "tanphudong-tiengiang"
    },
    {
        "id": "723",
        "area_id": 58,
        "name": "Tân Phước - Tiền Giang",
        "name_filter": "tan phuoc - tien giang",
        "category": "Quận - Huyện",
        "name_nospace": "tanphuoc-tiengiang"
    },
    {
        "id": "724",
        "area_id": 59,
        "name": "Càng Long - Trà Vinh",
        "name_filter": "cang long - tra vinh",
        "category": "Quận - Huyện",
        "name_nospace": "canglong-travinh"
    },
    {
        "id": "725",
        "area_id": 59,
        "name": "Cầu Kè - Trà Vinh",
        "name_filter": "cau ke - tra vinh",
        "category": "Quận - Huyện",
        "name_nospace": "cauke-travinh"
    },
    {
        "id": "726",
        "area_id": 59,
        "name": "Cầu Ngang - Trà Vinh",
        "name_filter": "cau ngang - tra vinh",
        "category": "Quận - Huyện",
        "name_nospace": "caungang-travinh"
    },
    {
        "id": "727",
        "area_id": 59,
        "name": "Châu Thành - Trà Vinh",
        "name_filter": "chau thanh - tra vinh",
        "category": "Quận - Huyện",
        "name_nospace": "chauthanh-travinh"
    },
    {
        "id": "728",
        "area_id": 59,
        "name": "Duyên Hải - Trà Vinh",
        "name_filter": "duyen hai - tra vinh",
        "category": "Quận - Huyện",
        "name_nospace": "duyenhai-travinh"
    },
    {
        "id": "729",
        "area_id": 59,
        "name": "Tiểu Cần - Trà Vinh",
        "name_filter": "tieu can - tra vinh",
        "category": "Quận - Huyện",
        "name_nospace": "tieucan-travinh"
    },
    {
        "id": "730",
        "area_id": 59,
        "name": "Trà Cú - Trà Vinh",
        "name_filter": "tra cu - tra vinh",
        "category": "Quận - Huyện",
        "name_nospace": "tracu-travinh"
    },
    {
        "id": "731",
        "area_id": 59,
        "name": "Trà Vinh - Trà Vinh",
        "name_filter": "tra vinh - tra vinh",
        "category": "Quận - Huyện",
        "name_nospace": "travinh-travinh"
    },
    {
        "id": "732",
        "area_id": 60,
        "name": "Chiêm Hóa - Tuyên Quang",
        "name_filter": "chiem hoa - tuyen quang",
        "category": "Quận - Huyện",
        "name_nospace": "chiemhoa-tuyenquang"
    },
    {
        "id": "733",
        "area_id": 60,
        "name": "Hàm Yên - Tuyên Quang",
        "name_filter": "ham yen - tuyen quang",
        "category": "Quận - Huyện",
        "name_nospace": "hamyen-tuyenquang"
    },
    {
        "id": "734",
        "area_id": 60,
        "name": "Lâm Bình - Tuyên Quang",
        "name_filter": "lam binh - tuyen quang",
        "category": "Quận - Huyện",
        "name_nospace": "lambinh-tuyenquang"
    },
    {
        "id": "735",
        "area_id": 60,
        "name": "Na Hang - Tuyên Quang",
        "name_filter": "na hang - tuyen quang",
        "category": "Quận - Huyện",
        "name_nospace": "nahang-tuyenquang"
    },
    {
        "id": "736",
        "area_id": 60,
        "name": "Sơn Dương - Tuyên Quang",
        "name_filter": "son duong - tuyen quang",
        "category": "Quận - Huyện",
        "name_nospace": "sonduong-tuyenquang"
    },
    {
        "id": "737",
        "area_id": 60,
        "name": "Tuyên Quang - Tuyên Quang",
        "name_filter": "tuyen quang - tuyen quang",
        "category": "Quận - Huyện",
        "name_nospace": "tuyenquang-tuyenquang"
    },
    {
        "id": "738",
        "area_id": 60,
        "name": "Yên Sơn - Tuyên Quang",
        "name_filter": "yen son - tuyen quang",
        "category": "Quận - Huyện",
        "name_nospace": "yenson-tuyenquang"
    },
    {
        "id": "739",
        "area_id": 61,
        "name": "Bình Minh - Vĩnh Long",
        "name_filter": "binh minh - vinh long",
        "category": "Quận - Huyện",
        "name_nospace": "binhminh-vinhlong"
    },
    {
        "id": "740",
        "area_id": 61,
        "name": "Bình Tân - Vĩnh Long",
        "name_filter": "binh tan - vinh long",
        "category": "Quận - Huyện",
        "name_nospace": "binhtan-vinhlong"
    },
    {
        "id": "741",
        "area_id": 61,
        "name": "Long Hồ - Vĩnh Long",
        "name_filter": "long ho - vinh long",
        "category": "Quận - Huyện",
        "name_nospace": "longho-vinhlong"
    },
    {
        "id": "742",
        "area_id": 61,
        "name": "Mang Thít - Vĩnh Long",
        "name_filter": "mang thit - vinh long",
        "category": "Quận - Huyện",
        "name_nospace": "mangthit-vinhlong"
    },
    {
        "id": "743",
        "area_id": 61,
        "name": "Tam Bình - Vĩnh Long",
        "name_filter": "tam binh - vinh long",
        "category": "Quận - Huyện",
        "name_nospace": "tambinh-vinhlong"
    },
    {
        "id": "744",
        "area_id": 61,
        "name": "Trà Ôn - Vĩnh Long",
        "name_filter": "tra on - vinh long",
        "category": "Quận - Huyện",
        "name_nospace": "traon-vinhlong"
    },
    {
        "id": "745",
        "area_id": 61,
        "name": "Vĩnh Long - Vĩnh Long",
        "name_filter": "vinh long - vinh long",
        "category": "Quận - Huyện",
        "name_nospace": "vinhlong-vinhlong"
    },
    {
        "id": "746",
        "area_id": 61,
        "name": "Vũng Liêm - Vĩnh Long",
        "name_filter": "vung liem - vinh long",
        "category": "Quận - Huyện",
        "name_nospace": "vungliem-vinhlong"
    },
    {
        "id": "747",
        "area_id": 62,
        "name": "Bình Xuyên - Vĩnh Phúc",
        "name_filter": "binh xuyen - vinh phuc",
        "category": "Quận - Huyện",
        "name_nospace": "binhxuyen-vinhphuc"
    },
    {
        "id": "748",
        "area_id": 62,
        "name": "Lập Thạch - Vĩnh Phúc",
        "name_filter": "lap thach - vinh phuc",
        "category": "Quận - Huyện",
        "name_nospace": "lapthach-vinhphuc"
    },
    {
        "id": "749",
        "area_id": 62,
        "name": "Phúc Yên - Vĩnh Phúc",
        "name_filter": "phuc yen - vinh phuc",
        "category": "Quận - Huyện",
        "name_nospace": "phucyen-vinhphuc"
    },
    {
        "id": "750",
        "area_id": 62,
        "name": "Sông Lô - Vĩnh Phúc",
        "name_filter": "song lo - vinh phuc",
        "category": "Quận - Huyện",
        "name_nospace": "songlo-vinhphuc"
    },
    {
        "id": "751",
        "area_id": 62,
        "name": "Tam Dương - Vĩnh Phúc",
        "name_filter": "tam duong - vinh phuc",
        "category": "Quận - Huyện",
        "name_nospace": "tamduong-vinhphuc"
    },
    {
        "id": "752",
        "area_id": 62,
        "name": "Tam Đảo - Vĩnh Phúc",
        "name_filter": "tam dao - vinh phuc",
        "category": "Quận - Huyện",
        "name_nospace": "tamdao-vinhphuc"
    },
    {
        "id": "753",
        "area_id": 62,
        "name": "Vĩnh Tường - Vĩnh Phúc",
        "name_filter": "vinh tuong - vinh phuc",
        "category": "Quận - Huyện",
        "name_nospace": "vinhtuong-vinhphuc"
    },
    {
        "id": "754",
        "area_id": 62,
        "name": "Vĩnh Yên - Vĩnh Phúc",
        "name_filter": "vinh yen - vinh phuc",
        "category": "Quận - Huyện",
        "name_nospace": "vinhyen-vinhphuc"
    },
    {
        "id": "755",
        "area_id": 62,
        "name": "Yên Lạc - Vĩnh Phúc",
        "name_filter": "yen lac - vinh phuc",
        "category": "Quận - Huyện",
        "name_nospace": "yenlac-vinhphuc"
    },
    {
        "id": "756",
        "area_id": 63,
        "name": "Lục Yên - Yên Bái",
        "name_filter": "luc yen - yen bai",
        "category": "Quận - Huyện",
        "name_nospace": "lucyen-yenbai"
    },
    {
        "id": "757",
        "area_id": 63,
        "name": "Mù Cang Chải - Yên Bái",
        "name_filter": "mu cang chai - yen bai",
        "category": "Quận - Huyện",
        "name_nospace": "mucangchai-yenbai"
    },
    {
        "id": "758",
        "area_id": 63,
        "name": "Nghĩa Lộ - Yên Bái",
        "name_filter": "nghia lo - yen bai",
        "category": "Quận - Huyện",
        "name_nospace": "nghialo-yenbai"
    },
    {
        "id": "759",
        "area_id": 63,
        "name": "Trạm Tấu - Yên Bái",
        "name_filter": "tram tau - yen bai",
        "category": "Quận - Huyện",
        "name_nospace": "tramtau-yenbai"
    },
    {
        "id": "760",
        "area_id": 63,
        "name": "Trấn Yên - Yên Bái",
        "name_filter": "tran yen - yen bai",
        "category": "Quận - Huyện",
        "name_nospace": "tranyen-yenbai"
    },
    {
        "id": "761",
        "area_id": 63,
        "name": "Văn Chấn - Yên Bái",
        "name_filter": "van chan - yen bai",
        "category": "Quận - Huyện",
        "name_nospace": "vanchan-yenbai"
    },
    {
        "id": "762",
        "area_id": 63,
        "name": "Văn Yên - Yên Bái",
        "name_filter": "van yen - yen bai",
        "category": "Quận - Huyện",
        "name_nospace": "vanyen-yenbai"
    },
    {
        "id": "763",
        "area_id": 63,
        "name": "Yên Bái - Yên Bái",
        "name_filter": "yen bai - yen bai",
        "category": "Quận - Huyện",
        "name_nospace": "yenbai-yenbai"
    },
    {
        "id": "764",
        "area_id": 63,
        "name": "Yên Bình - Yên Bái",
        "name_filter": "yen binh - yen bai",
        "category": "Quận - Huyện",
        "name_nospace": "yenbinh-yenbai"
    },
    {
        "id": "131",
        "area_id": 63,
        "name": "Quy Nhơn - Bình Định",
        "name_filter": "quy nhon - binh dinh",
        "category": "Quận - Huyện",
        "name_nospace": "quynhon-binhdinh"
    },
    {
        "id": "114233",
        "area_id": 1,
        "name": "Trà sư - An Giang",
        "name_filter": "tra su - an giang",
        "category": "Quận - Huyện",
        "name_nospace": "trasu-angiang"
    },
    {
        "id": "114234",
        "area_id": 1,
        "name": "Chùa Bà Châu Đốc",
        "name_filter": "chua ba chau doc",
        "category": "Quận - Huyện",
        "name_nospace": "chuabachaudoc"
    },
    {
        "id": "114235",
        "area_id": 5,
        "name": "Cánh Đồng Quạt Gió",
        "name_filter": "canh dong quat gio",
        "category": "Quận - Huyện",
        "name_nospace": "canhdongquatgio"
    },
    {
        "id": "114236",
        "area_id": 7,
        "name": "Cồn Phụng - Bến Tre",
        "name_filter": "con phung - ben tre",
        "category": "Quận - Huyện",
        "name_nospace": "conphung-bentre"
    },
    {
        "id": "114237",
        "area_id": 11,
        "name": "Phan Rí - Bình Thuận",
        "name_filter": "phan ri - binh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "phanri-binhthuan"
    },
    {
        "id": "114238",
        "area_id": 11,
        "name": "Liên Hương - Bình Thuận",
        "name_filter": "lien huong - binh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "lienhuong-binhthuan"
    },
    {
        "id": "114239",
        "area_id": 11,
        "name": "Coco Beach - Bình Thuận",
        "name_filter": "coco beach - binh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "cocobeach-binhthuan"
    },
    {
        "id": "114240",
        "area_id": 11,
        "name": "Cổ Thạch - Bình Thuận",
        "name_filter": "co thach - binh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "cothach-binhthuan"
    },
    {
        "id": "114241",
        "area_id": 11,
        "name": "Hòn Rơm - Bình Thuận",
        "name_filter": "hon rom - binh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "honrom-binhthuan"
    },
    {
        "id": "114242",
        "area_id": 12,
        "name": "Biển Khai Long - Cà Mau",
        "name_filter": "bien khai long - ca mau",
        "category": "Quận - Huyện",
        "name_nospace": "bienkhailong-camau"
    },
    {
        "id": "114243",
        "area_id": 13,
        "name": "Chợ Nổi Cái Răng",
        "name_filter": "cho noi cai rang",
        "category": "Quận - Huyện",
        "name_nospace": "chonoicairang"
    },
    {
        "id": "114244",
        "area_id": 16,
        "name": "Hồ Lắk - Đắk Lắk",
        "name_filter": "ho lak - dak lak",
        "category": "Quận - Huyện",
        "name_nospace": "holak-daklak"
    },
    {
        "id": "114245",
        "area_id": 21,
        "name": "Chư Đăng Ya - Gia Lai",
        "name_filter": "chu dang ya - gia lai",
        "category": "Quận - Huyện",
        "name_nospace": "chudangya-gialai"
    },
    {
        "id": "114246",
        "area_id": 33,
        "name": "Biển Mũi Nai - Kiên Giang",
        "name_filter": "bien mui nai - kien giang",
        "category": "Quận - Huyện",
        "name_nospace": "bienmuinai-kiengiang"
    },
    {
        "id": "114247",
        "area_id": 25,
        "name": "Vũng Áng - Hà Tĩnh",
        "name_filter": "vung ang - ha tinh",
        "category": "Quận - Huyện",
        "name_nospace": "vungang-hatinh"
    },
    {
        "id": "114248",
        "area_id": 27,
        "name": "Cát Bà - Hải Phòng",
        "name_filter": "cat ba - hai phong",
        "category": "Quận - Huyện",
        "name_nospace": "catba-haiphong"
    },
    {
        "id": "114249",
        "area_id": 28,
        "name": "Chợ Nổi Ngã Bảy",
        "name_filter": "cho noi nga bay",
        "category": "Quận - Huyện",
        "name_nospace": "chonoingabay"
    },
    {
        "id": "114250",
        "area_id": 57,
        "name": "Vịnh Lăng Cô",
        "name_filter": "vinh lang co",
        "category": "Quận - Huyện",
        "name_nospace": "vinhlangco"
    },
    {
        "id": "114251",
        "area_id": 32,
        "name": "Vịnh Ninh Vân",
        "name_filter": "vinh ninh van",
        "category": "Quận - Huyện",
        "name_nospace": "vinhninhvan"
    },
    {
        "id": "114252",
        "area_id": 38,
        "name": "Bảo Hà - Lào Cai",
        "name_filter": "bao ha - lao cai",
        "category": "Quận - Huyện",
        "name_nospace": "baoha-laocai"
    },
    {
        "id": "114253",
        "area_id": 39,
        "name": "Làng Nổi Tân Lập",
        "name_filter": "lang noi tan lap",
        "category": "Quận - Huyện",
        "name_nospace": "langnoitanlap"
    },
    {
        "id": "114254",
        "area_id": 42,
        "name": "Tràng An - Bái Đính",
        "name_filter": "trang an - bai dinh",
        "category": "Quận - Huyện",
        "name_nospace": "trangan-baidinh"
    },
    {
        "id": "114255",
        "area_id": 42,
        "name": "Tam Cốc Bích Động",
        "name_filter": "tam coc bich dong",
        "category": "Quận - Huyện",
        "name_nospace": "tamcocbichdong"
    },
    {
        "id": "114256",
        "area_id": 43,
        "name": "Ninh Chữ - Ninh Thuận",
        "name_filter": "ninh chu - ninh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "ninhchu-ninhthuan"
    },
    {
        "id": "114257",
        "area_id": 43,
        "name": "Vịnh Vĩnh Hy - Ninh Thuận",
        "name_filter": "vinh vinh hy - ninh thuan",
        "category": "Quận - Huyện",
        "name_nospace": "vinhvinhhy-ninhthuan"
    },
    {
        "id": "114258",
        "area_id": 45,
        "name": "Ghềnh Đá Dĩa - Phú Yên",
        "name_filter": "ghenh da dia - phu yen",
        "category": "Quận - Huyện",
        "name_nospace": "ghenhdadia-phuyen"
    },
    {
        "id": "114259",
        "area_id": 45,
        "name": "Vịnh Xuân Đài - Phú Yên",
        "name_filter": "vinh xuan dai - phu yen",
        "category": "Quận - Huyện",
        "name_nospace": "vinhxuandai-phuyen"
    },
    {
        "id": "114260",
        "area_id": 45,
        "name": "Đầm Ô Loan - Phú Yên",
        "name_filter": "dam o loan - phu yen",
        "category": "Quận - Huyện",
        "name_nospace": "damoloan-phuyen"
    },
    {
        "id": "114261",
        "area_id": 46,
        "name": "Phong Nha - Quảng Bình",
        "name_filter": "phong nha - quang binh",
        "category": "Quận - Huyện",
        "name_nospace": "phongnha-quangbinh"
    },
    {
        "id": "114262",
        "area_id": 53,
        "name": "Núi Bà Đen - Tây Ninh",
        "name_filter": "nui ba den - tay ninh",
        "category": "Quận - Huyện",
        "name_nospace": "nuibaden-tayninh"
    },
    {
        "id": "114263",
        "area_id": 58,
        "name": "Biển Tân Thành - Tiền Giang",
        "name_filter": "bien tan thanh - tien giang",
        "category": "Quận - Huyện",
        "name_nospace": "bientanthanh-tiengiang"
    },
    {
        "id": "114264",
        "area_id": 58,
        "name": "Cù Lao Thái Sơn",
        "name_filter": "cu lao thai son",
        "category": "Quận - Huyện",
        "name_nospace": "culaothaison"
    },
    {
        "id": "114265",
        "area_id": 59,
        "name": "Biển Ba Động - Trà Vinh",
        "name_filter": "bien ba dong - tra vinh",
        "category": "Quận - Huyện",
        "name_nospace": "bienbadong-travinh"
    },
    {
        "id": "114266",
        "area_id": 2,
        "name": "Long Hải",
        "name_filter": "long hai",
        "category": "Quận - Huyện",
        "name_nospace": "longhai"
    },
    {
        "id": "117412",
        "area_id": 45,
        "name": "Vũng Rô - Phú Yên",
        "name_filter": "vung ro - phu yen",
        "category": "Quận - Huyện",
        "name_nospace": "vungro-phuyen"
    },
    {
        "id": "102188",
        "area_id": 24,
        "name": "Sân bay Nội Bài",
        "name_filter": "san bay noi bai",
        "category": "Sân Bay",
        "name_nospace": "sanbaynoibai"
    },
    {
        "id": "28284",
        "area_id": 29,
        "name": "Sân bay Tân Sơn Nhất",
        "name_filter": "san bay tan son nhat",
        "category": "Sân Bay",
        "name_nospace": "sanbaytansonnhat"
    },
    {
        "id": "135234",
        "area_id": 16,
        "name": "Phước An - Krông Pắk - Đắk Lắk",
        "name_filter": "phuoc an - krong pak - dak lak",
        "category": "Phường - Xã",
        "name_nospace": "phuocan-krongpak-daklak"
    },
    {
        "id": "135235",
        "area_id": 46,
        "name": "Hoàn Lão - Bố Trạch - Quảng Bình",
        "name_filter": "hoan lao - bo trach - quang binh",
        "category": "Phường - Xã",
        "name_nospace": "hoanlao-botrach-quangbinh"
    },
    {
        "id": "135236",
        "area_id": 46,
        "name": "Roòn - Quảng Trạch - Quảng Bình",
        "name_filter": "roon - quang trach - quang binh",
        "category": "Phường - Xã",
        "name_nospace": "roon-quangtrach-quangbinh"
    },
    {
        "id": "135237",
        "area_id": 46,
        "name": "Thanh Khê - Bố Trạch - Quảng Bình",
        "name_filter": "thanh khe - bo trach - quang binh",
        "category": "Phường - Xã",
        "name_nospace": "thanhkhe-botrach-quangbinh"
    },
    {
        "id": "135238",
        "area_id": 46,
        "name": "Nông Trường Việt Trung",
        "name_filter": "nong truong viet trung",
        "category": "Phường - Xã",
        "name_nospace": "nongtruongviettrung"
    },
    {
        "id": "135239",
        "area_id": 46,
        "name": "Lý Hoà - Bố Trạch - Quảng Bình",
        "name_filter": "ly hoa - bo trach - quang binh",
        "category": "Phường - Xã",
        "name_nospace": "lyhoa-botrach-quangbinh"
    },
    {
        "id": "135240",
        "area_id": 50,
        "name": "Hồ Xá - Vĩnh Linh - Quảng Trị",
        "name_filter": "ho xa - vinh linh - quang tri",
        "category": "Phường - Xã",
        "name_nospace": "hoxa-vinhlinh-quangtri"
    },
    {
        "id": "135241",
        "area_id": 50,
        "name": "Lao Bảo - Hương Hóa - Quảng Trị",
        "name_filter": "lao bao - huong hoa - quang tri",
        "category": "Phường - Xã",
        "name_nospace": "laobao-huonghoa-quangtri"
    },
    {
        "id": "135244",
        "area_id": 48,
        "name": "Cảng Sa Kỳ - Quảng Ngãi",
        "name_filter": "cang sa ky - quang ngai",
        "category": "Sân Bay",
        "name_nospace": "cangsaky-quangngai"
    },
    {
        "id": "135243",
        "area_id": 599,
        "name": "Sa Kỳ - Quảng Ngãi",
        "name_filter": "sa ky - quang ngai",
        "category": "Quận - Huyện",
        "name_nospace": "saky-quangngai"
    },
    {
        "id": "135544",
        "area_id": 2,
        "name": "Sân bay Côn Đảo",
        "name_filter": "san bay con dao",
        "category": "Sân Bay",
        "name_nospace": "sanbaycondao"
    },
    {
        "id": "133906",
        "area_id": 204,
        "name": "Sân Bay Buôn Ma Thuột",
        "name_filter": "san bay buon ma thuot",
        "category": "Sân Bay",
        "name_nospace": "sanbaybuonmathuot"
    },
    {
        "id": "135546",
        "area_id": 163,
        "name": "Sân bay Cà Mau",
        "name_filter": "san bay ca mau",
        "category": "Sân Bay",
        "name_nospace": "sanbaycamau"
    },
    {
        "id": "135552",
        "area_id": 413,
        "name": "Sân bay Cam Ranh",
        "name_filter": "san bay cam ranh",
        "category": "Sân Bay",
        "name_nospace": "sanbaycamranh"
    },
    {
        "id": "135547",
        "area_id": 172,
        "name": "Sân bay Cần Thơ",
        "name_filter": "san bay can tho",
        "category": "Sân Bay",
        "name_nospace": "sanbaycantho"
    },
    {
        "id": "135551",
        "area_id": 351,
        "name": "Sân bay Cát Bi",
        "name_filter": "san bay cat bi",
        "category": "Sân Bay",
        "name_nospace": "sanbaycatbi"
    },
    {
        "id": "135548",
        "area_id": 195,
        "name": "Sân bay Đà Nẵng",
        "name_filter": "san bay da nang",
        "category": "Sân Bay",
        "name_nospace": "sanbaydanang"
    },
    {
        "id": "135549",
        "area_id": 227,
        "name": "Sân bay Điện Biên Phủ",
        "name_filter": "san bay dien bien phu",
        "category": "Sân Bay",
        "name_nospace": "sanbaydienbienphu"
    },
    {
        "id": "135557",
        "area_id": 568,
        "name": "Sân bay Đồng Hới",
        "name_filter": "san bay dong hoi",
        "category": "Sân Bay",
        "name_nospace": "sanbaydonghoi"
    },
    {
        "id": "112068",
        "area_id": 462,
        "name": "Sân Bay Liên Khương",
        "name_filter": "san bay lien khuong",
        "category": "Sân Bay",
        "name_nospace": "sanbaylienkhuong"
    },
    {
        "id": "135559",
        "area_id": 706,
        "name": "Sân bay Phú Bài",
        "name_filter": "san bay phu bai",
        "category": "Sân Bay",
        "name_nospace": "sanbayphubai"
    },
    {
        "id": "135545",
        "area_id": 129,
        "name": "Sân bay Phù Cát",
        "name_filter": "san bay phu cat",
        "category": "Sân Bay",
        "name_nospace": "sanbayphucat"
    },
    {
        "id": "135554",
        "area_id": 431,
        "name": "Sân bay Phú Quốc",
        "name_filter": "san bay phu quoc",
        "category": "Sân Bay",
        "name_nospace": "sanbayphuquoc"
    },
    {
        "id": "135550",
        "area_id": 274,
        "name": "Sân bay Pleiku",
        "name_filter": "san bay pleiku",
        "category": "Sân Bay",
        "name_nospace": "sanbaypleiku"
    },
    {
        "id": "135553",
        "area_id": 432,
        "name": "Sân bay Rạch Giá",
        "name_filter": "san bay rach gia",
        "category": "Sân Bay",
        "name_nospace": "sanbayrachgia"
    },
    {
        "id": "135558",
        "area_id": 699,
        "name": "Sân bay Thọ Xuân",
        "name_filter": "san bay tho xuan",
        "category": "Sân Bay",
        "name_nospace": "sanbaythoxuan"
    },
    {
        "id": "135556",
        "area_id": 566,
        "name": "Sân bay Tuy Hòa",
        "name_filter": "san bay tuy hoa",
        "category": "Sân Bay",
        "name_nospace": "sanbaytuyhoa"
    },
    {
        "id": "135555",
        "area_id": 528,
        "name": "Sân bay Vinh",
        "name_filter": "san bay vinh",
        "category": "Sân Bay",
        "name_nospace": "sanbayvinh"
    },
    {
        "id": "112626",
        "area_id": 112625,
        "name": "Quảng Tây - Trung Quốc",
        "name_filter": "quang tay - trung quoc",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "quangtay-trungquoc"
    },
    {
        "id": "112627",
        "area_id": 112625,
        "name": "Quảng Đông - Trung Quốc",
        "name_filter": "quang dong - trung quoc",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "quangdong-trungquoc"
    },
    {
        "id": "112628",
        "area_id": 112625,
        "name": "Ma Cao - Trung Quốc",
        "name_filter": "ma cao - trung quoc",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "macao-trungquoc"
    },
    {
        "id": "112629",
        "area_id": 112625,
        "name": "Hữu Nghị Quan - Trung Quốc",
        "name_filter": "huu nghi quan - trung quoc",
        "category": "Tỉnh - Thành Phố",
        "name_nospace": "huunghiquan-trungquoc"
    },
    {
        "id": "112669",
        "area_id": 112625,
        "name": "Hữu Nghị Quan - Trung Quốc",
        "name_filter": "huu nghi quan - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "huunghiquan-trungquoc"
    },
    {
        "id": "112668",
        "area_id": 112625,
        "name": "Ma Cao - Trung Quốc",
        "name_filter": "ma cao - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "macao-trungquoc"
    },
    {
        "id": "112632",
        "area_id": 112625,
        "name": "Bách Sắc - Trung Quốc",
        "name_filter": "bach sac - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "bachsac-trungquoc"
    },
    {
        "id": "112633",
        "area_id": 112625,
        "name": "Hà Trì - Trung Quốc",
        "name_filter": "ha tri - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "hatri-trungquoc"
    },
    {
        "id": "112634",
        "area_id": 112625,
        "name": "Liễu Châu - Trung Quốc",
        "name_filter": "lieu chau - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "lieuchau-trungquoc"
    },
    {
        "id": "112635",
        "area_id": 112625,
        "name": "Quế Lâm - Trung Quốc",
        "name_filter": "que lam - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "quelam-trungquoc"
    },
    {
        "id": "112636",
        "area_id": 112625,
        "name": "Hạ Châu - Trung Quốc",
        "name_filter": "ha chau - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "hachau-trungquoc"
    },
    {
        "id": "112637",
        "area_id": 112625,
        "name": "Sùng Tả - Trung Quốc",
        "name_filter": "sung ta - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "sungta-trungquoc"
    },
    {
        "id": "112638",
        "area_id": 112625,
        "name": "Nam Ninh - Trung Quốc",
        "name_filter": "nam ninh - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "namninh-trungquoc"
    },
    {
        "id": "112639",
        "area_id": 112625,
        "name": "Lai Tân - Trung Quốc",
        "name_filter": "lai tan - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "laitan-trungquoc"
    },
    {
        "id": "112640",
        "area_id": 112625,
        "name": "Quý Cảng - Trung Quốc",
        "name_filter": "quy cang - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "quycang-trungquoc"
    },
    {
        "id": "112641",
        "area_id": 112625,
        "name": "Ngô Châu - Trung Quốc",
        "name_filter": "ngo chau - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "ngochau-trungquoc"
    },
    {
        "id": "112642",
        "area_id": 112625,
        "name": "Phòng Thành Cảng - Trung Quốc",
        "name_filter": "phong thanh cang - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "phongthanhcang-trungquoc"
    },
    {
        "id": "112643",
        "area_id": 112625,
        "name": "Khâm Châu - Trung Quốc",
        "name_filter": "kham chau - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "khamchau-trungquoc"
    },
    {
        "id": "112644",
        "area_id": 112625,
        "name": "Bắc Hải - Trung Quốc",
        "name_filter": "bac hai - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "bachai-trungquoc"
    },
    {
        "id": "112645",
        "area_id": 112625,
        "name": "Bằng Tường - Trung Quốc",
        "name_filter": "bang tuong - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "bangtuong-trungquoc"
    },
    {
        "id": "112646",
        "area_id": 112625,
        "name": "Ngọc Lâm - Trung Quốc",
        "name_filter": "ngoc lam - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "ngoclam-trungquoc"
    },
    {
        "id": "112647",
        "area_id": 112625,
        "name": "Quảng Châu - Trung Quốc",
        "name_filter": "quang chau - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "quangchau-trungquoc"
    },
    {
        "id": "112648",
        "area_id": 112625,
        "name": "Thâm Quyến - Trung Quốc",
        "name_filter": "tham quyen - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "thamquyen-trungquoc"
    },
    {
        "id": "112649",
        "area_id": 112625,
        "name": "Thanh Viễn - Trung Quốc",
        "name_filter": "thanh vien - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "thanhvien-trungquoc"
    },
    {
        "id": "112650",
        "area_id": 112625,
        "name": "Thiều Quan - Trung Quốc",
        "name_filter": "thieu quan - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "thieuquan-trungquoc"
    },
    {
        "id": "112651",
        "area_id": 112625,
        "name": "Hà Nguyên - Trung Quốc",
        "name_filter": "ha nguyen - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "hanguyen-trungquoc"
    },
    {
        "id": "112652",
        "area_id": 112625,
        "name": "Mai Châu - Trung Quốc",
        "name_filter": "mai chau - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "maichau-trungquoc"
    },
    {
        "id": "112653",
        "area_id": 112625,
        "name": "Triều Châu - Trung Quốc",
        "name_filter": "trieu chau - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "trieuchau-trungquoc"
    },
    {
        "id": "112654",
        "area_id": 112625,
        "name": "Triệu Khánh - Trung Quốc",
        "name_filter": "trieu khanh - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "trieukhanh-trungquoc"
    },
    {
        "id": "112655",
        "area_id": 112625,
        "name": "Vân Phù - Trung Quốc",
        "name_filter": "van phu - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "vanphu-trungquoc"
    },
    {
        "id": "112656",
        "area_id": 112625,
        "name": "Phật Sơn - Trung Quốc",
        "name_filter": "phat son - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "phatson-trungquoc"
    },
    {
        "id": "112657",
        "area_id": 112625,
        "name": "Đông Hoản - Trung Quốc",
        "name_filter": "dong hoan - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "donghoan-trungquoc"
    },
    {
        "id": "112658",
        "area_id": 112625,
        "name": "Huệ Châu - Trung Quốc",
        "name_filter": "hue chau - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "huechau-trungquoc"
    },
    {
        "id": "112659",
        "area_id": 112625,
        "name": "Sán Vĩ - Trung Quốc",
        "name_filter": "san vi - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "sanvi-trungquoc"
    },
    {
        "id": "112660",
        "area_id": 112625,
        "name": "Yết Dương - Trung Quốc",
        "name_filter": "yet duong - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "yetduong-trungquoc"
    },
    {
        "id": "112661",
        "area_id": 112625,
        "name": "Sán Đầu - Trung Quốc",
        "name_filter": "san dau - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "sandau-trungquoc"
    },
    {
        "id": "112662",
        "area_id": 112625,
        "name": "Trạm Giang - Trung Quốc",
        "name_filter": "tram giang - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "tramgiang-trungquoc"
    },
    {
        "id": "112663",
        "area_id": 112625,
        "name": "Mậu Danh - Trung Quốc",
        "name_filter": "mau danh - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "maudanh-trungquoc"
    },
    {
        "id": "112664",
        "area_id": 112625,
        "name": "Dương Giang - Trung Quốc",
        "name_filter": "duong giang - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "duonggiang-trungquoc"
    },
    {
        "id": "112665",
        "area_id": 112625,
        "name": "Giang Môn - Trung Quốc",
        "name_filter": "giang mon - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "giangmon-trungquoc"
    },
    {
        "id": "112666",
        "area_id": 112625,
        "name": "Trung Sơn - Trung Quốc",
        "name_filter": "trung son - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "trungson-trungquoc"
    },
    {
        "id": "112667",
        "area_id": 112625,
        "name": "Châu Hải - Trung Quốc",
        "name_filter": "chau hai - trung quoc",
        "category": "Quận - Huyện",
        "name_nospace": "chauhai-trungquoc"
    },
    {
        "id": "178",
        "area_id": 13,
        "name": "Thốt Nốt - Cần Thơ",
        "name_filter": "thot not - can tho",
        "category": "Quận - Huyện",
        "name_nospace": "thotnot-cantho"
    },
    {
        "id": "28029",
        "area_id": 28029,
        "name": "Ba Đồn - Quảng Bình",
        "name_filter": "ba don - quang binh",
        "category": "Quận - Huyện",
        "name_nospace": "badon-quangbinh"
    },
    {
        "id": "135965",
        "area_id": 56,
        "name": "Nghi Sơn - Thanh Hóa",
        "name_filter": "nghi son - thanh hoa",
        "category": "Phường - Xã",
        "name_nospace": "nghison-thanhhoa"
    },
    {
        "id": "145844",
        "area_id": 244,
        "name": "Trị An - Vĩnh Cửu - Đồng Nai",
        "name_filter": "tri an - vinh cuu - dong nai",
        "category": "Phường - Xã",
        "name_nospace": "trian-vinhcuu-dongnai"
    },
    {
        "id": "135774",
        "area_id": 112626,
        "name": "Sân Bay Nam Ninh - Quảng Tây - Trung Quốc",
        "name_filter": "san bay nam ninh - quang tay - trung quoc",
        "category": "Sân Bay",
        "name_nospace": "sanbaynamninh-quangtay-trungquoc"
    },
    {
        "id": "135775",
        "area_id": 112626,
        "name": "Bến xe Lãng Đông - Quảng Tây - Trung Quốc",
        "name_filter": "ben xe lang dong - quang tay - trung quoc",
        "category": "Bến xe",
        "name_nospace": "benxelangdong-quangtay-trungquoc"
    },
    {
        "id": "102376",
        "area_id": 243,
        "name": "Ngã Ba Trị An - Đồng Nai",
        "name_filter": "nga ba tri an - dong nai",
        "category": "Điểm dừng phổ biến",
        "name_nospace": "ngabatrian-dongnai"
    },
    {
        "id": "157631",
        "area_id": 138387,
        "name": "Cầu kính Rồng Mây Sapa",
        "name_filter": "cau kinh rong may sapa",
        "category": "Điểm dừng phổ biến",
        "name_nospace": "caukinhrongmaysapa"
    },
    {
        "id": "157632",
        "area_id": 138216,
        "name": "Bản Tả Van - SaPa",
        "name_filter": "ban ta van - sapa",
        "category": "Điểm dừng phổ biến",
        "name_nospace": "bantavan-sapa"
    },
    {
        "id": "376",
        "area_id": 376,
        "name": "Quận 1 - Hồ Chí Minh",
        "name_filter": "quan 1 - ho chi minh",
        "category": "Quận - Huyện",
        "name_nospace": "quan1-hochiminh"
    },
    {
        "id": "367",
        "area_id": 29,
        "name": "Bình Chánh - Hồ Chí Minh",
        "name_filter": "binh chanh - ho chi minh",
        "category": "Quận - Huyện",
        "name_nospace": "binhchanh-hochiminh"
    },
    {
        "id": "368",
        "area_id": 29,
        "name": "Bình Tân - Hồ Chí Minh",
        "name_filter": "binh tan - ho chi minh",
        "category": "Quận - Huyện",
        "name_nospace": "binhtan-hochiminh"
    },
    {
        "id": "369",
        "area_id": 29,
        "name": "Bình Thạnh - Hồ Chí Minh",
        "name_filter": "binh thanh - ho chi minh",
        "category": "Quận - Huyện",
        "name_nospace": "binhthanh-hochiminh"
    },
    {
        "id": "371",
        "area_id": 29,
        "name": "Củ Chi - Hồ Chí Minh",
        "name_filter": "cu chi - ho chi minh",
        "category": "Quận - Huyện",
        "name_nospace": "cuchi-hochiminh"
    },
    {
        "id": "372",
        "area_id": 29,
        "name": "Gò Vấp - Hồ Chí Minh",
        "name_filter": "go vap - ho chi minh",
        "category": "Quận - Huyện",
        "name_nospace": "govap-hochiminh"
    },
    {
        "id": "373",
        "area_id": 29,
        "name": "Hóc Môn - Hồ Chí Minh",
        "name_filter": "hoc mon - ho chi minh",
        "category": "Quận - Huyện",
        "name_nospace": "hocmon-hochiminh"
    },
    {
        "id": "374",
        "area_id": 29,
        "name": "Nhà Bè - Hồ Chí Minh",
        "name_filter": "nha be - ho chi minh",
        "category": "Quận - Huyện",
        "name_nospace": "nhabe-hochiminh"
    },
    {
        "id": "375",
        "area_id": 29,
        "name": "Phú Nhuận - Hồ Chí Minh",
        "name_filter": "phu nhuan - ho chi minh",
        "category": "Quận - Huyện",
        "name_nospace": "phunhuan-hochiminh"
    },
    {
        "id": "378",
        "area_id": 29,
        "name": "Quận 3 - Hồ Chí Minh",
        "name_filter": "quan 3 - ho chi minh",
        "category": "Quận - Huyện",
        "name_nospace": "quan3-hochiminh"
    },
    {
        "id": "379",
        "area_id": 29,
        "name": "Quận 4 - Hồ Chí Minh",
        "name_filter": "quan 4 - ho chi minh",
        "category": "Quận - Huyện",
        "name_nospace": "quan4-hochiminh"
    },
    {
        "id": "380",
        "area_id": 29,
        "name": "Quận 5 - Hồ Chí Minh",
        "name_filter": "quan 5 - ho chi minh",
        "category": "Quận - Huyện",
        "name_nospace": "quan5-hochiminh"
    },
    {
        "id": "381",
        "area_id": 29,
        "name": "Quận 6 - Hồ Chí Minh",
        "name_filter": "quan 6 - ho chi minh",
        "category": "Quận - Huyện",
        "name_nospace": "quan6-hochiminh"
    },
    {
        "id": "382",
        "area_id": 29,
        "name": "Quận 7 - Hồ Chí Minh",
        "name_filter": "quan 7 - ho chi minh",
        "category": "Quận - Huyện",
        "name_nospace": "quan7-hochiminh"
    },
    {
        "id": "383",
        "area_id": 29,
        "name": "Quận 8 - Hồ Chí Minh",
        "name_filter": "quan 8 - ho chi minh",
        "category": "Quận - Huyện",
        "name_nospace": "quan8-hochiminh"
    },
    {
        "id": "385",
        "area_id": 29,
        "name": "Quận 10 - Hồ Chí Minh",
        "name_filter": "quan 10 - ho chi minh",
        "category": "Quận - Huyện",
        "name_nospace": "quan10-hochiminh"
    },
    {
        "id": "386",
        "area_id": 29,
        "name": "Quận 11 - Hồ Chí Minh",
        "name_filter": "quan 11 - ho chi minh",
        "category": "Quận - Huyện",
        "name_nospace": "quan11-hochiminh"
    },
    {
        "id": "387",
        "area_id": 29,
        "name": "Quận 12 - Hồ Chí Minh",
        "name_filter": "quan 12 - ho chi minh",
        "category": "Quận - Huyện",
        "name_nospace": "quan12-hochiminh"
    },
    {
        "id": "388",
        "area_id": 29,
        "name": "Tân Bình - Hồ Chí Minh",
        "name_filter": "tan binh - ho chi minh",
        "category": "Quận - Huyện",
        "name_nospace": "tanbinh-hochiminh"
    },
    {
        "id": "389",
        "area_id": 29,
        "name": "Tân Phú - Hồ Chí Minh",
        "name_filter": "tan phu - ho chi minh",
        "category": "Quận - Huyện",
        "name_nospace": "tanphu-hochiminh"
    },
    {
        "id": "390",
        "area_id": 29,
        "name": "Thủ Đức - Hồ Chí Minh",
        "name_filter": "thu duc - ho chi minh",
        "category": "Quận - Huyện",
        "name_nospace": "thuduc-hochiminh"
    },
    {
        "id": "303",
        "name": "Hoàn Kiếm - Hà Nội",
        "name_filter": "hoan kiem - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "hoankiem-hanoi"
    },
    {
        "id": "298",
        "name": "Đống Đa - Hà Nội",
        "name_filter": "dong da - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "dongda-hanoi"
    },
    {
        "id": "292",
        "name": "Ba Đình - Hà Nội",
        "name_filter": "ba dinh - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "badinh-hanoi"
    },
    {
        "id": "301",
        "name": "Hai Bà Trưng - Hà Nội",
        "name_filter": "hai ba trung - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "haibatrung-hanoi"
    },
    {
        "id": "304",
        "name": "Hoàng Mai - Hà Nội",
        "name_filter": "hoang mai - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "hoangmai-hanoi"
    },
    {
        "id": "317",
        "name": "Thanh Xuân - Hà Nội",
        "name_filter": "thanh xuan - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "thanhxuan-hanoi"
    },
    {
        "id": "305",
        "name": "Long Biên - Hà Nội",
        "name_filter": "long bien - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "longbien-hanoi"
    },
    {
        "id": "28024",
        "name": "Nam Từ Liêm - Hà Nội",
        "name_filter": "nam tu liem - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "namtuliem-hanoi"
    },
    {
        "id": "28023",
        "name": "Bắc Từ Liêm - Hà Nội",
        "name_filter": "bac tu liem - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "bactuliem-hanoi"
    },
    {
        "id": "313",
        "name": "Tây Hồ - Hà Nội",
        "name_filter": "tay ho - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "tayho-hanoi"
    },
    {
        "id": "294",
        "name": "Cầu Giấy - Hà Nội",
        "name_filter": "cau giay - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "caugiay-hanoi"
    },
    {
        "id": "300",
        "name": "Hà Đông - Hà Nội",
        "name_filter": "ha dong - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "hadong-hanoi"
    },
    {
        "id": "312",
        "name": "Thị Xã Sơn Tây - Hà Nội",
        "name_filter": "thi xa son tay - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "thixasontay-hanoi"
    },
    {
        "id": "293",
        "name": "Ba Vì - Hà Nội",
        "name_filter": "ba vi - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "bavi-hanoi"
    },
    {
        "id": "295",
        "name": "Chương Mỹ - Hà Nội",
        "name_filter": "chuong my - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "chuongmy-hanoi"
    },
    {
        "id": "309",
        "name": "Phúc Thọ - Hà Nội",
        "name_filter": "phuc tho - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "phuctho-hanoi"
    },
    {
        "id": "296",
        "name": "Đan Phượng - Hà Nội",
        "name_filter": "dan phuong - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "danphuong-hanoi"
    },
    {
        "id": "297",
        "name": "Đông Anh - Hà Nội",
        "name_filter": "dong anh - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "donganh-hanoi"
    },
    {
        "id": "299",
        "name": "Gia Lâm - Hà Nội",
        "name_filter": "gia lam - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "gialam-hanoi"
    },
    {
        "id": "302",
        "name": "Hoài Đức - Hà Nội",
        "name_filter": "hoai duc - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "hoaiduc-hanoi"
    },
    {
        "id": "306",
        "name": "Mê Linh - Hà Nội",
        "name_filter": "me linh - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "melinh-hanoi"
    },
    {
        "id": "307",
        "name": "Mỹ Đức - Hà Nội",
        "name_filter": "my duc - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "myduc-hanoi"
    },
    {
        "id": "308",
        "name": "Phú Xuyên - Hà Nội",
        "name_filter": "phu xuyen - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "phuxuyen-hanoi"
    },
    {
        "id": "310",
        "name": "Quốc Oai - Hà Nội",
        "name_filter": "quoc oai - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "quocoai-hanoi"
    },
    {
        "id": "311",
        "name": "Sóc Sơn - Hà Nội",
        "name_filter": "soc son - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "socson-hanoi"
    },
    {
        "id": "314",
        "name": "Thạch Thất - Hà Nội",
        "name_filter": "thach that - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "thachthat-hanoi"
    },
    {
        "id": "315",
        "name": "Thanh Oai - Hà Nội",
        "name_filter": "thanh oai - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "thanhoai-hanoi"
    },
    {
        "id": "318",
        "name": "Thường Tín - Hà Nội",
        "name_filter": "thuong tin - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "thuongtin-hanoi"
    },
    {
        "id": "320",
        "name": "Ứng Hòa - Hà Nội",
        "name_filter": "ung hoa - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "unghoa-hanoi"
    },
    {
        "id": "316",
        "name": "Thanh Trì - Hà Nội",
        "name_filter": "thanh tri - ha noi",
        "category": "Quận - Huyện",
        "name_nospace": "thanhtri-hanoi"
    },
    {
        "id": "135401",
        "area_id": 135401,
        "name": "Phú Thạnh - Tuy Hòa",
        "name_filter": "phu thanh - tuy hoa",
        "category": "Phường - Xã",
        "name_nospace": "phuthanh-tuyhoa"
    },
    {
        "id": "136496",
        "area_id": 136496,
        "name": "Hải Hoà - Thanh Hóa",
        "name_filter": "hai hoa - thanh hoa",
        "category": "Phường - Xã",
        "name_nospace": "haihoa-thanhhoa"
    },
    {
        "id": "136609",
        "area_id": 136609,
        "name": "La Hai - Tuy Hòa",
        "name_filter": "la hai - tuy hoa",
        "category": "Phường - Xã",
        "name_nospace": "lahai-tuyhoa"
    },
    {
        "id": "136616",
        "area_id": 136616,
        "name": "Phú Lâm - Tuy Hòa",
        "name_filter": "phu lam - tuy hoa",
        "category": "Phường - Xã",
        "name_nospace": "phulam-tuyhoa"
    },
    {
        "id": "136617",
        "area_id": 136617,
        "name": "Phú Đông - Tuy Hòa",
        "name_filter": "phu dong - tuy hoa",
        "category": "Phường - Xã",
        "name_nospace": "phudong-tuyhoa"
    },
    {
        "id": "136618",
        "area_id": 136618,
        "name": "Phan Rí Cửa - Bình Thuận",
        "name_filter": "phan ri cua - binh thuan",
        "category": "Phường - Xã",
        "name_nospace": "phanricua-binhthuan"
    },
    {
        "id": "136619",
        "area_id": 136619,
        "name": "Chí Công - Bình Thuận",
        "name_filter": "chi cong - binh thuan",
        "category": "Phường - Xã",
        "name_nospace": "chicong-binhthuan"
    },
    {
        "id": "136620",
        "area_id": 136620,
        "name": "Quan Lạn - Quảng Ninh",
        "name_filter": "quan lan - quang ninh",
        "category": "Phường - Xã",
        "name_nospace": "quanlan-quangninh"
    },
    {
        "id": "136622",
        "area_id": 136622,
        "name": "Đảo Mắt Rồng - Quảng Ninh",
        "name_filter": "dao mat rong - quang ninh",
        "category": "Phường - Xã",
        "name_nospace": "daomatrong-quangninh"
    },
    {
        "id": "136624",
        "area_id": 136624,
        "name": "Hòn Dấu - Hải Phòng",
        "name_filter": "hon dau - hai phong",
        "category": "Phường - Xã",
        "name_nospace": "hondau-haiphong"
    },
    {
        "id": "136625",
        "area_id": 136625,
        "name": "Đảo Cái Chiên - Quảng Ninh",
        "name_filter": "dao cai chien - quang ninh",
        "category": "Phường - Xã",
        "name_nospace": "daocaichien-quangninh"
    },
    {
        "id": "135952",
        "area_id": 135952,
        "name": "Bến Xe Miền Trung - Nghệ An",
        "name_filter": "ben xe mien trung - nghe an",
        "category": "Bến xe",
        "name_nospace": "benxemientrung-nghean"
    },
    {
        "id": "1404",
        "area_id": 1404,
        "name": "Bến xe Bắc Vinh - Nghệ An",
        "name_filter": "ben xe bac vinh - nghe an",
        "category": "Bến xe",
        "name_nospace": "benxebacvinh-nghean"
    },
    {
        "id": "155849",
        "area_id": 56,
        "name": "Pù Luông - Bá Thước - Thanh Hóa",
        "name_filter": "pu luong - ba thuoc - thanh hoa",
        "category": "Bến xe",
        "name_nospace": "puluong-bathuoc-thanhhoa"
    },
    {
        "id": "136789",
        "area_id": 136789,
        "name": "Nam Dong - Cư Jút",
        "name_filter": "nam dong - cu jut",
        "category": "Phường - Xã",
        "name_nospace": "namdong-cujut"
    },
    {
        "id": "136799",
        "area_id": 136799,
        "name": "Bến xe khách Thượng Lý - Hải Phòng",
        "name_filter": "ben xe khach thuong ly - hai phong",
        "category": "Bến xe",
        "name_nospace": "benxekhachthuongly-haiphong"
    },
    {
        "id": "136225",
        "area_id": 0,
        "name": "Tuần Châu - Hạ Long",
        "name_filter": "tuan chau - ha long",
        "category": "Phường - Xã",
        "name_nospace": "tuanchau-halong"
    },
    {
        "id": "136226",
        "area_id": 0,
        "name": "Bãi Cháy - Hạ Long",
        "name_filter": "bai chay - ha long",
        "category": "Phường - Xã",
        "name_nospace": "baichay-halong"
    },
    {
        "id": "136227",
        "area_id": 0,
        "name": "Hòn Gai - Hạ Long",
        "name_filter": "hon gai - ha long",
        "category": "Phường - Xã",
        "name_nospace": "hongai-halong"
    },
    {
        "id": "28438",
        "area_id": 0,
        "name": "Thị trấn Măng Đen",
        "name_filter": "thi tran mang den",
        "category": "Bến xe",
        "name_nospace": "thitranmangden"
    },
    {
        "id": "2731",
        "area_id": 0,
        "name": "Bến xe Phú Lâm",
        "name_filter": "ben xe phu lam",
        "category": "Bến xe",
        "name_nospace": "benxephulam"
    }
]

/*initiate the autocomplete function on the "inputFrom" element, and pass along the countries array as possible autocomplete values:*/
autocompleteFrom(document.getElementById('inputFrom'), data);
autocompleteTo(document.getElementById('inputTo'), data);