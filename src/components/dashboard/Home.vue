<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <div class="text-center mb-6">
      <img src="@/assets/logo.jpg" alt="NEMSU University Logo" class="h-24 mx-auto" />
    </div>
    <h2 class="text-4xl font-bold text-center mb-6">Welcome to NEMSU University Dashboard</h2>
    <p class="text-lg text-gray-700 text-center mb-8">
      Your academic journey starts here! Stay updated with announcements, view your grades, and access resources all in one place.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="bg-gray-100 p-4 rounded-lg border border-gray-200">
        <h3 class="text-2xl font-semibold mb-3">Key Features</h3>
        <ul class="list-disc list-inside text-gray-700">
          <li>View your academic performance and grades.</li>
          <li>Stay informed with university announcements.</li>
          <li>Access important resources and tools.</li>
          <li>Connect with faculty and peers.</li>
        </ul>
      </div>

      <div class="bg-gray-100 p-4 rounded-lg border border-gray-200">
        <h3 class="text-2xl font-semibold mb-3">Upcoming Events</h3>
        <ul class="list-disc list-inside text-gray-700">
          <li>November 10th: Guest Lecture Series</li>
          <li>November 20th: Sports Day</li>
          <li>December 15th: End-of-Semester Celebration</li>
        </ul>
      </div>
    </div>

    <div class="bg-white p-4 rounded-lg border border-gray-200 mb-6 shadow">
      <h3 class="text-2xl font-semibold mb-3">Important Announcements</h3>
      <ul class="list-decimal list-inside text-gray-700">
        <li>New semester registration starts on October 25th.</li>
        <li>Join us for the upcoming university fair on November 5th.</li>
        <li>Submit your project reports by December 1st.</li>
      </ul>
    </div>

    <footer class="text-center text-gray-500 text-sm">
      <p>&copy; 2024 NEMSU University. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HomeComponent'
}
</script>

<style scoped>
.bg-gray-100 {
  background-color: #f7fafc; /* Light gray background */
}
.bg-white {
  background-color: #ffffff; /* White background */
}
.border {
  border-width: 1px;
}
.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); /* Larger shadow for depth */
}
</style>
