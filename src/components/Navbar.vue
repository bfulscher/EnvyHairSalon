// NavBar.vue
<template>
  <nav class="navbar navbar-expand-lg navbar-light w-100">
    <div class="container-fluid">
      <router-link class="navbar-brand" :to="{ name: 'Home' }">
        <h3 class="mb-0">Envy Salon</h3>
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
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
            <a class="nav-link" href="#">Appointment</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Products</a>
          </li>
          <li class="nav-item icon-item">
            <a class="nav-link" href="#">
              <i class="bi bi-cart"></i>
            </a>
          </li>
          <li class="nav-item icon-item">
            <a class="nav-link" href="#">
              <i class="bi bi-person-circle"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  methods: {
    scrollToAbout() {
      // First ensure we're on the home page
      if (this.$route.name !== 'Home') {
        this.$router.push({ name: 'Home' }).then(() => {
          // Wait for DOM to update after navigation
          this.$nextTick(() => {
            this.performScroll();
          });
        });
      } else {
        this.performScroll();
      }
    },
    performScroll() {
      // Add a small delay to ensure the about section is mounted
      setTimeout(() => {
        const aboutSection = document.getElementById('about-section');
        const navbar = document.querySelector('.navbar');
        
        if (aboutSection && navbar) {
          const navbarHeight = navbar.offsetHeight;
          const topOffset = aboutSection.offsetTop - navbarHeight;
          
          console.log('Scrolling to:', topOffset);
          console.log('About section found at:', aboutSection.offsetTop);
          console.log('Navbar height:', navbarHeight);
          
          window.scrollTo({
            top: topOffset,
            behavior: 'smooth'
          });
        } else {
          console.warn('About section or navbar not found');
        }
      }, 100);
    }
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