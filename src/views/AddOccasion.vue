<template>
  <div class="add-occasion-container">
    <br>
    <h3 class="display-6">Add new occasion</h3>
    <van-divider/>
    <van-overlay :show="showLoading">
      <div class="wrapper">
        <div class="block">
          <van-loading color="#0094ff"/>
        </div>
      </div>
    </van-overlay>
    <van-form @submit="onSubmit">
      <van-field
          readonly
          clickable
          name="address"
          :value="chosenAddress"
          label="Address"
          placeholder="Select address"
          @click="showPicker = true"
      />
      <van-popup v-model="showPicker" position="bottom">
        <van-picker
            show-toolbar
            :columns="addresses"
            @confirm="onConfirm"
            @cancel="showPicker = false"
        />
      </van-popup>

      <van-field
          v-model="title"
          name="title"
          label="Title"
          placeholder="Title"
          :rules="[{ required: true, message: 'Title is required' }]"
      />
      <van-field name="severity" label="Severity">
        <template #input>
          <van-rate v-model="severity" :count="10" icon="fire" void-icon="fire-o" color="#ee0a24"/>
        </template>
      </van-field>
      <van-field
          v-model="description"
          type="textarea"
          rows="12"
          maxlength="250"
          name="description"
          label="Description"
          placeholder="Description"
          :rules="[{ required: true, message: 'Description is required' }]"
      />
      <van-field name="uploader" label="Uploader">
        <template #input>
          <van-uploader v-model="uploader" :max-count="1" multiple/>
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">
          Submit
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import {ReverseGeocoding} from "@/services/geocoding/reverseGeocoding";
import {EventBus} from "@/services/common/eventBus";
import {SHOW_ALERT_EVENT} from "@/services/common/events";
import {FirebaseImageUploader} from "@/services/firebase";
import {OccasionsQuerier} from "@/services/occasions/occasions";
import {Toast} from "vant";
import config from "@/assets/config.json"

export default {
  name: 'AddOccasionContainer',
  props: {
    latlng: Object
  },
  data() {
    return {
      addresses: [],

      showPicker: false,

      showLoading: false,

      // form
      title: '',
      description: '',
      severity: 0,
      chosenAddress: '',
      uploader: [],
    };
  },
  mounted() {
    this.reverseGeocoding = new ReverseGeocoding();
    this.reverseGeocoding.getAddress(this.$route.query.latLng).then((resp) => {
      EventBus.$emit(SHOW_ALERT_EVENT, resp);
      for (const [i, result] of resp.data.entries()) {
        this.addresses.push(result.formatted_address);
      }
    });

    this.firebaseImageUploader = new FirebaseImageUploader();
    this.occasionsQuerier = new OccasionsQuerier();
  },
  methods: {
    sanitize() {
      this.chosenAddress = '';
      this.title = '';
      this.description = '';
      this.severity = 0;
      this.uploader = [];
    },
    onConfirm(value) {
      this.chosenAddress = value;
      this.showPicker = false;
    },
    async onSubmit(values) {
      this.showLoading = true;
      const [lat, lng] = this.$route.query.latLng.split(',');
      const imgUrl = await this.uploadImage();
      this.occasionsQuerier.createOccasion({
        image: imgUrl,
        title: values.title,
        address: values.address,
        lat: lat,
        lng: lng,
        description: values.description,
        severity: values.severity
      }).then((resp) => {
        Toast.success("Success");
        EventBus.$emit(SHOW_ALERT_EVENT, resp);
        this.showLoading = false;
        this.sanitize();
      });
    },
    async uploadImage() {
      if (this.uploader.length < 1) {
        return '';
      }
      this.uploader[0].status = 'uploading';
      this.uploader[0].message = 'Uploading...';
      // upload to the folder with raw images
      const imgUrl = await this.firebaseImageUploader.Upload(config.firebase_raw_path, this.uploader[0].file);
      this.uploader[0].status = '';
      this.uploader[0].message = '';
      return imgUrl;
    }
  }
};
</script>

<style scoped>
.display-6 {
  color: #4e4e4e !important;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>