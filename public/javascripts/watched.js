 const Watched = Vue.component('Watched', {
    template: `
    <div>
        <h2 style="text-align:center">Watchedlist</h2>
        <watchlist :movies="movies"></watchlist>
    </div>
    `,
    data: function() {
        return {
            movies: [],
            state: Store.state
        }
    },
    mounted: function() {
        this.$http.get('/api/user/watched').then(resp => {
            for (movie of resp.body) {
                this.movies.push(new Movie(movie));
            }
        }, error => location='/auth/google')
    }
});