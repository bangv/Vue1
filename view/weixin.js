app.ctrl('weixin', {
	data: {
		money: 10,
		email: '',
		digits: '',
		url: '',
		ip: '',
		tel: '',
		time: '',
		text: '点我',
		text2: '',
		picked: '',
		flag: false,
		processing: false,
		country: '',
		countrys: [{
			text: '中国',
			value: 1
		}, {
			text: '美国',
			value: 2
		}, {
			text: '英国',
			value: 3
		}],
		checkedNames: []
	},
	methods: {
		click: function(e) {
			this.$broadcast('validate');
			console.log('click');
		},
		valid: function() {
			var self = this;
			self.$broadcast('validate');
			if (self.$valid) {
				setTimeout(function() {
					self.processing = false;
				}, 1000);
			}
		},
		dotask: function(e) {
			var _this = this;
			setTimeout(function() {
				_this.processing = false;
			}, 1000);
			_this.processing = true
		}
	}
});