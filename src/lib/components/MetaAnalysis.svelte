<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import PieChart from './PieChart.svelte'; // Ensure correct path

    let data = [];
    let width = 1000;
    let height = 600;
    let margin = { top: 10, right: 10, bottom: 50, left: 70 };
    let usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left,
    };
    usableArea.width = usableArea.right - usableArea.left;
    usableArea.height = usableArea.bottom - usableArea.top;

    let xScale, yScale;
    let xAxisGroup, yAxisGroup;
    let tooltipVisible = false;
    let tooltipContent = {};
    let tooltipStyle = { top: '0px', left: '0px' };

    onMount(async () => {
        try {
            data = await d3.csv('/loc.csv', (row) => ({
                ...row,
                datetime: new Date(row.datetime),
                author: row.author || 'Unknown',
                commit: row.commit || 'N/A',
            }));

            // Create scales
            xScale = d3.scaleTime()
                .domain(d3.extent(data, d => d.datetime))
                .range([usableArea.left, usableArea.right])
                .nice();

            yScale = d3.scaleLinear()
                .domain([0, 24])
                .range([usableArea.bottom, usableArea.top])
                .nice();

            // Create and render axes
            const xAxis = d3.axisBottom(xScale)
                .ticks(d3.timeYear.every(0.5))
                .tickFormat(d3.timeFormat('%b %Y'));

            const yAxis = d3.axisLeft(yScale)
                .ticks(12)
                .tickFormat(d => `${String(d).padStart(2, '0')}:00`);

            d3.select(xAxisGroup).call(xAxis);
            d3.select(yAxisGroup).call(yAxis);
        } catch (error) {
            console.error('Error loading or processing loc.csv:', error);
        }
    });

    function showTooltip(event, commit) {
        tooltipContent = {
            id: commit.commit,
            datetime: commit.datetime.toLocaleString(),
            author: commit.author,
        };
        tooltipVisible = true;
        tooltipStyle = {
            top: `${event.clientY + 10}px`,
            left: `${event.clientX + 10}px`,
        };
    }

    function hideTooltip() {
        tooltipVisible = false;
    }
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

    <!-- Scatterplot for Commits by Time of Day -->
    <section class="scatterplot-section container mb-16">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Commits by Time of Day</h2>

        <svg viewBox={`0 0 ${width} ${height}`} class="scatterplot">
            <g class="x-axis" transform={`translate(0, ${usableArea.bottom})`} bind:this={xAxisGroup} />
            <g class="y-axis" transform={`translate(${usableArea.left}, 0)`} bind:this={yAxisGroup} />

            <!-- Scatterplot Circles -->
            <g class="dots">
                {#each data as commit}
                    <circle
                        cx={xScale(commit.datetime)}
                        cy={yScale(commit.datetime.getHours() + commit.datetime.getMinutes() / 60)}
                        r="5"
                        fill="steelblue"
                        on:mouseenter={(event) => showTooltip(event, commit)}
                        on:mouseleave={hideTooltip}
                    />
                {/each}
            </g>
        </svg>

        <!-- Tooltip -->
        {#if tooltipVisible}
            <div class="tooltip" style="top: {tooltipStyle.top}; left: {tooltipStyle.left};">
                <p><strong>Commit ID:</strong> {tooltipContent.id}</p>
                <p><strong>Date & Time:</strong> {tooltipContent.datetime}</p>
                <p><strong>Author:</strong> {tooltipContent.author}</p>
            </div>
        {/if}
    </section>
</section>

<style>
    .scatterplot {
        overflow: visible;
    }
    .scatterplot circle {
        transition: 0.2s;
        fill-opacity: 0.7;
        transform-origin: center;
        transform-box: fill-box;
    }
    .scatterplot circle:hover {
        transform: scale(1.5);
        fill-opacity: 1;
    }
    .tooltip {
        position: fixed;
        background: #fff;
        border: 1px solid #ddd;
        padding: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        font-size: 12px;
        pointer-events: none;
    }
    .axis-title {
        font-size: 14px;
        fill: #4f46e5; /* Tailwind's indigo-600 */
    }
</style>
