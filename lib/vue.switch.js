Vue.component('v-switch', {
	template: '<label class="v-switch"><input type="checkbox" v-model="$parent[model]" disabled="{{disabled}}"><i></i><span>{{title}}</span></label>',
	props: {
		disabled: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			required: true
		},
		model: {
			type: String,
			required: true
		}
	}
});