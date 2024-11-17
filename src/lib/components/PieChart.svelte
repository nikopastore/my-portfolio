<!-- src/lib/components/PieChart.svelte -->
<script>
  import { onMount, onDestroy } from 'svelte';
  import * as d3 from 'd3';

  export let data = [];
  export let width = 300;
  export let height = 300;
  export let innerRadius = 50;
  export let outerRadius = Math.min(width, height) / 2;

  let svgElement;
  let legendElement;
  let tooltip;

  onMount(() => {
    if (data.length === 0) {
      console.warn('PieChart: No data provided');
      return;
    }

    // Create Tooltip Element
    tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('background', 'rgba(0, 0, 0, 0.7)')
      .style('color', '#fff')
      .style('padding', '5px 10px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('display', 'none');

    // Clear existing content
    d3.select(svgElement).selectAll('*').remove();
    d3.select(legendElement).selectAll('*').remove();

    // Create SVG for Pie Chart
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
      .on('mouseover', (event, d) => {
        tooltip.style('display', 'block')
          .html(`<strong>${d.data.label}</strong>: ${d.data.value}`);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 25) + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
      });

    // Add labels
    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#fff')
      .text(d => d.data.label);

    // Create Legend
    const legend = d3.select(legendElement)
      .attr('transform', `translate(10, 10)`);

    const legendItem = legend.selectAll('.legend-item')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legendItem.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', color)
      .attr('stroke', 'white')
      .attr('stroke-width', '1px');

    legendItem.append('text')
      .attr('x', 24)
      .attr('y', 14)
      .text(d => d);
  });

  onDestroy(() => {
    if (tooltip) {
      tooltip.remove();
    }
  });
  let selectedLabel = null;

onMount(() => {
  // ... existing D3.js setup

  arcs.selectAll('path')
    .on('click', (event, d) => {
      selectedLabel = d.data.label;
      // Add logic to highlight or filter based on selection
      console.log(`Clicked on: ${d.data.label}`);
    });
});
</script>

<svg bind:this={svgElement} class="w-full h-auto" aria-label="Pie Chart"></svg>
<svg bind:this={legendElement} class="w-full h-auto" aria-label="Pie Chart Legend"></svg>

<style>
  svg {
    max-width: 100%;
    height: auto;
  }

  .arc text {
    pointer-events: none;
    font-size: 10px; /* Adjust font size for smaller screens */
  }

  .legend-item text {
    font-size: 12px;
    fill: #333;
  }

  @media (max-width: 600px) {
    svg {
      width: 100%;
      height: 200px; /* Adjust height for mobile devices */
    }

    .legend-item text {
      font-size: 10px;
    }
  }

  .tooltip {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .tooltip:hover {
    opacity: 1;
  }
  .highlighted {
    stroke: #000;
    stroke-width: 3px;
  }
</style>