<template>
  <div class="register-container">
    <h2 class="text-center">Register as {{ selectedAccountType }}</h2>
    <form @submit.prevent="register" class="register-form">
      <!-- Account Type Toggle -->
      <div class="account-type-toggle">
        <label>
          <input
            type="radio"
            value="student"
            v-model="accountType"
            required
          />
          Student
        </label>
        <label>
          <input
            type="radio"
            value="instructor"
            v-model="accountType"
            required
          />
          Instructor
        </label>
      </div>
      <!-- Instructor Fields -->
      <div v-if="isInstructor">
        <div class="mb-4">
          <label for="email">Username</label>
          <input
            v-model="newInstructor.username"
            id="username"
            type="text"
            class="input-field"
            required
          />
        </div>
        <div class="mb-4">
          <label for="email">Email</label>
          <input
            v-model="newInstructor.email"
            id="email"
            type="text"
            class="input-field"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password">Password</label>
          <input
            v-model="newInstructor.password"
            id="username"
            type="text"
            class="input-field"
            required
          />
        </div>
        <div class="mb-4">
          <label for="fname">First Name</label>
          <input
            v-model="newInstructor.fname"
            id="fname"
            type="text"
            class="input-field"
            required
          />
        </div>
        <div class="mb-4">
          <label for="lname">Last Name</label>
          <input
            v-model="newInstructor.lname"
            id="lname"
            type="text"
            class="input-field"
            required
          />
        </div>
        <div class="mb-4">
          <label for="address">Address</label>
          <input
            v-model="newInstructor.address"
            id="address"
            type="text"
            class="input-field"
          />
        </div>
        <div class="mb-4">
          <label for="bdate">Birth Date</label>
          <input
            v-model="newInstructor.bdate"
            id="bdate"
            type="date"
            class="input-field"
          />
        </div> 
        <div class="mb-4">
          <label for="gender">Gender</label>
          <select
            v-model="newInstructor.gender"
            id="gender"
            class="input-field"
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div class="mb-4">
          <label for="phone_no">Phone Number</label>
          <input
            v-model="newInstructor.phone_no"
            id="phone_no"
            type="tel"
            class="input-field"
          />
        </div>
      </div>

      <!-- Student Fields -->
      <div v-else> 
          <div class="mb-4">
            <label for="username">Username</label>
            <input
              v-model="studentForm.username"
              id="username"
              type="text"
              class="input-field"
              required
            />
          </div>
          <div class="mb-4">
            <label for="password">Password</label>
            <input
              v-model="studentForm.password"
              id="username"
              type="text"
              class="input-field"
              required
            />
          </div>
        <div class="mb-4">
          <label for="student_id">Student ID:</label>
          <input
            type="text"
            id="student_id"
            v-model="studentForm.student_id"
            class="input-field"
            :disabled="isEdit"
          />
        </div>
        <div class="mb-4">
          <label for="fname">First Name:</label>
          <input
            type="text"
            id="fname"
            v-model="studentForm.fname"
            class="input-field"
          />
        </div>
        <div class="mb-4">
          <label for="mname">Middle Name:</label>
          <input
            type="text"
            id="mname"
            v-model="studentForm.mname"
            class="input-field"
          />
        </div>
        <div class="mb-4">
          <label for="lname">Last Name:</label>
          <input
            type="text"
            id="lname"
            v-model="studentForm.lname"
            class="input-field"
          />
        </div>
        <div class="mb-4">
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            v-model="studentForm.email"
            class="input-field"
          />
        </div>
        <div class="mb-4">
          <label for="bdate">Birthdate:</label>
          <input
            type="date"
            id="bdate"
            v-model="studentForm.bdate"
            class="input-field"
          />
        </div>
        <div class="mb-4">
          <label for="mobile">Mobile:</label>
          <input
            type="text"
            id="mobile"
            v-model="studentForm.mobile"
            class="input-field"
          />
        </div>
        <div class="mb-4">
          <label for="address">Address:</label>
          <input
            type="text"
            id="address"
            v-model="studentForm.address"
            class="input-field"
          />
        </div>
        <div class="mb-4">
          <label for="gender">Gender:</label>
          <select
            id="gender"
            v-model="studentForm.gender"
            class="input-field"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div class="mb-4">
          <label for="course">Course:</label>
          <input
            type="text"
            id="course"
            v-model="studentForm.course"
            class="input-field"
            :disabled="isEdit"
          />
        </div>
        <div class="mb-4">
          <label for="year">Year Level:</label>
          <input
            type="text"
            id="year"
            v-model="studentForm.year"
            class="input-field"
            :disabled="isEdit"
          />
        </div>
        <div class="mb-4">
          <label for="status">Status:</label>
          <select
            id="status"
            v-model="studentForm.status"
            class="input-field"
          >
            <option value="Regular">Regular</option>
            <option value="Irregular">Irregular</option> 
          </select>
        </div>
        
      </div>

      <!-- Submit and Go Back Buttons -->
      <button type="submit" class="btn">Register</button> 
      <router-link to="/sign-in" class="btn go-back">Go Back to Sign In</router-link>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue'; 

