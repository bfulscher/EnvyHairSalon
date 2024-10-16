<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Bootstrap Sidebar -->
      <nav id="sidebar" class="col-md-3 col-lg-2 d-md-block bg-light sidebar">
        <div class="position-sticky">
          <ul class="nav flex-column">
            <li class="nav-item">
              <router-link to="/admin/stylists" class="nav-link">
                Stylists
              </router-link>
            </li>
            <!-- Add more sidebar items as needed -->
          </ul>
        </div>
      </nav>

      <!-- Main Content Area -->
      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <!-- PrimeVue Button -->
        <Button label="PrimeVue Button" class="p-button-success my-3" />
        
        <!-- Bootstrap Button -->
        <button class="btn btn-primary my-3 ms-2">Bootstrap Button</button>

        <!-- Router View for child routes -->
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Button from 'primevue/button';

export default {
  name: 'AdminDashboard',
  components: {
    Button
  },
  setup() {
    // Your component logic here
  }
}
</script>

