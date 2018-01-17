Vue.component('watchlist', {
    props: ['movie'],
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
        </div>
        <div class="add">
            <span class="eye">
                <i class="fa fa-eye" aria-hidden="true" style="font-size:35px;"></i>
            </span>
        </div>
        <div class="watched">
            <span class="check">
                <i class="fa fa-check-square-o" aria-hidden="true" style="font-size:35px;"></i>
            </span>
        </div>
        <br>
        <br>
    </div>
    `
});