<template>
  <section class="hero-section d-flex align-items-center">
    <div class="container">
      <div class="row align-items-center gx-5">
        <div class="col-md-6 content-column">
          <div class="content-wrapper">
            <h1 class="hero-title mb-4">Welcome to Envy Hair Salon</h1>
            <p class="hero-lead mb-4">
              Discover the art of beautiful hair at Envy Hair Salon. Our expert stylists are dedicated to bringing out your unique beauty.
            </p>
            <p class="hero-text mb-5">
              From cutting-edge cuts to vibrant colors and luxurious treatments, we offer a full range of services to keep your hair looking its absolute best.
            </p>
            <button @click="goToLogin" class="btn btn-primary btn-md px-4 py-2">Book Your Appointment</button>
          </div>
        </div>
        <div class="col-md-6">
          <div class="image-wrapper">
            <img
              src="@/assets/hero.jpg"
              alt="Stylist working on client's hair"
              class="hero-image rounded shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  name: 'HeroSection',
  setup() {
    const router = useRouter()
    const goToLogin = () => {
      router.push('/login')
    }
    return {
      goToLogin
    }
  }
}
</script>

<style scoped>
.hero-section {
  min-height: calc(100vh - 90px);
  background-color: #f8f9fa;
  padding: 6rem 0;
  overflow: hidden;
}

.content-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 2rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: #1a1a1a;
}

.hero-lead {
  font-size: 1.5rem;
  line-height: 1.5;
  color: #333;
}

.hero-text {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #4a4a4a;
}

.image-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.hero-image {
  width: 100%;
  height: 500px;
  object-fit: cover;
  object-position: center;
}

.btn-primary {
  background-color: #EB0A1E;
  border-color: #EB0A1E;
  font-weight: 600;
  font-size: 1.1rem;
  transition: transform 0.2s ease;
  width: auto;
  min-width: 200px; /* Set minimum width */
  max-width: 250px; /* Set maximum width */
}

.btn-primary:hover {
  transform: translateY(-2px);
  background-color: #d00919;
  border-color: #d00919;
}

@media (max-width: 768px) {
  .hero-section {
    min-height: auto;
    padding: 4rem 0;
  }

  .content-wrapper {
    padding-right: 0;
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-lead {
    font-size: 1.25rem;
  }

  .hero-text {
    font-size: 1.1rem;
  }

  .image-wrapper {
    padding: 1rem;
    margin-top: 2rem;
  }

  .hero-image {
    height: 400px;
  }

  .btn-primary {
    margin: 0 auto;
  }
}
</style>