Vue.component('login', {
    props: ['isLoggedIn'],
    template: `
  <div class="login-component">
    <g-signin-button v-if="!isLoggedIn"
      :params="googleSignInParams"
      @success="onSignInSuccess"
      @error="onSignInError">
      Sign in with Google
    </g-signin-button>

    <a v-if="isLoggedIn" href="#" @click="signOut">Sign out</a>
  </div>
  `,
    data() {
        return {
            /**
             * The Auth2 parameters, as seen on
             * https://developers.google.com/identity/sign-in/web/reference#gapiauth2initparams.
             * As the very least, a valid client_id must present.
             * @type {Object}
             */
            googleSignInParams: {
                client_id: '521445391748-2usgjdl33k9k8beh2jkga4lglohkgeee.apps.googleusercontent.com'
            }
        }
    },
    methods: {
        signOut: function() {
            console.log("OK");
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function() {
                console.log('User signed out.');
            });
            this.$emit('success')
            localStorage.removeItem("google_id_token");
        },
        onSignInSuccess(googleUser) {
            // `googleUser` is the GoogleUser object that represents the just-signed-in user. 
            // See https://developers.google.com/identity/sign-in/web/reference#users 
            const profile = googleUser.getBasicProfile() // etc etc 
            console.log(profile.getId());
            //localStorage.setItem("google_login_id", profile.getId);
            var id_token = googleUser.getAuthResponse().id_token;

            this.$http.post('/tokensignin', {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'google_id_token=' + id_token
            }).then(resp => {
                    this.$emit('success')
                    localStorage.setItem("google_id_token", id_token);
                },
                error => console.log(error)
            )
        },
        onSignInError(error) {
            // `error` contains any error occurred. 
            console.log('OH NOES', error)
        }
    }
});