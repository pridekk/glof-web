<template>
  <div id="nav">
    <div v-if="user">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link :to="{name: 'Map'}">Map</router-link>
      <el-button @click="handleLogout">logout</el-button>
    </div>
    <div v-if="!user">
      <router-link :to="{name: 'Login'}">Login</router-link>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {computed} from "vue"
import {useStore} from "vuex"

const store = useStore()

const handleLogout = () => {
  store.dispatch('logout')
}

const user = computed(() => store.state.user)

</script>

<style scoped>

</style>