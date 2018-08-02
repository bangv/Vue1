(function(vue, doc, win) {
	var head_tag = doc.getElementsByTagName('head')[0];
	var _ = {};
	_.win_css_cache = {}; //样式文件名缓存，防止多次加载
	_.win_obj_cache = {}; //对象缓存，防止js多次加载
	_.waterfall = function(tasks, callback) {
		var index = 0,
			len = tasks.length,
			dotask = function(err) {
				if (err || index == len) {
					callback.apply(null, arguments);
				} else {
					var task = tasks[index++],
						args = Array.prototype.slice.call(arguments, 1);
					args.push(function() {
						dotask.apply(null, arguments);
					});
					task.apply(null, args);
				}
			};
		dotask();
	};
	_.parallel = function(tasks, callback) {
		var i = 0,
			len = tasks.length,
			flag = true,
			count = 0,
			results = [];
		for (; i < len; i++) {
			(function(index) {
				tasks[index].apply(null, [function(err, result) {
					results[index] = result;
					count++;
					if (flag && (count == len || err)) {
						flag = false;
						callback(err, results);
					}
				}]);
			})(i);
		}
	};
	_.maxrow = function() {
		return Math.floor((document.body.offsetHeight - 40) / 100);
	};
	_.http = {
		get_html: function(url, success, error, isjson) {
			var req = new XMLHttpRequest();
			req.onreadystatechange = function() {
				if (req.readyState == 4) {
					if (req.status == 200) {
						success && success(isjson ? JSON.parse(req.responseText) : req.responseText);
					} else {
						error && error('load html "' + url + '" fail');
					}
				}
			};
			req.open('GET', url ? url + '?t=' + new Date().getTime() : '', true);
			req.send(null);
		},
		get_json: function(url, success, error) {
			this.get_html(url, success, error, true);
		},
		get_script: function(url, success, error) {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = url ? url + '?t=' + new Date().getTime() : '';
			script.async = true;
			script.onload = function() {
				success && success();
			};
			script.onerror = function() {
				error && error('load script "' + url + '" fail');
			};
			document.body.appendChild(script);
		},
		get_css: function(url, success, error) {
			var cache = _.win_css_cache[url];
			if (cache) {
				success();
			} else {
				var css = document.createElement("link");
				css.rel = "stylesheet";
				css.type = "text/css";
				css.href = url;
				css.onload = function() {
					_.win_css_cache[url] = true;
					success && success();
				};
				css.onerror = function() {
					error && error('load "' + url + '" fail');
				};
				head_tag.appendChild(css);
			}
		}
	};
	_.extend = function(destination, source) {
		for (var property in source) {
			if (source[property] && source[property].constructor && source[property].constructor === Object) {
				destination[property] = destination[property] || {};
				arguments.callee(destination[property], source[property]);
			} else {
				destination[property] = source[property];
			}
		}
		return destination;
	};

	var extend_node = {
		each: function(handle) {
			if (this.length != undefined) {
				for (var i = 0, len = this.length; i < len; i++) {
					var item = this.item(i);
					handle(item);
				}
			} else {
				handle(this);
			}
		},
		attr: function(name, value) {
			if (value == undefined && this.length == undefined) {
				return this.getAttribute(name);
			} else {
				this.each(function(item) {
					item.setAttribute(name, value);
				});
			}
		},
		show: function() {
			this.each(function(item) {
				item.css('display', 'block');
			});
		},
		hide: function() {
			this.each(function(item) {
				item.css('display', 'none');
			});
		},
		addClass: function(className) {
			this.each(function(item) {
				item.classList.add(className);
			});
		},
		removeClass: function(className) {
			this.each(function(item) {
				item.classList.remove(className);
			});
		},
		toggleClass: function(className) {
			this.each(function(item) {
				item.classList.contains(className) ? item.classList.remove(className) : item.classList.add(className);
			});
		},
		css: function(name, value) {
			this.each(function(item) {
				if (value != undefined) {
					item.style[name] = value;
				} else {
					for (var key in name) {
						if (name.hasOwnProperty(key)) {
							item.style[key] = name[key];
						}
					}
				}
			});
		},
		html: function(html) {
			if (html != undefined) {
				this.each(function(item) {
					item.innerHTML = html;
				});
			} else {
				return this.innerHTML;
			}
		},
		text: function(text) {
			if (text) {
				this.each(function(item) {
					item.innerHTML = text;
				});
			} else {
				return this.innerHTML;
			}
		},
		remove: function() {
			this.each(function(item) {
				item.parentNode.removeChild(item);
			});
		},
		on: function(type, listener, useCapture) {
			this.each(function(item) {
				item.addEventListener(type, listener, useCapture);
			});
		},
		off: function(type, listener, useCapture) {
			this.each(function(item) {
				item.removeEventListener(type, listener, useCapture);
			});
		},
		destory: function() {
			this.each(function(item) {
				item.__vue__ && item.__vue__.$destroy(true);
			});
		},
		wrap: function(ele) {
			this.each(function(item) {
				var parent = item.parentNode,
					sibling = item.nextSibling;
				ele.appendChild(item);
				sibling ? parent.insertBefore(ele, sibling) : parent.appendChild(ele);
			});
		}
	};
	for (var item in extend_node) {
		Node.prototype[item] = NodeList.prototype[item] = extend_node[item];
	}
	Node.prototype.hasClass = function(className) {
		return this.classList.contains(className);
	};
	Node.prototype.find = function(selector) {
		return this.querySelectorAll(selector);
	};
	Node.prototype.findOne = function(selector) {
		return this.querySelector(selector);
	};
	NodeList.prototype.find = function(selector) {
		return this.length > 0 ? this.item(0).querySelectorAll(selector) : null;
	};
	vue.prototype.ctrl = function(id, obj, parent) {
		obj.el = '#' + id;
		var ctrl = _.extend({}, obj);
		_.win_obj_cache[id] = ctrl;
		obj.parent = ctrl.parent = parent ? parent : this;
		new Vue(obj);
		return this;
	};
	window._ = _;
})(Vue, document, window);