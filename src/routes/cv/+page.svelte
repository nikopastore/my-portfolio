<!-- src/routes/cv/+page.svelte -->
<script>
    // No additional JavaScript needed for this page
  </script>
  
  <!-- Resume Page Container -->
  <section class="max-w-4xl mx-auto px-4 py-8">
    <!-- Page Title -->
    <h1 class="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center">Resume</h1>
  
    <!-- Personal Information Section -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Personal Information</h2>
      <p class="text-lg text-gray-700 dark:text-gray-300">
        <strong>Name:</strong> Nikolai Pastore<br />
        <strong>Email:</strong> <a href="mailto:npastore@ucsd.edu" class="text-indigo-500 hover:underline">npastore@ucsd.edu</a>
      </p>
    </section>
  
    <!-- Education Section -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Education</h2>
      <article class="mb-6">
        <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300">Bachelor of Psychology in Business Psychology</h3>
        <p class="text-md text-gray-600 dark:text-gray-400">University of California, San Diego</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          <time datetime="2020-09">September 2020</time> – <time datetime="2022-06">June 2022</time>
        </p>
      </article>
      <article>
        <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300">Master of Science in Applied Data Science</h3>
        <p class="text-md text-gray-600 dark:text-gray-400">University of California, San Diego</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          <time datetime="2023-09">September 2023</time> – <time datetime="2025-06">June 2025</time>
        </p>
      </article>
    </section>
  
    <!-- Work Experience Section -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Work Experience</h2>
      <article class="mb-6">
        <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300">Data Engineering Internship at Routeware, Inc.</h3>
        <p class="text-md text-gray-600 dark:text-gray-400">Built company-wide data dictionary and completed customer ad-hoc tasks.</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          <time datetime="2023-05">May 2023</time> – <time datetime="2023-08">August 2023</time>
        </p>
      </article>
      <article>
        <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300">Data Engineer at Routeware, Inc.</h3>
        <p class="text-md text-gray-600 dark:text-gray-400">Currently working on scalable data solutions.</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          <time datetime="2023-08">August 2023</time> – Present
        </p>
      </article>
    </section>
  </section>
  