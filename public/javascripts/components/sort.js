const ASC = 1;
const DESC = -1;


const sort = Vue.component('sort', {
    props: ['options', 'defaultOption'],
    template: `
<div class="sortbox">
    <select class="selectpicker" ref="sortselect" v-model="orderBy" v-on:change="sort()" data-style="btn-primary" data-width="20%">
      <option v-for="opt in options"> {{opt}} </option>
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
            orderBy: this.defaultOption || this.options[0],
            rotate: false
        }
    },
    methods: {
        sort: function(rotateArrow = false) {
            if (rotateArrow)
                this.rotate = !this.rotate;
            this.$emit('sort-request', this.orderBy, this.rotate ? ASC : DESC);
        }
    }
});