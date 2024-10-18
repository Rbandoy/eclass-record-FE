<template>
  <div class="container mx-auto p-6">
    <loading :isLoading="isLoading" />
    <div class="flex flex-row justify-between">
      <h1 class="text-3xl font-bold mb-6">Users Account</h1>
      <button 
        @click="openCreateModal" 
        class="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition text-[12px]"
      >
        Create Account
      </button>
    </div>

    <!-- Modal for creating or updating an instructor -->
    <div 
      v-if="isModalOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeModal"
    >
      <div 
        class="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative" 
        @click.stop
      >
        <h2 class="text-2xl font-semibold mb-4">
          {{ isEditing ? 'Update Account' : 'Add New Account' }}
        </h2>
        <!-- Add or Update Instructor Form -->
<form class="text-[12px] text-nowrap" @submit.prevent="isEditing ? updateInstructor() : createInstructor()">
  <div class="mb-4">
    <label for="username" class="block text-[12px] text-nowrap font-medium text-gray-700">Username</label>
    <input
      v-model="newInstructor.username"
      id="username"
      type="text"
      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      required
    />
  </div>
  <div v-if="!isEditing" class="mb-4">
    <label for="password" class="block text-[12px] text-nowrap font-medium text-gray-700">Password</label>
    <input
      v-model="newInstructor.password"
      id="password"
      type="password"
      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      required
    />
  </div>
  <div class="mb-4">
    <label for="fname" class="block text-[12px] text-nowrap font-medium text-gray-700">First Name</label>
    <input
      v-model="newInstructor.fname"
      id="fname"
      type="text"
      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      required
    />
  </div>
  <div class="mb-4">
    <label for="lname" class="block text-[12px] text-nowrap font-medium text-gray-700">Last Name</label>
    <input
      v-model="newInstructor.lname"
      id="lname"
      type="text"
      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      required
    />
  </div>
  <div class="mb-4">
    <label for="email" class="block text-[12px] text-nowrap font-medium text-gray-700">Email</label>
    <input
      v-model="newInstructor.email"
      id="email"
      type="email"
      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      required
    />
  </div>
  <div class="mb-4">
    <label for="address" class="block text-[12px] text-nowrap font-medium text-gray-700">Address</label>
    <input
      v-model="newInstructor.address"
      id="address"
      type="text"
      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
    />
  </div>
  <div class="mb-4">
    <label for="bdate" class="block text-[12px] text-nowrap font-medium text-gray-700">Birth Date</label>
    <input
      v-model="newInstructor.bdate"
      id="bdate"
      type="date"
      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
    />
  </div>
  <div class="mb-4">
    <label for="role" class="block text-[12px] text-nowrap font-medium text-gray-700">Role</label>
    <select
      v-model="newInstructor.role"
      id="role"
      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      required
    >
      <option v-for="role in roles" :key="role.id" :value="role.id">
        {{ role.name }}
      </option>
    </select>
  </div>
  <div class="mb-4">
    <label for="gender" class="block text-[12px] text-nowrap font-medium text-gray-700">Gender</label>
    <select
      v-model="newInstructor.gender"
      id="gender"
      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      required
    >
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>
  </div>
  <div class="mb-4">
    <label for="phone_no" class="block text-[12px] text-nowrap font-medium text-gray-700">Phone Number</label>
    <input
      v-model="newInstructor.phone_no"
      id="phone_no"
      type="tel"
      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
    />
  </div>
  <div class="mb-4">
    <label for="gender" class="block text-[12px] text-nowrap font-medium text-gray-700">Activate</label>
    <select
      v-model="newInstructor.activated"
      id="activates"
      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      required
    >
      <option value="true">True</option>
      <option value="false">False</option>
    </select>
  </div>
  <div class="flex justify-end mt-6 space-x-4">
    <button 
      type="submit" 
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      {{ isEditing ? 'Update Instructor' : 'Add Instructor' }}
    </button>
    <button 
      type="button" 
      @click="closeModal" 
      class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
    >
      Cancel
    </button>
  </div>
