<template>
  <transition name="fade">
    <div class="proj-details-container width-container" v-if="proj && reviews">
      <!-- <popap-chat :proj="proj"/> -->

      <div class="proj-details">
        <div class="main-content-details-contianer">
          <!-- TITLE OF PROJECT-->
          <!-- <h1 class="title-proj">{{proj.title}}</h1> -->
          <input class="title-proj" v-model="proj.title" placeholder="Project Title" />

          <!-- IMAGES GALERY OF PROJECT-->
          <label class="img-proj-container ratio-16-9">
            <input @input="uploadImg" type="file" hidden />
            <el-carousel indicator-position="outside">
              <el-carousel-item v-for="(imgUrl, i) in proj.imgUrls" :key="i">
                <img :src="imgUrl" />
              </el-carousel-item>
            </el-carousel>
          </label>

          <!--AVARAGE REVIEW OF PROJECT-->
          <review-avarage class="review-avarage review" :reviews="reviews" />

          <user-profile-for-details :user="proj.createdBy" />
          <div class="main-content-details">
            <section>
              <div @click="setActive('description', $event)" class="flex a-center bet">
                <h3 class="container-link-img flex bet">
                  <section>
                    <img class="link-img" src="../../assets/svg/link.svg" alt />
                    <span>Description</span>
                  </section>
                  <img
                    :class="{'arrow-down': active === 'description'}"
                    src="../../assets/svg/downloading2.svg"
                    alt
                  />
                </h3>
              </div>
              <transition name="fade">
                <p v-if="active === 'description'">{{proj.description}}</p>
              </transition>
            </section>
            <section>
              <div @click="setActive('requirements', $event)" class="flex a-center bet">
                <h3 class="container-link-img flex bet">
                  <section>
                    <img class="link-img" src="../../assets/svg/link.svg" alt />
                    <span>Requirements</span>
                  </section>
                  <img
                    :class="{'arrow-down': active === 'requirements'}"
                    src="../../assets/svg/downloading2.svg"
                    alt
                  />
                </h3>
              </div>
              <transition name="fade">
                <div v-if="active === 'requirements'">
                  <p>
                    <span class="strong">Required Dates:</span>
                    {{proj.date[0]}} - {{proj.date[1]}}
                  </p>
                  <p>
                    <span class="strong">Members needed:</span>
                    {{proj.membersNeeded}} / {{proj.membersNeeded + proj.membersApplyed.length}}
                  </p>
                  <p v-if="proj.requirements.languages.length">
                    <span class="strong">Language control:</span>
                    <span>{{proj.requirements.languages.join(', ')}}.</span>
                  </p>
                  <p v-if="proj.requirements.otherSkills.length">
                    <span class="strong">Other Skills:</span>
                    <span>{{proj.requirements.otherSkills.join(', ')}}.</span>
                  </p>
                  <p>
                    <span class="strong">Minimum Age:</span>
                    {{proj.requirements.minAge}}
                  </p>
                </div>
              </transition>
            </section>
            <section>
              <div @click="setActive('tags', $event)" class="flex a-center bet">
                <h3 class="container-link-img flex bet">
                  <section>
                    <img class="link-img" src="../../assets/svg/link.svg" alt />
                    <span>What is included</span>
                  </section>
                  <img
                    :class="{'arrow-down': active === 'tags'}"
                    src="../../assets/svg/downloading2.svg"
                    alt
                  />
                </h3>
              </div>
              <transition name="fade">
                <ul v-if="active === 'tags'">
                  <li v-for="tag in proj.tags" :key="tag" class="flex a-center">
                    <img
                      :src="require('../../assets/svg/' + tag.toLowerCase().split(' ').join('-') + '.svg')"
                      alt="tag"
                    />
                    <span>{{tag}}</span>
                  </li>
                </ul>
              </transition>
            </section>
          </div>
        </div>

        <review-add
          v-if="(loggedinUser && loggedinUser._id !== proj.createdBy._id) || !loggedinUser"
          :review="review"
          @save="save"
        />
        <review-list v-if="reviews && reviews.length" class="reviews-container" :reviews="reviews" />
        <div class="card-deatails map-container">
          <map-preview :array="[proj]"></map-preview>
        </div>
      </div>

      <div class="edit-link-container width-container">
        <router-link
          v-if="loggedinUser &&
        (loggedinUser._id === proj.createdBy._id || 
        loggedinUser.isAdmin)"
          :to="'/edit/' + proj._id"
          class="edit-link flex col a-center"
          title="Edit Project"
        >
          <img class="btn-img" src="../../assets/png/edit.png" alt />
        </router-link>
        <span
          v-else-if="loggedinUser &&
        (loggedinUser._id !== proj.createdBy._id || 
        !loggedinUser.isAdmin)"
          @click.stop="toggleApply"
          :class="{'apply-open':isApplyOpen}"
        >Apply now</span>
      </div>
      <proj-apply
        v-if="loggedinUser"
        @toggleApply="toggleApply"
        :proj="proj"
        :user="loggedinUser"
        class="proj-apply"
        :class="{'apply-open':isApplyOpen}"
      ></proj-apply>
      <div
        v-if="loggedinUser &&
        (loggedinUser._id !== proj.createdBy._id || 
        !loggedinUser.isAdmin)"
        @click.stop="toggleApply"
        class="proj-apply-for-mobile"
        :class="{'apply-open':isApplyOpen}"
      >
        <h1>Apply now</h1>
      </div>
    </div>
  </transition>
