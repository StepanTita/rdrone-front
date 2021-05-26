<template>
  <div>
    <van-overlay :show="showLoading">
      <div class="wrapper">
        <div class="block">
          <van-loading color="#0094ff"/>
        </div>
      </div>
    </van-overlay>
    <van-divider><h3>Create new user</h3></van-divider>
    <user-form v-on:user-submit="onSubmit" ref="userForm"/>

    <!-- Remind Password -->
    <div id="formFooter">
      <router-link class="underlineHover" to="/sign-in">Sign in</router-link>
    </div>
  </div>
</template>

<script>


import UserForm from "@/components/Login/UserForm";
import {USER_DATA_KEY} from "@/services/common/storage";
import {Toast} from "vant";
import {EventBus} from "@/services/common/eventBus";
import {err} from "@/services/common/errors";
import {SHOW_ALERT_EVENT} from "@/services/common/events";
import {UsersQuerier} from "@/services/users";

export default {
  components: {UserForm},
  Name: 'SignUp',
  data() {
    return {
      showLoading: false,
    };
  },
  mounted() {
    this.usersQuerier = new UsersQuerier();
  },
  methods: {
    Success(user) {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
      this.$router.push('/');
    },
    onSubmit(values) {
      this.showLoading = true;
      this.$refs.userForm.uploadImage(values.username).then((url) => {
        this.usersQuerier.createUser({
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
  },
};
</script>

<style scoped>

a {
  color: #92badd;
  display: inline-block;
  text-decoration: none;
  font-weight: 400;
}

h2 {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
  margin: 40px 8px 10px 8px;
  color: #cccccc;
}


/* STRUCTURE */

#formFooter {
  background-color: #f6f6f6;
  border-top: 1px solid #dce8f1;
  padding: 25px;
  text-align: center;
  -webkit-border-radius: 0 0 10px 10px;
  border-radius: 0 0 10px 10px;
}


/* TABS */

h2.inactive {
  color: #cccccc;
}

h2.active {
  color: #0d0d0d;
  border-bottom: 2px solid #5fbae9;
}


/* OTHERS */

img {
  max-width: 60px;
  max-height: 60px;
  margin: 20px;

  font-size: 50px;

  /*box-shadow: 0 30px 60px 0 rgba(0, 0, 0, 0.3);*/
}

.is-invalid {
  background-color: rgba(232, 115, 115, 0.1) !important;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>

<style>
.is-invalid .van-field__label {
  color: #dc3545 !important;
}
</style>