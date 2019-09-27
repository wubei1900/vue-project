<template>
  <div>
    <div class="test">{{msg}}</div>
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
@import "@styles/test.css";
</style>