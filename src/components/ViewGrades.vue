<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100"
  >
    <!-- Login Form -->
    <div
      v-if="!grades"
      class="w-full max-w-md p-8 bg-white rounded-lg shadow-lg"
    >
      <h2 class="text-2xl font-semibold text-gray-700 text-center mb-6">
        Login
      </h2>
      <form @submit.prevent="UserLogin" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700"
            >Student ID No.</label
          >
          <input
            v-model="username"
            id="username"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <input
            v-model="password"
            id="password"
            type="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div class="text-red-600 text-sm" v-if="errorMessage">
          {{ errorMessage }}
        </div>
        <div class="flex items-center justify-center">
          <button
            type="submit"
            class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Logging in..." : "Login" }}
          </button>
        </div>
      </form>
    </div>

    <!-- Report of Grades (shown after successful login) -->
    <div v-else class="w-full max-w-5xl p-8 bg-white rounded-lg shadow-lg">
      <div class="mb-4">
        <ul class="flex border-b">
          <li
            @click="activeTab = 'grades'"
            :class="{ 'border-b-2 border-blue-500': activeTab === 'grades' }"
            class="cursor-pointer px-4 py-2"
          >
            Grades
          </li>
          <li
            @click="activeTab = 'evaluation'"
            :class="{
              'border-b-2 border-blue-500': activeTab === 'evaluation',
            }"
            class="cursor-pointer px-4 py-2"
          >
            Evaluation
          </li>
        </ul>
      </div>
      <div class="flex-row flex gap-1 items-center justify-start mb-5">
        <label for="year" class="w-[150px]">Select School Year:</label>
        <select
          v-model="selectedSchoolYear"
          id="year"
          required
          class="mt-1 block py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
        >
          <option
            v-for="schoolYear in school_year"
            :key="schoolYear.id"
            :value="schoolYear.year + '|' + schoolYear.sem"
          >
            {{ schoolYear.year + " - Sem: " + schoolYear.sem }}
          </option>
        </select>
      </div>

      <!-- Header Section -->
      <div ref="printSection" class="print-section">
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
            {{ activeTab == "evaluation" ? "Certification Of Registration": "Reports Of Grades" }}
            </h3>
            <p class="text-xs text-gray-500">
              SY: {{ selectedSchoolYear.split("|")[0] }} Term:
              {{ selectedSchoolYear.split("|")[1] }}
            </p>
          </div>
            <div class="grid grid-cols-2 gap-4 mt-[30px]">
              
              <div>
              <p class="text-sm font-medium text-gray-700">
                <span class="font-semibold">IDNO:</span>
                {{ student_info.attributes.student_id }}
              </p>
              <p class="text-sm font-medium text-gray-700">
                <span class="font-semibold">Lastname:</span>
                {{ student_info.attributes.lname }}
              </p>
              <p class="text-sm font-medium text-gray-700">
                <span class="font-semibold">Firstname:</span>
                {{ student_info.attributes.fname }}
              </p>
              <p class="text-sm font-medium text-gray-700">
                <span class="font-semibold">Middle Name:</span>
                {{ student_info.attributes.mname }}
              </p>
              <p class="text-sm font-medium text-gray-700">
                <span class="font-semibold">Sex:</span>
                {{ student_info.attributes.gender }}
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-700">
                <span class="font-semibold">Course:</span>
                {{ student_info.attributes.course }}
              </p>
              <p class="text-sm font-medium text-gray-700">
                <span class="font-semibold">Year Level:</span>
                {{ student_info.attributes.year }}
              </p>
              <p class="text-sm font-medium text-gray-700">
                <span class="font-semibold">Status:</span>
                {{ student_info.attributes.status }}
              </p>
              <p
                v-if="activeTab === 'grades'"
                class="text-sm font-medium text-gray-700"
              >
                <span class="font-semibold">GPA:</span> {{ getGPA() }}
              </p>
            </div>
          </div>
        </div>

        <!-- Grades Table -->
        <div v-if="activeTab === 'grades'" class="mt-4">
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
                  Grade
                </th>
                <th class="px-2 py-2 border font-medium text-sm text-gray-700">
                  GComp
                </th>
                <th class="px-2 py-2 border font-medium text-sm text-gray-700">
                  Units
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="grade in filteredGrades"
                :key="grade.id"
                class="hover:bg-gray-100"
              >
                <td class="px-2 py-2 border text-sm text-gray-600">
                  {{ grade.subject_no }}
                </td>
                <td class="px-2 py-2 border text-sm text-gray-600">
                  {{ grade.section }}
                </td>
                <td class="px-2 py-2 border text-sm text-gray-600">
                  {{ grade.description }}
                </td>
                <td class="px-2 py-2 border text-sm text-gray-600">
                  {{ grade.time }}
                </td>
                <td class="px-2 py-2 border text-sm text-gray-600">
                  {{ grade.days }}
                </td>
                <td class="px-2 py-2 border text-sm text-gray-600">
                  {{ grade.room }}
                </td>
                <td class="px-2 py-2 border text-sm text-gray-600">
                  {{ grade.grade }}
                </td>
                <td class="px-2 py-2 border text-sm text-gray-600">
                  {{ grade.gcomp }}
                </td>
                <td class="px-2 py-2 border text-sm text-gray-600">
                  {{ grade.units }}
                </td>
              </tr>
            </tbody>
          </table>
          <p class="text-right mt-4 text-sm font-semibold text-gray-700">
            Total Units:
            {{ grades.reduce((acc, cur) => acc + Number(cur.units), 0) }}
          </p>
        </div>

        <div v-if="activeTab === 'evaluation'" class="mt-4">
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
                v-for="evals in filterEvaluation"
                :key="evals.id"
                class="hover:bg-gray-100"
              >
                <td class="px-2 py-2 border text-sm text-gray-600">
                  {{ evals.subject_code }}
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
              {{ evaluation.reduce((acc, cur) => acc + Number(cur.units), 0) }}
            </p>
          </div>

          <p class="text-left mt-12 text-sm text-gray-700">
            Certified By:
            <span class="uppercase underline"
              >{{ evaluation[0]?.evaluator.lname }},
              {{ evaluation[0]?.evaluator.fname }}</span
            >
          </p>
          <p class="text-left mt-12 text-sm text-gray-700">
            Evaluated By:
            <span class="uppercase underline"
              >{{ evaluation[0]?.evaluator.lname }},
              {{ evaluation[0]?.evaluator.fname }}</span
            >
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

      <!-- Print Button -->
      <div class="flex justify-center mt-6">
        <Button
          @click="saveAsPDF"
          class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-150"
        >
          Print Report
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Button from "./reuseable/ButtonComponent.vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default {
  name: "ViewGrades",
  components: {
    Button,
  },
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
      isSubmitting: false,
      grades: null,
      student_info: null,
      evaluation: null,
      activeTab: "grades",
      school_year: null,
      selectedSchoolYear: "",
    };
  },
  methods: {
    async UserLogin() {
      this.isSubmitting = true;

      try {
        const response = await axios.get(
          `https://api.nemsu-grading.online/api/students?filters[student_id][$eq]=${this.username}&filters[password][$eq]=${this.password}&filters[activated][$eq]=true`
        );

        const data = response.data.data[0];
        console.log(data);
        this.student_info = data;
        this.grades = data.grades;
        this.evaluation = data.active_evaluation;
        console.log(data);
        this.school_year = data.school_year;
        console.log(this.evaluation);
        this.getGPA();
      } catch (error) {
        this.errorMessage = "Login failed. Please try again.";
        console.log(error);
      } finally {
        this.isSubmitting = false;
      }
    },
    printReport() {
      try {
        const printSection = this.$refs.printSection;
        printSection.print();
      } catch (error) {
        console.log(error);
      }
    },
    async saveAsPDF() {
      const printSection = this.$refs.printSection;
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
        `${this.activeTab}-${this.evaluation[0]?.school_year}-${this.evaluation[0]?.sem}.pdf`
      ); // Save the PDF with a name
    },
    getGPA() {
      const grades = this.grades;
      console.log(grades.length);
      const numberOfSubject = grades.length;
      const totalGrades = grades.reduce(
        (acc, cur) => acc + Number(cur.grade),
        0
      );
      const totalGPA = totalGrades / numberOfSubject;

      return Number(totalGPA).toFixed(2);
    },
  },
  computed: {
    filteredGrades() {
      const filter = this.selectedSchoolYear.split("|")[0];
      const sem = this.selectedSchoolYear.split("|")[1];
      console.log(this.selectedSchoolYear);
      return this.grades.filter(
        (grade) => grade.sy === filter && grade.semester == sem
      );
    },
    filterEvaluation() {
      const filter = this.selectedSchoolYear.split("|")[0];
      const sem = this.selectedSchoolYear.split("|")[1];
      console.log(this.selectedSchoolYear);
      return this.evaluation.filter(
        (evaluate) => evaluate.school_year == filter && evaluate.sem == sem
      );
    },
  },
};
</script>

<style scoped>
.print-section {
  padding: 20px;
  border: 1px solid #ccc;
}
</style>
