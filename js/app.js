'use strict';
var app = new Vue({
	el: 'body',
	data: {
		wins: [],
		demo: [],
		apps: apps,
		temp: '',
		username: '',
		password: '',
		logged: false,
		msgbox: false,
		startbox: false,
		jello: false,
		processing: false
	},
	methods: {
		login: function() {
			var self = this;
			self.$broadcast('validate');
			if (self.$valid) {
				localStorage.username = self.username;
				self.processing = true;
				// setTimeout(function() {
					self.logged = true;
					self.processing = false;
				// }, 1000);
			}
			return false;
		}
	},
	events: {
		child_close: function() {
			console.log('child_close');
		},
		win_close: function(win) {
			this.wins.$remove(win);
		},
		msg_open: function() {
			this.msgbox = !this.msgbox;
		},
		start: function() {
			this.startbox = !this.startbox;
		}
	},
	ready: function() {
		var self = this,
			i = 0;
		self.temp = localStorage.username;
		for (var i = 0; i < 10; i++) {
			self.demo.push(i);
		}
		setInterval(function() {
			self.jello = !self.jello;
			var types = ['info', 'warning', 'success', 'error'];
			self.$broadcast('message', {
				type: types[i % 4],
				text: '您收到一条通知' + i++
			});
		}, 5000);
	}
});