<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <!-- Login Form -->
    <div v-if="!grades" class="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold text-gray-700 text-center mb-6">Login</h2>
      <form @submit.prevent="UserLogin" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input
            v-model="username"
            id="username"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            id="password"
            type="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div class="text-red-600 text-sm" v-if="errorMessage">{{ errorMessage }}</div>
        <div class="flex items-center justify-center">
          <button
            type="submit"
            class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Logging in...' : 'Login' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Report of Grades (shown after successful login) -->
    <div v-else class="w-full max-w-5xl p-8 bg-white rounded-lg shadow-lg" ref="printSection">
      <!-- Header Section -->
      <div class="flex items-center mb-4">
        <div class="flex w-full space-x-2 items-center justify-center">
          <img src="@/assets/logo.jpg" alt="School Logo" class="h-20 w-20" />
          <div class="flex self-center flex-col items-center justify-center">
            <h2 class="text-lg font-semibold text-gray-700">NORTH EASTERN MINDANAO STATE UNIVERSITY</h2>
            <h3 class="text-sm font-medium text-gray-500">Cantilan, Surigao del Sur</h3>
            <h3 class="text-sm font-medium text-gray-500">Report of Grades</h3>
            <p class="text-xs text-gray-500">SY: 2021-2022 Term: 1</p>
          </div>
        </div>
        <!-- <div class="text-right">
          <p class="text-xs text-gray-500">Printed on: {{ new Date().toLocaleDateString() }}</p>
        </div> -->
      </div>

      <!-- Student Information Section -->
      <div class="border-t border-b py-4 mb-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-700"><span class="font-semibold">IDNO:</span> {{ grades.attributes.student_id }}</p>
            <p class="text-sm font-medium text-gray-700"><span class="font-semibold">Lastname:</span> {{ grades.attributes.lname }}</p>
            <p class="text-sm font-medium text-gray-700"><span class="font-semibold">Firstname:</span> {{ grades.attributes.fname }}</p>
            <p class="text-sm font-medium text-gray-700"><span class="font-semibold">Middle Name:</span> {{ grades.attributes.mname }}</p>
            <p class="text-sm font-medium text-gray-700"><span class="font-semibold">Sex:</span> {{ grades.attributes.gender }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-700"><span class="font-semibold">Course:</span> {{ grades.attributes.course }}</p>
            <p class="text-sm font-medium text-gray-700"><span class="font-semibold">Year Level:</span> {{ grades.attributes.year }}</p>
            <p class="text-sm font-medium text-gray-700"><span class="font-semibold">GPA:</span> 1.87</p>
          </div>
        </div>
      </div>

      <!-- Grades Table -->
      <div class="mt-4">
        <table class="min-w-full table-auto border border-gray-300">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">Course No.</th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">Section</th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">Descriptive Title</th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">Time</th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">Days</th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">Room</th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">Grade</th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">GComp</th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">Units</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="grade in grades.grades" :key="grade.id" class="hover:bg-gray-100">
              <td class="px-2 py-2 border text-sm text-gray-600">{{ grade.subject_no }}</td>
              <td class="px-2 py-2 border text-sm text-gray-600">{{ grade.section }}</td>
              <td class="px-2 py-2 border text-sm text-gray-600">{{ grade.description }}</td>
              <td class="px-2 py-2 border text-sm text-gray-600">{{ grade.time }}</td>
              <td class="px-2 py-2 border text-sm text-gray-600">{{ grade.days }}</td>
              <td class="px-2 py-2 border text-sm text-gray-600">{{ grade.room }}</td>
              <td class="px-2 py-2 border text-sm text-gray-600">{{ grade.grade }}</td>
              <td class="px-2 py-2 border text-sm text-gray-600">{{ grade.gcomp }}</td>
              <td class="px-2 py-2 border text-sm text-gray-600">{{ grade.units }}</td>
            </tr>
          </tbody>
        </table>
        <p class="text-right mt-4 text-sm font-semibold text-gray-700">Total Units: 26</p>
      </div>

      <!-- Print Button -->
      <div class="flex justify-center mt-6">
        <Button @click="printReport" class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-150">
          Print Report
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Button from './reuseable/ButtonComponent.vue';

export default {
  name: "ViewGrades",
  components: {
    Button,
  },
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      isSubmitting: false,
      grades: null
    };
  },
  methods: {
    async UserLogin() {
      this.isSubmitting = true;

      try {
        const response = await axios.get(`http://localhost:1337/api/students?filters[username][$eq]=${this.username}&filters[password][$eq]=${this.password}`);
        
        const data = response.data.data[0];
       
        this.grades = data;
      } catch (error) {
        this.errorMessage = 'Login failed. Please try again.';
        console.log(error);
      } finally {
        this.isSubmitting = false;
      }
    },
    printReport() {
  try {
    const printSection = this.$refs.printSection;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Grades Report</title>');
    
    // Include the styles you want to preserve during printing
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body {
        font-family: Arial, sans-serif; /* Default font */
      }
      img {
        width: 100px; /* Adjust logo size if needed */
        height: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f3f3f3; /* Header background color */
      }
      .text-sm {
        font-size: 14px; /* Adjust font size for printing */
      }
      .text-lg {
        font-size: 18px; /* Adjust font size for printing */
      }
      .font-medium {
        font-weight: 500; /* Font weight */
      }
      .font-semibold {
        font-weight: 600; /* Font weight */
      }
      /* Additional styles to match the screen appearance */
    `);
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printSection.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  } catch (error) { 
    console.log(error);
  }
},

  },
};
</script>

<style scoped>
/* Additional styling to enhance the layout and presentation */
</style>
