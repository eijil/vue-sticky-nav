import StickyNav from './vue-sticky-nav.vue';

function install(Vue){
    Vue.component('StickyNav', StickyNav);
}
export default install;
export {
    StickyNav
};
/**
 * Auto install
 */
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(install)
}