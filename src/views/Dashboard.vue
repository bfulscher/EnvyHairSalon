<template>
  <div class="dashboard">
    <h2>Admin Dashboard</h2>
    <div class="row">
      <!-- Total Orders -->
      <div class="col-md-4">
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Total Orders</h5>
            <p class="card-text display-6">{{ totalOrders }}</p>
          </div>
        </div>
      </div>

      <!-- Total Products -->
      <div class="col-md-4">
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Total Products</h5>
            <p class="card-text display-6">{{ totalProducts }}</p>
          </div>
        </div>
      </div>

      <!-- Total Customers -->
      <div class="col-md-4">
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Total Customers</h5>
            <p class="card-text display-6">{{ totalCustomers }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">Recent Orders</h5>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id">
                <td>{{ order.orderId }}</td>
                <td>{{ order.firstName }} {{ order.lastName }}</td>
                <td>{{ formatDate(order.createdAt) }}</td>
                <td>${{ order.total.toFixed(2) }}</td>
                <td>
                  <span :class="getStatusBadgeClass(order.status)">
                    {{ order.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/firebase'

export default {
  name: 'Dashboard',
  setup() {
    const totalOrders = ref(0)
    const totalProducts = ref(0)
    const totalCustomers = ref(0)
    const recentOrders = ref([])

    const fetchDashboardData = async () => {
      try {
        // Fetch orders
        const ordersSnapshot = await getDocs(collection(db, 'orders'))
        totalOrders.value = ordersSnapshot.size

        // Fetch products
        const productsSnapshot = await getDocs(collection(db, 'products'))
        totalProducts.value = productsSnapshot.size

        // Fetch customers (users)
        const usersSnapshot = await getDocs(collection(db, 'users'))
        totalCustomers.value = usersSnapshot.size

        // Fetch recent orders
        const recentOrdersQuery = query(
          collection(db, 'orders'),
          orderBy('createdAt', 'desc'),
          limit(5)
        )
        const recentOrdersSnapshot = await getDocs(recentOrdersQuery)
        recentOrders.value = recentOrdersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    const formatDate = (timestamp) => {
      if (!timestamp) return ''
      const date = timestamp.toDate()
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(date)
    }

    const getStatusBadgeClass = (status) => {
      const classes = {
        pending: 'badge bg-warning',
        confirmed: 'badge bg-success',
        cancelled: 'badge bg-danger'
      }
      return classes[status] || 'badge bg-secondary'
    }

    onMounted(fetchDashboardData)

    return {
      totalOrders,
      totalProducts,
      totalCustomers,
      recentOrders,
      formatDate,
      getStatusBadgeClass
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.badge {
  padding: 0.5em 0.75em;
}
</style>