// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router
// Import Tailwind CSS
import './assets/tailwind.css';
import {GcSpreadSheets, GcWorksheet, GcColumn} from '@mescius/spread-sheets-vue'
import { ToastContainer } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css'; // Import styles
import Vue3Print from 'vue-print-nb';

 

const app = createApp(App);
app.component('gc-spread-sheets', GcSpreadSheets);
app.component('gc-worksheet', GcWorksheet);
app.component('gc-column', GcColumn);
app.component('ToastContainer', ToastContainer);
app.use(Vue3Print);
app.use(router); // Use the router

 
app.mount('#app');