import axios from 'axios'; // Import axios
export default {
  name: 'RegisterComponent',
  setup() {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const accountType = ref('student');
    const newInstructor = ref({
      username: '',
      fname: '',
      lname: '',
      address: '',
      bdate: '',
      role: '',
      gender: '',
      phone_no: '',
      email: '',
      password: ''
    });
    const studentForm = ref({
      student_id: '',
      fname: '',
      mname: '',
      lname: '',
      email: '',
      bdate: '',
      mobile: '',
      address: '',
      gender: '',
      status: '',
      course: '',
      year: '',
      password: '',
      username: ''
    });

    const roles = ref([]); // Fetch or set your roles here

    const isInstructor = computed(() => accountType.value === 'instructor');
    const selectedAccountType = computed(() => (isInstructor.value ? 'Instructor' : 'Student'));

    const register = async() => {
      if (isInstructor.value) {
        // Logic to handle instructor registration
        const data = {
          email: newInstructor.value.email,
          username: newInstructor.value.username,
          password: newInstructor.value.password,
          fname: newInstructor.value.fname,
          lname: newInstructor.value.lname,
          address: newInstructor.value.address,
          bdate: newInstructor.value.bdate,
          gender: newInstructor.value.gender,
          phone_no: newInstructor.value.phone_no, 
          activated: false,
          role: { 
                id: 3,
                position: { end: true }
          }
        };

        try {
          const response = await axios.post('http://localhost:1337/api/auth/local/register', data, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          console.log('Instructor registered:', response.data);
          // Handle successful response (e.g., redirect, show success message)
        } catch (error) {
          console.error('Error registering instructor:', error);
          // Handle error (e.g., show an error message)
        }
      } else {
        const studentData = {
          student_id: studentForm.value.student_id,
          fname: studentForm.value.fname,
          mname: studentForm.value.mname,
          lname: studentForm.value.lname,
          email: studentForm.value.email,
          bdate: studentForm.value.bdate,
          mobile: studentForm.value.mobile,
          address: studentForm.value.address,
          gender: studentForm.value.gender,
          status: studentForm.value.status,
          activated: false,
          course: studentForm.value.course,
          year: studentForm.value.year,
          password: studentForm.value.password,
          username: studentForm.value.username
        };

        try {
          const response = await axios.post('http://localhost:1337/api/students', {data: studentData}, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          console.log('student registered:', response.data);
          // Handle successful response (e.g., redirect, show success message)
        } catch (error) {
          console.error('Error registering instructor:', error);
          // Handle error (e.g., show an error message)
        }
      }
    };

    return {
      name,
      email,
      password,
      accountType,
      newInstructor,
      studentForm,
      roles,
      isInstructor,
      selectedAccountType, 
      register,
    };
  },
};
</script>

<style scoped>
.register-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}
.register-form {
  display: flex;
  flex-direction: column;
}
h2 {
  margin-bottom: 20px;
}
.account-type-toggle {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.form-group, .mb-4 {
  margin-bottom: 15px;
}
.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border 0.2s ease-in-out;
}
.input-field:focus {
  border-color: #007bff;
 
outline: none; } .btn { margin-top: 10px; padding: 10px; border: none; border-radius: 4px; background-color: #007bff; color: white; cursor: pointer; transition: background-color 0.3s; } .btn
{ background-color: #0056b3; } .go-back { margin-top: 10px; text-align: center; } </style>