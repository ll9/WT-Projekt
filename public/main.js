const router = new VueRouter({
    mode: 'history',
    routes: [{
        path: '/',
        component: Home
    }, {
        path: '/watching',
        component: Watching
    }, {
        path: '/watched',
        component: Watched
    }, {
        path: '/404',
        component: NotFound
    }, {
        path: '*',
        redirect: '/404'
    }, ]
})


const app = new Vue({
    el: '#app',
    router
});