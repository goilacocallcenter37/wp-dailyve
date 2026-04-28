var TK19 = new Array(
	0x30baa3, 0x56ab50, 0x422ba0, 0x2cab61, 0x52a370, 0x3c51e8, 0x60d160, 0x4ae4b0, 0x376926, 0x58daa0,
	0x445b50, 0x3116d2, 0x562ae0, 0x3ea2e0, 0x28e2d2, 0x4ec950, 0x38d556, 0x5cb520, 0x46b690, 0x325da4,
	0x5855d0, 0x4225d0, 0x2ca5b3, 0x52a2b0, 0x3da8b7, 0x60a950, 0x4ab4a0, 0x35b2a5, 0x5aad50, 0x4455b0,
	0x302b74, 0x562570, 0x4052f9, 0x6452b0, 0x4e6950, 0x386d56, 0x5e5aa0, 0x46ab50, 0x3256d4, 0x584ae0,
	0x42a570, 0x2d4553, 0x50d2a0, 0x3be8a7, 0x60d550, 0x4a5aa0, 0x34ada5, 0x5a95d0, 0x464ae0, 0x2eaab4,
	0x54a4d0, 0x3ed2b8, 0x64b290, 0x4cb550, 0x385757, 0x5e2da0, 0x4895d0, 0x324d75, 0x5849b0, 0x42a4b0,
	0x2da4b3, 0x506a90, 0x3aad98, 0x606b50, 0x4c2b60, 0x359365, 0x5a9370, 0x464970, 0x306964, 0x52e4a0,
	0x3cea6a, 0x62da90, 0x4e5ad0, 0x392ad6, 0x5e2ae0, 0x4892e0, 0x32cad5, 0x56c950, 0x40d4a0, 0x2bd4a3,
	0x50b690, 0x3a57a7, 0x6055b0, 0x4c25d0, 0x3695b5, 0x5a92b0, 0x44a950, 0x2ed954, 0x54b4a0, 0x3cb550,
	0x286b52, 0x4e55b0, 0x3a2776, 0x5e2570, 0x4852b0, 0x32aaa5, 0x56e950, 0x406aa0, 0x2abaa3, 0x50ab50
); /* Years 2000-2099 */

var TK20 = new Array(
	0x3c4bd8, 0x624ae0, 0x4ca570, 0x3854d5, 0x5cd260, 0x44d950, 0x315554, 0x5656a0, 0x409ad0, 0x2a55d2,
	0x504ae0, 0x3aa5b6, 0x60a4d0, 0x48d250, 0x33d255, 0x58b540, 0x42d6a0, 0x2cada2, 0x5295b0, 0x3f4977,
	0x644970, 0x4ca4b0, 0x36b4b5, 0x5c6a50, 0x466d50, 0x312b54, 0x562b60, 0x409570, 0x2c52f2, 0x504970,
	0x3a6566, 0x5ed4a0, 0x48ea50, 0x336a95, 0x585ad0, 0x442b60, 0x2f86e3, 0x5292e0, 0x3dc8d7, 0x62c950,
	0x4cd4a0, 0x35d8a6, 0x5ab550, 0x4656a0, 0x31a5b4, 0x5625d0, 0x4092d0, 0x2ad2b2, 0x50a950, 0x38b557,
	0x5e6ca0, 0x48b550, 0x355355, 0x584da0, 0x42a5b0, 0x2f4573, 0x5452b0, 0x3ca9a8, 0x60e950, 0x4c6aa0,
	0x36aea6, 0x5aab50, 0x464b60, 0x30aae4, 0x56a570, 0x405260, 0x28f263, 0x4ed940, 0x38db47, 0x5cd6a0,
	0x4896d0, 0x344dd5, 0x5a4ad0, 0x42a4d0, 0x2cd4b4, 0x52b250, 0x3cd558, 0x60b540, 0x4ab5a0, 0x3755a6,
	0x5c95b0, 0x4649b0, 0x30a974, 0x56a4b0, 0x40aa50, 0x29aa52, 0x4e6d20, 0x39ad47, 0x5eab60, 0x489370,
	0x344af5, 0x5a4970, 0x4464b0, 0x2c74a3, 0x50ea50, 0x3d6a58, 0x6256a0, 0x4aaad0, 0x3696d5, 0x5c92e0
); /* Years 1900-1999 */

