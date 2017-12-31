const router = new VueRouter({
    routes: [{
        path: '/',
        component: Home
    }, {
        path: '/watching',
        component: Watching
    }]
})


const app = new Vue({
    router
}).$mount('#app')