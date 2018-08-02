Vue.component('v-select', {
	props: {
		title: {
			type: String,
			required: true
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
		options: {
			type: Array
		}
	},
	data: function() {
		return {
			value: '',
			isfocus: false,
			isopen: false,
			error: false,
			error_required: false
		};
	},
	methods: {
		focus: function() {
			this.isfocus = true;
		},
		blur: function() {
			this.isfocus = false;
		},
		keydown: function(e) {
			e.preventDefault();
		},
		click: function() {
			this.isopen = true;
		},
		reset: function() {
			this.error = false;
			this.error_required = false;
		},
		validate: function(val) {
			this.value = val.toString();
			this.reset();
			if (this.required) {
				this.error_required = (val.toString() == '');
			}
			this.error = this.error_required;
		},
		select: function(e, item) {
			e.stopPropagation();
			var self = this;
			setTimeout(function() {
				self.isopen = false;
			}, 150);
		}
	},
	filters: {
		seltext: function(val) {
			var text = '';
			for (var i = 0, len = this.options.length; i < len; i++) {
				var option = this.options[i];
				if (option.value == val) {
					text = option.text;
					break;
				}
			}
			return text;
		}
	},
	created: function() {
		var input = '<input type="text" class="input" :class="{dirty:value}" @focus="focus" @click="click" @blur="blur" @keydown="keydown" value="{{$parent.' + this.model + '|seltext}}" :disabled="disabled" />';
		var items = '<li @click="select($event)" v-ripple><input type="radio" v-model="$parent[model]" value=""/><a></a></li>';
		this.options.forEach(function(item) {
			items += '<li @click="select($event)" v-ripple><input type="radio" v-model="$parent[model]" value="' + item.value + '"/><a>' + item.text + '</a></li>'
		});
		this.$options.template = '<label class="v-input" :class="{focus:isfocus,error:error}"><slot name="input">' + input +
			'</slot><span class="tit">{{title+(disabled?"(不可修改)":"")}}</span><span class="error" v-if="error">' +
			'<slot name="required" v-if="error_required"><i transition="fade">请选择{{title}}</i></slot>' +
			'</span><ul class="v-select" :class="{on:isopen}">' + items + '</ul><i></i></label>';
	},
	ready: function() {
		var self = this,
			split = self.model.indexOf('|'),
			model = split > 0 ? self.model.substring(0, split) : self.model;
		this.value = (self.$parent[model] || '').toString();
		self.$parent.$watch(model, this.validate);
	},
	events: {
		validate: function() {
			this.value = (this.$parent[this.name] || '').toString();
			this.validate(this.value);
		}
	}
});