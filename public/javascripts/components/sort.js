const sort = Vue.component('sort', {
    template: `
<div class="sortbox">
    <select class="selectpicker" ref="sortselect" v-model="orderBy" data-style="btn-primary" data-width="20%">
      <option>Popularity</option>
      <option>Title</option>
      <option>Rating</option>
    </select>
    <span v-on:click="rotateArrow=!rotateArrow">
      <i class="fa fa-arrow-down animatable" :class="{rotate: rotateArrow}" aria-hidden="true" style="font-size:20px; cursor:pointer;"></i>
    </span>
</div>
  `,
    mounted: function() {
        // make sure that bootstrap-select behaves/reloads properly
        $(this.$refs.sortselect).selectpicker('refresh');
    },
    data: function() {
        return {
            orderBy: null,
            rotateArrow: false
        }
    }
});