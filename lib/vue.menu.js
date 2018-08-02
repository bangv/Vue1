Vue.directive('menu', function(options) {
	var self = this,
		el = this.el,
		body = document.body,
		menu = document.getElementById('contextmenu');
	if (!menu) {
		menu = document.createElement('ul');
		menu.id = 'contextmenu';
		menu.addClass('v-menu');
		menu.attr('tabindex', 1);
		menu.on('blur', function(e) {
			e.target.hide();
		});
		body.appendChild(menu);
	}
	options && el.on('contextmenu', function(e) {
		e.preventDefault();
		menu.html('');
		for (var i = 0, len = options.length; i < len; i++) {
			var option = options[i],
				li = document.createElement('li');
			option.icon || (option.icon = 'none');
			li.html('<a><i class="icon-' + option.icon + '"></i>' + option.text + '</a>');
			li.on('click', function(e) {
				self.vm.$dispatch('menu', e);
			});
			menu.appendChild(li);
		}
		menu.show();
		var y = body.offsetHeight - e.pageY < menu.offsetHeight ? e.pageY - menu.offsetHeight : e.pageY;
		menu.style.transform = 'translate(' + e.pageX + 'px,' + y + 'px)';
		menu.focus();
	});
});