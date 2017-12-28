Vue.component('watchlist', {
	props: ['movies'],
	template: `
		<div class="watchlist">
            <table id="table_1" align="center" width="70%">
                <tbody>
                    <tr>
                        <th colspan="6">to watch</th>
                    </tr>
                    <tr align="left">
                        <th width="10%">Image</th>
                        <th width="30%">Title + Year</th>
                        <th width="25%">Genres</th>
                        <th width="25%">Actors</th>
                        <th width="5%">Rating</th>
                        <th width="5%">Personal Rating</th>
                    </tr>
                    <tr id="film1" v-for="movie of movies">
                        <td><img v-bind:src="movie.getImage()"></td>
                        <td valign="top">
                            <a class="tip" title="whatever">
                                <p> {{movie.getTitleYear()}} </p>
                            </a>
                        </td>
                        <td valign="top"><p> {{movie.getGenres() }} </p></td>
                        <td valign="top">
                            <template v-for="(actor,index) of movie.getActors()">
                            <a target="_blank" v-bind:href="movie.getActorLink(actor)">
                                {{actor.name}}</a><span v-if="(index+1)!==movie.getActors().length">, </span>
                            </template>
                        </td>
                        <td valign="top"><p> {{movie.getRating() }} </p></td>
                        <td valign="top">Stars</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
});