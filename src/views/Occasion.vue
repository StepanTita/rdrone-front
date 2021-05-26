<template>
  <div class="occasion" v-if="occasion">
    <van-field
        readonly
        :value="occasion.address"
        label="Address"
    />

    <van-field
        readonly
        :value="occasion.title"
        label="Title"
    />
    <van-field label="Severity">
      <template #input>
        <van-rate :value="occasion.severity" :count="10" icon="fire" void-icon="fire-o" color="#ee0a24"/>
      </template>
    </van-field>
    <van-field
        :value="occasion.description"
        type="textarea"
        label="Description"
        readonly
    />
    <van-divider>Occasion image</van-divider>
    <img class="img-thumbnail card-img" v-bind:src="occasion.image" alt="Card image cap" @click="openImagePreview"/>
    <van-divider/>
    <h5 class="card-title">Status: <span class="badge badge-warning">{{ occasion.status }}</span></h5>
    <van-divider>Resolution status</van-divider>
    <br>
    <div class="resolution">
      <van-badge :content="'Voted: ' + occasion.resolved">
        <van-button type="primary" round>Resolve
          <van-icon name="success"/>
        </van-button>
      </van-badge>
      <van-badge :content="'Voted: ' + occasion.rejected">
        <van-button type="warning" round>Reject
          <van-icon name="cross"/>
        </van-button>
      </van-badge>
    </div>
  </div>
  <div v-else>
    <van-overlay :show="showLoading">
      <div class="wrapper">
        <div class="block">
          <van-loading color="#0094ff"/>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
// @ is an alias to /src

import {OccasionsQuerier} from "@/services/occasions/occasionsQuerier";
import {EventBus} from "@/services/common/eventBus";
import {SHOW_ALERT_EVENT} from "@/services/common/events";
import {ImagePreview} from "vant";

export default {
  name: 'Occasion',
  data() {
    return {
      showLoading: true,
      occasion: null,
    };
  },
  mounted() {
    this.occasionsQuerier = new OccasionsQuerier();
    this.occasionsQuerier.getOccasion(this.$route.params.occasion_id).then((resp) => {
      EventBus.$emit(SHOW_ALERT_EVENT, resp);
      this.occasion = resp.data;
      this.showLoading = false;
    });
  },
  methods: {
    openImagePreview() {
      ImagePreview({
        images: [
          this.occasion.image
        ],
      });
    }
  }
};
</script>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

img {
  /*-webkit-filter: blur(2px); !* Safari 6.0 - 9.0 *!*/
  /*filter: blur(2px);*/
  max-height: 150px;
}

.resolution {
  display: flex;
  justify-content: space-around;
}

.occasion {
  overflow: scroll;
  height: 80%;
}
</style>
