<!-- src/lib/components/MetaAnalysis.svelte -->
<script>
    import PieChart from './PieChart.svelte'; // Ensure correct path
    import projects from '$lib/projects.json'; // Your projects data

    let selectedYear = null;
    let searchQuery = '';
    let filteredProjects = projects;

    // Update filtered projects based on selected year and search query
    $: filteredProjects = projects.filter(project => {
        const matchesYear = selectedYear ? project.year.toString() === selectedYear : true;
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesYear && matchesSearch;
    });

    // Handle slice click event for the pie chart
    function handleSliceClick(event) {
        selectedYear = selectedYear === event.detail ? null : event.detail;
    }
</script>

<section class="meta-analysis container mx-auto px-4 py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h1 class="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">Meta-Analysis of Projects</h1>

    <!-- Pie Chart Section -->
    <div class="flex justify-center items-start gap-8 mb-8">
        <PieChart 
            data={[
                { label: '2024', value: 3 },
                { label: '2023', value: 4 },
                { label: '2022', value: 3 },
                { label: '2021', value: 2 }
            ]}
            width={300} 
            height={300} 
            innerRadius={0} 
            outerRadius={150} 
            selectedLabel={selectedYear} 
            on:sliceClick={handleSliceClick}
        />

        <!-- Legend Section -->
        <div class="flex flex-col justify-start items-start p-4 border rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-2">Legend</h3>
            <ul>
                <li class="mb-2 flex items-center">
                    <span class="block w-4 h-4 mr-2 rounded-full" style="background-color: #1f77b4;"></span> 2024 (3)
                </li>
                <li class="mb-2 flex items-center">
                    <span class="block w-4 h-4 mr-2 rounded-full" style="background-color: #ff7f0e;"></span> 2023 (4)
                </li>
                <li class="mb-2 flex items-center">
                    <span class="block w-4 h-4 mr-2 rounded-full" style="background-color: #2ca02c;"></span> 2022 (3)
                </li>
                <li class="mb-2 flex items-center">
                    <span class="block w-4 h-4 mr-2 rounded-full" style="background-color: #d62728;"></span> 2021 (2)
                </li>
            </ul>
        </div>
    </div>

    <!-- Search Projects Section -->
    <div class="mb-8 max-w-lg mx-auto">
        <input
            type="text"
            placeholder="🔍 Search projects..."
            bind:value={searchQuery}
            class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
    </div>

    <!-- Filtered Projects List -->
    <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {#each filteredProjects as project}
            <article class="border rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-300 dark:border-gray-700">
                <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{project.title}</h3>
                <div class="w-full h-48 bg-gray-200 flex items-center justify-center mb-4">
                    <span class="text-gray-500 text-lg">IMAGE COMING SOON</span>
                </div>
                <p class="text-md text-gray-700 dark:text-gray-300">{project.description}</p>
                <p class="text-sm text-gray-500 mt-2">{project.year}</p>
            </article>
        {/each}
    </div>

    <!-- Clear Filter Button -->
    {#if selectedYear || searchQuery}
        <div class="text-center mt-6">
            <button 
                on:click={() => { selectedYear = null; searchQuery = ''; }} 
                class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 dark:bg-red-600 dark:hover:bg-red-700"
            >
                Clear Filter
            </button>
        </div>
    {/if}
</section>

<style>
    .meta-analysis {
        padding-top: 2rem;
        padding-bottom: 2rem;
    }

    /* Legend styles */
    .legend-item {
        display: flex;
        align-items: center;
    }

    .legend-item span {
        width: 1em;
        height: 1em;
        display: inline-block;
        margin-right: 0.5em;
    }

    /* Clear filter button styles */
    .clear-filter-btn {
        background-color: #d62828; /* Red color for clear button */
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .clear-filter-btn:hover {
        background-color: #a02020; /* Darker red on hover */
    }
</style>
