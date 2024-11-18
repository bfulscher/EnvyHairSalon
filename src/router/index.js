// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
<<<<<<< Updated upstream
=======
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
// Import components
>>>>>>> Stashed changes
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import SignUpPage from '../views/SignUpPage.vue'
import BookingPage from '../views/BookingPage.vue'
<<<<<<< Updated upstream
=======
import AdminDashboard from '../views/AdminDashboard.vue'
import Inventory from '../views/Inventory.vue'
import Orders from '../views/Orders.vue'  // Fixed Orders import
import Dashboard from '../views/Dashboard.vue'  // Fixed Dashboard import
import Products from '@/views/Products.vue'
import Cart from '@/views/Cart.vue'
>>>>>>> Stashed changes

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpPage
  },
  {
    path: '/booking',
    name: 'Booking',
<<<<<<< Updated upstream
    component: BookingPage
  }
=======
    component: BookingPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: { requiresAuth: true }  // Added requiresAuth
  },
  {
    path: '/admin',
    component: AdminDashboard,
    meta: { requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: Inventory
      },
      {
        path: 'orders',  // Changed from 'customer' to 'orders'
        name: 'Orders',  // Changed from 'Customers' to 'Orders'
        component: Orders
      }
    ]
  },{
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { requiresAuth: true }
  }
  
  
>>>>>>> Stashed changes
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router