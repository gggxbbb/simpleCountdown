// 读取查询字符串
function getQueryString(name) {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    // noinspection JSDeprecatedSymbols
    const r = window.location.search.substr(1).match(reg);
    if (r != null) { // noinspection JSDeprecatedSymbols
        return unescape(r[2]);
    }
    return null;
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
