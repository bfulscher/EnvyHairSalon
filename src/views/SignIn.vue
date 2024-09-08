<!-- <template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h2 class="mb-4">Sign In</h2>
          <form @submit.prevent="handleSignIn">
            <div class="mb-3">
              <label for="email" class="form-label">Email address</label>
              <input type="email" class="form-control" id="email" v-model="email" required>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control" id="password" v-model="password" required>
            </div>
            <button type="submit" class="btn btn-primary">Sign In</button>
          </form>
          <p class="mt-3">
            Don't have an account? <router-link to="/signup">Sign Up</router-link>
          </p>
          <p>
            <a href="#" @click.prevent="handleForgotPassword">Forgot Password?</a>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
  import { auth } from '@/firebase';
  
  export default {
    name: 'SignIn',
    setup() {
      const email = ref('');
      const password = ref('');
      const router = useRouter();
  
      const handleSignIn = async () => {
        try {
          await signInWithEmailAndPassword(auth, email.value, password.value);
          router.push('/appointment');
        } catch (error) {
          alert(error.message);
        }
      };
  
      const handleForgotPassword = async () => {
        if (email.value) {
          try {
            await sendPasswordResetEmail(auth, email.value);
            alert('Password reset email sent. Please check your inbox.');
          } catch (error) {
            alert(error.message);
          }
        } else {
          alert('Please enter your email address.');
        }
      };
  
      return {
        email,
        password,
        handleSignIn,
        handleForgotPassword
      };
    }
  };
  </script> -->