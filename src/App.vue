<template>
  <div id="app">
     <div @click="dynamicsAdd" class="btn-dyanmics">动态添加导航</div>
        <StickyNav class="test" :options="stickyOptions" @changed="onchange" @expand="expand" />
     
        <div class="section _h1000" style="background:#FFCC99">section2</div>
        <div class="section _h1000"  style="background:#FF9999">
        
        <!-- <Seckill v-if="composite.seckill" 
            :data="composite.seckill"
            :options="seckillOptions"
            :index="1"
        >
       
        </Seckill> -->
        
        </div>
        <div class="section _h1000" style="background:#fff">section</div>
      
        <div class="section _h1000" style="background:#99CCCC">
            
        </div>
        <div class="section _h1000" style="background:#FF9999">section5</div>
        <div class="section _h1000" ></div>
        <div class="section _h1000" style="background:#99CCCC">section7</div>
        
        <div style="height:3000px;background:#FF9999"></div>
  </div>
</template>

<script>
import {StickyNav} from './compontents/vue-stickyNav'
export default {
  name: 'app',
   components:{
    StickyNav
   },
   data() {
    return {
     
      stickyOptions: {
        navs: [
          '年度爆品',
          "今日优惠",
          "为您推荐",
          "nav4",
          "nav5",
          "nav6",
          "nav7"
        ],
        sectionSelector: "section",
        showButton: true,
        scrollAnimate:true,
        scrollShow:false,
      },
      addsections:[],
     
    };
  },
  methods: {
    onchange(index) {
      //console.log(index);
    },
    expand(state) {
      console.log(state);
    },
    dynamicsAdd(){
      this.stickyOptions.navs.push('test')
      this.addsections.push('test')
    }
  },
 
}
</script>

<style lang="scss">
#app {
 
  width: 750px;
}

._h1000 {
  height: 1000px;
}


.section,
.notsection {
  width: 100%;
  text-align: center;
}
</style>
