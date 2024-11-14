<!-- src/lib/PieChart.svelte -->
<script>
    import { onMount, onDestroy } from 'svelte';
    import * as d3 from 'd3';
    export let data = []; // Array of objects with 'label' and 'value' properties
    export let width = 400;
    export let height = 400;
    export let innerRadius = 0; // For pie chart. Use >0 for a donut chart
    export let outerRadius = Math.min(width, height) / 2;
  
    let svgElement;
  
    onMount(() => {
      // Create the SVG container
      const svg = d3
        .select(svgElement)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);
  
      // Define the color scale
      const color = d3.scaleOrdinal(d3.schemeCategory10);
  
      // Define the pie generator
      const pie = d3
        .pie()
        .sort(null)
        .value(d => d.value);
  
      // Define the arc generator
      const arc = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
  
      // Generate the arcs
      const arcs = svg.selectAll('arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class', 'arc');
  
      // Draw the slices
      arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.label))
        .on('mouseover', function(event, d) {
          d3.select(this).transition().duration(200).attr('opacity', 0.7);
        })
        .on('mouseout', function(event, d) {
          d3.select(this).transition().duration(200).attr('opacity', 1);
        });
  
      // Add labels
      arcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .attr('font-size', '0.8em')
        .attr('fill', '#fff')
        .text(d => d.data.label);
    });
  
    onDestroy(() => {
      // Clean up if necessary
    });
  </script>
  
  <!-- SVG Element -->
  <svg bind:this={svgElement}></svg>
  
  <style>
    /* Optional: Add styles for tooltip or other elements */
    svg {
      font-family: Arial, sans-serif;
    }
  
    .arc path {
      cursor: pointer;
    }
  
    .arc text {
      pointer-events: none;
    }
  </style>
  