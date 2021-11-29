<template>
  <div class="login">
    <!--
      <img alt="Vue logo" src="../assets/logo.png">
      <HelloWorld msg="Welcome to Your Vue.js App"/>
    -->
    <login-form />
  </div>
</template>

<script>
// @ is an alias to /src
  import LoginForm from '@/components/LoginForm.vue'
  export default {
    name: 'Login',
    components: {
      LoginForm,
    },
  }
</script>
