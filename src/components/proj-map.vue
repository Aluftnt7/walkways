<template>
  <div class="container-map">
    <transition name="fade">
      <proj-preview-card
        :proj="proj"
        v-if="isShow"
        title="Click to view project details"
        @click.native="openDetails(proj._id)"
        class="img-on-map-container"
        :style="`top:${y}px; left:${x}px`"
      />
    </transition>
    <GmapMap class="map" v-if="position" :center="position" :zoom="zoomSize" map-type-id="terrain">
      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :ref="`marker${index}`"
        :position="m.position"
        :clickable="true"
        :draggable="false"
        :icon="markerOptions"
        @click="openImg(m, index, $event)" 
      />
    </GmapMap>
  </div>
</template>
<script>
import projPreviewCard from "../components/proj-preview-card.vue";

const mapMarker = require("../assets/icon/airport.png");

export default {
  props: {
    position: null,
    markers: Array,
    zoomSize: null
  },
  data() {
    return {
      markerOptions: {
        url: mapMarker,
        size: { width: 60, height: 90, f: "px", b: "px" },
        scaledSize: { width: 40, height: 45, f: "px", b: "px" }
      },
      proj: null,
      x: 0,
      y: 0,
      isShow: false
    };
  },
  created() {},

  methods: {
    openImg(m, index, $event) {
      setTimeout(() => {
        this.x = $event.tb.pageX || $event.rb.pageX;
        this.y = $event.tb.pageY || $event.rb.pageY;
        this.isShow = true;
        this.proj = m.proj;
      }, 1);
    },
    holdImg() {
      this.isShow = true;
    },
    handlePress(event) {
      if (event.keyCode === 27 || event.keyCode === 32) {
        this.closeImg();
      }
      if (event.keyCode === 13) {
        this.openDetails(this.proj._id)
      }
    },
    closeImg() {
      if (!this.isShow) return;
      this.isShow = false;
    },
    openDetails(id) {
      this.$router.push("/proj/" + id);
    }
  },
  mounted() {
    document.addEventListener("click", this.closeImg);
    document.addEventListener("keydown", this.handlePress);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.closeImg);
    document.removeEventListener("keydown", this.handlePress);
  },
  components: {
    projPreviewCard
  }
};
</script>
