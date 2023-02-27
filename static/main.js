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
        const fixed_target_year =  fix_force_target_year(target_year, min_target);
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
function generate_target(special_years, given_year=null) {
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
    if (target < now) {
        return generate_target(special_years, now_year + 1);
    } else {
        return target;
    }
}


/**
 * 倒计时主函数
 * @param target_date{Date} 目标日期
 * @return boolean 目标时间是否在将来
 */
function countdown(target_date) {
    const now = new Date();
    let diff = target_date - now;

    // 目标是否为过去时间
    let passed_target = false;

    if (diff < 0) {
        diff = -diff;
        passed_target = true;
    }

    const diff_second = Math.floor(diff / 1000);
    const diff_minute = Math.floor(diff_second / 60);
    const diff_hour = Math.floor(diff_minute / 60);
    const diff_day = Math.floor(diff_hour / 24);

    const countdown_second_total = (diff_second).toFixed(0);

    const countdown_day = Math.floor(diff_day);
    const countdown_hour = Math.floor(diff_hour % 24);
    const countdown_minute = Math.floor(diff_minute % 60);
    const countdown_second = Math.floor(diff_second % 60);

    if (passed_target) {
        document.getElementById("target_method").innerHTML = "已过";
    } else {
        document.getElementById("target_method").innerHTML = "还有";
    }

    document.getElementById("countdown_second_total").innerHTML = countdown_second_total;

    document.getElementById("countdown_day").innerHTML = countdown_day.toString();
    document.getElementById("countdown_hour").innerHTML = countdown_hour.toString();
    document.getElementById("countdown_minute").innerHTML = countdown_minute.toString();
    document.getElementById("countdown_second").innerHTML = countdown_second.toString();

    return !passed_target
}
