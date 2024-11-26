import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
// Import components
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import SignUpPage from '../views/SignUpPage.vue'
import BookingPage from '../views/BookingPage.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import Inventory from '../views/Inventory.vue'
import Orders from '../views/Orders.vue'  // Fixed Orders import
import Dashboard from '../views/Dashboard.vue'  // Fixed Dashboard import
import Products from '@/views/Products.vue'
import Cart from '@/views/Cart.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/about',  // Make sure you have this route
    name: 'About',
    component: HomePage  // Or your About component if separate
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpPage
  },
  {
    path: '/booking',
    name: 'Booking',
    component: BookingPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    name: 'Products',
    component: Products
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
  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Update the navigation guard
router.beforeEach(async (to, from, next) => {
  const auth = getAuth()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const currentUser = auth.currentUser

  // Allow access to public routes
  if (!requiresAuth && !requiresAdmin) {
    next()
    return
  }

  // Handle authentication requirement
  if (requiresAuth && !currentUser) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // Handle admin requirement
  if (requiresAdmin && currentUser) {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
      const userData = userDoc.data()
      
      if (!userData?.isAdmin) {
        next('/booking')
        return
      }
      next()
      return
    } catch (error) {
      console.error('Error checking admin status:', error)
      next('/login')
      return
    }
  }

  // If all checks pass, proceed
  next()
})

export default router