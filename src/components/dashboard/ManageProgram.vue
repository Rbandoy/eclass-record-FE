<template>
  <div class="container mx-auto p-6">
    <loading-component :isLoading="isLoading"/>
    <div class="flex flex-row justify-between">
      <h1 class="text-3xl font-bold">Manage Programs</h1>

      <!-- Button to open the Create Program Modal -->
      <button v-if="role === 'admin'" @click="openCreateModal" class="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition text-[12px]">Add Program</button>
    </div>

    <!-- Program List --> 
    <div class="overflow-auto mt-10 h-[70%]">
      <table class="min-w-full bg-white border border-gray-200 text-[12px]">
        <thead>
          <tr>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left font-medium text-gray-700 uppercase text-[12px]">Code</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left  font-medium text-gray-700 uppercase text-[12px]">Program</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left font-medium text-gray-700 uppercase text-[12px]">Lecture</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left font-medium text-gray-700 uppercase text-[12px]">Laboratory</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left font-medium text-gray-700 uppercase text-[12px]">Units</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left font-medium text-gray-700 uppercase text-[12px]">Semester</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left font-medium text-gray-700 uppercase text-[12px]">School Year</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left  font-medium text-gray-700 uppercase text-[12px]">Year Level</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left  font-medium text-gray-700 uppercase text-[12px]">Status</th>
            <th v-if="role === 'admin'" class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-center font-medium text-gray-700 uppercase text-[12px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="program in programs" :key="program.id" class="border-b border-gray-200 hover:bg-yellow-200">
            <td class="px-6 whitespace-nowrap">{{ program.attributes.code }}</td>
            <td class="px-6 whitespace-nowrap">{{ program.attributes.description }}</td>
            <td class="px-6 whitespace-nowrap">{{ program.attributes.lecture }}</td>
            <td class="px-6 whitespace-nowrap">{{ program.attributes.laboratory }}</td>
            <td class="px-6 whitespace-nowrap">{{ program.attributes.units }}</td>
            <td class="px-6  whitespace-nowrap">{{ program.attributes.sem }}</td>
            <td class="px-6 whitespace-nowrap">{{ program.attributes.sy }}</td>
            <td class="px-6  whitespace-nowrap">{{ program.attributes.year }}</td>
            <td class="px-6  whitespace-nowrap">{{ program.attributes.status }}</td>
            <td v-if="role === 'admin'" class="px-6 py-4 whitespace-nowrap text-center">
              <button @click="openEditModal(program)" class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Edit</button>
              <button @click="deleteProgram(program.id)" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal for Creating/Editing a Program -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center" @click="closeModal">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96" @click.stop>
        <h2 class="text-xl font-semibold mb-4">{{ isEditing ? 'Edit Program' : 'Create New Program' }}</h2>
        <form @submit.prevent="isEditing ? updateProgram() : createProgram()">
          <div class="mb-4">
            <label for="code" class="block text-sm font-medium text-gray-700">Program Code:</label>
            <input type="text" v-model="programForm.code" id="code" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
          </div>

          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700">Description:</label>
            <input type="text" v-model="programForm.description" id="description" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
          </div>

          <div class="mb-4">
            <label for="lecture" class="block text-sm font-medium text-gray-700">Lecture Units:</label>
            <input type="text" v-model="programForm.lecture" id="lecture" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
          </div>

          <div class="mb-4">
            <label for="laboratory" class="block text-sm font-medium text-gray-700">Laboratory Units:</label>
            <input type="text" v-model="programForm.laboratory" id="laboratory" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
          </div>

          <div class="mb-4">
            <label for="units" class="block text-sm font-medium text-gray-700">Units:</label>
            <input type="number" v-model="programForm.units" id="units" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
          </div>

          <div class="mb-4">
            <label for="semester" class="block text-sm font-medium text-gray-700">Semester:</label>
            <select v-model="programForm.sem" id="sem" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
              <option value="1">1st Semester</option>
              <option value="2">2nd Semester</option>
            </select>
          </div>

          <div class="mb-4">
            <label for="status" class="block text-sm font-medium text-gray-700">Status:</label>
            <select v-model="programForm.status" id="status" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>

          <div class="mb-4">
            <label for="sy" class="block text-sm font-medium text-gray-700">School Year:</label>
            <select v-model="programForm.sy" id="sy" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
              <option v-for="schoolYear in schoolYears" :key="schoolYear.id" :value="schoolYear.attributes.year">{{ schoolYear.attributes.year }}</option>
            </select>
          </div>

          <div class="mb-4">
            <label for="year" class="block text-sm font-medium text-gray-700">Year Level:</label>
            <select v-model="programForm.year" id="year" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
              <option value="1">1st year</option>
              <option value="2">2nd year</option>
              <option value="3">3rd year</option>
              <option value="4">4th year</option>
              <option value="5">5th year</option>
            </select>
          </div>

          <div class="flex justify-end space-x-4 mt-6">
          <button 
            type="submit" 
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >{{ isEditing ? 'Update' : 'Create' }}</button>
          <button @click="closeModal" type="button" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md">
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
import { toast } from 'vue3-toastify';
import LoadingComponent from '../reuseable/LoadingComponent.vue';

export default {
  components: { LoadingComponent },
  name: 'ManageProgramComponent',
  data() {
    return {
      isLoading: false,
      role: '',
      programs: [],
      schoolYears: [],
      isModalOpen: false,
      isEditing: false,
      programForm: {
        id: '', 
        description: '',
        sem: '',
        code: '',
        sy: '',
        status: '',
        year: '',
        lecture: '',
        laboratory: ''
      }
    };
  },
  methods: {
    async fetchPrograms() {
      try {
        this.isLoading = true;
        const token = sessionStorage.getItem('jwt');
        const response = await axios.get('https://api.nemsu-grading.online/api/subjects', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.programs = response.data.data;
      } catch (error) {
        toast.error(error.response.data.error.message);
        console.error('Error fetching programs:', error);
      } finally {
        this.isLoading = false
      }
    },
    async fetchSchoolYears() {
      try {

        const token = sessionStorage.getItem('jwt');
        const response = await axios.get('https://api.nemsu-grading.online/api/school-years?filters[active][$eq]=active', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.schoolYears = response.data.data;
      } catch (error) {
        toast.error(error.response.data.error.message);
        console.error('Error fetching school years:', error);
      }
    },
    
    async createProgram() {
      try {
        this.isLoading = true;
        const token = sessionStorage.getItem('jwt');
        await axios.post('https://api.nemsu-grading.online/api/subjects', {data: {...this.programForm}}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.fetchPrograms();
        this.closeModal();
        toast.success("Program Created");
      } catch (error) {
        toast.error(error.response.data.error.message);
        console.error('Error creating program:', error);
      }finally {
        this.isLoading = false
      }
    },
    openCreateModal() {
      this.resetForm();
      this.isEditing = false;
      this.isModalOpen = true;
    },
    openEditModal(program) {
      this.programForm = {...program.attributes, id: program.id};
      this.isEditing = true;
      this.isModalOpen = true;
    },
    async updateProgram() {
      try {
        this.isLoading = true;
        const token = sessionStorage.getItem('jwt');
        await axios.put(`https://api.nemsu-grading.online/api/subjects/${this.programForm.id}`, {data: {...this.programForm}}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.fetchPrograms();
        this.closeModal();
        toast.success("Program Updated");
      } catch (error) {
        toast.error(error.response.data.error.message);
        console.error('Error updating program:', error);
      }finally {
        this.isLoading = false
      }
    },
    async deleteProgram(id) {
      try {
        this.isLoading = true;
        const token = sessionStorage.getItem('jwt');
        await axios.delete(`https://api.nemsu-grading.online/api/subjects/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.fetchPrograms();
        toast.success("Program deleted");
      } catch (error) {
        toast.error(error.response.data.error.message);
        console.error('Error deleting program:', error);
      }finally {
        this.isLoading = false
      }
    },
    closeModal() {
      this.isModalOpen = false;
    },
    resetForm() {
      this.programForm = {
        description: '',
        sem: '',
        code: '',
        sy: '',
        status: ''
      };
    }
  },
  mounted() {
    this.role = sessionStorage.getItem("role")
    this.fetchPrograms();
    this.fetchSchoolYears();
  }
};
</script>

<style scoped>
/* Your styles here */
</style>
