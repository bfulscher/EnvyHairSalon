<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title text-center mb-4">Sign Up</h2>
            <div v-if="alert" :class="`alert alert-${alert.type}`" role="alert">
              {{ alert.message }}
            </div>
            <form @submit.prevent="handleSignUp">
              <div class="mb-3">
                <label for="firstName" class="form-label">First Name</label>
                <input type="text" class="form-control" id="firstName" v-model="firstName" required>
              </div>
              <div class="mb-3">
                <label for="lastName" class="form-label">Last Name</label>
                <input type="text" class="form-control" id="lastName" v-model="lastName" required>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" v-model="email" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" v-model="password" required>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  {{ loading ? 'Creating Account...' : 'Create Account' }}
                </button>
              </div>
            </form>
            <div class="mt-3 text-center">
              <p>Already have an account? <a href="#" @click.prevent="goToLogin">Login</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { createUserWithEmailAndPassword, getAuth, fetchSignInMethodsForEmail } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import { db } from '../firebase'

export default {
  name: 'SignUpPage',
  setup() {
    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')
    const password = ref('')
    const router = useRouter()
    const loading = ref(false)
    const alert = ref(null)

    
    const validateEmail = (email) => {
      // Basic email regex pattern
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailPattern.test(email)
    }

    const handleSignUp = async () => {
      loading.value = true
      alert.value = null

      try {
        // First validate email format
        if (!validateEmail(email.value)) {
          alert.value = {
            type: 'danger',
            message: 'Please enter a valid email address'
          }
          return
        }

        const auth = getAuth()
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
        const user = userCredential.user

        // Send verification email
        await sendEmailVerification(user)
        
        // Save user data to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          createdAt: new Date(),
          isAdmin: false,
          emailVerified: false
        })

        alert.value = { 
          type: 'success', 
          message: 'Please check your email to verify your account before logging in.' 
        }
        
        setTimeout(() => {
          router.push('/login')
        }, 3000)

      } catch (error) {
        console.error('Sign up error:', error)
        if (error.code === 'auth/email-already-in-use') {
          alert.value = {
            type: 'danger',
            message: 'This email already has an account. Please login instead.'
          }
        } else if (error.code === 'auth/invalid-email') {
          alert.value = {
            type: 'danger',
            message: 'Invalid email format. Please check your email address.'
          }
        } else {
          alert.value = { 
            type: 'danger', 
            message: error.message || 'An error occurred during sign up. Please try again.' 
          }
        }
      } finally {
        loading.value = false
      }
    }

    const goToLogin = () => {
      router.push('/login')
    }

    return {
      firstName,
      lastName,
      email,
      password,
      handleSignUp,
      goToLogin,
      loading,
      alert
    }
  }
}
</script>