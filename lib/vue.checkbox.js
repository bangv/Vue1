Vue.component('v-checkbox', {
	template: '<label class="v-checkbox" v-ripple><input type="checkbox" v-model="$parent[model]" disabled="{{disabled}}" value="{{value}}"><i></i><span>{{title}}</span></label>',
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