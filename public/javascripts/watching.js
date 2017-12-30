var mv = new Vue({
    el: '#watching',
    data: {
        movies: []
    },
    mounted: function() {
        this.$http.get('/user').then(resp => {
            for (movie of resp.body) {
                this.movies.push(new Movie(movie));
            }
        })
        console.log("Mounted");
    },

    methods: {

    }
});