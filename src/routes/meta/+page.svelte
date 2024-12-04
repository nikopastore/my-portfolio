<script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
    import Scrolly from 'svelte-scrolly';
    import PieChart from '$lib/components/PieChart.svelte';

    let data = [];
    let commits = [];
    let files = [];
    let filteredCommits = [];
    let filteredFiles = [];
    let commitProgress = 100; // Slider progress (0-100%)
    let fileSizeProgress = 0; // Scrollytelling progress for file sizes
    let selectedCommits = [];
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    const timeScale = d3.scaleTime();

    $: commitMaxTime = timeScale.invert(commitProgress);
    $: filteredCommits = commits.filter((commit) => commit.datetime <= commitMaxTime);
    $: filteredFiles = files.filter((file) => file.date <= timeScale.invert(fileSizeProgress * 100));

    function brushed(evt) {
        let brushSelection = evt.selection;
        selectedCommits = !brushSelection
            ? []
            : commits.filter((commit) => {
                let min = { x: brushSelection[0][0], y: brushSelection[0][1] };
                let max = { x: brushSelection[1][0], y: brushSelection[1][1] };
                let x = xScale(commit.date);
                let y = yScale(commit.hourFrac);
                return x >= min.x && x <= max.x && y >= min.y && y <= max.y;
            });
    }

    function dotInteraction(evt, index) {
        if (evt.type === "click" || (evt.type === "keyup" && evt.key === "Enter")) {
            selectedCommits = [commits[index]];
        }
    }

    onMount(async () => {
        // Example CSV load, replace with actual logic
        data = await d3.csv('/loc.csv', (row) => ({
            ...row,
            datetime: new Date(row.datetime),
        }));
        commits = data; // Replace with commit parsing
        files = data; // Replace with file parsing
    });
</script>

<div class="timeline-filter">
    <label>
        <input type="range" bind:value={commitProgress} min="0" max="100" />
        <time>{commitMaxTime.toLocaleString("en", { dateStyle: "long", timeStyle: "short" })}</time>
    </label>
</div>

<Scrolly bind:progress={commitProgress}>
    <div slot="story">
        {#each filteredCommits as commit}
            <p>
                On {commit.date.toLocaleString("en", { dateStyle: "long", timeStyle: "short" })}, a commit titled
                "{commit.message}" was made, modifying {commit.filesModified.length} files.
            </p>
        {/each}
    </div>
    <svelte:fragment slot="viz">
        <svg>
            {#each filteredCommits as commit (commit.id)}
                <circle
                    cx={xScale(commit.date)}
                    cy={yScale(commit.hourFrac)}
                    r={5}
                    fill="steelblue"
                    transition:scale
                />
            {/each}
        </svg>
    </svelte:fragment>
</Scrolly>

<Scrolly bind:progress={fileSizeProgress} --scrolly-layout="viz-first">
    <div slot="story">
        {#each filteredFiles as file}
            <p>
                File "{file.name}" contains {file.lines} lines of code, primarily written in {file.language}.
            </p>
        {/each}
    </div>
    <svelte:fragment slot="viz">
        <div class="file-visualization">
            {#each filteredFiles as file (file.name)}
                <div class="file-bar" style="width: {file.lines}px; background: {colors(file.language)}">
                    <span>{file.name}</span>
                </div>
            {/each}
        </div>
    </svelte:fragment>
</Scrolly>

<style>
    circle {
        transition: r 0.3s ease-in-out, fill 0.3s ease-in-out;
    }
    @starting-style {
        r: 0;
    }
    .file-visualization {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
    }
    .file-bar {
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 0.8em;
        text-shadow: 1px 1px 2px black;
        border-radius: 4px;
    }
</style>
