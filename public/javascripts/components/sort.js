const test = Vue.component('sort', {
    template: `
<div class="sortbox">
    <select class="selectpicker" ref="sortselect" v-model="orderBy" data-style="btn-primary" data-width="fit">
      <option>Popularity</option>
      <option>Title</option>
      <option>Rating</option>
    </select>
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