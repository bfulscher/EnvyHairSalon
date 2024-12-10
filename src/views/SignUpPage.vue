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
import { 
  createUserWithEmailAndPassword, 
  getAuth, 
  sendEmailVerification,
  fetchSignInMethodsForEmail 
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
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
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailPattern.test(email)
    }

    const checkExistingEmail = async (email) => {
      try {
        const auth = getAuth()
        const signInMethods = await fetchSignInMethodsForEmail(auth, email)
        return signInMethods.length > 0
      } catch (error) {
        console.error('Error checking email:', error)
        return false
      }
    }

    const handleSignUp = async () => {
      loading.value = true
      alert.value = null

      try {
        // Basic validation
        if (!firstName.value.trim() || !lastName.value.trim()) {
          alert.value = {
            type: 'danger',
            message: 'Please fill in all fields'
          }
          return
        }

        // Email validation
        if (!validateEmail(email.value)) {
          alert.value = {
            type: 'danger',
            message: 'Please enter a valid email address'
          }
          return
        }

        // Password validation
        if (password.value.length < 6) {
          alert.value = {
            type: 'danger',
            message: 'Password must be at least 6 characters long'
          }
          return
        }

        // Check if email already exists
        const emailExists = await checkExistingEmail(email.value)
        if (emailExists) {
          alert.value = {
            type: 'danger',
            message: 'This email is already registered. Please login instead.'
          }
          return
        }

        console.log('Creating new user account...')
        const auth = getAuth()
        
        // Create user
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          email.value, 
          password.value
        )
        const user = userCredential.user
        console.log('User created:', user.uid)

        // Send verification email
        await sendEmailVerification(user)
        console.log('Verification email sent')

        // Save user data to Firestore
        const userData = {
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          createdAt: new Date(),
          isAdmin: false,
          emailVerified: false
        }

        await setDoc(doc(db, 'users', user.uid), userData)
        console.log('User data saved to Firestore')

        // Show success message
        alert.value = {
          type: 'success',
          message: 'Account created! Please check your email to verify your account.'
        }

        // Clear form
        firstName.value = ''
        lastName.value = ''
        email.value = ''
        password.value = ''

        // Redirect after delay
        setTimeout(() => {
          router.push('/login')
        }, 3000)

      } catch (error) {
        console.error('Signup error:', error)
        
        let errorMessage = 'An error occurred during signup.'
        
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already registered. Please login instead.'
            break
          case 'auth/invalid-email':
            errorMessage = 'Invalid email format. Please check your email address.'
            break
          case 'auth/weak-password':
            errorMessage = 'Password should be at least 6 characters long.'
            break
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection.'
            break
          default:
            errorMessage = error.message
        }

        alert.value = {
          type: 'danger',
          message: errorMessage
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