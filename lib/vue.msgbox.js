Vue.component('v-msgbox', {
	template: '<div class="v-msgbox" :class="{on:on}" tabindex="1" @blur="blur">' +
		'<h3>通知中心<a v-if="msgs.length>00" title="清空消息" @click="clear"></a></h3>' +
		'<div class="v-notify">' +
		'<div v-if="msgs.length==0">暂无通知</div>' +
		'<div v-for="msg in msgs" class="{{msg.type}}">' +
		'<a class="close-button" @click="close($event,msg)">×</a>' +
		'<div class="message">{{msg.text}}</div>' +
		'<div class="time">{{msg.time|time "yyyy/MM/dd hh:mm:ss"}}</div>' +
		'</div>' +
		'</div>' +
		'</div>',
	props: {
		on: {
			type: Boolean,
			default: false
		}
	},
	data: function() {
		return {
			msgs: []
		};
	},
	methods: {
		close: function(e, msg) {
			var self = this;
			e.target.parentNode.addClass('close');
			setTimeout(function() {
				self.msgs.$remove(msg);
			}, 300);
		},
		clear: function() {
			var self = this,
				msgbox = self.$el.find('.v-notify > div'),
				i = 0,
				len = msgbox.length;
			var close = function() {
				if (i < len) {
					var item = msgbox[i];
					item.findOne('.close-button').click();
					setTimeout(close, 100);
				}
				i++;
			};
			close();
		},
		blur: function() {
			this.on = false;
		}
	},
	events: {
		message: function(msg) {
			msg.time = new Date();
			this.msgs.unshift(msg);
		}
	}
});