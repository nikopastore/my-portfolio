<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import PieChart from './PieChart.svelte'; // Ensure correct path

    let data = [];
    let commits = [];
    let projectsByYear = [];

    // New summary statistics
    let totalLinesOfCode = 0;
    let avgFileLength = 0;
    let maxDepth = 0;
    let avgDepth = 0;
    let longestLineLength = 0;

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

            // Calculate new statistics
            totalLinesOfCode = data.length;
            avgFileLength = d3.mean(data, d => d.length).toFixed(2);
            maxDepth = d3.max(data, d => d.depth);
            avgDepth = d3.mean(data, d => d.depth).toFixed(2);
            longestLineLength = d3.max(data, d => d.line);

            // Aggregate projects by year
            projectsByYear = d3.rollups(
                data,
                v => v.length,
                d => d.year
            ).map(([year, count]) => ({ label: year.toString(), value: count }));

            console.log('Summary Stats:', {
                totalLinesOfCode,
                avgFileLength,
                maxDepth,
                avgDepth,
                longestLineLength
            });
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
            <dt>Total <abbr title="Lines of Code">LOC</abbr></dt>
            <dd>{totalLinesOfCode}</dd>
        </div>
        <div>
            <dt>Average File Length (lines)</dt>
            <dd>{avgFileLength}</dd>
        </div>
        <div>
            <dt>Maximum Depth</dt>
            <dd>{maxDepth}</dd>
        </div>
        <div>
            <dt>Average Depth</dt>
            <dd>{avgDepth}</dd>
        </div>
        <div>
            <dt>Longest Line Length</dt>
            <dd>{longestLineLength}</dd>
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
                innerRadius={0} 
                outerRadius={150} 
            />
        {:else}
            <p class="text-center text-gray-600 dark:text-gray-400">No project data available.</p>
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
</style>
