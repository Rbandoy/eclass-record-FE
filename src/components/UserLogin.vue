<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center mb-6">Login</h2>
      <form @submit.prevent="UserLogin">
        <div class="mb-4">
          <input 
            v-model="username" 
            id="username" 
            label="Username" 
            placeholder="Enter your username"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div class="mb-6">
          <input 
            v-model="password" 
            id="password" 
            type="password" 
            label="Password" 
            placeholder="Enter your password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="isSubmitting"
        >
          Login
        </Button>
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
        const response = await axios.post('http://localhost:1337/api/auth/local/', {
        identifier: this.username,
          password: this.password,
        });

        const { jwt, user } = response.data;

     
       
        // Save JWT token to session storage
        sessionStorage.setItem('jwt', jwt);
        sessionStorage.setItem('role', user);
        sessionStorage.setItem('profile', JSON.stringify(user));
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
