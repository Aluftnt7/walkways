<template>
  <transition name="fade">
    <div class="home">
      <div class="video-bcg">
        <video autoplay muted loop id="myVideo">
          <source src="../assets/video/heroHeader.mp4" type="video/mp4" />
        </video>
      </div>
      <!-- <pre>{{projs}}</pre> -->
      <div class="overlayText">
        <h3 id="welcom-txt">WalkWays</h3>
        <p>
          “The best way to find yourself is to lose yourself in the service of others.”
          <br />
          <span class="gandy">Mahatma Gandhi</span>
        </p>
      </div>
      <div class="category-container width-container">
        <router-link
          :to="'/projs/' + category.category"
          v-for="category in categories"
          :key="category.category"
          :class="category.category"
          class="category"
        >
          <img :src="category.imgUrl" />
          <div class="img-tag" :class="category.category">{{category.title}}</div>
        </router-link>
      </div>

      <h1 class="details-header">Our community Activity</h1>
      <div class="walk-ways-details width-container" v-if="projs">
        <h1 class="divider">
          <img src="https://image.flaticon.com/icons/svg/2628/2628442.svg" />Projects
          <!-- <span class="space">{{count}}</span> -->
          <span class="space">{{allProjsLength}}</span>
        </h1>
        <h1 class="divider">
          <img src="https://image.flaticon.com/icons/svg/1162/1162344.svg" />Feedbacks
          <!-- <span class="space">{{count}}</span> -->
          <span class="space">{{allFeedbackLength}}</span>
        </h1>
        <h1 v-if="users && users.length" class="divider">
          <img src="https://image.flaticon.com/icons/svg/978/978012.svg" />Voulnteers
          <span class="space" v-if="users && users.length">{{users.length}}</span>
        </h1>
        <h1  class="divider">
          <img src="https://image.flaticon.com/icons/svg/921/921439.svg" />Countries
          <span class="space">{{countriesCount}}</span>
        </h1>
      </div>
      <section class="carousel-for-desctop">
        <ul v-if="projs" class="around-the-world-preview width-container">
          <!-- <li v-for="proj in projs" :key="proj._id" class="around-the-world-card"> -->
            <li v-for="proj in projsForDisplay" :key="proj._id" class="around-the-world-card">
            <marker-card
              :proj="proj"
              :title="proj.description.substring(0,80) +'... Click to read more!!'"
              class="proj-preview-card"
              @click.native="openDetails(proj._id)"
            />
          </li>
        </ul>
        <section v-else class="loading-container width-container">
          <img v-for="i in 6" :key="i" src="../assets/svg/loading.svg" alt />
        </section>
      </section>

      <section class="carousel-for-mobile width-container">
        <!-- <proj-list-carousel v-if="projs" :projs="projs" /> -->
        <proj-list-carousel v-if="projs" :projs="projsForDisplay" />
        <img v-else src="../assets/svg/loading.svg" alt />
        <!-- <img   class="flex a-center j-center" src="../assets/svg/loading.svg" alt /> -->
      </section>

      <!-- <div class="proj-preview-card">
      <router-link
        class="show-more"
        title="Show more about 'around the world'"
        to="/projs/aroundTheWorld"
      >Show more</router-link>
      </div>-->
    </div>
  </transition>
</template>

<script>
import { utilService } from "../services/util.service.js";
import { projService } from "../services/proj.service.js";
import socketService from "../services/socket.service.js";
import markerCard from "../components/marker-card.vue";
import projListCarousel from "../components/proj/proj-list-carousel.vue";

// @ is an alias to /src
export default {
  name: "home",
  props: {
    projs: Array,
    users: Array
  },
  data() {
    return {
      // projs: null,
      reviews: null,
      categories: null,
      // users: null
    };
  },
  async created() {
    console.log(this.projs);
        window.scrollTo(0, 0);

    // this.users = await this.$store.dispatch({ type: "loadUsers" });
    // this.projs = await this.$store.dispatch({ type: "loadProjs", limit: 6 });
    // this.projs = await this.$store.dispatch({ type: "loadProjs" });


    this.categories = projService.loadCategoties();
    // this.$store.getters.loggedinUser;
    // socketService.setup();
    // socketService.on("send request", request => {
    //   // this.projOwner.notifications.push(request)
    //   console.log(request, "request arrived");
    // });
  },
  // destroyed() {
  //   socketService.terminate();
  // },
  methods: {
    openDetails(id) {
      this.$router.push("/proj/" + id);
    }
  },
  computed: {
    countriesCount() {
      return this.$store.getters.countries;
    },
    allProjsLength() {
      return this.$store.getters.projs.length;
    },
    allFeedbackLength() {
      return this.$store.getters.reviewsCount;
      // return this.$store.getters.reviews.length;
    },
    projsForDisplay() {
      var projToDisplay = [];
      let projsCopy = JSON.parse(JSON.stringify(this.projs));
      for (let i = 0; i < 6; i++) {
        let ranNum = utilService.getRandomInt(1, projsCopy.length);
        let proj = projsCopy[ranNum];
        let idx = projsCopy.findIndex(currProj => {          
          return currProj._id === proj._id;
        });
        projToDisplay.push(proj);
        projsCopy.splice(idx, 1);
      }
      return projToDisplay;
    }
  },
  components: {
    markerCard,
    projListCarousel
  }
};
</script>
