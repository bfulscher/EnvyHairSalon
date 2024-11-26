<template>
  <v-app>
    <!-- Show Navbar only on non-admin routes -->
    <Navbar v-if="!isAdminRoute" />
    
    <!-- All routes (both admin and non-admin) -->
    <router-view></router-view>
  </v-app>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const route = useRoute()
const auth = getAuth()
let authUnsubscribe = null
const currentUser = ref(null)

const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})

onMounted(() => {
  console.log('App mounted')
  // Set up auth state listener
  authUnsubscribe = onAuthStateChanged(auth, (user) => {
    console.log('Auth state changed in App:', user ? 'logged in' : 'logged out')
    currentUser.value = user
  })
})

onUnmounted(() => {
  // Clean up auth listener
  if (authUnsubscribe) {
    console.log('Cleaning up auth listener in App')
    authUnsubscribe()
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  min-height: 100vh;
}
</style>