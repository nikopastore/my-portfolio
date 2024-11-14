<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    export let data = [];
    export let width = 400;
    export let height = 400;
    export let innerRadius = 0;
    export let outerRadius = Math.min(width, height) / 2;
  
    let svgElement;
  
    onMount(() => {
      // Clear any existing content
      d3.select(svgElement).selectAll('*').remove();
  
      // Create the SVG container with viewBox for responsiveness
      const svg = d3
        .select(svgElement)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);
  
      const color = d3.scaleOrdinal(d3.schemeCategory10);
  
      const pie = d3
        .pie()
        .sort(null)
        .value(d => d.value);
  
      const arc = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
  
      const arcs = svg.selectAll('arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class', 'arc');
  
      // Tooltip setup
      const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('background', '#fff')
        .style('padding', '5px 10px')
        .style('border', '1px solid #ccc')
        .style('border-radius', '4px')
        .style('pointer-events', 'none')
        .style('opacity', 0);
  
      arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.label))
        .on('mouseover', function(event, d) {
          d3.select(this).transition().duration(200).attr('opacity', 0.7);
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip.html(`<strong>${d.data.label}</strong>: ${d.data.value}`)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
        })
        .on('mousemove', function(event, d) {
          tooltip
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function(event, d) {
          d3.select(this).transition().duration(200).attr('opacity', 1);
          tooltip.transition().duration(500).style('opacity', 0);
        });
  
      arcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .attr('font-size', '0.8em')
        .attr('fill', '#fff')
        .text(d => d.data.label);
    });
  </script>
  
  <svg bind:this={svgElement} class="w-full h-auto"></svg>
  
  <style>
    svg {
      max-width: 100%;
      height: auto;
    }
  
    .arc path {
      cursor: pointer;
    }
  
    .arc text {
      pointer-events: none;
    }
  
    /* Tooltip Styles */
    .tooltip {
      font-size: 0.8em;
      background: rgba(255, 255, 255, 0.8);
      box-shadow: 0 0 5px rgba(0,0,0,0.3);
      transition: opacity 0.3s ease;
    }
  </style>
  