<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center mb-6">Login</h2>
      <form v-if="!grades" @submit.prevent="UserLogin">
        <div class="mb-6">
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input 
            v-model="username" 
            id="username" 
            placeholder="Enter your username"
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input 
            v-model="password" 
            id="password" 
            type="password" 
            placeholder="Enter your password"
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <Button 
          type="submit" 
          class="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">Logging in...</span>
          <span v-else>Login</span>
        </Button>

        <router-link to="/register" class="block text-center text-indigo-600 mt-4 hover:underline">Create an Account</router-link>

        <router-link to="/view-grades" class="block text-center text-gray-600 mt-4 hover:underline">View Grades</router-link>
        <p v-if="errorMessage" class="mt-4 text-red-600 text-center">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Button from './reuseable/ButtonComponent.vue';
 
export default {
  components: {
    Button,
  },
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      isSubmitting: false,
    };
  },
  methods: {
    async UserLogin() {
      this.isSubmitting = true;
      console.log('Username:', this.username);  
      console.log('Password:', this.password);  

      try {
        const response = await axios.post('http://47.129.3.25:1337/api/auth/local?populate[user_permission]=*', {
          identifier: this.username,
          password: this.password,
        });


        const { jwt } = response.data;

        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'http://47.129.3.25:1337/api/users/me?populate=*',
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${jwt}`
          }
        };

        const user = await axios.request(config)

        console.log(response)
        if (user.data.activated == false || user.data.activated == null) {
          alert("Users account not yet activated")
          return
        }
        // Save JWT token to session storage
        sessionStorage.setItem('jwt', jwt);
        sessionStorage.setItem('role', user.data.role.type);
        sessionStorage.setItem('profile', JSON.stringify(user.data));
        // Redirect to another page or notify the user
        this.$router.push('/dashboard'); 
      } catch (error) {
        this.errorMessage = 'Login failed. Please try again.';
        console.log(error);
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
/* Custom styles, if any, can be added here */
</style>
