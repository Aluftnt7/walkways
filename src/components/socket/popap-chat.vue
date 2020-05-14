<template>
  <div class="popap-chat flex col">
    <!-- <img v-if="isChat" src="../assets/icon/close-chat.png" class="btn-icon" @click="isChat = !isChat"/> -->
    <!-- <img v-else src="../assets/icon/chat.png" class="btn-icon" @click="isChat = !isChat"/> -->
    <form @submit.prevent="sendMsg" class="flex col">
      <input
        type="text"
        class="input-text"
        v-model="msg.txt"
        placeholder="write a few words about the proj.."
      />
      <button>Send</button>
    </form>
    <ul>
      <li v-for="(msg, idx) in msgs" :key="idx">{{msg.from}}: {{msg.txt}}</li>
      <h6 v-if="fromUser">{{fromUser}} is typing...</h6>
    </ul>
    <pre>{{msg}}</pre>
  </div>
</template>

<script>
import socketService from "../../services/socket.service.js";

export default {
  name: "popapChat",
  props: {
    proj: Object
  },
  data() {
    return {
      msg: {},
      // msgs: [],
      fromUser: null,
      topic: this.proj._id,
      historyMsg: [],
      typingTimeOut: ""
    };
  },
  async created() {
    this.msg = {
      from: "",
      txt: "",
      // topic: this.proj._id + '-' +  this.loggedinUser._id
      topic: this.proj._id
    };
    await this.$store.dispatch({ type: "loadMsg", topic: this.topic });
    // await this.$store.dispatch({ type: "loadMsg", topic: this.msg.topic });
    // socketService.setup();
    socketService.emit("chat topic", this.topic);
    if (!this.$store.getters.loggedinUser) return;
    this.msg.from = this.$store.getters.loggedinUser.username;
    socketService.on("chat addMsg", this.addMsg);
    socketService.on("typing", ({ from, topic }) => {
      if (topic === this.topic) {
        clearTimeout(this.typingTimeOut);
        this.typingTimeOut = "";
        this.fromUser = from;
        this.typingTimeOut = setTimeout(() => {
          this.fromUser = null;
        }, 1500);
      } else {
        this.fromUser = null;
      }
    });
  },
  destroyed() {
    socketService.off("chat addMsg", this.addMsg);
    socketService.off("typing", ({ from, topic }) => {
      if (topic === this.topic) {
        clearTimeout(this.typingTimeOut);
        this.fromUser = from;
        this.typingTimeOut = setTimeout(() => {
          this.fromUser = null;
        }, 1500);
      } else {
        this.fromUser = null;
      }
    });
    // socketService.terminate();
  },
  methods: {
    addMsg(msg) {
      this.$store.dispatch({ type: "pushMsg", msg });
    },
    sendMsg() {
      if (!this.$store.getters.loggedinUser) return;
      socketService.emit("chat newMsg", JSON.parse(JSON.stringify(this.msg)));
      this.msg.txt = "";
    },
    changeTopic() {
      socketService.emit("chat topic", this.topic);
    },
    writing() {
      socketService.emit("writingUser", {
        from: this.msg.from,
        topic: this.topic
      });
      if (!this.msg.txt) this.fromUser = null;
    }
  },
  computed: {
    msgs() {
      return this.$store.getters.msgs;
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    }
  },
  watch: {
    topic() {
      // console.log('Topic Changed', this.topic);
    },
    "msg.txt"() {
      // console.log('MSG CHANGED');
      this.writing();
    },
    msgs: {
      handler() {
        // console.log('New msg arrival!');
      }
    }
  }
};
</script>