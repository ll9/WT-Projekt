const test = Vue.component('sort', {
    template: `
<div class="sortbox">
    <select class="selectpicker" v-model="orderBy" data-style="btn-primary" data-width="fit">
      <option>Popularity</option>
      <option>Title</option>
      <option>Rating</option>
    </select>
</div>
  `,
});