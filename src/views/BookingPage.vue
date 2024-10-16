<template>
  <div class="booking-page container mt-5">
    <h1 class="mb-4">Book Your Appointment</h1>
    <div class="row">
      <div class="col-md-8">
        <div class="mb-3">
          <label for="datePicker" class="form-label">Select Date:</label>
          <Calendar v-model="selectedDate" :minDate="new Date()" :maxDate="maxDate" dateFormat="dd/mm/yy" />
        </div>
        <div class="mb-3">
          <label for="timePicker" class="form-label">Select Time:</label>
          <Dropdown v-model="selectedTime" :options="timeSlots" optionLabel="label" optionValue="value" placeholder="Select a time" />
        </div>
        <Button @click="bookAppointment" :label="loading ? 'Booking...' : 'Book Appointment'" :disabled="loading" />
      </div>
    </div>
    
    <div class="mt-5">
      <h3>Your Appointments</h3>
      <ul class="list-group">
        <li v-for="appointment in userAppointments" :key="appointment.id" class="list-group-item">
          {{ formatDate(appointment.date) }} at {{ formatTime(appointment.time) }}
          <Tag :value="appointment.status" :severity="appointment.status === 'active' ? 'success' : 'secondary'" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, onSnapshot, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust this import path as needed

export default {
  name: 'BookingPage',
  setup() {
    const auth = getAuth();
    const selectedDate = ref(new Date());
    const selectedTime = ref(null);
    const userAppointments = ref([]);
    const loading = ref(false);

    const maxDate = computed(() => {
      const date = new Date();
      date.setDate(date.getDate() + 6); // 7 days from today
      return date;
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

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const formatTime = (time) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };

    const bookAppointment = async () => {
  if (!selectedDate.value || !selectedTime.value) {
    alert('Please select both date and time');
    return;
  }

  loading.value = true;
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('Current user:', user.uid); // Debugging line

    const appointmentData = {
      date: selectedDate.value.toISOString(),
      time: selectedTime.value,
      status: 'active',
      userId: user.uid
    };

    console.log('Appointment data:', appointmentData); // Debugging line

    // Add appointment to 'appointments' collection
    const appointmentRef = await addDoc(collection(db, 'appointments'), appointmentData);
    console.log('Appointment added to collection:', appointmentRef.id); // Debugging line

    // Update user's document with the new appointment
    await updateDoc(doc(db, 'users', user.uid), {
      appointments: arrayUnion({
        id: appointmentRef.id,
        ...appointmentData
      })
    });
    console.log('User document updated'); // Debugging line

    alert('Appointment booked successfully!');
    selectedTime.value = null;
  } catch (error) {
    console.error('Error booking appointment:', error);
    alert(`Failed to book appointment: ${error.message}`);
  } finally {
    loading.value = false;
  }
};


    onMounted(() => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            userAppointments.value = doc.data().appointments || [];
          }
        });
      }
    });

    return {
      selectedDate,
      selectedTime,
      maxDate,
      timeSlots,
      userAppointments,
      loading,
      formatDate,
      formatTime,
      bookAppointment,
    };
  }
}
</script>

<style scoped>
/* You may need to adjust these styles based on your project's setup */
:deep(.p-calendar) {
  width: 100%;
}
:deep(.p-dropdown) {
  width: 100%;
}
</style>