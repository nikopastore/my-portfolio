<!-- src/routes/meta/+page.svelte -->
<script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
    import PieChart from '$lib/PieChart.svelte';

    let data = [];
    let commits = [];
    let projectsByYear = [];
    let languageBreakdown = [];

    onMount(async () => {
        // Read the CSV file
        data = await d3.csv('/loc.csv', (row) => ({
            ...row,
            line: Number(row.line),
            depth: Number(row.depth),
            length: Number(row.length),
            date: new Date(row.date + 'T00:00' + row.timezone),
            datetime: new Date(row.datetime),
        }));

        commits = d3.groups(data, (d) => d.commit)
            .map(([commit, lines]) => {
                let first = lines[0];
                let { author, date, time, timezone, datetime } = first;
                let ret = {
                    id: commit,
                    url: 'https://github.com/nikopastore/my-portfolio.git' + commit,
                    author,
                    date,
                    time,
                    timezone,
                    datetime,
                    hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
                    totalLines: lines.length,
                };

                Object.defineProperty(ret, 'lines', {
                    value: lines,
                    configurable: true,
                    writable: true,
                    enumerable: false,
                });

                return ret;
            });

        const yearData = data.reduce((acc, project) => {
            acc[project.year] = acc[project.year] || { label: project.year, value: 0 };
            acc[project.year].value += 1;
            return acc;
        }, {});
        projectsByYear = Object.values(yearData);

        languageBreakdown = Array.from(d3.rollups(
            data,
            v => v.length,
            d => d.language
        )).map(([language, lines]) => ({ label: language, value: lines }));
    });
</script>

<section id="meta" class="mb-16">
    <h1 class="text-4xl font-bold mb-4 text-center">Meta-Analysis of Codebase</h1>
    <p class="text-lg text-center mb-8">
        This page provides an in-depth analysis of the codebase, including lines of code, commit statistics, and language breakdown.
    </p>

    <dl class="stats grid grid-cols-2 gap-4 max-w-md mx-auto mb-12">
        <div>
            <dt>Total <abbr title="Lines of Code">LOC</abbr></dt>
            <dd>{data.length}</dd>
        </div>
        <div>
            <dt>Total Commits</dt>
            <dd>{commits.length}</dd>
        </div>
        <div>
            <dt>Projects by Year</dt>
            <dd>{projectsByYear.length}</dd>
        </div>
        <div>
            <dt>Languages Used</dt>
            <dd>{languageBreakdown.length}</dd>
        </div>
    </dl>

    <section class="mb-16">
        <h2 class="text-2xl font-semibold mb-4 text-center">Projects Distribution by Year</h2>
        <PieChart 
            data={projectsByYear} 
            width={400} 
            height={400} 
            innerRadius={0} 
            outerRadius={150} 
            selectedLabel={null} 
        />
    </section>

    <section>
        <h2 class="text-2xl font-semibold mb-4 text-center">Language Breakdown</h2>
        <PieChart 
            data={languageBreakdown} 
            width={400} 
            height={400} 
            innerRadius={0} 
            outerRadius={150} 
            selectedLabel={null} 
        />
    </section>
</section>

<style>
    .stats dt {
        font-weight: bold;
        color: #4f46e5;
    }
    .stats dd {
        color: #6b7280;
    }
    section {
        text-align: center;
    }
</style>
