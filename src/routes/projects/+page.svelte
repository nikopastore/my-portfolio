<!-- src/routes/projects/+page.svelte -->
<script>
  // Define the projects array with the 'year' property included for each project
  const projects = [
    {
      title: 'Portfolio Website',
      year: '2024',
      description: 'A comprehensive portfolio website showcasing my projects, skills, and experiences.',
      image: '/images/project1.svg', // Ensure this path is correct or use an absolute URL
      link: 'https://github.com/nikopastore/project-one',
    },
    {
      title: 'Project Two',
      year: '2023',
      description: 'An innovative project focusing on data visualization and interactive user interfaces.',
      image: '/images/project2.svg',
      link: 'https://github.com/nikopastore/project-two',
    },
    {
      title: 'Project Three',
      year: '2022',
      description: 'A collaborative project aimed at developing scalable backend solutions.',
      image: '/images/project3.svg',
      link: 'https://github.com/nikopastore/project-three',
    },
    // Add more projects as needed, ensuring each has a 'year' property
  ];
</script>

<!-- Projects Section -->
<section class="max-w-6xl mx-auto px-4 py-8">
<h1 class="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100 text-center">Projects</h1>

<div class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {#each projects as project}
    <article class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <!-- Project Image -->
      <img src="{project.image}" alt="{project.title}" class="w-full h-48 object-cover rounded-t-lg" />
      
      <!-- Project Details -->
      <div class="p-4">
        <!-- Project Title -->
        <h2 class="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{project.title}</h2>
        
        <!-- Description and Year Wrapper -->
        <div class="project-details">
          <!-- Project Description -->
          <p class="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
          
          <!-- Project Year -->
          <p class="project-year">{project.year}</p>
        </div>
        
        <!-- View Project Link -->
        <a href="{project.link}" target="_blank" rel="noopener noreferrer" class="text-indigo-500 hover:underline">
          View Project
        </a>
      </div>
    </article>
  {/each}
</div>
</section>

<!-- Optional: Add other sections like Resume, Contact, etc., below -->

<style>
/* Existing styles */

.profile-section {
  padding: 2rem 1rem;
}
dl {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Styles for Project Details */
.project-details {
  /* You can add additional styling here if needed */
}

/* Styles for the Project Year */
.project-year {
  font-size: 0.9em;
  color: #6b7280; /* Tailwind's gray-500 */
  font-family: 'Baskerville', serif;
  font-variant-numeric: oldstyle-nums;
  margin-top: 0.5em;
}
</style>
