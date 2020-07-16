<template>
  <div
    class="sticky-nav-container"
    :style="stickyOptions.scrollShow?'height:0':''"
    :class="[{
      'hide-stickynav':(stickyOptions.scrollShow && !visable),
      'hide-up':scrollHide}]"
  >
    <div
      :class="{'sticky-nav-fixed':sticky && !options.disabled}"
      :style="`top:${stickyOptions.stickyTop}px;z-index:${stickyOptions.zIndex};`"
    >
      <span
        v-if="stickyOptions.showButton"
        class="stickyNav-expand"
        ref="showAllButton"
        @click="expand"
      >
        <span class="sticky-nav-arrow" :class="{'expand':isShowAll}"></span>
      </span>
      <div v-if="isShowAll" class="sticky-nav-expand-topbar">{{stickyOptions.title}}</div>
      <div class="sticky-nav" ref="stickyNav">
        <div class="scroll-view" ref="scollView">
          <ul class="sticky-nav-ul">
            <li
              class="sticky-nav-item"
              v-for="(nav,i) in navs"
              :key="i"
              :class="{ 'active': activeIndex == i }"
              ref="navitem"
              :index="i"
              v-html="nav"
              @click="change(i)"
            ></li>
          </ul>
        </div>
      </div>
      <div class="sticky-nav-expand-panel" v-show="isShowAll">
        <ul class="sticky-nav-ul">
          <li
            class="sticky-nav-item"
            v-for="(nav,i) in navs"
            :key="i"
            :class="{ 'active': activeIndex == i }"
            v-html="nav"
            @click="change(i)"
          ></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import assign from 'lodash/assign';
