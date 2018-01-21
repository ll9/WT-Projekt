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
    template: `
        <div>
            <notifications classes="my-style" position="bottom left" />
            <sidebar :state="state"></sidebar>
            <router-view>
            </router-view>
        </div>
    `,
    data: {
        state: Store.state
    },
    created: function() {
        // check if user is logged in
        this.$http.get('/auth/sessionStatus').then(resp => {
            this.state.isLoggedIn = resp.body.isLoggedIn;
            this.state.changedAuth = resp.body.changedAuth;
        })
    },
    router
});