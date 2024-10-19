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
        <button @click="showLogoutModal = true" class="fixed m-2 bottom-0 left-2 px-4 py-2 rounded hover:bg-white hover:text-black text-white  w-[80%] z-50 items-center justify-center flex gap-2"> 
          <svg fill="#000000" height="24px" width="24px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 384.971 384.971" xml:space="preserve" transform="matrix(1, 0, 0, 1, 0, 0)" stroke="#000000" stroke-width="12.319072"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g id="Sign_Out"> <path d="M180.455,360.91H24.061V24.061h156.394c6.641,0,12.03-5.39,12.03-12.03s-5.39-12.03-12.03-12.03H12.03 C5.39,0.001,0,5.39,0,12.031V372.94c0,6.641,5.39,12.03,12.03,12.03h168.424c6.641,0,12.03-5.39,12.03-12.03 C192.485,366.299,187.095,360.91,180.455,360.91z"></path> <path d="M381.481,184.088l-83.009-84.2c-4.704-4.752-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l62.558,63.46H96.279 c-6.641,0-12.03,5.438-12.03,12.151c0,6.713,5.39,12.151,12.03,12.151h247.74l-62.558,63.46c-4.704,4.752-4.704,12.439,0,17.179 c4.704,4.752,12.319,4.752,17.011,0l82.997-84.2C386.113,196.588,386.161,188.756,381.481,184.088z"></path> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </g></svg>
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
