<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title text-center mb-4">Login</h2>
            <div v-if="alert" :class="`alert alert-${alert.type}`" role="alert">
              {{ alert.message }}
            </div>
            <form @submit.prevent="handleLogin">
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
                  {{ loading ? 'Logging in...' : 'Login' }}
                </button>
              </div>
            </form>
            <div class="mt-3 text-center">
              <p>Don't have an account? <a href="#" @click.prevent="goToSignUp">Sign up</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginPage',
  setup() {
    const email = ref('')
    const password = ref('')
    const router = useRouter()
    const loading = ref(false)
    const alert = ref(null)

    const handleLogin = async () => {
      loading.value = true
      alert.value = null

      try {
        const auth = getAuth()
        await signInWithEmailAndPassword(auth, email.value, password.value)
        alert.value = { type: 'success', message: 'Login successful! Redirecting to booking page...' }
       
        // Redirect to booking page after successful login
        setTimeout(() => {
          router.push('/booking')
        }, 1500)
      } catch (error) {
        console.error('Login error:', error.message)
        if (error.code === 'auth/user-not-found') {
          alert.value = { type: 'danger', message: 'Email does not exist. Please check your email or sign up.' }
        } else if (error.code === 'auth/wrong-password') {
          alert.value = { type: 'danger', message: 'Incorrect password. Please try again.' }
        } else {
          alert.value = { type: 'danger', message: 'An error occurred during login. Please try again.' }
        }
      } finally {
        loading.value = false
      }
    }

    const goToSignUp = () => {
      router.push('/signup')
    }

    return {
      email,
      password,
      handleLogin,
      goToSignUp,
      loading,
      alert
    }
  }
}
</script>
