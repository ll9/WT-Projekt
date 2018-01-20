const ASC = 1;
const DESC = -1;


const sort = Vue.component('sort', {
    template: `
<div class="sortbox">
    <select class="selectpicker" ref="sortselect" v-model="orderBy" v-on:change="sort()" data-style="btn-primary" data-width="20%">
      <option v-for="(value, key) in dictionary"> {{key}} </option>
    </select>
    <span v-on:click="sort(true)">
      <i class="fa fa-arrow-down animatable" :class="{rotate: rotate}" aria-hidden="true" style="font-size:20px; cursor:pointer;"></i>
    </span>
</div>
  `,
    mounted: function() {
        // make sure that bootstrap-select behaves/reloads properly
        $(this.$refs.sortselect).selectpicker('refresh');
    },
    data: function() {
        return {
            orderBy: 'Popularity',
            rotate: false,
            dictionary: {
                "Popularity": "popularity",
                "Title": "title",
                "Rating": "vote_average",
                "Date": "release_date"
            }
        }
    },
    methods: {
        sort: function(rotateArrow = false) {
            if (rotateArrow)
                this.rotate = !this.rotate;
            this.$emit('sort-request', this.dictionary[this.orderBy], this.rotate ? ASC : DESC);
        }
    }
});