// HomePage.vue
<template>
  <div class="home">
    <HeroSection />
    <AboutSection />
  </div>
</template>

<script>
import HeroSection from '@/components/HeroSection.vue'
import AboutSection from '@/components/AboutSection.vue'

export default {
  name: 'HomePage',
  components: {
    HeroSection,
    AboutSection
  }
}
</script>

<style scoped>
.home {
  overflow-x: hidden;
}
</style>