Vue.component('sidebar', {
    props: ['isLoggedIn'],
    template: `
        <div>
            <div>
                <h1 class="title" style="text-align:center">MyML</h1>
            </div>
            <router-link to="/">
                <div class="icon1">
                    <i class="fa fa-home" aria-hidden="true"></i>
                </div>
            </router-link>
            <br>
            <router-link to="watching">
                <div class="icon2">
                    <i class="fa fa-eye" aria-hidden="true"></i>
                </div>
            </router-link>
            <br>
            <router-link to="/watched">
                <div class="icon3">
                    <i class="fa fa-check-square-o" aria-hidden="true"></i>
                </div>
            </router-link>
            </a>
            <login v-bind:is-logged-in="isLoggedIn" v-on:success="isLoggedIn=!isLoggedIn"></login>
        </div>
        `,
    methods: {
        redirectIfloggedIn: function(url) {
            if (this.isLoggedIn) {
                window.location = url;
            }
            else 
                alert("You are not logged in");
        }
    }
})