var TK21 = new Array(
	0x46c960, 0x2ed954, 0x54d4a0, 0x3eda50, 0x2a7552, 0x4e56a0, 0x38a7a7, 0x5ea5d0, 0x4a92b0, 0x32aab5,
	0x58a950, 0x42b4a0, 0x2cbaa4, 0x50ad50, 0x3c55d9, 0x624ba0, 0x4ca5b0, 0x375176, 0x5c5270, 0x466930,
	0x307934, 0x546aa0, 0x3ead50, 0x2a5b52, 0x504b60, 0x38a6e6, 0x5ea4e0, 0x48d260, 0x32ea65, 0x56d520,
	0x40daa0, 0x2d56a3, 0x5256d0, 0x3c4afb, 0x6249d0, 0x4ca4d0, 0x37d0b6, 0x5ab250, 0x44b520, 0x2edd25,
	0x54b5a0, 0x3e55d0, 0x2a55b2, 0x5049b0, 0x3aa577, 0x5ea4b0, 0x48aa50, 0x33b255, 0x586d20, 0x40ad60,
	0x2d4b63, 0x525370, 0x3e49e8, 0x60c970, 0x4c54b0, 0x3768a6, 0x5ada50, 0x445aa0, 0x2fa6a4, 0x54aad0,
	0x4052e0, 0x28d2e3, 0x4ec950, 0x38d557, 0x5ed4a0, 0x46d950, 0x325d55, 0x5856a0, 0x42a6d0, 0x2c55d4,
	0x5252b0, 0x3ca9b8, 0x62a930, 0x4ab490, 0x34b6a6, 0x5aad50, 0x4655a0, 0x2eab64, 0x54a570, 0x4052b0,
	0x2ab173, 0x4e6930, 0x386b37, 0x5e6aa0, 0x48ad50, 0x332ad5, 0x582b60, 0x42a570, 0x2e52e4, 0x50d160,
	0x3ae958, 0x60d520, 0x4ada90, 0x355aa6, 0x5a56d0, 0x462ae0, 0x30a9d4, 0x54a2d0, 0x3ed150, 0x28e952
); /* Years 2000-2099 */

var TK22 = new Array(
		0x4eb520, 0x38d727, 0x5eada0, 0x4a55b0, 0x362db5, 0x5a45b0, 0x44a2b0, 0x2eb2b4, 0x54a950, 0x3cb559,
		0x626b20, 0x4cad50, 0x385766, 0x5c5370, 0x484570, 0x326574, 0x5852b0, 0x406950, 0x2a7953, 0x505aa0,
		0x3baaa7, 0x5ea6d0, 0x4a4ae0, 0x35a2e5, 0x5aa550, 0x42d2a0, 0x2de2a4, 0x52d550, 0x3e5abb, 0x6256a0,
		0x4c96d0, 0x3949b6, 0x5e4ab0, 0x46a8d0, 0x30d4b5, 0x56b290, 0x40b550, 0x2a6d52, 0x504da0, 0x3b9567,
		0x609570, 0x4a49b0, 0x34a975, 0x5a64b0, 0x446a90, 0x2cba94, 0x526b50, 0x3e2b60, 0x28ab61, 0x4c9570,
		0x384ae6, 0x5cd160, 0x46e4a0, 0x2eed25, 0x54da90, 0x405b50, 0x2c36d3, 0x502ae0, 0x3a93d7, 0x6092d0,
		0x4ac950, 0x32d556, 0x58b4a0, 0x42b690, 0x2e5d94, 0x5255b0, 0x3e25fa, 0x6425b0, 0x4e92b0, 0x36aab6,
		0x5c6950, 0x4674a0, 0x31b2a5, 0x54ad50, 0x4055a0, 0x2aab73, 0x522570, 0x3a5377, 0x6052b0, 0x4a6950,
		0x346d56, 0x585aa0, 0x42ab50, 0x2e56d4, 0x544ae0, 0x3ca570, 0x2864d2, 0x4cd260, 0x36eaa6, 0x5ad550,
		0x465aa0, 0x30ada5, 0x5695d0, 0x404ad0, 0x2aa9b3, 0x50a4d0, 0x3ad2b7, 0x5eb250, 0x48b540, 0x33d556
); /* Years 2100-2199 */


