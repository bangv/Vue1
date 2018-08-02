Vue.component('v-button', {
	props: {
		text: {
			type: String,
			required: true
		},
		icon: {
			type: String,
			default: 'none'
		},
		processing:{
			type: Boolean,
			default: false
		},
		processtext:{
			type: String,
			default: '处理中'
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	template: '<button class="v-button" disabled="{{disabled||processing}}" v-ripple><i v-if="processing" class="icon-spinner"></i><i v-else class="icon-{{icon}}"></i>{{processing?processtext:text}}</button>'
});