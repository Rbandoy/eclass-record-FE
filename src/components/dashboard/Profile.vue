<template>
  <div class="container mx-auto p-6">
    <loading-component :isLoading="isLoading" />
    <!-- Profile Header -->
    <div class="bg-blue-500 h-32 rounded-lg mb-6 relative">
      <!-- <img src="@/assets/logo.jpg" alt="Header Image" class="w-full h-full object-cover rounded-t-lg"/> -->
      <div
        class="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-4"
      >
        <!-- Profile Picture Section with Clickable Upload -->
        <div
          class="bg-gray-100 p-2 rounded-full shadow-md border-2 border-gray-300 cursor-pointer"
          @click="triggerFileInput"
        >
          <img
            :src="profPicture"
            alt="Profile Picture"
            class="w-24 h-24 rounded-full object-cover hover:scale-90 hover:transition-transform"
          />
          <input
            type="file"
            @change="onFileSelected"
            accept="image/*"
            class="hidden"
            ref="fileInput"
          />
        </div>

        <!-- Conditional Rendering of Upload and Save Buttons -->

        <!-- Save Button with SVG Icon -->
        <p
          @click="uploadFile"
          v-if="selectedFile"
          class="hover:bg-blue-600 cursor-pointer hover:border"
        >
          <svg
            width="30"
            height="30"
            fill="white"
            viewBox="0 0 32 32"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <title>save</title>
              <path
                d="M9.467 3.106h3.030c0.266 0 0.482 0.278 0.482 0.621v4.374c0 0.343-0.216 0.621-0.482 0.621h-3.030c-0.266 0-0.482-0.278-0.482-0.621v-4.374c0-0.343 0.216-0.621 0.482-0.621zM21.964 14.524l7.987 7.987h-3.993v7.987h-7.987v-7.987h-3.993l7.987-7.987zM17.422 24.768h-10.309c-0.276 0-0.499-0.223-0.499-0.499v-11.481c0-0.276 0.223-0.499 0.499-0.499h17.721c0.276 0 0.499 0.223 0.499 0.499v4.402l3.12 3.12v-13.262c0-0.276-4.216-4.493-4.493-4.493h-4.741c0.169 0.069 0.287 0.223 0.287 0.404v6.181c0 0.244-0.216 0.442-0.482 0.442h-10.594c-0.266 0-0.482-0.198-0.482-0.442v-6.181c0-0.18 0.118-0.335 0.287-0.404h-4.242c-0.277 0-0.499 0.223-0.499 0.499v23.961c0 0.277 0.223 0.499 0.499 0.499h13.429v-2.746zM26.506 22.903v4.611h1.449c0.277 0 0.499-0.223 0.499-0.499v-4.111l-1.948 0z"
              ></path>
            </g>
          </svg>
        </p>
      </div>
    </div>

    <!-- Profile Info -->
    <div class="bg-white p-6 rounded-lg shadow-md text-[12px]">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold">Profile</h2>
        <button
          @click="toggleEdit"
          class="bg-indigo-500 text-white px-4 py-2 rounded-md"
        >
          {{ isEditing ? "Save" : "Edit" }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Profile Picture Upload Field -->
        <div class="flex flex-col">
          <label for="idNo" class="text-sm font-medium text-gray-700"
            >Id No:</label
          >
          <input
            type="text"
            id="idNo"
            class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            v-model="profile.idNo"
            :disabled="!isEditing"
          />
        </div>

        <div class="flex flex-col">
          <label for="username" class="text-sm font-medium text-gray-700"
            >Username:</label
          >
          <input
            type="text"
            id="username"
            class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            v-model="profile.username"
            :disabled="!isEditing"
          />
        </div>

        <div class="flex flex-col">
          <label for="email" class="text-sm font-medium text-gray-700"
            >Email:</label
          >
          <input
            type="email"
            id="email"
            class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            v-model="profile.email"
            :disabled="!isEditing"
          />
        </div>

        <div class="flex flex-col">
          <label for="firstName" class="text-sm font-medium text-gray-700"
            >First Name:</label
          >
          <input
            type="text"
            id="firstName"
            class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            v-model="profile.fname"
            :disabled="!isEditing"
          />
        </div>

        <div class="flex flex-col">
          <label for="lastName" class="text-sm font-medium text-gray-700"
            >Last Name:</label
          >
          <input
            type="text"
            id="lastName"
            class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            v-model="profile.lname"
            :disabled="!isEditing"
          />
        </div>

        <div class="flex flex-col">
          <label for="middleName" class="text-sm font-medium text-gray-700"
            >Middle Name:</label
          >
          <input
            type="text"
            id="middleName"
            class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            v-model="profile.mname"
            :disabled="!isEditing"
          />
        </div>

        <div class="flex flex-col">
          <label for="gender" class="text-sm font-medium text-gray-700"
            >Gender:</label
          >
          <select
            id="gender"
            class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            v-model="profile.gender"
            :disabled="!isEditing"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div class="flex flex-col">
          <label for="phoneNo" class="text-sm font-medium text-gray-700"
            >Phone Number:</label
          >
          <input
            type="text"
            id="phoneNo"
            class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            v-model="profile.phone_no"
            :disabled="!isEditing"
          />
        </div>

        <div class="flex flex-col">
          <label for="birthdate" class="text-sm font-medium text-gray-700"
            >Birthdate:</label
          >
          <input
            type="date"
            id="birthdate"
            class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            v-model="profile.bdate"
            :disabled="!isEditing"
          />
        </div>

        <div class="flex flex-col">
          <label for="address" class="text-sm font-medium text-gray-700"
            >Address:</label
          >
          <input
            type="text"
            id="address"
            class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            v-model="profile.address"
            :disabled="!isEditing"
          />
        </div>

        <div class="flex flex-col">
          <label for="blocked" class="text-sm font-medium text-gray-700"
            >Deactivate Account:</label
          >
          <div class="flex items-center mt-1">
            <input
              type="checkbox"
              id="blocked"
              class="mr-2 h-5 w-5 border-gray-300 rounded focus:ring-blue-500"
              v-model="profile.blocked"
              :disabled="!isEditing"
            />
            <span class="text-gray-800">
              {{
                profile.blocked ? "Account is Deactivated" : "Account is Active"
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import LoadingComponent from "../reuseable/LoadingComponent.vue";
import { toast } from "vue3-toastify";

export default {
  components: { LoadingComponent },
  name: "ProfileComponent",
  data() {
    return {
      isLoading: false,
      profileId: "",
      selectedFile: null,
      token: "",
      profile: {
        idNo: "",
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        middleName: "",
        gender: "",
        phoneNo: "",
        bdate: "",
        createdAt: "",
        updatedAt: "",
        address: "",
        provider: "",
        confirmed: false,
        blocked: false,
        profilePicture:
          "https://api.nemsu-grading.online/uploads/23_5768fecede.png",
      },
      profPicture: "",
      originalProfile: {}, // To store the original profile data
      isEditing: false,
      profilePic: "https://via.placeholder.com/100?text=Profile+Pic", // Default placeholder image
      headerImage: "@assets/logo.jpg", // Default header image
      file: null,
    };
  },
  mounted() {
    const profileData = JSON.parse(sessionStorage.getItem("profile"));
    this.profileId = profileData.id;
    this.token = sessionStorage.getItem("jwt");

    this.loadProfile();
    this.fetchFiles();
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click(); // Programmatically trigger the file input
    },
    onFileSelected(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        const reader = new FileReader();
        // Read the file as a data URL
        reader.readAsDataURL(file);
        // When the file is loaded, set it as the image URL
        reader.onload = () => {
          this.profPicture = reader.result;
        };

        reader.onerror = (error) => {
          console.error("Error loading image:", error);
        };
      }
    },
    async uploadFile() {
      const file = this.selectedFile;
      const formData = new FormData();
      const profileId = JSON.parse(sessionStorage.getItem("profile")).id;
      console.log("profile", this.profile.profilePicture[0]);
      try {
        await axios.delete(
          `https://api.nemsu-grading.online/api/upload/files/${this.profile.profilePicture[0].id}`
        );
      } catch (error) {
        //
      }

      formData.append("files", file, profileId + ".png"); // Change filename if needed

      await fetch("https://api.nemsu-grading.online/api/upload/", {
        method: "POST",
        body: formData,
        // Uncomment if you need to send authorization token
        // headers: { 'Authorization': `Bearer ${token}` },
      });
      this.fetchFiles();
      toast.success("Profile Picture Updated");
      this.selectedFile = null;
    },
    async fetchFiles() {
      // const token = sessionStorage.getItem('jwt');
      try {
        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: "https://api.nemsu-grading.online/api/upload/files/",
        };
        const response = await axios.request(config);
        const profileId = JSON.parse(sessionStorage.getItem("profile")).id;

        const profilePicture =
          response.data.reduce((acc, cur) => {
            if (cur?.name == profileId + ".png") {
              acc.push(cur);
            }
            return acc; // You must return the accumulator
          }, []) || [];

        this.profile.profilePicture = profilePicture;

        this.profPicture = `https://api.nemsu-grading.online${profilePicture[0].url}`;
        console.log(this.profPicture);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    },
    toggleEdit() {
      if (this.isEditing) {
        // Save changes
        this.updateProfile();
      } else {
        // Enter edit mode
        this.originalProfile = { ...this.profile }; // Save original profile data
      }
      this.isEditing = !this.isEditing;
    },
    handleFileUpload(event) {
      console.log(event);
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
          if (key !== "role") {
            formData.append(key, value);
          }
        }

        // Append profile picture if available
        if (this.profile.profilePicture) {
          delete this.profile.profilePicture;
          // formData.append('profilePicture', this.profilePic);
        }
        const response = await axios.put(
          `https://api.nemsu-grading.online/api/users/${this.profileId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          // Update session storage with new profile data

          alert("Profile updated successfully!");
          this.loadProfile();
        } else {
          alert("Failed to update profile.");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        // Revert to original profile data if there's an error
        this.profile = { ...this.originalProfile };
        alert("Error updating profile. Changes reverted.");
      } finally {
        this.isLoading = false;
      }
    },
    async loadProfile() {
      try {
        this.isLoading = true;
        const response = await axios.get(
          `https://api.nemsu-grading.online/api/users/${this.profileId}`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        if (response.status === 200) {
          this.profile = { ...response.data };
          this.originalProfile = { ...this.profile }; // Save original profile data
          sessionStorage.setItem("profile", JSON.stringify(response.data));
          this.profilePicture =
            this.profile.profilePic ||
            "https://via.placeholder.com/100?text=Profile+Pic"; // Default placeholder image
        } else {
          alert("Failed to load profile.");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        alert("Error loading profile.");
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style>
.bg-gray-100 {
  background-color: #f0f2f5; /* Light gray background like Facebook */
}

.bg-white {
  background-color: #ffffff; /* White background for buttons */
}

.border-gray-300 {
  border-color: #d7d9db; /* Light gray border for a subtle look */
}

.shadow-md {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

.cursor-pointer {
  cursor: pointer; /* Pointer cursor for upload button */
}
</style>
