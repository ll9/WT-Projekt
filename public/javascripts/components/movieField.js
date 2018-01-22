const movieField = Vue.component('movie-field', {
    props: ['movie', 'watching', 'watched', 'state'],
    template: `
    <div>
        <div class="main" style="position:relative;">
            <div style="text-align:center;" class="ov_rating">
                <p> {{movie.getRating() }} </p>
            </div>
            <div class="t_main" style="text-align:center;">
                <a target="_blank" :href="movie.getTitleLink()" style="color: white; text-decoration: none;"> {{movie.getTitleYear()}} </a>
            </div>
            <div class="g_main" style="text-align:center;">
                <p> {{movie.getGenres() }} </p>
            </div>
            <div class="d_main" style="text-align:center;">
                <p> {{movie.getDescription()}} </p>
            </div>
            <div class="a_main" style="text-align:center;">
                <template v-for="(actor,index) of movie.getActors()">
                    <a target="_blank" v-bind:href="movie.getActorLink(actor)">
                    {{actor.name}}</a><span v-if="(index+1)!==movie.getActors().length">, </span>
                </template>
            </div>
            <div class="img" style="text-align:center;">
                <img v-bind:src="movie.getImage()" alt="movie image">
            </div>
            <div class="trailer" style="text-align:center;">
                <a v-if="movie.getTrailer()" v-bind:href="movie.getTrailer()" target="_blank">Watch Trailer</a>
                   </div>
        <div v-if="!isWatched" v-on:click="changeList(watching)" v-tooltip.right="watchingMessage" class="add">
            <span class="eye">
                <i class="fa fa-eye" aria-hidden="true" style="font-size:35px;"></i>
            </span>
        </div>
        <div v-if="!isWatching" v-on:click="changeList(watched)" v-tooltip.right="watchedgMessage" class="watched">
            <span class="check">
                <i class="fa fa-check-square-o" aria-hidden="true" style="font-size:35px;"></i>
            </span>
        </div>
            </div>
        <br>
        <br>
    </div>
    `,
    computed: {
        isWatching: function() {
            return this.watching.includes(this.movie.getId());
        },
        isWatched: function() {
            return this.watched.includes(this.movie.getId());
        },
        watchingMessage: function() {
            return this.isWatching ? 'Remove from Watchlist' : 'Add to Watchlist';
        },
        watchedgMessage: function() {
            return this.isWatched ? 'Remove from Watchedlist' : 'Add to Watchedlist';
        }
    },
    methods: {
        changeList: function(list) {
            const listname = (list == this.watching ? 'watchlist' : 'watchedlist');
            if (!this.state.isLoggedIn) {
                this.$notify({
                    group: 'error',
                    type: 'error',
                    text: 'You are not logged in!'
                });
                return;
            }
            if (list.includes(this.movie.getId())) {
                this.removeFromList(list, listname)
            }
            else {
                this.addToList(list, listname)
            }
        },
        addToList: function(list, listname) {
            this.$http.post('/api/' + listname + '/add', {
                movie_id: this.movie.getId()
            }).then(resp => {
                this.$notify({
                    type: 'success',
                    text: 'Added Title to ' + listname
                });
                list.push(this.movie.getId())
            }, error => location = '/auth/google')
        },
        removeFromList: function(list, listname) {
            this.$http.delete('/api/' + listname + '/remove', {
                body: {
                    movie_id: this.movie.getId()
                }
            }).then(resp => {
                this.$notify({
                    type: 'success',
                    text: 'Removed Title from ' + listname
                });
                list.splice(list.indexOf(this.movie.getId()), 1);
            }, error => location = '/auth/google')
        }
    }
})