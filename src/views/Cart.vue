<template>
    <div class="container py-4">
      <h1>Shopping Cart</h1>
      
      <!-- Loading indicator -->
      <div v-if="loading" class="text-center my-4">
        Loading...
      </div>
  
      <!-- Error message -->
      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>
  
      <!-- Empty cart message -->
      <div v-else-if="!cartItems.length" class="text-center my-4">
        <p>Your cart is empty</p>
        <router-link to="/products" class="btn btn-primary">
          Continue Shopping
        </router-link>
      </div>
  
      <!-- Cart items -->
      <div v-else>
        <div class="row">
          <div class="col-md-8">
            <!-- Cart items list -->
            <div v-for="item in cartItems" :key="item.id" class="card mb-3">
              <div class="row g-0">
                <div class="col-md-4">
                  <img 
                    :src="item.imageUrl" 
                    :alt="item.name"
                    class="img-fluid rounded-start"
                    style="height: 200px; object-fit: cover;"
                  >
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">{{ item.name }}</h5>
                    <p class="card-text">Price: ${{ item.price.toFixed(2) }}</p>
                    
                    <!-- Quantity selector -->
                    <div class="mb-3">
                      <label class="form-label">Quantity:</label>
                      <select 
                        v-model="item.quantity" 
                        class="form-select"
                        style="width: 100px"
                        @change="updateQuantity(item)"
                      >
                        <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                      </select>
                    </div>
  
                    <!-- Remove button -->
                    <button 
                      @click="removeFromCart(item)"
                      class="btn btn-danger"
                      :disabled="loading"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Order summary -->
          <div class="col-md-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Order Summary</h5>
                <div class="d-flex justify-content-between mb-3">
                  <span>Subtotal:</span>
                  <span>${{ subtotal.toFixed(2) }}</span>
                </div>
                <button 
                  @click="placeOrder"
                  class="btn btn-primary w-100"
                  :disabled="loading || !cartItems.length"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue'
  import { getAuth } from 'firebase/auth'
  import { collection, addDoc, getDocs, doc, deleteDoc,getDoc, updateDoc } from 'firebase/firestore'
  import { db } from '@/firebase'
  
  export default {
    name: 'Cart',
    setup() {
      const cartItems = ref([])
      const loading = ref(true)
      const error = ref(null)

      const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})
  
      // Calculate subtotal
      const subtotal = computed(() => {
        return cartItems.value.reduce((total, item) => {
          return total + (item.price * (item.quantity || 1))
        }, 0)
      })
  
      // Fetch cart items
      const fetchCartItems = async () => {
        try {
          loading.value = true
          error.value = null
          const auth = getAuth()
          const userId = auth.currentUser?.uid
  
          if (!userId) {
            error.value = 'User not authenticated'
            return
          }
  
          console.log('Fetching cart items for user:', userId)
          const querySnapshot = await getDocs(collection(db, `users/${userId}/cart`))
          
          cartItems.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            quantity: 1,
            ...doc.data()
          }))
          
          console.log('Cart items:', cartItems.value)
        } catch (err) {
          console.error('Error fetching cart:', err)
          error.value = 'Error loading cart items'
        } finally {
          loading.value = false
        }
      }
  
      // Remove item from cart
      const removeFromCart = async (item) => {
        try {
          loading.value = true
          const auth = getAuth()
          const userId = auth.currentUser?.uid
          
          if (!userId) return
  
          await deleteDoc(doc(db, `users/${userId}/cart`, item.id))
          cartItems.value = cartItems.value.filter(i => i.id !== item.id)
        } catch (err) {
          console.error('Error removing item:', err)
          error.value = 'Error removing item'
        } finally {
          loading.value = false
        }
      }
  
      // Update quantity
      const updateQuantity = async (item) => {
        try {
          const auth = getAuth()
          const userId = auth.currentUser?.uid
          
          if (!userId) return
  
          await updateDoc(doc(db, `users/${userId}/cart`, item.id), {
            quantity: item.quantity
          })
        } catch (err) {
          console.error('Error updating quantity:', err)
          error.value = 'Error updating quantity'
        }
      }
  
      // Add this to your setup function
const placeOrder = async () => {
  try {
    const auth = getAuth()
    const userId = auth.currentUser?.uid
    
    if (!userId) return

    // Get user data
    const userDoc = await getDoc(doc(db, 'users', userId))
    const userData = userDoc.data()

    // Create order document
    const orderData = {
      userId,
      userEmail: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      items: cartItems.value,
      total: subtotal.value,
      status: 'pending',
      createdAt: new Date(),
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    // Add to orders collection
    const orderRef = await addDoc(collection(db, 'orders'), orderData)

    // Clear cart after successful order
    const cartQuery = await getDocs(collection(db, `users/${userId}/cart`))
    const deletePromises = cartQuery.docs.map(doc => 
      deleteDoc(doc.ref)
    )
    await Promise.all(deletePromises)

    // Show success message
    snackbar.value = {
      show: true,
      text: 'Order placed successfully! Check your email for confirmation.',
      color: 'success'
    }

    // Clear local cart items
    cartItems.value = []

  } catch (err) {
    console.error('Error placing order:', err)
    snackbar.value = {
      show: true,
      text: 'Error placing order',
      color: 'error'
    }
  }
}
  
      // Initialize
      onMounted(() => {
        fetchCartItems()
      })
  
      return {
        cartItems,
        loading,
        error,
        subtotal,
        removeFromCart,
        updateQuantity,
        placeOrder
      }
    }
  }
  </script>