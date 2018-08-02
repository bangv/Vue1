Vue.component('v-desktop', {
	props: ['apps', 'wins'],
	template: '<a v-for="app in apps" track-by="$index" v-on:click="click(app,$event)"  class="v-app v-icon {{app.icon}}" :style="{transform:position($index+1)}"><b v-text="app.title"></b></a>' +
		'<div class="v-taskbar">' +
		'<a class="app start" @click="start"></a>' +
		'<a v-for="app in apps | orderBy \'pin\' -1" title="{{app.title}}" track-by="$index" @click="click(app,$event)" v-if="app.pin||app.active" class="app v-icon {{app.icon}} {{active(app.active)}} {{current(app.current)}}"></a>' +
		'<div class="tool"><a class="msg icon-bullhorn" @click="openmsg"><span v-if="hasmsg"></span></a></div>' +
		'</div>',
	data: function() {
		return {
			hasmsg: false,
			maxrow: _.maxrow()
		}
	},
	methods: {
		click: function(app, e) {
			if (app.active) {
				app.show = true;
				app.current = true;
			} else {
				app.opener = e;
				app.minier = '.v-taskbar .' + app.id
				this.wins.push(app);
			}
		},
		active: function(val) {
			return val ? 'active' : '';
		},
		current: function(val) {
			return val ? 'current' : '';
		},
		position: function(index) {
			var x = Math.ceil(index / this.maxrow),
				y = index - (this.maxrow * (x - 1));
			x = (x - 1) * 76;
			y = (y - 1) * 100;
			return 'translate3d(' + x + 'px,' + y + 'px,0)';
		},
		start: function(e) {
			this.$dispatch('start', e);
		},
		openmsg: function(e) {
			this.$dispatch('msg_open', e);
		}
	},
	events: {
		menu: function(e) {
			console.log(e);
			// switch (option.cmd) {
			// 	case 'pin':
			// 		break;
			// 	default:
			// 		break;
			// }
		}
	},
	created: function() {
		var _this = this,
			timeout = 0;
		window.addEventListener('resize', function() {
			clearTimeout(timeout);
			timeout = setTimeout(function() {
				_this.maxrow = _.maxrow();
			}, 500);
		});
	},
	beforeCompile: function() {
		// this.apps.forEach(function(item) {
		// 	item.options = [{
		// 		text: '固定到任务栏',
		// 		cmd: 'pin'
		// 	}];
		// });
	}
});