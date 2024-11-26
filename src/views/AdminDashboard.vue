<!-- AdminDashboard.vue -->
<template>
  <v-layout>
    <!-- Import your AdminNavigation component here -->
    <AdminNavigation />
    
    <v-main>
      <!-- Your dashboard content goes here -->
      <router-view></router-view>
    </v-main>
  </v-layout>
</template>

<script setup>
import AdminNavigation from '@/components/AdminNavigation.vue'
</script>