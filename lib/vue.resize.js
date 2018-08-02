Vue.directive('resize', function(flag) {
	if (flag) {
		var doc = document,
			body = doc.body,
			el = this.el,
			type = '',
			istouch = false,
			min_width = 96,
			min_height = 32,
			doc_width, doc_height, start_width, start_height, start_x, start_y, start_top, start_left, max_top, max_left;
		['e', 's', 'w', 'n', 'se', 'ne', 'sw', 'nw'].forEach(function(item) {
			var i = document.createElement('i');
			i.className = 'v-resize ' + item;
			el.appendChild(i);
		});

		function mousemove(e) {
			body.style.cursor = type + '-resize';
			var top = null,
				left = null,
				width = null,
				height = null,
				max_width = 0,
				max_height = 0,
				move_x = (istouch ? e.touches[0].pageX : e.pageX) - start_x,
				move_y = (istouch ? e.touches[0].pageY : e.pageY) - start_y;
			switch (type) {
				case 'e':
					max_width = doc_width - start_left;
					width = start_width + move_x;
					break;
				case 's':
					max_height = doc_height - start_top;
					height = start_height + move_y;
					break;
				case 'n':
					max_height = start_height + start_top;
					top = start_top + move_y;
					height = start_height - move_y;
					break;
				case 'w':
					max_width = start_width + start_left;
					left = start_left + move_x;
					width = start_width - move_x;
					break;
				case 'se':
					max_width = doc_width - start_left;
					max_height = doc_height - start_top;
					width = start_width + move_x;
					height = start_height + move_y;
					break;
				case 'sw':
					max_width = start_width + start_left;
					max_height = doc_height - start_top;
					left = start_left + move_x;
					width = start_width - move_x;
					height = start_height + move_y;
					break;
				case 'ne':
					max_width = doc_width - start_left;
					max_height = start_height + start_top;
					top = start_top + move_y;
					width = start_width + move_x;
					height = start_height - move_y;
					break;
				case 'nw':
					max_width = start_width + start_left;
					max_height = start_height + start_top;
					left = start_left + move_x;
					top = start_top + move_y;
					width = start_width - move_x;
					height = start_height - move_y;
					break;
			}
			if (width != null) {
				width < min_width && (width = min_width);
				width > max_width && (width = max_width);
				el.style.width = width + 'px';
			}
			if (height != null) {
				height < min_height && (height = min_height);
				height > max_height && (height = max_height);
				el.style.height = height + 'px';
			}
			if (top != null) {
				top < 0 && (top = 0);
				top > max_top && (top = max_top);
			} else {
				top = start_top;
			}
			if (left != null) {
				left < 0 && (left = 0);
				left > max_left && (left = max_left);
			} else {
				left = start_left;
			}
			var transform = 'translate(' + left + 'px,' + top + 'px)';
			el.style.transform = el.style.transform.replace(/translate\((-?\d+)px\,\s+(-?\d+)px\)/g, transform);;
		}

		function mouseup() {
			el.removeClass('resizing');
			body.style.cursor = 'default';
			if (istouch) {
				doc.off('touchmove', mousemove);
				doc.off('touchend', mouseup);
			} else {
				doc.off('mousemove', mousemove);
				doc.off('mouseup', mouseup);
			}
		}

		function mousedown(e) {
			var _this = e.target,
				parent = _this.parentNode;
			if (!parent.hasClass('max')) {
				var rect = el.getBoundingClientRect();
				istouch = (e.pageX == undefined);
				el.addClass('resizing');
				start_x = istouch ? e.touches[0].pageX : e.pageX;
				start_y = istouch ? e.touches[0].pageY : e.pageY;
				doc_width = body.offsetWidth;
				doc_height = body.offsetHeight;
				start_width = el.offsetWidth;
				start_height = el.offsetHeight;
				start_top = Math.round(rect.top);
				start_left = Math.round(rect.left);
				max_top = start_top + start_height - min_height;
				max_left = start_left + start_width - min_width;
				type = _this.className.split(' ')[1];
				if (istouch) {
					doc.on('touchmove', mousemove);
					doc.on('touchend', mouseup);
				} else {
					doc.on('mousemove', mousemove);
					doc.on('mouseup', mouseup);
				}
			}
		}

		var resizer = el.find('.v-resize');
		resizer.on('mousedown', mousedown);
		resizer.on('touchstart', mousedown);
	}
});