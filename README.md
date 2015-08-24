#jQuery cxSlide

cxSlide 是一个简单易用的焦点图展示插件，支持水平、纵向切换，透明过渡切换。

已支持 CSS 动画过渡切换。通过 CSS 动画切换，可以展示更多效果。参考<a target="_blank" href="http://code.ciaoca.com/jquery/cxslide/demo/anime.html">动画 Demo</a>

**版本：**
* jQuery v1.7.2+
* jQuery cxSlide v2.0

**注意事项：**

1. 内部会自动创建切换按钮元素，也可在外部直接创建，若外部已创建，内部将跳过此步骤；
2. 展示图片未超过1张时，会隐藏切换按钮元素。

文档：http://code.ciaoca.com/jquery/cxslide/

示例：http://code.ciaoca.com/jquery/cxslide/demo/

##【使用方法】

###CSS 样式结构
除必要属性设置外，其他样式均可自行设置。
```css
/**
 * cxSlide 基本样式
 * width 和 height 根据需求设置
 */
.cxslide{position:relative;width:600px;height:280px;}
.cxslide .box{}
.cxslide .list{}
.cxslide .list li{}
.cxslide .btn{}
.cxslide .btn li{}
.cxslide .btn li.selected{}
.cxslide .minus{}
.cxslide .plus{}

/* 横向过渡 type: 'x' */
.cxslide .box{overflow:hidden;width:600px;height:280px;}
.cxslide .list{overflow:hidden;width:9999px;}
.cxslide .list li{float:left;position:relative;width:600px;}

/* 纵向过渡 type: 'y' */
.cxslide .box{overflow:hidden;width:600px;height:280px;}
.cxslide .list{overflow:hidden;height:9999px;}

/* 透明过渡 type: 'fade' */
.cxslide .box{overflow:hidden;position:relative;width:600px;height:280px;}
```

###DOM 结构
```html
<!-- 焦点图 --> 
<div id="element_id" class="cxslide">
    <div class="box">
        <ul class="list">
            <li></li>
            <li></li>
            ...
            <li></li>
        </ul>
    </div>

    <!-- 内部自动创建的切换按钮元素 开始 -->
    <ul class="btn">
        <li class="b_1">1</li>
        <li class="b_2">2</li>
        ...
        <li class="b_n">n</li>
    </ul>
    <div class="plus"></div>
    <div class="minus"></div>
    <!-- 内部自动创建的切换按钮元素 结束 -->
</div>
```

###调用方式
```javascript
// 直接调用
$("#element_id").cxSlide();

// 自定义参数调用
$("#element_id").cxSlide({
    events:"click",
    type:"x",
    speed:800,
    time:5000,
    auto:true,
    btn:true,
    plus:false,
    minus:false
});
```

###动画切换
画面进入时 ```<li>``` 添加 ```class="in"```
画面离开时 ```<li>``` 添加 ```class="out"```
可参考<a target="_blank" href="http://code.ciaoca.com/jquery/cxslide/demo/anime.html">动画 Demo</a>

##【options 参数说明】
<table>
    <tr>
        <th width="80">名称</th>
        <th width="120">默认值</th>
        <th>说明</th>
    </tr>
    <tr>
        <td>events</td>
        <td>"click"</td>
        <td>触发按钮事件的方式</td>
    </tr>
    <tr>
        <td>type</td>
        <td>"x"</td>
        <td>过渡效果。可设置为："x", "y", "fade", "toggle", "anime"</td>
    </tr>
    <tr>
        <td>start</td>
        <td>0</td>
        <td>开始展示序号，从 0 开始计算。</td>
    </tr>
    <tr>
        <td>speed</td>
        <td>800</td>
        <td>切换速度(ms)</td>
    </tr>
    <tr>
        <td>time</td>
        <td>5000</td>
        <td>自动轮播间隔时间(ms)</td>
    </tr>
    <tr>
        <td>auto</td>
        <td>true</td>
        <td>是否自动轮播</td>
    </tr>
    <tr>
        <td>btn</td>
        <td>true</td>
        <td>是否使用切换按钮</td>
    </tr>
    <tr>
        <td>plus</td>
        <td>false</td>
        <td>是否使用 plus 按钮</td>
    </tr>
    <tr>
        <td>minus</td>
        <td>false</td>
        <td>是否使用 minus 按钮</td>
    </tr>
</table>

##【API 接口】
<table>
    <tr>
        <th width="80">名称</th>
        <th>说明</th>
    </tr>
    <tr>
        <td>play()</td>
        <td>开始自动播放</td>
    </tr>
    <tr>
        <td>stop()</td>
        <td>停止自动播放</td>
    </tr>
    <tr>
        <td>goto(value)</td>
        <td>跳转到指定的页码</td>
    </tr>
    <tr>
        <td>prev()</td>
        <td>上一页</td>
    </tr>
    <tr>
        <td>next()</td>
        <td>下一页</td>
    </tr>
</table>
