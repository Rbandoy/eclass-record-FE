<template>
  <div class="manage-evaluation">
    <h1 v-if="selectedStudent" class="page-title">Student Evaluation</h1>

    <!-- Search Student -->
    <div v-if="!selectedStudent" class="search-student">
      <input v-model="searchQuery" placeholder="Search Student ID" />
      <button @click="searchStudent">Search</button>
    </div>

    <!-- Display Evaluation Results -->
    <div v-if="selectedStudent" class="w-full h-[100%]">
      <div class="flex w-full h-[100%]">
        <!-- List of Subjects with Status -->
        <div class="subject-list w-[50%] pr-5 border-r-2 h-[90%]">
          <h2>Student Information</h2> 
          <div class="border-t border-b py-1 mb-4 flex">
            <div class="flex justify-between w-full">
              <table class="text-[12px] w-full no-border">
                <thead>
                  <tr>
                    <th class="text-nowrap">Student Id</th>
                    <th class="text-nowrap">Last Name</th>
                    <th class="text-nowrap">First Name</th>
                    <th class="text-nowrap">M.I.</th>
                    <th class="text-nowrap">Sex</th>
                    <th class="text-nowrap">Course</th>
                    <th class="text-nowrap">Year Level</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="uppercase">
                    <td>{{ selectedStudent.student_id }}</td>
                    <td>{{ selectedStudent.lname }}</td>
                    <td>{{ selectedStudent.fname }}</td>
                    <td>{{ selectedStudent.mname }}</td>
                    <td>{{ selectedStudent.gender }}</td>
                    <td>{{ selectedStudent.course }}</td>
                    <td>{{ selectedStudent.year }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <h2>Student Grades</h2> 
          <div class="table-container pb-10 border-t border-b">
            <table class="text-[12px] mt-2 ">
              <thead>
                <tr class="text-nowrap">
                  <th>Subject Code</th>
                  <th>Description</th>
                  <th>SY</th>
                  <th>Sem</th>
                  <th>Remarks</th>
                  <th>Instructor</th>
                </tr>
              </thead>
              <tbody class="overflow-scroll">
                <tr v-for="subject in grades" :key="subject.code">
                  <td class="text-nowrap">{{ subject.subject_no }}</td>
                  <td class="">{{ subject.description }}</td>
                  <td class="text-nowrap">{{ subject.sy }}</td>
                  <td class="text-nowrap">{{ subject.semester }}</td>
                  <td :class="{'status-passed': subject.remarks === 'Passed', 'status-failed': subject.remarks === 'Failed'}">{{ subject.remarks }}</td>
                  <td class="">{{ subject.instructor }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Create Evaluation Result -->
        <div class="subject-list w-full ml-2">
          <h3>Please select the subjects</h3>
          <div class="h-[80%]  border-t border-b">
            <div class="overflow-auto h-[40%]">
            <table class="text-[12px]">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Subject Code</th>
                  <th>Description</th>
                  <th>Year Level</th>
                  <th>SY</th>
                  <th>Sem</th>
                  <th>Laboratory</th>
                  <th>Lecture</th>
                  <th>Units</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr  v-for="subject in prospectos" :key="subject.code" :class="{'bg-yellow-200': subject.passed, 'bg-blue-600': subject.selected, 'text-white': subject.selected}">
                  <td class="items-center justify-center">
                    <input 
                      class="cursor-pointer"
                      v-if="subject?.passed != true"
                      type="checkbox" 
                      v-model="subject.selected" 
                      @change="selectSubject(subject)" 
                    />
                  </td>
                  <td>{{ subject.code }}</td>
                  <td>{{ subject.description }}</td>
                  <td>{{ subject.year }}</td>
                  <td>{{ subject.sy }}</td>
                  <td>{{ subject.sem }}</td>
                  <td>{{ subject.laboratory }}</td>
                  <td>{{ subject.lecture }}</td>
                  <td>{{ subject.units }}</td>
                  <td :class="{'status-active': subject.status === 1, 'status-inactive': subject.status === 0}">
                    {{ subject.status == 1 ? 'Active' : 'Not Active' }}
                  </td>
                </tr>
              </tbody>
            </table> 
          </div>
            <!-- Table for Selected Subjects -->
           <div class="flex w-full justify-between mt-5">
            <h2 class="">Selected Subjects</h2>
            
           </div>
           <div class="h-[55%] overflow-auto mt-2">
             <table class="text-[12px]">
               <thead>
                 <tr>
                   <th>Subject Code</th>
                   <th>Description</th> 
                   <th>Laboratory</th>
                   <th>Lecture</th>
                   <th>Units</th> 
                 </tr>
               </thead>
               <tbody>
                 <tr v-for="subject in selectSubjects" :key="subject.code" :class="{'bg-yellow-200': subject.passed}">
                   <td>{{ subject.code }}</td>
                   <td>{{ subject.description }}</td> 
                   <td>{{ subject.laboratory }}</td>
                   <td>{{ subject.lecture }}</td>
                   <td>{{ subject.units }}</td> 
                 </tr> 
               </tbody>
             </table> 
           </div> 
           <div class="flex justify-between m-[15px]"> 
            <div class="">
              <button  class="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition" @click="submitEvaluation">Submit Evaluation</button>
              <button 
                 class="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                @click="closeEvaluation">Close</button>
            </div> 
            <h2 class="mt-[-20px]">Total Units: {{ selectSubjects.length > 0 ? selectSubjects.reduce((acc, cur) => {
              console.log(acc + cur.units  )
              acc = acc + cur.units;
              return acc
            }, 0) : 0 }}</h2>
           </div> 
          </div> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      searchQuery: '',
      prospectos: [],
      grades: [],
      selectedStudent: null,
      selectSubjects: []
    };
  },
  methods: {
    async searchStudent() {
      if (this.searchQuery) {
        const evaluateData = await axios.get(`http://localhost:1337/api/evaluation/${this.searchQuery}`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("jwt")}`
          }
        });
        const { prospectos, student_info, grades } = evaluateData.data;

        this.selectedStudent = student_info[0];
        this.prospectos = prospectos.map(subject => ({ ...subject, selected: false })); // Initialize selection state
        this.grades = grades;
      }
    },
    selectSubject(subject) {
      if (subject.selected) {
        // Add subject to selectSubjects if checked
        if (!this.selectSubjects.includes(subject)) {
          this.selectSubjects.push(subject);
        }
      } else {
        // Remove subject from selectSubjects if unchecked
        const index = this.selectSubjects.indexOf(subject);
        if (index !== -1) {
          this.selectSubjects.splice(index, 1);
        }
      }
      console.log('Selected subjects:', this.selectSubjects);
    },
    closeEvaluation() {
      this.selectedStudent = null;
      this.prospectos = [];
      this.grades = [];
      this.searchQuery = '';
    },
    submitEvaluation() {
      const evaluationData = {
        studentId: this.selectedStudent.id,
        subjects: this.selectSubjects.map(subject => ({
          code: subject.code,
          // Include grade or other necessary data here
        }))
      };
      console.log('Evaluation Submitted:', evaluationData);
      // Call API to submit evaluation data
    }
  }
};
</script>

<style scoped>
.no-border {
  border: none; /* Remove table border */
}
.subject-list { 
  overflow: hidden; /* Hide any overflow from the main container */
}

.table-container {
  height: 70%; /* Ensure it fills the container */
  overflow-y: auto; /* Enable vertical scrolling */
  padding: 10;
}

table {
  width: 100%;
  border-collapse: collapse; /* Collapse borders */
}

th, td {
  padding: 8px; /* Padding for better readability */
  text-align: left; /* Align text to the left */
}

th {
  background-color: #f2f2f2; /* Light background for headers */
}

.status-passed {
  color: green; /* Style for passed status */
}

.status-failed {
  color: red; /* Style for failed status */
}

.no-border th,
.no-border td {
  border: none; /* Remove cell borders */
  padding: 8px; /* Adjust padding if needed */
  text-align: left; /* Align text to the left */
}
.manage-evaluation {
  padding: 20px; 
  margin: auto;
  height: 100%;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.page-title {
  text-align: center;
  margin-bottom: 20px;
}

.search-student {
  display: flex;
  width: 100px; 
}

.search-student input {
  padding: 10px;
  flex: 1;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-student button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-student button:hover {
  background-color: #0056b3;
}

.student-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table, th, td {
  border: 1px solid #ddd;
}

th, td {
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.subject-list, .evaluation-form {
  margin-top: 20px;
}

.evaluation-form p {
  margin: 10px 0;
}

.evaluation-form button {
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.evaluation-form button:hover {
  background-color: #218838;
}

.status-passed {
  color: green;
}

.status-failed {
  color: red;
}

.status-active {
  color: green;
}

.status-inactive {
  color: orange;
}

.bg-yellow-200 {
  background-color: #ffeeba; /* Light yellow for passed subjects */
}
</style>
