<!-- src/lib/components/MetaAnalysis.svelte -->
<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import PieChart from './PieChart.svelte'; // Ensure correct path
  
    let data = [];
    let commits = [];
    let projectsByYear = [];
  
    // Additional Statistics
    let averageLinesPerCommit = 0;
    let mostActiveAuthor = 'N/A';
    let peakActivityPeriod = 'N/A';
    let numberOfFiles = 0;
  
    // Filter State
    let selectedYear = null;
    let searchQuery = '';
  
    // Pagination State
    let currentPage = 1;
    const projectsPerPage = 6;
    let totalPages = 1;
    let paginatedProjects = [];
  
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
                year: Number(row.year),
                author: row.author || 'Unknown',
            }));
            console.log('Fetched Data:', data);
  
            // Aggregate projects by year
            projectsByYear = d3.rollups(
                data,
                v => v.length,
                d => d.year
            ).map(([year, count]) => ({ label: year.toString(), value: count }));
            console.log('Projects By Year:', projectsByYear);
  
            // Initialize filteredData
            filteredData = data;
            updatePagination();
        } catch (error) {
            console.error('Error loading or processing loc.csv:', error);
        }
    });
  
    // Handle slice clicks
    function handleSliceClick(label) {
        // Toggle the selected year filter
        selectedYear = selectedYear === label ? null : label;
  
        // Update filteredData based on selection and search
        updateFilteredData();
  
        console.log('Selected Year:', selectedYear);
        console.log('Filtered Data Count:', filteredData.length);
    }

    // Handle Search Query Change
    $: updateFilteredData();

    // Update Filtered Data
    function updateFilteredData() {
        filteredData = data.filter(d => {
            let matchesYear = selectedYear ? d.year.toString() === selectedYear : true;
            let matchesSearch = searchQuery 
                ? d.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  d.description?.toLowerCase().includes(searchQuery.toLowerCase())
                : true;
            return matchesYear && matchesSearch;
        });

        // Reset to first page after filtering
        currentPage = 1;
        updatePagination();
    }
  
    // Update Pagination
    function updatePagination() {
        totalPages = Math.ceil(filteredData.length / projectsPerPage) || 1;
        paginatedProjects = filteredData.slice(
            (currentPage - 1) * projectsPerPage,
            currentPage * projectsPerPage
        );
    }
  
    // Watch for changes in filteredData or currentPage
    $: updatePagination();
</script>
  
<section class="meta-analysis container mx-auto px-4 py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Meta-Analysis of Codebase</h1>
    
    <!-- Summary Statistics -->
    <dl class="stats grid grid-cols-2 gap-4 max-w-md mx-auto mb-12">
      <!-- Statistics go here -->
    </dl>
    
    <!-- Search Bar -->
    <div class="search-bar mb-6">
      <input 
        type="text" 
        bind:value={searchQuery} 
        placeholder="Search projects..." 
        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
    </div>
    
    <!-- Pie Chart for Projects by Year -->
    <section class="mb-16">
        <h2 class="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">Projects Distribution by Year</h2>
        {#if projectsByYear.length > 0}
            <PieChart 
                data={projectsByYear} 
                width={400} 
                height={400} 
                innerRadius={0} 
                outerRadius={150} 
                selectedLabel={selectedYear} 
                on:sliceClick={handleSliceClick}
            />
        {:else}
            <p class="text-center text-gray-600 dark:text-gray-400">No project data available.</p>
        {/if}
    </section>
    
    <!-- Filtered Projects Display -->
    {#if selectedYear || searchQuery}
        <section class="filtered-projects mt-8">
            <h2 class="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">
                {#if selectedYear && searchQuery}
                    Projects from {selectedYear} matching "{searchQuery}"
                {:else if selectedYear}
                    Projects from {selectedYear}
                {:else if searchQuery}
                    Search Results for "{searchQuery}"
                {/if}
            </h2>
            {#if paginatedProjects.length > 0}
                <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {#each paginatedProjects as project}
                        <article class="border rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-300 dark:border-gray-700">
                            <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{project.title}</h3>
                            <img src="{project.image}" alt="{project.title} Image" class="mb-4 w-full h-48 object-cover rounded" loading="lazy" />
                            <p class="text-md text-gray-700 dark:text-gray-300">{project.description}</p>
                            <p class="project-year">{project.year}</p>
                            <a href="{project.link}" target="_blank" rel="noopener noreferrer" class="text-indigo-500 hover:underline mt-2 block">
                                View Project
                            </a>
                        </article>
                    {/each}
                </div>
                <!-- Pagination Controls -->
                {#if totalPages > 1}
                    <div class="pagination mt-6 flex justify-center space-x-2">
                        {#each Array(totalPages) as _, index}
                            <button 
                                on:click={() => currentPage = index + 1} 
                                class="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600"
                                class:selected={currentPage === index + 1}
                            >
                                {index + 1}
                            </button>
                        {/each}
                    </div>
                {/if}
            {:else}
                <p class="text-center text-gray-600 dark:text-gray-400">No projects match your criteria.</p>
            {/if}
            <!-- Clear Filter Button -->
            <div class="text-center mt-6">
                <button 
                    on:click={() => { selectedYear = null; searchQuery = ''; filteredData = data; currentPage = 1; }} 
                    class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 dark:bg-red-600 dark:hover:bg-red-700"
                >
                    Clear Filter
                </button>
            </div>
        </section>
    {/if}
</section>
  
<style>
    /* Styles go here, as per the last version */
</style>
