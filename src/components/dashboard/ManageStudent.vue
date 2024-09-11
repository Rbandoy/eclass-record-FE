<template>
  <div class="container mx-auto p-6">
    <!-- Header -->
    <div class="mb-6 flex flex-row justify-between">
      <h1 class="text-3xl font-bold">Manage Students</h1>
      <button @click="openCreateModal" class="mt-4 bg-green-500 text-white px-4 py-2 rounded-md">
        Add New Student
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
    </div>

    <!-- Student List -->
    <div v-if="filteredStudents.length" class="mb-6">
      <table class="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr class="border-b">
            <th class="p-4 text-left">Student ID</th>
            <th class="p-4 text-left">Last Name</th>
            <th class="p-4 text-left">First Name</th>
            <th class="p-4 text-left">Middle Name</th>
            <th class="p-4 text-left">Email</th>
            <th class="p-4 text-left">Mobile</th>
            <th class="p-4 text-left">Status</th>
            <th class="p-4 text-left">Address</th>
            <th class="p-4 text-left">Gender</th>
            <th class="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in filteredStudents" :key="student.id" class="border-b">
            <td class="p-4">{{ student.attributes.student_id }}</td>
            <td class="p-4">{{ student.attributes.lname }}</td>
            <td class="p-4">{{ student.attributes.fname }}</td>
            <td class="p-4">{{ student.attributes.mname }}</td>
            <td class="p-4">{{ student.attributes.email }}</td>
            <td class="p-4">{{ student.attributes.mobile }}</td>
            <td class="p-4">{{ student.attributes.status }}</td>
            <td class="p-4">{{ student.attributes.address }}</td>
            <td class="p-4">{{ student.attributes.gender }}</td>
            <td class="p-4 flex space-x-2">
              <button @click="openEditModal(student)" class="bg-blue-500 text-white px-3 py-1 rounded-md">
                Edit
              </button>
              <button @click="deleteStudent(student.id)" class="bg-red-500 text-white px-3 py-1 rounded-md">
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
      <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 class="text-2xl font-semibold mb-4">{{ isEditing ? 'Edit Student' : 'Add New Student' }}</h2>
          <form @submit.prevent="isEditing ? updateStudent() : createStudent()">
            <!-- Form Fields -->
            <div class="mb-4">
              <label for="student_id" class="block text-sm font-medium text-gray-700">Student ID:</label>
              <input type="text" id="student_id" v-model="studentForm.student_id" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" :disabled="isEdit"/>
            </div>
            <div class="mb-4">
              <label for="fname" class="block text-sm font-medium text-gray-700">First Name:</label>
              <input type="text" id="fname" v-model="studentForm.fname" class="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
            </div>
            <div class="mb-4">
              <label for="mname" class="block text-sm font-medium text-gray-700">Middle Name:</label>
              <input type="text" id="mname" v-model="studentForm.mname" class="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
            </div>
            <div class="mb-4">
              <label for="lname" class="block text-sm font-medium text-gray-700">Last Name:</label>
              <input type="text" id="lname" v-model="studentForm.lname" class="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
            </div>
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
              <input type="email" id="email" v-model="studentForm.email" class="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
            </div>
            <div class="mb-4">
              <label for="bdate" class="block text-sm font-medium text-gray-700">Birthdate:</label>
              <input type="date" id="bdate" v-model="studentForm.bdate" class="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
            </div>
            <div class="mb-4">
              <label for="mobile" class="block text-sm font-medium text-gray-700">Mobile:</label>
              <input type="text" id="mobile" v-model="studentForm.mobile" class="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
            </div>
            <div class="mb-4">
              <label for="address" class="block text-sm font-medium text-gray-700">Address:</label>
              <input type="text" id="address" v-model="studentForm.address" class="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
            </div>
            <div class="mb-4">
              <label for="gender" class="block text-sm font-medium text-gray-700">Gender:</label>
              <select id="gender" v-model="studentForm.gender" class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="mb-4">
              <label for="status" class="block text-sm font-medium text-gray-700">Status:</label>
              <select id="status" v-model="studentForm.status" class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                <option value="Regular">Regular</option>
                <option value="Irregular">Irregular</option> 
              </select>
            </div>
            <!-- ... (same as before) ... -->
            <div class="flex justify-end">
              <button @click="closeModal" type="button" class="bg-gray-500 text-white px-4 py-2 rounded-md mr-2">
                Cancel
              </button>
              <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md">
                {{ isEditing ? 'Update' : 'Add' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const students = ref([]);
const isModalOpen = ref(false);
const isEditing = ref(false);
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
  gender: ''
});
const currentStudentId = ref(null);
const searchQuery = ref('');

// Fetch students from API
const loadStudents = async () => {
  try {
    const token = sessionStorage.getItem('jwt');
    const response = await axios.get('http://localhost:1337/api/students', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    students.value = response.data.data; // Adjust based on the actual response structure
  } catch (error) {
    console.error('Error fetching students:', error);
  }
};

// Add new student
const createStudent = async () => {
  try {
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
  }
};

// Update student
const updateStudent = async () => {
  try {
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
  }
};

// Delete student
const deleteStudent = async (id) => {
  try {
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
    gender: ''
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

// Filtered students based on search query
const filteredStudents = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return students.value.filter(student => { 
    console.log('asdasd', query , JSON.stringify())
    return  JSON.stringify(student.attributes).includes(query)
  });
});

// Load students when the component is mounted
onMounted(() => {
  loadStudents();
});
</script>
