<template>
  <transition name="fade">
    <div class="proj-edit width-container" v-if="proj">
      <h2>
        <span v-if="proj._id">{{proj.title}}</span>
        <span v-else>Add a WalkAway project</span>
      </h2>

      <form class="form-proj-edit" @submit.prevent="save(proj)">
        <div class="input-edit-contianer-1">
          <h5>Organization name</h5>
          <el-input placeholder="Organization name?" v-model="proj.organization">
            <i class="el-icon-edit el-input__icon" slot="suffix"></i>
          </el-input>
          <h5>Project name</h5>
          <el-input placeholder="Project name?" v-model="proj.title">
            <i class="el-icon-edit el-input__icon" slot="suffix"></i>
          </el-input>
          <h5>Category selection</h5>
          <el-select
            required
            v-model="proj.category"
            filterable
            default-first-option
            placeholder="Category"
          >
            <el-option
              v-for="item in categories"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="input-edit-contianer-6">
          <h5>Description about project</h5>
          <el-input
            type="textarea"
            :autosize="{ minRows: 3}"
            placeholder="Write a few words about your project :)"
            v-model="proj.description"
          ></el-input>
        </div>
        <div class="input-edit-contianer-5">
          <h5>Choose a date</h5>
          <el-date-picker
            v-model="proj.date"
            type="daterange"
            unlink-panels
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            format="yyyy/MM/dd"
          ></el-date-picker>
        </div>
        <div class="input-edit-contianer-3">
          <h5>Members Needed</h5>
          <el-input-number v-model="proj.membersNeeded" :min="1" :max="100"></el-input-number>
        </div>
        <div class="input-edit-contianer-4">
          <h5>Minimum Age: {{proj.requirements.minAge}}</h5>
          <el-input-number v-model="proj.requirements.minAge" :min="14"></el-input-number>
        </div>
        <div class="input-edit-contianer-2">
          <h5>Language skill</h5>
          <el-select
            v-model="proj.requirements.languages"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="Choose language"
          >
            <el-option
              v-for="item in languages"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

          <h5>More skills</h5>
          <el-select
            v-model="proj.requirements.otherSkills"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="Add Skills"
          >
            <el-option
              v-for="item in otherSkills"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

          <h5>What's included</h5>
          <el-select
            v-model="proj.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="What's included"
          >
            <el-option
              v-for="item in tags"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>

        <div class="input-edit-contianer-7">
          <h5>Please enter an address</h5>
          <el-input
            placeholder="Please enter an address"
            v-model="proj.position.txtAddress"
            @blur.prevent="searchPosition(proj.position.txtAddress)"
          >
            <i
              slot="prefix"
              class="el-input__icon el-icon-search"
              @click.prevent="searchPosition(proj.position.txtAddress)"
            ></i>
          </el-input>
          <map-preview :markers="[proj]"></map-preview>
        </div>

        <div class="upload-img-container input-edit-contianer-8">
          <h5>Upload Imgaes</h5>
          <label class="upload-img-btn" title="Upload Image">
            <input @input="uploadImg" type="file" hidden />
            <span v-if="proj.imgUrls.length" class="btn-span">Upload more Images</span>
            <span v-else class="btn-span">Upload Image</span>
          </label>
          <label v-if="proj.imgUrls.length === 0" class="upload-img" title="Upload Image">
            <input @input="uploadImg" type="file" hidden />
            <img class="plus-icon" src="../../assets/png/plus.png" />
          </label>
          <el-carousel v-else class="carousel-img">
            <el-carousel-item
              v-for="(url, index) in proj.imgUrls"
              :key="url"
              class="img-proj-container"
            >
              <img :src="url" @click="setCurrImg(index)" class="img-proj" />
            </el-carousel-item>
          </el-carousel>
        </div>

        <div class="input-edit-contianer-9 btn-save-delete-container">
          <span class="btn-span" v-if="proj._id" @click="remove(proj._id)">Delete</span>
          <span class="btn-span" v-else @click="reset">Reset</span>
          <button class="btn-save">Save</button>
        </div>
      </form>
    </div>
  </transition>
</template>

<script>
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import { projService } from "../../services/proj.service.js";
import toggleBtn from "@/components/toggle-btn.vue";
import mapPreview from "../../components/map-preview.vue";
import { eventBus } from "../../services/eventbus-service.js";

