import { createStore } from 'vuex'
import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

import { auth, adminCollection } from '../utils/firebaseConfig'
import firebase from "firebase/compat";

interface State {
  user: firebase.User | null,
  authIsReady: boolean
}

const store = createStore<State>({
  state: {
    user: null,
    authIsReady: false
  },
  mutations: {
    setUser(state, payload){
      state.user = payload
      console.log('user state changed', state.user)
      localStorage.setItem("userData", JSON.stringify(state.user))
    },
    setAuthIsReady(state, payload){
      state.authIsReady = payload
    }
  },
  actions: {
    async login(context, {email, password}){
      console.log('login action')
      await setPersistence(auth, browserLocalPersistence )

      const res = await signInWithEmailAndPassword(auth, email, password )

      if(res){
        const user = res.user
        try {
          const userDoc = await getDoc(doc(adminCollection, user.uid))
          if(userDoc.exists()){
            context.commit('setUser', res.user)
          } else {
            throw new Error("You are not authorized Admin")
          }
        }
        catch (e){
          console.log(e.message)
        }

      } else {
        throw new Error('Could not complete login')
      }
    },

    async logout(context){
      console.log('logout action')

      const res = await signOut(auth)
      console.log(res)
      context.commit('setUser', null)
    }
  },
  modules: {
  }
})


const unsubscribe = onAuthStateChanged(auth, (user) => {
  store.commit('setAuthIsReady', true)
  store.commit('setUser', user)
  unsubscribe()
})

export default store