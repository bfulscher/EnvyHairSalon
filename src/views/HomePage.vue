<!-- HomePage.vue -->
<template>
  <div class="home">
    <HeroSection />
    <AboutSection />
    <Footer />
  </div>
</template>

<script>
import HeroSection from '@/components/HeroSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'HomePage',
  components: {
    HeroSection,
    AboutSection,
    Footer  // Added Footer to the components object
  }
}
</script>

<style scoped>
.home {
  overflow-x: hidden;
}
</style>