Vue.component('v-radio', {
	template: '<label class="v-radio" v-ripple><input type="radio" v-model="$parent[model]" disabled="{{disabled}}" value="{{value}}"/><i></i><span>{{title}}</span></label>',
	props: {
		disabled: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			required: true
		},
		value: {
			type: String,
			required: true
		},
		model: {
			type: String,
			required: true
		}
	}
});