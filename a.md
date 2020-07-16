## 前言

吸顶导航是营销会场类最常用的组件之一，顾名思义就是导航条会一直停留在页面顶部，方便各个楼层间跳转，虽然组件很常用，，所以只能自己重新开发一个

先看下组件效果

## 功能拆解

先看下组件需要的功能，可以分为主要功能和可配置功能

#### 基础功能

#### 可配置功能
* 支持展开收起
* 默认显示或滑到首层才显示
* 滑动过程中控制隐藏显示
* 选中导航居中显示

## 功能实现

### 导航选中居中

下面是我的一个实现思路：

#### 1. 计算移动的距离

首先我们思考这个功能怎么实现的

#### 2. 处理边界的情况

最后再来处理到达边界，主要有两种，到达最左边和最右边.

1.点击左边的项是M-m,如果大于0，就是到达最左边

2.点击右边的项是m-M,如果大于可滚动的距离（滚动条长度-可视长度），就是到达最右边

实现代码：

```javascript
/*以下代码为了方便理解，略有删减*/

/*
 *  导航切换
 */
watch(){
  translateX(value){
    //滚动条位置修改
    this.scrollView.scrollLeft = Math.abs(value)
  }
},
methods:{
  center(index){
    //当前选中项
    const activeItem = this.$refs.navitem[index];
    //导航条可见的宽度
    const touchWidth  = this.stickyNav.offsetWidth;
    //可滚动宽度 = 整个滚动宽度 - 导航条可见的宽度
    const scrollWidth = this.scrollView.scrollWidth - touchWidth
    //导航条中点 
    const half = (touchWidth - activeItem.offsetWidth) / 2;

    let scrollLeft = half - offsetLeft;

    // 两种边界情况
    scrollLeft > 0 && (scrollLeft = 0);
    scrollLeft < -scrollWidth && (scrollLeft = -scrollWidth);

    this.translateX = scrollLeft;
  }
}
```

### 导航缓动
实现了导航居中后我们再给他加一个缓动的效果，上面已经通过监听滚动的值去修改滚动条scrollLeft改变位置，由于watch
缓动就是当导航切换的时候，有一个动画移动的效果，导航的滚动使用了系统的默认的滚动效果，通过css`overflow-x:scroll`开启，通过js改变`scrollLeft`属性来改变滚动条的位置，这里使用了一个插件[twenjs]()来实现缓动的功能，已知开始和结束的位置，缓动修改这个数值，数值变化更新`scrollLeft`属性，为什么用这个插件呢，体积小，比自己去实现更简洁清晰，一句话就是别人写的比你好。
``` javascript

watch:{
  translateX(star, end) {
    this.tween(star,end)
  }
}
methods:{
    tween(start,end){
        new TWEEN.Tween({
          number: start
        })
        .to({
          number: end
        },
        100)
        .onUpdate(tween => {
          //改变滚动位置
          this.scrollView.scrollLeft = -tween.number;

        })
        .start();
        function animate(){
          if (TWEEN.update()) {
            requestAnimationFrame(animate);
          }
        }
        animate();     
    }
}
 
```
### 滚动过程中的隐藏和显示

