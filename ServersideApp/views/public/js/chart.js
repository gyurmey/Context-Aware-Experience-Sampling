     <script>

  let Charts = document.getElementById('Chart');

  Chart.defaults.global.defaultFontFamily = 'Times';
  Chart.defaults.global.defaultFontSize = 20 ;
  Chart.defaults.global.defaultFontColor = '#3498db';

 let surveyChart = new Chart(Charts, {
    type: 'horizontalBar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
      labels: ['Android Users', 'hmm no like Android', 'Apple users', 'hmm no like Apple', 'others', 'hmm no like Apple n Android',
    ],
      datasets: [{
        label: 'Participants',
        data: [
              5558,
              6246,
              11905,
              8696,
              10787,
              9036,

        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',

        ],
        borderWidth: 1,
        borderColor: '#777',
        hoverBorderWidth: 3,
        hoverBorderColor: '#000'
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Context Aware Sensor surveyChart ',
        fontSize: 25
      },
      legend: {
        display: true,
        position: 'right',
        labels: {
          fontColor: '#000'
        }
      },
      layout: {
        padding: {
          left: 50,
          right: 0,
          bottom: 0,
          top: 0
        }
      },
      tooltips: {
         enabled : 'true'
      }
    }
  });
</script>
