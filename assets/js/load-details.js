var selected_link_feature = undefined;



document.addEventListener('DOMContentLoaded', () => {

    const randomParam = new Date().getTime();

    jQuery.when(

        jQuery.ajax({

            url: ajaxData.ajax_url + '?rand=' + randomParam,

            type: 'POST',

            data: {

                action: 'load_additional_company_details',

                nonce: ajaxData.nonce,

                post_id: ajaxData.post_id,

            },

            beforeSend: function () {

                let skeleton = '<div class="tableWrapper">';



                Array.from({

                    length: 2

                }).map((_, i) => {

                    skeleton += `<table class="table">

                                        <thead>

                                        <tr>

                                            <th class="loading" colspan="3"><div class="bar" style="width: 100%; height: 28px"></div></th>

                                        </tr>

                                        </thead>

                                        <tbody>

                                        <tr>

                                            <td class="loading" style="padding: 20px;">

                                                <div class="bar" style="width: 100%; height: 20px"></div>

                                            </td>

                                            <td class="loading skeleton-phones" style="padding: 20px;">

                                                <div class="bar"></div>

                                                <div class="bar"></div>

                                                <div class="bar"></div>

                                            </td>

                                        </tr>

                                        <tr>

                                            <td class="loading" style="padding: 20px;">

                                                <div class="bar" style="width: 100%; height: 20px"></div>

                                            </td>

                                            <td class="loading skeleton-phones" style="padding: 20px;">

                                                <div class="bar"></div>

                                                <div class="bar"></div>

                                                <div class="bar"></div>

                                            </td>

                                        </tr>

                                        </tbody>

                                    </table>`

                })

                skeleton += '</div>'

                jQuery('#section-company_brand').html(skeleton);

            },

        }),

        jQuery.ajax({

            url: ajaxData.ajax_url + '?rand=' + randomParam,

            type: 'GET',

            data: {

                action: "price_table_list",

                nonce: ajaxData.nonce,

                post_id: ajaxData.post_id,

                page: 1

            },

        })



    ).then(function (companyResponse, priceTableResponse) {

        const routeRecommend = document.getElementById('content-route-future');

        const companyBrand = document.getElementById('section-company_brand');

        const listSchedule = document.getElementById('driving-schedule-content');

        const tableSchedule = document.getElementById('content-table-schedule');



        var totalPages = 1;



        var company_name = document.title;

        if (company_name.includes(' - ')) {

            company_name = company_name.split(' - ')[0];

        }





        if (companyResponse[0].success) {



            const { company_brand, driving_schedule, company_phone } = companyResponse[0].data;



            const arrPhone = company_phone ? company_phone.split("-") : [];



            // detailsContainer.html(`

            //     <p>Driving Schedule: ${data.data.driving_schedule}</p>

            //     <p>Company Brand: ${data.data.company_brand}</p>

            // `);

            // const routeRecommendArr = price_table_list.filter((rr) => rr.route_featured === true);



            if (company_brand) {

                company_brand.forEach((item, key) => {

                    const table = document.createElement('table');

                    table.className = 'table--phone';



                    const thead = document.createElement('thead');

                    const headerRow = document.createElement('tr');

                    const headerCell = document.createElement('th');

                    headerCell.className = 'route--title';

                    headerCell.colSpan = 3;

                    const headerTitle = document.createElement('h3');

                    headerTitle.textContent = item.company_brand_name;

                    headerCell.appendChild(headerTitle);

                    headerRow.appendChild(headerCell);

                    thead.appendChild(headerRow);

                    table.appendChild(thead);



                    const tbody = document.createElement('tbody');

                    if (item.company_brand_office) {

                        item.company_brand_office.forEach((office, i) => {

                            const row = document.createElement('tr');

                            const officeCell = document.createElement('td');

                            officeCell.className = 'route--title';



                            const officeName = document.createElement('section');

                            officeName.textContent = office.company_brand_office_name;

                            const officeAddress = document.createElement('section');

                            officeAddress.textContent = office.company_brand_office_address;

                            officeCell.appendChild(officeName);

                            officeCell.appendChild(officeAddress);

                            row.appendChild(officeCell);



                            const phoneCell = document.createElement('td');

                            phoneCell.className = 'route--phone';



                            if (office.company_brand_office_routes && office.company_brand_office_routes.length > 0) {

                                const popover = document.createElement('div');

                                popover.className = 'popover';

                                const button = document.createElement('button');

                                button.className = 'popover__trigger';

                                button.textContent = 'Chọn chuyến';

                                popover.appendChild(button);



                                const ul = document.createElement('ul');

                                ul.className = 'popover__menu';

                                office.company_brand_office_routes.forEach((route, num) => {

                                    const li = document.createElement('li');

                                    li.className = 'popover__menu-item';

                                    const routeButton = document.createElement('button');

                                    routeButton.className = 'booking-dailyve-route';

                                    routeButton.setAttribute('data-link', convertIdToSlug(route.routes_departure_point, route.routes_destination_point));

                                    routeButton.setAttribute('data-datepicker', `dailyve_calendar_route_${key}-${i}-${num}`);

                                    routeButton.textContent = `${route.routes_departure_point.label} đi ${route.routes_destination_point.label}`;



                                    const input = document.createElement('input');

                                    input.type = 'text';

                                    input.className = 'dailyve_calendar';

                                    input.name = `dailyve_calendar_route_${key}-${i}-${num}`;



                                    routeButton.appendChild(input);

                                    li.appendChild(routeButton);

                                    ul.appendChild(li);

                                });

                                popover.appendChild(ul);

                                phoneCell.appendChild(popover);

                            }



                            const section = document.createElement('section');

                            if (key === 0 && i === 0) {

                                const phoneLinks = [

                                    { number: '19000155', title: '1900 0155' },

                                    { number: '19000375', title: '1900 0375' }

                                ];



                                phoneLinks.forEach(link => {

                                    const a = document.createElement('a');

                                    a.href = `tel:${link.number}`;

                                    a.title = link.title;

                                    const icon = document.createElement('i');

                                    icon.className = 'fas fa-phone';

                                    const span = document.createElement('span');

                                    span.textContent = link.title;

                                    a.appendChild(icon);

                                    a.appendChild(span);

                                    section.appendChild(a);



                                });

                            }



                            if (Array.isArray(office.company_brand_office_phone_list)) {

                                office.company_brand_office_phone_list.forEach(phone => {

                                    const a = document.createElement('a');

                                    a.href = `tel:${phone.company_brand_office_phone}`;

                                    a.title = phone.company_brand_office_phone;

                                    const icon = document.createElement('i');

                                    icon.className = 'fas fa-phone';

                                    const span = document.createElement('span');

                                    span.textContent = phone.company_brand_office_phone;

                                    a.appendChild(icon);

                                    a.appendChild(span);

                                    section.appendChild(a);

                                });

                            }



                            phoneCell.appendChild(section);



                            row.appendChild(phoneCell);

                            tbody.appendChild(row);

                        });

                    }

                    table.appendChild(tbody);



                    companyBrand.appendChild(table);

                });

            }



            if (driving_schedule.length > 0) {

                const htmlContent = `

                    <h2 class="dailyve-title-company">Các tuyến đường mà ${company_name} này đang hoạt động</h2>

                    <div class="vivu-active-routes">

                      ${driving_schedule.map((schedule, index) => `

                        <div class="vivu-active-routes__title">

                          <h3 id="seo-trip-content-${index + 1}">🚌 ${index + 1}. ${ajaxData.company_name} ${schedule.route_name}</h3>

                        </div>

                        <div class="vivu-active-routes__content">

                          <h4>a. Giờ khởi hành của ${schedule.route_name}</h4>

                          <ul>

                            <li>Giờ xuất phát của ${company_name} ở ${schedule.schedule_departure_point.label}: ${schedule.driving_time}</li>

                            <li>Thời gian của ${company_name} <a href="${convertIdToSlug(schedule.schedule_departure_point, schedule.schedule_destination_point)}">đi ${schedule.schedule_destination_point.label} từ ${schedule.schedule_departure_point.label}</a> khoảng: ${schedule.time_go}</li>

                          </ul>

                          <h4>b. Các điểm đón khách của ${ajaxData.company_name} ở ${schedule.schedule_departure_point.label}</h4>

                          <ul>

                            ${schedule.schedule_pickup_point.split(", ").map(point => `<li>${point}</li>`).join("")}

                          </ul>

                          <h4>c. Các điểm trả khách của ${ajaxData.company_name} ở ${schedule.schedule_destination_point.label}</h4>

                          <ul>

                            ${schedule.schedule_dropoff_point.split(", ").map(point => `<li>${point}</li>`).join("")}

                          </ul>

                          <h4>d. Giá vé ${schedule.route_name} của nhà xe</h4>

                          <ul>

                            ${schedule.bus_type.map(type => {

                    let price = "";

                    if (type.value === "giuong_nam") price = schedule.price;

                    if (type.value === "limousine") price = schedule.price_limousine;

                    if (type.value === "giuong_nam_doi") price = schedule.price_giuong_nam_doi;

                    if (type.value === "ghe_ngoi") price = schedule.price_ghe_ngoi;

                    return `<li><a href="${convertIdToSlug(schedule.schedule_departure_point, schedule.schedule_destination_point)}">Xe ${type.label} đi ${schedule.schedule_departure_point.label} từ ${schedule.schedule_destination_point.label}</a> của ${company_name}: ${price}</li>`;

                }).join("")}

                          </ul>

                          <h4>e. Thông tin liên hệ, đặt mua vé ${schedule.route_name}</h4>

                          <ul>

                            <li>Địa chỉ văn phòng, trạm ${ajaxData.company_name} ${schedule.schedule_departure_point.label}: ${schedule.address}</li>

                            <li>

                              Số điện thoại ${company_name} ${schedule.schedule_departure_point.label}: 

                              <a href="tel:19000155" style="font-weight: bold;">1900 0155</a>

                                ${arrPhone.map((phone) => {

                    const cleanPhone = stringToPhone(phone);

                    return `<a href="tel:${cleanPhone}">- ${phone}</a>`;

                }).join("")}

                            </li>

                          </ul>

                        </div>

                      `).join("")}

                    </div>

                `;



                // listSchedule.innerHTML = htmlContent;





                //Bảng chi tiết giá vé

                const table = document.createElement("table");

                const tbody = document.createElement("tbody");



                // Header dòng 1

                const headerRow1 = document.createElement("tr");

                const headerCell = document.createElement("th");

                headerCell.colSpan = 4;

                headerCell.innerHTML = `<h2 class="dailyve-title-company">

                  Tổng hợp thông tin lịch chạy và giá vé nhà ${ajaxData.company_name}

                </h2>`;

                headerRow1.appendChild(headerCell);

                tbody.appendChild(headerRow1);



                // Header dòng 2

                const headerRow2 = document.createElement("tr");

                const headers = ["Tuyến đường", "Loại xe", "Giờ chạy", "Giá vé xe khoảng"];

                headers.forEach((text) => {

                    const th = document.createElement("td");

                    th.textContent = text;

                    headerRow2.appendChild(th);

                });

                tbody.appendChild(headerRow2);



                // Duyệt qua từng lịch trình

                driving_schedule.forEach((schedule) => {

                    const row = document.createElement("tr");



                    // Cột 1: Tuyến đường

                    const routeCell = document.createElement("td");

                    const routeLink = document.createElement("a");

                    routeLink.href = convertIdToSlug(schedule.schedule_departure_point, schedule.schedule_destination_point);

                    routeLink.textContent = `${ajaxData.company_name} tuyến ${schedule.schedule_departure_point.label} - ${schedule.schedule_destination_point.label}`;

                    routeCell.appendChild(routeLink);



                    // Cột 2: Loại xe

                    const busTypeCell = document.createElement("td");

                    const busLabels = schedule.bus_type.map((type) => type.label).join(", ");

                    busTypeCell.textContent = busLabels;



                    // Cột 3: Giờ chạy

                    const timeCell = document.createElement("td");

                    timeCell.textContent = schedule.time_go;



                    // Cột 4: Giá vé khoảng

                    const priceCell = document.createElement("td");

                    let price = "";

                    schedule.bus_type.forEach((type) => {

                        if (type.value === "giuong_nam") {

                            price += schedule.price + " ";

                        } else if (type.value === "limousine") {

                            price += schedule.price_limousine + " ";

                        } else if (type.value === "giuong_nam_doi") {

                            price += schedule.price_giuong_nam_doi + " ";

                        } else if (type.value === "ghe_ngoi") {

                            price += schedule.price_ghe_ngoi + " ";

                        }

                    });

                    priceCell.textContent = price.trim();



                    // Append các ô vào dòng

                    row.appendChild(routeCell);

                    row.appendChild(busTypeCell);

                    row.appendChild(timeCell);

                    row.appendChild(priceCell);



                    tbody.appendChild(row);

                });



                // Append tbody vào table và thêm vào DOM

                // table.appendChild(tbody);

                // tableSchedule.appendChild(table);

            }



            jQuery('.tableWrapper').remove();



        }



        if (priceTableResponse[0].success) {

            const price_table_list = priceTableResponse[0].data.data;

            if (price_table_list && price_table_list.some(item => item.route_featured === true)) {

                const container = document.createElement('div');

                container.className = 'route-recommend';

                container.id = 'route-recommend';



                container.innerHTML = `

                        <h2 class="dailyve-title-company">Chọn nhanh tuyến đường ${company_name}</h2>

                        <div class="box-route-recommendation">

                            <div class="collapse-container">

                                <div class="collapse-body-wrapper" style="${price_table_list.length > 4 ? 'height: 182px;' : ''}">

                                    <div class="collapse-body-content">

                                        ${price_table_list.map((item, key) => {

                    if (item.route_featured) {

                        return `

                                                    <div class="route-recommendation__item">

                                                        ${item.price ? `

                                                            <div class="next-ribbon"></div>

                                                            <div class="ribbon ribbon-top-left">

                                                                <span>

                                                                    <div class="price-text">Chỉ từ ${item.price} tại Dailyve</div>

                                                                </span>

                                                            </div>

                                                        ` : ''}

                                                        <div class="route-recommendationItem-text">

                                                            ${item.route_departure_point.label} đi ${item.route_destination_point.label}

                                                        </div>

                                                        ${item.active_link == 1 ? `

                                                            <button 

                                                                data-link="${convertIdToSlug(item.route_departure_point, item.route_destination_point)}" 

                                                                class="booking-dailyve-route" 

                                                                data-datepicker="dailyve_calendar_${key}"

                                                            >

                                                                <span>Chọn chuyến</span>

                                                            </button>

                                                            <input type="text" class="dailyve_calendar" name="dailyve_calendar_${key}" />

                                                        ` : ''}

                                                    </div>

                                                `;

                    }

                    return '';

                }).join('')}

                                    </div>

                                </div>

                                ${price_table_list.length > 4 ? `

                                    <div class="collapse__footer-container">

                                        <button class="btn-toggle-see">Xem thêm <i class="fas fa-angle-down"></i></button>

                                    </div>

                                ` : ''}

                            </div>

                        </div>

                    `;

                // routeRecommend.appendChild(container);

            }

            totalPages = priceTableResponse[0].data.total_pages



            if (price_table_list.length > 0) {

                jQuery('#paginate_company_price_list').twbsPagination({

                    totalPages: totalPages,

                    visiblePages: 6,

                    prev: false,

                    next: false,

                    startPage: 1,

                    onPageClick: function (event, page) {

                        jQuery.ajax({

                            url: ajaxData.ajax_url + '?rand=' + randomParam,

                            type: 'GET',

                            data: {

                                action: "price_table_list",

                                nonce: ajaxData.nonce,

                                post_id: ajaxData.post_id,

                                page: page

                            },

                            beforeSend: function () {

                                jQuery('#section-company_price_list')[0].scrollIntoView({

                                    behavior: 'smooth'

                                });

                                jQuery('#section-company_price_list').html('<div class="warrap-loader"><span class="loader"></span></div>');

                            },

                            success: function (response) {

                                if (response.success) {

                                    const sectionCompanyPriceList = document.getElementById('section-company_price_list');

                                    if (response.data.data && response.data.data.length > 0) {

                                        const price_table_list = response.data.data;

                                        const container = document.createElement('div');

                                        container.className = 'table-price-container';



                                        const tableContainer = document.createElement('div');

                                        tableContainer.className = 'vivu-tbl-2';



                                        const table = document.createElement('table');

                                        table.id = 'bang-tuyen-duong';



                                        const thead = document.createElement('thead');

                                        thead.innerHTML = `<tr colspan="3">

                                                                <th>Tuyến đường</th>

                                                                <th>Thông tin chuyến</th>

                                                                <th></th>

                                                            </tr>`;



                                        const tbody = document.createElement('tbody');



                                        price_table_list.forEach((item, key) => {

                                            const routeDeparture = item.route_departure_point.label;

                                            const routeDestination = item.route_destination_point.label;



                                            const tr = document.createElement('tr');



                                            // Cột Tuyến đường

                                            const tdRouteName = document.createElement('td');

                                            tdRouteName.className = 'route--name';

                                            tdRouteName.textContent = `${routeDeparture} đi ${routeDestination}`;

                                            tr.appendChild(tdRouteName);



                                            // Cột Thông tin chuyến

                                            const tdRouteInfo = document.createElement('td');

                                            tdRouteInfo.className = 'route--info';

                                            tdRouteInfo.innerHTML = `<div class="vivu-txt">${company_name} tuyến ${routeDeparture} đi ${routeDestination}</div>`;

                                            tr.appendChild(tdRouteInfo);



                                            // Cột nút bấm

                                            const tdRouteBtn = document.createElement('td');

                                            tdRouteBtn.className = 'route--btn';

                                            tdRouteBtn.innerHTML = `<div class="vivu-btn__wrap">

                                                                        <button 

                                                                            data-datepicker="dailyve_route_cl_${key}" 

                                                                            data-link="${convertIdToSlug(item.route_departure_point, item.route_destination_point)}" 

                                                                            class="booking-dailyve-route">

                                                                            Chọn ngày <i style="margin-left: 3px;" class="fas fa-calendar-alt"></i>

                                                                        </button>

                                                                        <input class="dailyve_calendar" type="text" name="dailyve_route_cl_${key}">

                                                                    </div>`;

                                            tr.appendChild(tdRouteBtn);



                                            tbody.appendChild(tr);

                                        });



                                        table.appendChild(thead);

                                        table.appendChild(tbody);

                                        tableContainer.appendChild(table);

                                        container.appendChild(tableContainer);



                                        sectionCompanyPriceList.innerHTML = '';

                                        sectionCompanyPriceList.appendChild(container);



                                        initializeDatePicker();

                                    }

                                }



                                jQuery('.warrap-loader').remove();



                            },

                            error: function (xhr, status, error) {

                                console.error('Error loading comments:', error);

                                jQuery('.warrap-loader').remove();

                            }

                        });



                    }

                });

            }

        }

        initializeDatePicker();

        initializePopovers();



        (function ($) {

            "use strict";



            var toc = function (options) {

                return this.each(function () {

                    var root = $(this),

                        data = root.data(),

                        thisOptions,

                        stack = [root],

                        listTag = this.tagName,

                        currentLevel = 0,

                        headingSelectors;



                    thisOptions = $.extend(

                        { content: "body", headings: "h1,h2,h3" },

                        { content: data.toc || undefined, headings: data.tocHeadings || undefined },

                        options

                    );

                    headingSelectors = thisOptions.headings.split(",");



                    $(thisOptions.content).find(thisOptions.headings).attr("id", function (index, attr) {

                        var generateUniqueId = function (text) {

                            if (text.length === 0) {

                                text = "?";

                            }



                            var baseId = text.replace(/\s+/g, "_"), suffix = "", count = 1;



                            while (document.getElementById(baseId + suffix) !== null) {

                                suffix = "_" + count++;

                            }



                            return baseId + suffix;

                        };



                        return attr || generateUniqueId($(this).text());

                    }).each(function () {

                        // What level is the current heading?

                        var elem = $(this), level = $.map(headingSelectors, function (selector, index) {

                            return elem.is(selector) ? index : undefined;

                        })[0];



                        if (level > currentLevel) {



                            var parentItem = stack[0].children("li:last")[0];

                            if (parentItem) {

                                stack.unshift($("<" + listTag + "/>").appendTo(parentItem));

                            }

                        } else {



                            stack.splice(0, Math.min(currentLevel - level, Math.max(stack.length - 1, 0)));

                        }



                        // Add the list item with class 'toc-item'

                        $("<li/>").addClass('toc-item').appendTo(stack[0]).append(

                            $("<a/>").text(elem.text()).attr("href", "#" + elem.attr("id"))

                        );



                        currentLevel = level;

                    });

                });

            }, old = $.fn.toc;



            $.fn.toc = toc;



            $.fn.toc.noConflict = function () {

                $.fn.toc = old;

                return this;

            };



            // Data API

            $(function () {

                toc.call($("[data-toc]"));

            });

        }(window.jQuery));

    })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.log('Error occurred: ' + textStatus, errorThrown);
            jQuery('.warrap-loader').remove();
            jQuery('.tableWrapper').remove();
        });

});