export default {
  data() {
    return {
      value1: "",
      proj: null,
      currentImgIdx: null,
      // markers: [],
      // position: {
      //   txtAdress: null,
      //   lat: 33.886917,
      //   lng: 9.537499
      // },
      // zoomSize: 2,
      loggedinUser: null,
      categories: [
        {
          value: "childcare",
          label: "Childcare"
        },
        {
          value: "animalsAndWildlife",
          label: "Animals & Wildlife"
        },
        {
          value: "environmentalProtection",
          label: "Environmental Protection"
        },
        {
          value: "farming",
          label: "Farming"
        },
        {
          value: "scubaDiving",
          label: "Scuba Diving"
        },
        {
          value: "humanitarian",
          label: "Humanitarian"
        },
        {
          value: "healthcare",
          label: "Healthcare"
        },
        {
          value: "sports",
          label: "Sports"
        },
        {
          value: "education",
          label: "Education"
        },
        {
          value: "art",
          label: "culture & Arts"
        },
        {
          value: "humanRights",
          label: "Human Rights"
        }
      ],
      languages: [
        {
          value: "Hebrew",
          label: "Hebrew"
        },
        {
          value: "English",
          label: "English"
        },
        {
          value: "Spanish",
          label: "Spanish"
        }
      ],
      otherSkills: [
        {
          value: "Driving",
          label: "Driving"
        },
        {
          value: "Health",
          label: "Health"
        },
        {
          value: "Education",
          label: "Education"
        },
        {
          value: "Organizer",
          label: "Organizer"
        }
      ],
      tags: [
        {
          value: "Airport Taxi",
          label: "Airport Taxi"
        },
        {
          value: "Housing",
          label: "Housing"
        },
        {
          value: "Single Bed",
          label: "Single Bed"
        },
        {
          value: "Double Bed",
          label: "Double Bed"
        },
        {
          value: "Food",
          label: "Food"
        },
        {
          value: "Wifi",
          label: "Wifi"
        },
        {
          value: "Hot Water",
          label: "Hot Water"
        }
      ]
    };
  },
  async created() {
    window.scrollTo(0,0)
    this.loggedinUser = await this.$store.getters.loggedinUser;
    const projId = this.$route.params.id;
    if (projId) {
      var proj = await this.$store.dispatch({
        type: "loadProj",
        projId
      });
      this.proj = JSON.parse(JSON.stringify(proj));
      if (
        this.loggedinUser._id !== this.proj.createdBy._id &&
        !this.loggedinUser.isAdmin
      ) {
        this.$router.push("/");
      }
    } else {
      if (!this.loggedinUser) {
        // this.$store.commit({
        //   type: "setMsg",
        //   msg: { isShow: true, txt: "You must register first" }
        // });
        this.$notify({
          title: "Warning",
          message: "You must register first",
          type: "warning",
          duration: 1500
        });
        this.$router.push("/login");
      }
      this.proj = projService.getEmptyProj();
      // this.getMarkers();
      // this.proj.imgUrls.push(this.loggedinUser.imgUrl);
    }
  },
  methods: {
    async uploadImg(ev) {
      var img = await this.$store.dispatch({
        type: "addImg",
        imgEv: ev
      });
      this.currentImgIdx || this.currentImgIdx === 0
        ? this.proj.imgUrls.splice(this.currentImgIdx, 1, img.url)
        : this.proj.imgUrls.push(img.url);
      this.currentImgIdx = null;
    },
    async save(proj) {
      if (!proj.category) {
        // this.$store.commit({
        //   type: "setMsg",
        //   msg: { isShow: true, txt: "You must select a category" }
        // });

        this.$notify({
          title: "Warning",
          message: "You must select a category",
          type: "warning",
          duration: 1500
        });
        window.scrollTo(0, 0);
        return;
      }
      proj.startAt = this.toTimestamp(proj.date[0]);
      proj.endsAt = this.toTimestamp(proj.date[1]);
      proj.date = this.fixDate(proj.date);
      proj.createdBy = this.loggedinUser;
      var res = await this.$store.dispatch({ type: "saveProj", proj });
      this.$router.push("/");
    },
    toTimestamp(strDate) {
      return Date.parse(strDate) / 1000;
    },
    fixDate(dates) {
      return dates.map(date => {
        return date.length > 10
          ? date
              .substring(0, 10)
              .split("-")
              .join("/")
          : date;
      });
    },
    async remove(projId) {
      var res = await this.$store.dispatch({ type: "removeProj", projId });
      this.$router.push("/");
    },

    async setCurrImg(idx) {
      this.currentImgIdx = idx;
    },
    async searchPosition(txt) {
      //  var txt =proj.position.txtAddress
      var currPosition = await this.$store.dispatch({
        type: "searchPosition",
        txt
      });
      if (currPosition) {
        this.proj.position = currPosition;

        // this.zoomSize = 14;
        // this.markers = [
        //   { position: { lat: currPosition.lat, lng: currPosition.lng } }
        // ];
      }
    },
    // getMarkers() {
    //   var markers = [{ pos: this.proj.position, proj: this.proj }];
    //   markers.forEach(marker => {
    //     this.markers.push({
    //       position: { lat: marker.pos.lat, lng: marker.pos.lng },
    //       proj: marker.proj
    //     });
    //   });
    // },
    reset() {
      this.proj = projService.getEmptyProj();
      window.scrollTo(0, 0);
    }
  },
  components: {
    toggleBtn,
    mapPreview,
    DateRangePicker
  }
};
</script>