function LunarDate(dd, mm, yy, leap, jd) {
    this.day = dd;
    this.month = mm;
    this.year = yy;
    this.leap = leap;
    this.jd = jd;
}

var PI = Math.PI;

function INT(d) {
    return Math.floor(d);
}

function jdn(dd, mm, yy) {
    var a = INT((14 - mm) / 12);
    var y = yy + 4800 - a;
    var m = mm + 12 * a - 3;
    var jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
    return jd;
}

function jdn2date(jd) {
    var Z, A, alpha, B, C, D, E, dd, mm, yyyy, F;
    Z = jd;
    if (Z < 2299161) {
        A = Z;
    } else {
        alpha = INT((Z - 1867216.25) / 36524.25);
        A = Z + 1 + alpha - INT(alpha / 4);
    }
    B = A + 1524;
    C = INT((B - 122.1) / 365.25);
    D = INT(365.25 * C);
    E = INT((B - D) / 30.6001);
    dd = INT(B - D - INT(30.6001 * E));
    if (E < 14) {
        mm = E - 1;
    } else {
        mm = E - 13;
    }
    if (mm < 3) {
        yyyy = C - 4715;
    } else {
        yyyy = C - 4716;
    }
    return new Array(dd, mm, yyyy);
}

function decodeLunarYear(yy, k) {
    var monthLengths, regularMonths, offsetOfTet, leapMonth, leapMonthLength, solarNY, currentJD, j, mm;
    var ly = new Array();
    monthLengths = new Array(29, 30);
    regularMonths = new Array(12);
    offsetOfTet = k >> 17;
    leapMonth = k & 0xf;
    leapMonthLength = monthLengths[k >> 16 & 0x1];
    solarNY = jdn(1, 1, yy);
    currentJD = solarNY + offsetOfTet;
    j = k >> 4;
    for (i = 0; i < 12; i++) {
        regularMonths[12 - i - 1] = monthLengths[j & 0x1];
        j >>= 1;
    }
    if (leapMonth == 0) {
        for (mm = 1; mm <= 12; mm++) {
            ly.push(new LunarDate(1, mm, yy, 0, currentJD));
            currentJD += regularMonths[mm - 1];
        }
    } else {
        for (mm = 1; mm <= leapMonth; mm++) {
            ly.push(new LunarDate(1, mm, yy, 0, currentJD));
            currentJD += regularMonths[mm - 1];
        }
        ly.push(new LunarDate(1, leapMonth, yy, 1, currentJD));
        currentJD += leapMonthLength;
        for (mm = leapMonth + 1; mm <= 12; mm++) {
            ly.push(new LunarDate(1, mm, yy, 0, currentJD));
            currentJD += regularMonths[mm - 1];
        }
    }
    return ly;
}

function getYearInfo(yyyy) {
    var yearCode;
    if (yyyy < 1900) {
        yearCode = TK19[yyyy - 1800];
    } else if (yyyy < 2000) {
        yearCode = TK20[yyyy - 1900];
    } else if (yyyy < 2100) {
        yearCode = TK21[yyyy - 2000];
    } else {
        yearCode = TK22[yyyy - 2100];
    }
    return decodeLunarYear(yyyy, yearCode);
}

var FIRST_DAY = jdn(25, 1, 1800); // Tet am lich 1800
var LAST_DAY = jdn(31, 12, 2199);

function findLunarDate(jd, ly) {
    if (jd > LAST_DAY || jd < FIRST_DAY || ly[0].jd > jd) {
        return new LunarDate(0, 0, 0, 0, jd);
    }
    var i = ly.length - 1;
    while (jd < ly[i].jd) {
        i--;
    }
    var off = jd - ly[i].jd;
    ret = new LunarDate(ly[i].day + off, ly[i].month, ly[i].year, ly[i].leap, jd);
    return ret;
}

