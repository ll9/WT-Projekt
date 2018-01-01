Vue.component('search', {
    template: `
		<div>
			<div class="container">
				<div id="filter" class="filter">
					<input type="search" placeholder="Search" v-model="searchText" v-on:keyup.enter="emitUrl">
					<button v-on:click="emitUrl">
					<i class="fa fa-search" aria-hidden="true"></i>
					</button>
				</div>
				<div id="genre" class="genre">
					<div class="genrebox">
						<div>Genre: </div>
						<select class="selectpicker" v-model="selectedGenres" data-actions-box="true" data-select-all-text="Done" data-width="fit" data-max-options="4" multiple>
							<option disabled value="">Please select Genre</option>
							<option v-for="genre in genres"> {{genre}} </option>
						</select>
					</div>
					<span>Year: {{ yearValue }}</span>
					<vue-slider v-model="yearValue" v-bind="yearOptions"></vue-slider>
					<span>Rating > {{ ratingValue }}</span>
					<vue-slider v-model="ratingValue" v-bind="ratingOptions"></vue-slider>
				</div>
			</div>
			<br>
		</div>
	`,
    mounted: function() {
        $(window).on('load', function() {
            $(".bs-select-all").on('click', function(event) {
                $('.selectpicker').selectpicker('toggle');
                // Don't use the regular event (select all)
                event.stopPropagation();
            });
        });
    },
    data: function() {
        return {
            genres: [
                'Action',
                'Adventure',
                'Animation',
                'Biography',
                'Comedy',
                'Crime',
                'Documentary',
                'Drama',
                'Family',
                'Fantasy',
                'History',
                'Horror',
                'Music',
                'Mystery',
                'Romance',
                'Science Fiction',
                'Short',
                'Sport',
                'Thriller',
                'War',
                'Western'
            ],
            yearValue: [1900, 2018],
            yearOptions: {
                min: 1900,
                max: 2018,
                tooltip: false
            },
            ratingValue: 0,
            ratingOptions: {
                min: 0,
                max: 10,
                interval: 0.1,
                tooltip: false
            },
            selectedGenres: [],
            searchText: '',
            year: 1950,
            rating: 50,
        }
    },
    methods: {
        emitUrl: function() {
            url = '/api/search/' +
                (this.searchText ? `movies/${this.searchText}` : 'popular') +
                '?' +
                (this.selectedGenres.length ? `&genres=${this.selectedGenres}` : '') +
                (this.ratingValue ? `&rating=${this.ratingValue}` : '') +
                (this.yearValue ? `&years=${this.yearValue}` : '');

            this.$emit('search-request', url);
        }
    },
    components: {
        'vueSlider': window['vue-slider-component'],
    }
});