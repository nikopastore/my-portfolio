<!-- src/lib/components/PieChart.svelte -->
<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import * as d3 from 'd3';

  export let data = []; // Array of objects with 'label' and 'value'
  export let width = 400;
  export let height = 400;
  export let innerRadius = 50;
  export let outerRadius = 150;
  export let selectedLabel = null; // Currently selected slice label
  export let description = ''; // Description or title for the pie chart

  const dispatch = createEventDispatcher();

  let svgElement;

  // Define a color scale
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // State to track hovered slice
  let hoveredLabel = null;

  onMount(() => {
    renderChart();
    window.addEventListener('resize', renderChart);
  });

  onDestroy(() => {
    window.removeEventListener('resize', renderChart);
  });

  function renderChart() {
    // Clear any existing SVG content
    d3.select(svgElement).selectAll('*').remove();

    const svg = d3
      .select(svgElement)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('cursor', 'pointer');

    const radius = Math.min(width, height) / 2;
    const pie = d3.pie().sort(null).value(d => d.value);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const arcs = g
      .selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label))
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .attr('data-label', d => d.data.label)
      .on('click', (event, d) => {
        const label = d.data.label;
        dispatch('sliceClick', label);
      })
      .on('mouseover', (event, d) => {
        hoveredLabel = d.data.label;
        renderChart(); // Re-render to apply hover effects
      })
      .on('mouseout', (event, d) => {
        hoveredLabel = null;
        renderChart(); // Re-render to remove hover effects
      });

    // Optional: Add labels to slices (uncomment if needed)
    /*
    arcs
      .append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', 'white')
      .text(d => d.data.label);
    */

    // Apply styles based on selection and hover state
    applyStyles();

    // Add Legend and Description
    addLegendAndDescription(g);
  }

  function applyStyles() {
    const svg = d3.select(svgElement);
    const paths = svg.selectAll('path');

    paths
      .attr('fill', d => {
        const isSelected = d.data.label === selectedLabel;
        const isHovered = d.data.label === hoveredLabel;
        if (isSelected) {
          return '#ff7f0e'; // Universal "selected" color (e.g., orange)
        } else if (isHovered) {
          return color(d.data.label).brighter(0.5);
        } else {
          return color(d.data.label);
        }
      })
      .attr('opacity', d => {
        if (hoveredLabel) {
          return d.data.label === hoveredLabel ? 1 : 0.5;
        }
        return 1;
      });
  }

  function addLegendAndDescription(g) {
    // Legend Positioning
    const legendRectSize = 18;
    const legendSpacing = 4;

    // Create a group for the legend
    const legendGroup = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${outerRadius + 20}, ${-outerRadius})`); // Adjust as needed

    // Add legend items
    const legend = legendGroup.selectAll('.legend-item')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * (legendRectSize + legendSpacing)})`);

    // Add colored rectangles
    legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', d => color(d.label))
      .style('stroke', d => color(d.label));

    // Add labels
    legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(d => d.label)
      .attr('font-size', '12px')
      .attr('fill', '#333');

    // Add Description Box (optional)
    if (description) {
      g.append('text')
        .attr('x', -width / 2 + 20) // Adjust positioning
        .attr('y', -outerRadius - 30) // Adjust positioning
        .attr('text-anchor', 'start')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .attr('fill', '#333')
        .text(description);
    }
  }
</script>

<svg bind:this={svgElement}></svg>

<style>
  /* Smooth transitions for fill and opacity */
  path {
    transition: fill 0.3s ease, opacity 0.3s ease;
  }

  /* Legend text styling */
  .legend text {
    font-size: 12px;
    fill: #333;
  }

  /* Description styling */
  .description {
    font-size: 16px;
    font-weight: bold;
    fill: #333;
  }

  /* Optional: Adjust legend item hover effects */
  .legend-item:hover text {
    fill: #000;
  }
</style>