当滑动屏幕向下滚动的时候导航条收起，所以我们需要知道当前用户的操作，同样借助于VUE中的watch功能，我们监听当前屏幕滚动的距离`scrollTop`,可以得到一个当前值和过去值，将两个值对比，当前值大于过去值的时候，则表示用户手指是向上滑（屏幕往下滚动）的，反之向下，代码如下：
``` javascript
/*以下代码为了方便理解，略有删减*/

data(){
   //控制导航是否显示隐藏的变量
   scrollHide:false,
   //需要设置一个定时器，当用户一段时间没操作的时候，显示导航条
   scrollTimer:false
   
},
watch:{
 
  scrollTop(newValue, oldValue){
    const delay = 2000
     //向下滚动
    if(newValue > oldvalue){
       //改变属性，控制隐藏显示
      this.scrollHide = true;
      //清除定时器
      clearTimeout(this.scrollTimer);
      this.scrollTimer = null;
    //向上
    }else{
      this.scrollHide = fasle;
    }
    if(!this.scrollTimer){
      this.scrollTimer = setTimeout(()=>{
          this.scrollHide = fasle;
      })
    }
  }
}

```
向下滚动隐藏的功能是实现了，但还有一个问题，就是当点击导航栏的时候页面也是向下滚的，这时候还会触发上面的函数，但这个体验不太好，不是想要的结果，所以还需要优化下，当是点击二是点击触发的屏幕往下滚动不执行隐藏的操作
#### 改进版
``` javascript
/*以下代码为了方便理解，略有删减*/

data(){
   //控制导航是否显示隐藏的变量
   scrollHide:false,
   //需要设置一个定时器，当用户一段时间没操作的时候，显示导航条
   scrollTimer:false,
   //是否点击事件
   isClickScroll: false
},
methods:{
  //点击时触发
  change(index) {
    this.isClickScroll = true;
  }
},
watch:{
  scrollTop(newValue, oldValue){
    if(this.isClickScroll){
      setTimeout(() => {
        this.isClickScroll = false
      }, 10);
    }
    if (this.isClickScroll) return;
    const delay = 2000
    //向下滚动
    if(newValue > oldvalue){
      //改变属性，控制隐藏显示
      this.scrollHide = true;
      //清除定时器
      clearTimeout(this.scrollTimer);
      this.scrollTimer = null;
     //向上
    }else{
      this.scrollHide = fasle;
    }
    if(!this.scrollTimer){
       this.scrollTimer = setTimeout(()=>{
           this.scrollHide = fasle;
           this.isClickScroll = false;
       })
    }
  }
}

```



## 遇到的一些问题

#### 京东APP沉浸式兼容问题

什么是京东APP沉浸式,看下图

[]()

沉浸式就是去掉了首屏的标题栏一种沉浸式的体验，，如果开启了沉浸式，那么首屏标题栏是一个透明的状态，整个页面的高度就会上移，然后当你往下滑动的时候标题栏会出现，这时候导航栏如果吸顶，那么就会有被标题栏挡住的问题，简单说就是原先导航栏的定位需要调整，例如原来定位是top:0，那么需要加上标题栏的高度，不过标题栏的高度是需要异步获取的，所以组件需要可以支持动态调整定位。

首先我们初始化组件会传一个参数来，

``` javascript
<StickyNav :options="options"/>

options:{
  disabled:false,
  stickyTop:0, //距离顶部
  zIndex:1000
}
```
我们是通过stickyTop属性来控制导航栏距离顶部的距离，但是如果异步去修改这个对象的值是没有任何变化的，因为vue中是无法检测到对象的修改，

1.通过watch的deep属性，设置为true可以监听options对象的修改,再重新复制到新对象
```javascript
watch{
  options:{
      handler(value){
        assign(this.stickyOptions,value)
      },
      deep:true
    }
}
```
2.或者把stickyTop单独作为一个prop属性传给组件，


#### 低端机兼容性问题

兼容性问题通常出现在低端手机上，由于我们的测试比较严格，需要兼容到android4.0, android一些第三方浏览器 百度、腾讯、UC等iOS 8

#### 1.ES6兼容


通常我们webpack上已经配置了babel转换，但其实
比如你使用了Promise、Object.assign、includes等静态方法其实都不能被转换的，最简单的方法可以全局引入polyfill

```javascript
npm install babel-polyfill --save
import 'babel-polyfill'
```

或者你的项目中只是用了一两个方法，可以通过引入单个方法的实现，例如引入lodash库的  lodash/includes


#### 2.CSS自动 -webkit- 前缀

很多时候样式兼容问题都是

//在package.json中配置
```
"postcss":{
    "plugins":{
      "autoprefixer":{}
    }
}
"browserslist": [
    "Android >= 4.4",
    "iOS 8"
  ]
```



#### 3.尽量不要使用flex布局

flex布局有某些很老的机型还是支持不是很好，用`inline-block`来代替



## 结束

本文到这里的结束啦，[源码和NPM包点这里](https://www.npmjs.com/package/vue-sticky-nav),以上只是我的个人实现思路，如果你有别的实现方式也可以在底下留言

