const sort = Vue.component('sort', {
    template: `
<div class="sortbox">
    <span style="color: black;">Order By </span>
    <select class="selectpicker" ref="sortselect" v-model="orderBy" data-style="btn-primary" data-width="fit">
      <option>Popularity</option>
      <option>Title</option>
      <option>Rating</option>
    </select>
    <span><i class="fa fa-arrow-down" aria-hidden="true"></i></span>
</div>
  `,
    mounted: function() {
        // make sure that bootstrap-select behaves/reloads properly
        $(this.$refs.sortselect).selectpicker('refresh');
    },
    data: function() {
        return {
            orderBy: null
        }
    }
});