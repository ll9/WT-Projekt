const router = new VueRouter({
    routes: [{
        path: '/',
        component: Home
    }, {
        path: '/watching',
        component: Watching
    }, {
        path: '/watched',
        component: Watched
    }]
})


const app = new Vue({
    router
}).$mount('#app')