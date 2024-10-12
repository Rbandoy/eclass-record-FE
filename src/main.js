// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router
// Import Tailwind CSS
import './assets/tailwind.css';
import {GcSpreadSheets, GcWorksheet, GcColumn} from '@mescius/spread-sheets-vue'
 

const app = createApp(App);
app.component('gc-spread-sheets', GcSpreadSheets);
app.component('gc-worksheet', GcWorksheet);
app.component('gc-column', GcColumn);
app.use(router); // Use the router

app.mount('#app');
