<template>
  <section class="hero-section py-5">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6 mb-4 mb-md-0">
          <h1 class="display-4 fw-bold mb-3">Welcome to Envy Hair Salon</h1>
          <p class="lead mb-4">
            Discover the art of beautiful hair at Envy Hair Salon. Our expert stylists are dedicated to bringing out your unique beauty, creating stunning looks that turn heads and boost confidence.
          </p>
          <p class="mb-4">
            From cutting-edge cuts to vibrant colors and luxurious treatments, we offer a full range of services to keep your hair looking its absolute best. Experience the Envy difference today!
          </p>
          <button class="btn btn-primary btn-lg">Book Your Appointment</button>
        </div>
        <div class="col-md-6">
          <img
            src="C:\Users\ybozh\OneDrive\Fall2024\IT391\envy_salon\src\assets\hero.jpg"
            alt="Stylist working on client's hair"
            class="img-fluid rounded shadow"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection'
}
</script>

<style scoped>
.hero-section {
  background-color: #f8f9fa;
}
</style>