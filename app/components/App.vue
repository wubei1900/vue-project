<template>
  <div class="test">{{msg}}</div>
</template>

<script>

export default {
  data() {
    return { msg: "hello world" };
  }
};
</script>

<style scoped>
  @import "@styles/test.css";
</style>