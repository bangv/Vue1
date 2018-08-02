Vue.component('v-window', {
	props: ['options'],
	template: '<div id="{{id}}" tabindex="-1" class="v-window" v-show="options.show" v-resize="resizable&&maxable" :class="{max:max}" :style="style" @blur="blur" @focus="focus"><div><h1 class="title" v-drag="dragable" @dblclick="maximum"><span v-text="title"></span><a class="close" v-if="minable" @click="close"></a><a class="max" :class="{on:max}" v-if="maxable" @click="maximum"></a><a class="min" @click="minimum"></a></h1><div class="content"><div v-html="content" class="html"></div><div class="loading"><div class="pacman"><div></div><div></div><div></div><div></div><div></div></div></div></div></div></div>',
	data: function() {
		var data = _.extend({
			id: null, //窗口ID(必填)
			title: '', //窗口标题
			tpl: '', //(必填)
			ctrl: '', //(必填)
			minable: !0, //可最小化
			maxable: !0, //可最大化
			resizable: !0, //可调整大小
			dragable: !0, //可否拖拽
			opener: null, //鼠标点击事件源
			width: 600, //窗口宽度
			height: 450, //窗口高度
			content: '',
			style: {
				opacity: 0,
				transform: '',
				zIndex: 0
			},
			max: false
		}, this.options);
		data.style.width = data.width + 'px';
		data.style.height = data.height + 'px';
		if (data.opener) {
			data.style.transform = 'translate(' + data.opener.pageX + 'px,' + data.opener.pageY + 'px) scale(0)';
		} else {
			data.style.transform = 'translate(' + (document.body.offsetWidth / 2) + 'px,0) scale(0)';
		}
		return data;
	},
	methods: {
		close: function() {
			var _this = this;
			_this.style.opacity = 0;
			_this.options.active = false;
			_this.options.current = false;
			_this.options.position = null;
			setTimeout(function() {
				_this.$dispatch('win_close', _this.options);
				_this.$destroy(true);
			}, 200);
		},
		maximum: function() {
			if (this.maxable) {
				this.$dispatch('win_maximum', this.options);
				this.max = !this.max;
			}
		},
		minimum: function() {
			var _this = this,
				style = _this.$el.style,
				minier = document.querySelector(_this.minier);
			_this.$dispatch('win_minimum', _this.options);
			_this.options.position = _.extend({}, {
				opacity: style.opacity,
				transform: style.transform,
				zIndex: style.zIndex,
				width: style.width,
				height: style.height
			});
			if (minier) {
				var rect = minier.getBoundingClientRect();
				_this.style.transform = 'translate(' + rect.left + 'px,' + rect.top + 'px) scale(0)';
			} else {
				_this.style.transform = 'translate(' + (document.body.offsetWidth / 2) + 'px,' + document.body.offsetHeight + 'px)  scale(0)';
			}
			_this.style.opacity = 0;
			_this.options.current = false;
			setTimeout(function() {
				_this.options.show = false;
			}, 200);
		},
		blur: function() {
			this.$dispatch('win_blur', this.options);
			this.options.current = false;
		},
		focus: function() {
			this.$dispatch('win_focus', this.options);
			this.options.current = true;
			this.style.zIndex = document.body.style.zIndex++;
		}
	},
	watch: {
		'options.current': function(val) {
			if (val) {
				var _this = this;
				setTimeout(function() {
					_this.options.position && (_this.style = _this.options.position);
					_this.$el.focus();
				});
			}
		}
	},
	compiled: function() {
		this.$el.querySelector('.loading').attr('v-cloak', '');
	},
	ready: function() {
		var _this = this,
			top = Math.round((document.body.offsetHeight - 40) / 2 - this.height / 2);
		document.body.offsetHeight < this.height && (top = 0);
		this.options.active = true;
		this.style.opacity = 1;
		this.style.transform = 'translate(' + Math.round(document.body.offsetWidth / 2 - this.width / 2) + 'px,' + top + 'px) scale(1)';
		this.$el.focus();
		_.waterfall([
			//先加载样式文件(如果有)
			function(callback) {
				if (_this.css) {
					_.http.get_css(_this.css, function() {
						callback(null);
					}, function(error) {
						callback(error);
					});
				} else {
					callback(null);
				}
			},
			//加载html内容
			function(callback) {
				_.http.get_html(_this.tpl, function(data) {
					_this.content = data;
					setTimeout(function() {
						callback(null);
					}, 500);
				}, function(error) {
					callback(error);
				});
			},
			//挂载vue对象
			function(callback) {
				var cache = _.win_obj_cache[_this.id];
				if (cache) {
					new Vue(_.extend({}, cache)); //.$mount('#' + _this.id);
				} else {
					_.http.get_script(_this.ctrl, function() {
						callback(null);
					}, function(error) {
						callback(error);
					});
				}
			}
		], function(error) {
			error && console.error('窗口 "' + _this.title + '" 打开失败：(' + error + ')');
		});
	}
});