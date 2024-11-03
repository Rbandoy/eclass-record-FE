<template>
  <div class="container mx-auto p-6">
    <LoadingComponent :isLoading="isLoading"/>
    <!-- Header -->
    <div class="mb-6 flex flex-row justify-between">
      <h1 class="text-3xl font-bold">Manage Students</h1>
      <button @click="openCreateModal" class="mt-4 bg-green-500 text-white px-4 py-2 rounded-md text-[12px]">
        Add Student
      </button>
    </div>

    <!-- Search Bar -->
    <div class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search students..."
        class="block p-2 border border-gray-300 rounded-md w-[300px]"
      />
      <div class="flex flex-col mb-4 mt-2">
        <span class="font-semibold text-lg mb-2">Group By: Year</span>
        <div class="flex flex-wrap">
          <label class="flex items-center mr-6 cursor-pointer">
            <input type="radio" value="" v-model="groupQuery" class="form-radio text-blue-600 h-4 w-4 mr-2" />
            <span class="text-gray-700">None</span>
          </label>
          <label class="flex items-center mr-6 cursor-pointer">
            <input type="radio" value="1st year" v-model="groupQuery" class="form-radio text-blue-600 h-4 w-4 mr-2" />
            <span class="text-gray-700">1st year</span>
          </label>
          <label class="flex items-center mr-6 cursor-pointer">
            <input type="radio" value="2nd year" v-model="groupQuery" class="form-radio text-blue-600 h-4 w-4 mr-2" />
            <span class="text-gray-700">2nd year</span>
          </label>
          <label class="flex items-center mr-6 cursor-pointer">
            <input type="radio" value="3rd year" v-model="groupQuery" class="form-radio text-blue-600 h-4 w-4 mr-2" />
            <span class="text-gray-700">3rd year</span>
          </label>
          <label class="flex items-center mr-6 cursor-pointer">
            <input type="radio" value="4th year" v-model="groupQuery" class="form-radio text-blue-600 h-4 w-4 mr-2" />
            <span class="text-gray-700">4th year</span>
          </label>
          <label class="flex items-center mr-6 cursor-pointer">
            <input type="radio" value="5th year" v-model="groupQuery" class="form-radio text-blue-600 h-4 w-4 mr-2" />
            <span class="text-gray-700">5th year</span>
          </label>
        </div>
      </div>
      
      
    </div>

    <!-- Student List -->
    <div v-if="filteredStudents.length" class="mb-6 h-[550px] bg-yellow-50 overflow-auto">
      <table class="min-w-full bg-white border border-gray-200 rounded-lg text-[12px]">
        <thead>
          <tr class="border-b">
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left font-medium text-gray-700 uppercase text-[12px]">Student ID</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left font-medium text-gray-700 uppercase text-[12px]">Year</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left font-medium text-gray-700 uppercase text-[12px]">Last Name</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left font-medium text-gray-700 uppercase text-[12px]">First Name</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left font-medium text-gray-700 uppercase text-[12px]">Middle Name</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left font-medium text-gray-700 uppercase text-[12px]">Email</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left font-medium text-gray-700 uppercase text-[12px]">Mobile</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left font-medium text-gray-700 uppercase text-[12px]">Status</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left font-medium text-gray-700 uppercase text-[12px]">Address</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left font-medium text-gray-700 uppercase text-[12px]">Gender</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left font-medium text-gray-700 uppercase text-[12px]">Activated</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left font-medium text-gray-700 uppercase text-[12px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
          :class="{'bg-yellow-200': !student.attributes.activated}"
          v-for="student in filteredStudents" :key="student.id" class="border-b">
            <td class="p-4">{{ student.attributes.student_id }}</td>
            <td class="p-4">{{ student.attributes.year }}</td>
            <td class="p-4">{{ student.attributes.lname }}</td>
            <td class="p-4">{{ student.attributes.fname }}</td>
            <td class="p-4">{{ student.attributes.mname }}</td>
            <td class="p-4">{{ student.attributes.email }}</td>
            <td class="p-4">{{ student.attributes.mobile }}</td>
            <td class="p-4">{{ student.attributes.status }}</td>
            <td class="p-4">{{ student.attributes.address }}</td>
            <td class="p-4">{{ student.attributes.gender }}</td>
            <td class="p-4">{{ student.attributes.activated }}</td>
            <td class="p-4 flex space-x-2">
              <button @click="viewGrades(student)" class="bg-blue-500 text-white px-3 py-1 rounded-md">
                View Grade
              </button>
              <button v-if="role === 'admin'"  @click="openEditModal(student)" class="bg-blue-500 text-white px-3 py-1 rounded-md">
                Edit
              </button>
              <button  v-if="role === 'admin'"  @click="deleteStudent(student.id)" class="bg-red-500 text-white px-3 py-1 rounded-md">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- No Students Message -->
    <div v-else class="text-gray-500">No students available.</div>

    <!-- Add/Edit Student Modal -->
