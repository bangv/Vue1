Vue.component('v-input', {
	props: {
		title: {
			type: String
		},
		type: {
			type: String,
			default: 'text'
		},
		disabled: {
			type: Boolean,
			default: false
		},
		required: {
			type: Boolean,
			default: false
		},
		model: {
			type: String,
			required: true
		},
		placeholder: {
			type: String
		},
		width: null,
		height: null,
		min: {
			type: String
		},
		max: {
			type: String
		}
	},
	data: function() {
		return {
			value: '',
			isfocus: false,
			name: '',
			error: false,
			error_ip: false,
			error_tel: false,
			error_url: false,
			error_min: false,
			error_max: false,
			error_email: false,
			error_required: false
		};
	},
	methods: {
		focus: function(e) {
			this.isfocus = true;
		},
		blur: function(e) {
			this.isfocus = false;
		},
		keydown: function(e) {
			if (this.type == 'number' || this.type == 'digits' || this.type == 'tel' || this.type == 'ip') {
				if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
					// 允许: Ctrl+A
					(e.keyCode == 65 && e.ctrlKey === true) ||
					// 允许: Ctrl+C
					(e.keyCode == 67 && e.ctrlKey === true) ||
					// 允许: Ctrl+X
					(e.keyCode == 88 && e.ctrlKey === true) ||
					// 允许: home, end, left, right
					(e.keyCode >= 35 && e.keyCode <= 39)) {
					// 什么都不做
					var dot = e.target.value.match(/\./ig) || [];
					(e.keyCode == 110 || e.keyCode == 190) && this.type == 'digits' && e.preventDefault();
					(e.keyCode == 110 || e.keyCode == 190) && this.type == 'number' && e.target.value.indexOf('.') != -1 && e.preventDefault();
					(e.keyCode == 110 || e.keyCode == 190) && this.type == 'ip' && dot.length > 3 && e.preventDefault();
					return;
				}
				// 禁止冒泡
				if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
					if (this.type == 'tel') {
						e.keyCode != 189 && e.keyCode != 109 && e.preventDefault();
					} else {
						e.preventDefault();
					}
				}
			}
		},
		reset: function() {
			this.error = false;
			this.error_ip = false;
			this.error_tel = false;
			this.error_url = false;
			this.error_min = false;
			this.error_max = false;
			this.error_email = false;
			this.error_required = false;
		},
		validate: function(val) {
			this.value = val.toString();
			this.reset();
			if (this.required) {
				this.error_required = (val.toString() == '');
			}
			if (this.min && !this.error_required) {
				this.error_min = (this.value.length < +this.min);
			}
			if (this.max) {
				this.error_max = (this.value.length > +this.max);
			}
			if (this.value != '' && !this.error_min && !this.error_max) {
				var re = '';
				if (this.type == 'email') {
					re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
					this.error_email = !re.test(this.value);
				}
				if (this.type == 'url') {
					re = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
					this.error_url = !re.test(this.value);
				}
				if (this.type == 'ip') {
					re = /^(([1-9]?\d|1\d\d|2[0-5][0-5]|2[0-4]\d)\.){3}([1-9]?\d|1\d\d|2[0-5][0-5]|2[0-4]\d)$/;
					this.error_ip = !re.test(this.value);
				}
				if (this.type == 'tel') {
					re = /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
					this.error_tel = !re.test(this.value);
				}
			}
			this.error = this.error_required || this.error_min || this.error_max || this.error_email || this.error_url || this.error_ip || this.error_tel;
			this.$parent.$validation[this.name] = !this.error;
			this.$parent.$valid = true;
			for (var name in this.$parent.$validation) {
				this.$parent.$valid &= this.$parent.$validation[name];
			}
			this.$parent.$valid = !!this.$parent.$valid;
		}
	},
	created: function() {
		this.$parent.$valid == undefined && (this.$parent.$valid = true);
		this.$parent.$validation == undefined && (this.$parent.$validation = {});
		var input = '<input type="{{type!=\'password\'?\'text\':\'password\'}}" class="input" :style="{width:width,height:height}" :class="{dirty:value}" @focus="focus" @blur="blur" @keydown="keydown" v-model="$parent.' + this.model + '" lazy :disabled="disabled" placeholder="{{placeholder}}"/>';
		if (this.type == 'richbox') {
			input = '<textarea class="input" :style="{width:width,height:height}" :class="{dirty:value}" @focus="focus" @blur="blur" v-model="$parent.' + this.model + '" lazy :disabled="disabled" placeholder="{{placeholder}}"></textarea>';
		}
		var title = this.title;
		this.disabled && (title += '(不可修改)');
		this.required && (title += '(必填项)');
		this.$options.template = '<label class="v-input" :class="{focus:isfocus,error:error}"><slot name="input">' + input +
			'</slot><span class="tit" v-if="title">' + title + '</span><span class="error" v-if="error">' +
			'<slot name="required" v-if="error_required"><i transition="fade">请输入{{title}}</i></slot>' +
			'<slot name="min" v-if="error_min"><i transition="fade">{{title}}至少要{{min}}个字</i></slot>' +
			'<slot name="max" v-if="error_max"><i transition="fade">{{title}}最多{{max}}个字</i></slot>' +
			'<slot name="email" v-if="error_email"><i transition="fade">邮箱格式错误</i></slot>' +
			'<slot name="url" v-if="error_url"><i transition="fade">{{title}}格式错误</i></slot>' +
			'<slot name="ip" v-if="error_ip"><i transition="fade">{{title}}格式错误</i></slot>' +
			'<slot name="tel" v-if="error_tel"><i transition="fade">{{title}}格式错误</i></slot>' +
			'</span></label>';
	},
	ready: function() {
		var split = this.model.indexOf('|');
		this.name = split > 0 ? this.model.substring(0, split) : this.model;
		this.value = (this.$parent[this.name] || '').toString();
		this.$parent.$watch(this.name, this.validate);
	},
	events: {
		validate: function() {
			this.value = (this.$parent[this.name] || '').toString();
			this.validate(this.value);
		}
	}
});