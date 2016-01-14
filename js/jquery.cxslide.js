/*!
 * cxSlide 2.0.2
 * http://code.ciaoca.com/
 * https://github.com/ciaoca/cxSlide
 * E-mail: ciaoca@gmail.com
 * Released under the MIT license
 * Date: 2016-01-14
 */
(function(factory){
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(jQuery);
  };
}(function($){
  $.cxSlide = function(){
    var cxSlide = {
      dom: {},
      api: {}
    };

    cxSlide.init = function(){
      var self = this;
      var _settings;
      var _callback;

      // 检测是否为 DOM 元素
      var _isElement = function(o){
        if(o && (typeof HTMLElement === 'function' || typeof HTMLElement === 'object') && o instanceof HTMLElement) {
          return true;
        } else {
          return (o && o.nodeType && o.nodeType === 1) ? true : false;
        };
      };

      // 检测是否为 jQuery 对象
      var _isJquery = function(o){
        return (o && o.length && (typeof jQuery === 'function' || typeof jQuery === 'object') && o instanceof jQuery) ? true : false;
      };

      // 分配参数
      for (var i = 0, l = arguments.length; i < l; i++) {
        if (_isJquery(arguments[i])) {
          self.dom.el = arguments[i];
        } else if (_isElement(arguments[i])) {
          self.dom.el = $(arguments[i]);
        } else if (typeof arguments[i] === 'function') {
          _callback = arguments[i];
        } else if (typeof arguments[i] === 'object') {
          _settings = arguments[i];
        };
      };

      if (!self.dom.el.length) {return};

      self.settings = $.extend({}, $.cxSlide.defaults, _settings);

      self.build();

      self.api = {
        play: function(){
          self.settings.auto = true;
          self.play();
        },
        stop: function(){
          self.settings.auto = false;
          self.stop();
        },
        goto: function(){
          self.goto.apply(self, arguments);
        },
        prev: function(){
          self.goto(self.now - 1);
        },
        next: function(){
          self.goto();
        }
      };

      if (typeof _callback === 'function') {
        _callback(self.api);
      };
    };

    cxSlide.build = function(){
      var self = this;
      var _html;

      self.dom.box = self.dom.el.find('.box');
      self.dom.list = self.dom.box.find('.list');
      self.dom.items = self.dom.list.find('li');
      self.itemSum = self.dom.items.length;
      self.baseClass = self.dom.el.attr('class');

      if (self.itemSum <= 1) {return};

      self.dom.numList = self.dom.el.find('.btn');
      self.dom.numBtns = self.dom.numList.find('li');
      self.dom.plusBtn = self.dom.el.find('.plus');
      self.dom.minusBtn = self.dom.el.find('.minus');
      self.boxWidth = self.dom.box.width();
      self.boxHeight = self.dom.box.height();
      self.now = 0;

      // 元素：序号切换按钮
      if (self.settings.btn && !self.dom.numList.length) {
        _html = '';
        for (var i = 1; i <= self.itemSum; i++) {
          _html += '<li class="b_' + i + '">' + i + '</li>';
        };
        self.dom.numList = $('<ul></ul>',{'class': 'btn', 'html': _html}).appendTo(self.dom.el);
        self.dom.numBtns = self.dom.numList.find('li');
      };

      // 元素：左右切换按钮
      if (self.settings.plus && !self.dom.plusBtn.length) {
        self.dom.plusBtn = $('<div></div>', {'class': 'plus'}).appendTo(self.dom.el);
      };
      if (self.settings.minus && !self.dom.minusBtn.length) {
        self.dom.minusBtn = $('<div></div>', {'class': 'minus'}).appendTo(self.dom.el);
      };

      // 事件：鼠标移入停止，移除开始
      if (self.settings.hoverLock) {
        self.dom.box.on('mouseenter', function(){
          self.stop();
        });
        self.dom.box.on('mouseleave', function(){
          self.play();
        });
      };

      // 事件：序号按钮
      if(self.settings.btn){
        self.dom.numList.on(self.settings.events, 'li', function(){
          self.goto($(this).index());
        });
      };
  
      // 事件：左右切换按钮
      if(self.settings.minus){
        self.dom.minusBtn.on(self.settings.events, function(){
          self.goto(self.now - 1);
        });
      };
      if(self.settings.plus){
        self.dom.plusBtn.on(self.settings.events, function(){
          self.goto();
        });
      };

      self.goto(self.settings.start);
    };

    // 方法：开始
    cxSlide.play = function(){
      var self = this;

      if (!self.settings.auto) {return};
      self.stop();

      self.run = setTimeout(function(){
        self.goto();
      }, self.settings.time);
    };

    // 方法：停止
    cxSlide.stop = function(){
      if (typeof(this.run) !== 'undefined') {
        clearTimeout(this.run);
      };
    };

    // 方法：轮换过程
    cxSlide.goto = function(n){
      var self = this;
      var _next = typeof(n) === 'undefined' ? self.now + 1 : parseInt(n, 10);
      var _now = self.now;
      var _max = self.itemSum - 1;
      var _moveVal;

      if (_next > _max) {
        _next = 0;
      } else if (_next < 0) {
        _next = _max;
      };

      if (self.dom.numList.length) {
        self.dom.numBtns.removeClass('in out selected');
      };

      self.stop();
      self.dom.el.attr('class', self.baseClass + ' to_' + _next);

      if (_now === _next) {
        self.dom.numBtns.eq(_next).addClass('in selected');
        self.dom.items.eq(_next).addClass('in');
        self.play();
        return;
      };

      self.dom.numBtns.eq(_now).addClass('out').end().eq(_next).addClass('in selected');
      self.dom.items.removeClass('in out').eq(_now).addClass('out').end().eq(_next).addClass('in');

      switch (self.settings.type) {
        // CSS 动画
        // 在此之前已经处理完 anime 的 class，且其他类型也可集合动画使用，此处目前无须特别处理
        // case 'anime':
          // break

        // 透明过渡
        case 'fade':
          self.dom.items.css({
            'display': 'none',
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'zIndex': ''
          });
          self.dom.items.eq(_now).css({
            'display': '',
            'zIndex': 1
          });
          self.dom.items.eq(_next).css({
            'zIndex': 2
          }).fadeIn(self.settings.speed);
          break

        // 直接切换
        case 'toggle':
          self.dom.items.hide().eq(_next).show();
          break

        // 水平滚动
        case 'x':
          _moveVal = self.boxWidth * _next;

          if (_next === 0 && _now === _max) {
            self.dom.items.eq(0).css({
              'left': self.boxWidth * self.itemSum
            });
            _moveVal = self.boxWidth * self.itemSum;

          } else if (_now === 0) {
            self.dom.items.eq(0).css({
              'left': ''
            });
            self.dom.box.scrollLeft(0);
          };

          self.dom.box.stop(true, false).animate({
            'scrollLeft': _moveVal
          }, self.settings.speed);
          break

        // 垂直滚动
        case 'y':
          _moveVal = self.boxHeight * _next;

          if (_next === 0 && _now === _max) {
            self.dom.items.eq(0).css({
              'top': self.boxHeight * self.itemSum
            });
            _moveVal = self.boxHeight * self.itemSum;

          } else if(_now === 0) {
            self.dom.items.eq(0).css({
              'top': ''
            });
            self.dom.box.scrollTop(0);
          };

          self.dom.box.stop(true, false).animate({
            'scrollTop': _moveVal
          }, self.settings.speed);
          break

        // not default
      };

      self.now = _next;
      self.dom.box.queue(function(){
        self.play();
        self.dom.box.dequeue();
      });
    };
    
    cxSlide.init.apply(cxSlide, arguments);

    return this;
  };
  
  // 默认值
  $.cxSlide.defaults = {
    events: 'click',  // 按钮事件
    type: 'x',        // 过渡效果
    start: 0,         // 开始展示序号
    speed: 800,       // 切换速度
    time: 5000,       // 自动轮换间隔时间
    auto: true,       // 是否自动轮播
    hoverLock: true,  // 鼠标移入移出锁定
    btn: true,        // 是否使用数字按钮
    plus: false,      // 是否使用 plus 按钮
    minus: false      // 是否使用 minus 按钮
  };

  $.fn.cxSlide = function(settings, callback){
    this.each(function(i){
      $.cxSlide(this, settings, callback);
    });
    return this;
  };
}));