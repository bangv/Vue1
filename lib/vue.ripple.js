Vue.directive('ripple', function() {
	var el = this.el;
	el.on('click', function(e) {
		var rect = el.getBoundingClientRect(),
			ripple = el.querySelector('.v-ripple');
		ripple && ripple.remove();
		ripple = document.createElement('span');
		ripple.className = 'v-ripple';
		ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
		el.appendChild(ripple);
		var top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop,
			left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
		ripple.style.top = top + 'px';
		ripple.style.left = left + 'px';
		ripple.on('animationend', function() {
			ripple && ripple.remove();
		});
	});
});