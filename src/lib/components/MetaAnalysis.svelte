<!-- src/lib/components/MetaAnalysis.svelte -->
<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import PieChart from './PieChart.svelte'; // Ensure correct path
  
    let data = [];
    let commits = [];
    let projectsByYear = [];
    let languageBreakdown = [];
  
    // Additional Statistics
    let averageLinesPerCommit = 0;
    let mostActiveAuthor = 'N/A';
    let peakActivityPeriod = 'N/A';
    let numberOfFiles = 0;
  
    // Filter State
    let selectedYear = null;
    let selectedLanguage = null;
  
    // Derived Data
    let filteredData = [];
  
    onMount(async () => {
      try {
        // Fetch and parse the CSV file
        data = await d3.csv('/loc.csv', (row) => ({
          ...row,
          line: Number(row.line),
          depth: Number(row.depth),
          length: Number(row.length),
          date: new Date(row.date + 'T00:00' + row.timezone),
          datetime: new Date(row.datetime),
          language: row.language || 'Unknown',
        }));
        console.log('Fetched Data:', data);
  
        // Aggregate commits
        commits = d3.groups(data, (d) => d.commit)
  .map(([commit, lines]) => {
    let first = lines[0];
    let { date, timezone, datetime } = first; // Removed 'author'
    let ret = {
      id: commit,
      url: 'https://github.com/yourusername/your-repo/commit/' + commit, // Replace with your repo
      // author: 'Unknown', // Set to 'Unknown' or handle appropriately
      date,
      timezone,
      datetime,
      hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
      totalLines: lines.length,
    };

    // Attach lines without making them enumerable
    Object.defineProperty(ret, 'lines', {
      value: lines,
      configurable: true,
      writable: true,
      enumerable: false,
    });

    return ret;
  });
        console.log('Commits:', commits);
  
        // Aggregate projects by year
        projectsByYear = d3.rollups(
          data,
          v => v.length,
          d => d.year
        ).map(([year, count]) => ({ label: year, value: count }));
        console.log('Projects By Year:', projectsByYear);
  
        // Compute language breakdown
        languageBreakdown = Array.from(d3.rollups(
          data,
          v => v.length,
          d => d.language
        )).map(([language, lines]) => ({ label: language, value: lines }));
        console.log('Language Breakdown:', languageBreakdown);
  
        // Calculate Average Lines per Commit
        averageLinesPerCommit = commits.length > 0 ? (data.length / commits.length).toFixed(2) : 0;
        console.log('Average Lines per Commit:', averageLinesPerCommit);
  
        // Determine Most Active Author
        const authorCounts = d3.rollups(
          commits,
          v => v.length,
          d => d.author
        );
        console.log('Author Counts:', authorCounts);
        const [activeAuthor] = d3.greatest(authorCounts, d => d[1]) || [];
        mostActiveAuthor = activeAuthor || 'N/A';
        console.log('Most Active Author:', mostActiveAuthor);
  
        // Determine Peak Activity Period
        const workByPeriod = d3.rollups(
          commits,
          v => v.length,
          d => {
            const hour = d.datetime.getHours();
            if (hour >= 5 && hour < 12) return 'Morning';
            if (hour >= 12 && hour < 17) return 'Afternoon';
            if (hour >= 17 && hour < 21) return 'Evening';
            return 'Night';
          }
        );
        console.log('Work By Period:', workByPeriod);
        const [mostActivePeriod] = d3.greatest(workByPeriod, d => d[1]) || [];
        peakActivityPeriod = mostActivePeriod || 'N/A';
        console.log('Peak Activity Period:', peakActivityPeriod);
  
        // Calculate Number of Files
        numberOfFiles = d3.groups(data, d => d.file).length;
        console.log('Number of Files:', numberOfFiles);
  
        // Initialize filteredData
        filteredData = data;
  
      } catch (error) {
        console.error('Error loading or processing loc.csv:', error);
      }
    });
  
    // Handle slice clicks
    function handleSliceClick(event) {
      const label = event.detail; // Extract label from event.detail
      console.log('Slice clicked:', label); // Debugging
  
      if (projectsByYear.some(p => p.label === label)) {
        // If the clicked slice is a year
        if (selectedYear === label) {
          selectedYear = null; // Deselect if already selected
        } else {
          selectedYear = label;
          selectedLanguage = null; // Reset language filter
        }
      } else if (languageBreakdown.some(l => l.label === label)) {
        // If the clicked slice is a language
        if (selectedLanguage === label) {
          selectedLanguage = null; // Deselect if already selected
        } else {
          selectedLanguage = label;
          selectedYear = null; // Reset year filter
        }
      }
  
      // Update filteredData based on selection
      if (selectedYear) {
        filteredData = data.filter(d => d.year === selectedYear);
      } else if (selectedLanguage) {
        filteredData = data.filter(d => d.language === selectedLanguage);
      } else {
        filteredData = data;
      }
  
      console.log('Selected Year:', selectedYear);
      console.log('Selected Language:', selectedLanguage);
      console.log('Filtered Data Count:', filteredData.length);
    }
  </script>
  
  <section class="meta-analysis container mx-auto px-4 py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Meta-Analysis of Codebase</h1>
    
    <!-- Summary Statistics -->
    <dl class="stats grid grid-cols-2 gap-4 max-w-md mx-auto mb-12">
      <div>
        <dt class="font-bold text-gray-700 dark:text-gray-300">Total <abbr title="Lines of Code">LOC</abbr></dt>
        <dd class="text-gray-900 dark:text-white">{data.length}</dd>
      </div>
      <div>
        <dt class="font-bold text-gray-700 dark:text-gray-300">Total Commits</dt>
        <dd class="text-gray-900 dark:text-white">{commits.length}</dd>
      </div>
      <div>
        <dt class="font-bold text-gray-700 dark:text-gray-300">Projects by Year</dt>
        <dd class="text-gray-900 dark:text-white">{projectsByYear.length}</dd>
      </div>
      <div>
        <dt class="font-bold text-gray-700 dark:text-gray-300">Languages Used</dt>
        <dd class="text-gray-900 dark:text-white">{languageBreakdown.length}</dd>
      </div>
      <!-- Additional Statistics -->
      <div>
        <dt class="font-bold text-gray-700 dark:text-gray-300">Average Lines per Commit</dt>
        <dd class="text-gray-900 dark:text-white">{averageLinesPerCommit}</dd>
      </div>
      <div>
        <dt class="font-bold text-gray-700 dark:text-gray-300">Most Active Author</dt>
        <dd class="text-gray-900 dark:text-white">{mostActiveAuthor}</dd>
      </div>
      <div>
        <dt class="font-bold text-gray-700 dark:text-gray-300">Peak Activity Period</dt>
        <dd class="text-gray-900 dark:text-white">{peakActivityPeriod}</dd>
      </div>
      <div>
        <dt class="font-bold text-gray-700 dark:text-gray-300">Number of Files</dt>
        <dd class="text-gray-900 dark:text-white">{numberOfFiles}</dd>
      </div>
    </dl>
    
    <!-- Pie Chart for Projects by Year -->
    <section class="mb-16">
      <h2 class="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">Projects Distribution by Year</h2>
      {#if projectsByYear.length > 0}
        <PieChart 
          data={projectsByYear} 
          width={400} 
          height={400} 
          innerRadius={50} 
          outerRadius={150} 
          selectedLabel={selectedYear || selectedLanguage} 
          on:sliceClick={handleSliceClick}
        />
      {:else}
        <p class="text-center text-gray-600 dark:text-gray-400">No project data available.</p>
      {/if}
    </section>
    
    <!-- Pie Chart for Language Breakdown -->
    <section class="mb-16">
      <h2 class="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">Language Breakdown</h2>
      {#if languageBreakdown.length > 0}
        <PieChart 
          data={languageBreakdown} 
          width={400} 
          height={400} 
          innerRadius={50} 
          outerRadius={150} 
          selectedLabel={selectedYear || selectedLanguage} 
          on:sliceClick={handleSliceClick}
        />
      {:else}
        <p class="text-center text-gray-600 dark:text-gray-400">No language data available.</p>
      {/if}
    </section>
    
    <!-- Filtered Projects Display -->
    {#if selectedYear || selectedLanguage}
      <section class="filtered-projects mt-8">
        <h2 class="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">
          {#if selectedYear}
            Projects from {selectedYear}
          {:else if selectedLanguage}
            Projects using {selectedLanguage}
          {/if}
        </h2>
        <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {#each filteredData as project}
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
        <div class="text-center mt-4">
          <button 
            on:click={() => { selectedYear = null; selectedLanguage = null; filteredData = data; }} 
            class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
          >
            Clear Filter
          </button>
        </div>
      </section>
    {/if}
  </section>
  
  <style>
    .stats dt {
      font-weight: bold;
      color: #4f46e5; /* Tailwind's indigo-600 */
    }
    .stats dd {
      color: #6b7280; /* Tailwind's gray-500 */
    }
    .meta-analysis {
      padding-top: 2rem;
      padding-bottom: 2rem;
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
  
    /* Tooltip Styling */
    .tooltip {
      opacity: 0;
      transition: opacity 0.3s ease;
    }
  
    .tooltip:hover {
      opacity: 1;
    }
  </style>
  