//POPOVER

function initializePopovers() {
    var popovers = document.querySelectorAll('.popover');
    var popoverTriggers = document.querySelectorAll('.popover__trigger');

    for (var i = 0; i < popoverTriggers.length; i++) {
        popoverTriggers[i].addEventListener('click', function (event) {
            closeAllOthers(this.parentElement);
            this.parentElement.classList.toggle('popover--active');
        });
    }

    function closeAllOthers(ignore) {
        for (var i = 0; i < popovers.length; i++) {
            if (popovers[i] !== ignore) {
                popovers[i].classList.remove('popover--active');
            }
        }
    }

}



function initializeDatePicker() {
    jQuery('.dailyve_calendar').datepicker({
        closeText: "Đóng",
        prevText: "Trước",
        nextText: "Sau",
        currentText: "Hôm nay",
        monthNames: ["Tháng một", "Tháng hai", "Tháng ba", "Tháng tư", "Tháng năm", "Tháng sáu", "Tháng bảy", "Tháng tám", "Tháng chín", "Tháng mười", "Tháng mười một", "Tháng mười hai"],
        monthNamesShort: ["Một", "Hai", "Ba", "Bốn", "Năm", "Sáu", "Bảy", "Tám", "Chín", "Mười", "Mười một", "Mười hai"],
        dayNames: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"],
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
            window.open(selected_link_feature + dateText);
        }
    });
}


