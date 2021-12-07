import { createStore } from 'vuex'
import {browserLocalPersistence, setPersistence, signInWithEmailAndPassword, signOut} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

import { auth, adminCollection } from '../utils/firebaseConfig'
import firebase from "firebase/compat";

interface State {
  user: firebase.User | null
}
export default createStore<State>({
  state: {
    user: null
  },
  mutations: {
    setUser(state, payload){
      state.user = payload
      console.log('user state changed', state.user)
      localStorage.setItem("userData", JSON.stringify(state.user))
    }
  },
  actions: {
    async login(context, {email, password}){
      console.log('login action')
      await setPersistence(auth, browserLocalPersistence )


      const res = await signInWithEmailAndPassword(auth, email, password )

      if(res){
        // const user = res.user
        // const userDoc = await getDoc(doc(adminCollection, user.uid))
        // if(userDoc.exists()){
        //   context.commit('setUser', res.user)
        // } else {
        //   throw new Error("You are not authorized Admin")
        // }
        context.commit('setUser', res.user)
      } else {
        throw new Error('Could not complete login')
      }
    },

    async logout(context){
      console.log('logout action')

      const res = await signOut(auth)
      console.log(res)
      context.commit('setUser', null)
    },

    async autoLogin(context){

      const userData = localStorage.getItem("userData")
      if(userData){
        context.commit('setUser', JSON.parse(userData))
      }
    }



  },
  modules: {
  }
})

