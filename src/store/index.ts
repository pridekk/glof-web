import { createStore } from 'vuex'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../utils/firebaseConfig'
export default createStore({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, payload){
      state.user = payload
      console.log('user state changed', state.user)
    }
  },
  actions: {
    async login(context, {email, password}){
      console.log('login action')

      const res = await signInWithEmailAndPassword(auth, email, password )

      if(res){
        context.commit('setUser', res.user)
      } else {
        throw new Error('Could not complete login')
      }
    },

    async logout(context){
      console.log('logout action')

      const res = await signOut(auth)
      console.log(res)
      context.state.user = null
    }

  },
  modules: {
  }
})

