<template>

  <div v-if="error">{{error}}</div>
  <form>
    <el-input type="email" placeholder="email을 입력하세요" v-model="email">
      <template #prepend>Email:</template>
    </el-input>

    <el-input @keyup.enter="handleSubmit" type="password" placeholder="패스워드를 입력하세요" v-model="password" required>
      <template #prepend>Password:</template>
    </el-input>
    <el-button  @click.prevent="handleSubmit">로그인</el-button>
  </form>
</template>

<script lang="ts">
import { ref, defineComponent} from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElButton, ElInput } from 'element-plus'
export default defineComponent({
  name: "Login",
  components: { ElButton, ElInput},
  setup(){
    const email = ref('')
    const password = ref('')
    const error = ref('')

    const store = useStore()
    const router = useRouter()
    const handleSubmit = async () => {
      console.log("handle login")
      try {
        await store.dispatch("login", {email: email.value, password: password.value})
        await router.push('/')
      } catch (e){
        error.value = e.message
      }

    }

    return {email, password, error, handleSubmit}
  }
})
</script>

<style scoped>
 .el-input {
   width: 90%;
   padding: 10px;
 }

</style>