<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import PieChart from './PieChart.svelte'; // Ensure correct path

    let data = [];
    let commits = [];
    let projectsByYear = [];

    let width = 1000;
    let height = 600;
    let margin = { top: 10, right: 10, bottom: 50, left: 70 }; // Adjusted for axis titles
    let usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left,
    };
    usableArea.width = usableArea.right - usableArea.left;
    usableArea.height = usableArea.bottom - usableArea.top;

    let xScale, yScale;

    onMount(async () => {
        try {
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

            xScale = d3.scaleTime()
                .domain(d3.extent(data, d => d.datetime))
                .range([usableArea.left, usableArea.right])
                .nice();

            yScale = d3.scaleLinear()
                .domain([0, 24])
                .range([usableArea.bottom, usableArea.top])
                .nice();
        } catch (error) {
            console.error('Error loading or processing loc.csv:', error);
        }
    });
</script>

<section class="scatterplot-section container mx-auto px-4 py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Commits by Time of Day</h2>

    <svg viewBox={`0 0 ${width} ${height}`} class="scatterplot">
        <!-- X Axis Title -->
        <text
            x={width / 2}
            y={height - 10}
            text-anchor="middle"
            class="axis-title"
        >
            Date of Commit
        </text>

        <!-- Y Axis Title -->
        <text
            x={-height / 2}
            y={20}
            transform="rotate(-90)"
            text-anchor="middle"
            class="axis-title"
        >
            Time of Day
        </text>

        <g class="dots">
            {#each data as commit, index}
                <circle
                    cx={xScale(commit.datetime)}
                    cy={yScale(commit.datetime.getHours() + commit.datetime.getMinutes() / 60)}
                    r="5"
                    fill="steelblue"
                />
            {/each}
        </g>
    </svg>
</section>

<style>
    .scatterplot {
        overflow: visible;
    }
    .scatterplot circle {
        transition: 0.2s;
        fill-opacity: 0.7;
    }
    .scatterplot circle:hover {
        transform: scale(1.5);
        fill-opacity: 1;
    }
    .axis-title {
        font-size: 14px;
        fill: #4f46e5; /* Tailwind's indigo-600 */
    }
</style>
