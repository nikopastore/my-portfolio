<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { fly } from 'svelte/transition';

  export let data = []; // Array of objects with 'label' and 'value'
  export let width = 300;
  export let height = 300;
  export let innerRadius = 50; // >0 for a donut chart
  export let outerRadius = Math.min(width, height) / 2;

  let svgElement;
  let tooltip = null;

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
      .style('stroke-width', '2px')
      .on('mouseenter', (event, d) => {
        const [x, y] = arc.centroid(d);
        tooltip.style.left = `${x + width / 2 + 10}px`;
        tooltip.style.top = `${y + height / 2 + 10}px`;
        tooltip.innerHTML = `<strong>${d.data.label}</strong>: ${d.data.value}`;
        tooltip.style.display = 'block';
      })
      .on('mouseleave', () => {
        tooltip.style.display = 'none';
      });

    // Add labels
    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#fff')
      .text(d => d.data.label);

    // Create Tooltip Element
    tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.background = 'rgba(0, 0, 0, 0.7)';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.display = 'none';
    tooltip.style.transform = 'translate(-50%, -100%)';
    document.body.appendChild(tooltip);
  });

  // Cleanup Tooltip on Component Unmount
  onDestroy(() => {
    if (tooltip) {
      document.body.removeChild(tooltip);
    }
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
