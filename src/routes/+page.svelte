<!-- src/routes/+page.svelte -->
<script>
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

  // Projects Data
  const projects = [
    {
      title: 'Project 1',
      image: 'https://vis-society.github.io/labs/2/images/empty.svg',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      title: 'Project 2',
      image: 'https://vis-society.github.io/labs/2/images/empty.svg',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      title: 'Project 3',
      image: 'https://vis-society.github.io/labs/2/images/empty.svg',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  ];
</script>

<!-- Home Section -->
<section id="home" class="mb-16">
  <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100 text-center">Nikolai Pastore</h1>
  <!-- svelte-ignore a11y_img_redundant_alt -->
  <img
  src="/images/WLDI3061.JPG"
  alt="Photo of Nikolai Pastore"
  class="rounded-full mb-6 w-32 md:w-48 lg:w-64 h-32 md:h-48 lg:h-64 object-cover mx-auto"
/>



  <p class="text-lg text-gray-800 dark:text-gray-200 text-center max-w-2xl mx-auto">
    Welcome to my personal website and portfolio. I am excited to be in this
    course and can't wait to learn new tools and skills that will help me in my
    career.
  </p>
</section>

<!-- Projects Section -->
<section id="projects" class="mb-16">
  <h2 class="text-3xl font-semibold mb-6">Projects</h2>
  <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
    {#each projects as project}
      <article class="border rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-300">
        <h3 class="text-xl font-semibold mb-2">{project.title}</h3>
        <img src="{project.image}" alt="{project.title}" class="mb-4 w-full h-48 object-cover rounded" />
        <p class="text-md text-gray-700">{project.description}</p>
      </article>
    {/each}
  </div>
</section>


<section id="cv" class="mb-16">
  <h2 class="text-3xl font-semibold mb-6">Resume</h2>
  <section>
    <h2>Personal Information</h2>
    <p>
      Nikolai Pastore<br />
      Email: <a href="mailto:npastore@ucsd.edu">npastore@ucsd.edu</a><br />
    </p>
  </section>
  
  <section>
    <h2>Education</h2>
    <article>
      <h3>Bachelor of Psychology in Business Psychology</h3>
      <p>University of California, San Diego</p>
      <p>
        <time datetime="2020-09">September 2020</time> to
        <time datetime="2022-06">June 2022</time>
      </p>
    </article>
    <article>
      <h3>Master of Science in Applied Data Science</h3>
      <p>University of California, San Diego</p>
      <p>
        <time datetime="2023-09">September 2023</time> to
        <time datetime="2025-06">June 2025</time>
      </p>
    </article>
  </section>
  
  <section>
    <h2>Work Experience</h2>
    <article>
      <h3>Data Engineering Internship at Routeware, Inc.</h3>
      <p>Built company-wide data dictionary and completed customer ad-hoc tasks</p>
      <p>
        <time datetime="2023-05">May 2023</time> to
        <time datetime="2023-08">August 2023</time>
      </p>
    </article>
    <article>
      <h3>Data Engineer at Routeware, Inc.</h3>
      <p>Currently working on scalable data solutions.</p>
      <p>
        <time datetime="2023-08">August 2023</time> to Present
      </p>
    </article>
  </section>
</section>

<!-- Contact Section -->
<section id="contact" class="mb-16">
  <h2 class="text-3xl font-semibold mb-6">Contact</h2>
  
  <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4 max-w-md mx-auto">
    <label class="flex flex-col">
      <span class="text-gray-700 dark:text-gray-200">Your Email:</span>
      <input
        type="email"
        name="email"
        bind:value={email}
        required
        class="mt-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-700"
      />
    </label>
    <label class="flex flex-col">
      <span class="text-gray-700 dark:text-gray-200">Subject:</span>
      <input
        type="text"
        name="subject"
        bind:value={subject}
        class="mt-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-700"
      />
    </label>
    <label class="flex flex-col">
      <span class="text-gray-700 dark:text-gray-200">Message:</span>
      <textarea
        name="body"
        bind:value={body}
        required
        class="mt-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-700"
        rows="5"
      ></textarea>
    </label>
    <button
      type="submit"
      class="w-full bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors duration-200"
    >
      Send Message
    </button>
  </form>
</section>

<style>
  /* Add any additional global styles if necessary */
</style>