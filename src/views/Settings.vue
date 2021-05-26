<template>
  <div class="settings">
    <van-divider><h3>Settings</h3></van-divider>
    <van-collapse v-model="activeNames">
      <van-collapse-item title="Personal" name="personal">

      </van-collapse-item>
      <van-collapse-item title="View" name="view">View</van-collapse-item>
      <van-collapse-item title="Info" name="info">Info</van-collapse-item>
      <van-collapse-item title="Login" name="login">
        <van-button type="info" @click="logout">
          <van-icon name="revoke" /> Logout
        </van-button>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
export default {
  Name: 'Settings',
  data() {
    return {
      activeNames: [
          'personal'
      ],
    };
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push('/');
    }
  }
};
</script>


<style scoped>
</style>