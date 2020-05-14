<template>
  <el-carousel indicator-position="outside">
    <el-carousel-item
      v-for="proj in projs"
      :key="proj._id"
      @click.native="openDetails(proj._id)"
      :title="proj.description.substring(0,80) +'... Click to read more!!'"
      class="proj-preview-card flex col"
    >
      <div class="ratio-16-9">
        <img :src="proj.imgUrls[0]" class="proj-img" />
      </div>
      <div class="proj-content">
        <section>
          <h4>{{proj.organization}}</h4>
          <h5>{{proj.title}}</h5>
          <div class="world-details">
            <img
              :src="`https://www.countryflags.io/${proj.position.short_country}/shiny/64.png`"
              v-if="proj.position.short_country"
            />
            <h5 v-if="proj.position.city">{{proj.position.city}},</h5>
            <h5 v-else>{{proj.position.region}},</h5>
            <h5>{{proj.position.country}}</h5>
          </div>
        </section>
        <review-avarage-by-id class="review-avarage" :id="proj._id" />
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import reviewAvarageById from "../review/review-avarage-by-id.vue";

export default {
  props: {
    projs: Array
  },
  methods: {
    openDetails(id) {
      this.$router.push("/proj/" + id);
    }
  },
  components: {
    reviewAvarageById
  }
};
</script>