function getLunarDate(dd, mm, yyyy) {
    var ly, jd;
    if (yyyy < 1800 || 2199 < yyyy) {
        //return new LunarDate(0, 0, 0, 0, 0);
    }
    ly = getYearInfo(yyyy);
    jd = jdn(dd, mm, yyyy);
    if (jd < ly[0].jd) {
        ly = getYearInfo(yyyy - 1);
    }
    return findLunarDate(jd, ly);
}


function SunLongitude(jdn) {
    var T, T2, dr, M, L0, DL, L;
    T = (jdn - 2451545.0) / 36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
    T2 = T * T;
    dr = PI / 180; // degree to radian
    M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2; // mean anomaly, degree
    L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2; // mean longitude, degree
    DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
    L = L0 + DL; // true longitude, degree
    L = L * dr;
    L = L - PI * 2 * (INT(L / (PI * 2))); // Normalize to (0, 2*PI)
    return L;
}

function getSunLongitude(dayNumber, timeZone) {
    return INT(SunLongitude(dayNumber - 0.5 - timeZone / 24.0) / PI * 12);
}

var today = new Date();
//var currentLunarYear = getYearInfo(today.getFullYear());
var currentLunarDate = getLunarDate(today.getDate(), today.getMonth() + 1, today.getFullYear());
var currentMonth = today.getMonth() + 1;
var currentYear = today.getFullYear();

function parseQuery(q) {
    var ret = new Array();
    if (q.length < 2) return ret;
    var s = q.substring(1, q.length);
    var arr = s.split("&");
    var i, j;
    for (i = 0; i < arr.length; i++) {
        var a = arr[i].split("=");
        for (j = 0; j < a.length; j++) {
            ret.push(a[j]);
        }
    }
    return ret;
}

function getSelectedMonth() {
    var query = window.location.search;
    var arr = parseQuery(query);
    var idx;
    for (idx = 0; idx < arr.length; idx++) {
        if (arr[idx] == "mm") {
            currentMonth = parseInt(arr[idx + 1]);
        } else if (arr[idx] == "yy") {
            currentYear = parseInt(arr[idx + 1]);
        }
    }
}

function getMonth(mm, yy) {
    var ly1, ly2, tet1, jd1, jd2, mm1, yy1, result, i;
    if (mm < 12) {
        mm1 = mm + 1;
        yy1 = yy;
    } else {
        mm1 = 1;
        yy1 = yy + 1;
    }
    jd1 = jdn(1, mm, yy);
    jd2 = jdn(1, mm1, yy1);
    ly1 = getYearInfo(yy);
    //alert('1/'+mm+'/'+yy+' = '+jd1+'; 1/'+mm1+'/'+yy1+' = '+jd2);
    tet1 = ly1[0].jd;
    result = new Array();
    if (tet1 <= jd1) { /* tet(yy) = tet1 < jd1 < jd2 <= 1.1.(yy+1) < tet(yy+1) */
        for (i = jd1; i < jd2; i++) {
            result.push(findLunarDate(i, ly1));
        }
    } else if (jd1 < tet1 && jd2 < tet1) { /* tet(yy-1) < jd1 < jd2 < tet1 = tet(yy) */
        ly1 = getYearInfo(yy - 1);
        for (i = jd1; i < jd2; i++) {
            result.push(findLunarDate(i, ly1));
        }
    } else if (jd1 < tet1 && tet1 <= jd2) { /* tet(yy-1) < jd1 < tet1 <= jd2 < tet(yy+1) */
        ly2 = getYearInfo(yy - 1);
        for (i = jd1; i < tet1; i++) {
            result.push(findLunarDate(i, ly2));
        }
        for (i = tet1; i < jd2; i++) {
            result.push(findLunarDate(i, ly1));
        }
    }
    return result;
}

// Tigra Calendar
// License: Public Domain... You're welcome.
// default settings - this structure can be moved in separate file in multilangual applications
var A_TCALCONF = {
	'cssprefix'  : 'tcal',
	'months': ['Th&aacute;ng 1', 'Th&aacute;ng 2', 'Th&aacute;ng 3', 'Th&aacute;ng 4', 'Th&aacute;ng 5', 'Th&aacute;ng 6', 'Th&aacute;ng 7', 'Th&aacute;ng 8', 'Th&aacute;ng 9', 'Th&aacute;ng 10', 'Th&aacute;ng 11', 'Th&aacute;ng 12'],
	'weekdays'   : ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
	'longwdays'  : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	'yearscroll' : true, // show year scroller
	'weekstart'  : 0, // first day of week: 0-Su or 1-Mo
	'prevyear'   : 'N&#259;m tr&#432;&#7899;c',
	'nextyear'   : 'N&#259;m sau', 
	'prevmonth'  : 'Th&#225;ng tr&#432;&#7899;c',
	'nextmonth'  : 'Th&#225;ng sau',
	'format'     : 'd-m-Y' // 'd-m-Y', Y-m-d', 'l, F jS Y'
};

