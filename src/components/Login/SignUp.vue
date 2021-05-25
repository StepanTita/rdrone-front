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
    <van-form @submit="onSubmit">
      <van-field name="avatar" label="Avatar">
        <template #input>
          <van-uploader v-model="uploader" multiple :max-count="1" :max-size="500 * 1024" @oversize="onOversize"/>
        </template>
      </van-field>

      <van-field
          v-model="firstName"
          name="firstName"
          label="First name"
          placeholder="First name"
          v-model.trim="$v.firstName.$model" :class="$v.firstName.$error ? 'is-invalid': ''"
      />
      <div class="invalid-feedback" v-if="!$v.firstName.required">Field is required</div>
      <div class="invalid-feedback" v-if="!$v.firstName.alpha">Field should only contain letters</div>
      <div class="invalid-feedback" v-if="!$v.firstName.length">Max length is 100</div>

      <van-field
          v-model="lastName"
          name="lastName"
          label="Last name"
          placeholder="Last name"
          v-model.trim="$v.lastName.$model" :class="$v.lastName.$error ? 'is-invalid': ''"
      />
      <div class="invalid-feedback" v-if="!$v.lastName.alpha">Field should only contain letters</div>
      <div class="invalid-feedback" v-if="!$v.lastName.length">Max length is 100</div>

      <van-field
          v-model="email"
          name="email"
          label="Email"
          placeholder="Email"
          v-model.trim="$v.email.$model" :class="$v.email.$error ? 'is-invalid': ''"
      />
      <div class="invalid-feedback" v-if="!$v.email.required">Field is required</div>
      <div class="invalid-feedback" v-if="!$v.email.email">Field should be a valid email</div>
      <div class="invalid-feedback" v-if="!$v.email.length">Max length is 100</div>

      <van-field
          v-model="username"
          name="username"
          label="Username"
          placeholder="Username"
          v-model.trim="$v.username.$model" :class="$v.username.$error ? 'is-invalid': ''"
      />
      <div class="invalid-feedback" v-if="!$v.username.required">Field is required</div>
      <div class="invalid-feedback" v-if="!$v.username.alphaNum">Field should be alphanumeric</div>
      <div class="invalid-feedback" v-if="!$v.username.length">Max length is 100</div>

      <van-field
          v-model="password"
          type="password"
          name="password"
          label="Password"
          placeholder="Password"
          v-model.trim="$v.password.$model" :class="$v.password.$error ? 'is-invalid': ''"
      />
      <div class="invalid-feedback" v-if="!$v.password.required">Field is required</div>
      <div class="invalid-feedback" v-if="!$v.password.min">Length should be at least 6 symbols</div>
      <div class="invalid-feedback" v-if="!$v.password.max">Max length is 30</div>

      <van-field
          v-model="password2"
          type="password"
          label="Repeat password"
          placeholder="Password again"
          v-model.trim="$v.password2.$model" :class="$v.password2.$error ? 'is-invalid': ''"
      />
      <div class="invalid-feedback" v-if="!$v.password2.match">Passwords should match</div>

      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">
          Submit
        </van-button>
      </div>
    </van-form>

    <!-- Remind Password -->
    <div id="formFooter">
      <router-link class="underlineHover" to="/sign-in">Sign in</router-link>
    </div>
  </div>
</template>

<script>
import {alphaNum, email, or, required, alpha, maxLength, sameAs, minLength} from "vuelidate/lib/validators";
import {EventBus} from "@/services/common/eventBus";
import {Toast} from "vant";
import {FirebaseImageUploader} from "@/services/firebase";
import config from "@/assets/config.json";
import {SHOW_ALERT_EVENT} from "@/services/common/events";
import {UsersQuerier} from "@/services/users";
import {USER_DATA_KEY} from "@/services/common/storate";
import {err} from "@/services/common/errors";

export default {
  Name: 'SignUp',
  mounted() {
    this.firebaseImageUploader = new FirebaseImageUploader();
    this.usersQuerier = new UsersQuerier();
  },
  data() {
    return {
      uploader: [],
      email: '',
      username: '',
      password: '',
      password2: '',
      firstName: '',
      lastName: '',

      showLoading: false,
    };
  },
  validations: {
    firstName: {
      required,
      alpha,
      length: maxLength(100),
    },
    lastName: {
      alpha,
      length: maxLength(100),
    },
    username: {
      required,
      alphaNum,
      length: maxLength(100),
    },
    email: {
      required,
      email,
      length: maxLength(100),
    },
    password: {
      required,
      min: minLength(6),
      max: maxLength(30)
    },
    password2: {
      match: sameAs('password')
    }
  },
  methods: {
    Success(user) {
      localStorage.setItem(USER_DATA_KEY, user);
      this.$router.push('/');
    },
    async onSubmit(values) {
      this.$v.$touch();
      if (this.$v.$invalid) {
        Toast.fail('Please, fill the form correctly...');
        return;
      }
      // todo: use decorators for loading
      this.showLoading = true;

      const imgUrl = await this.uploadImage(values.username);

      this.usersQuerier.createUser({
        avatar: imgUrl,
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        email: values.email,
        password: values.password,
      }).catch(err).then((resp) => {
        console.log(resp);
        Toast.success("Success");
        EventBus.$emit(SHOW_ALERT_EVENT, resp);

        this.sanitize();

        this.showLoading = false;
        this.Success(resp.data);
      });

    },
    onOversize(file) {
      console.log(file);
      Toast('File size cannot exceed 500kb');
    },
    async uploadImage(user) {
      if (this.uploader.length < 1) {
        return '';
      }
      this.uploader[0].status = 'uploading';
      this.uploader[0].message = 'Uploading...';
      const imgUrl = await this.firebaseImageUploader.Upload(`${config.firebase_users_path}/${user}`, this.uploader[0].file);
      this.uploader[0].status = '';
      this.uploader[0].message = '';
      return imgUrl;
    },
    sanitize() {
      this.uploader = [];
      this.email = '';
      this.username = '';
      this.password = '';
      this.password2 = '';
      this.firstName = '';
      this.lastName = '';
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