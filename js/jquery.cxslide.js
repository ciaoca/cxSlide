/*!
 * cxSlide 1.1
 * http://code.ciaoca.com/
 * https://github.com/ciaoca/cxSlide
 * E-mail: ciaoca@gmail.com
 * Released under the MIT license
 * Date: 2014-12-11
 */
(function(factory){
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    };
}(function($){
	$.cxSlide = function(){
		var obj;
		var settings;
		var callback;
		var slide = {
			dom: {},
			api: {}
		};

		// 检测是否为 DOM 元素
		var isElement = function(o){
			if(o && (typeof HTMLElement === 'function' || typeof HTMLElement === 'object') && o instanceof HTMLElement) {
				return true;
			} else {
				return (o && o.nodeType && o.nodeType === 1) ? true : false;
			};
		};

		// 检测是否为 jQuery 对象
		var isJquery = function(o){
			return (o && o.length && (typeof jQuery === 'function' || typeof jQuery === 'object') && o instanceof jQuery) ? true : false;
		};

		// 分配参数
		for (var i = 0, l = arguments.length; i < l; i++) {
			if (isJquery(arguments[i])) {
				obj = arguments[i];
			} else if (isElement(arguments[i])) {
				obj = $(arguments[i]);
			} else if (typeof arguments[i] === 'function') {
				callback = arguments[i];
			} else if (typeof arguments[i] === 'object') {
				settings = arguments[i];
			};
		};

		if (!obj.length) {return};

		slide.init = function(){
			var _this = this;

			_this.dom.el = obj;
			_this.settings = $.extend({}, $.cxSlide.defaults, settings);

			_this.build();

			_this.api = {
				play: function(){
					_this.settings.auto = true;
					_this.play();
				},
				stop: function(){
					_this.settings.auto = false;
					_this.stop();
				},
				goto: function(){
					_this.goto.apply(_this, arguments);
				},
				prev: function(){
					_this.goto(_this.now - 1);
				},
				next: function(){
					_this.goto();
				}
			};

			if (typeof callback === 'function') {
				callback(_this.api);
			};
		};

		slide.build = function(){
			var _this = this;
			var _html;

			_this.dom.box = _this.dom.el.find('.box');
			_this.dom.list = _this.dom.box.find('.list');
			_this.dom.items = _this.dom.list.find('li');
			_this.itemSum = _this.dom.items.length;

			if (_this.itemSum <= 1) {return};

			_this.dom.numList = _this.dom.el.find('.btn');
			_this.dom.numBtns = _this.dom.numList.find('li');
			_this.dom.plusBtn = _this.dom.el.find('.plus');
			_this.dom.minusBtn = _this.dom.el.find('.minus');
			_this.boxWidth = _this.dom.box.width();
			_this.boxHeight = _this.dom.box.height();
			_this.now = 0;

			// 元素：序号切换按钮
			if (_this.settings.btn && !_this.dom.numList.length) {
				_html = '';
				for (var i = 1; i <= _this.itemSum; i++) {
					_html += '<li class="b_' + i + '">' + i + '</li>';
				};
				_this.dom.numList = $('<ul></ul>',{'class': 'btn', 'html': _html}).appendTo(_this.dom.el);
				_this.dom.numBtns = _this.dom.numList.find('li');
			};

			// 元素：左右切换按钮
			if (_this.settings.plus && !_this.dom.plusBtn.length) {
				_this.dom.plusBtn = $('<div></div>', {'class': 'plus'}).appendTo(_this.dom.el);
			};
			if (_this.settings.minus && !_this.dom.minusBtn.length) {
				_this.dom.minusBtn = $('<div></div>', {'class': 'minus'}).appendTo(_this.dom.el);
			};

			// 事件：鼠标移入停止，移除开始
			_this.dom.box.on('mouseenter', function(){
				_this.stop();
			});
			_this.dom.box.on('mouseleave', function(){
				_this.play();
			});

			// 事件：序号按钮
			if(_this.settings.btn){
				_this.dom.numList.on(_this.settings.events, 'li', function(){
					_this.goto($(this).index());
				});
			};
	
			// 事件：左右切换按钮
			if(_this.settings.minus){
				_this.dom.minusBtn.on(_this.settings.events, function(){
					_this.goto(_this.now - 1);
				});
			};
			if(_this.settings.plus){
				_this.dom.plusBtn.on(_this.settings.events, function(){
					_this.goto();
				});
			};

			_this.goto(_this.settings.start);
		};

		// 方法：开始
		slide.play = function(){
			var _this = this;

			if (!_this.settings.auto) {return};
			_this.stop();

			_this.run = setTimeout(function(){
				_this.goto();
			}, _this.settings.time);
		};

		// 方法：停止
		slide.stop = function(){
			if (typeof(this.run) !== 'undefined') {
				clearTimeout(this.run);
			};
		};

		// 方法：轮换过程
		slide.goto = function(n){
			var _this = this;
			var _next = typeof(n) === 'undefined' ? _this.now + 1 : parseInt(n, 10);
			var _now = _this.now;
			var _max = _this.itemSum - 1;

			if (_next > _max) {
				_next = 0;
			} else if (_next < 0) {
				_next = _max;
			};

			if (_this.dom.numList.length) {
				_this.dom.numBtns.removeClass('selected').eq(_next).addClass('selected');
			};

			_this.stop();
			if (_next === _now) {
				_this.play();
				return;
			};

			var _moveVal;

			switch (_this.settings.type) {
				// 水平滚动
				case 'x':
					_moveVal = _this.boxWidth * _next;

					if (_next === 0 && _now === _max) {
						_this.dom.items.eq(0).css({
							'left': _this.boxWidth * _this.itemSum
						});
						_moveVal = _this.boxWidth * _this.itemSum;

					} else if (_now === 0) {
						_this.dom.items.eq(0).css({
							'left': ''
						});
						_this.dom.box.scrollLeft(0);
					};

					_this.dom.box.stop(true, false).animate({
						'scrollLeft': _moveVal
					}, _this.settings.speed);
					break;

				// 垂直滚动
				case 'y':
					_moveVal = _this.boxHeight * _next;

					if (_next === 0 && _now === _max) {
						_this.dom.items.eq(0).css({
							'top': _this.boxHeight * _this.itemSum
						});
						_moveVal = _this.boxHeight * _this.itemSum;

					} else if(_now === 0) {
						_this.dom.items.eq(0).css({
							'top': ''
						});
						_this.dom.box.scrollTop(0);
					};

					_this.dom.box.stop(true, false).animate({
						'scrollTop': _moveVal
					}, _this.settings.speed);
					break;

				// 透明过渡
				case 'fade':
					_this.dom.items.css({
						'display': 'none',
						'position': 'absolute',
						'top': 0,
						'left': 0,
						'zIndex': ''
					});
					_this.dom.items.eq(_now).css({
						'display': '',
						'zIndex': 1
					});
					_this.dom.items.eq(_next).css({
						'zIndex': 2
					}).fadeIn(_this.settings.speed);
					break;

				// 直接切换
				case 'toggle':
					_this.dom.items.hide().eq(_next).show();
					break;
			};

			_this.now = _next;
			_this.dom.box.queue(function(){
				_this.play();
				_this.dom.box.dequeue();
			});
		};
		
		slide.init();
	};
	
	// 默认值
	$.cxSlide.defaults = {
		events: 'click',	// 按钮事件
		type: 'x',			// 过渡效果
		start: 0,			// 开始展示序号
		speed: 800,			// 切换速度
		time: 5000,			// 自动轮换间隔时间
		auto: true,			// 是否自动轮播
		btn: true,			// 是否使用数字按钮
		plus: false,		// 是否使用 plus 按钮
		minus: false		// 是否使用 minus 按钮
	};

	$.fn.cxSlide = function(settings, callback){
		this.each(function(i){
			$.cxSlide(this, settings, callback);
		});
		return this;
	};
}));