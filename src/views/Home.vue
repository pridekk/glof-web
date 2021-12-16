<template>
  <div class="home">
    HOME {{user}}


  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useStore} from 'vuex'


const store = useStore()
const user = computed(() => store.state.user)


</script>