import throttle from 'lodash/throttle';
import TWEEN from "@tweenjs/tween.js";
const DEFAULT_OPTIONS = {
  zIndex: 1001,
  stickyTop: 0,
  threshold: 0,
  disabled: false,
  //是否显示展开按钮
  showButton: false,
  //导航滚动是否使用动画
  scrollAnimate: true,
  //是否滚动到楼层才展示，默认false
  scrollShow: false,
  //向下滚不显示
  scrollDownHide: false,
  title: "请选择分类"
};
export default {
  data() {
    return {
      navs: [],
      activeIndex: 0,
      isShowAll: false,
      translateX: 0,
      visable: false,
      sticky: false,
      stickyOptions: {},
      scrollTop: 0,
      scrollHide: false, //滚动是否隐藏
      scrollTimer: null, //滚动隐藏定时器,
      isClickScroll: false
    };
  },
  props: {
    options: {
      type: Object
    },
  
  },
  created() {
    this.stickyOptions = assign({}, DEFAULT_OPTIONS, this.options);
    this.navs = this.stickyOptions.navs;
  },
  watch: {
    options:{
      handler(value){
        assign(this.stickyOptions,value)
      },
      deep:true
    },
    translateX(newValue, oldValue) {
      if (this.stickyOptions.scrollAnimate) {
        this.tween(oldValue, newValue);
      } else {
        this.scrollView.scrollLeft = -newValue;
      }
      //
    },
    activeIndex(value, oldValue) {
      setTimeout(() => {
        this.center(value);
      }, 0);
      this.$emit("changed", value);
    },
    scrollTop(value, oldValue) {
      if (this.stickyOptions.scrollDownHide) {
        if(this.isClickScroll){
          setTimeout(() => {
            this.isClickScroll = false
          }, 10);
        }
        if (this.isClickScroll) return;
        const navshowDelay = 2000;
        const start = this.activeIndex > 0; //滑过楼层1才生效
        //down
        if (value > oldValue && start) {
          this.scrollHide = true;
          clearTimeout(this.scrollTimer);
          this.scrollTimer = null;
        } else {
          this.scrollHide = false;
        }
        if (!this.scrollTimer) {
          this.scrollTimer = setTimeout(() => {
            this.scrollHide = false;
            this.isClickScroll = false;
          }, navshowDelay);
        }
      }
    },
    scrollHide(state) {
      this.$emit("navState", state);
    },
    isShowAll(state) {
      this.$emit("expand", state);
      let $overlay = this.getOverlay();
      if ($overlay) {
        $overlay.style.display = state ? "block" : "none";
      }
    }
  },
  computed: {
    sections() {
      if (this.stickyOptions.sectionSelector) {
        return document.getElementsByClassName(
          this.stickyOptions.sectionSelector
        );
      }
    },
    stickyNav() {
      return this.$refs.stickyNav;
    },
    scrollView() {
      return this.$refs.scollView;
    },
    buttonWidth() {
      return this.$refs.showAllButton.offsetWidth + "px";
    }
  },
  mounted() {
    this.stickyOptions.threshold =
      this.stickyOptions.threshold +
      this.stickyNav.offsetHeight +
      this.stickyOptions.stickyTop;

    window.addEventListener("scroll", throttle(this.scrollHandle, 100));

    if (this.stickyOptions.showButton) {
      this.insertOverlay();
      this.stickyNav.style.paddingRight = this.buttonWidth;
    }
  },
  methods: {
    /* click event */
    change(index) {
      this.isShowAll = false;
      this.scrollTo(index);
      this.$emit("click", index);
      this.isClickScroll = true;
    },
    //导航条动画
    tween(startValue, endValue) {
      function animate() {
        if (TWEEN.update()) {
          requestAnimationFrame(animate);
        }
      }
      new TWEEN.Tween({
        number: startValue
      })
        .to(
          {
            number: endValue
          },
          100
        )
        .onUpdate(tween => {
          this.scrollView.scrollLeft = -tween.number;
        })
        .start();
      animate();
    },
    scrollTo(index) {
      const scrollTop = this.getScrollTopElement(this.sections[index]);
      window.scrollTo(0, scrollTop - this.stickyOptions.threshold);
    },
    getScrollTopElement($element) {
      var top = 0;
      while (
        $element.offsetParent !== undefined &&
        $element.offsetParent != null
      ) {
        top +=
          $element.offsetTop +
          ($element.clientTop != null ? $element.clientTop : 0);
        $element = $element.offsetParent;
      }

      return top;
    },
    scrollHandle() {
      if(this.stickyOptions.disabled){
        return
      }
      let scrollTop = (this.scrollTop = window.scrollY);

      const navOffsetTop = this.getScrollTopElement(this.$el);
      //是否滚动到楼层才显示导航

      if (this.stickyOptions.scrollShow) {
        if (scrollTop >= navOffsetTop) {
          this.visable = true;
        } else {
          this.visable = false;
        }
      }
      if (this.sections.length) {
        if (scrollTop < navOffsetTop) {
          this.activeIndex = 0;
        }
        //超过最后一个停止吸顶
        let lastSection = this.sections[this.sections.length - 1];
        if (
          scrollTop >
            this.getScrollTopElement(lastSection) + lastSection.offsetHeight ||
          scrollTop < navOffsetTop
        ) {
          this.sticky = false;
        } else {
          this.sticky = true;
        }
      }
      for (let i = 0; i < this.sections.length; i++) {
        let section = this.sections[i];
        let offsetTop = this.getScrollTopElement(section);
        if (
          offsetTop - this.stickyOptions.threshold <= scrollTop &&
          offsetTop + section.offsetHeight > scrollTop
        ) {
          this.activeIndex = i;
        }
      }
    },
    //导航栏移动
    center(index) {
      const activeItem = this.$refs.navitem[index];
      const offsetLeft = activeItem.offsetLeft;
      const offsetWidth = activeItem.offsetWidth;
      const touchWidth = this.stickyNav.offsetWidth;
      const buttonWidth = this.stickyOptions.showButton ? this.buttonWidth : 0;
      const scrollWidth =
        this.scrollView.scrollWidth - this.stickyNav.offsetWidth + buttonWidth;
      if (scrollWidth == 0) {
        return;
      }
      const half = (touchWidth - offsetWidth) / 2;
      
      let scrollLeft = half - offsetLeft ;
      
      // 两种边界情况
      scrollLeft > 0 && (scrollLeft = 0);
      scrollLeft < -scrollWidth && (scrollLeft = -scrollWidth);
      
      this.translateX = scrollLeft;
     
    },
    
    //展开分类
    expand() {
      this.isShowAll = this.isShowAll ? false : true;
    },
    //createOverloay
    insertOverlay() {
      if (!this.getOverlay()) {
        var div = document.createElement("div");
        div.className = "stickyNav-overlay";
        div.addEventListener("touchstart", () => {
          div.style.display = "none";
          this.isShowAll = false;
        });
        div.addEventListener("click", () => {
          div.style.display = "none";
          this.isShowAll = false;
        });
        document.body.appendChild(div);
      }
    },
    getOverlay() {
      return document.getElementsByClassName("stickyNav-overlay")[0];
    }
  }
};
</script>

<style lang="scss">
@import "./css/default.scss";
</style>