var A_TCALTOKENS = [
	 // A full numeric representation of a year, 4 digits
	{'t': 'Y', 'r': '19\\d{2}|20\\d{2}', 'p': function (d_date, n_value) { d_date.setFullYear(Number(n_value)); return d_date; }, 'g': function (d_date) { var n_year = d_date.getFullYear(); return n_year; }},
	 // Numeric representation of a month, with leading zeros
	{'t': 'm', 'r': '0?[1-9]|1[0-2]', 'p': function (d_date, n_value) { d_date.setMonth(Number(n_value) - 1); return d_date; }, 'g': function (d_date) { var n_month = d_date.getMonth() + 1; return (n_month < 10 ? '0' : '') + n_month }},
	 // A full textual representation of a month, such as January or March
	{'t': 'F', 'r': A_TCALCONF.months.join('|'), 'p': function (d_date, s_value) { for (var m = 0; m < 12; m++) if (A_TCALCONF.months[m] == s_value) { d_date.setMonth(m); return d_date; }}, 'g': function (d_date) { return A_TCALCONF.months[d_date.getMonth()]; }},
	 // Day of the month, 2 digits with leading zeros
	{'t': 'd', 'r': '0?[1-9]|[12][0-9]|3[01]', 'p': function (d_date, n_value) { d_date.setDate(Number(n_value)); if (d_date.getDate() != n_value) d_date.setDate(0); return d_date }, 'g': function (d_date) { var n_date = d_date.getDate(); return (n_date < 10 ? '0' : '') + n_date; }},
	// Day of the month without leading zeros
	{'t': 'j', 'r': '0?[1-9]|[12][0-9]|3[01]', 'p': function (d_date, n_value) { d_date.setDate(Number(n_value)); if (d_date.getDate() != n_value) d_date.setDate(0); return d_date }, 'g': function (d_date) { var n_date = d_date.getDate(); return n_date; }},
	 // A full textual representation of the day of the week
	{'t': 'l', 'r': A_TCALCONF.longwdays.join('|'), 'p': function (d_date, s_value) { return d_date }, 'g': function (d_date) { return A_TCALCONF.longwdays[d_date.getDay()]; }},
	// English ordinal suffix for the day of the month, 2 characters
	{'t': 'S', 'r': 'st|nd|rd|th', 'p': function (d_date, s_value) { return d_date }, 'g': function (d_date) { n_date = d_date.getDate(); if (n_date % 10 == 1 && n_date != 11) return 'st'; if (n_date % 10 == 2 && n_date != 12) return 'nd'; if (n_date % 10 == 3 && n_date != 13) return 'rd'; return 'th'; }}
	
];
function cboYear(d_date) {
    var cur = new Date();
    var cbo = '<select onchange="f_tcalUpdate(new Date(this.value,' +( d_date.getMonth() )+ ',1).valueOf(),1)">';
    for (var i = cur.getFullYear() - 50; i < cur.getFullYear() + 50; i++) {
        cbo += '<option value=\'' + i + '\'';
        if (i == d_date.getFullYear()) cbo += ' selected ';
        cbo += '>' + i + '</option>';
    }
    cbo += '</select>';
    return cbo;
}
function cboMonth(d_date) {
    var cur = new Date();
    var cbo = '<select onchange="f_tcalUpdate(new Date(' + (d_date.getFullYear()) + ',this.value,1).valueOf(),1)">';
    for (var i =0; i < 12; i++) {
        cbo += '<option value=\'' + i + '\'';
        if (i == d_date.getMonth()) cbo += ' selected ';
        cbo += '>Th&#225;ng ' + (i + 1) + '</option>';
    }
    cbo += '</select>';
    return cbo;
}
function f_tcalGetHTML (d_date) {

	var e_input = f_tcalGetInputs(true);
	if (!e_input) return;

	var s_pfx = A_TCALCONF.cssprefix,
		s_format = A_TCALCONF.format;

	// today from config or client date
	var d_today = f_tcalParseDate(A_TCALCONF.today, A_TCALCONF.format);
	if (!d_today)
		d_today = f_tcalResetTime(new Date());

	// selected date from input or config or today 
	var d_selected = f_tcalParseDate(e_input.value, s_format);
	if (!d_selected)
		d_selected = f_tcalParseDate(A_TCALCONF.selected, A_TCALCONF.format);
	if (!d_selected)
		d_selected = new Date(d_today);
	
	// show calendar for passed or selected date
	d_date = d_date ? f_tcalResetTime(d_date) : new Date(d_selected);

	var d_firstDay = new Date(d_date);
	d_firstDay.setDate(1);
	d_firstDay.setDate(1 - (7 + d_firstDay.getDay() - A_TCALCONF.weekstart) % 7);

	var a_class, s_html = '<table id="' + s_pfx + 'Controls"><tbody><tr>'
		+ (A_TCALCONF.yearscroll ? '<td id="' + s_pfx + 'PrevYear" ' + f_tcalRelDate(d_date, -1, 'y') + ' title="' + A_TCALCONF.prevyear + '"></td>' : '')
		+ '<td id="' + s_pfx + 'PrevMonth"' + f_tcalRelDate(d_date, -1) + ' title="' + A_TCALCONF.prevmonth + '"></td><th>'
	//+ A_TCALCONF.months[d_date.getMonth()] + ' '  + cboYear(d_date)
        + cboMonth(d_date) + ' ' + cboYear(d_date)
		+ '</th><td id="' + s_pfx + 'NextMonth"' + f_tcalRelDate(d_date, 1) + ' title="' + A_TCALCONF.nextmonth + '"></td>'
		+ (A_TCALCONF.yearscroll ? '<td id="' + s_pfx + 'NextYear"' + f_tcalRelDate(d_date, 1, 'y') + ' title="' + A_TCALCONF.nextyear + '"></td>' : '')
		+ '</tr></tbody></table><table id="' + s_pfx + 'Grid"><tbody><tr>';

	// print weekdays titles
	for (var i = 0; i < 7; i++)
		s_html += '<th>' + A_TCALCONF.weekdays[(A_TCALCONF.weekstart + i) % 7] + '</th>';
	s_html += '</tr>' ;

	var n_date, n_month, d_current = new Date(d_firstDay);
	while (d_current.getMonth() == d_date.getMonth() ||
		d_current.getMonth() == d_firstDay.getMonth()) {

		s_html +='<tr>';
		for (var n_wday = 0; n_wday < 7; n_wday++) {

			a_class = [];
			n_date  = d_current.getDate();
			n_month = d_current.getMonth();
			display = f_tcalRelDate(d_current);
			lunar_date = getLunarDate(n_date, n_month+1, d_current.getFullYear());
			if (d_current.getMonth() < d_date.getMonth() || d_current.valueOf() < d_today.valueOf())
				a_class[a_class.length] ='disabled '+ s_pfx + 'OtherMonth';
			if (d_current.getDay() == 0 || d_current.getDay() == 6)
				a_class[a_class.length] = s_pfx + 'Weekend';
			if (d_current.valueOf() == d_today.valueOf())
				a_class[a_class.length] = s_pfx + 'Today';
			if (d_current.valueOf() == d_selected.valueOf())
				a_class[a_class.length] = s_pfx + 'Selected';

			s_html += '<td' + f_tcalRelDate(d_current) + (a_class.length ? ' class="' + a_class.join(' ') + '">' : '>') + n_date + '<sub>' + (lunar_date.day == 1 ? lunar_date.day + "/" + lunar_date.month : lunar_date.day) + '</sub></td>';
			d_current.setDate(++n_date);
		}
		s_html +='</tr>';
	}
s_html += '</tbody></table><div class="tcal_Today" onclick="(f_tcalUpdate(' + d_today.valueOf() + ',0))">H&#244;m nay: ' + d_today.getDate() + '/' +( d_today.getMonth() +1)+ '/' + d_today.getFullYear() + '</div>';

	return s_html;
}

