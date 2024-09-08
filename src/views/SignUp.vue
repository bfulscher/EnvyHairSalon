<!-- <template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h2 class="mb-4">Sign Up</h2>
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
            <button type="submit" class="btn btn-primary">Create Account</button>
          </form>
          <p class="mt-3">
            Already have an account? <router-link to="/signin">Sign In</router-link>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { setDoc, doc } from 'firebase/firestore';
  import { auth, db } from '@/firebase';
  
  export default {
    name: 'SignUp',
    setup() {
      const firstName = ref('');
      const lastName = ref('');
      const email = ref('');
      const password = ref('');
      const router = useRouter();
  
      const handleSignUp = async () => {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value
          });
          router.push('/signin');
        } catch (error) {
          alert(error.message);
        }
      };
  
      return {
        firstName,
        lastName,
        email,
        password,
        handleSignUp
      };
    }
  };
  </script> -->