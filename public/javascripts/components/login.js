const test = Vue.component('login', {
    data: function() {
        return {
            state: Store.state
        }
    },
    template: `
  <div class="login-component">
    <a v-if="state.isLoggedIn==null? false: !state.isLoggedIn" class="login" href="/auth/google" style="font-size:40px;">
      <i class="fa fa-sign-in" aria-hidden="true"></i>
    </a>
    <a v-if="state.isLoggedIn==null? false: state.isLoggedIn" class="login" href="/auth/logout" style="font-size:40px;">
      <i class="fa fa-sign-out" aria-hidden="true"></i>
    </a>
  </div>
  `,
});