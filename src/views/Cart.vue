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
                                <img :src="item.imageUrl" :alt="item.name" class="img-fluid rounded-start"
                                    style="height: 200px; object-fit: cover;">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">{{ item.name }}</h5>
                                    <p class="card-text">Price: ${{ item.price.toFixed(2) }}</p>

                                    <!-- Quantity selector -->
                                    <div class="mb-3">
                                        <label class="form-label">Quantity:</label>
                                        <select v-model="item.quantity" class="form-select" style="width: 100px"
                                            @change="updateQuantity(item)">
                                            <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                                        </select>
                                    </div>

                                    <!-- Remove button -->
                                    <button @click="removeFromCart(item)" class="btn btn-danger" :disabled="loading">
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
                            <!-- Add these notifications to your existing template -->
                            <div v-if="error" class="alert alert-danger" role="alert">
                                {{ error }}
                            </div>

                            <div v-if="orderSuccess" class="alert alert-success" role="alert">
                                Order placed successfully! Redirecting to confirmation page...
                            </div>

                            <!-- Update your Place Order button -->
                            <button @click="placeOrder" class="btn btn-primary w-100"
                                :disabled="loading || !cartItems.length">
                                {{ loading ? 'Processing...' : 'Place Order' }}
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
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase'
import { useRouter } from 'vue-router'
import emailjs from '@emailjs/browser'

export default {
    name: 'Cart',
    setup() {
        const router = useRouter()
        const loading = ref(false)
        const error = ref(null)
        const cartItems = ref([])
        const orderSuccess = ref(false)

        // Initialize EmailJS
        emailjs.init("BlpDyN16ixUvZURsi")

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
                const user = auth.currentUser

                if (!user) {
                    error.value = 'Please log in to view cart'
                    return
                }

                const cartRef = collection(db, `users/${user.uid}/cart`)
                const querySnapshot = await getDocs(cartRef)

                cartItems.value = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    quantity: doc.data().quantity || 1
                }))

                console.log('Fetched cart items:', cartItems.value)
            } catch (err) {
                console.error('Error fetching cart:', err)
                error.value = 'Error loading cart items'
            } finally {
                loading.value = false
            }
        }

        // Update quantity
        const updateQuantity = async (item) => {
            try {
                const auth = getAuth()
                const user = auth.currentUser

                if (!user) return

                await updateDoc(doc(db, `users/${user.uid}/cart`, item.id), {
                    quantity: item.quantity
                })
            } catch (err) {
                console.error('Error updating quantity:', err)
                error.value = 'Error updating quantity'
            }
        }

        // Remove from cart
        const removeFromCart = async (item) => {
            try {
                loading.value = true
                const auth = getAuth()
                const user = auth.currentUser

                if (!user) return

                await deleteDoc(doc(db, `users/${user.uid}/cart`, item.id))
                cartItems.value = cartItems.value.filter(i => i.id !== item.id)
            } catch (err) {
                console.error('Error removing item:', err)
                error.value = 'Error removing item'
            } finally {
                loading.value = false
            }
        }

        const sendOrderEmail = async (orderData) => {
            try {
                console.log('Starting to send email...');

                const emailParams = {
                    to_email: orderData.userEmail,
                    to_name: orderData.firstName,
                    order_id: orderData.orderId,
                    from_name: "Your Store Name",
                    items_list: orderData.items.map(item => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">$${item.price.toFixed(2)}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `).join(''),
                    total: orderData.total.toFixed(2)
                };

                console.log('Sending email with params:', emailParams);

                const response = await emailjs.send(
                    "service_v7aun5n", // Replace with the new service ID you get after reconnecting Gmail
                    "template_1784u9s",    // Your template ID
                    emailParams,
                    "BlpDyN16ixUvZURsi"   // Your public key
                );

                console.log('Email sent successfully:', response);
            } catch (err) {
                console.error('Error sending email:', err);
                throw err;
            }
        };

        const placeOrder = async () => {
            try {
                loading.value = true
                error.value = null

                const auth = getAuth()
                const user = auth.currentUser

                if (!user) {
                    error.value = 'Please log in to place an order'
                    return
                }

                const orderData = {
                    orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    userId: user.uid,
                    userEmail: user.email,
                    firstName: user.displayName?.split(' ')[0] || '',
                    lastName: user.displayName?.split(' ')[1] || '',
                    items: cartItems.value.map(item => ({
                        id: item.id,
                        productId: item.productId,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity || 1,
                        imageUrl: item.imageUrl
                    })),
                    total: subtotal.value,
                    status: 'pending',
                    createdAt: serverTimestamp()
                }

                const orderRef = await addDoc(collection(db, 'orders'), orderData)
                console.log('Order created with ID:', orderRef.id)

                await sendOrderEmail(orderData)

                const clearCartPromises = cartItems.value.map(item =>
                    deleteDoc(doc(db, `users/${user.uid}/cart`, item.id))
                )
                await Promise.all(clearCartPromises)

                cartItems.value = []
                orderSuccess.value = true

                setTimeout(() => {
                    router.push({
                        name: 'OrderConfirmation',
                        params: { orderId: orderData.orderId }
                    })
                }, 1500)

            } catch (err) {
                console.error('Error placing order:', err)
                error.value = 'Error placing order. Please try again.'
            } finally {
                loading.value = false
            }
        }



        // Fetch cart items when component mounts
        onMounted(() => {
            fetchCartItems()
        })

        return {
            cartItems,
            loading,
            error,
            orderSuccess,
            subtotal,
            removeFromCart,
            updateQuantity,
            placeOrder
        }
    }
}
</script>