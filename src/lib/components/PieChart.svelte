<!-- src/lib/components/PieChart.svelte -->
<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import * as d3 from 'd3';

  export let data = []; // Array of objects with 'label' and 'value'
  export let width = 300;
  export let height = 300;
  export let innerRadius = 50; // >0 for a donut chart
  export let outerRadius = Math.min(width, height) / 2;
  export let selectedLabel = null; // Selected slice label

  const dispatch = createEventDispatcher();

  let svgElement;
  let legendElement;
  let tooltip;

  // Define a universal selected color
  const selectedColor = '#ff6347'; // You can change this to any color you prefer

  // Internal state to track hovered slice
  let hoveredLabel = null;

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
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Define color scale with domain based on data labels
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.label)) // Ensure all labels are included
      .range(d3.schemeCategory10);

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
      .attr('fill', d => getFillColor(d.data.label))
      .attr('stroke', 'none') // Remove stroke to eliminate the box
      .attr('stroke-width', '0px') // Remove stroke width
      .attr('tabindex', '0') // Make focusable for accessibility
      .on('keydown', (event, d) => {
        if (event.key === 'Enter' || event.key === ' ') {
          dispatch('sliceClick', d.data.label);
        }
      })
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
            hoveredLabel = d.data.label;
            updateSliceColors();
            // Show tooltip
            tooltip.style('display', 'block')
              .html(`<strong>${d.data.label}</strong>: ${d.data.value}`);
          })
          .on('mousemove', (event) => {
            tooltip
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY - 25) + 'px');
          })
          .on('mouseout', (event, d) => {
            hoveredLabel = null;
            updateSliceColors();
            // Hide tooltip
            tooltip.style('display', 'none');
          })
          .on('click', (event, d) => {
            dispatch('sliceClick', d.data.label); // Emit 'sliceClick' event with the label
          });
      });

    // Remove text labels inside the pie chart
    // (This section is intentionally omitted to ensure no labels appear inside the pie slices)

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

  // Function to determine fill color based on selection and hover
  function getFillColor(label) {
    if (label === selectedLabel) {
      return selectedColor;
    } else if (label === hoveredLabel) {
      return d3.rgb(colorScale(label)).brighter(0.7).toString();
    } else {
      return colorScale(label);
    }
  }

  // Define colorScale for internal use
  const colorScale = d3.scaleOrdinal()
    .range(d3.schemeCategory10);

  // Watch for data changes to update colorScale domain
  $: colorScale.domain(data.map(d => d.label));

  // Reactive statement to update slice colors based on selection and hover
  $: updateSliceColors();

  function updateSliceColors() {
    d3.select(svgElement).selectAll('.arc path')
      .attr('fill', d => getFillColor(d.data.label))
      .attr('opacity', d => {
        if (hoveredLabel) {
          if (d.data.label === hoveredLabel || d.data.label === selectedLabel) {
            return 1;
          } else {
            return 0.3;
          }
        } else {
          return 1;
        }
      });
  }
</script>

<!-- Pie Chart SVG -->
<svg bind:this={svgElement} class="w-full h-auto" aria-labelledby="pieChartTitle pieChartDesc" role="img"></svg>

<!-- Legend SVG -->
<svg bind:this={legendElement} class="w-full h-auto" aria-labelledby="legendTitle legendDesc"></svg>

<style>
  /* Add the following CSS rules to remove the outline and add smooth transitions */

  path {
    transition: fill 0.3s, opacity 0.3s;
    outline: none;
  }

  path:focus {
    outline: none;
  }

  .legend-item rect {
    stroke: #fff;
    stroke-width: 1px;
  }

  .tooltip {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  /* Optional: Focus Styles for Accessibility */
  .arc path:focus {
    outline: none;
    /* You can add alternative focus styles if desired */
  }
</style>
