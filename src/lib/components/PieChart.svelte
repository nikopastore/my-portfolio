<!-- src/lib/components/PieChart.svelte -->
<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import * as d3 from 'd3';

  export let data = []; // Array of objects with 'label' and 'value'
  export let width = 300;
  export let height = 300;
  export let innerRadius = 0; // Filled in the center
  export let outerRadius = Math.min(width, height) / 2;
  export let selectedLabel = null; // Selected slice label

  const dispatch = createEventDispatcher();

  let svgElement;
  let tooltip;

  // Miami Vice Pink color code
  const miamiVicePink = '#ff6ec7';

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

    // Create SVG for Pie Chart
    const svg = d3.select(svgElement)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
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

    // Add Pie Slices
    arcs.append('path')
      .attr('fill', d => d.data.label === selectedLabel ? miamiVicePink : color(d.data.label))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .attr('tabindex', '0') // Make focusable for accessibility
      .each(function(d) { this._current = d; }) // Store the initial angles
      .on('mouseover', (event, d) => {
        tooltip.style('display', 'block')
          .html(`<strong>${d.data.label}</strong>: ${d.data.value}`);
        
        // Dim other slices except the one being hovered over
        arcs.selectAll('path')
          .transition()
          .duration(200)
          .style('opacity', path => path.data.label === d.data.label ? 1 : 0.5);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 25) + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');

        // Restore slice opacity to normal
        arcs.selectAll('path')
          .transition()
          .duration(200)
          .style('opacity', 1);
      })
      .on('click', (event, d) => {
        // Set selectedLabel to the clicked wedge's label or deselect if clicked again
        selectedLabel = selectedLabel === d.data.label ? null : d.data.label;

        // Emit 'sliceClick' event with the selected label
        dispatch('sliceClick', selectedLabel);

        // Update slice colors to reflect selection
        arcs.selectAll('path')
          .transition()
          .duration(300)
          .attr('fill', path => path.data.label === selectedLabel ? miamiVicePink : color(path.data.label));
      })
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(1);
        return function(t) {
          return arc(interpolate(t));
        };
      });
  });

  onDestroy(() => {
    if (tooltip) {
      tooltip.remove();
    }
  });
</script>

<svg bind:this={svgElement} class="w-full h-auto" aria-labelledby="pieChartTitle pieChartDesc" role="img">
  <title id="pieChartTitle">Pie Chart</title>
  <desc id="pieChartDesc">Distribution of Projects by Year</desc>
</svg>

<style>
  svg {
    max-width: 100%;
    height: auto;
  }

  .arc text {
    pointer-events: none;
  }

  path {
    transition: 300ms;
    outline: none;
  }

  .tooltip {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .tooltip:hover {
    opacity: 1;
  }

  /* Optional: Focus Styles for Accessibility */
  .arc path:focus {
    outline: none;
    stroke: #000;
    stroke-width: 3px;
  }
</style>
