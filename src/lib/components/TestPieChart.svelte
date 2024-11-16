<!-- src/lib/components/TestPieChart.svelte -->
<script>
    import PieChart from './PieChart.svelte';
  
    let sampleData = [
      { label: 'JavaScript', value: 30 },
      { label: 'Python', value: 20 },
      { label: 'Svelte', value: 15 },
      { label: 'CSS', value: 10 },
      { label: 'HTML', value: 25 }
    ];
  </script>
  
  <PieChart data={sampleData} width={300} height={300} innerRadius={50} outerRadius={100} />
  