<template>
  <div class="settings">
    <van-overlay :show="showLoading">
      <div class="wrapper">
        <div class="block">
          <van-loading color="#0094ff"/>
        </div>
      </div>
    </van-overlay>
    <van-divider><h3>Settings</h3></van-divider>
    <van-collapse v-model="activeNames">
      <van-collapse-item title="Personal" name="personal">
        <user-form v-on:user-submit="onSubmit" v-bind:default-data="{
          uploader: this.uploader,
          email: this.email,
          username: this.username,
          password: '',
          password2: '',
          firstName: this.firstName,
          lastName: this.lastName,
        }" ref="userForm"></user-form>
      </van-collapse-item>
      <van-collapse-item title="View" name="view"># TODO </van-collapse-item>
      <van-collapse-item title="Info" name="info"><small>System version: v0.0.1 ©</small></van-collapse-item>
      <van-collapse-item title="Login" name="login">
        <van-button type="info" @click="logout">
          <van-icon name="revoke"/>
          Logout
        </van-button>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
import {EventBus} from "@/services/common/eventBus";
import {SHOW_ALERT_EVENT, UPDATE_ACTIVE_TAB_EVENT} from "@/services/common/events";
import UserForm from "@/components/Login/UserForm";
import {USER_DATA_KEY} from "@/services/common/storage";
import {Toast} from "vant";
import {err} from "@/services/common/errors";
import {UsersQuerier} from "@/services/users";

export default {
  components: {UserForm},
  Name: 'Settings',
  updated() {
    EventBus.$emit(UPDATE_ACTIVE_TAB_EVENT, 2);
  },
  data() {
    return {
      activeNames: [
        'personal'
      ],

      showLoading: false,

      uploader: [],
      email: '',
      username: '',
      password: '',
      password2: '',
      firstName: '',
      lastName: '',
    };
  },
  mounted() {
    this.usersQuerier = new UsersQuerier();
    const user = JSON.parse(localStorage.getItem(USER_DATA_KEY));
    if (user.avatar !== '') {
      this.uploader = [{url: user.avatar}];
    }
    this.email = user.email;
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push('/');
    },
    Success(user) {
      localStorage.setItem(USER_DATA_KEY, user);
      this.$router.push('/');
    },
    onSubmit(values) {
      this.showLoading = true;
      this.$refs.userForm.uploadImage(values.username).then((url) => {
        this.usersQuerier.updateUser({
          avatar: url,
          firstName: values.firstName,
          lastName: values.lastName,
          username: values.username,
          email: values.email,
          password: values.password,
        }).then((resp) => {
          if (!resp.StatusOK()) {
            Promise.reject(resp.Status());
          }
          Toast.success("Success");
          EventBus.$emit(SHOW_ALERT_EVENT, resp);
          this.Success(resp.data);
        }).finally(() => {
          this.showLoading = false;
          if (this.$refs.userForm) {
            this.$refs.userForm.resetLoading();
          }
        });
      }).catch(err);
    },
  }
};
</script>


<style scoped>
.settings {
  height: 100%;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>