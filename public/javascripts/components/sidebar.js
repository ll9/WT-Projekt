Vue.component('sidebar', {
    props: ['isLoggedIn'],
    template: `
        <div>
            <div>
                <h1 class="title" style="text-align:center">MyML</h1>
            </div>
            <a href="/" style="color: black;">
                <div class="icon1">
                    <i class="fa fa-home" aria-hidden="true"></i>
                </div>
            </a>
            <br>
            <a @click="redirectIfloggedIn('/watching')" style="color: black; cursor: pointer;">
                <div class="icon2">
                    <i class="fa fa-eye" aria-hidden="true"></i>
                </div>
            </a>
            <br>
            <a @click="redirectIfloggedIn('/watched')" style="color: black; cursor: pointer;">
                <div class="icon3">
                    <i class="fa fa-check-square-o" aria-hidden="true"></i>
                </div>
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