<transition name="fade">
  <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 overflow-auto pt-10 text-sm">
    <div class="bg-white mt-4 p-8 rounded-lg shadow-2xl h-[90%] max-w-lg w-full space-y-6">
      <h2 class="text-2xl font-bold text-gray-800">{{ isEditing ? 'Edit Student' : 'Add New Student' }}</h2>
      
      <form class="overflow-auto h-[90%] p-3" @submit.prevent="isEditing ? updateStudent() : createStudent()">
        <!-- Student ID -->
        <div class="space-y-1">
          <label for="student_id" class="block text-base font-semibold text-gray-700">Student ID</label>
          <input type="text" id="student_id" v-model="studentForm.student_id" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500" :disabled="isEdit"/>
        </div>

        <!-- Username -->
        <div class="space-y-1">
          <label for="username" class="block text-base font-semibold text-gray-700">Username</label>
          <input type="text" id="username" v-model="studentForm.username" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"/>
        </div>

        <!-- Password -->
        <div class="space-y-1">
          <label for="password" class="block text-base font-semibold text-gray-700">Password</label>
          <input type="password" id="password" v-model="studentForm.password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"/>
        </div>

        <!-- First Name -->
        <div class="space-y-1">
          <label for="fname" class="block text-base font-semibold text-gray-700">First Name</label>
          <input type="text" id="fname" v-model="studentForm.fname" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"/>
        </div>

        <!-- Middle Name -->
        <div class="space-y-1">
          <label for="mname" class="block text-base font-semibold text-gray-700">Middle Name</label>
          <input type="text" id="mname" v-model="studentForm.mname" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"/>
        </div>

        <!-- Last Name -->
        <div class="space-y-1">
          <label for="lname" class="block text-base font-semibold text-gray-700">Last Name</label>
          <input type="text" id="lname" v-model="studentForm.lname" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"/>
        </div>

        <!-- Email -->
        <div class="space-y-1">
          <label for="email" class="block text-base font-semibold text-gray-700">Email</label>
          <input type="email" id="email" v-model="studentForm.email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"/>
        </div>

        <!-- Birthdate -->
        <div class="space-y-1">
          <label for="bdate" class="block text-base font-semibold text-gray-700">Birthdate</label>
          <input type="date" id="bdate" v-model="studentForm.bdate" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"/>
        </div>

        <!-- Mobile -->
        <div class="space-y-1">
          <label for="mobile" class="block text-base font-semibold text-gray-700">Mobile</label>
          <input type="text" id="mobile" v-model="studentForm.mobile" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"/>
        </div>

        <!-- Address -->
        <div class="space-y-1">
          <label for="address" class="block text-base font-semibold text-gray-700">Address</label>
          <input type="text" id="address" v-model="studentForm.address" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"/>
        </div>

        <!-- Gender -->
        <div class="space-y-1">
          <label for="gender" class="block text-base font-semibold text-gray-700">Gender</label>
          <select id="gender" v-model="studentForm.gender" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <!-- Status -->
        <div class="space-y-1">
          <label for="status" class="block text-base font-semibold text-gray-700">Status</label>
          <select id="status" v-model="studentForm.status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500">
            <option value="Regular">Regular</option>
            <option value="Irregular">Irregular</option>
          </select>
        </div>

        <!-- Year Level -->
        <div class="space-y-1">
          <label for="year" class="block text-base font-semibold text-gray-700">Year Level</label>
          <select id="year" v-model="studentForm.year" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500">
            <option value="1st Year">1st year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="5th Year">5th Year</option>
          </select>
        </div>

        <!-- Activation -->
        <div class="space-y-1">
          <label for="activated" class="block text-base font-semibold text-gray-700">Activated</label>
          <select id="activated" v-model="studentForm.activated" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500">
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>

        <!-- Guardian Telegram -->
        <div class="space-y-1">
          <label for="telegram" class="block text-base font-semibold text-gray-700">Guardian Telegram</label>
          <input type="text" id="telegram" v-model="studentForm.telegram" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"/>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3 mt-6">
          
          <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            {{ isEditing ? 'Update' : 'Create' }}
          </button>
          <button @click="closeModal" type="button" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</transition>



    <!-- View Grades Modal -->
    <transition name="fade">
      <div v-if="isGradesModalOpen" class="fixed w-[100%] inset-0 flex items-center p-2 justify-center bg-gray-800 bg-opacity-50 overflow-auto text-[12px]">
        <div class="bg-white p-6 mt-10 rounded-lg shadow-lg w-[60%] text-[12px]">
          <h2 class="text-lg font-semibold mb-4">Grades for Student ID: {{ currentStudentId }}</h2>
          <table class="min-w-full bg-white border border-gray-200 rounded-lg text-[12px]">
            <thead>
              <tr class="border-b">
                <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left font-medium text-gray-700 uppercase text-[12px]">Subject</th>
                <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left  font-medium text-gray-700 uppercase text-[12px]">Description</th>
                <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left   font-medium text-gray-700 uppercase text-[12px]">School year</th>
                <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left  font-medium text-gray-700 uppercase text-[12px]">Semester</th>
                <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left  font-medium text-gray-700 uppercase text-[12px]">Grade</th>
                <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left  font-medium text-gray-700 uppercase text-[12px]">Units</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="grade in grades" :key="grade.subject">
                <td class="p-4">{{ grade.subject_no }}</td>
                <td class="p-4">{{ grade.description }}</td> 
                <td class="p-4">{{ grade.sy }}</td>
                <td class="p-4">{{ grade.semester }}</td>
                <td class="p-4">{{ grade.grade }}</td>
                <td class="p-4">{{ grade.units }}</td>
              </tr>
            </tbody>
          </table>
          <div class="flex justify-end mt-4">
            <button @click="closeGradesModal" class="bg-gray-500 text-white px-4 py-2 rounded-md">Close</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import LoadingComponent from '../reuseable/LoadingComponent.vue';
