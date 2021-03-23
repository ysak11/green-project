<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
  @import 'assets/css/base.css';

  #app {
    position: relative;
    overflow: hidden;
  }

  input, button {
    outline: none;
    border: none;
  }

  /* 字体图标的初始化 */
  .icon {
    width: 1em; 
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
