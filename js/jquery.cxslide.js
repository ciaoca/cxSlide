/*!
 * cxColor 1.0
 * date: 2012-12-12
 * https://github.com/ciaoca/cxSlide
 * (c) 2012 Ciaoca, http://ciaoca.com/
 */
(function($){
	$.fn.cxSlide=function(settings){
		if(!this.length){return;};
		settings=$.extend({},$.cxSlide.defaults,settings);

		var obj=this;
		var slide={};
		slide.fn={};

		var _html;

		slide.box=obj.find(".box");
		slide.list=slide.box.find(".list");
		slide.items=slide.list.find("li");
		slide.itemSum=slide.items.length;

		if(slide.itemSum<=1){return;};

		slide.numList=obj.find(".btn");
		slide.numBtns=slide.numList.find("li");
		slide.plusBtn=obj.find(".plus");
		slide.minusBtn=obj.find(".minus");
		slide.boxWidth=slide.box.width();
		slide.boxHeight=slide.box.height();
		slide.s=0;

		// 元素：序号切换按钮
		if(settings.btn&&!slide.numList.length){
			_html="";
			for(var i=1;i<=slide.itemSum;i++){
				_html+="<li class='b_"+i+"'>"+i+"</li>";
			};
			slide.numList=$("<ul></ul>",{"class":"btn","html":_html}).appendTo(obj);
			slide.numBtns=slide.numList.find("li");
		};

		// 元素：左右切换按钮
		if(settings.plus&&!slide.plusBtn.length){
			slide.plusBtn=$("<div></div>",{"class":"plus"}).appendTo(obj);
		};
		if(settings.minus&&!slide.minusBtn.length){
			slide.minusBtn=$("<div></div>",{"class":"minus"}).appendTo(obj);
		};

		// 方法：开始
		slide.fn.on=function(){
			if(!settings.auto){return;}
			slide.fn.off();

			slide.run=setTimeout(function(){
				slide.fn.goto();
			},settings.time);
		};

		// 方法：停止
		slide.fn.off=function(){
			if(typeof(slide.run)!=="undefined"){clearTimeout(slide.run);};
		};

		// 方法：选中序号
		slide.fn.checkBtn=function(n){
			if(slide.numList.length){
				slide.numBtns.eq(n).addClass("selected").siblings("li").removeClass("selected");
			};
		};

		// 方法：轮换过程
		slide.fn.goto=function(n){
			slide.fn.off();
			var _next=(typeof(n)=="undefined") ? slide.s+1 : parseInt(n,10);
			var _now=slide.s;
			var _max=slide.itemSum-1;

			if(_next==slide.s){
				slide.fn.on();
				return;
			};

			if(_next>_max){
				_next=0;
			}else if(_next<0){
				_next=_max;
			};
			slide.fn.checkBtn(_next);

			var _moveVal;
			switch(settings.type){
				// 水平滚动
				case "x":
					_moveVal=slide.boxWidth*_next;
					if(_next==0&&_now==_max){
						slide.items.eq(0).css({"left":slide.boxWidth*slide.itemSum});
						_moveVal=slide.boxWidth*slide.itemSum;
					}else if(_now==0){
						slide.items.eq(0).css({"left":""});
						slide.box.scrollLeft(0);
					};
					slide.box.stop(true,false).animate({"scrollLeft":(_moveVal)},settings.speed);
					break;

				// 垂直滚动
				case "y":
					_moveVal=slide.boxHeight*_next;
					if(_next==0&&_now==_max){
						slide.items.eq(0).css({"top":slide.boxHeight*slide.itemSum});
						_moveVal=slide.boxHeight*slide.itemSum;
					}else if(_now==0){
						slide.items.eq(0).css({"top":""});
						slide.box.scrollTop(0);
					};
					slide.box.stop(true,false).animate({"scrollTop":(_moveVal)},settings.speed);
					break;

				// 透明过渡
				case "fade":
					slide.items.css({"display":"none","position":"absolute","top":0,"left":0,"zIndex":""});
					slide.items.eq(_now).css({"display":"","zIndex":1});
					slide.items.eq(_next).css({"zIndex":2}).fadeIn(settings.speed);
					break;

				// 直接切换
				case "toggle":
					slide.items.eq(_next).show().siblings("li").hide();
					break;
			};

			slide.s=_next;
			slide.box.queue(function(){
				slide.fn.on();
				slide.box.dequeue();
			});
		};

		// 事件：鼠标移入停止，移除开始
		slide.box.hover(function(){
			slide.fn.off();
		},function(){
			slide.fn.on();
		});

		// 事件：序号按钮
		if(settings.btn){
			slide.numList.delegate("li",settings.events,function(){
				slide.fn.goto(slide.numBtns.index($(this)));
			});
		};

		// 事件：增（右）按钮
		if(settings.plus){
			slide.plusBtn.bind(settings.events,function(){
				slide.fn.goto();
			});
		};

		// 事件：减（左）按钮
		if(settings.minus){
			slide.minusBtn.bind(settings.events,function(){
				slide.fn.goto(slide.s-1);
			});
		};

		slide.fn.checkBtn(settings.start);
		slide.fn.goto(settings.start);
	};
	
	// 默认值
	$.cxSlide={defaults:{
		events:"click",	// 按钮事件
		type:"x",		// 轮换类型
		start:0,		// 首次展示序号
		speed:800,		// 切换速度
		time:5000,		// 自动轮换间隔时间
		auto:true,		// 是否自动轮播
		btn:true,		// 是否使用数字按钮
		plus:false,		// 是否使用 plus 按钮
		minus:false		// 是否使用 minus 按钮
	}};
})(jQuery);