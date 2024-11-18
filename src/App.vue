<template>
  <v-app>
    <!-- Show Navbar only on non-admin routes -->
    <Navbar v-if="!isAdminRoute" />
    
    <!-- All routes (both admin and non-admin) -->
    <router-view></router-view>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'App',
  components: {
    Navbar
  },
  setup() {
    const route = useRoute()
    const isAdminRoute = computed(() => {
      return route.path.startsWith('/admin')
    })
    return {
      isAdminRoute
    }
  }
}
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