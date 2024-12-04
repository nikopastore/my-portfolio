<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import PieChart from './PieChart.svelte'; // Ensure correct path

    let data = [];
    let commits = [];
    let projectsByYear = [];
    let colors = d3.schemeCategory10; // D3 color scheme for consistent coloring
    let languageColorMap = new Map(); // Map to store consistent language colors

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

            // Assign consistent colors to each language
            const uniqueLanguages = new Set(data.map(d => d.language));
            Array.from(uniqueLanguages).forEach((language, index) => {
                languageColorMap.set(language, colors[index % colors.length]);
            });

            // Calculate statistics
            totalLinesOfCode = data.length;
            commits = d3.groups(data, d => d.commit)
                .map(([commit, lines]) => ({
                    id: commit,
                    url: 'https://github.com/username/repo/commit/' + commit,
                    author: lines[0].author,
                    datetime: lines[0].datetime,
                    totalLines: lines.length,
                    color: languageColorMap.get(lines[0].language) || '#cccccc',
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
                color: colors[i % colors.length]
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

            rScale = d3.scaleSqrt()
                .domain([1, d3.max(commits, d => d.totalLines)])
                .range([2, 15]);

            // Add Y-axis gridlines
            d3.select(yAxisGridlines)
                .call(d3.axisLeft(yScale).tickSize(-width + margin.left + margin.right).tickFormat(''))
                .selectAll('line')
                .attr('stroke', '#ddd')
                .attr('stroke-opacity', 0.7);

            // Render axes
            d3.select(xAxisGroup).call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b %Y')));
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

        languageBreakdown = d3.rollup(
            selectedLines,
            v => v.length,
            d => d.language
        );

        languageBreakdownArray = Array.from(languageBreakdown).map(([language, count]) => ({
            label: language,
            value: count,
            color: languageColorMap.get(language) || '#cccccc'
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

<section class="meta-analysis-wrapper container mx-auto px-4 py-8">
    <h2 class="text-3xl font-bold mb-6 text-center">Meta Analysis</h2>

    <!-- Statistics and visualizations here -->

</section>

<style>
    .brush-area .selection {
        fill: #8884d8;
        fill-opacity: 0.3;
        stroke: #666;
    }
    .scatterplot circle {
        transition: 0.2s;
    }
</style>
