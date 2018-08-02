Vue.component('v-grid', {
	template: '<table class="v-table">' +
		'<thead><tr><th v-for="col in columns" @click="sort(col.name,col.sortable)" :class="{asc:orders[col.name]==1,desc:orders[col.name]==-1,sort:col.sortable}">{{col.title}}</th></tr></thead>' +
		'<tbody><tr v-if="!load"><td colspan="{{columns.length}}">数据加载中...</td></tr>' +
		'<tr v-if="load&&!data.length"><td colspan="{{columns.length}}">暂无数据</td></tr>' +
		'<tr v-for="entry in data"><td v-for="col in columns">{{entry[col.name]}}</td></tr>' +
		'</tbody></table>',
	props: {
		data: Array,
		columns: Array,
		name: String
	},
	data: function() {
		var orders = {}
		this.columns.forEach(function(col) {
			orders[col.name] = 0;
		});
		return {
			load: false,
			orders: orders
		};
	},
	watch: {
		data: function() {
			this.load = true;
		}
	},
	methods: {
		sort: function(name, sortable) {
			if (!sortable) {
				return;
			}
			var order = this.orders[name];
			switch (order) {
				case 0:
					this.orders[name] = 1;
					break;
				case 1:
					this.orders[name] = -1;
					break;
				case -1:
					this.orders[name] = 0;
					break;
			}
			var sort = '';
			for (var item in this.orders) {
				var _order = this.orders[item];
				if (_order == 1) {
					sort += item + ' asc,';
				} else if (_order == -1) {
					sort += item + ' desc,';
				}
			}
			this.$dispatch('sort', sort.substring(0, sort.length - 1), this.name);
		}
	}
});