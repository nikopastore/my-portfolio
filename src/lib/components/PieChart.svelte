<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  export let data = [];
  export let width = 400;
  export let height = 400;
  export let innerRadius = 0; // >0 for a donut chart
  export let outerRadius = Math.min(width, height) / 2;
  export let colors = d3.scaleOrdinal(d3.schemeTableau10);

  let svgElement;

  let pieData;
  let arcs;

  $: {
      pieData = d3.sort(data, (d) => d.label);
      arcs = d3.pie()
          .value((d) => d.value)
          .sort(null)(pieData);

      arcs.forEach((arc, i) => {
          arc.data = pieData[i];
      });
  }

  onMount(() => {
      // Initialization logic if needed
  });
</script>

<svg bind:this={svgElement} width={width} height={height}>
  {#each arcs as arc}
      <path
          d={d3.arc()
              .innerRadius(innerRadius)
              .outerRadius(outerRadius)(arc)}
          fill={colors(arc.data.label)}
          transition:scale
      />
  {/each}
</svg>