</template>

<script>
import { eventBus } from "../../services/eventbus-service.js";
import mapPreview from "../../components/map-preview.vue";
import projApply from "../../components/proj/proj-apply.cmp.vue";
import reviewList from "../../components/review/review-list.cmp.vue";
import reviewAdd from "../../components/review/review-add.cmp.vue";
import reviewAvarage from "../../components/review/review-avarage.cmp.vue";
import popapChat from "../../components/socket/popap-chat.vue";
import userProfileForDetails from "../../components/user/user-profile-for-details.vue";

export default {
  data() {
    return {
      ref: null,
      proj: null,
      isApplyOpen: false,
      // isApplyOn: false,
      isEdit: false,
      review: null,
      averageRate: null,
      colors: this.$store.getters.colors,
      active: ""
    };
  },
  async created() {
    window.scrollTo(0, 0);
    const projId = this.$route.params.id;
    this.proj = await this.$store.dispatch({
      type: "loadProj",
      projId
    });
    await this.$store.dispatch({
      type: "loadReviews",
      id: projId,
      isSetReviews: true
    });
    this.averageRate = this.reviews.reduce((a, b) => a + b.rate, 0);
    this.review = this.getEmptyReview();
  },
  components: {
    mapPreview,
    projApply,
    reviewList,
    reviewAdd,
    reviewAvarage,
    popapChat,
    userProfileForDetails
  },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    reviews() {
      return this.$store.getters.reviews;
    }
  },
  methods: {
    async save(review) {
      review.by = this.loggedinUser
        ? this.loggedinUser
        : {
            _id: 1,
            fullName: "Anonymous",
            imgUrl: "../../assets/png/login.png"
          };
      var reviews = await this.$store.dispatch({
        type: "saveReview",
        review
      });
      this.review = this.getEmptyReview();
    },
    getEmptyReview() {
      return {
        txt: "",
        rate: 5,
        by: this.$store.getters.by,
        about: {
          _id: this.proj._id,
          fullName: this.proj.title,
          imgUrl: this.proj.imgUrls[0]
        }
      };
    },
    setActive(value, ev) {
      this.active ? this.scrollTo(ev, 350) : this.scrollTo(ev, 150);
      this.active = this.active === value ? "" : value;
    },
    toggleApply() {
      // window.scrollTo(0, 0);
      this.isApplyOpen = !this.isApplyOpen;
      document.body.classList.toggle("apply-open");
    },
    closeApply() {
      this.isApplyOpen = false;
      document.body.classList.remove("apply-open");
    },
    handlePress() {
      if (event.keyCode === 27 || event.keyCode === 32) {
        this.closeApply();
      }
    },
    scrollTo(ev, dif = 150) {
      window.scrollTo(0, ev.target.offsetTop - dif);
    }
  },
  mounted() {
    document
      .querySelector(".screen")
      .addEventListener("click", this.closeApply);
    document.addEventListener("keydown", this.handlePress);
    eventBus.$on("updateReview", async review => {
      await this.save(review);
    });
  },
  beforeDestroy() {
    document
      .querySelector(".screen")
      .removeEventListener("click", this.closeApply);
    document.removeEventListener("keydown", this.handlePress);
  }
};
</script>

<style>
</style>
