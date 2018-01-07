const movieField = Vue.component('movie-field', {
    props: ['movie'],
    template: `
        <div>
            <notifications group="add" position="bottom left" />
            <notifications group="error" position="bottom left" />
            <div class="main" style="position:relative;">
                <div id="overall_rating" style="text-align:center;" class="ov_rating">
                    <p> {{movie.getRating() }} </p>
                </div>
                <div class="t_main" style="text-align:center;">
                    <p> {{movie.getTitleYear()}} </p>
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
                        <img v-bind:src="movie.getImage()">
                    </div>
                    <div class="trailer" style="text-align:center;">
                        <a v-if="movie.getTrailer()" v-bind:href="movie.getTrailer()" target="_blank">Watch Trailer</a>
                    </div>
                </div>
                <!-- <button class="add" v-tooltip="isWatching">Button</button> -->
                <div v-on:click="changeList(watching)" v-tooltip="isWatching" class="add">
                    <span class="eye">
                        <i class="fa fa-eye" aria-hidden="true" style="font-size:35px;"></i>
                    </span>
                </div>
                <div v-on:click="changeList(watched)" v-tooltip="isWatched" class="watched">
                    <span class="check">
                        <i class="fa fa-check-square-o" aria-hidden="true" style="font-size:35px;"></i>
                    </span>
                </div>
                <br>
                <br>
            </div>
        `,
    created: function() {
        if (this.state.isLoggedIn) {
            this.$http.get('/api/user/watching').then(resp => {
                for (movie of resp.body) {
                    this.watching.push(movie.id);
                }
            })
            this.$http.get('/api/user/watched').then(resp => {
                for (movie of resp.body) {
                    this.watched.push(movie.id);
                }
            })
        }
    },
    data: function() {
        return {
            state: Store.state,
            watching: [],
            watched: []
        }
    },
    computed: {
        isWatching: function() {
            return this.watching.includes(this.movie.getId()) ? 'Remove from Watchlist' : 'Add to Watchlist';
        },
        isWatched: function() {
            return this.watched.includes(this.movie.getId()) ? 'Remove from Watchedlist' : 'Add to Watchedlist';
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
            // Remove from Watchlist
            if (list.includes(this.movie.getId())) {
                this.$http.delete('/api/' + listname + '/remove', {
                    body: {
                        movie_id: this.movie.getId()
                    }
                }).then(resp => {
                    this.$notify({
                        group: 'add',
                        type: 'success',
                        text: 'Removed Title from List'
                    });
                    list.splice( list.indexOf(this.movie.getId()), 1);
                })
            }
            // Add to Watchlist
            else {
                this.$http.post('/api/' + listname + '/add', {
                    movie_id: this.movie.getId()
                }).then(resp => {
                    this.$notify({
                        group: 'add',
                        type: 'success',
                        text: 'Added Title to List'
                    });
                    list.push(this.movie.getId())
                })
            }
        }
    }
})