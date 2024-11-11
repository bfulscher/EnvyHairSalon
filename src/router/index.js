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
import Customers from '../views/Customers.vue'
import Dashboard from '../views/Dashboard.vue'
import Products from '@/views/Products.vue'  // Adjust the path as needed
import Cart from '@/views/Cart.vue'  // Fixed this line

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
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
        path: 'customer',
        name: 'Customers',
        component: Customers
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

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const auth = getAuth()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const currentUser = auth.currentUser

  if ((requiresAuth || requiresAdmin) && !currentUser) {
    next('/login')
    return
  }

  // Check if the route is Products
  if (to.name === 'Products' && !currentUser) {
    next({
      path: '/login',
      query: { redirect: 'products' }
    })
    return
  }

  if (requiresAdmin && currentUser) {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
      const userData = userDoc.data()
      
      if (!userData?.isAdmin) {
        next('/booking')
        return
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
      next('/login')
      return
    }
  }

  next()
})

export default router