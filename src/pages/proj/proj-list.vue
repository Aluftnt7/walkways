<template>
  <transition name="fade">
    <div class="proj-list width-container" v-if="projs">
      <filter-By class="filter-in-proj-list"/>
              <div class="header ratio-16-9" v-if="isOpen">
          <img src="../../assets/jpg/people.jpg" />
          <div class="page-header">
      <h2 class="projs-title">Be the change </h2>
      <h3>Be a global volunteer abroad</h3>
          </div>
        </div>
      <div class="around-the-world-list">
        <marker-card
          v-for="proj in projs"
          :key="proj._id"
          :proj="proj"
          :title="proj.description.substring(0,80) +'... Click to read more!!'"
          class="proj-preview-card"
          @click.native="openDetails(proj._id)"
        />
      </div>
    </div>
  </transition>
</template>

<script>
import markerCard from "../../components/marker-card.vue";
import { eventBus } from "../../services/eventbus-service.js";

export default {
  name: "projList",
  data(){
    return{
      isOpen:true,
      initialVal:null
    }
  },
  computed: {
    projs: {
      get() {
        return this.$store.getters.projs;
      },
      set(val) {
        this.$store.getters.projs;
      }
    }
  },
  async created() {
    window.scrollTo(0,0)
    await this.$store.dispatch({ type: "loadProjs" });
    this.initialVal = this.projs.length

  },
  mounted() {
    eventBus.$on("setFilter", async filterBy => {
      await this.$store.dispatch({ type: "loadProjs", filterBy });
      (this.initialVal !== this.projs.length) ? this.isOpen = false : this.toggleHero()
    });
  },
  beforeDestroy() {
    eventBus.$off("setFilter", async filterBy => {
      await this.$store.dispatch({ type: "loadProjs", filterBy });
    });
  },
  methods: {
    openDetails(id) {
      this.$router.push("/proj/" + id);
    },
    toggleHero(){
     this.isOpen = true
    }
  },
  components: {
    filterBy: () => import("../../components/filter/filter-by.vue"),
    markerCard
  },


};
</script>
