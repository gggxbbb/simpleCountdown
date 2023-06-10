// 特殊年份
const special_years = {
    2020: [2020, 7, 7, "七月七日"],
};

const min_year = 2014;
let timer = setInterval(null, 1000);

class DisplayType {
    static NORMAL = 0;
    static MS_ONLY = 1;
}

function getRefreshInterval(display_type) {
    switch (display_type) {
        case DisplayType.NORMAL:
            return 1000;
        case DisplayType.MS_ONLY:
            return 3;
    }
}

// 获取目标年份并开始倒计时
function init(display_type = DisplayType.NORMAL, skip_nav = false, callback = null) {
    clearInterval(timer);

    const target_date = generate_force_target(min_year, special_years) || generate_target(special_years);
    const target_year = target_date.getFullYear();

    countdown(target_date, display_type, callback);

    timer = setInterval(function () {
        countdown(target_date, display_type, callback);
    }, getRefreshInterval(display_type));

    if (!skip_nav) {
        // 处理前后年按钮
        document.getElementById("last_year").onclick = function () {
            updateQueryString("t", target_year - 1)
            init(display_type)
        };
        document.getElementById("near_year").onclick = function () {
            updateQueryString("t", "")
            init(display_type)
        };
        document.getElementById("next_year").onclick = function () {
            updateQueryString("t", target_year + 1)
            init(display_type)
        };
    }

    // 显示目标年份
    document.getElementById("target_year").innerHTML = target_year;

    if (display_type === DisplayType.NORMAL) {
        // 在最后一学期/半学期显示警告
        const now = new Date();
        document.getElementById("alert_for_last").style.display = "none";
        if (target_year.toString() === now.getFullYear().toString()) {
            let diff2 = target_date - now;
            let diff_day2 = Math.floor(diff2 / 1000 / 60 / 60 / 24);
            console.log(diff_day2);
            if (30 * 2 <= diff_day2 <= 30 * 4) {
                document.getElementById("alert_for_last").style.display = "block";
                document.getElementById("last_length").innerHTML = "一";
                document.getElementById("last_unit").innerHTML = "学期";
            }
            if (30 <= diff_day2 < 30 * 2) {
                document.getElementById("alert_for_last").style.display = "block";
                document.getElementById("last_length").innerHTML = "半";
                document.getElementById("last_unit").innerHTML = "学期";
            }
            if (15 < diff_day2 < 30) {
                document.getElementById("alert_for_last").style.display = "block";
                document.getElementById("last_length").innerHTML = "一";
                document.getElementById("last_unit").innerHTML = "个月";
            }
            if (7 < diff_day2 <= 15) {
                document.getElementById("alert_for_last").style.display = "block";
                document.getElementById("last_length").innerHTML = "两";
                document.getElementById("last_unit").innerHTML = "周";
            }
            if (diff_day2 <= 7) {
                document.getElementById("alert_for_last").style.display = "block";
                document.getElementById("last_length").innerHTML = "一";
                document.getElementById("last_unit").innerHTML = "周";
            }

        }
    }
    return target_year
}

/**
 * 获取强制指定时的目标日期
 * @param min_target Number
 * @param special_years Object{Number: [Number, Number, Number, String]}
 * @return Date|null
 */
function generate_force_target(min_target, special_years) {
    const override_target = getQueryStringValue("t");
    if (override_target) {
        const target_year = Number(override_target);
        const fixed_target_year = fix_force_target_year(target_year, min_target);
        if (special_years[fixed_target_year]) {
            return new Date(fixed_target_year, special_years[fixed_target_year][1] - 1, special_years[fixed_target_year][2]);
        } else {
            return new Date(fixed_target_year, 5, 7);
        }
    } else {
        return null;
    }
}

/**
 * 修复强制指定时的目标日期，使之大于等于最小目标日期
 * @param target_year Number
 * @param min_target Number
 * @return Number
 */
function fix_force_target_year(target_year, min_target) {
    if (target_year < min_target) {
        return fix_force_target_year(target_year + 1, min_target);
    } else {
        return target_year;
    }
}

/**
 * 根据当前时间生成目标日期
 * @param special_years
 * @param given_year
 * @return {*|Date}
 */
function generate_target(special_years, given_year = null) {
    const now = new Date();
    if (given_year) {
        now.setFullYear(given_year);
    }
    const now_year = now.getFullYear();
    let target;
    if (special_years[now_year]) {
        target = new Date(now_year, special_years[now_year][1] - 1, special_years[now_year][2]);
    } else {
        target = new Date(now_year, 5, 7);
    }
    if (target < new Date()) {
        return generate_target(special_years, now_year + 1);
    } else {
        return target;
    }
}


/**
 * 倒计时主函数
 * @param target_date{Date} 目标日期
 * @param display_type
 * @return boolean 目标时间是否在将来
 */
function countdown(target_date, display_type = DisplayType.NORMAL, callback = null) {
    const now = new Date();
    let diff = target_date - now;

    // 目标是否为过去时间
    let passed_target = false;

    if (diff < 0) {
        diff = -diff;
        passed_target = true;
    }

    if (passed_target) {
        document.getElementById("target_method").innerHTML = "已过";
    } else {
        document.getElementById("target_method").innerHTML = "还有";
    }

    if (display_type === DisplayType.NORMAL) {

        const diff_second = Math.floor(diff / 1000);
        const diff_minute = Math.floor(diff_second / 60);
        const diff_hour = Math.floor(diff_minute / 60);
        const diff_day = Math.floor(diff_hour / 24);

        const countdown_second_total = (diff_second).toFixed(0);

        const countdown_day = Math.floor(diff_day);
        const countdown_hour = Math.floor(diff_hour % 24);
        const countdown_minute = Math.floor(diff_minute % 60);
        const countdown_second = Math.floor(diff_second % 60);

        document.getElementById("countdown_second_total").innerHTML = countdown_second_total;

        document.getElementById("countdown_day").innerHTML = countdown_day.toString();
        document.getElementById("countdown_hour").innerHTML = countdown_hour.toString();
        document.getElementById("countdown_minute").innerHTML = countdown_minute.toString();
        document.getElementById("countdown_second").innerHTML = countdown_second.toString();
    } else if (display_type === DisplayType.MS_ONLY) {

        const diff_second = Math.floor(diff / 1000);
        const diff_ms = Math.floor(diff % 1000).toString().padStart(3, "0");

        document.getElementById("countdown_s").innerHTML = diff_second.toString();
        document.getElementById("countdown_ms").innerHTML = diff_ms.toString();
    }

    if (callback) {
        callback(diff);
    }

    return !passed_target
}
