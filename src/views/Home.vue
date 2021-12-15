<template>
  <div class="home">
    HOME {{user}}


  </div>
</template>

<script lang="ts">
import {computed, defineComponent, watch} from 'vue'
import { useStore} from 'vuex'
import { useRouter } from "vue-router";

export default defineComponent({
  name: 'Home',
  components: {
  },
  setup() {
    const store = useStore()
    const user = computed(() => store.state.user)
    const authIsReady = computed(() => store.state.authIsReady)
    const router = useRouter()

    return { user }
  }
});
</script>
