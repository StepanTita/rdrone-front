<template>
  <div id="comments-list">
    <div class="container mt-5">
      <div class="row d-flex justify-content-center">
        <div class="col-md-8">
          <div class="headings d-flex justify-content-between align-items-center mb-3">
            <h5>Unread comments(6)</h5>
          </div>
          <div v-for="comment in comments" v-bind:key="comment.id" class="card p-3 mt-2">
            <div v-if="comment.replyTo > comments.length">
              <div class="d-flex justify-content-between align-items-center">
                <div class="user d-flex flex-row align-items-center"><img v-bind:src="comment.avatar" width="30"
                                                                          class="user-img rounded-circle mr-2">
                  <p><small
                      class="font-weight-bold text-primary">{{ comment.name }}</small> <small
                      class="font-weight-bold"> {{ comment.text }} </small></p>
                </div>
                <small>3 days ago</small>
              </div>
              <div class="action d-flex justify-content-between mt-2 align-items-center">
                <div class="reply px-4"><small>Remove</small> <span class="dots"></span> <small>Reply</small> <span
                    class="dots"></span> <small>Translate</small></div>
                <div class="icons align-items-center"><i class="fa fa-user-plus text-muted"></i> <i
                    class="fa fa-star-o text-muted"></i> <i class="fa fa-star text-warning"></i> <i
                    class="fa fa-check-circle-o check-icon text-primary"></i></div>
              </div>
            </div>
            <div v-else>
              <p class="text">Commented on {{ comments[comment.replyTo].name }}</p>
              <div class="d-flex justify-content-between align-items-center reply-comment">
                <div class="user d-flex flex-row align-items-center"><img v-bind:src="comment.avatar" width="30"
                                                                          class="user-img rounded-circle mr-2">
                  <p><small
                      class="font-weight-bold text-primary">{{ comment.name }}</small> <small
                      class="font-weight-bold reply-text"> {{ comment.text }} </small></p>
                </div>
                <small>3 days ago</small>
              </div>
              <div class="action d-flex justify-content-between mt-2 align-items-center">
                <div class="reply px-4"><small>Remove</small> <span class="dots"></span> <small>Reply</small> <span
                    class="dots"></span> <small>Translate</small></div>
                <div class="icons align-items-center"><i class="fa fa-user-plus text-muted"></i> <i
                    class="fa fa-star-o text-muted"></i> <i class="fa fa-star text-warning"></i> <i
                    class="fa fa-check-circle-o check-icon text-primary"></i></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentsList',
  props: {
    comments: Array
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#comments-list {

}

.card {
  border: none;
  box-shadow: 5px 6px 6px 2px #e9ecef;
  border-radius: 4px
}

.dots {
  height: 4px;
  width: 4px;
  margin-bottom: 2px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block
}

.user {
  width: 90%;
}

.user-img {
  margin-top: 4px
}

.check-icon {
  font-size: 17px;
  color: #c3bfbf;
  top: 1px;
  position: relative;
  margin-left: 3px
}

.icons i {
  margin-left: 8px
}

.reply {
  margin-left: 12px
}

.reply small {
  color: #b7b4b4
}

.reply small:hover {
  color: green;
  cursor: pointer
}

.reply-text {
  color: #6a6a6a;
}

.reply-comment {
  background: #F4F4F4;

  width: 95%;

  margin-top: 5px;
  padding: 6px;

  position: relative;
  left: 5%;

  border: none;
  border-radius: 10px;
}

p.text {
  margin-bottom: 0;

  text-align: left;

  color: #8A8A8A !important;
  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"
}
</style>
