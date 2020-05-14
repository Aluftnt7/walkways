<template>
  <transition name="fade">
    <div v-if="isLoaded"> 
    <div class="proj-list-filtered flex col">
      <div class="main-content">
        <div class="header ratio-16-9" v-if="projsHeader">
          <img :src="projsHeader.imgUrl" />
          <div class="category-header">
            <div class="category-header-title">{{projsHeader.title}}</div>
            <div class="category-header-desc">{{projsHeader.desc}}</div>
          </div>
        </div>
        <ul>
          <li v-for="(proj) in projs" :key="proj._id">
            <!-- <div class="proj-preview" @mousemove="log(proj._id)"> -->

            <proj-preview :proj="proj"></proj-preview>
            <!-- </div> -->
          </li>
        </ul>
      </div>
      <div class="side-bar">
        <map-preview :array="projs"></map-preview>
      </div>

      <!-- <side-bar :projs="projs" class="side-bar" v-if="projs"></side-bar> -->
    </div>
    </div>

    <div class="height-container width-contianer" v-else>
      <img src="../../assets/svg/loading.svg" alt="">
    </div>

  </transition>
</template>


<script>
import projPreview from "../../components/proj/proj-preview.vue";
import mapPreview from "../../components/map-preview.vue";

export default {
  name: "projsListFiltered",

  data() {
    return {
      projs: null,
      projsHeader: null,
      isLoaded: false
    };
  },
  async created() {
    // console.log('this.isLoaded, ',this.isLoaded)
    this.projs = await this.$store.dispatch({ type: "loadProjs" });
    const filter = this.$route.params.filter;
    const filteredProjs = this.projs.filter(proj => {
      this.isLoaded=true;
      return proj.category === filter;
    });
    this.projs = filteredProjs;
    // console.log('this.isLoaded, ',this.isLoaded)
    this.getHeader(filter);
    window.scrollTo(0, 0);
  },

  methods: {
    async getHeader(filter) {
      var headerObj = await this.$store.dispatch({
        type: "getFilteredProjHeader",
        filter
      });

      if (headerObj) {
        this.projsHeader = headerObj;
      }
    }
  },

  components: {
    projPreview,
    mapPreview
  }
};
</script>

<style scoped >
</style>
