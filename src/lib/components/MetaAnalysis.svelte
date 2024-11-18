<!-- src/lib/components/MetaAnalysis.svelte -->
<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import PieChart from './PieChart.svelte'; // Ensure correct path

    let data = [];
    let commits = [];
    let projectsByYear = [];
    let colors = d3.schemeCategory10; // D3 color scheme for pie chart segments

    // Statistics
    let totalLinesOfCode = 0;
    let totalCommits = 0;
    let numberOfFiles = 0;
    let maxDepth = 0;
    let longestLine = 0;
    let maxLines = 0;

    // Scatterplot properties
    let width = 1000;
    let height = 600;
    let margin = { top: 10, right: 10, bottom: 50, left: 70 };
    let xScale, yScale;
    let xAxisGroup, yAxisGroup;
    let tooltipVisible = false;
    let tooltipContent = {};
    let tooltipStyle = { top: '0px', left: '0px' };

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
                file: row.file || 'Unnamed'
            }));

            // Calculate statistics
            totalLinesOfCode = data.length;
            commits = d3.groups(data, d => d.commit);
            totalCommits = commits.length;
            numberOfFiles = new Set(data.map(d => d.file)).size;
            maxDepth = d3.max(data, d => d.depth);
            longestLine = d3.max(data, d => d.length);
            maxLines = d3.max(d3.rollups(data, v => v.length, d => d.file), d => d[1]);

            // Log to confirm processing
            console.log('Summary Statistics:', {
                totalLinesOfCode,
                totalCommits,
                numberOfFiles,
                maxDepth,
                longestLine,
                maxLines
            });

            // Initialize projects by year for the pie chart
            projectsByYear = d3.rollups(
                data,
                v => v.length,
                d => d.year
            ).map(([year, count], i) => ({
                label: year.toString(),
                value: count,
                color: colors[i % colors.length] // Assign color for legend
            }));

            // Create scales for the scatterplot
            xScale = d3.scaleTime()
                .domain(d3.extent(data, d => d.datetime))
                .range([margin.left, width - margin.right])
                .nice();

            yScale = d3.scaleLinear()
                .domain([0, 24])
                .range([height - margin.bottom, margin.top])
                .nice();

            // Create and render axes for the scatterplot
            d3.select(xAxisGroup).call(d3.axisBottom(xScale).ticks(d3.timeYear.every(0.5)).tickFormat(d3.timeFormat('%b %Y')));
            d3.select(yAxisGroup).call(d3.axisLeft(yScale).ticks(12).tickFormat(d => `${String(d).padStart(2, '0')}:00`));
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

<section class="summary-section container mx-auto px-4 py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Summary</h2>

    <!-- Summary Statistics -->
    <dl class="stats flex justify-between max-w-4xl mx-auto mb-12 text-center">
        <div class="stat-item">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">COMMITS</dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">{totalCommits}</dd>
        </div>
        <div class="stat-item">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">FILES</dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">{numberOfFiles}</dd>
        </div>
        <div class="stat-item">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">TOTAL LOC</dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">{totalLinesOfCode}</dd>
        </div>
        <div class="stat-item">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">MAX DEPTH</dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">{maxDepth}</dd>
        </div>
        <div class="stat-item">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">LONGEST LINE</dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">{longestLine}</dd>
        </div>
        <div class="stat-item">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">MAX LINES</dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">{maxLines}</dd>
        </div>
    </dl>
</section>

<!-- Scatterplot for Commits by Time of Day -->
<section class="scatterplot-section container mx-auto px-4 py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Commits by Time of Day</h2>

    <svg viewBox={`0 0 ${width} ${height}`} class="scatterplot">
        <!-- Render axes -->
        <g class="x-axis" transform={`translate(0, ${height - margin.bottom})`} bind:this={xAxisGroup} />
        <g class="y-axis" transform={`translate(${margin.left}, 0)`} bind:this={yAxisGroup} />

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
        <div class="tooltip dark:bg-gray-800 dark:text-white" style="top: {tooltipStyle.top}; left: {tooltipStyle.left};">
            <p><strong>Commit ID:</strong> {tooltipContent.id}</p>
            <p><strong>Date & Time:</strong> {tooltipContent.datetime}</p>
            <p><strong>Author:</strong> {tooltipContent.author}</p>
        </div>
    {/if}
</section>

<!-- Pie Chart for Projects by Year with Legend -->
<section class="flex justify-between items-start mb-16">
    <div class="w-1/2">
        <h2 class="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">Projects Distribution by Year</h2>
        {#if projectsByYear.length > 0}
            <PieChart 
                data={projectsByYear} 
                width={400} 
                height={400} 
                innerRadius={0} 
                outerRadius={150} 
            />
        {:else}
            <p class="text-center text-gray-600 dark:text-gray-400">No project data available.</p>
        {/if}
    </div>
    <div class="w-1/3 ml-4">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Legend</h3>
        <ul class="legend-list">
            {#each projectsByYear as { label, color }}
                <li class="flex items-center mb-2">
                    <span class="legend-color-box" style="background-color: {color};"></span>
                    <span class="ml-2 text-gray-900 dark:text-gray-300">{label}</span>
                </li>
            {/each}
        </ul>
    </div>
</section>

<style>
    .summary-section h2 {
        margin-bottom: 1rem;
    }
    .stats {
        display: flex;
        gap: 2rem;
    }
    .stat-item dt {
        font-size: 0.875rem; /* Tailwind's text-sm */
        color: #6b7280; /* Tailwind's gray-500 */
    }
    .stat-item dd {
        font-size: 1.5rem; /* Tailwind's text-2xl */
        color: #111827; /* Tailwind's gray-900 */
        font-weight: bold;
    }
    .stat-item dd.dark\:text-white {
        color: #FFFFFF; /* White font for dark mode */
    }
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
    .tooltip.dark\:bg-gray-800 {
        background-color: #1f2937; /* Tailwind's gray-800 for dark mode */
    }
    .tooltip.dark\:text-white {
        color: #FFFFFF; /* White text for dark mode */
    }
    .legend-list {
        list-style: none;
        padding: 0;
    }
    .legend-color-box {
        width: 16px;
        height: 16px;
        display: inline-block;
    }
</style>
