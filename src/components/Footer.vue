<!-- Footer.vue -->
<template>
    <footer class="footer">
      <div class="footer-content">
        <p class="footer-text">Envy Hair Salon</p>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'Footer'
  }
  </script>
  
  <style scoped>
  .footer {
    background-color: #333;
    color: white;
    padding: 1rem 0;
    margin-top: auto;
    width: 100%;
  }
  
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
  }
  
  .footer-text {
    margin: 0;
    font-size: 1.1rem;
  }
  </style>