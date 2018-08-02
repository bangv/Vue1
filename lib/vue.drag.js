Vue.directive('drag', function(flag) {
	if (flag) {
		var doc = document,
			el = this.el,
			box = el.classList.contains('title') ? el.parentNode.parentNode : el,
			bottom_height = 40,
			istouch = false,
			doc_width, doc_height, start_x, start_y, start_top, start_left;

		function mousedown(e) {
			if (!box.hasClass('max')) {
				box.addClass('draging');
				istouch = (e.pageX == undefined);
				var rect = box.getBoundingClientRect();
				doc_width = doc.body.offsetWidth;
				doc_height = doc.body.offsetHeight - bottom_height;
				start_x = istouch ? e.touches[0].pageX : e.pageX;
				start_y = istouch ? e.touches[0].pageY : e.pageY;
				start_top = Math.round(rect.top);
				start_left = Math.round(rect.left);
				if (istouch) {
					doc.on('touchmove', mousemove);
					doc.on('touchend', mouseup);
				} else {
					doc.on('mousemove', mousemove);
					doc.on('mouseup', mouseup);
				}
			}
		}

		function mousemove(e) {
			var page_x = istouch ? e.touches[0].pageX : e.pageX,
				page_y = istouch ? e.touches[0].pageY : e.pageY;
			page_x < 0 && (page_x = 0);
			page_x > doc_width && (page_x = doc_width);
			page_y < 0 && (page_y = 0);
			page_y > doc_height && (page_y = doc_height);
			var transform = 'translate(' + (start_left + page_x - start_x) + 'px,' + (start_top + page_y - start_y) + 'px)';
			box.style.transform = box.style.transform.replace(/translate\((-?\d+)px\,\s+(-?\d+)px\)/g,transform);
		}

		function mouseup() {
			box.removeClass('draging');
			if (istouch) {
				doc.off('touchmove', mousemove);
				doc.off('touchend', mouseup);
			} else {
				doc.off('mousemove', mousemove);
				doc.off('mouseup', mouseup);
			}
		}

		el.on('mousedown', mousedown);
		el.on('touchstart', mousedown);
	}
});