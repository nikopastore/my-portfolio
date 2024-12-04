<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  export let data = [];
  export let width = 400;
  export let height = 400;
  export let innerRadius = 0; // >0 for a donut chart
  export let outerRadius = Math.min(width, height) / 2;
  export let colors = d3.scaleOrdinal(d3.schemeTableau10); // Consistent color scheme

  let svgElement;

  let pieData;
  let arcs;

  $: {
      // Sort data by label for consistent ordering
      pieData = d3.sort(data, (d) => d.label);
      arcs = d3.pie()
          .value((d) => d.value)
          .sort(null)(pieData);

      // Attach each data point to its corresponding arc
      arcs.forEach((arc, i) => {
          arc.data = pieData[i];
      });
  }

  onMount(() => {
      // Placeholder for future logic (if needed)
  });
</script>

<svg bind:this={svgElement} width={width} height={height}>
  {#each arcs as arc (arc.data.label)} <!-- Keyed each block for stable rendering -->
      <path
          d={d3.arc()
              .innerRadius(innerRadius)
              .outerRadius(outerRadius)(arc)}
          fill={colors(arc.data.label)}
          style="transition: all 0.3s ease;"
      />
  {/each}
</svg>

<style>
  /* Add transitions for smooth rendering */
  path {
      transition: fill 0.3s, d 0.3s;
  }

  path:hover {
      opacity: 0.8; /* Slight highlight on hover */
  }
</style>
