<template>
  <div class="manager">
    <slide/>
    <Content/>
  </div>
</template>

<script>
import Slide from './childCom/slide/Slide';
import Content from './childCom/content/Content';

export default {
  name: "Manager",
  components: {
    Slide,
    Content
  }
}
</script>

<style scoped>
  .manager {
    width: 100vw;
    height: 100vh;
    position: relative;
    background-color: #ccc;

    display: flex;
  }
</style>