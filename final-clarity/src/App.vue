<template>
  <nav class="navbar">
    <h3 class="text-center">Clarity Management</h3>
  </nav>
  <router-view> </router-view>
  <div></div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.navbar {
  
  background: #007066;
  color: white;
  height: 60px;
  width: 100%;
}
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  /* top:60px; */
  color: white;
  text-align: center;
}
</style>
