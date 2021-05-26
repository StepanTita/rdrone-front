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
import config from "@/assets/config.json";
import {err} from "@/services/common/errors";

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
    this.reverseGeocoding.getAddress(this.$route.query.latLng).catch(err).then((resp) => {
      EventBus.$emit(SHOW_ALERT_EVENT, resp);
      for (const [i, result] of resp.data.entries()) {
        this.addresses.push(result.formatted_address);
      }
    });

    this.firebaseImageUploader = new FirebaseImageUploader();
    this.occasionsQuerier = new OccasionsQuerier();
  },
  methods: {
    onConfirm(value) {
      this.chosenAddress = value;
      this.showPicker = false;
    },
    async onSubmit(values) {
      this.showLoading = true;
      const [lat, lng] = this.$route.query.latLng.split(',');
      this.uploadImage(values.username).then((url) => {
        this.occasionsQuerier.createOccasion({
          image: url,
          title: values.title,
          address: values.address,
          lat: lat,
          lng: lng,
          description: values.description,
          severity: values.severity
        }).then((resp) => {
          if (!resp.StatusOK()) {
            Promise.reject(resp.Status());
          }
          Toast.success("Success");
          EventBus.$emit(SHOW_ALERT_EVENT, resp);
        })
      }).catch(err).finally(() => {
        this.resetLoading();
      });
    },
    uploadImage() {
      if (this.uploader.length < 1) {
        return '';
      }
      for (let up of this.uploader) {
        up.status = 'uploading';
        up.message = 'Uploading...';
      }
      return this.firebaseImageUploader.upload(config.firebase_raw_path, this.uploader[0].file);
    },
    sanitize() {
      this.chosenAddress = '';
      this.title = '';
      this.description = '';
      this.severity = 0;
      this.uploader = [];
    },
    resetLoading() {
      this.showLoading = false;
      if (this.uploader.length > 0) {
        for (let up of this.uploader) {
          up.status = '';
          up.message = '';
        }
        this.showLoading = false;
      }
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