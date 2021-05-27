<template>
  <div class="home">
    <CommentsList v-bind:comments="comments"/>
  </div>
</template>

<script>
// @ is an alias to /src
import CommentsList from "@/components/Comments/CommentsList"
import {CommentsQuerier} from "@/services/comments/comments";
import {END_CREATE_COMMENT_EVENT, SHOW_ALERT_EVENT, UPDATE_COMMENTS_EVENT} from "@/services/common/events";
import {EventBus} from "@/services/common/eventBus";
import {err} from "@/services/common/errors";

export default {
  name: 'Comments',
  data() {
    return {
      comments: []
    }
  },
  created() {
    EventBus.$on(UPDATE_COMMENTS_EVENT, this.updateComments)
  },
  mounted() {
    this.commentQuerier = new CommentsQuerier();
    this.updateComments();
  },
  methods: {
    updateComments() {
      this.commentQuerier.getComments(this.$route.occasion_id).then((resp) => {
        if (!resp.StatusOK()) {
          Promise.reject(resp.Status());
        }
        EventBus.$emit(SHOW_ALERT_EVENT, resp);
        this.comments = resp.data;
      }).catch(err);
    }
  },
  components: {
    CommentsList
  }
}
</script>
