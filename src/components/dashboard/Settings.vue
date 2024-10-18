<template>
  <div class="manage-school-year">
    <h2>Manage School Years</h2>
    <button @click="showModal = true">Add School Year</button>
    <table>
      <thead>
        <tr>
          <th>School Year</th>
          <th>Sem</th>
          <th>Active Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="year in schoolYears" :key="year.id">
          <td>{{ year.attributes.year }}</td>
          <td>{{ year.attributes.sem }}</td>
          <td>
            <input
              type="checkbox"
              :checked="year.attributes.active"
              @change="toggleActiveStatus(year)"
            />
          </td>
          <td>
            <button @click="deleteSchoolYear(year.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal for Adding School Year -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>Add School Year</h3>
        <form @submit.prevent="addSchoolYear">
          <label for="year">School Year:</label>
          <input type="text" v-model="newSchoolYear.year" required />

          <label for="sem">Semester:</label>
          <input type="text" v-model="newSchoolYear.sem" required />

          <label for="active">Active Status:</label>
          <input type="checkbox" v-model="newSchoolYear.active" />

          <button type="submit">Add School Year</button>
          <button type="button" @click="showModal = false">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "SchoolYearComponent",
  data() {
    return {
      schoolYears: [],
      showModal: false, // Control modal visibility
      newSchoolYear: {
        year: '',
        sem: '',
        active: false
      }
    };
  },
  methods: {
    async fetchSchoolYears() {
      const response = await axios.get(`https://api.nemsu-grading.online/api/school-years`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
        }
      });

      this.schoolYears = response.data.data;
    },
    async toggleActiveStatus(year) {
      year.attributes.active = !year.attributes.active;
      const updatedYear = { data: { active: year.attributes.active } };
      await axios.put(`https://api.nemsu-grading.online/api/school-years/${year.id}`, updatedYear, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
        }
      });
    },
    async deleteSchoolYear(id) {
      try {
        await axios.delete(`https://api.nemsu-grading.online/api/school-years/${id}`);
        this.schoolYears = this.schoolYears.filter((year) => year.id !== id);
      } catch (error) {
        console.error('Error deleting school year:', error);
      }
    },
    async addSchoolYear() {
      try {
        const response = await axios.post(`https://api.nemsu-grading.online/api/school-years`, {
          data: this.newSchoolYear
        }, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
          }
        });

        // Add new school year to the list
        this.schoolYears.push(response.data.data);
        this.newSchoolYear = { year: '', sem: '', active: false }; // Reset the form
        this.showModal = false; // Close the modal
      } catch (error) {
        console.error('Error adding school year:', error);
      }
    }
  },
  created() {
    this.fetchSchoolYears(); // Fetch school years on component load
  },
};
</script>

<style scoped>
.manage-school-year {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

button {
  background-color: #ff4b5c;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #ff1c3d;
}

/* Modal Styles */
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
  border-radius: 5px;
  width: 300px;
}

.modal label {
  display: block;
  margin: 10px 0 5px;
}

.modal input[type="text"] {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}
</style>