function f_tcalRelDate (d_date, d_diff, s_units) {

	var s_units = (s_units == 'y' ? 'FullYear' : 'Month');
	var d_result = new Date(d_date);
	if (d_diff) {
		d_result['set' + s_units](d_date['get' + s_units]() + d_diff);
		if (d_result.getDate() != d_date.getDate())
			d_result.setDate(0);
	}
	return ' onclick="f_tcalUpdate(' + d_result.valueOf() + (d_diff ? ',1' : '') + ')"';

	
}

function f_tcalResetTime (d_date) {
	d_date.setMilliseconds(0);
	d_date.setSeconds(0);
	d_date.setMinutes(0);
	d_date.setHours(12);
	return d_date;
}

// closes calendar and returns all inputs to default state
function f_tcalCancel () {
	
	var s_pfx = A_TCALCONF.cssprefix;
	var e_cal = document.getElementById(s_pfx);
	if (e_cal)
		e_cal.style.visibility = '';
// 	$("#tcal").addClass("none");
	var melement = document.getElementById("tcal");
	if (melement) {
		melement.classList.add('none');
	}
	
	var a_inputs = f_tcalGetInputs();
	for (var n = 0; n < a_inputs.length; n++)
		f_tcalRemoveClass(a_inputs[n], s_pfx + 'Active');
}

