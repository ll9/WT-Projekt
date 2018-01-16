Vue.component('sidebar', {
    props: ['state'],
    template: `
        <div>
            <notifications group="auth" position="bottom left" />
            <notifications group="error" position="bottom left" />
            <div>
                <h1 class="title" style="text-align:center">MyML</h1>
            </div>
            <router-link to="/">
                <div class="icon1">
                    <i class="fa fa-home" aria-hidden="true"></i>
                </div>
            </router-link>
            <br>
            <a v-on:click="redirect('/watching')" style="cursor:pointer;">
                <div class="icon2">
                    <i class="fa fa-eye" aria-hidden="true"></i>
                </div>
            </a>
            <br>
            <a v-on:click="redirect('/watched')" style="cursor:pointer;">
                <div class="icon3">
                    <i class="fa fa-check-square-o" aria-hidden="true"></i>
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
                    group: 'error',
                    type: 'error',
                    text: 'You have to be logged in to do that'
                });
            }
        }
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