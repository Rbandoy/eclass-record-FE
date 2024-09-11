import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '@/components/UserLogin.vue';
import Dashboard from '@/components/Dashboard.vue';
import Home from '@/components/dashboard/Home.vue';
import Profile from '@/components/dashboard/Profile.vue';
import Settings from '@/components/dashboard/Settings.vue';
import NotFound from '@/components/NotFound.vue';
import ManageGrading from '@/components/dashboard/ManageGrading.vue';
import ManageInstructor from '@/components/dashboard/ManageInstructor.vue';
import ManageProgram from '@/components/dashboard/ManageProgram.vue';
import ManageEvaluation from '@/components/dashboard/ManageEvaluation.vue';
import ManageStudent from '@/components/dashboard/ManageStudent.vue';

// Define your routes
const routes = [
  { path: '/signin', name: 'signin', component: UserLogin },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    children: [
      { path: '', redirect: '/dashboard/home' }, // Redirect root dashboard to home
      { path: 'home', name: 'home', component: Home },
      { path: 'profile', name: 'profile', component: Profile },
      { path: 'settings', name: 'settings', component: Settings },
      { path: 'grading', name: 'grading', component: ManageGrading },
      { path: 'program', name: 'program', component: ManageProgram },
      { path: 'evaluation', name: 'evaluation', component: ManageEvaluation },
      { path: 'account', name: 'account', component: ManageInstructor },
      { path: 'student', name: 'student', component: ManageStudent},
      { path: '/:catchAll(.*)', name: 'NotFound', component: NotFound }
    ]
  },
  { path: '/:catchAll(.*)', name: 'NotFound', component: NotFound }
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = sessionStorage.getItem('jwt');

  if (to.name !== 'signin' && !isAuthenticated) {
    next({ name: 'signin' });
  } else if (to.name === 'signin' && isAuthenticated) {
    next({ name: '/dashboard' }); // Redirect to home if authenticated
  } else {
    next();
  }
});

console.log('Router setup:', router);

export default router;
