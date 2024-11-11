<template>
    <v-navigation-drawer
      class="bg-deep-purple"
      theme="dark"
      permanent
    >
      <div class="d-flex flex-column fill-height">
        <v-list>
          <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            :prepend-icon="item.icon"
            :title="item.title"
            :to="item.to"
            :active="route.path === item.to"
            :class="{ 'v-list-item--active': route.path === item.to }"
            exact
          ></v-list-item>
        </v-list>
        <v-spacer></v-spacer>
        
        <div class="pa-2">
          <v-btn block @click="handleLogout" class="text-none" color="grey-darken-3">
            LOGOUT
          </v-btn>
        </div>
      </div>
    </v-navigation-drawer>
  </template>
  
  <script setup>
  import { useRoute, useRouter } from 'vue-router'
  import { getAuth } from 'firebase/auth'
  
  const route = useRoute()
  const router = useRouter()
  
  const menuItems = [
    {
      icon: 'mdi-view-dashboard',
      title: 'Dashboard',
      to: '/admin'
    },
    {
      icon: 'mdi-package-variant-closed',
      title: 'Inventory',
      to: '/admin/inventory'
    },
    {
      icon: 'mdi-account-multiple',
      title: 'Customers',
      to: '/admin/customer'
    }
  ]
  
  const handleLogout = async () => {
    try {
      const auth = getAuth()
      await auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
  </script>
  
  <style scoped>
  :deep(.v-list-item.v-list-item--active) {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  :deep(.v-list-item) {
    border-radius: 0;
  }
  </style>