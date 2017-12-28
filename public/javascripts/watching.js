var mv = new Vue({
    el: '#watching',
    data: {
        movies: []
    },
    mounted: function() {
        this.$http.get('/user',
            {headers: {'google_id_token': localStorage.getItem("google_id_token")}})
                .then(resp => {
                    for (movie of resp.body) {
                        this.movies.push(new Movie(movie));
                    }
            })
        console.log("Mounted");
    },

    methods: {

    }
});