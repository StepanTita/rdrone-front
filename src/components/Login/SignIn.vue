<template>
  <div>
    <van-overlay :show="showLoading">
      <div class="wrapper">
        <div class="block">
          <van-loading color="#0094ff"/>
        </div>
      </div>
    </van-overlay>
    <!-- Login Form -->
    <form @submit.prevent="onSubmit" novalidate>
      <input type="text" id="login" class="fadeIn second" name="login" placeholder="Username or email"
             v-model.trim="$v.username.$model" :class="$v.username.$error ? 'is-invalid': ''">
      <div class="invalid-feedback" v-if="!$v.username.required">Field is required</div>
      <div class="invalid-feedback" v-if="!$v.username.username">Field should be email or alphanumeric</div>

      <input type="password" id="password" class="fadeIn third" name="password" placeholder="Password"
             v-model.trim="$v.password.$model" :class="$v.password.$error ? 'is-invalid': ''">
      <div class="invalid-feedback" v-if="!$v.password.required">Field is required</div>

      <input type="submit" class="fadeIn fourth" value="Sign In">
    </form>

    <!-- Remind Password -->
    <div id="formFooter">
      <!--      <router-link class="underlineHover" to="#">Forgot Password?</router-link>-->
      <!--      <br>-->
      <router-link class="underlineHover" to="/sign-up">Sign up</router-link>
    </div>
  </div>
</template>

<script>
import {EventBus} from "@/services/common/eventBus";
import * as Events from "@/services/common/events";
import {required, or, email, alphaNum} from 'vuelidate/lib/validators';
import {USER_DATA_KEY} from "@/services/common/storage";
import {Toast} from "vant";
import {SHOW_ALERT_EVENT} from "@/services/common/events";
import {err} from "@/services/common/errors";
import {UsersQuerier} from "@/services/users";

export default {
  Name: 'SignIn',
  mounted() {
    this.usersQuerier = new UsersQuerier();
  },
  data() {
    return {
      username: '',
      password: '',
      showLoading: false,
    };
  },
  validations: {
    username: {
      required,
      username: or(email, alphaNum)
    },
    password: {
      required,
    }
  },
  methods: {
    Success(user) {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
      this.$router.push('/');
    },
    onSubmit(values) {
      this.$v.$touch();

      if (this.$v.$invalid) {
        Toast.fail('Please, fill the form correctly...');
        return;
      }
      this.showLoading = true;

      this.usersQuerier.getUser({
        login: values.login,
        password: values.password
      }).then((resp) => {
        if (!resp.StatusOK()) {
          Promise.reject(resp.Status());
        }
        Toast.success("Success");
        EventBus.$emit(SHOW_ALERT_EVENT, resp);
        this.Success(resp.data);
      }).catch(err).finally(() => {
        this.showLoading = false;
      });
    }
  }
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


/* FORM TYPOGRAPHY*/

input[type=button], input[type=submit], input[type=reset] {
  background-color: #56baed;
  border: none;
  color: white;
  padding: 15px 80px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  text-transform: uppercase;
  font-size: 13px;
  -webkit-box-shadow: 0 10px 30px 0 rgba(95, 186, 233, 0.4);
  box-shadow: 0 10px 30px 0 rgba(95, 186, 233, 0.4);
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
  margin: 5px 20px 40px 20px;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

input[type=button]:hover, input[type=submit]:hover, input[type=reset]:hover {
  background-color: #39ace7;
}

input[type=button]:active, input[type=submit]:active, input[type=reset]:active {
  -moz-transform: scale(0.95);
  -webkit-transform: scale(0.95);
  -o-transform: scale(0.95);
  -ms-transform: scale(0.95);
  transform: scale(0.95);
}

input[type=text], input[type=password] {
  background-color: #f6f6f6;
  border: none;
  color: #0d0d0d;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 5px;
  width: 85%;
  border: 2px solid #f6f6f6;
  -webkit-transition: all 0.5s ease-in-out;
  -moz-transition: all 0.5s ease-in-out;
  -ms-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
}

input[type=text]:focus, input[type=password]:focus {
  background-color: #fff;
  border-bottom: 2px solid #5fbae9;
}

input[type=text]::placeholder, input[type=password]::placeholder {
  color: #cccccc;
}


/* ANIMATIONS */

/* Simple CSS3 Fade-in-down Animation */
.fadeInDown {
  -webkit-animation-name: fadeInDown;
  animation-name: fadeInDown;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@-webkit-keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

/* Simple CSS3 Fade-in Animation */
@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@-moz-keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fadeIn {
  opacity: 0;
  -webkit-animation: fadeIn ease-in 1;
  -moz-animation: fadeIn ease-in 1;
  animation: fadeIn ease-in 1;

  -webkit-animation-fill-mode: forwards;
  -moz-animation-fill-mode: forwards;
  animation-fill-mode: forwards;

  -webkit-animation-duration: 1s;
  -moz-animation-duration: 1s;
  animation-duration: 1s;
}

.fadeIn.first {
  -webkit-animation-delay: 0.4s;
  -moz-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

.fadeIn.second {
  -webkit-animation-delay: 0.6s;
  -moz-animation-delay: 0.6s;
  animation-delay: 0.6s;
}

.fadeIn.third {
  -webkit-animation-delay: 0.8s;
  -moz-animation-delay: 0.8s;
  animation-delay: 0.8s;
}

.fadeIn.fourth {
  -webkit-animation-delay: 1s;
  -moz-animation-delay: 1s;
  animation-delay: 1s;
}

/* Simple CSS3 Fade-in Animation */
.underlineHover:after {
  display: block;
  left: 0;
  bottom: -10px;
  width: 0;
  height: 2px;
  background-color: #56baed;
  content: "";
  transition: width 0.2s;
}

.underlineHover:hover {
  color: #0d0d0d;
}

.underlineHover:hover:after {
  width: 100%;
}


/* OTHERS */

img {
  max-width: 60px;
  max-height: 60px;
  margin: 20px;

  font-size: 50px;

  /*box-shadow: 0 30px 60px 0 rgba(0, 0, 0, 0.3);*/
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.is-invalid {
  background-color: rgba(232, 115, 115, 0.2) !important;
}

</style>