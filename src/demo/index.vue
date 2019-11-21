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

    <div
        style="height:3000px;background:#FF9999"
        class="footer">FOOTER</div>
    <div class="demo-control">
        <div>
            <input type="text" placeholder="导航名称"></input><a>确定</a>
        </div>
        <div>
            <input type="checkbox" v-model="stickyOptions.scrollAnimate">scrollAnimate</input>
        </div>
         <div>
            <input type="checkbox" v-model="stickyOptions.showButton">showButton</input>
        </div>
    </div>
</div>
</template>

<script>
import {
    StickyNav
} from "../compontents/vue-stickyNav";
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
                scrollShow: false
            },
            addsections: [],
            addTitle: '',
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
            this.stickyOptions.navs.push("test");
            this.addsections.push("test");
        },
        randomColor() {
            return this.$randomColor();
        }
    },
    mounted() {
        console.log(this.$refs.StickyNav.stickyOptions.scrollAnimate)
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
    background: #fff;
    padding: 20px;
    position: fixed;
    bottom: 50px;
    right: 50px;
    font-size: 20px;
    color: #999;
    input {
        vertical-align: middle;
    }
}
</style>
