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
    <div v-else  class="w-full max-w-5xl p-8 bg-white rounded-lg shadow-lg" >
      <div class="mb-4">
        <ul class="flex border-b">
          <li @click="activeTab = 'grades'" :class="{'border-b-2 border-blue-500': activeTab === 'grades'}" class="cursor-pointer px-4 py-2">
            Grades
          </li>
          <li @click="activeTab = 'evaluation'" :class="{'border-b-2 border-blue-500': activeTab === 'evaluation'}" class="cursor-pointer px-4 py-2">
            Evaluation
          </li>
        </ul>
      </div>
      <!-- Header Section -->
       <div  ref="printSection" class="print-section" >
 
      <div class="flex items-center mb-4">
        <div class="flex w-full space-x-4 items-center justify-center gap-4">
          <img src="@/assets/logo.jpg" alt="School Logo" class="h-20 w-20" />
          <div class="flex self-center flex-col items-center justify-center ">
            <h2 class="text-lg font-semibold text-gray-700">NORTH EASTERN MINDANAO STATE UNIVERSITY</h2>
            <h3 class="text-sm font-medium text-gray-500">Cantilan, Surigao del Sur</h3>
            <h3 class="text-sm font-medium text-gray-500">Report of Grades</h3>
            <p class="text-xs text-gray-500">SY: {{ school_year?.year }} Term: {{ school_year?.sem }}</p>
          </div>
        </div>
        <!-- <div class="text-right">
          <p class="text-xs text-gray-500">Printed on: {{ new Date().toLocaleDateString() }}</p>
        </div> -->
      </div>

      <!-- Student Information Section -->
      <div class="border-t border-b py-4 mb-2 ">
        <div class="grid grid-cols-2 gap-4 mt-[30px]">
          <div>
            <p class="text-sm font-medium text-gray-700"><span class="font-semibold">IDNO:</span> {{ student_info.attributes.student_id }}</p>
            <p class="text-sm font-medium text-gray-700"><span class="font-semibold">Lastname:</span> {{ student_info.attributes.lname }}</p>
            <p class="text-sm font-medium text-gray-700"><span class="font-semibold">Firstname:</span> {{ student_info.attributes.fname }}</p>
            <p class="text-sm font-medium text-gray-700"><span class="font-semibold">Middle Name:</span> {{ student_info.attributes.mname }}</p>
            <p class="text-sm font-medium text-gray-700"><span class="font-semibold">Sex:</span> {{ student_info.attributes.gender }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-700"><span class="font-semibold">Course:</span> {{ student_info.attributes.course }}</p>
            <p class="text-sm font-medium text-gray-700"><span class="font-semibold">Year Level:</span> {{ student_info.attributes.year }}</p>
            <p v-if="activeTab === 'grades'" class="text-sm font-medium text-gray-700"><span class="font-semibold">GPA:</span> {{ getGPA() }}</p>
          </div>
        </div>
      </div>

      <!-- Grades Table -->
      <div v-if="activeTab === 'grades'" class="mt-4">
        <table   class="min-w-full table-auto border border-gray-300">
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
            <tr v-for="grade in grades" :key="grade.id" class="hover:bg-gray-100">
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
        <p class="text-right mt-4 text-sm font-semibold text-gray-700">Total Units: {{ grades.reduce((acc, cur) => acc + Number(cur.units), 0)}}</p> 
      </div>

      <div v-if="activeTab === 'evaluation'" class="mt-4">
        <table   class="min-w-full table-auto border border-gray-300">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">Course No.</th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">Section</th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">Descriptive Title</th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">Time</th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">Days</th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">Room</th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">Bldg</th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">Lec</th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">Lab</th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">Units</th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">Instructor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="evals in evaluation" :key="evals.id" class="hover:bg-gray-100">
              <td class="px-2 py-2 border text-sm text-gray-600">{{ evals.subject_code }}</td>
              <td class="px-2 py-2 border text-sm text-gray-600">{{ evals.section }}</td>
              <td class="px-2 py-2 border text-sm text-gray-600">{{ evals.description }}</td>
              <td class="px-2 py-2 border text-sm text-gray-600">{{ evals.time }}</td>
              <td class="px-2 py-2 border text-sm text-gray-600">{{ evals.days }}</td>
              <td class="px-2 py-2 border text-sm text-gray-600">{{ evals.room }}</td>
              <td class="px-2 py-2 border text-sm text-gray-600">{{ evals.bldg }}</td>
              <td class="px-2 py-2 border text-sm text-gray-600">{{ evals.lecture }}</td>
              <td class="px-2 py-2 border text-sm text-gray-600">{{ evals.laboratory }}</td>
              <td class="px-2 py-2 border text-sm text-gray-600">{{ evals.units }}</td>
              <td class="px-2 py-2 border text-sm text-gray-600">{{ evals.instructor }}</td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-between">
          <p v-if="activeTab === 'evaluation'" class="text-left mt-4 text-sm font-semibold text-gray-700"><small class="font-semibold italic">note: Schedules may change depending on the no. of students & faculty loading. please be guided accordingly</small></p>
        <p class="text-right mt-4 text-sm font-semibold text-gray-700">Total Units: {{ evaluation.reduce((acc, cur) => acc + Number(cur.units), 0)}}</p> 
        </div>
        
        <p class="text-left mt-12 text-sm   text-gray-700  ">Certified By: <span class="uppercase underline">{{ evaluation[0]?.evaluator.lname }}, {{ evaluation[0]?.evaluator.fname }}</span></p>
        <p class="text-left mt-12 text-sm   text-gray-700  ">Evaluated By: <span class="uppercase underline">{{ evaluation[0]?.evaluator.lname }}, {{ evaluation[0]?.evaluator.fname }}</span></p>
        <small class="text-left mt-4 text-xs   text-gray-700">Date: {{ new Date(Date.now()).getFullYear() }}/{{ new Date(Date.now()).getMonth() }}/{{ new Date(Date.now()).getDate() }}</small>
      </div>
      </div>

      <!-- Print Button -->
      <div class="flex justify-center mt-6">
        <Button @click="saveAsPDF" class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-150">
          Print Report
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Button from './reuseable/ButtonComponent.vue';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
      grades: null,
      student_info: null,
      evaluation: null,
      activeTab: 'grades', 
      school_year: null
    };
  },
  methods: {
    async UserLogin() {
      this.isSubmitting = true;

      try {
        const response = await axios.get(`https://api.nemsu-grading.online/api/students?filters[username][$eq]=${this.username}&filters[password][$eq]=${this.password}&filters[activated][$eq]=true`);
       
        const data = response.data.data[0];
        console.log(data)
        this.student_info = data;
        this.grades = data.grades;
        this.evaluation = data.active_evaluation;
        this.school_year = data.school_year;
        console.log(this.evaluation)
        this.getGPA()
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
    printSection.print()
  } catch (error) { 
    console.log(error);
  }
}, async saveAsPDF() {
  const printSection = this.$refs.printSection;
      const canvas = await html2canvas(printSection, {
        scale: 5, // Increases the quality of the image
      });
      const imgData = canvas.toDataURL('image/png');
      
      // Create a new jsPDF instance with landscape orientation
      const pdf = new jsPDF('portrait', 'pt', 'a4'); // Use 'pt' for points and 'a4' for paper size
      
      // Get the dimensions of the PDF
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate the aspect ratio
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const aspectRatio = imgHeight / imgWidth;
      
      // Set image dimensions for PDF
      const imgPdfWidth = pdfWidth;
      const imgPdfHeight = imgPdfWidth * aspectRatio;
      console.log(pdfHeight)
      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgPdfWidth, imgPdfHeight);
      pdf.save(`${this.activeTab}-${this.evaluation[0].school_year}-${this.evaluation[0].sem}.pdf`); // Save the PDF with a name
    }, 
  getGPA(){
    const grades = this.grades;
    console.log(grades.length)
    const numberOfSubject = grades.length
    const totalGrades = grades.reduce((acc, cur) => acc + Number(cur.grade),0)
    const totalGPA = totalGrades/numberOfSubject;

    return Number(totalGPA).toFixed(2);
  }
  }
};
</script>

<style scoped>
.print-section { 
  padding: 20px;
  border: 1px solid #ccc;
}
</style>