function f_tcalUpdate (n_date, b_keepOpen) {

	var e_input = f_tcalGetInputs(true);
	if (!e_input) return;
	
	d_date = new Date(n_date);
	var s_pfx = A_TCALCONF.cssprefix;

	if (b_keepOpen) {
		var e_cal = document.getElementById(s_pfx);
		if (!e_cal || e_cal.style.visibility != 'visible') return;
		e_cal.innerHTML = f_tcalGetHTML(d_date, e_input);
	}
	else {
		e_input.value = f_tcalGenerateDate(d_date, A_TCALCONF.format);
		f_tcalCancel();
	}
}

function f_tcalOnClick () {

	// see if already opened
	var s_pfx = A_TCALCONF.cssprefix;
	var s_activeClass = s_pfx + 'Active';
	var b_close = f_tcalHasClass(this, s_activeClass);

	// close all clalendars
	f_tcalCancel();
	if (b_close) return;

	// get position of input
	f_tcalAddClass(this, s_activeClass);
	
	var n_left = f_getPosition (this, 'Left'),
		n_top  = f_getPosition (this, 'Top') + this.offsetHeight;

	var e_cal = document.getElementById(s_pfx);
	if (!e_cal) {
		e_cal = document.createElement('div');
		e_cal.onselectstart = function () { return false };
		e_cal.id = s_pfx;
		document.getElementsByTagName("body").item(0).appendChild(e_cal);
	}
	e_cal.innerHTML = f_tcalGetHTML(null);
// 	$("#tcal").removeClass("none");
	var melement = document.getElementById("tcal");
	if (melement) {
		melement.classList.remove('none');
	}
	e_cal.style.top = n_top + 'px';
	e_cal.style.left = ((n_left + this.offsetWidth - e_cal.offsetWidth) < 0 ? 0 : (n_left + this.offsetWidth - e_cal.offsetWidth) )+ 'px';
	e_cal.style.visibility = 'visible';
	
}

function f_tcalParseDate (s_date, s_format) {

	if (!s_date) return;

	var s_char, s_regexp = '^', a_tokens = {}, a_options, n_token = 0;
	for (var n = 0; n < s_format.length; n++) {
		s_char = s_format.charAt(n);
		if (A_TCALTOKENS_IDX[s_char]) {
			a_tokens[s_char] = ++n_token;
			s_regexp += '(' + A_TCALTOKENS_IDX[s_char]['r'] + ')';
		}
		else if (s_char == ' ')
			s_regexp += '\\s';
		else
			s_regexp += (s_char.match(/[\w\d]/) ? '' : '\\') + s_char;
	}
	var r_date = new RegExp(s_regexp + '$');
	if (!s_date.match(r_date)) return;
	
	var s_val, d_date = f_tcalResetTime(new Date());
	d_date.setDate(1);

	for (n = 0; n < A_TCALTOKENS.length; n++) {
		s_char = A_TCALTOKENS[n]['t'];
		if (!a_tokens[s_char])
			continue;
		s_val = RegExp['$' + a_tokens[s_char]];
		d_date = A_TCALTOKENS[n]['p'](d_date, s_val);
	}
	
	return d_date;
}

