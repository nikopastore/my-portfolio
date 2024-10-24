<!-- src/routes/projects/+page.svelte -->
<script>
    // Define an array of projects
    const projects = [
      { title: 'Project 1', image: 'https://vis-society.github.io/labs/2/images/empty.svg', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
      { title: 'Project 2', image: 'https://vis-society.github.io/labs/2/images/empty.svg', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
      // Add more projects as needed
    ];
  </script>
  
  <h1>Projects</h1>
  
  <div class="projects">
    {#each projects as project}
      <article>
        <h2>{project.title}</h2>
        <img src="{project.image}" alt="{project.title}" />
        <p>{project.description}</p>
      </article>
    {/each}
  </div>
  
  <style>
    /* Add styles specific to the Projects page here */
    .projects {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
    article {
      width: calc(33% - 20px);
      box-sizing: border-box;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    @media (max-width: 768px) {
      article {
        width: calc(50% - 20px);
      }
    }
    @media (max-width: 480px) {
      article {
        width: 100%;
      }
    }
  </style>
  