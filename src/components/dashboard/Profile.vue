<template>
  <div class="container mx-auto p-6">
    <loading-component :isLoading="isLoading" />
    <!-- Profile Header -->
    <div class="bg-blue-500 h-32 rounded-lg mb-6 relative">
      <!-- <img src="@/assets/logo.jpg" alt="Header Image" class="w-full h-full object-cover rounded-t-lg"/> -->
      <div class="absolute bottom-0 left-0 right-0 flex justify-center items-end pb-4">
        <img :src="profile.profilePicture" alt="Profile Picture" class="w-24 h-24 rounded-full border-4 border-white object-cover"/>
      </div>
    </div>

    <!-- Profile Info -->
    <div class="bg-white p-6 rounded-lg shadow-md text-[12px]">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold">Profile</h2>
        <button @click="toggleEdit" class="bg-indigo-500 text-white px-4 py-2 rounded-md">
          {{ isEditing ? 'Save' : 'Edit' }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Profile Picture Upload Field -->
        

        <div class="flex flex-col">
          <label for="profile" class="text-sm font-medium text-gray-700">Profile:</label>
          <input type="text" id="username" class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
          @change="handleFileUpload"
          v-model="profile.profilePicture" :disabled="!isEditing" />
        </div>

        <div class="flex flex-col">
          <label for="username" class="text-sm font-medium text-gray-700">Username:</label>
          <input type="text" id="username" class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" v-model="profile.username" :disabled="!isEditing" />
        </div>

        <div class="flex flex-col">
          <label for="email" class="text-sm font-medium text-gray-700">Email:</label>
          <input type="email" id="email" class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" v-model="profile.email" :disabled="!isEditing" />
        </div>

        <div class="flex flex-col">
          <label for="firstName" class="text-sm font-medium text-gray-700">First Name:</label>
          <input type="text" id="firstName" class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" v-model="profile.fname" :disabled="!isEditing" />
        </div>

        <div class="flex flex-col">
          <label for="lastName" class="text-sm font-medium text-gray-700">Last Name:</label>
          <input type="text" id="lastName" class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" v-model="profile.lname" :disabled="!isEditing" />
        </div>

        <div class="flex flex-col">
          <label for="middleName" class="text-sm font-medium text-gray-700">Middle Name:</label>
          <input type="text" id="middleName" class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" v-model="profile.mname" :disabled="!isEditing" />
        </div>

        <div class="flex flex-col">
          <label for="gender" class="text-sm font-medium text-gray-700">Gender:</label>
          <select id="gender" class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" v-model="profile.gender" :disabled="!isEditing">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div class="flex flex-col">
          <label for="phoneNo" class="text-sm font-medium text-gray-700">Phone Number:</label>
          <input type="text" id="phoneNo" class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" v-model="profile.phone_no" :disabled="!isEditing" />
        </div>

        <div class="flex flex-col">
          <label for="birthdate" class="text-sm font-medium text-gray-700">Birthdate:</label>
          <input type="date" id="birthdate" class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" v-model="profile.bdate" :disabled="!isEditing" />
        </div>

        <div class="flex flex-col">
          <label for="address" class="text-sm font-medium text-gray-700">Address:</label>
          <input type="text" id="address" class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" v-model="profile.address" :disabled="!isEditing" />
        </div>

        
        
        <div class="flex flex-col">
          <label for="blocked" class="text-sm font-medium text-gray-700">Deactivate Account:</label>
          <div class="flex items-center mt-1">
            <input 
              type="checkbox" 
              id="blocked" 
              class="mr-2 h-5 w-5 border-gray-300 rounded focus:ring-blue-500" 
              v-model="profile.blocked" 
              :disabled="!isEditing"
            />
            <span class="text-gray-800">
              {{ profile.blocked ? 'Account is Deactivated' : 'Account is Active' }}
            </span>
          </div>
        </div>
        
 
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import LoadingComponent from '../reuseable/LoadingComponent.vue';

export default {
  components: { LoadingComponent },
  name: 'ProfileComponent',
  data() {
    return {
      isLoading: false,
      profileId: '',
      token: '',
      profile: {
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        middleName: '',
        gender: '',
        phoneNo: '',
        bdate: '',
        createdAt: '',
        updatedAt: '',
        address: '',
        provider: '',
        confirmed: false,
        blocked: false,
        profilePicture: ''
      },
      originalProfile: {},  // To store the original profile data
      isEditing: false,
      profilePic: 'https://via.placeholder.com/100?text=Profile+Pic',  // Default placeholder image
      headerImage: '@assets/logo.jpg',  // Default header image
      file: null
    };
  },
  mounted() { 
    const profileData = JSON.parse(sessionStorage.getItem('profile'));
    this.profileId = profileData.id;
    this.token = sessionStorage.getItem('jwt');  
    
      this.loadProfile(); 
    
  },
  methods: {
    async loadProfile() { 
    try {
       this.isLoading = true
      const response = await axios.get(`https://api.nemsu-grading.online/api/users/${this.profileId}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (response.status === 200) {
        this.profile = { ...response.data };
        this.originalProfile = { ...this.profile }; // Save original profile data
        sessionStorage.setItem('profile', JSON.stringify(response.data));
        this.profilePicture = this.profile.profilePic || 'https://via.placeholder.com/100?text=Profile+Pic'; // Default placeholder image
      } else {
        alert('Failed to load profile.');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('Error loading profile.');
    } finally {
      this.isLoading = false
    }
    },
    toggleEdit() {
      if (this.isEditing) {
        // Save changes
        this.updateProfile();
      } else {
        // Enter edit mode
        this.originalProfile = { ...this.profile };  // Save original profile data
      }
      this.isEditing = !this.isEditing;
    },
    handleFileUpload(event) {
          console.log(event)
          this.profilePic = event.target.result; 
    },
    async updateProfile() {
  try {
    this.isLoading = true;
    // Retrieve token from sessionStorage
    const formData = new FormData();

    // Append profile data
    for (const [key, value] of Object.entries(this.profile)) {
      // Skip role or other complex fields if they are not supposed to be updated
      if (key !== 'role') {
        formData.append(key, value);
      }
    }

    // Append profile picture if available
    if (this.profilePic) { 
      formData.append('profilePicture', this.profilePic);
    } 
    const response = await axios.put(`https://api.nemsu-grading.online/api/users/${this.profileId}`, formData, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.status === 200) {
      // Update session storage with new profile data
     
      alert('Profile updated successfully!');
      this.loadProfile();
    } else {
      alert('Failed to update profile.');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    // Revert to original profile data if there's an error
    this.profile = { ...this.originalProfile };
    alert('Error updating profile. Changes reverted.');
  } finally {
      this.isLoading = false
    }
}
  }
}
</script>
