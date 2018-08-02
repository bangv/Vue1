Vue.component('v-pager', {
	template: '<div class="v-pager">' +
		'<a class="first" title="首页" @click="first()"></a>' +
		'<a class="prev" title="上一页" @click="prev()"></a>' +
		'<span>|第</span><input type="text" v-model="page|number" lazy @keydown="keydown" /><span>/{{total}}页|</span>' +
		'<a class="next" title="下一页" @click="next()"></a>' +
		'<a class="last" title="尾页" @click="last()"></a>' +
		'</div>',
	props: {
		size: Number,
		count: Number,
		name: String
	},
	data: function() {
		return {
			total: Math.ceil(this.count / this.size),
			page: 1
		};
	},
	filters: {
		number: {
			read: function(val) {
				return val;
			},
			write: function(val, oldVal) {
				var number = +val.replace(/[^\d.]/g, '');
				return (isNaN(number) || number == 0) ? 1 : +number;
			}
		}
	},
	methods: {
		keydown: function(e) {
			if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
				(e.keyCode == 65 && e.ctrlKey === true) ||
				(e.keyCode == 67 && e.ctrlKey === true) ||
				(e.keyCode == 88 && e.ctrlKey === true) ||
				(e.keyCode >= 35 && e.keyCode <= 39)) {
				return;
			}
			if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
				e.preventDefault();
			} else {
				var num = e.target.value + (isNaN(+String.fromCharCode(e.keyCode)) ? String.fromCharCode(e.keyCode - 48) : String.fromCharCode(e.keyCode));
				num = num.replace(/[^\d.]/g, '');
				(num == '' || num > 20 || num < 0) && e.preventDefault();
			}
		},
		first: function() {
			this.page = 1;
		},
		last: function() {
			this.page = this.total;
		},
		prev: function() {
			this.page > 1 && this.page--;
		},
		next: function() {
			this.page < this.total && this.page++;
		}
	},
	watch: {
		page: function(val) {
			this.$dispatch('page', val, this.name);
		}
	}
});