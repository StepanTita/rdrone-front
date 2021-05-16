<template>
  <div class="home">
    <CommentsList v-bind:comments="comments"/>
  </div>
</template>

<script>
// @ is an alias to /src
import CommentsList from "@/components/CommentsList"
import {CommentsQuerier} from "@/services/comments/comments";
import {SHOW_ALERT_EVENT} from "@/services/common/events";
import {EventBus} from "@/services/common/eventBus";

export default {
  name: 'Comments',
  data() {
    return {
      comments: []
    }
  },
  async mounted() {
    this.commentQuerier = new CommentsQuerier();
    this.commentQuerier.getComments().then((resp) => {
      console.log("emitting...");
      EventBus.$emit(SHOW_ALERT_EVENT, resp);
      this.comments = resp.data;
    });
  },
  components: {
    CommentsList
  }
}
</script>
