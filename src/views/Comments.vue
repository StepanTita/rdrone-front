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
  async mounted() {
    this.commentQuerier = new CommentsQuerier();
    this.updateComments();
  },
  methods: {
    updateComments() {
      this.commentQuerier.getComments().then((resp) => {
        EventBus.$emit(SHOW_ALERT_EVENT, resp);
        this.comments = resp.data;
      });
    }
  },
  components: {
    CommentsList
  }
}
</script>
