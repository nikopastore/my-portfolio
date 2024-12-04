<script>
  export let title = '';
  export let description = '';
  export let year = '';
  export let image = '';
</script>

<div class="project-container">
  <h3 class="project-title">{title}</h3>
  <img src="{image}" alt="{title}" class="project-image" />
  <div class="project-details">
    <p class="project-description">{description}</p>
    <p class="project-year">{year}</p>
  </div>
</div>

<style>
  .project-container {
    padding: 1em;
    border: 1px solid #e5e7eb;
    border-radius: 0.5em;
    background-color: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5em;
    font-family: 'Baskerville', serif;
    transition: box-shadow 0.3s, transform 0.2s ease;
  }

  .project-container:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px); /* Subtle hover lift */
  }

  .project-title {
    font-size: 1.25em;
    font-weight: bold;
    margin-bottom: 0.5em;
  }

  .project-description {
    font-size: 1em;
    color: #4b5563; /* Tailwind's gray-600 */
    margin-bottom: 0.5em;
  }

  .project-year {
    font-size: 0.9em; /* Slightly smaller font size */
    color: #6b7280; /* Tailwind's gray-500 */
    font-family: 'Baskerville', serif; /* Elegant serif font */
    font-variant-numeric: oldstyle-nums; /* Old-style numerals for aesthetic */
    margin-top: 0.5em;
    transition: color 0.3s ease;
  }

  .project-image {
    width: 100%;
    height: 12rem;
    object-fit: cover; /* Ensure proper image fit */
    border-radius: 0.375em;
    margin-bottom: 0.5em;
  }

  /* Hover Effect for Project Year */
  .project-container:hover .project-year {
    color: #4f46e5; /* Tailwind's indigo-600 */
  }

  /* Flex Layout for Description and Year */
  .project-details {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
</style>
