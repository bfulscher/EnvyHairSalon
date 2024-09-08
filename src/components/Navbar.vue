<template>
  <nav class="navbar navbar-expand-lg navbar-light w-100">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <h4>Envy Salon</h4>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav align-items-center">
          <li class="nav-item">
            <a class="nav-link" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">About</a>
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
  name: 'Navbar'
}
</script>
<style scoped>
.navbar {
  padding: 0.75rem 1.5rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.navbar-brand {
  margin-right: 2rem;
}
.navbar-nav {
  gap: 1.5rem;
  padding-right: 1rem;
}
.nav-link {
  color: #000000;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 0.5rem 0.75rem;
  transition: color 0.3s ease;
}
.nav-link:hover {
  color: #EB0A1E;
}
.bi {
  font-size: 1.3rem;
}
.icon-item {
  margin-left: 0.5rem;
}
@media (max-width: 991.98px) {
  .navbar-collapse {
    background-color: #f8f9fa;
    padding: 1rem;
    margin-top: 0.5rem;
  }
 
  .navbar-nav {
    gap: 0.5rem;
    padding-right: 0;
  }
  .icon-item {
    margin-left: 0;
  }
}
</style>