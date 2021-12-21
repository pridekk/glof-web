<template>
  <div class="home">
    HOME {{user}}



  </div>
  <br/>
  <div>{{name}}</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useStore} from 'vuex'
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const getOwner = httpsCallable(functions, 'getOwner');


const store = useStore()
const user = computed(() => store.state.user)

const name = ref('')
onMounted(async  () => {
  let response = await getOwner({ x: "0", y: "0" })
  if (typeof response.data === "string") {
    name.value = JSON.parse(response.data)
  }
})

</script>
