<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside :class="['w-40 bg-gray-800 text-white flex-shrink-0 transition-transform duration-300', { 'translate-x-0': showSidebar, '-translate-x-40': !showSidebar }]">
      <div class="p-4">
        <h1 class="text-xl font-bold">Dashboard</h1>
        <ul class="mt-6 space-y-2">
          <li>
            <router-link
              to="/dashboard/home"
              :class="['block px-4 py-2 rounded', { 'bg-gray-700 text-white': isActive('/dashboard/home'), 'text-gray-300 hover:bg-gray-700': !isActive('/dashboard/home') }]"
            >
              Home
            </router-link>
          </li>
          <li>
            <router-link
              to="/dashboard/profile"
              :class="['block px-4 py-2 rounded', { 'bg-gray-700 text-white': isActive('/dashboard/profile'), 'text-gray-300 hover:bg-gray-700': !isActive('/dashboard/profile') }]"
            >
              Profile
            </router-link>
          </li>
          <li>
            <router-link
              to="/dashboard/settings"
              :class="['block px-4 py-2 rounded', { 'bg-gray-700 text-white': isActive('/dashboard/settings'), 'text-gray-300 hover:bg-gray-700': !isActive('/dashboard/settings') }]"
            >
              Settings
            </router-link>
          </li>
          <li>
            <router-link
              to="/dashboard/program"
              :class="['block px-4 py-2 rounded', { 'bg-gray-700 text-white': isActive('/dashboard/program'), 'text-gray-300 hover:bg-gray-700': !isActive('/dashboard/instructor') }]"
            >
              Manage Program
            </router-link>
          </li>
          <li>
            <router-link
              to="/dashboard/student"
              :class="['block px-4 py-2 rounded', { 'bg-gray-700 text-white': isActive('/dashboard/student'), 'text-gray-300 hover:bg-gray-700': !isActive('/dashboard/student') }]"
            >
              Manage Student
            </router-link>
          </li>
          <li>
            <router-link
              to="/dashboard/grading"
              :class="['block px-4 py-2 rounded', { 'bg-gray-700 text-white': isActive('/dashboard/grading'), 'text-gray-300 hover:bg-gray-700': !isActive('/dashboard/grading') }]"
            >
              Grading
            </router-link>
          </li>
          <li>
            <router-link
              to="/dashboard/account"
              :class="['block px-4 py-2 rounded', { 'bg-gray-700 text-white': isActive('/dashboard/account'), 'text-gray-300 hover:bg-gray-700': !isActive('/dashboard/account') }]"
            >
              Manage Account
            </router-link>
          </li>
          <li>
            <router-link
              to="/dashboard/evaluation"
              :class="['block px-4 py-2 rounded', { 'bg-gray-700 text-white': isActive('/dashboard/evaluation'), 'text-gray-300 hover:bg-gray-700': !isActive('/dashboard/instructor') }]"
            >
              Manage Evaluation
            </router-link>
          </li>
          <!-- Logout Button -->
          <li class="mt-6 self-baseline">
            <button @click="showLogoutModal = true" class="block px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </aside> 
      <!-- <nav class="w-full flex">
        <div class="flex flex-row-reverse items-center w-full justify-between bg-gray-800 text-white p-4">
          <h1 class="self-end">Hello {{ profileName }}</h1>
        </div>
      </nav>
      Main content -->
      <main class="flex-1 flex flex-col">
        <bread-crumb />
        <div class="flex-1 flex justify-center p-6 overflow-x-auto"> <!-- Added overflow-x-auto --> 
          <div class="w-full h-100%">
            <router-view></router-view> <!-- This is where nested routes will be rendered -->
          </div>
        </div>
      </main> 
    

    <!-- Modal -->
    <div v-if="showLogoutModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-lg font-semibold mb-4">Do you want to logout?</h3>
        <div class="flex justify-end space-x-4">
          <button @click="handleLogout" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Yes</button>
          <button @click="showLogoutModal = false" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumb from './reuseable/BreadCrumb.vue'; 
export default {
  components: { BreadCrumb },
  name: 'DashBoard',
  data() {
    return {
      role: '',
      showSidebar: true,
      showLogoutModal: false,
      c: ''
    };
  },
  methods: {
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    isActive(route) {
      return this.$route.path === route;
    },
    handleLogout() {
      // Remove JWT from session storage
      sessionStorage.removeItem('jwt');
      // Redirect to the sign-in page
      this.$router.push('/signin');
    },
    mounted() {
      this.role = sessionStorage.getItem("role"); 
    }
  },
  mounted() {
    var _this = this;
    let profile = JSON.parse(sessionStorage.getItem('profile'));
    _this.profileName = profile.fname;
    console.log(this.profileName)
  }
}
</script>

<style scoped>
/* Optional custom styles */
</style>