function convertIdToSlug(from, to, company = '') {
    const nameFromSlug = toSlug(from.label);
    const nameToSlug = toSlug(to.label);

    if (company) {
        const company_name = company.label;
        const companyId = company.value;
        if (company_name) {
            const company_nameSlug = toSlug(company_name);
            return `${homeUrl()}/ve-xe-khach-${company_nameSlug}-tu-${nameFromSlug}-di-${nameToSlug}-${companyId}-${from.value}t${to.value}.html?date=`;
        } else {
            return `${homeUrl()}/ve-xe-khach-tu-${nameFromSlug}-di-${nameToSlug}-${from.value}t${to.value}.html?date=`;
        }
    } else {
        return `${homeUrl()}/ve-xe-khach-tu-${nameFromSlug}-di-${nameToSlug}-${from.value}t${to.value}.html?date=`;
    }
}





function toSlug(str) {

    str = str.toLowerCase();

    str = str

        .normalize('NFD')

        .replace(/[\u0300-\u036f]/g, '');

    str = str.replace(/[đĐ]/g, 'd');

    str = str.replace(/([^0-9a-z-\s])/g, '');

    str = str.replace(/(\s+)/g, '-');

    str = str.replace(/-+/g, '-');

    str = str.replace(/^-+|-+$/g, '');

    return str;

}



function homeUrl() {

    return window.location.origin;

}



function stringToPhone(phone) {

    return phone.replace(/\s/g, "").replace(/-/g, "").replace(/\./g, "");

}

