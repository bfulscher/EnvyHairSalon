<template>
  <v-app>
    <v-layout class="fill-height">
      <AdminNavigationDrawer />
      <v-main>
        <v-container fluid class="pa-6">
          <router-view></router-view>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup>
import AdminNavigationDrawer from '@/components/AdminNavigation.vue'
</script>

<style scoped>
:deep(.v-application) {
  min-height: 100vh;
  display: flex;
}

:deep(.v-layout) {
  min-height: 100vh;
}
</style>