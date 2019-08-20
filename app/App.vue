<template>
  <div id="app">
    <div class="test test2">{{msg}}</div>
    <div class="test3"></div>
  </div>
</template>

<script>
export default {
  data() {
    return { msg: "hello world" };
  }
};
</script>

<style>
@import "~@styles/test.css";

.test2 {
  transform: translate(0px, 0px);
  font-size: 16px;
}
</style>