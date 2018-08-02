Vue.component('v-notify', {
	template: '<div class="v-notify {{position}}">' +
		'<div v-for="msg in msgs" transition="staggered" stagger="100" class="{{msg.type}}" >' +
		'<a v-if="closable" class="close-button" @click="close(msg)">×</a>' +
		'<div class="title" v-if="msg.title">{{msg.title}}</div>' +
		'<div class="message">{{msg.text}}</div>' +
		'</div>' +
		'</div>',
	props: {
		position: {
			type: String,
			default: 'top-right'
		},
		timeout: {
			type: Number,
			default: 5000
		},
		closable: {
			type: Boolean,
			default: true
		},
		capacity: {
			type: Number,
			default: 5
		}
	},
	data: function() {
		return {
			msgs: []
		};
	},
	methods: {
		close: function(item) {
			this.msgs.$remove(item);
		}
	},
	events: {
		message: function(msg) {
			var self = this;
			self.msgs.length >= self.capacity && self.msgs.shift();
			self.msgs.unshift(msg);
			setTimeout(function() {
				self.msgs.$remove(msg);
			}, self.timeout);
		}
	}
});