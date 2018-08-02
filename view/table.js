app.ctrl('table', {
	data: {
		count: 191,
		size: 10,
		name: 'product',
		search: '',
		columns: [{
			name: 'name',
			title: '名字',
			sortable: true
		}, {
			name: 'power',
			title: '权限'
		}],
		gridData: []
	},
	methods: {
		getData: function() {
			var self = this;
			_.http.get_json('data.json', function(data) {
				self.gridData = data;
			});
		}
	},
	events: {
		sort: function(sort, name) {
			console.log('sort:' + sort);
			this.getData();
		},
		page: function(page, name) {
			console.log('page:' + page);
			this.getData();
		}
	},
	ready: function() {
		var self = this;
		setTimeout(function() {
			self.getData();
		}, 1000);
	}
});