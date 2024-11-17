<!-- src/lib/components/PieChart.svelte -->
<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import * as d3 from 'd3';

  export let data = []; // Array of objects with 'label' and 'value'
  export let width = 300;
  export let height = 300;
  export let innerRadius = 0; // Set to 0 for filled center (pie chart)
  export let outerRadius = Math.min(width, height) / 2;
  export let selectedLabel = null; // Selected slice label

  const dispatch = createEventDispatcher();

  let svgElement;
  let tooltip;

  function getColor(label) {
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    return color(label);
  }

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

    // Draw Pie Slices
    arcs.append('path')
      .attr('fill', d => {
        if (d.data.label === selectedLabel) {
          return '#ff85b3'; // Miami Vice pink color for selected wedge
        }
        return getColor(d.data.label);
      })
      .attr('d', arc)
      .style('transition', '300ms') // Transition effect
      .on('mouseover', (event, d) => {
        // Highlight hovered wedge and dim others
        arcs.selectAll('path')
          .transition().duration(300)
          .style('opacity', dd => (dd === d ? 1 : 0.3));

        tooltip.style('display', 'block')
          .html(`<strong>${d.data.label}</strong>: ${d.data.value}`);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 25) + 'px');
      })
      .on('mouseout', () => {
        // Reset opacity of all wedges
        arcs.selectAll('path')
          .transition().duration(300)
          .style('opacity', 1);

        tooltip.style('display', 'none');
      })
      .on('click', (event, d) => {
        dispatch('sliceClick', d.data.label); // Emit 'sliceClick' event with the label
      });

    // Add transition for wedges on selection change
    $: {
      arcs.selectAll('path')
        .transition().duration(300)
        .attr('fill', d => {
          if (d.data.label === selectedLabel) {
            return '#ff85b3'; // Miami Vice pink color for selected wedge
          }
          return getColor(d.data.label);
        });
    }
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

  .arc path {
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

  /* Accessibility focus styles */
  .arc path:focus {
    outline: none;
    stroke: #000;
    stroke-width: 3px;
  }
</style>