</form> 
      </div>
    </div>

    <!-- Instructor list as a table --> 
    <div class="overflow-x-auto mt-10 text-[12px] text-nowrap">
      <table class="min-w-full bg-white border border-gray-200 text-[12px] text-nowrap">
        <thead>
          <tr>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-[12px] text-nowrap font-medium text-gray-700 uppercase ">
              Username
            </th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-[12px] text-nowrap font-medium text-gray-700 uppercase tracking-wider">
              Role
            </th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-[12px] text-nowrap font-medium text-gray-700 uppercase">
              First Name
            </th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-[12px] text-nowrap font-medium text-gray-700 uppercase">
              Last Name
            </th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-[12px] text-nowrap font-medium text-gray-700 uppercase">
              Email
            </th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-[12px] text-nowrap font-medium text-gray-700 uppercase ">
              Gender
            </th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-[12px] text-nowrap font-medium text-gray-700 uppercase">
              Phone Number
            </th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-[12px] text-nowrap font-medium text-gray-700 uppercase">
              Activated
            </th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left  font-medium text-gray-700 uppercase text-[12px] text-nowrap">
              Account Status
            </th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-center  font-medium text-gray-700 uppercase  text-[12px] text-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="text-[12px] text-nowrap">
          <tr 
            v-for="instructor in instructors" 
            :key="instructor.id" 
            class="hover:bg-gray-100"
          >
            <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">
              {{ instructor.username }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">
              {{ instructor.role.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">
              {{ instructor.fname }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">
              {{ instructor.lname }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">
              {{ instructor.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">
              {{ instructor.gender }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">
              {{ instructor.phone_no }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">
              {{ instructor.activated }}
            </td>

            <td
              class="px-6 py-4 whitespace-nowrap border-b border-gray-200"
              :class="{ 'text-red-500': instructor.blocked }"
            >
              {{ instructor.blocked ? "Blocked" : "Active" }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-center">
              <button 
                @click="openEditModal(instructor)" 
                class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-blue-600 transition"
              >
                View
              </button>
              <button 
                v-if="instructor.role.type != 'admin'"
                @click="deleteInstructor(instructor.id)" 
                class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition ml-2"
              >
                Delete
              </button>
              <button 
              v-if="instructor.role.type != 'admin'"
                :class="{ 'bg-blue-600': instructor.blocked , 'bg-red-600': !instructor.blocked ,}"
                @click="instructor.blocked ? reactivatedAccount(instructor.id) : deactivateInstructor(instructor.id)" 
                class="px-3 py-1 text-white rounded hover:bg-yellow-600 transition ml-2"
              >
                {{ instructor.blocked ? "Activate" : "Block"}} Account
              </button>
              <button 
                v-if="false"
                @click="openAssignProgramModal(instructor)" 
                class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition ml-2"
              >
                Assign Program
              </button>
            </td>
          </tr>
          <tr v-if="instructors.length === 0">
            <td colspan="8" class="px-6 py-4 text-center text-gray-500">
              No instructors found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal for assigning program -->
    <div 
      v-if="isProgramModalOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeProgramModal"
    >
      <div 
        class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative" 
        @click.stop
      >
        <h2 class="text-2xl font-semibold mb-4">
          Assign Program to {{ currentInstructor }}
        </h2>
        <form @submit.prevent="assignProgramToInstructor()">
          <div class="flex flex-col mb-4">
            <label for="program" class="mb-1 font-medium">Program:</label>
            <select 
              v-model="selectedProgram" 
              id="program" 
              required 
              class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            >
              <option disabled value="">Select Program</option>
              <option 
                v-for="program in programs" 
                :key="program.id" 
                :value="program.id"
              >
                {{ program.attributes.description }}
              </option>
            </select>
          </div>
          <div class="flex justify-end mt-6 space-x-4">
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Assign Program
            </button>
            <button 
              type="button" 
              @click="closeProgramModal" 
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Loading from '../reuseable/LoadingComponent.vue';

export default {
  name: 'InstructorComponent',
  components: {
    Loading,
  },
  data() {
    return { 
      isLoading: false,
      newInstructor: {
        username: '',
        password: '',
        fname: '',
        lname: '',
        mname: '',
        email: '',
        address: '',
        role: '',
        bdate: '',
        gender: '',
        phone_no: '',
        blocked: true,
        activated: ''
      },
      roles: [],
      programs: [],
      instructors: [],
      isModalOpen: false,  // Controls the modal visibility
      isEditing: false,  // Controls whether we're creating or editing
      currentInstructorId: null,  // Store the ID of the instructor being edited
      isProgramModalOpen: false,  // Controls the program assignment modal visibility
      selectedProgram: null,
      currentInstructor: null, // Store the instructor for whom the program will be assigned
    };
  },
  methods: {
    async deleteInstructor(id) {
      try {
        const token = sessionStorage.getItem('jwt');
        await axios.delete(`https://api.nemsu-grading.online/api/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.fetchInstructors();
      } catch (error) {
        console.error('Error deleting instructor:', error);
      }
    },
    async deactivateInstructor(id) {
      try {
        const token = sessionStorage.getItem('jwt');
        await axios.put(`https://api.nemsu-grading.online/api/users/${id}`, { blocked: true }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.fetchInstructors();
      } catch (error) {
        console.error('Error deactivating instructor:', error);
      }
    },

    async reactivatedAccount(id) {
      try {
        const token = sessionStorage.getItem('jwt');
        await axios.put(`https://api.nemsu-grading.online/api/users/${id}`, { blocked: false }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.fetchInstructors();
      } catch (error) {
        console.error('Error deactivating instructor:', error);
      }
    },
    async fetchInstructors() {
      try {
        this.isLoading = true;
        const token = sessionStorage.getItem('jwt'); // Retrieve token from sessionStorage 
        const response = await axios.get('https://api.nemsu-grading.online/api/users?populate=*', {
          headers: {
            'Authorization': `Bearer ${token}`  // Include Bearer token in the headers
          }
        });
        this.instructors = response.data;
      } catch (error) {
        console.error('Error fetching instructors:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchRoles() {
      try {
        this.isLoading = true;
        const token = sessionStorage.getItem('jwt'); 
        const response = await axios.get('https://api.nemsu-grading.online/api/users-permissions/roles', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.roles = response.data.roles;  // Store the fetched roles
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchPrograms() {
      try {
        this.loading = true
        const token = sessionStorage.getItem('jwt'); 
        const response = await axios.get('https://api.nemsu-grading.online/api/subjects', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        this.programs = response.data.data;
        console.log("asd",this.programs) 
         // Store the fetched programs
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async createInstructor() {
      try {
        this.loading = true
        const token = sessionStorage.getItem('jwt'); // Retrieve token from sessionStorage 
        const response = await axios.post('https://api.nemsu-grading.online/api/users/', this.newInstructor, {
          headers: {
            'Authorization': `Bearer ${token}`  // Include Bearer token in the headers
          }
        });
        this.instructors.push(response.data);
        this.resetNewInstructor();
        this.closeModal(); // Close the modal after successful creation
      } catch (error) {
        console.error('Error creating instructor:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async updateInstructor() {
      try {
        this.loading = true
        const token = sessionStorage.getItem('jwt'); // Retrieve token from sessionStorage 
        const payload = this.newInstructor;
        delete payload.password 
        await axios.put(`https://api.nemsu-grading.online/api/users/${this.currentInstructorId}`, this.newInstructor, {
          headers: {
            'Authorization': `Bearer ${token}`  // Include Bearer token in the headers
          }
        });
        this.fetchInstructors();  // Refresh the list
        this.resetNewInstructor();
        this.closeModal();  // Close the modal after successful update
      } catch (error) {
        console.error('Error updating instructor:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async assignProgramToInstructor() {
  try {
    const token = sessionStorage.getItem('jwt');  
    // Check if the program is already assigned
    const response = await axios.get(`https://api.nemsu-grading.online/api/assigned-programs?filters[instructor_id][$eq]=${this.currentInstructor}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Check if the selected program is already assigned
    const existingAssignments = response.data.data;
    console.log(existingAssignments)
    const isProgramAssigned = existingAssignments.some(assignment => assignment.attributes.program_id === this.selectedProgram.toString());

    if (isProgramAssigned) {
      alert('This program is already assigned to the instructor.');
      return;
    }

    // Proceed with assignment if not already assigned
    await axios.post('https://api.nemsu-grading.online/api/assigned-programs', {
      data: {
        instructor_id: this.currentInstructor.toString(),
        program_id: this.selectedProgram.toString()
      }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    this.fetchInstructors();  // Refresh the list
    this.closeProgramModal();
  } catch (error) {
    console.error('Error assigning program:', error);
  }
},

    openCreateModal() {
      this.resetNewInstructor();
      this.isEditing = false;
      this.isModalOpen = true;
    },
    openEditModal(instructor) {
      
      this.newInstructor = { ...instructor };
      console.log(this.newInstructor )
      this.newInstructor.role = instructor.role.id;
      this.currentInstructorId = instructor.id;
      this.isEditing = true;
      this.isModalOpen = true;
    },
    openAssignProgramModal(instructor) {
      this.currentInstructor = instructor.id;
      console.log("instructore", instructor)
      this.selectedProgram = null;
      this.isProgramModalOpen = true;
    },
    resetNewInstructor() {
      this.newInstructor = {
        username: '',
        password: '',
        fname: '',
        lname: '',
        mname: '',
        email: '',
        address: '',
        bdate: '',
        role: '',
        gender: '',
        phone_no: '',
        blocked: false,
      };
      this.currentInstructorId = null;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    closeProgramModal() {
      this.isProgramModalOpen = false;
    }
  },
  mounted() { 
    this.fetchInstructors();
    this.fetchRoles();
    this.fetchPrograms(); // Fetch programs on mount
  }
};
</script>
