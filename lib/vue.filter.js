Vue.filter('currency', {
	read: function(val) {
		return val ? '¥' + val.toFixed(2) : 0;
	},
	write: function(val, oldVal) {
		var number = +val.toString().replace(/[^\d.]/g, '');
		return isNaN(number) ? 0 : parseFloat(number.toFixed(2));
	}
});
Vue.filter('percent', {
	read: function(val) {
		return val ? val + '%' : 0;
	},
	write: function(val, oldVal) {
		var number = +val.toString().replace(/[^\d.]/g, '');
		return isNaN(number) ? 0 : parseFloat(number);
	}
});
Vue.filter('time', function(value, fmt) {
	var o = {
		"M+": value.getMonth() + 1, //月份
		"d+": value.getDate(), //日
		"h+": value.getHours(), //小时
		"m+": value.getMinutes(), //分
		"s+": value.getSeconds(), //秒
		"q+": Math.floor((value.getMonth() + 3) / 3), //季度
		"S": value.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (value.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
});