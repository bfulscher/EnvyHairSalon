// AboutSection.vue
<template>
  <section id="about-section" class="about-section">
    <div class="divider"></div>
    <div class="container py-5">
      <h2 class="about-title text-center mb-5">About Envy Salon</h2>
      <div class="row align-items-center gx-5">
        <div class="col-lg-6">
          <div class="about-content">
            <p class="about-lead mb-4">
              Welcome to Envy Salon, where style meets sophistication. Our team of expert stylists is dedicated to helping you look and feel your best.
            </p>
            <p class="about-text mb-4">
              With years of experience and a passion for beauty, we offer a wide range of services including:
            </p>
            <ul class="services-list">
              <li>Hair Cutting and Styling</li>
              <li>Color and Highlights</li>
              <li>Hair Treatments</li>
              <li>Styling for Special Occasions</li>
            </ul>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="about-image">
            <img src="@/assets/salon-image.jpg" alt="Envy Salon Interior" class="img-fluid rounded shadow-lg">
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AboutSection'
}
</script>

<style scoped>
.about-section {
  background-color: #ffffff;
  padding: 8rem 0; /* Increased top padding */
  position: relative;
  scroll-margin-top: 90px; /* Add scroll margin to account for navbar */
}

.divider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #000000;
  opacity: 0.1;
}

.about-title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #1a1a1a;
}

.about-lead {
  font-size: 1.5rem;
  line-height: 1.6;
  color: #333;
}

.about-text {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #4a4a4a;
}

.services-list {
  margin-top: 2rem;
  padding-left: 1.5rem;
}

.services-list li {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #4a4a4a;
}

.about-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-height: 500px;
}

@media (max-width: 991.98px) {
  .about-section {
    padding: 6rem 0;
  }

  .about-title {
    font-size: 2.3rem;
  }

  .about-lead {
    font-size: 1.3rem;
  }

  .about-text {
    font-size: 1.1rem;
  }

  .services-list li {
    font-size: 1.1rem;
  }

  .about-image img {
    max-height: 400px;
    margin-top: 3rem;
  }
}
</style>