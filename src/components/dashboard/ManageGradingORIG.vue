<template>
  <div class="container mx-auto p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold">Manage Student Grade</h1>
      <div class="flex flex-row justify-between mt-10">
        <div class="mb-4 ">
          <label for="programCode" class="block text-sm font-medium text-gray-700">Search Program Code:</label>
          <input
            type="text"
            id="programCode"
            v-model="programCode"
            @input="searchProgram"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div v-if="programExists" class="mt-4 flex flex-row gap-1">
          <button @click="openAddStudentModal" class="mt-4 bg-green-500 text-white px-4 py-2 rounded-md">
            Add Student
          </button>
          <button @click="openAddQuizModal" class="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-md">
            Add Quiz
          </button>
          <button @click="openAddExamModal" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
            Add Exam
          </button>
        </div>
      </div>
      
    </div>

    <!-- Student List -->
    <div v-if="students.length" class="mb-6">
      <h2 class="text-2xl font-semibold mb-4">Students Enrolled</h2>
      <table class="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr class="border-b">
            <th class="p-4 text-left">Student ID</th>
            <th class="p-4 text-left">Name</th>
            <th class="p-4 text-left">Email</th>
            <th class="p-4 text-left">Mobile</th>
            <th class="p-4 text-left">Status</th>
            <th class="p-4 text-left">Address</th>
            <th class="p-4 text-left">Gender</th>
            <th class="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id" class="border-b">
            <td class="p-4">{{ student.attributes.student_id }}</td>
            <td class="p-4">{{ student.attributes.fname }} {{ student.attributes.mname }} {{ student.attributes.lname }}</td>
            <td class="p-4">{{ student.attributes.email }}</td>
            <td class="p-4">{{ student.attributes.mobile }}</td>
            <td class="p-4">{{ student.attributes.status }}</td>
            <td class="p-4">{{ student.attributes.address }}</td>
            <td class="p-4">{{ student.attributes.gender }}</td>
            <td class="p-4 flex space-x-2">
              <button @click="openViewGradesModal(student)" class="bg-blue-500 text-white px-3 py-1 rounded-md">
                View Grades
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- No Students Message -->
    <div v-else class="text-gray-500">No students available for this program.</div>

    <!-- Add Student Button -->
   

    <!-- Add Student Modal -->
    <transition name="fade">
      <div v-if="isAddStudentModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 class="text-2xl font-semibold mb-4">Add Student</h2>
          <form @submit.prevent="addStudentToProgram">
            <div class="mb-4">
              <label for="studentId" class="block text-sm font-medium text-gray-700">Student ID:</label>
              <input
                type="text"
                id="studentId"
                v-model="newStudentId"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div class="flex justify-end">
              <button @click="closeModal" type="button" class="bg-gray-500 text-white px-4 py-2 rounded-md mr-2">
                Cancel
              </button>
              <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- view student grades modal -->
    <transition name="fade">
      <div v-if="isViewGradesModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-[80%] w-full">
          
          <div class="flex flex-row justify-center items-start gap-3">
            <div class="w-full">
              <h2 class="text-2xl font-semibold mb-4">Quizzes</h2>
            <table class="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr class="border-b">
                  <th class="p-4 text-left">Title</th>
                  <th class="p-4 text-left">Items</th>
                  <th class="p-4 text-left">Quarter</th> 
                  <th class="p-4 text-left">Score</th> 
                </tr>
              </thead>
              <tbody>
                <tr v-for="quiz in viewGradesDetails.quizzes" :key="quiz.id" class="border-b  hover:bg-gray-100">
                  <td class="p-4">{{ quiz.attributes.quizTitle }}</td>
                  <td class="p-4">{{ quiz.attributes.items }}</td>
                  <td class="p-4">{{ quarters[quiz.attributes.quarter] }}</td>
                  <td class="p-4">{{ quiz.attributes.score }}</td>
                  <td class="p-4 flex space-x-2">
                    <button 
                      @click="quiz.attributes.score > 0 ? updateGradeModal(quiz): addGradeModal(quiz)" 
                      class="bg-blue-500 text-white px-3 py-1 rounded-md">
                      {{ quiz.attributes.score > 0 ? 'Update' : 'Add Score' }}
                    </button>
                  </td>
                  
                </tr>
              </tbody>
            </table>
            </div>
            
            <div class="w-full">
              <h2 class="text-2xl font-semibold mb-4">Exams</h2>
              <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                
                <thead>
                  <tr class="border-b">
                    <th class="p-4 text-left">Quarter</th> 
                    <th class="p-4 text-left">Items</th>
                    <th class="p-4 text-left">Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="exam in viewGradesDetails.exams.data" :key="exam.id" class="border-b hover:bg-gray-400">
                    <td class="p-4">{{ quarters[exam.attributes.quarter] }}</td>
                    <td class="p-4">{{ exam.attributes.items }}</td> 
                    <td class="p-4">{{ exam.attributes.score }}</td> 
                    <td class="p-4 flex space-x-2">
                      <button @click="openViewGradesModal(exam)" class="bg-blue-500 text-white px-3 py-1 rounded-md">
                        Add Grade
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
          <form @submit.prevent="addStudentToProgram">
            <div class="flex justify-end">
              <button @click="closeModal" type="button" class="bg-gray-500 text-white px-4 py-2 rounded-md mr-2">
                Cancel
              </button>
              <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md">
                Add
              </button> 
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Add Quiz Modal -->
    <transition name="fade">
      <div v-if="isAddQuizModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 class="text-2xl font-semibold mb-4">Add Quiz</h2>
          <form @submit.prevent="addQuizToProgram">
            <div class="mb-4">
              <label for="quizTitle" class="block text-sm font-medium text-gray-700">Quiz Title:</label>
              <input
                type="text"
                id="quizTitle"
                v-model="addQuizParams.quizTitle"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div class="mb-4">
            <label for="items" class="block text-sm font-medium text-gray-700"># of Items:</label>
              <input
                type="text"
                id="newQuizItems"
                v-model="addQuizParams.items"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div class="mb-4">
              <label for="quarter" class="block text-sm font-medium text-gray-700">Quarter:</label>
              <select id="quarter" v-model="addQuizParams.quarter" class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                <option value="1">Prelim</option>
                <option value="2">Midterm</option>
                <option value="3">Pre-Finals</option>
                <option value="4">Finals</option>
              </select>
            </div>
            <div class="flex justify-end">
              <button @click="closeModal" type="button" class="bg-gray-500 text-white px-4 py-2 rounded-md mr-2">
                Cancel
              </button>
              <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Add Score Modal -->
    <transition name="fade">
      <div v-if="isAddScoreModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 class="text-2xl font-semibold mb-4">{{  updateScore == false ? "Add" : "Update"  }} Score</h2>
          <form @submit.prevent="addScore">
            <div class="mb-4">
              <label for="addScore" class="block text-sm font-medium text-gray-700">Score:</label>
              <input
                type="text"
                id="addScore"
                v-model="addScoreParams.score"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
                required
              />
            </div>
            <div class="flex justify-end">
              <button @click="closeModal" type="button" class="bg-gray-500 text-white px-4 py-2 rounded-md mr-2">
                Cancel
              </button>
              <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md">
                {{  updateScore == false ? "Add" : "Update"  }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Add Exam Modal -->
    <transition name="fade">
      <div v-if="isAddExamModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 class="text-2xl font-semibold mb-4">Add Exam</h2>
          <form @submit.prevent="addExamToProgram">  
            <div class="mb-4">
              <label for="quarter" class="block text-sm font-medium text-gray-700">Quarter:</label>
              <select id="quarterExam" v-model="addExamParams.quarter" class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                <option value="1">Prelim</option>
                <option value="2">Midterm</option>
                <option value="3">Pre-Finals</option>
                <option value="4">Finals</option>
              </select>
            </div>
            <div class="mb-4">
            <label for="items" class="block text-sm font-medium text-gray-700"># of Items:</label>
              <input
                type="text"
                id="newExamItems"
                v-model="addExamParams.items"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div class="flex justify-end">
              <button @click="closeModal" type="button" class="bg-gray-500 text-white px-4 py-2 rounded-md mr-2">
                Cancel
              </button>
              <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const quarters = {
  1: 'Prelim',
  2: 'Midterm',
  3: 'Pre-Finals',
  4: 'Finals'
};

const addScoreParams = ref({
  student_id: "",
  score: "",
  type: "",
  quarter: "",
  program_code: "",
  instructor_id: '',
  quiz: ''
})

const isAddScoreModalOpen = ref(false)
const isAddQuizModalOpen = ref(false)
const isAddExamModalOpen = ref(false)
const isViewGradesModalOpen = ref(false)
const programCode = ref(''); 
const students = ref([]);
const programExists = ref(false);
const isAddStudentModalOpen = ref(false);
const newStudentId = ref('');
const currentStudentId = ref('');
const currentProgramId = ref(null);
const currentProgramDetails = ref('');
const selectedStudent = ref(null)
const updateScore = ref(false) 

const addQuizParams = ref({
  quizTitle: '',
  items: 0,
  quarter: ''
})

const addExamParams = ref({ 
  items: 0,
  quarter: ''
})

const viewGradesDetails = ref({
  studentInfo: "",
  quizzes: "",
  exams: ""
})

const addGradeModal = async (data) => {
  console.log("add grades",data)
  isAddScoreModalOpen.value = true
  console.log(data)
  addScoreParams.value = {
    student_id: currentStudentId,
    score: '',
    type: 'quiz',
    quarter: data.attributes.quarter,
    program_code: programCode.value,
    instructor_id: data.attributes.instructor_id,
    enrolled_student: currentStudentId,
    quiz: data.id
  }

  console.log(addScoreParams.value)
}

const updateGradeModal = async (data) => {
  console.log("add grades",data)
  isAddScoreModalOpen.value = true
  console.log(data)
  updateScore.value = true
  addScoreParams.value = {
    student_id: currentStudentId,
    score: '',
    type: 'quiz',
    quarter: data.attributes.quarter,
    program_code: programCode.value,
    instructor_id: data.attributes.instructor_id,
    enrolled_student: currentStudentId,
    quiz: data.id
  }

  console.log(addScoreParams.value)
}

const addScore = async() => {
  console.log("addScore")
  const token = sessionStorage.getItem('jwt');
    console.log("program id",currentProgramId.value)
    console.log(viewGradesDetails.value.quizzes)
    if (updateScore.value == true) {
      let scoreId = ""
      viewGradesDetails.value.quizzes.forEach(item => {
        if (item.id == addScoreParams.value.quiz) {
          scoreId = item.attributes.scoreId
        }
      })
      console.log("quizScore", scoreId)
      await axios.put(`http://47.129.3.25:1337/api/grades/${scoreId}`, {
      data: {
        ...addScoreParams.value,
      }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    } else {
      await axios.post(`http://47.129.3.25:1337/api/grades/`, {
      data: {
        ...addScoreParams.value, 
        program_code: programCode.value,
        programs: currentProgramId.value
      }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    }

    


    isAddScoreModalOpen.value = false
    fetchStudentGrades()
    searchProgram()
}
const openViewGradesModal = async (data) => {
  console.log(data)
  selectedStudent.value = data
  fetchStudentGrades() 
  isViewGradesModalOpen.value = true 
  console.log("grades", viewGradesDetails.value)
}

const fetchStudentGrades = async () => {
  const data = selectedStudent.value
  const token = sessionStorage.getItem('jwt');
  const profileId = JSON.parse(sessionStorage.getItem('profile')).id;
  const response = await axios.get(`http://47.129.3.25:1337/api/quizzes?filters[program_code][$eq]=${programCode.value}&filters[instructor_id][$eq]=${profileId}&populate=*`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const response2 = await axios.get(`http://47.129.3.25:1337/api/exams?filters[program_code][$eq]=${programCode.value}&filters[instructor_id][$eq]=${profileId}&populate=*`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  console.log("quizes results", response.data)
  console.log("quizzes results", response.data);
  try {
  // Create an array of promises for each quiz
  const quizzesWithScore = response.data.data.map(async quiz => {
    // Fetch the score for each quiz
    const res = await axios.get(`http://47.129.3.25:1337/api/grades?filters[student_id][$eq]=${data.id.toString()}&filters[instructor_id][$eq]=${profileId}&filters[quiz]=${quiz.id}&populate=*`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(res.data.data)
    // Update the quiz attributes with the fetched score
    quiz.attributes = { ...quiz.attributes, score: res.data.data[0]?.attributes.score, scoreId: res.data.data[0]?.id };
    
    // Return the updated quiz (optional, if you need the updated quizzes array)
    return quiz;
  });

  // Wait for all promises to be resolved
  const resultQuiz = await Promise.all(quizzesWithScore);
  
  // Log the results after all promises have been resolved
  console.log("quizzes with score", resultQuiz);
  currentStudentId.value = data.id.toString()
  console.log("quizes", response)
  viewGradesDetails.value = {
    quizzes: resultQuiz,
    exams: response2.data
  }

} catch (error) {
  // Handle any errors that occurred during the fetching or processing
  console.error("Error fetching quiz scores", error);
}
}

// Search for program code
const searchProgram = async () => {
  try {
    const token = sessionStorage.getItem('jwt');
    const response = await axios.get(`http://47.129.3.25:1337/api/subjects?filters[code][$eq]=${programCode.value}&populate=*`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response.data.data)
    if (response.data.data.length > 0) {
      console.log("program id res",response.data.data[0].id)
      currentProgramId.value = response.data.data[0].id;
      programExists.value = true;
      currentProgramDetails.value = response.data.data[0]
      console.log("dataresponse", response.data.data[0])
      fetchStudents(response.data.data[0].attributes.code);
    } else {
      students.value = [];
      programExists.value = false;
    }
  } catch (error) {
    console.error('Error searching program:', error);
  }
};

// Fetch students enrolled in the program
const fetchStudents = async (programCode) => {
  try {
    console.log(programCode);
    const token = sessionStorage.getItem('jwt');
    const profile = JSON.parse(sessionStorage.getItem('profile'));
    // Step 1: Fetch gradings data
    const gradingsResponse = await axios.get(`http://47.129.3.25:1337/api/gradings?filters[program_code][$eq]=${programCode}&filters[instructor_id][$eq]=${profile.id}&populate=*`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Step 2: Extract student IDs
    const studentIds = gradingsResponse.data.data.map(grading => {
      
      return grading.attributes.student_id;
    });
    
    if (studentIds.length === 0) {
      students.value = [];
      return;
    }

    console.log(studentIds)

    // Step 3: Fetch student details
    const studentDetailsRequests = studentIds.map(id =>
      axios.get(`http://47.129.3.25:1337/api/students?filters[student_id][$eq]=${id}&populate=*`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    );
    
    const studentResponses = await Promise.all(studentDetailsRequests);

    // Step 4: Combine data
    console.log("studentt",studentResponses)

    gradingsResponse.data.data.forEach(grading => {
      studentResponses.forEach(element => {
console.log("elem",element.data.data[0].attributes.student_id)
        if (grading.attributes.student_id === element.data.data[0].attributes?.student_id) {
          grading.attributes = { ...grading.attributes, ...element.data.data[0].attributes };
        }
      });
    })

    console.log(gradingsResponse)

    students.value = gradingsResponse.data.data;
    console.log("response",studentResponses)
  } catch (error) {
    console.error('Error fetching students:', error);
  }
};


// Open the modal to add a student
const openAddStudentModal = () => {
  isAddStudentModalOpen.value = true;
};

const openAddExamModal = () => {
  isAddExamModalOpen.value = true;
};

// Open the modal to add a quiz
const openAddQuizModal = () => {
  isAddQuizModalOpen.value = true;
};

// Close the modal
const closeModal = () => {
  isAddStudentModalOpen.value = false;
  isAddQuizModalOpen.value = false;
  isAddExamModalOpen.value = false;
  isViewGradesModalOpen.value = false;
  isAddScoreModalOpen.value = false
};
const addQuizToProgram = async () => {
  console.log(addQuizParams.value)
  try {
    const token = sessionStorage.getItem('jwt');
    console.log("program id",currentProgramId.value)
    await axios.post(`http://47.129.3.25:1337/api/quizzes`, {
      data: {
        ...addQuizParams.value,
        instructor_id: JSON.parse(sessionStorage.getItem('profile')).id.toString(),
        program_code: programCode.value,
        programs: currentProgramId.value
      }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    searchProgram()
  } catch (err) {
    console.log(err)
  }
}

const addExamToProgram = async () => {
  console.log(addQuizParams.value)
  try {
    const token = sessionStorage.getItem('jwt');
    await axios.post(`http://47.129.3.25:1337/api/exams`, {
      data: {
        ...addExamParams.value,
        instructor_id: JSON.parse(sessionStorage.getItem('profile')).id.toString(),
        program_code: programCode.value,
        programs: currentProgramId.value.toString()
      }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (err) {
    console.log(err)
  }
}
// Add a student to the program
const addStudentToProgram = async () => {
  try {
    const token = sessionStorage.getItem('jwt');
    const profile = JSON.parse(sessionStorage.getItem('profile'));

    // Check if the student exists
    const studentExists = await checkStudentExists(newStudentId.value);
    if (!studentExists[0]) {
      alert('Student not found. Please check the student ID.');
      return;  // Stop execution if the student does not exist
    }

    // Check if the student is already enrolled in the program
    const isEnrolled = await checkStudentEnrollment(newStudentId.value, programCode.value);
    if (isEnrolled) {
      alert('Student is already enrolled in this program.');
      return;  // Stop execution if the student is already enrolled
    }

    // Proceed with adding the student to the program if they are not already enrolled
    await axios.post(`http://47.129.3.25:1337/api/gradings`, {
      data: {
        student_id: newStudentId.value,
        program_code: programCode.value,
        instructor_id: profile.id.toString(),
        programs: currentProgramId.value.toString()
      }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log("eixts",studentExists[1][0].id)
    await axios.put(`http://47.129.3.25:1337/api/users/${profile.id.toString()}`, { 
      data: {
        student: studentExists[1][0].id
      }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Refresh the student list after successful addition
    fetchStudents(programCode.value);  
    closeModal();
  } catch (error) {
    console.error('Error adding student:', error);
  }
};

// Helper function to check if a student exists
const checkStudentExists = async (studentId) => {
  try {
    const token = sessionStorage.getItem('jwt');
    const response = await axios.get(`http://47.129.3.25:1337/api/students?filters[student_id][$eq]=${studentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return [response.data.data.length > 0, response.data.data];  // Return true if student exists
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return false;  // Return false if student does not exist
    }
    console.error('Error checking student existence:', error);
    throw error;  // Re-throw the error if it's not a 404
  }
};

// Helper function to check if a student is already enrolled in a program
const checkStudentEnrollment = async (studentId, programCode) => {
  try {
    const token = sessionStorage.getItem('jwt');
    const response = await axios.get(`http://47.129.3.25:1337/api/gradings?filters[student_id][$eq]=${studentId}&filters[program_code][$eq]=${programCode}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Check if there are any entries with the given student ID and program code
    return response.data.data.length > 0;  // Return true if already enrolled
  } catch (error) {
    console.error('Error checking student enrollment:', error);
    throw error;  // Re-throw the error if any occurs
  }
};



// Load initial data or perform any setup
onMounted(() => {
  // Initialization logic if needed
});
</script>
