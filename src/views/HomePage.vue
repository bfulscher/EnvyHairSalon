<template>
  <div class="home-page">
    <main>
      <HeroSection />
      <!-- Add more sections or components for your homepage here -->
    </main>
  </div>
</template>
<script>
import Navbar from '@/components/Navbar.vue'
import HeroSection from '@/components/HeroSection.vue'
export default {
  name: 'HomePage',
  components: {
    Navbar,
    HeroSection
  }
}
</script>

<style scoped>
 
 </style>