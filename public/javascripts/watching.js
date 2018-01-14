 const Watching = Vue.component('Watching', {
    template: `
    <div>
        <sidebar :state="state"></sidebar>
        <h2 style="text-align:center">Watchinglist</h2>
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
        this.$http.get('/api/user/watching').then(resp => {
            for (movie of resp.body) {
                this.movies.push(new Movie(movie));
            }
        }, error => location='/auth/google')
    }
});