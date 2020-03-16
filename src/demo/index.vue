<template>
<div id="demo">
    <div
        class="header"
        style="background:#ccc">
        Header
    </div>

    <StickyNav
        class="test"
        :options="stickyOptions"
        @changed="onchange"
        @expand="expand" 
        ref="StickyNav"/>

    <div
        class="section _h1000"
        style="background:#FFCC99">section1</div>
    <div
        class="section _h1000"
        style="background:#FF9999">
        section2
    </div>
    <div
        class="section _h1000"
        style="background:#9966CC">section3</div>

    <div
        class="section _h1000"
        style="background:#99CCCC">section4</div>
    <div
        class="section _h1000"
        style="background:#FF9999">section5</div>

    <div
        class="section _h1000"
        style="background:#005470">section6</div>
     <div class="section _h1000" :style="`background:${randomColor()}`" v-for="(item,i) in addsections" :key="i">{{item}}</div>
    <div
        style="background:#ccc"
        class="footer _h1000">FOOTER</div>
    <div class="demo-control" @click="dynamicsAdd">
      添加一个楼层
    </div>
    <div class="controller">
   
    <div></div>
    </div>
</div>

</template>

<script>
import {
    StickyNav
} from "vue-sticky-nav";
import * as dat from 'dat.gui';
const gui = new dat.GUI();
export default {
    name: "demo",
    components: {
        StickyNav
    },
    data() {
        return {
            stickyOptions: {
                navs: [
                    "年度爆品",
                    "今日优惠",
                    "为您推荐",
                    "nav4",
                    "nav5",
                    "nav6",
                ],
                sectionSelector: "section",
                showButton: true,
                scrollAnimate: true,
                scrollShow: false,
                stickyTop:-1,
                scrollDownHide:true,
                disabled:false,
                title:'请选择分类'
            },
            addsections: [],
           
        };
    },
    methods: {
        onchange(index) {
            console.log(index);
        },
        expand(state) {
            console.log(state);
        },
        dynamicsAdd() {
            let index = this.stickyOptions.navs.length +1;
            this.stickyOptions.navs.push("nav"+index);
            this.addsections.push("sections"+index);
        },
        randomColor() {
            return '#'+Math.random().toString(16).slice(2,8);
        }
    },
    mounted() {
        gui.add(this.stickyOptions,'title')
        gui.add(this.stickyOptions,'scrollShow')
        gui.add(this.stickyOptions,'scrollAnimate')
        gui.add(this.stickyOptions,'scrollDownHide')
        gui.add(this.stickyOptions,'stickyTop').min(-1).step(1)
        gui.add(this.stickyOptions,'disabled')
        
      
    },

};
</script>

<style lang="scss">
div {
    font-family: 'Microsoft Yahei';
}

._h1000 {
    height: 1000px;
}

.footer {
    height: 2000px;
    text-align: center;
    font-size: 50px;
    color: #fff;
    padding-top: 100px;
}

.header {
    height: 500px;
}

.section,
.header,
.notsection {
    width: 100%;
    text-align: center;
    padding-top: 100px;
    font-size: 50px;
    color: #fff;
}

.demo-control {
   
    padding: 30px 20px;
    position: fixed;
    bottom: 50px;
    right: 50px;
    font-size: 20px;
    background: #27AE60;
	font-weight: bold;
	color: white;
	border: 0 none;
	border-radius: 1px;
	cursor: pointer;
	
    input {
        vertical-align: middle;
    }
}
.dg.ac{
    top: 100px;
    
   
}
</style>
