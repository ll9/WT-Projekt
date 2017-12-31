 const Watching = Vue.component('Watching', {
    template: `
    <div>
        <sidebar is-logged-in="true"></sidebar>
        <h2 style="text-align:center">Watchinglist</h2>
        <watchlist :movies="movies"></watchlist>
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