<template>
  <div class="manage-evaluation">
    <h1 v-if="selectedStudent" class="page-title">Student Evaluation</h1>

    <!-- Search Student -->
    <div v-if="!selectedStudent" class="search-student">
      <input v-model="searchQuery" placeholder="Search Student ID" />
      <button @click="searchStudent">Search</button>
    </div>
    <div ref="printSection"  class="print-section">
      <div class="flex items-center mb-4">
        <div class="flex w-full space-x-4 items-center justify-center gap-4">
          
          <div class="flex self-center flex-col items-center justify-center">
            <img src="@/assets/logo.jpg" alt="School Logo" class="h-20 w-20" />
            <h2 class="text-lg font-semibold text-gray-700">
              NORTH EASTERN MINDANAO STATE UNIVERSITY
            </h2>
            <h3 class="text-sm font-medium text-gray-500">
              Cantilan, Surigao del Sur
            </h3> 
          </div>
        </div>
        <!-- <div class="text-right">
        <p class="text-xs text-gray-500">Printed on: {{ new Date().toLocaleDateString() }}</p>
      </div> -->
      </div>

      <!-- Student Information Section -->
      <div class="border-t border-b py-4 mb-2 flex flex-col">
        <div class="flex justify-center items-center flex-col">
          <h3 class="text-sm font-medium text-gray-500">
            Report of Grades
          </h3>
          <p class="text-xs text-gray-500">
            SY: {{ selected_school_year }} Term:
            {{ eval_sem }}
          </p>
        </div>
        <div class="grid grid-cols-2 gap-4 mt-[30px]">
          <div>
            <p class="text-sm font-medium text-gray-700">
              <span class="font-semibold">IDNO:</span>
              {{ selectedStudent?.student_id }}
            </p>
            <p class="text-sm font-medium text-gray-700">
              <span class="font-semibold">Lastname:</span>
              {{ selectedStudent?.lname }}
            </p>
            <p class="text-sm font-medium text-gray-700">
              <span class="font-semibold">Firstname:</span>
              {{ selectedStudent?.fname }}
            </p>
            <p class="text-sm font-medium text-gray-700">
              <span class="font-semibold">Middle Name:</span>
              {{ selectedStudent?.mname }}
            </p>
            <p class="text-sm font-medium text-gray-700">
              <span class="font-semibold">Sex:</span>
              {{ selectedStudent?.gender }}
            </p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-700">
              <span class="font-semibold">Course:</span>
              {{ selectedStudent?.course }}
            </p>
            <p class="text-sm font-medium text-gray-700">
              <span class="font-semibold">Year Level:</span>
              {{ selectedStudent?.year }}
            </p>
            <p class="text-sm font-medium text-gray-700">
              <span class="font-semibold">Status:</span>
              {{ selectedStudent?.status }}
            </p> 
          </div>
        </div>
      </div>

      <div class="mt-4">
        <table class="min-w-full table-auto border border-gray-300">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">
                Course No.
              </th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">
                Section
              </th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">
                Descriptive Title
              </th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">
                Time
              </th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">
                Days
              </th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">
                Room
              </th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">
                Bldg
              </th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">
                Lec
              </th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">
                Lab
              </th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">
                Units
              </th>
              <th class="px-2 py-2 border font-medium text-sm text-gray-700">
                Instructor
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="evals in selectSubjects"
              :key="evals.id"
              class="hover:bg-gray-100"
            > 
              <td class="px-2 py-2 border text-sm text-gray-600">
                {{ evals.code }}
              </td>
              <td class="px-2 py-2 border text-sm text-gray-600">
                {{ evals.section }}
              </td>
              <td class="px-2 py-2 border text-sm text-gray-600">
                {{ evals.description }}
              </td>
              <td class="px-2 py-2 border text-sm text-gray-600">
                {{ evals.time }}
              </td>
              <td class="px-2 py-2 border text-sm text-gray-600">
                {{ evals.days }}
              </td>
              <td class="px-2 py-2 border text-sm text-gray-600">
                {{ evals.room }}
              </td>
              <td class="px-2 py-2 border text-sm text-gray-600">
                {{ evals.bldg }}
              </td>
              <td class="px-2 py-2 border text-sm text-gray-600">
                {{ evals.lecture }}
              </td>
              <td class="px-2 py-2 border text-sm text-gray-600">
                {{ evals.laboratory }}
              </td>
              <td class="px-2 py-2 border text-sm text-gray-600">
                {{ evals.units }}
              </td>
              <td class="px-2 py-2 border text-sm text-gray-600">
                {{ evals.instructor }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-between">
          <p
            v-if="activeTab === 'evaluation'"
            class="text-left mt-4 text-sm font-semibold text-gray-700"
          >
            <small class="font-semibold italic"
              >note: Schedules may change depending on the no. of students &
              faculty loading. please be guided accordingly</small
            >
          </p>
          <p class="text-right mt-4 text-sm font-semibold text-gray-700">
            Total Units:
            {{ selectSubjects.length > 0 ? selectSubjects.reduce((acc, cur) => acc + cur.units, 0) : 0 }}
          </p>
        </div>

        <div class="flex flex-row gap-1  justify-start">
          <p class="text-left mt-12 text-sm text-gray-700">Certified By:</p>
          <div class="flex flex-col mt-[70px] item-center justify-center">
            <div class="w-[170px] border-b-2 h-1 bg-gray-400"></div>
            <p class="text-xs self-center text-gray-500">Program Chair</p>
          </div>
        </div>
        <p class="text-left mt-12 text-sm text-gray-700">
          <!-- Evaluated By:
          <span class="uppercase underline"
            >{{ selectSubjects[0]?.evaluator.lname }},
            {{ selectSubjects[0]?.evaluator.fname }}</span
          > -->
        </p>
        <small class="text-left mt-4 text-xs text-gray-700"
          >Date: {{ new Date(Date.now()).getFullYear() }}/{{
            new Date(Date.now()).getMonth()
          }}/{{ new Date(Date.now()).getDate() }}</small
        >
      </div>
      <!-- footer -->
      <div
        class="flex items-center justify-between mb-4 border-t-2 border-blue-500 mt-10"
      >
        <div
          class="flex self-center flex-col items-left justify-left w-[300px]"
        >
          <!-- <h2 class="text-lg font-semibold text-gray-700">NORTH EASTERN MINDANAO STATE UNIVERSITY</h2> -->
          <div class="flex-row flex gap-2 items-center">
            <svg
              width="10"
              height="10"
              version="1.0"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 64 64"
              enable-background="new 0 0 64 64"
              xml:space="preserve"
              fill="#e25555"
              stroke="#e25555"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fill="#c17689"
                  d="M32,0C18.746,0,8,10.746,8,24c0,5.219,1.711,10.008,4.555,13.93c0.051,0.094,0.059,0.199,0.117,0.289l16,24 C29.414,63.332,30.664,64,32,64s2.586-0.668,3.328-1.781l16-24c0.059-0.09,0.066-0.195,0.117-0.289C54.289,34.008,56,29.219,56,24 C56,10.746,45.254,0,32,0z M32,32c-4.418,0-8-3.582-8-8s3.582-8,8-8s8,3.582,8,8S36.418,32,32,32z"
                ></path>
              </g>
            </svg>
            <p class="text-sm font-medium text-gray-500 w-[200px]">
              Cantilan, Surigao del Sur 8317
            </p>
          </div>
          <div class="flex-row flex gap-2 items-center">
            <svg
              width="10"
              height="10"
              viewBox="0 0 15 15"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              fill="#000000"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <title>call [#192]</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g
                  id="Page-1"
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  <g
                    id="Dribbble-Light-Preview"
                    transform="translate(-103.000000, -7321.000000)"
                    fill="#9b7878"
                  >
                    <g
                      id="icons"
                      transform="translate(56.000000, 160.000000)"
                    >
                      <path
                        d="M61.7302966,7173.99596 C61.2672966,7175.40296 59.4532966,7176.10496 58.1572966,7175.98796 C56.3872966,7175.82796 54.4612966,7174.88896 52.9992966,7173.85496 C50.8502966,7172.33496 48.8372966,7169.98396 47.6642966,7167.48896 C46.8352966,7165.72596 46.6492966,7163.55796 47.8822966,7161.95096 C48.3382966,7161.35696 48.8312966,7161.03996 49.5722966,7161.00296 C50.6002966,7160.95296 50.7442966,7161.54096 51.0972966,7162.45696 C51.3602966,7163.14196 51.7112966,7163.84096 51.9072966,7164.55096 C52.2742966,7165.87596 50.9912966,7165.93096 50.8292966,7167.01396 C50.7282966,7167.69696 51.5562966,7168.61296 51.9302966,7169.09996 C52.6632966,7170.05396 53.5442966,7170.87696 54.5382966,7171.50296 C55.1072966,7171.86196 56.0262966,7172.50896 56.6782966,7172.15196 C57.6822966,7171.60196 57.5872966,7169.90896 58.9912966,7170.48196 C59.7182966,7170.77796 60.4222966,7171.20496 61.1162966,7171.57896 C62.1892966,7172.15596 62.1392966,7172.75396 61.7302966,7173.99596 C61.4242966,7174.92396 62.0362966,7173.06796 61.7302966,7173.99596"
                        id="call-[#192]"
                      ></path>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
            <p class="text-sm font-medium text-gray-500">086-212-2723</p>
          </div>
          <div class="flex-row flex gap-2 items-center">
            <svg
              width="10"
              height="10"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              stroke-width="3"
              stroke="#766060"
              fill="none"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M39.93,55.72A24.86,24.86,0,1,1,56.86,32.15a37.24,37.24,0,0,1-.73,6"
                ></path>
                <path d="M37.86,51.1A47,47,0,0,1,32,56.7"></path>
                <path
                  d="M32,7A34.14,34.14,0,0,1,43.57,30a34.07,34.07,0,0,1,.09,4.85"
                ></path>
                <path
                  d="M32,7A34.09,34.09,0,0,0,20.31,32.46c0,16.2,7.28,21,11.66,24.24"
                ></path>
                <line x1="10.37" y1="19.9" x2="53.75" y2="19.9"></line>
                <line x1="32" y1="6.99" x2="32" y2="56.7"></line>
                <line x1="11.05" y1="45.48" x2="37.04" y2="45.48"></line>
                <line x1="7.14" y1="32.46" x2="56.86" y2="31.85"></line>
                <path
                  d="M53.57,57,58,52.56l-8-8,4.55-2.91a.38.38,0,0,0-.12-.7L39.14,37.37a.39.39,0,0,0-.46.46L42,53.41a.39.39,0,0,0,.71.13L45.57,49Z"
                ></path>
              </g>
            </svg>
            <p class="text-xs text-gray-500">www.nemsu.du.ph</p>
          </div>
        </div>
        <div class="flex w-full items-center justify-end gap-4">
          <img
            src="@/assets/Picture3.png"
            alt="School Logo"
            class="h-[50px] w-30"
          />
          <img
            src="@/assets/Picture2.png"
            alt="School Logo"
            class="h-[50px] w-30"
          />
          <img
            src="@/assets/Picture1.png"
            alt="School Logo"
            class="h-[50px] w-30"
          />
        </div>
        <!-- <div class="text-right">
        <p class="text-xs text-gray-500">Printed on: {{ new Date().toLocaleDateString() }}</p>
      </div> -->
      </div>
    </div>
    <!-- Display Evaluation Results -->
    <div v-if="selectedStudent" class="w-full h-[100%]">
      <div class="flex w-full h-[100%]">
        <!-- List of Subjects with Status -->
        <div class="subject-list w-[50%] pr-5 border-r-2 h-[90%]">
          <h2>Student Information</h2>
          <div class="border-t border-b py-1 mb-4 flex">
            <div class="flex justify-between w-full">
              <table class="text-[12px] w-full no-border">
                <thead>
                  <tr>
                    <th class="text-nowrap">ID No</th>
                    <th class="text-nowrap">Last Name</th>
                    <th class="text-nowrap">First Name</th>
                    <th class="text-nowrap">M.I.</th>
                    <th class="text-nowrap">Sex</th>
                    <th class="text-nowrap">Course</th>
                    <th class="text-nowrap">Year Level</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="uppercase">
                    <td>{{ selectedStudent.student_id }}</td>
                    <td>{{ selectedStudent.lname }}</td>
                    <td>{{ selectedStudent.fname }}</td>
                    <td>{{ selectedStudent.mname }}</td>
                    <td>{{ selectedStudent.gender }}</td>
                    <td>{{ selectedStudent.course }}</td>
                    <td>{{ selectedStudent.year }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <h2>Student Grades</h2>
          <div class="table-container pb-10 border-t border-b">
            <table class="text-[12px] mt-2 overflow-hidden">
              <thead>
                <tr class="text-nowrap">
                  <th>Subject Code</th>
                  <th>Description</th>
                  <th>SY</th>
                  <th>Sem</th>
                  <th>Remarks</th>
                  <th>Instructor</th>
                </tr>
              </thead>
              <tbody class="overflow-scroll">
                <tr v-for="subject in grades" :key="subject.code">
                  <td class="text-nowrap">{{ subject.subject_no }}</td>
                  <td class="text-nowrap">{{ subject.description }}</td>
                  <td class="text-nowrap">{{ subject.sy }}</td>
                  <td class="text-nowrap">{{ subject.semester }}</td>
                  <td :class="{'status-passed': subject.remarks === 'Passed', 'status-failed': subject.remarks === 'Failed'}">{{ subject.remarks }}</td>
                  <td class="text-nowrap">{{ subject.instructor }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Create Evaluation Result -->
        <div class="subject-list w-full ml-2">
          <h3>Please select the subjects</h3>
          <div class="h-[80%] border-t border-b">
            <div class="overflow-auto h-[40%]">
              <table class="text-[12px]">
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Subject Code</th>
                    <th>Description</th>
                    <th>Year Level</th>
                    <th>SY</th>
                    <th>Sem</th>
                    <th>Laboratory</th>
                    <th>Lecture</th>
                    <th>Units</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="subject in prospectos" :key="subject.code" :class="{'bg-yellow-200': subject.passed, 'bg-blue-600': subject.selected, 'text-white': subject.selected && subject.status == 1, 'bg-red-600': subject.status == 0}">
                    <td class="items-center justify-center">
                      <input 
                        class="cursor-pointer"
                        v-if="subject?.passed != true && subject?.status == 1"
                        type="checkbox" 
                        v-model="subject.selected" 
                        @change="selectSubject(subject)" 
                      />
                    </td>
                    <td>{{ subject.code }}</td>
                    <td>{{ subject.description }}</td>
                    <td>{{ subject.year }}</td>
                    <td>{{ subject.sy }}</td>
                    <td>{{ subject.sem }}</td>
                    <td>{{ subject.laboratory }}</td>
                    <td>{{ subject.lecture }}</td>
                    <td>{{ subject.units }}</td>
                    <td :class="{'status-active': subject.status === 1, 'status-inactive': subject.status === 0}">
                      {{ subject.status == 1 ? 'Active' : 'Not Active' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="flex w-full justify-between mt-5">
              <h2 class="">Selected Subjects</h2>
            </div>
            <div class="h-[55%] overflow-auto mt-2">
              <table class="text-[12px]">
                <thead>
                  <tr>
                    <th>Subject Code</th>
                    <th>Description</th>
                    <th>Laboratory</th>
                    <th>Lecture</th>
                    <th>Units</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="subject in selectSubjects" :key="subject.code" :class="{'bg-yellow-200': subject.passed}">
                    <td>{{ subject.code }}</td>
                    <td>{{ subject.description }}</td>
                    <td>{{ subject.laboratory }}</td>
                    <td>{{ subject.lecture }}</td>
                    <td>{{ subject.units }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="flex justify-between m-[15px]">
              <div class="">
                <button class="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition" @click="confirmSubmit">Submit Evaluation</button>
                <button class="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition" @click="closeEvaluation">Close</button>
              </div>
              <h2 class="mt-[-20px]">Total Units: {{ selectSubjects.length > 0 ? selectSubjects.reduce((acc, cur) => acc + cur.units, 0) : 0 }}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Confirm Submission</h2>
        <p>Are you sure you want to submit the evaluation?</p>
        <div class="mb-4">
          <label for="sy" class="block text-sm font-medium text-gray-700">School Year:</label>
          <select v-model="selected_school_year" id="sy" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
            <option v-for="schoolYear in eval_school_year" :key="schoolYear.id" :value="schoolYear.attributes.year">{{ schoolYear.attributes.year }}</option>
          </select>
        </div>

        <div class="mb-4">
           
          <label for="semester" class="block text-sm font-medium text-gray-700">Semester:</label>
          <select v-model="eval_sem" id="sem" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
            <option value="1">1st Semester</option>
            <option value="2">2nd Semester</option>
          </select>
        </div>
        <div class="modal-actions">
          <Button
          @click="saveAsPDF"
          class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-150"
          >
            Print
          </Button>
          <Button
          @click="submitEvaluation"
          class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-150"
          >
            Save
          </Button>
          <Button
          @click="modal(false)"
          class="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-150"
          >
            Cancel
          </Button> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
export default {
  data() {
    return {
      print: false,
      searchQuery: '',
      prospectos: [],
      grades: [],
      selectedStudent: null,
      selectSubjects: [],
      eval_school_year: null,
      selectedStatus: null,
      eval_sem: null,
      selected_school_year: null,
      showModal: false // Control the visibility of the modal
    };
  },
  mounted() {
    this.fetchSchoolYears()
  },
  methods: {
    async saveAsPDF() {
      this.print = false
      const printSection = this.$refs.printSection;
      console.log(printSection)
      const canvas = await html2canvas(printSection, {
        scale: 5, // Increases the quality of the image
      });
      const imgData = canvas.toDataURL("image/png");

      // Create a new jsPDF instance with landscape orientation
      const pdf = new jsPDF("portrait", "pt", "a4"); // Use 'pt' for points and 'a4' for paper size

      // Get the dimensions of the PDF
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate the aspect ratio
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const aspectRatio = imgHeight / imgWidth;

      // Set image dimensions for PDF
      const imgPdfWidth = pdfWidth;
      const imgPdfHeight = imgPdfWidth * aspectRatio;
      console.log(pdfHeight);
      // Add the image to the PDF
      pdf.addImage(imgData, "PNG", 0, 0, imgPdfWidth, imgPdfHeight);
      pdf.save(
        `evaluation-${this.selected_school_year}-${this.eval_sem}.pdf`
      ); // Save the PDF with a name
      // this.submitEvaluation()
    },
    async fetchSchoolYears() {
      try {

        const token = sessionStorage.getItem('jwt');
        const response = await axios.get('https://api.nemsu-grading.online/api/school-years', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.eval_school_year = response.data.data;
      } catch (error) {
        toast.error(error.response.data.error.message);
        console.error('Error fetching school years:', error);
      }
    },
    async searchStudent() {
      if (this.searchQuery) {
        const evaluateData = await axios.get(`https://api.nemsu-grading.online/api/evaluation/${this.searchQuery}`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem("jwt")}`
          }
        });
        const { prospectos, student_info, grades } = evaluateData.data;
        if (student_info.length == 0 ) {
          toast.info("ID No not found");
          return
        }
        this.selectedStudent = student_info[0];
        this.prospectos = prospectos.map(subject => ({ ...subject, selected: false }));
        this.grades = grades;
        toast.success("Successfully retrived student details");
      }
    },
    selectSubject(subject) {
      if (subject.selected) {
        if (!this.selectSubjects.includes(subject)) {
          this.selectSubjects.push(subject);
        }
      } else {
        const index = this.selectSubjects.indexOf(subject);
        if (index !== -1) {
          this.selectSubjects.splice(index, 1);
        }
      }
      console.log('Selected subjects:', this.selectSubjects);
    },
    modal(status) { 
      this.print = status
      this.showModal = false
    },
    closeEvaluation() {
      this.selectedStudent = null;
      this.prospectos = [];
      this.grades = [];
      this.searchQuery = '';
      this.selectSubjects = [];
      this.eval_school_year = null;
      this.eval_sem= null;
    },
    confirmSubmit() {
    if (this.selectSubjects.length == 0) return toast.info("Please select subject");
      this.showModal = true; // Show the confirmation modal
      this.fetchSchoolYears()
    },
    async submitEvaluation() {
      console.log(this.selectSubjects);

      if (this.selected_school_year == null) return toast.error("Please select school year") 

      if (this.eval_sem == null) return toast.error("Please select semester") 
      
      try {
        const evalSubmit = []
        for (const subject of this.selectSubjects) {
          const evaluationData = {
            school_year: this.selected_school_year,
            sem: String(this.eval_sem),
            student_id: String(this.selectedStudent.student_id),
            subject_code: subject.code,
            description: subject.description,
            laboratory: String(subject.laboratory),
            lecture: String(subject.lecture),
            time: '',
            day: '',
            instructor: '',
            units: String(subject.units),
            evaluator: String(JSON.parse(sessionStorage.getItem('profile')).id)
          };

          evalSubmit.push(evaluationData) 
        }

        if (evalSubmit.length > 0) {
          console.log(evalSubmit);
          await axios.post(`https://api.nemsu-grading.online/api/create-evaluation/`, { data: evalSubmit }, {
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem("jwt")}`
            }
          });

          toast.success("Evaluation Submitted");
          
          this.closeEvaluation(); // Clear the form after submission
        } else {
          // alert("Please select subject")
          toast.info("Please select subject");
        }
        this.showModal = false; // Hide the modal after submission
        // this.showModal = false; // Hide the modal after submission
        // this.closeEvaluation(); // Clear the form after submission
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.no-border {
  border: none; /* Remove table border */
}
.subject-list { 
  overflow: hidden; /* Hide any overflow from the main container */
}

.table-container {
  height: 70%; /* Ensure it fills the container */
  overflow-y: auto; /* Enable vertical scrolling */
  padding: 10;
}

table {
  width: 100%;
  border-collapse: collapse; /* Collapse borders */
}

th, td {
  padding: 8px; /* Padding for better readability */
  text-align: left; /* Align text to the left */
}

th {
  background-color: #f2f2f2; /* Light background for headers */
}

.status-passed {
  color: green; /* Style for passed status */
}

.status-failed {
  color: red; /* Style for failed status */
}

.no-border th,
.no-border td {
  border: none; /* Remove cell borders */
  padding: 8px; /* Adjust padding if needed */
  text-align: left; /* Align text to the left */
}
.manage-evaluation {
  padding: 20px; 
  margin: auto;
  height: 100%;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.page-title {
  text-align: center;
  margin-bottom: 20px;
}

.search-student {
  display: flex;
  width: 100px; 
}

.search-student input {
  padding: 10px;
  flex: 1;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-student button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-student button:hover {
  background-color: #0056b3;
}

.student-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.print-section {
  padding: 20px;
  border: 1px solid #ccc; 
  z-index: -1;
  position: absolute;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table, th, td {
  border: 1px solid #ddd;
}

th, td {
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.subject-list, .evaluation-form {
  margin-top: 20px;
}

.evaluation-form p {
  margin: 10px 0;
}

.evaluation-form button {
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.evaluation-form button:hover {
  background-color: #218838;
}

.status-passed {
  color: green;
}

.status-failed {
  color: red;
}

.status-active {
  color: green;
}

.status-inactive {
  color: orange;
}

.bg-yellow-200 {
  background-color: #ffeeba; /* Light yellow for passed subjects */
}
</style>
