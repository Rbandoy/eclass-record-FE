<template>
  <div class="manage-evaluation">
    <h1>Manage Evaluation</h1>
    
    <!-- Search Student -->
    <div class="search-student">
      <input v-model="searchQuery" placeholder="Search student by name or ID" />
      <button @click="searchStudent">Search</button>
    </div>
    
    <!-- Display Evaluation Results -->
    <div v-if="selectedStudent">
      <h2>Evaluation for {{ selectedStudent.name }}</h2>
      
      <!-- List of Subjects with Status -->
      <table>
        <thead>
          <tr>
            <th>Subject Code</th> 
            <th>Description</th> 
            <th>SY</th>
            <th>Sem</th>
            <th>Remarks</th>
            <th>Instructor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="subject in grades" :key="subject.code">
            <td>{{ subject.subject_no }}</td>
            <td>{{ subject.description }}</td> 
            <td :class="subject.status">{{ subject.sy }}</td>
            <td :class="subject.status">{{ subject.semester }}</td>
            <td :class="subject.status">{{ subject.remarks }}</td>
            <td :class="subject.status">{{ subject.instructor }}</td>
            <td :class="subject.status">{{ subject.status == 1 ? 'Active': 'Not Active'}}</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Create Evaluation Result -->
      <h3>Create Evaluation Result</h3>
      <div class="evaluation-form">
        <!-- <div v-for="(subject) in prospectos" :key="subject.code"> -->
          <!-- <label>
            <input 
              type="checkbox" 
              v-model="selectedSubjects" 
              :value="subject.code"
            />
            {{ subject.code }} {{ subject.year }}  ({{ subject.units }} units)
          </label> -->
          <table>
            <thead>
              <tr>
                <th>Subject Code</th> 
                <th>Description</th>
                <th>Year Level</th>
                <th>SY</th>
                <th>Sem</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="subject in prospectos" :key="subject.code">
                <td>{{ subject.code }}</td>
                <td>{{ subject.description }}</td>
                <td :class="subject.status">{{ subject.year }}</td>
                <td :class="subject.status">{{ subject.sy }}</td>
                <td :class="subject.status">{{ subject.sem }}</td>
                <td :class="subject.status">{{ subject.status == 1 ? 'Active': 'Not Active'}}</td>
              </tr>
            </tbody>
          </table>
        <!-- </div> -->
        <button @click="submitEvaluation">Submit Evaluation</button>
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
      prospectos: '',
      grades: '',
      selectedStudent: null,
      availableSubjects: [
        // Example data, replace with actual data from API
        { code: 'SUBJ101', name: 'Mathematics', units: 3 },
        { code: 'SUBJ102', name: 'English', units: 3 },
        // Add more subjects here...
      ],
      selectedSubjects: []
    };
  },
  methods: {
    async searchStudent() {
      // Replace with actual API call to fetch student data
      // Mock data for demonstration
      // const mockStudentData = {
      //   id: 1,
      //   name: 'John Doe',
      //   subjects: [
      //     { code: 'SUBJ101', name: 'Mathematics', status: 'Passed' },
      //     { code: 'SUBJ102', name: 'English', status: 'Failed' },
      //   ]
      // };
      
      
      // Assuming the search query matches the mock data
      if (this.searchQuery) {

      const evaluateData = await axios.get(`https://nemsu-grading.online/api/evaluation/${this.searchQuery}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem("jwt")}`
        }
      });

      const { prospectos, student_info, grades } = evaluateData.data;

        this.selectedStudent = student_info;
        this.prospectos  = prospectos;
        this.grades = grades;
      }
    },
    submitEvaluation() {
      // Replace with actual API call to submit evaluation data
      const evaluationData = {
        studentId: this.selectedStudent.id,
        subjects: this.selectedSubjects
      };
      
      console.log('Evaluation Submitted:', evaluationData);
      // Call API to submit evaluation data
    }
  }
};
</script>

<style scoped>
.manage-evaluation {
  padding: 20px;
}

.search-student {
  margin-bottom: 20px;
}

.search-student input {
  padding: 8px;
  width: 300px;
  margin-right: 10px;
}

.search-student button {
  padding: 8px 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table, th, td {
  border: 1px solid black;
}

th, td {
  padding: 10px;
  text-align: left;
}

.passed {
  color: green;
}

.failed {
  color: red;
}

.evaluation-form {
  margin-top: 20px;
}

.evaluation-form div {
  margin-bottom: 10px;
}

.evaluation-form button {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

.evaluation-form button:hover {
  background-color: #45a049;
}
</style>
