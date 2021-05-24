<template>
  <div class="add-occasion-container">
    <br>
    <h3 class="display-6">Add new occasion</h3>
    <van-divider/>
    <van-form @submit="onSubmit">
      <van-field
          readonly
          clickable
          name="Address"
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
          name="Title"
          label="Title"
          placeholder="Title"
          :rules="[{ required: true, message: 'Title is required' }]"
      />
      <van-field name="severity" label="Severity">
        <template #input>
          <van-rate v-model="severity"/>
        </template>
      </van-field>
      <van-field
          v-model="description"
          type="textarea"
          rows="12"
          maxlength="250"
          name="Description"
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
import firebase from 'firebase/app'
import 'firebase/storate';

export default {
  name: 'AddOccasionContainer',
  props: {
    latlng: Object
  },
  data() {
    return {
      addresses: [],

      showPicker: false,

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
      // this.addresses = resp.data;
    });
  },
  methods: {
    onConfirm(value) {
      this.chosenAddress = value;
      this.showPicker = false;
    },
    onSubmit(values) {
      console.log(values);
    }
  }
};
</script>

<style scoped>
.display-6 {
  color: #4e4e4e !important;
}
</style>