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
            <table class="text-[12px] mt-2 overflow-hidden">
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
                  <td class="text-nowrap">{{ subject.description }}</td>
                  <td class="text-nowrap">{{ subject.sy }}</td>
                  <td class="text-nowrap">{{ subject.semester }}</td>
                  <td :class="{'status-passed': subject.remarks === 'Passed', 'status-failed': subject.remarks === 'Failed'}">{{ subject.remarks }}</td>
                  <td class="text-nowrap">{{ subject.instructor }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Create Evaluation Result -->
        <div class="subject-list w-full ml-2">
          <h3>Please select the subjects</h3>
          <div class="h-[80%] border-t border-b">
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
                  <tr v-for="subject in prospectos" :key="subject.code" :class="{'bg-yellow-200': subject.passed, 'bg-blue-600': subject.selected, 'text-white': subject.selected && subject.status == 1, 'bg-red-600': subject.status == 0}">
                    <td class="items-center justify-center">
                      <input 
                        class="cursor-pointer"
                        v-if="subject?.passed != true && subject?.status == 1"
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
                <button class="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition" @click="confirmSubmit">Submit Evaluation</button>
                <button class="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition" @click="closeEvaluation">Close</button>
              </div>
              <h2 class="mt-[-20px]">Total Units: {{ selectSubjects.length > 0 ? selectSubjects.reduce((acc, cur) => acc + cur.units, 0) : 0 }}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Confirm Submission</h2>
        <p>Are you sure you want to submit the evaluation?</p>
        <div class="mb-4">
          <label for="sy" class="block text-sm font-medium text-gray-700">School Year:</label>
          <select v-model="selected_school_year" id="sy" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
            <option v-for="schoolYear in eval_school_year" :key="schoolYear.id" :value="schoolYear.attributes.year">{{ schoolYear.attributes.year }}</option>
          </select>
        </div>

        <div class="mb-4">
           
          <label for="semester" class="block text-sm font-medium text-gray-700">Semester:</label>
          <select v-model="eval_sem" id="sem" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
            <option value="1">1st Semester</option>
            <option value="2">2nd Semester</option>
          </select>
        </div>
 
        <div class="modal-actions">
          <button @click="submitEvaluation">Yes</button>
          <button @click="showModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
export default {
  data() {
    return {
      searchQuery: '',
      prospectos: [],
      grades: [],
      selectedStudent: null,
      selectSubjects: [],
      eval_school_year: null,
      eval_sem: null,
      selected_school_year: null,
      showModal: false // Control the visibility of the modal
    };
  },
  mounted() {
    this.fetchSchoolYears()
  },
  methods: {
    async fetchSchoolYears() {
      try {

        const token = sessionStorage.getItem('jwt');
        const response = await axios.get('https://api.nemsu-grading.online/api/school-years', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.eval_school_year = response.data.data;
      } catch (error) {
        toast.error(error.response.data.error.message);
        console.error('Error fetching school years:', error);
      }
    },
    async searchStudent() {
      if (this.searchQuery) {
        const evaluateData = await axios.get(`https://api.nemsu-grading.online/api/evaluation/${this.searchQuery}`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("jwt")}`
          }
        });
        const { prospectos, student_info, grades } = evaluateData.data;
        if (student_info.length == 0 ) {
          toast.info("Student Id not found");
          return
        }
        this.selectedStudent = student_info[0];
        this.prospectos = prospectos.map(subject => ({ ...subject, selected: false }));
        this.grades = grades;
        toast.success("Successfully retrived student details");
      }
    },
    selectSubject(subject) {
      if (subject.selected) {
        if (!this.selectSubjects.includes(subject)) {
          this.selectSubjects.push(subject);
        }
      } else {
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
      this.selectSubjects = [];
      this.eval_school_year = null;
      this.eval_sem= null;
    },
    confirmSubmit() {
    if (this.selectSubjects.length == 0) return toast.info("Please select subject");
      this.showModal = true; // Show the confirmation modal
      this.fetchSchoolYears()
    },
    async submitEvaluation() {
      console.log(this.selectSubjects);

      if (this.selected_school_year == null) return toast.error("Please select school year") 

      if (this.eval_sem == null) return toast.error("Please select semester") 
      
      try {
        const evalSubmit = []
        for (const subject of this.selectSubjects) {
          const evaluationData = {
            school_year: this.selected_school_year,
            sem: String(this.eval_sem),
            student_id: String(this.selectedStudent.student_id),
            subject_code: subject.code,
            description: subject.description,
            laboratory: String(subject.laboratory),
            lecture: String(subject.lecture),
            time: '',
            day: '',
            instructor: '',
            units: String(subject.units),
            evaluator: String(JSON.parse(sessionStorage.getItem('profile')).id)
          };

          evalSubmit.push(evaluationData) 
        }

        if (evalSubmit.length > 0) {
          console.log(evalSubmit);
          await axios.post(`https://api.nemsu-grading.online/api/create-evaluation/`, { data: evalSubmit }, {
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem("jwt")}`
            }
          });

          toast.success("Evaluation Submitted");
          
          this.closeEvaluation(); // Clear the form after submission
        } else {
          // alert("Please select subject")
          toast.info("Please select subject");
        }
        this.showModal = false; // Hide the modal after submission
        // this.showModal = false; // Hide the modal after submission
        // this.closeEvaluation(); // Clear the form after submission
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
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
