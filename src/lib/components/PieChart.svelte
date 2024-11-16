<!-- src/lib/components/PieChart.svelte -->
<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  export let data = []; // Array of objects with 'label' and 'value'
  export let width = 300;
  export let height = 300;
  export let innerRadius = 50; // >0 for a donut chart
  export let outerRadius = Math.min(width, height) / 2;

  let svgElement;

  onMount(() => {
    if (data.length === 0) {
      console.warn('PieChart: No data provided');
      return;
    }

    // Clear any existing content
    d3.select(svgElement).selectAll('*').remove();

    const svg = d3.select(svgElement)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie()
      .sort(null)
      .value(d => d.value);

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const arcs = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label))
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    // Add labels
    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#fff')
      .text(d => d.data.label);
  });
</script>

<svg bind:this={svgElement} class="w-full h-auto" aria-label="Pie Chart"></svg>

<style>
  svg {
    max-width: 100%;
    height: auto;
  }

  .arc text {
    pointer-events: none;
  }
</style>