import axios from 'axios'; 
const isGradesModalOpen = ref();
const students = ref([]);
const isModalOpen = ref(false);
const isEditing = ref(false);
const role = ref('')
const grades = ref();
const isLoading = ref(false);
const studentForm = ref({
  id: '',
  student_id: '',
  fname: '',
  mname: '',
  lname: '',
  email: '',
  bdate: '',
  status: '',
  mobile: '',
  address: '',
  gender: '',
  activated: '',
  username: '',
  password: '',
  telegram:'',
  year: ''
});
const currentStudentId = ref(null);
const searchQuery = ref('');
const groupQuery = ref('');

// Fetch students from API
const loadStudents = async () => {
  try {
    isLoading.value = true
    const token = sessionStorage.getItem('jwt');
    const response = await axios.get('http://localhost:1337/api/students', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    students.value = response.data.data; // Adjust based on the actual response structure
  } catch (error) {
    console.error('Error fetching students:', error);
  } finally {
    isLoading.value = false
  }
};

// Add new student
const createStudent = async () => {
  try {
    isLoading.value = true
    const token = sessionStorage.getItem('jwt');
    await axios.post('http://localhost:1337/api/students', { data: studentForm.value }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    loadStudents();
    closeModal();
  } catch (error) {
    if (error.response.data.error.message.includes("unique")) {
      alert('Error creating student: Student already exists');
    }
    console.error('Error creating student:', error);
  } finally {
    isLoading.value = false
  }
};

// Update student
const updateStudent = async () => {
  try {
    isLoading.value = true
    const token = sessionStorage.getItem('jwt');
    await axios.put(`http://localhost:1337/api/students/${currentStudentId.value}`, { data: studentForm.value }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    loadStudents();
    closeModal();
  } catch (error) {
    console.error('Error updating student:', error);
  } finally {
    isLoading.value = false
  }
};

// Delete student
const deleteStudent = async (id) => {
  try {
    isLoading.value = true
    const token = sessionStorage.getItem('jwt');
    await axios.delete(`http://localhost:1337/api/students/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    loadStudents();
  } catch (error) {
    console.error('Error deleting student:', error);
  } 
  finally {
    isLoading.value = false
  }
};

// Open modal for creating new student
const openCreateModal = () => {
  studentForm.value = {
    student_id: '',
    fname: '',
    mname: '',
    lname: '',
    email: '',
    bdate: '',
    mobile: '',
    address: '',
    gender: '',
    telegram: ''
  };
  isEditing.value = false;
  isModalOpen.value = true;
};

// Open modal for editing an existing student
const openEditModal = (student) => {
  studentForm.value = { ...student.attributes };
  currentStudentId.value = student.id;
  isEditing.value = true;
  isModalOpen.value = true;
};

// Close modal
const closeModal = () => {
  isModalOpen.value = false;
};

// Filtered and sorted students based on search query and activated status
const filteredStudents = computed(() => {
  const searchQueryValue = searchQuery.value.toLowerCase();
  const groupQueryValue = groupQuery.value.toLowerCase();

  // Create a new sorted array to avoid mutating the original array
  const sortedStudents = [...students.value].sort((a, b) => {
    if (a.attributes.activated === b.attributes.activated) {
      return -1; // If both are activated or not, retain order
    } else if (a.attributes.activated) {
      return 1; // Move activated students up
    } else {
      return -1; // Move non-activated students down
    }
  });

  // Apply search query filtering
  return sortedStudents.filter(student => {
    const matchesSearch = JSON.stringify(student.attributes)
      .toLowerCase()
      .includes(searchQueryValue);

    const matchesGroup = groupQueryValue === "" || 
      student.attributes.year.toLowerCase().includes(groupQueryValue);
    console.log(matchesGroup)
    return matchesSearch && matchesGroup; // Both conditions must be true
  });
});



const viewGrades = async (student) => {
  try {
    isLoading.value = true
    // const response = await axios.get(`/api/grades?id=${student.id}`);
    grades.value = student.grades; // Assuming grades are in response.data
    currentStudentId.value = student.id;
    isGradesModalOpen.value = true; // Open grades modal
  } catch (error) {
    console.error('Error fetching grades:', error);
  } finally {
    isLoading.value = false
  }
};

const closeGradesModal = () => {
  isGradesModalOpen.value = false;
  grades.value = []; // Clear grades when closing modal
};


// Load students when the component is mounted
onMounted(() => {
  role.value = sessionStorage.getItem("role")
  loadStudents();
});
</script>
