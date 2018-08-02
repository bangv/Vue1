app.ctrl('news', {
	//简单数据
	data: {
		title: 'Wordddld',
		msg: '',
		data: [],
		amount: 10
	},
	//需要计算的数据
	computed: {
		titles: function() {
			return 'Hello ' + this.title;
		}
	},
	//方法
	methods: {
		sayhello: function() {
			this.title = "xxx";
		}
	},
	//监听变量数据的改变
	watch: {
		title: function(new_val, old_val) {
			console.log(new_val);
		}
	},
	//事件处理
	events: {
		//接收父级的广播事件
		message: function(msg) {
			this.data = ['1', '2', '3'];
			this.msg = msg;
			//派发事件，事件沿着父链冒泡
			this.$dispatch('child_message', msg);
		}
	}
});