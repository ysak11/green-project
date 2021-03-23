<template>
  <div class="content">
    <div class="header">后台管理系统</div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "Content",

}
</script>

<style scoped>
  .content {
    height: 100vh;
    flex: 1;
    padding: 25px 100px 100px 50px;
    color: #fff;
    background-image: linear-gradient(to bottom right, #718093, #353b48);
    /* background-image: linear-gradient(#e66465, #9198e5); */
  }

  .header {
    height: 70px;
    font-size: 32px;
  }
</style>