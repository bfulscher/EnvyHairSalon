<template>
  <div class="home">
    <HeroSection />
    <!-- Add any additional content for your homepage here -->
  </div>
</template>

<script>
import HeroSection from '@/components/HeroSection.vue'

export default {
  name: 'HomePage',
  components: {
    HeroSection
  }
}
</script>