function f_tcalGenerateDate (d_date, s_format) {
	
	var s_char, s_date = '';
	for (var n = 0; n < s_format.length; n++) {
		s_char = s_format.charAt(n);
		s_date += A_TCALTOKENS_IDX[s_char] ? A_TCALTOKENS_IDX[s_char]['g'](d_date) : s_char;
	}
	return s_date;
}

function f_tcalGetInputs (b_active) {

	var a_inputs = document.getElementsByTagName('input'),
		e_input, s_rel, a_result = [];

	for (n = 0; n < a_inputs.length; n++) {

		e_input = a_inputs[n];
		if (!e_input.type || e_input.type != 'text')
			continue;

		if (!f_tcalHasClass(e_input, 'tcal'))
			continue;

		if (b_active && f_tcalHasClass(e_input, A_TCALCONF.cssprefix + 'Active'))
			return e_input;

		a_result[a_result.length] = e_input;
	}
	return b_active ? null : a_result;
}

function f_tcalHasClass (e_elem, s_class) {
	var s_classes = e_elem.className;
	if (!s_classes)
		return false;
	var a_classes = s_classes.split(' ');
	for (var n = 0; n < a_classes.length; n++)
		if (a_classes[n] == s_class)
			return true;
	return false;
}

function f_tcalAddClass (e_elem, s_class) {
	if (f_tcalHasClass (e_elem, s_class))
		return;

	var s_classes = e_elem.className;
	e_elem.className = (s_classes ? s_classes + ' ' : '') + s_class;
}

function f_tcalRemoveClass (e_elem, s_class) {
	var s_classes = e_elem.className;
	if (!s_classes || s_classes.indexOf(s_class) == -1)
		return false;

	var a_classes = s_classes.split(' '),
		a_newClasses = [];

	for (var n = 0; n < a_classes.length; n++) {
		if (a_classes[n] == s_class)
			continue;
		a_newClasses[a_newClasses.length] = a_classes[n];
	}
	e_elem.className = a_newClasses.join(' ');
	return true;
}

function f_getPosition (e_elemRef, s_coord) {
	var n_pos = 0, n_offset,
		e_elem = e_elemRef;

	while (e_elem) {
		n_offset = e_elem["offset" + s_coord];
		n_pos += n_offset;
		e_elem = e_elem.offsetParent;
	}

	e_elem = e_elemRef;
	while (e_elem != document.body) {
		n_offset = e_elem["scroll" + s_coord];
		if (n_offset && e_elem.style.overflow == 'scroll')
			n_pos -= n_offset;
		e_elem = e_elem.parentNode;
	}
	return n_pos;
}

function f_tcalInit () {
	
	if (!document.getElementsByTagName)
		return;

	var e_input, a_inputs = f_tcalGetInputs();
	for (var n = 0; n < a_inputs.length; n++) {
		e_input = a_inputs[n];
		e_input.onclick = f_tcalOnClick;
		f_tcalAddClass(e_input, A_TCALCONF.cssprefix + 'Input');
	}
	
	window.A_TCALTOKENS_IDX = {};
	for (n = 0; n < A_TCALTOKENS.length; n++)
		A_TCALTOKENS_IDX[A_TCALTOKENS[n]['t']] = A_TCALTOKENS[n];
}

function f_tcalAddOnload (f_func) {
	if (document.addEventListener) {
		window.addEventListener('load', f_func, false);
	}
	else if (window.attachEvent) {
		window.attachEvent('onload', f_func);
	}
	else {
		var f_onLoad = window.onload;
		if (typeof window.onload != 'function') {
			window.onload = f_func;
		}
		else {
			window.onload = function() {
				f_onLoad();
				f_func();
			}
		}
	}
}

f_tcalAddOnload (f_tcalInit);
