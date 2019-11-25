# vue-sticky-nav

StickyNav会在页面到达导航条位置的时候吸顶，超过父容器高度后恢复

## Demo

[Live demo](http://vue-sticky-nav.surge.sh)

## install

npm/yarn

``` js
 yarn add vue-sticky-nav

```

## Usage

``` javascript

//global
import StickyNav from 'vue-sticky-nav' 
Vue.use(StickyNav)
```
or:

```js
//compontents
import {StickyNav} from 'vue-sticky-nav'  
<div class="parent">
    <StickyNav :options="stickyOptions"/>
    <!--custom contents-->
</div>
```


## Options


``` js
    { 
        navs:['aa','bb','<a>cc</a>'], 
        selectionSelecotr:'sections', 
        showButton:false,
        scrollAnimate:true,
        scrollShow:false,
        disable:false,
        zIndex:1000,
        stickyTop:-1,
        threshold:0,
    }
```



* `navs` :数组、必填项，填写每一项的内容
* `sectionsSelecotr` :导航内容的Class选择器,不需要加上`.` 
* `showButton`: 是否显示全部分类按钮，默认不显示
* `disabled` : 是否禁用吸顶，默认是false
* `scrollAnimate` : 导航滚动是否开启动画，默认是true
* `scrollShow`: 是否滚动到楼层才展示，默认false
* `zIndex` : 层级，默认1000
* `stickyTop`: 吸顶距离顶部的位置，默认-1
* `threshold`: 到达内容之前多少像素则选中 默认0


## methods 

``` js
    <StickyNav :options="stickyOptions" 
                @changed="onchange" 
                @expand="expand"/>
```

``` js
methods:{
    //当前选中值改变时触发
    onchange(index){
        console.log(index);
    },
    //展开状态发生改变时触发，state:ture 展开，false 关闭
    expand(state){
    }
}
```

## HTML Structure 

``` html
    <div class="sticky-nav-container showAll">
         <!--设置了showButton后显示展开按钮-->
        <span class="stickyNav-expand" >
            <span class="icon-arrow"></span>
        </span>
        <div class="all-topbar">请选择分类</div>
        <!-- end-->
        <div class="sticky-nav">
            <ul>
                <li class="sticky-nav-item active"></li>
                <li class="sticky-nav-item"></li>
            </ul>
        </div>
        <!--展开后的-->
        <div class="sticky-nav-expand-panel">
            <ul>
                <li class="sticky-nav-item active"></li>
                <li class="sticky-nav-item"></li>
            </ul>
        </div>
       
    </div>
```
::: Tip

当前选中会添加 `active` 样式

展开全部分类后添加`showAll` 样式

:::