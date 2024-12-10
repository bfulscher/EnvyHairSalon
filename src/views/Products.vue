<template>
  <v-container fluid>
    <!-- [Previous template code remains the same] -->
    <v-row class="mb-6">
      <v-col>
        <h1 class="text-h4">Our Products</h1>
        <div v-if="loading">Loading...</div>
        <div v-else>
          Products loaded: {{ products.length }}
        </div>
      </v-col>
    </v-row>

    <v-row v-if="loading" justify="center">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card height="100%">
          <div class="image-container">
            <v-img
              :src="product.imageUrl"
              height="200"
              :aspect-ratio="1"
              class="product-image"
              contain
            >
              <template v-slot:placeholder>
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </template>
            </v-img>
          </div>

          <v-card-title class="text-truncate">{{ product.name }}</v-card-title>

          <v-card-text>
            <div class="text-h6 mb-2">${{ product.price?.toFixed(2) }}</div>

            <v-chip
              :color="product.stock > 0 ? 'success' : 'error'"
              size="small"
              class="mb-3"
            >
              {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
            </v-chip>

            <v-select
              v-if="product.stock > 0"
              v-model="product.selectedQuantity"
              :items="getQuantityOptions(product.stock)"
              label="Quantity"
              class="mb-2"
              hide-details
            ></v-select>
          </v-card-text>

          <v-card-actions class="mt-auto">
            <v-btn
              block
              color="primary"
              :disabled="product.stock === 0"
              @click="addToCart(product)"
              :loading="addingToCart === product.id"
            >
              Add to Cart
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
collection, 
getDocs, 
addDoc,
doc, 
getFirestore 
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '@/firebase'

// State
const products = ref([])
const loading = ref(true)
const addingToCart = ref(null)
const snackbar = ref({
show: false,
text: '',
color: 'success'
})

// Fetch products from Firestore
const fetchProducts = async () => {
try {
  console.log('Fetching products...')
  loading.value = true
  
  const querySnapshot = await getDocs(collection(db, 'products'))
  console.log('Query snapshot:', querySnapshot)
  
  products.value = querySnapshot.docs.map(doc => {
    const data = doc.data()
    console.log('Product data:', data)
    return {
      id: doc.id,
      selectedQuantity: 1,
      ...data
    }
  })
  
  console.log('Processed products:', products.value)
} catch (err) {
  console.error('Error fetching products:', err)
  snackbar.value = {
    show: true,
    text: 'Error loading products: ' + err.message,
    color: 'error'
  }
} finally {
  loading.value = false
}
}

// Generate quantity options based on available stock
const getQuantityOptions = (stock) => {
const maxOptions = Math.min(stock, 10)
return Array.from({ length: maxOptions }, (_, i) => ({
  title: (i + 1).toString(),
  value: i + 1
}))
}

const addToCart = async (product) => {
try {
  const auth = getAuth()
  const userId = auth.currentUser?.uid
  
  if (!userId) {
    snackbar.value = {
      show: true,
      text: 'Please log in to add items to cart',
      color: 'error'
    }
    return
  }

  addingToCart.value = product.id
  
  const cartCollectionRef = collection(db, 'users', userId, 'cart')
  const newCartItem = {
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    quantity: product.selectedQuantity || 1,
    productId: product.id,
    createdAt: new Date()
  }
  
  await addDoc(cartCollectionRef, newCartItem)
  
  snackbar.value = {
    show: true,
    text: 'Added to cart successfully',
    color: 'success'
  }
} catch (err) {
  console.error('Error adding to cart:', err)
  snackbar.value = {
    show: true,
    text: 'Error adding to cart: ' + err.message,
    color: 'error'
  }
} finally {
  addingToCart.value = null
}
}

// Initialize component
onMounted(() => {
fetchProducts()
})
</script>

<style scoped>
.v-card {
display: flex;
flex-direction: column;
}

.v-card-actions {
margin-top: auto;
padding: 16px;
}

.image-container {
background-color: white;
padding: 1rem;
display: flex;
align-items: center;
justify-content: center;
}

.product-image {
transition: transform 0.2s;
}

.product-image:hover {
transform: scale(1.05);
}

:deep(.v-img__img) {
object-fit: contain !important;
background-color: white;
}
</style>