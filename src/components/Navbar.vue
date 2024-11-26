<template>
  <nav class="navbar navbar-expand-lg navbar-light w-100">
    <div class="container-fluid">
      <router-link class="navbar-brand" :to="{ name: 'Home' }">
        <h3 class="mb-0">Envy Salon</h3>
      </router-link>
      
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav align-items-center">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Home' }">Home</router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" @click.prevent="scrollToAbout" href="#">About</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" @click.prevent="handleAppointmentClick" href="#">Appointment</a>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Products' }">Products</router-link>
          </li>
          <li v-if="currentUser" class="nav-item">
            <router-link class="nav-link" :to="{ name: 'Cart' }">
              <i class="bi bi-cart"></i>
            </router-link>
          </li>
          <!-- User dropdown -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
              <i class="bi bi-person-circle"></i>
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <template v-if="currentUser">
                <li><span class="dropdown-item-text">{{ currentUser.email }}</span></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" @click="handleLogout">Logout</a></li>
              </template>
              <template v-else>
                <li><router-link class="dropdown-item" to="/login">Login</router-link></li>
                <li><router-link class="dropdown-item" to="/signup">Sign Up</router-link></li>
              </template>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentUser = ref(null)
const auth = getAuth()

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user
  })
})

const scrollToAbout = () => {
  // If on home page, scroll to about section
  if (router.currentRoute.value.name === 'Home') {
    const aboutSection = document.querySelector('#about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  } else {
    // If not on home page, navigate to home and then scroll
    router.push('/').then(() => {
      setTimeout(() => {
        const aboutSection = document.querySelector('#about')
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100) // Small delay to ensure DOM is updated
    })
  }
}

const handleAppointmentClick = () => {
  if (currentUser.value) {
    router.push('/booking')
  } else {
    router.push({
      path: '/login',
      query: { redirect: 'booking' }
    })
  }
}

const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<style scoped>
.navbar {
  padding: 1.25rem 2rem; /* Increased padding */
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar-brand {
  margin-right: 3rem; /* Increased margin */
}

.navbar-brand h3 {
  font-size: 2rem; /* Larger brand text */
  font-weight: 700;
  color: #1a1a1a;
}

.navbar-nav {
  gap: 2rem; /* Increased gap between nav items */
  padding-right: 1.5rem;
}

.nav-link {
  color: #1a1a1a;
  font-weight: 600;
  font-size: 1.25rem; /* Larger nav text */
  padding: 0.75rem 1rem; /* Increased padding */
  transition: color 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #EB0A1E;
}

/* Optional: Add underline effect on hover */
.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 50%;
  background-color: #EB0A1E;
  transition: all 0.3s ease;
}

.nav-link:hover::after {
  width: 80%;
  left: 10%;
}

.bi {
  font-size: 1.5rem; /* Larger icons */
}

.icon-item {
  margin-left: 0.75rem;
}

/* Update HeroSection offset to account for larger navbar */
:deep(.hero-section) {
  min-height: calc(100vh - 90px); /* Updated to account for larger navbar */
}

@media (max-width: 991.98px) {
  .navbar {
    padding: 1rem 1.5rem;
  }

  .navbar-collapse {
    background-color: #f8f9fa;
    padding: 1.5rem;
    margin-top: 0.75rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
 
  .navbar-nav {
    gap: 0.75rem;
    padding-right: 0;
  }

  .nav-link {
    padding: 0.5rem 0.75rem;
  }

  .icon-item {
    margin-left: 0;
  }

  .navbar-brand h3 {
    font-size: 1.75rem;
  }
}
</style>