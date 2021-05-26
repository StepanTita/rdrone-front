<template>
  <div class="about">
    <!-- Error -->
    <van-empty image="error" description="Description"/>
    <!-- Network -->
    <!--    <van-empty image="network" description="Description" />-->
    <!-- Search -->
    <!--    <van-empty image="search" description="Description" />-->
    <router-link plain hairline icon="home" to="/">
      <van-button plain type="info">Home...</van-button>
    </router-link>
  </div>
</template>

<script>
export default {};
</script>


<style scoped>
.about {
  margin-top: 15%;
  font-family: 'KoHo', sans-serif;
  color: #a8a8a8;
}
</style>