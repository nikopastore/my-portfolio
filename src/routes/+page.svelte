<!-- src/routes/+page.svelte -->
<script>
  import Nav from '$lib/components/Nav.svelte'; // Navigation Component
  import MetaAnalysis from '$lib/components/MetaAnalysis.svelte'; // Meta-Analysis Component
  import projects from '$lib/projects.json'; // Projects Data

  // Contact Form State
  let email = '';
  let subject = '';
  let body = '';

  // Handle Contact Form Submission
  function handleSubmit(event) {
    event.preventDefault();
    const mailtoLink = `mailto:npastore@ucsd.edu?` + new URLSearchParams({
      subject: subject || 'No Subject',
      body: `From: ${email}\n\n${body}`,
    });
    console.log('mailto URL:', mailtoLink);
    window.location.href = mailtoLink;
  }

  // GitHub Profile Data
  let profileData = null;
  let errorMessage = null;

  // Fetch GitHub profile data
  async function fetchProfileData() {
    try {
      const response = await fetch('https://api.github.com/users/nikopastore');
      if (!response.ok) throw new Error('Network response was not ok');
      profileData = await response.json();
    } catch (error) {
      errorMessage = `Error: ${error.message}`;
    }
  }

  fetchProfileData(); // Call on component load
</script>

<!-- Navigation -->
<Nav />

<main class="mt-20"> <!-- Adjust margin-top to prevent overlap with fixed nav -->

  <!-- Home Section -->
  <section id="home" class="mb-16">
    <h1 class="text-4xl font-bold mb-4 text-gray-100 text-center">Nikolai Pastore</h1>
    <img
      src="/images/WLDI3061.JPG"
      alt="Photo of Nikolai Pastore"
      loading="lazy"
      class="rounded-full mb-6 w-32 md:w-48 lg:w-64 h-32 md:h-48 lg:h-64 object-cover mx-auto"
    />
    <p class="text-lg text-white text-center max-w-2xl mx-auto">
      Welcome to my personal website and portfolio. I am excited to be in this course and can't wait to learn new tools and skills that will help me in my career.
    </p>
  </section>

  <!-- GitHub Profile Section -->
  <section class="profile-section mb-16">
    <h2 class="text-3xl font-semibold mb-6 text-center">GitHub Profile</h2>
    {#if errorMessage}
      <p class="text-red-500 text-center">{errorMessage}</p>
    {:else if profileData}
      <dl class="grid grid-cols-2 gap-4 text-center max-w-md mx-auto">
        <div><dt class="font-bold">Followers:</dt><dd>{profileData.followers}</dd></div>
        <div><dt class="font-bold">Following:</dt><dd>{profileData.following}</dd></div>
        <div><dt class="font-bold">Public Repositories:</dt><dd>{profileData.public_repos}</dd></div>
        <div><dt class="font-bold">Public Gists:</dt><dd>{profileData.public_gists}</dd></div>
      </dl>
    {:else}
      <p class="text-center">Loading profile data...</p>
    {/if}
  </section>

  <!-- Projects Section -->
  <section id="projects" class="mb-16">
    <h2 class="text-3xl font-semibold mb-6 text-center">Projects</h2>
    <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {#each projects as project}
        <article class="border rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-300">
          <h3 class="text-xl font-semibold mb-2">{project.title}</h3>
          <img src="{project.image}" alt="{project.title} Image" class="mb-4 w-full h-48 object-cover rounded" loading="lazy" />
          <p class="text-md text-gray-700">{project.description}</p>
          <p class="project-year">{project.year}</p>
          <a href="{project.link}" target="_blank" rel="noopener noreferrer" class="text-indigo-500 hover:underline mt-2 block">
            View Project
          </a>
        </article>
      {/each}
    </div>
  </section>

  <!-- Meta-Analysis Section -->
  <section id="meta" class="mb-16">
    <MetaAnalysis />
  </section>

  <!-- Resume Section -->
  <section id="cv" class="mb-16">
    <h2 class="text-3xl font-semibold mb-6">Resume</h2>
    <section>
      <h2 class="text-2xl font-semibold mb-2">Personal Information</h2>
      <p>
        Nikolai Pastore<br />
        Email: <a href="mailto:npastore@ucsd.edu" class="text-indigo-500 hover:underline">npastore@ucsd.edu</a><br />
      </p>
    </section>
    <section>
      <h2 class="text-2xl font-semibold mb-2">Education</h2>
      <article class="mb-4">
        <h3 class="text-xl font-semibold">Bachelor of Psychology in Business Psychology</h3>
        <p>University of California, San Diego</p>
        <p><time datetime="2020-09">September 2020</time> to <time datetime="2022-06">June 2022</time></p>
      </article>
      <article>
        <h3 class="text-xl font-semibold">Master of Science in Applied Data Science</h3>
        <p>University of California, San Diego</p>
        <p><time datetime="2023-09">September 2023</time> to <time datetime="2025-06">June 2025</time></p>
      </article>
    </section>
    <section>
      <h2 class="text-2xl font-semibold mb-2">Work Experience</h2>
      <article class="mb-4">
        <h3 class="text-xl font-semibold">Data Engineering Internship at Routeware, Inc.</h3>
        <p>Built company-wide data dictionary and completed customer ad-hoc tasks</p>
        <p><time datetime="2023-05">May 2023</time> to <time datetime="2023-08">August 2023</time></p>
      </article>
      <article>
        <h3 class="text-xl font-semibold">Data Engineer at Routeware, Inc.</h3>
        <p>Currently working on scalable data solutions.</p>
        <p><time datetime="2023-08">August 2023</time> to Present</p>
      </article>
    </section>
  </section>

  <!-- Contact Section -->
  <section id="contact" class="mb-16">
    <h2 class="text-3xl font-semibold mb-6">Contact</h2>
    <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4 max-w-md mx-auto">
      <label class="flex flex-col">
        <span class="text-gray-700">Your Email:</span>
        <input type="email" name="email" bind:value={email} required class="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" />
      </label>
      <label class="flex flex-col">
        <span class="text-gray-700">Subject:</span>
        <input type="text" name="subject" bind:value={subject} class="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" />
      </label>
      <label class="flex flex-col">
        <span class="text-gray-700">Message:</span>
        <textarea name="body" bind:value={body} required class="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200" rows="5"></textarea>
      </label>
      <button type="submit" class="w-full bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors duration-200">Send Message</button>
    </form>
  </section>
</main>

<style>
  /* Existing styles */

  /* Adjust margin-top for main to prevent overlap with fixed nav */
  main {
    margin-top: 4rem; /* Adjust based on your nav height */
  }

  /* Styles for Project Year */
  .project-year {
    font-size: 0.9em;
    color: #6b7280; /* Tailwind's gray-500 */
    font-family: 'Baskerville', serif;
    font-variant-numeric: oldstyle-nums;
    margin-top: 0.5em;
  }

  /* Hover Effect for Project Year */
  article:hover .project-year {
    color: #4f46e5; /* Tailwind's indigo-600 */
    transition: color 0.3s ease;
  }
</style>
