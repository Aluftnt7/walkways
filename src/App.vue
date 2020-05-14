<template>
  <div id="app">
    <div class="screen"></div>
    <nav-bar />
    <router-view />
    <main-footer/>
    <div class="msg" v-if="msg && msg.isShow">
      <button class="close-msg-btn" @click="closeMsg">X</button>
      {{msg.txt}}
    </div>
  </div>
</template>


<script>
import navBar from "./components/nav-bar.vue";
import mainFooter from "./components/footer/main-footer.vue";
import { eventBus } from "./services/eventbus-service.js";
import { utilService } from "./services/util.service.js";
import socketService from "./services/socket.service.js";
import {projService} from './services/proj.service.js';

export default {
  name: "projApp",
  data() {
    return {
      audioNotification: null,
      user: null
    };
  },
  computed: {
    msg() {
      return this.$store.getters.msg;
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    }
  },
  methods: {
    closeMsg() {
      this.$store.commit({ type: "closeMsg", msg: { isShow: false, txt: "" } });
    }
  },
  components: {
    navBar,
    mainFooter
  },
  async created() {
    socketService.setup();
    if (this.loggedinUser) this.connectSockets();
    this.user = JSON.parse(JSON.stringify(this.loggedinUser));

    this.audioNotification = new Audio(
      require("./assets/audio/notification.mp3")
    );
  },
  mounted() {
    eventBus.$on("connectSockets", () => this.connectSockets());
    eventBus.$on("disconnectSockets", () => this.disconnectSockets());
    eventBus.$on("removeReview", async reviewId => {
      console.log("removeReview");

      const msg = await this.$store.dispatch({
        type: "removeReview",
        reviewId
      });
      this.reviews = this.$store.getters.reviews;
    });
    document.title = this.loggedinUser
      ? `(${this.loggedinUser.notifications.length}) Walkways`
      : "Walkways";
  },
  destroyed() {
    if (this.loggedinUser) this.disconnectSockets();
    socketService.terminate();
  },
  methods: {
    connectSockets() {
      socketService.on(`apply ${this.loggedinUser._id}`, this.pushNotification);
      socketService.on(`decline ${this.loggedinUser._id}`, this.decline);
      socketService.on(`approve ${this.loggedinUser._id}`, this.approve);
    },
    disconnectSockets() {
      socketService.off(
        `apply ${this.loggedinUser._id}`,
        this.pushNotification
      );
      socketService.off(`decline ${this.loggedinUser._id}`, this.decline);
      socketService.off(`approve ${this.loggedinUser._id}`, this.approve);
    },
    pushNotification(notification) {
      // var res = this.$store.dispatch({ type: "addRequest", request });
      // if (res) this.audioNotification.play();

      // eventBus.$emit("addRequest", request);

      this.user.notifications.push(notification);
      this.updateUser();
    },
    decline(notification) {
      // var res = this.$store.dispatch({ type: "decline", notification });
      // if (res) this.audioNotification.play();

      // eventBus.$emit("decline", notification);
      if (notification.from._id === this.loggedinUser._id) {
        this.user.notifications.push({
          _id: utilService.makeId(),
          proj: notification.proj,
          from: notification.to,
          to: notification.from,
          txt: "Sorry, your application was disapproved..!",
          isApproved: false
        });
      } else {
        const idx = this.user.notifications.findIndex(
          currProj => currProj._id === notification._id
        );
        this.user.notifications.splice(idx, 1);
      }
      this.updateUser();
    },
    async approve(notification) {
      // var res = this.$store.dispatch({ type: "approve", notification });
      // if (res) this.audioNotification.play();

      // eventBus.$emit("approve", notification);
      if (notification.from._id === this.loggedinUser._id) {
        this.user.notifications.push({
          _id: utilService.makeId(),
         proj: notification.proj,
          from: notification.to,
          to: notification.from,
          txt: "We are pleased to inform you that you have been accepted for our project..!",
          isApproved: true
        });
      } else {
        const proj = await projService.getById(notification.proj._id);
        proj.membersApplyed.push(notification.from);
        proj.membersNeeded -= notification.memebersApllied;
        await this.$store.dispatch({ type: "saveProj", proj });
        const idx = this.user.notifications.findIndex(
          currProj => currProj._id === notification._id
        );
        this.user.notifications.splice(idx, 1);
      }
      this.updateUser();
    },
    async updateUser() {
      const updatedUser = await this.$store.dispatch({
        type: "updateUser",
        user: this.user
      });
      if (updatedUser) {
        eventBus.$emit("updateUser", updatedUser);
        this.audioNotification.play();
      } else {
        console.log("ERROR IN UPDATE USER");
      }

      // console.log(updatedUser, " updatedUser");
    }
  }
  // watch: {
  //   loggedinUser: {
  //     hendler() {
  //       document.title = this.loggedinUser
  //         ? `(${this.loggedinUser.notifications.length}) Walkways`
  //         : "Walkways";
  //     },
  //     deep: true
  //   }
  // }
};
</script>

<style>
</style>

