Vue.component('watchlist', {
    props: ['movie', 'listname', 'swapname'],
    template: `
<div>
    <div class="wl_main" style="position:relative;">
        <div style="text-align:center;" class="ov_rating">
            <p> {{movie.getRating() }} </p>
        </div>
        <div class="t_main" style="text-align:center;">
            <a target="_blank" :href="movie.getTitleLink()" style="color: white; text-decoration: none;"> {{movie.getTitleYear()}} </a>
        </div>
        <div class="wl_watched">
            <div v-on:click="swapList">
                <slot name="swapicon"></slot>
            </div>
        </div>
        <div class="wl_remove">
            <i class="fa fa-times font-scale" v-on:click="deleteMovie" aria-hidden="true" style="font-size:40px; cursor:pointer;"></i>
        </div>
        <div class="g_main" style="text-align:center;">
            <p> {{movie.getGenres() }} </p>
        </div>
        <div class="wl_actor" style="text-align:center;">
            <template v-for="(actor,index) of movie.getActors()">
            <a target="_blank" v-bind:href="movie.getActorLink(actor)">
                {{actor.name}}</a><span v-if="(index+1)!==movie.getActors().length">, </span>
                </template>
            </div>
            <div class="pr">
                <star-rating v-model="rating"
                :increment="0.5"
                :star-size="30"
                :show-rating="false">
                </star-rating>
            </div>
            <div class="img" height="225px" width="150px">
                <img v-bind:src="movie.getImage()" alt="movie image">
            </div>
        </div>
        <br>
        <br>
    </div>
    `,
    data: function() {
        return {
            rating: this.movie.getPersonalRating()
        }
    },
    watch: {
        rating: function() {
            this.$http.post('/api/' + this.listname + '/rate', {
                movie_id: this.movie.getId(),
                rating: this.rating
            }).then(resp => this.movie.setPersonalRating(this.rating),
                error => location = '/auth/google')
        }
    },
    methods: {
        deleteMovie: function() {
            this.$http.delete('/api/' + this.listname + '/remove', {
                body: {
                    movie_id: this.movie.getId()
                }
            }).then(resp => {
                    this.$emit('delete-movie', this.movie)
                    this.$notify({
                        type: 'success',
                        text: 'Removed Title from ' + this.listname
                    });
                },
                error => location = '/auth/google')
        },
        swapList: function() {
            this.$http.post('/api/' + this.swapname + '/add', {
                movie_id: this.movie.getId(),
                rating: this.rating
            }).then(resp => {
                    this.$http.delete('/api/' + this.listname + '/remove', {
                        body: {
                            movie_id: this.movie.getId()
                        }
                    }).then(resp => {
                            this.$emit('delete-movie', this.movie)
                            this.$notify({
                                type: 'success',
                                text: 'Pushed Title to ' + this.swapname
                            });
                        },
                        error => location = '/auth/google')
                },
                error => location = '/auth/google')
        },
    }
});