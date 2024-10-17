<template>
  <div class="manage-school-year">
    <h2>Manage School Years</h2>
    <table>
      <thead>
        <tr>
          <th>School Year</th>
          <th>Active Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="year in schoolYears" :key="year.id">
          <td>{{ year.year }}</td>
          <td>
            <input
              type="checkbox"
              :checked="year.isActive"
              @change="toggleActiveStatus(year)"
            />
          </td>
          <td>
            <button @click="deleteSchoolYear(year.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "SchoolYearComponent",
  data() {
    return {
      schoolYears: [],
    };
  },
  methods: {
    // Fetch school years from API
    fetchSchoolYears() {
      axios
        .get('/api/schoolyears') // Replace with your actual API endpoint
        .then((response) => {
          this.schoolYears = response.data;
        })
        .catch((error) => {
          console.error('Error fetching school years:', error);
        });
    },
    // Toggle the active status of a school year
    toggleActiveStatus(year) {
      const updatedYear = { ...year, isActive: !year.isActive };
      axios
        .put(`/api/schoolyears/${year.id}`, updatedYear) // Replace with your actual API endpoint
        .then(() => {
          year.isActive = updatedYear.isActive; // Update the UI
        })
        .catch((error) => {
          console.error('Error updating school year status:', error);
        });
    },
    // Delete a school year
    deleteSchoolYear(id) {
      axios
        .delete(`/api/schoolyears/${id}`) // Replace with your actual API endpoint
        .then(() => {
          this.schoolYears = this.schoolYears.filter((year) => year.id !== id);
        })
        .catch((error) => {
          console.error('Error deleting school year:', error);
        });
    },
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
</style>
