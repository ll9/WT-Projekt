Vue.component('sidebar', {
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
            <a href="/watching" style="color: black;">
                <div class="icon2">
                    <i class="fa fa-eye" aria-hidden="true"></i>
                </div>
            </a>
            <br>
            <a href="/watched" style="color: black;">
                <div class="icon3">
                    <i class="fa fa-check-square-o" aria-hidden="true"></i>
                </div>
            </a>
            <button class="login" style="font-size:40px;" data-onsuccess="onSignIn" data-theme="dark" onclick="onSignIn();">
            <i class="fa fa-sign-in" aria-hidden="true"></i>
            </button>
        </div>
        `
})
