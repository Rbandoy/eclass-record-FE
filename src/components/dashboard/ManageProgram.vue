<template>
  <div class="container mx-auto p-6">
    <div class="flex flex-row justify-between">
      <h1 class="text-3xl font-bold">Manage Programs</h1>

      <!-- Button to open the Create Program Modal -->
      <button @click="openCreateModal" class="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">Add Program</button>
    </div>

    <!-- Program List --> 
    <div class="overflow-x-auto mt-10">
      <table class="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Code</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Program</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Units</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Semester</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">School Year</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="program in programs" :key="program.id" class="border-b border-gray-200">
            <td class="px-6 py-4 whitespace-nowrap">{{ program.attributes.code }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ program.attributes.description }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ program.attributes.units }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ program.attributes.sem }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ program.attributes.sy }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ program.attributes.status }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
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
            <input type="text" v-model="programForm.sy" id="sy" required placeholder="e.g. 2024-2025" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" @input="validateSchoolYear"/>
            <p v-if="schoolYearError" class="text-red-500 text-sm mt-1">{{ schoolYearError }}</p>
          </div>

          <button v-if="!schoolYearError" type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">{{ isEditing ? 'Update' : 'Create' }}</button>
          <button type="button" @click="closeModal" class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 ml-2">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ManageProgramComponent',
  data() {
    return {
      programs: [],
      isModalOpen: false,
      isEditing: false,
      programForm: {
        id: '', 
        description: '',
        sem: '',
        code: '',
        sy: '',
        status: ''
      },
      schoolYearError: ''
    };
  },
  methods: {
    async fetchPrograms() {
      try {
        const token = sessionStorage.getItem('jwt');
        const response = await axios.get('http://localhost:1337/api/subjects', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.programs = response.data.data;
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    },
    async createProgram() {
      try {
        const token = sessionStorage.getItem('jwt');
        await axios.post('http://localhost:1337/api/subjects', {data: {...this.programForm}}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.fetchPrograms();
        this.closeModal();
      } catch (error) {
        console.error('Error creating program:', error);
      }
    },
    openCreateModal() {
      this.resetForm();
      this.isEditing = false;
      this.isModalOpen = true;
    },
    openEditModal(program) {
      this.programForm = { ...program.attributes, ...program };
      this.isEditing = true;
      this.isModalOpen = true;
    },
    async updateProgram() {
      try {
        const token = sessionStorage.getItem('jwt');
        await axios.put(`http://localhost:1337/api/subjects/${this.programForm.id}`, {data: this.programForm}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.fetchPrograms();
        this.closeModal();
      } catch (error) {
        console.error('Error updating program:', error);
      }
    },
    async deleteProgram(id) {
      try {
        const token = sessionStorage.getItem('jwt');
        await axios.delete(`http://localhost:1337/api/subjects/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.programs = this.programs.filter(program => program.id !== id);
      } catch (error) {
        console.error('Error deleting program:', error);
      }
    },
    closeModal() {
      this.isModalOpen = false;
    },
    resetForm() {
      this.programForm = {
        id: null,
        description: '',
        sem: '1',
        sy: '',
        code: '',
        status: ''
      };
      this.schoolYearError = '';
    },
    validateSchoolYear() {
      const syPattern = /^\d{4}-\d{4}$/;
      if (!syPattern.test(this.programForm.sy)) {
        this.schoolYearError = 'Invalid school year format. Use YYYY-YYYY.';
      } else {
        this.schoolYearError = '';
      }
    }
  },
  mounted() {
    this.fetchPrograms();
  }
};
</script>
