<template>
  <div class="booking-page p-4">
    <div class="card">
      <h1 class="text-3xl font-bold mb-4">Book Your Appointment</h1>
      
      <!-- Booking Form Section -->
      <div class="booking-form mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-field">
            <label for="datePicker" class="block mb-2">Select Date</label>
            <Calendar 
              id="datePicker"
              v-model="selectedDate" 
              :minDate="minimumBookingDate" 
              :maxDate="maxDate" 
              dateFormat="dd/mm/yy" 
              showIcon
              class="w-full mb-4"
            />
          </div>
          
          <div class="p-field">
            <label for="timePicker" class="block mb-2">Select Time</label>
            <Dropdown 
              id="timePicker"
              v-model="selectedTime" 
              :options="timeSlots" 
              optionLabel="label" 
              optionValue="value" 
              placeholder="Select a time" 
              class="w-full"
            />
          </div>
        </div>
        
        <Button 
          @click="bookAppointment" 
          :label="loading ? 'Booking...' : 'Book Appointment'" 
          :disabled="loading || !isValidBooking"
          icon="pi pi-calendar-plus"
          class="mt-4 w-full md:w-auto mb-4 p-button-md"
          style="border-radius: 12px; padding: .3rem"
        />
      </div>
      
      <!-- Appointments TabView Section -->
      <div class="appointments-section">
        <h2 class="text-2xl font-semibold mb-4">Your Appointments</h2>
        <TabView>
          <TabPanel header="Upcoming Appointments">
            <div v-if="upcomingAppointments.length === 0" class="p-4 text-gray-500">
              No upcoming appointments
            </div>
            <ul v-else class="appointment-list">
              <li v-for="appointment in upcomingAppointments" 
                  :key="appointment.id" 
                  class="appointment-item">
                <div class="flex justify-between items-center">
                  <div>
                    <i class="pi pi-calendar mr-2"></i>
                    {{ formatDate(appointment.date) }} at {{ formatTime(appointment.time) }}
                  </div>
                  <Tag :value="appointment.status" :severity="getStatusSeverity(appointment.status)" />
                </div>
              </li>
            </ul>
          </TabPanel>
          
          <TabPanel header="Past Appointments">
            <div v-if="pastAppointments.length === 0" class="p-4 text-gray-500">
              No past appointments
            </div>
            <ul v-else class="appointment-list">
              <li v-for="appointment in pastAppointments" 
                  :key="appointment.id" 
                  class="appointment-item">
                <div class="flex justify-between items-center">
                  <div>
                    <i class="pi pi-calendar-minus mr-2"></i>
                    {{ formatDate(appointment.date) }} at {{ formatTime(appointment.time) }}
                  </div>
                  <Tag value="completed" severity="success" />
                </div>
              </li>
            </ul>
          </TabPanel>
        </TabView>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, doc, updateDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const auth = getAuth();
const selectedDate = ref(new Date());
const selectedTime = ref(null);
const userAppointments = ref([]);
const loading = ref(false);

// Computed Properties
const minimumBookingDate = computed(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
});

const maxDate = computed(() => {
  const date = new Date();
  date.setDate(date.getDate() + 30); // Allow booking up to 30 days in advance
  return date;
});

const isValidBooking = computed(() => {
  if (!selectedDate.value || !selectedTime.value) return false;
  
  const bookingDateTime = new Date(selectedDate.value);
  const [hours, minutes] = selectedTime.value.split(':');
  bookingDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  const minimumDateTime = minimumBookingDate.value;
  
  return bookingDateTime >= minimumDateTime;
});

const timeSlots = computed(() => {
  const slots = [];
  for (let hour = 9; hour <= 16; hour++) {
    for (let minute of ['00', '30']) {
      const time24 = `${hour.toString().padStart(2, '0')}:${minute}`;
      const time12 = formatTime(time24);
      slots.push({ label: time12, value: time24 });
    }
  }
  return slots;
});

const upcomingAppointments = computed(() => {
  const now = new Date();
  return userAppointments.value
    .filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= now;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
});

const pastAppointments = computed(() => {
  const now = new Date();
  return userAppointments.value
    .filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate < now;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
});

// Helper Functions
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

const getStatusSeverity = (status) => {
  const severityMap = {
    'active': 'success',
    'pending': 'warning',
    'cancelled': 'danger'
  };
  return severityMap[status] || 'info';
};

// Create a function to combine date and time
const createAppointmentDateTime = (date, time) => {
  const [hours, minutes] = time.split(':');
  const appointmentDate = new Date(date);
  appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return appointmentDate;
};

// Main Functions
const bookAppointment = async () => {
  if (!isValidBooking.value) {
    alert('Please select a valid date and time at least one day in advance');
    return;
  }

  loading.value = true;
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Create a proper date-time combination
    const appointmentDateTime = createAppointmentDateTime(selectedDate.value, selectedTime.value);

    const appointmentData = {
      date: appointmentDateTime.toISOString(), // Store as ISO string
      time: selectedTime.value,
      status: 'active',
      userId: user.uid,
      createdAt: new Date().toISOString()
    };

    // Add to appointments collection
    const appointmentRef = await addDoc(collection(db, 'appointments'), appointmentData);
    const appointmentWithId = {
      id: appointmentRef.id,
      ...appointmentData
    };

    // Get current user appointments
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    let currentAppointments = [];
    if (userDoc.exists()) {
      currentAppointments = userDoc.data().appointments || [];
    }

    // Update user document with new appointment
    await updateDoc(userRef, {
      appointments: [...currentAppointments, appointmentWithId]
    });

    // Update local state
    userAppointments.value = [...currentAppointments, appointmentWithId];

    alert('Appointment booked successfully!');
    selectedTime.value = null;
  } catch (error) {
    console.error('Error booking appointment:', error);
    alert(`Failed to book appointment: ${error.message}`);
  } finally {
    loading.value = false;
  }
};

// Lifecycle Hooks
onMounted(async () => {
  const user = auth.currentUser;
  if (user) {
    const userRef = doc(db, 'users', user.uid);
    
    // Initial fetch
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      userAppointments.value = userDoc.data().appointments || [];
    }
    
    // Set up real-time listener
    onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        userAppointments.value = doc.data().appointments || [];
      }
    });
  }
});
</script>

<style scoped>
.booking-page {
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: var(--surface-card);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
}

.appointment-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.appointment-item {
  padding: 1rem;
  margin-bottom: 0.5rem;
  background-color: var(--surface-section);
  border-radius: var(--border-radius);
  transition: background-color 0.2s;
}

.appointment-item:hover {
  background-color: var(--surface-hover);
}

:deep(.p-calendar) {
  width: 100%;
}

:deep(.p-dropdown) {
  width: 100%;
}

:deep(.p-tabview-panels) {
  padding: 1.5rem 0;
  padding-left: 0 !important;
}

:deep(.p-tabview-nav) {
  border-bottom: 2px solid var(--surface-border);
  padding-left: 0 !important;
}

:deep(.p-tabview-nav-link) {
  padding-right: 2rem;
}
</style>