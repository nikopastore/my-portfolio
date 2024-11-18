<!-- src/lib/components/MetaAnalysis.svelte -->
<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import PieChart from './PieChart.svelte'; // Ensure correct path

    let data = [];
    let commits = [];
    let projectsByYear = [];

    // Additional Statistics
    let totalLinesOfCode = 0;
    let totalCommits = 0;
    let numberOfFiles = 0;
    let maxDepth = 0;
    let longestLine = 0;
    let maxLines = 0;

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

            // Calculate total lines of code
            totalLinesOfCode = data.length;

            // Calculate total commits
            commits = d3.groups(data, d => d.commit);
            totalCommits = commits.length;

            // Calculate number of files
            numberOfFiles = new Set(data.map(d => d.file)).size;

            // Calculate maximum depth
            maxDepth = d3.max(data, d => d.depth);

            // Calculate longest line and max lines in a file
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
            ).map(([year, count]) => ({ label: year.toString(), value: count }));

        } catch (error) {
            console.error('Error loading or processing loc.csv:', error);
        }
    });
</script>

<section class="summary-section container mx-auto px-4 py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Summary</h2>

    <!-- Summary Statistics -->
    <dl class="stats flex justify-between max-w-4xl mx-auto mb-12 text-center">
        <div class="stat-item">
            <dt class="text-sm font-medium text-gray-500">COMMITS</dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">{totalCommits}</dd>
        </div>
        <div class="stat-item">
            <dt class="text-sm font-medium text-gray-500">FILES</dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">{numberOfFiles}</dd>
        </div>
        <div class="stat-item">
            <dt class="text-sm font-medium text-gray-500">TOTAL LOC</dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">{totalLinesOfCode}</dd>
        </div>
        <div class="stat-item">
            <dt class="text-sm font-medium text-gray-500">MAX DEPTH</dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">{maxDepth}</dd>
        </div>
        <div class="stat-item">
            <dt class="text-sm font-medium text-gray-500">LONGEST LINE</dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">{longestLine}</dd>
        </div>
        <div class="stat-item">
            <dt class="text-sm font-medium text-gray-500">MAX LINES</dt>
            <dd class="text-2xl font-bold text-gray-900 dark:text-white">{maxLines}</dd>
        </div>
    </dl>
</section>

<!-- The rest of your page structure remains unchanged -->

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
</style>
