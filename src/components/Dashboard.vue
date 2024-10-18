<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside :class="['w-40 bg-blue-600 text-white flex-shrink-0 transition-transform duration-300', { 'translate-x-0': showSidebar, '-translate-x-40': !showSidebar }]">
      <div class="p-4">
        <img src="@/assets/logo.jpg" alt="School Logo" class="h-30 w-full" />
        <ul class="mt-6 space-y-2">
          <li>
            <router-link
              to="/dashboard/home"
              :class="['block px-4 py-2 rounded', { 'bg-white text-black': isActive('/dashboard/home'), 'text-gray-200 hover:bg-gray-700': !isActive('/dashboard/home') }]"
            >
              Home
            </router-link>
          </li>
        
          <li>
            <router-link
              to="/dashboard/profile"
              :class="['block px-4 py-2 rounded', { 'bg-white text-black': isActive('/dashboard/profile'), 'text-gray-200 hover:bg-gray-700': !isActive('/dashboard/profile') }]"
            >
              Profile
            </router-link>
          </li>

          <!-- <label class="text-sm italic">Manage</label> -->
          <div class="w-full border-t-2"></div>
          <li v-if="role === 'admin'">
            <router-link
              to="/dashboard/settings"
              :class="['block px-4 py-2 rounded', { 'bg-white text-black': isActive('/dashboard/settings'), 'text-gray-200 hover:bg-gray-700': !isActive('/dashboard/settings') }]"
            >
              Settings
            </router-link>
          </li>
          <li v-if="role === 'admin' || role === 'evaluator'">
            <router-link
              to="/dashboard/program"
              :class="['block px-4 py-2 rounded', { 'bg-white text-black': isActive('/dashboard/program'), 'text-gray-200 hover:bg-gray-700': !isActive('/dashboard/program') }]"
            >
              Program
            </router-link>
          </li>
          <li v-if="role === 'admin' || role === 'instructor'">
            <router-link
              to="/dashboard/student"
              :class="['block px-4 py-2 rounded', { 'bg-white text-black': isActive('/dashboard/student'), 'text-gray-200 hover:bg-gray-700': !isActive('/dashboard/student') }]"
            >
              Student
            </router-link>
          </li>
          <li v-if="role === 'admin' || role == 'instructor'">
            <router-link
              to="/dashboard/grading"
              :class="['block px-4 py-2 rounded', { 'bg-white text-black': isActive('/dashboard/grading'), 'text-gray-200 hover:bg-gray-700': !isActive('/dashboard/grading') }]"
            >
              Grading
            </router-link>
          </li>
          <li v-if="role === 'admin'">
            <router-link
              to="/dashboard/account"
              :class="['block px-4 py-2 rounded', { 'bg-white text-black': isActive('/dashboard/account'), 'text-gray-200 hover:bg-gray-700': !isActive('/dashboard/account') }]"
            >
              Account
            </router-link>
          </li>
          <li v-if="role === 'evaluator'">
            <router-link
              to="/dashboard/evaluation"
              :class="['block px-4 py-2 rounded', { 'bg-white text-black': isActive('/dashboard/evaluation'), 'text-gray-200 hover:bg-gray-700': !isActive('/dashboard/evaluation') }]"
            >
              Evaluation
            </router-link>
          </li>
          <!-- Logout Button -->
          <li class="mt-6 self-baseline">
           
          </li>
          
        </ul>
        <button @click="showLogoutModal = true" class="fixed m-2 bottom-0 left-2 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 w-[80%] z-50">
          Logout
        </button>
      </div>
    </aside>
    
    <main class="flex-1 flex flex-col">
      <bread-crumb />
      <div class="flex-1 flex justify-center p-6 overflow-x-auto"> 
        <div class="w-full h-100%">
          <router-view></router-view> 
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
      console.log("asdas",sessionStorage.getItem("profile"))
    }
  },
  mounted() {
    this.role = sessionStorage.getItem("role"); 
    console.log("asdas",sessionStorage.getItem("profile"))
    var _this = this;
    let profile = JSON.parse(sessionStorage.getItem('profile'));
    _this.profileName = profile.fname; 
  }
}
</script>

<style scoped>
/* Optional custom styles */
</style>
