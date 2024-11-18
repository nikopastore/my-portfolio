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
    let totalLinesOfCode = 0;
    let numberOfFiles = 0;
    let totalCommits = 0;

    // Derived data for display
    let authorCommitCounts = {};

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

            // Calculate average lines per commit
            averageLinesPerCommit = totalLinesOfCode / totalCommits || 0;

            // Calculate number of files
            numberOfFiles = new Set(data.map(d => d.file)).size;

            // Calculate most active author
            authorCommitCounts = d3.rollups(
                data,
                v => v.length,
                d => d.author
            ).sort((a, b) => b[1] - a[1]);

            mostActiveAuthor = authorCommitCounts.length > 0 ? authorCommitCounts[0][0] : 'N/A';

            // Log to confirm processing
            console.log('Summary Statistics:', {
                totalLinesOfCode,
                totalCommits,
                averageLinesPerCommit,
                numberOfFiles,
                mostActiveAuthor
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

<section class="meta-analysis container mx-auto px-4 py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Meta-Analysis of Codebase</h1>

    <!-- Summary Statistics -->
    <dl class="stats grid grid-cols-2 gap-4 max-w-md mx-auto mb-12">
        <div>
            <dt>Total <abbr title="Lines of Code">LOC</abbr></dt>
            <dd>{totalLinesOfCode}</dd>
        </div>
        <div>
            <dt>Total Commits</dt>
            <dd>{totalCommits}</dd>
        </div>
        <div>
            <dt>Average Lines per Commit</dt>
            <dd>{averageLinesPerCommit.toFixed(2)}</dd>
        </div>
        <div>
            <dt>Most Active Author</dt>
            <dd>{mostActiveAuthor}</dd>
        </div>
        <div>
            <dt>Number of Files</dt>
            <dd>{numberOfFiles}</dd>
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
        color: #6b7280;
    }
</style>
