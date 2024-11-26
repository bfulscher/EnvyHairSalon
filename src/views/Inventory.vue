<template>
    <div>
      <!-- Main Inventory Page -->
      <div class="d-flex justify-space-between align-center mb-6">
        <h1 class="text-h4">Inventory Management</h1>
        <!-- Simple button click handler -->
        <v-btn
          color="primary"
          @click="openDialog"
          prepend-icon="mdi-plus"
        >
          Add Product
        </v-btn>
      </div>
  
  <!-- Products Data Table -->
  <v-data-table
    :headers="headers"
    :items="products"
    :loading="loading"
    class="elevation-1"
  >
    <!-- Image column -->
    <template v-slot:item.imageUrl="{ item }">
      <v-img
        :src="item.imageUrl"
        :width="50"
        :height="50"
        cover
        class="ma-2"
      >
        <template v-slot:placeholder>
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </template>
      </v-img>
    </template>
  
    <!-- Price column -->
    <template v-slot:item.price="{ item }">
      ${{ item.price.toFixed(2) }}
    </template>
  
    <!-- Actions column -->
    <template v-slot:item.actions="{ item }">
      <v-btn
        icon="mdi-delete"
        color="error"
        variant="text"
        @click="confirmDelete(item)"
        :loading="item.id === deletingId"
      ></v-btn>
    </template>
  </v-data-table>
  
  <!-- Delete Confirmation Dialog -->
  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h5">
        Confirm Delete
      </v-card-title>
      <v-card-text>
        Are you sure you want to delete this product? This action cannot be undone.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="deleteDialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="error"
          variant="text"
          @click="deleteProduct"
          :loading="deleting"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
      <!-- Add Product Dialog -->
      <v-dialog v-model="dialog" width="600" persistent>
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Add New Product</span>
            <v-btn icon="mdi-close" variant="text" @click="closeDialog"></v-btn>
          </v-card-title>
  
          <v-card-text>
            <v-form ref="form" @submit.prevent="handleSubmit">
              <!-- Image Upload -->
              <div class="mb-4">
                <v-file-input
                  v-model="productImage"
                  :rules="imageRules"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  label="Product Image"
                  prepend-icon="mdi-camera"
                  :show-size="true"
                  @change="handleImagePreview"
                  hint="Accepted formats: JPG, JPEG, PNG, GIF, WEBP. Maximum size: 32MB"
                  persistent-hint
                  chips
                  counter
                  :multiple="false"
                ></v-file-input>
  
                <!-- Upload Progress -->
                <v-progress-linear
                  v-if="uploadProgress > 0 && uploadProgress < 100"
                  :model-value="uploadProgress"
                  color="primary"
                  height="25"
                  striped
                >
                  <template v-slot:default="{ value }">
                    <strong>{{ Math.ceil(value) }}%</strong>
                  </template>
                </v-progress-linear>
  
                <!-- Image Preview -->
                <v-img
                  v-if="imagePreview"
                  :src="imagePreview"
                  width="200"
                  height="200"
                  cover
                  class="mx-auto mt-2"
                >
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </div>
                  </template>
                </v-img>
              </div>
  
              <!-- Product Details -->
              <v-text-field
                v-model="productName"
                label="Product Name"
                :rules="nameRules"
                required
              ></v-text-field>
  
              <v-text-field
                v-model="price"
                label="Price"
                prefix="$"
                type="number"
                :rules="priceRules"
                required
              ></v-text-field>
  
              <v-text-field
                v-model="stock"
                label="Stock Quantity"
                type="number"
                :rules="stockRules"
                required
              ></v-text-field>
  
              <!-- Error Alert -->
              <v-alert
                v-if="error"
                type="error"
                class="mb-4"
                closable
              >
                {{ error }}
              </v-alert>
  
              <!-- Submit Button -->
              <v-card-actions class="justify-end">
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="loading"
                  :disabled="loading"
                >
                  Add Product
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
  
      <!-- Snackbar -->
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="3000"
        location="top"
      >
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn
            color="white"
            variant="text"
            @click="snackbar.show = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue'
  
  import { 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs,
    getDoc,
    doc,
    deleteDoc
  } from 'firebase/firestore'
  import { getAuth } from 'firebase/auth'
  import { db } from '@/firebase'
  import axios from 'axios'
  
  // Replace with your ImgBB API key
  const IMGBB_API_KEY = 'a22aa1e912db925a5a7c40046e5f3813'
  
  // Refs
  const form = ref(null)
  const dialog = ref(false)
  const loading = ref(false)
  const error = ref('')
  const imagePreview = ref(null)
  const uploadProgress = ref(0)
  const products = ref([])
  
  const deleteDialog = ref(false)
  const deletingProduct = ref(null)
  const deletingId = ref(null)
  const deleting = ref(false)
  
  // Form fields
  const productImage = ref(null)
  const productName = ref('')
  const price = ref('')
  const stock = ref('')
  
  // Snackbar state
  const snackbar = ref({
    show: false,
    text: '',
    color: 'success'
  })
  
  // Validation Rules
  const nameRules = [
    v => !!v || 'Product name is required',
    v => (v && v.length >= 3) || 'Name must be at least 3 characters'
  ]
  
  const priceRules = [
    v => !!v || 'Price is required',
    v => Number(v) > 0 || 'Price must be greater than 0'
  ]
  
  const stockRules = [
    v => !!v || 'Stock quantity is required',
    v => Number.isInteger(Number(v)) || 'Stock must be a whole number',
    v => Number(v) >= 0 || 'Stock must be 0 or greater'
  ]
  
  const imageRules = [
    value => {
      if (!value) return true // Optional image
      
      const file = Array.isArray(value) ? value[0] : value
      
      if (!file || !file.name) {
        return 'Invalid file'
      }
  
      const fileSizeInMB = (file.size / 1024 / 1024)
      if (fileSizeInMB > 32) {
        return `Image size (${fileSizeInMB.toFixed(2)} MB) exceeds 32MB limit`
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        return 'Please upload a valid image file (JPG, PNG, GIF, or WEBP)'
      }
      
      return true
    }
  ]
  
  // Admin check function
  const checkAdminStatus = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        console.error('No user is signed in');
        return false;
      }
  
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      const userData = userDoc.exists() ? userDoc.data() : null;
      const isAdmin = userData?.isAdmin === true || userData?.role === 'admin';
      
      console.log('Admin status check:', {
        uid: user.uid,
        email: user.email,
        docExists: userDoc.exists(),
        userData: userData,
        isAdmin: isAdmin
      });
  
      return isAdmin;
    } catch (err) {
      console.error('Error checking admin status:', err);
      return false;
    }
  };
  
  // Fetch products function
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'))
      products.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (err) {
      console.error('Error fetching products:', err)
      snackbar.value = {
        show: true,
        text: 'Error loading products',
        color: 'error'
      }
    }
  }
  
  // Upload image to ImgBB
  const uploadToImgBB = async (file) => {
    try {
      const formData = new FormData()
      formData.append('image', file)
      
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, 
        formData,
        {
          onUploadProgress: (progressEvent) => {
            uploadProgress.value = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
          }
        }
      )
      
      console.log('Upload response:', response.data)
      
      return {
        url: response.data.data.url,
        display_url: response.data.data.display_url,
        delete_url: response.data.data.delete_url,
        thumb_url: response.data.data.thumb.url
      }
    } catch (err) {
      console.error('Upload to ImgBB failed:', err)
      throw new Error('Failed to upload image. Please try again.')
    }
  }
  
  // Image preview handler
  const handleImagePreview = (fileInput) => {
    if (!fileInput) {
      imagePreview.value = null
      return
    }
    
    const file = Array.isArray(fileInput) ? fileInput[0] : fileInput
    
    if (!file || !file.name) {
      imagePreview.value = null
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.onerror = (e) => {
      console.error('FileReader error:', e)
      error.value = 'Error reading image file'
      imagePreview.value = null
    }
    reader.readAsDataURL(file)
  }
  
  // Dialog controls
  const openDialog = () => {
    console.log('Opening dialog')
    dialog.value = true
  }
  
  const closeDialog = () => {
    dialog.value = false
    resetForm()
  }
  
  // Reset form
  const resetForm = () => {
    if (form.value) {
      form.value.reset()
    }
    productImage.value = null
    imagePreview.value = null
    productName.value = ''
    price.value = ''
    stock.value = ''
    error.value = ''
  }
  
  // Handle submit
  const handleSubmit = async () => {
    try {
      loading.value = true
      error.value = ''
      uploadProgress.value = 0
  
      // Validate form
      const { valid } = await form.value.validate()
      if (!valid) {
        throw new Error('Please fill all required fields correctly')
      }
  
      // Check admin status
      const isAdmin = await checkAdminStatus()
      if (!isAdmin) {
        throw new Error('You must be an admin to add products')
      }
  
      // Upload image if provided
      let imageData = null
      if (productImage.value) {
        const file = Array.isArray(productImage.value) 
          ? productImage.value[0] 
          : productImage.value
          
        if (file instanceof File) {
          imageData = await uploadToImgBB(file)
        }
      }
  
      // Create product data
      const productData = {
        name: productName.value.trim(),
        price: Number(price.value),
        stock: Number(stock.value),
        imageUrl: imageData?.display_url || null,
        thumbUrl: imageData?.thumb_url || null,
        deleteUrl: imageData?.delete_url || null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
  
      // Add to Firestore
      const docRef = await addDoc(collection(db, 'products'), productData)
      console.log('Product added with ID:', docRef.id)
  
      // Refresh products list
      await fetchProducts()
  
      // Show success message
      snackbar.value = {
        show: true,
        text: 'Product added successfully',
        color: 'success'
      }
  
      // Close dialog and reset form
      closeDialog()
  
    } catch (err) {
      console.error('Submission error:', err)
      error.value = err.message || 'Failed to add product'
      snackbar.value = {
        show: true,
        text: error.value,
        color: 'error'
      }
    } finally {
      loading.value = false
      uploadProgress.value = 0
    }
  }
  
  // Watch dialog state
  watch(dialog, (newValue) => {
    console.log('Dialog state changed:', newValue)
  })
  
  // Initialize component
  onMounted(async () => {
    await fetchProducts()
    const isAdmin = await checkAdminStatus();
    if (!isAdmin) {
      error.value = 'You must be an admin to access this page';
      snackbar.value = {
        show: true,
        text: 'Access denied: Admin privileges required',
        color: 'error'
      };
    }
  })
  
  // Add table headers definition
  const headers = [
    {
      title: 'Image',
      key: 'imageUrl',
      sortable: false,
      align: 'center',
      width: '100px'
    },
    {
      title: 'Product Name',
      key: 'name',
      sortable: true
    },
    {
      title: 'Price',
      key: 'price',
      sortable: true,
      align: 'end'
    },
    {
      title: 'Stock',
      key: 'stock',
      sortable: true,
      align: 'end'
    },
    {
      title: 'Actions',
      key: 'actions',
      sortable: false,
      align: 'center',
      width: '100px'
    }
  ]
  
  // Add these functions
  const confirmDelete = (item) => {
    deletingProduct.value = item
    deleteDialog.value = true
  }
  
  const deleteProduct = async () => {
    try {
      deleting.value = true
      deletingId.value = deletingProduct.value.id
  
      // Check admin status
      const isAdmin = await checkAdminStatus()
      if (!isAdmin) {
        throw new Error('You must be an admin to delete products')
      }
  
      // Delete from Firestore
      await deleteDoc(doc(db, 'products', deletingProduct.value.id))
  
      // Refresh products list
      await fetchProducts()
  
      // Show success message
      snackbar.value = {
        show: true,
        text: 'Product deleted successfully',
        color: 'success'
      }
  
      // Close dialog
      deleteDialog.value = false
      deletingProduct.value = null
  
    } catch (err) {
      console.error('Delete error:', err)
      snackbar.value = {
        show: true,
        text: err.message || 'Failed to delete product',
        color: 'error'
      }
    } finally {
      deleting.value = false
      deletingId.value = null
    }
  }
  </script>
  
  <style scoped>
  .v-dialog {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .v-card {
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .v-data-table {
    margin-top: 16px;
  }
  
  .image-preview {
    max-width: 200px;
    margin: 16px auto;
  }
  </style>
  
  