<template>
  <section class="my-video">
    <header class="flex a-center bet">
      <img
        src="../../assets/svg/close.svg"
        @click="$emit('stopVideo')"
        title="Stop taking pictures"
      />
      <img
        src="../../assets/svg/arrows.svg"
        v-if="profile"
        @click="play"
        title="Take a picture again"
      />
    </header>
    <div class="container-canvas-video">
      <img class="profile-img" v-if="profile" width="400" height="300" :src="profile" alt />
      <video
        @loadstart="loading = true"
        @loadeddata="loading = false"
        :class="{'stop-video': profile, loading}"
        ref="video"
        width="400"
        height="300"
        autoplay
        preload="none"
        muted="muted"
      >
        <source src="../../assets/svg/loading.svg" />
      </video>
    </div>
    <canvas ref="canvas" width="640" height="480"></canvas>
    <div class="confirm-img-contianer" v-if="profile">
      <img v-if="profile" src="../../assets/svg/ok.svg" title="Confirm" @click="uploadImg" />
    </div>
    <div class="capture-img-contianer" v-else>
      <img src="../../assets/svg/image.svg" title="Take my photo" @click="capture" />
    </div>
    <footer></footer>
  </section>
</template>

<script>
import { eventBus } from '../../services/eventbus-service';
export default {
  name: "my-video",
  data() {
    return {
      video: {},
      canvas: {},
      context: {},
      profile: null,
      loading: false
    };
  },
  mounted() {
    this.video = this.$refs.video;
    this.canvas = this.$refs.canvas;
    this.context = this.canvas.getContext("2d");
    this.context.translate(640, 0);
    this.context.scale(-1, 1);
    this.play();
  },
  beforeDestroy() {
    this.stop();
  },
  methods: {
    stop() {
      this.video.srcObject.getTracks().forEach(track => track.stop());
    },
    play() {
      this.profile = null;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
          this.video.srcObject = stream;
          this.video.play();
        });
      }
    },
    capture() {
      this.context.drawImage(this.video, 0, 0, 640, 480);
      this.profile = this.canvas.toDataURL("image/png");
      this.stop();
    },
    async uploadImg() {
      eventBus.$emit('uploadImg', this.profile)
      // const img = await this.$store.dispatch({
      //   type: "addImg",
      //   imgEv: this.profile
      // });
      // this.$emit("input", img.url);
      this.$emit("stopVideo");
    }
  }
};
</script>
