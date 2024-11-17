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
            let { author, date, time, timezone, datetime } = first;
            let ret = {
              id: commit,
              url: 'https://github.com/nikopastore/your-repo/commit/' + commit, // Replace 'your-repo' with actual repo name
              author,
              date,
              time,
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
  
      } catch (error) {
        console.error('Error loading or processing loc.csv:', error);
      }
    });
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
        <PieChart data={projectsByYear} width={400} height={400} innerRadius={50} outerRadius={150} />
      {:else}
        <p class="text-center text-gray-600 dark:text-gray-400">No project data available.</p>
      {/if}
    </section>
    
    <!-- Pie Chart for Language Breakdown -->
    <section>
      <h2 class="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">Language Breakdown</h2>
      {#if languageBreakdown.length > 0}
        <PieChart data={languageBreakdown} width={400} height={400} innerRadius={50} outerRadius={150} />
      {:else}
        <p class="text-center text-gray-600 dark:text-gray-400">No language data available.</p>
      {/if}
    </section>
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
  </style>
  