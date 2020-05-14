<template>
  <section class="user-profile-for-details">
    <h3 @click="scrollTo" class="container-link-img">
      <img  class="link-img" src="../../assets/svg/link.svg" alt />
      <span>Created by</span>
    </h3>
    <section class="flex col">
      <router-link :to="'/user/' + user._id">
        <img class="avatar avatar-m" :src="user.imgUrl" :alt="user.fullName" :title="user.fullName" />
      </router-link>
      <section>
        <p>{{user.fullName}}</p>
        <p>Join: {{user.joinAt.date}}, {{user.joinAt.time}}</p>
        <review-avarage-by-id class="review-avarage" :id="user._id" />
        <!-- <review-avarage-by-id class="review-avarage" :id="user._id" :isUser="true" /> -->
      </section>
    </section>
  </section>
</template>

<script>
import reviewAvarageById from "../review/review-avarage-by-id.vue";

export default {
  props: {
    user: Object
  },
  methods: {
    scrollTo(ev) {
      window.scrollTo(0, ev.target.offsetTop - 200);
    }
  },
  components: {
    reviewAvarageById
  }
};
</script>