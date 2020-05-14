<template>
  <section class="notification-list" v-if="notifications.length">
    <h3 @click="scrollTo" class="container-link-img">
      <img  class="link-img" src="../../assets/svg/link.svg" alt />
      <span>Notification</span>
    </h3>
    <section class="notification-container">
      <div>
        <notification-preview
          class="notification-preview"
          v-for="notification in notifications"
          :key="notification._id"
          :notification="notification"
          :userId="userId"
        />
        
      </div>
    </section>
  </section>
</template>

<script>
import notificationPreview from './notification-preview.vue'

export default {
  props: {
    notifications: Array,
    userId: String
  },
  methods: {
       scrollTo(ev) {
      window.scrollTo(0, ev.target.offsetTop - 200);
    }
  },
  components: {
      notificationPreview
  }
};
</script>