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
    let xScale, yScale, rScale;
    let xAxisGroup, yAxisGroup, yAxisGridlines, brushArea;
    let tooltipVisible = false;
    let tooltipContent = {};
    let tooltipStyle = { top: '0px', left: '0px' };
    let selectedCommits = [];
    let selectedLines = [];
    let languageBreakdown = new Map();
    let languageBreakdownArray = [];

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
            commits = d3.groups(data, d => d.commit)
                .map(([commit, lines]) => ({
                    id: commit,
                    url: 'https://github.com/username/repo/commit/' + commit,
                    author: lines[0].author,
                    datetime: lines[0].datetime,
                    totalLines: lines.length,
                    lines
                }));
            totalCommits = commits.length;
            numberOfFiles = new Set(data.map(d => d.file)).size;
            maxDepth = d3.max(data, d => d.depth);
            longestLine = d3.max(data, d => d.length);
            maxLines = d3.max(d3.rollups(data, v => v.length, d => d.file), d => d[1]);

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

            // Scale for circle sizes based on total lines edited
            rScale = d3.scaleSqrt()
                .domain([1, d3.max(commits, d => d.totalLines)])
                .range([2, 15]);

            // Add Y-axis gridlines
            d3.select(yAxisGridlines)
                .call(d3.axisLeft(yScale).tickSize(-width + margin.left + margin.right).tickFormat(''))
                .selectAll('line')
                .attr('stroke', '#ddd')
                .attr('stroke-opacity', 0.7);

            // Create and render axes for the scatterplot
            d3.select(xAxisGroup).call(d3.axisBottom(xScale).ticks(d3.timeYear.every(0.5)).tickFormat(d3.timeFormat('%b %Y')));
            d3.select(yAxisGroup).call(d3.axisLeft(yScale).ticks(12).tickFormat(d => `${String(d).padStart(2, '0')}:00`));

            // Add brushing
            d3.select(brushArea)
                .call(
                    d3.brush()
                        .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
                        .on('start brush end', brushed)
                );
        } catch (error) {
            console.error('Error loading or processing loc.csv:', error);
        }
    });

    function brushed({ selection }) {
        if (!selection) {
            selectedCommits = [];
            selectedLines = [];
            languageBreakdown = new Map();
            languageBreakdownArray = [];
            return;
        }

        const [[x0, y0], [x1, y1]] = selection;
        selectedCommits = commits.filter(commit => {
            const cx = xScale(commit.datetime);
            const cy = yScale(commit.datetime.getHours() + commit.datetime.getMinutes() / 60);
            return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
        });

        selectedLines = selectedCommits.flatMap(commit => commit.lines);

        // Calculate the language breakdown
        languageBreakdown = d3.rollup(
            selectedLines,
            v => v.length,
            d => d.language
        );

        // Convert to array for display
        languageBreakdownArray = Array.from(languageBreakdown).map(([language, count]) => ({
            label: language,
            value: count
        }));
    }

    function showTooltip(event, commit) {
        tooltipContent = {
            id: commit.id,
            datetime: commit.datetime.toLocaleString(),
            author: commit.author,
            totalLines: commit.totalLines
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

<section class="meta-analysis-wrapper container mx-auto px-4 py-8 rounded-lg shadow-md bg-gray-900 dark:bg-gray-800">
    <h2 class="text-3xl font-bold mb-6 text-center text-gray-100 dark:text-gray-100">Meta Analysis</h2>

    <!-- Summary Statistics -->
    <section class="mb-12">
        <dl class="flex justify-between max-w-4xl mx-auto text-center">
            <div class="stat-item">
                <dt class="text-sm font-medium text-gray-400 dark:text-gray-500">COMMITS</dt>
                <dd class="text-2xl font-bold text-gray-100 dark:text-white">{totalCommits}</dd>
            </div>
            <div class="stat-item">
                <dt class="text-sm font-medium text-gray-400 dark:text-gray-500">FILES</dt>
                <dd class="text-2xl font-bold text-gray-100 dark:text-white">{numberOfFiles}</dd>
            </div>
            <div class="stat-item">
                <dt class="text-sm font-medium text-gray-400 dark:text-gray-500">TOTAL LOC</dt>
                <dd class="text-2xl font-bold text-gray-100 dark:text-white">{totalLinesOfCode}</dd>
            </div>
            <div class="stat-item">
                <dt class="text-sm font-medium text-gray-400 dark:text-gray-500">MAX DEPTH</dt>
                <dd class="text-2xl font-bold text-gray-100 dark:text-white">{maxDepth}</dd>
            </div>
            <div class="stat-item">
                <dt class="text-sm font-medium text-gray-400 dark:text-gray-500">LONGEST LINE</dt>
                <dd class="text-2xl font-bold text-gray-100 dark:text-white">{longestLine}</dd>
            </div>
            <div class="stat-item">
                <dt class="text-sm font-medium text-gray-400 dark:text-gray-500">MAX LINES</dt>
                <dd class="text-2xl font-bold text-gray-100 dark:text-white">{maxLines}</dd>
            </div>
        </dl>
    </section>

    <!-- Scatterplot for Commits by Time of Day -->
    <section class="mb-16">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-100 dark:text-gray-100">Commits by Time of Day</h2>

        <svg viewBox={`0 0 ${width} ${height}`} class="scatterplot">
            <g class="gridlines" transform={`translate(${margin.left}, 0)`} bind:this={yAxisGridlines} />
            <g class="x-axis" transform={`translate(0, ${height - margin.bottom})`} bind:this={xAxisGroup} />
            <g class="y-axis" transform={`translate(${margin.left}, 0)`} bind:this={yAxisGroup} />

            <!-- Brushing area -->
            <g bind:this={brushArea} class="brush-area"></g>

            <!-- Scatterplot Circles -->
            <g class="dots">
                {#each commits as commit}
                    <circle
                        cx={xScale(commit.datetime)}
                        cy={yScale(commit.datetime.getHours() + commit.datetime.getMinutes() / 60)}
                        r={rScale(commit.totalLines)}
                        fill={selectedCommits.includes(commit) ? 'orange' : 'steelblue'}
                        on:mouseenter={(event) => showTooltip(event, commit)}
                        on:mouseleave={hideTooltip}
                    />
                {/each}
            </g>
        </svg>

        {#if tooltipVisible}
            <div 
                class="tooltip dark:bg-gray-700 dark:text-white bg-white text-gray-900"
                style="top: {tooltipStyle.top}; left: {tooltipStyle.left};"
            >
                <p><strong>Commit ID:</strong> {tooltipContent.id}</p>
                <p><strong>Date & Time:</strong> {tooltipContent.datetime}</p>
                <p><strong>Author:</strong> {tooltipContent.author}</p>
                <p><strong>Lines Edited:</strong> {tooltipContent.totalLines}</p>
            </div>
        {/if}
    </section>

    {#if selectedLines.length > 0}
        <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 text-center text-gray-100 dark:text-gray-100">Language Breakdown of Selected Commits</h2>
            <PieChart 
                data={languageBreakdownArray} 
                width={400} 
                height={400} 
                innerRadius={0} 
                outerRadius={150} 
            />
        </section>
    {:else}
        <p class="text-center text-lg text-gray-400 dark:text-gray-500">
            No selected data to display language breakdown.
        </p>
    {/if}

    <!-- Pie Chart for Projects by Year with Legend -->
    <section class="flex justify-between items-start">
        <div class="w-1/2">
            <h2 class="text-2xl font-semibold mb-4 text-center text-gray-100 dark:text-gray-100">Projects Distribution by Year</h2>
            {#if projectsByYear.length > 0}
                <PieChart 
                    data={projectsByYear} 
                    width={400} 
                    height={400} 
                    innerRadius={0} 
                    outerRadius={150} 
                />
            {:else}
                <p class="text-center text-gray-400 dark:text-gray-500">No project data available.</p>
            {/if}
        </div>
        <div class="w-1/3 ml-4">
            <h3 class="text-lg font-semibold text-gray-100 dark:text-gray-100">Legend</h3>
            <ul class="legend-list">
                {#each projectsByYear as { label, color }}
                    <li class="flex items-center mb-2">
                        <span class="legend-color-box" style="background-color: {color};"></span>
                        <span class="ml-2 text-gray-100 dark:text-gray-300">{label}</span>
                    </li>
                {/each}
            </ul>
        </div>
    </section>
</section>

<style>
    .brush-area .selection {
        fill: #8884d8;
        fill-opacity: 0.3;
        stroke: #666;
    }
    .language-breakdown-list {
        max-width: 600px;
        margin: 0 auto;
        list-style: none;
        padding: 0;
    }
</style>
