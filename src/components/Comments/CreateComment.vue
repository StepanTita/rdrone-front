<template>
  <div>
    <van-overlay :show="show">
      <div class="wrapper" v-on:click="toggleOverlay">
        <div class="block" v-on:click.stop>
          <h3>Create new comment:</h3>
          <van-divider/>
          <van-form validate-first @failed="onFailed" @submit="onSubmit">
            <van-field
                v-if="replyTo !== null"
                name="replyTo"
                type="number"
                placeholder="Reply to"
                v-bind:value="replyTo.id"
                disabled
                v-show="false"
            >
            </van-field>
            <van-card
                v-if="replyTo !== null"
                v-bind:title="replyTo.name"
                v-bind:desc="replyTo.text"
                v-bind:thumb="replyTo.avatar"
            >
            </van-card>
            <van-field
                label="Comment:"
                v-model="commentText"
                name="text"
                placeholder="Type your comment here"
                type="textarea"
                rows="12"
                maxlength="250"
                :rules="[{ required: true, message: 'Text is required' }]"
            />
            <div style="margin: 16px;">
              <van-button round block type="info" native-type="submit" :disabled="disableSubmit">
                Submit
              </van-button>
            </div>
          </van-form>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import {EventBus} from "@/services/common/eventBus";
import {END_CREATE_COMMENT_EVENT, SHOW_ALERT_EVENT, UPDATE_COMMENTS_EVENT} from "@/services/common/events";
import {Toast} from "vant";
import {CommentsQuerier} from "@/services/comments/comments";
import {err} from "@/services/common/errors";

export default {
  Name: 'CreateComment',
  props: {
    show: Boolean,
    replyTo: Object
  },
  data() {
    return {
      commentText: '',

      disableSubmit: false,
    };
  },
  mounted() {
    this.commentQuerier = new CommentsQuerier();
  },
  methods: {
    sanitize() {
      this.commentText = '';
    },
    toggleOverlay() {
      EventBus.$emit(END_CREATE_COMMENT_EVENT);
      this.disableSubmit = false;
    },
    onSubmit(values) {
      this.disableSubmit = true;
      this.commentQuerier.createComment(values).then((resp) => {
        if (!resp.StatusOK()) {
          Promise.reject(resp.Status());
        }
        EventBus.$emit(SHOW_ALERT_EVENT, resp);
        Toast.success('Success');
        this.toggleOverlay();
        EventBus.$emit(UPDATE_COMMENTS_EVENT);
      }).catch(err).finally(() => {
        this.sanitize();
      });
    },
    onFailed() {
      Toast.fail('Fail');
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

.block {
  padding: 20px;
  width: 90%;
  height: 68%;
  background-color: #fff;
  border-radius: 15px;
}
</style>