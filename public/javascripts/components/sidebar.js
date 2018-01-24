Vue.component('sidebar', {
    props: ['state'],
    template: ` 
        <div>
            <div>
                <h1 class="title" v-on:click="goToHome">MyML</h1>
            </div>
            <router-link to="/">
                <div class="icon1">
                    <i class="fa fa-home" :class="{inactive: !isAtHome}" aria-hidden="true"></i>
                </div>
            </router-link>
            <br>
            <a v-on:click="redirect('/watching')" style="cursor:pointer;">
                <div class="icon2">
                    <i class="fa fa-eye" :class="{inactive: !isAtWatching}" aria-hidden="true"></i>
                </div>
            </a>
            <br>
            <a v-on:click="redirect('/watched')" style="cursor:pointer;">
                <div class="icon3">
                    <i class="fa fa-check-square-o" :class="{inactive: !isAtWatched}" aria-hidden="true"></i>
                </div>
            </a>
            <login :state="state" v-on:success="state.isLoggedIn=!state.isLoggedIn"></login>
        </div>
        `,
    methods: {
        redirect: function(url) {
            if (this.state.isLoggedIn) {
                this.$router.push(url)
            } else {
                this.$notify({
                    type: 'error',
                    text: 'You are not logged in'
                });
            }
        },
        goToHome: function() {
            location = '/'
        }
    },
    computed: {
        isAtHome: function() {
            return this.$route.path === '/';
        },
        isAtWatching: function() {
            return this.$route.path === '/watching';
        },
        isAtWatched: function() {
            return this.$route.path === '/watched';
        },
    },
    watch: {
        state: {
            immediate: true,
            handler: function() {
                if (this.state.changedAuth) {
                    this.state.changedAuth = false;
                    this.$notify({
                        group: 'auth',
                        type: 'success',
                        text: 'You successfully logged ' + (this.state.isLoggedIn ? 'in' : 'out')
                    });
                }
            },
            deep: true
        }
    },
})