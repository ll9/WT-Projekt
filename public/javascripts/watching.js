 const Watching = Vue.component('Watching', {
    template: `
    <div>
        <sidebar></sidebar>
        <h1 style="text-align:center">Watched Page</h1>
        <p style="text-align:center">
            Insert movies the user put into his list here. Suggestion for Pseudo Code:
        </p>
        <p style="text-align:center">
            &lt;template v-for="movie of movies"&gt;
            <br>
            &lt;watchlist v-bind:movie="movie"&gt;
            &lt;/watchlist&gt;
            <br>
            &lt;/template&gt;
        </p>
        <p style="text-align:center"> The Watchlist tags still needs to be created as a Vue Tag (see movieField.js)
    </div>
    `,
    data: function() {
        return {
            movies: []
        }
    },
    mounted: function() {
        this.$http.get('/user').then(resp => {
            for (movie of resp.body) {
                this.movies.push(new Movie(movie));
            }
        })
    },

    methods: {

    }
});