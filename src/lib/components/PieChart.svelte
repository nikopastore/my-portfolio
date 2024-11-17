<!-- src/lib/components/PieChart.svelte -->
<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import * as d3 from 'd3';

  export let data = []; // Array of objects with 'label' and 'value'
  export let width = 300;
  export let height = 300;
  export let innerRadius = 50; // >0 for a donut chart
  export let outerRadius = Math.min(width, height) / 2;

  const dispatch = createEventDispatcher();

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

    // Animate Pie Slices
    arcs.append('path')
      .attr('fill', d => color(d.data.label))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .each(function(d) { this._current = { startAngle: 0, endAngle: 0 }; }) // Initial state for animation
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(1);
        return function(t) {
          return arc(interpolate(t));
        };
      })
      .on('end', function(d) {
        d3.select(this)
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
          })
          .on('click', (event, d) => {
            console.log('Slice clicked:', d.data.label); // Debugging
            dispatch('sliceClick', d.data.label); // Emit 'sliceClick' event with the label
          });
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
</script>

<svg bind:this={svgElement} class="w-full h-auto" aria-labelledby="pieChartTitle pieChartDesc"></svg>
<svg bind:this={legendElement} class="w-full h-auto" aria-labelledby="legendTitle legendDesc"></svg>

<style>
  svg {
    max-width: 100%;
    height: auto;
  }

  .arc text {
    pointer-events: none;
  }

  .legend-item rect {
    stroke: #fff;
    stroke-width: 1px;
  }

  .tooltip {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .tooltip:hover {
    opacity: 1;
  }
</style>
