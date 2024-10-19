<template>
  <div class="manage-school-year">
    <loading-component :isLoading="isLoading"/>
    <h2 class="text-3xl font-bold text-center mb-6">Manage School Years</h2>
    <button @click="showModal = true" class="btn-primary mb-4 bg-blue-600 text-[12px]">Add School Year</button>

    <table class="table-auto border-collapse border border-gray-300 w-full text-[12px]">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2">School Year</th>
          <th class="border border-gray-300 px-4 py-2">Semester</th>
          <th class="border border-gray-300 px-4 py-2">Active Status</th>
        </tr>
      </thead>
      <tbody>
        <tr 
         :class="{ 'bg-yellow-200': year.attributes.active}"
        class="hover:bg-blue-600 cursor-pointer" @click="toggleActiveStatus(year)" v-for="year in schoolYears" :key="year.id">
          <td class="border border-gray-300 px-4 py-2">{{ year.attributes.year }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ year.attributes.sem }}</td>
          <td class="border border-gray-300 px-4 py-2 align-middle items-center">
            <input
              type="checkbox"
              :checked="year.attributes.active" 
              class="toggle-checkbox"
            />
            <span class="ml-2">{{ year.attributes.active ? 'Active' : 'Not Active' }}</span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal for Adding School Year -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3 class="text-xl font-bold mb-4">Add School Year</h3>
        <form class="text-[12px]" @submit.prevent="addSchoolYear">
          <label for="year">School Year:</label>
          <input type="text" v-model="newSchoolYear.year" required class="input-field" />

          <label for="sem">Semester:</label>
          <input type="text" v-model="newSchoolYear.sem" required class="input-field" />

          <label for="active">Active Status:</label>
          <input class="cursor-pointer" type="checkbox" v-model="newSchoolYear.active" />
          <span class="ml-2">{{ newSchoolYear.active ? 'Active' : 'Not Active' }}</span>
          <div class="modal-buttons">
            <button type="submit" class="btn-primary  bg-blue-600">Add School Year</button>
            <button @click="showModal = false" type="button" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md">
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
  name: "SchoolYearComponent",
  data() {
    return {
      isLoading: false,
      schoolYears: [],
      showModal: false,
      newSchoolYear: {
        year: '',
        sem: '',
        active: false
      }
    };
  },
  methods: {
    async fetchSchoolYears() {
      try {
        this.isLoading = true;
        const response = await axios.get(`https://nemsu-grading.online/api/school-years`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
        }
        });
        this.schoolYears = response.data.data;
      } catch (error) {
        toast.error(error.response.data.error.message)
      } finally {
        this.isLoading = false
      }
      
    },
    async toggleActiveStatus(year) {
      year.attributes.active = !year.attributes.active;
      const updatedYear = { data: { active: year.attributes.active } };

      try {
        this.isLoading = true;
        await axios.put(`https://nemsu-grading.online/api/school-years/${year.id}`, updatedYear, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
          }
        });
        toast.success(`School Year ${year.attributes.year} ${year.attributes.active == true ? "Activated": "Disabled"} `)
      } catch (error) {
        toast.error(error.response.data.error.message);
      } finally {
        this.isLoading = false;
      }
    },
    async addSchoolYear() {
      try {
        this.isLoading = true;
        const response = await axios.post(`https://nemsu-grading.online/api/school-years`, {
          data: this.newSchoolYear
        }, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
          }
        });

        this.schoolYears.push(response.data.data);
        this.newSchoolYear = { year: '', sem: '', active: false };
        this.showModal = false;
        this.isLoading = false;
        toast.success('School Year Added Successfully');
      } catch (error) {
        toast.error(error.response.data.error.message)
        console.error('Error adding school year:', error);
      }
    }
  },
  created() {
    this.fetchSchoolYears();
  },
};
</script>

<style scoped>
.manage-school-year {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
}

.btn-primary { 
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer; 
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-secondary {
  background-color: #f44336; /* Red */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.btn-secondary:hover {
  background-color: #d32f2f;
}

.table-auto {
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
}

th {
  background-color: #f2f2f2;
  color: #333;
}

.toggle-checkbox {
  cursor: pointer;
}

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
  width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.modal label {
  display: block;
  margin: 10px 0 5px;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 3px;
  margin-top: 20px;
}
</style>
