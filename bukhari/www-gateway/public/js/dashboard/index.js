function lineChart(dataSets) {
  const { resolved, open } = dataSets;

  const resolvedArr = [];
  Object.values(resolved).sort((function(a, b) {
    let keyA = new Date(a._id.month), keyB = new Date(b._id.month);
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  })).forEach(x => resolvedArr.push(x.count));

  const openArr = [];
  Object.values(open).sort((function(a, b) {
    let keyA = new Date(a._id.month), keyB = new Date(b._id.month);
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  })).forEach(x => openArr.push(x.count));

  return {
    type: 'line',
    data: {
      labels: ['Հուն․', 'Փետր․', 'Մարտ', 'Ապր․', 'Մայ․', 'Հուն․', 'Հուլ․', 'Օգ․', 'Սեպտ․', 'Հոկտ․', 'Նոյ․', 'Դեկտ․'],
      datasets: [
        {
          label: 'Հանգուցալուծված',
          backgroundColor: '#dc2626',
          borderColor: '#dc2626',
          fill: false,
          data: openArr,
        },
        {
          label: 'Ընթացքի մեջ',
          fill: false,
          backgroundColor: '#10b981',
          borderColor: '#10b981',
          data: resolvedArr,
        },
      ],
    },
    options: {
      responsive: true,
      legend: {
        display: false,
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true,
      },
      scales: {
        x: {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Month',
          },
        },
        y: {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Value',
          },
        },
      },
    },
  };
}

function pieChart(pieDataset) {
  return {
    type: 'doughnut',
    data: {
      datasets: [
        {
          data: pieDataset, //[33, 33, 33],
          backgroundColor: ['#dc2626', '#1c64f2', '#10b981'],
          label: 'Dataset 1',
        },
      ],
      labels: ['Հանգուցալուծված հայտեր', 'Ընթացքի մեջ', 'Իմ հայտերը'],
    },
    options: {
      responsive: true,
      cutoutPercentage: 80,
      legend: {
        display: false,
      },
    },
  };
}

$(function() {

  const pieDataset = JSON.parse($('#pieDataset').text());
  const lineDataset = JSON.parse($('#lineDataset').text());

  const pieConfig = pieChart(pieDataset);
  const lineConfig = lineChart(lineDataset);

  // change this to the id of your chart element in HMTL
  const lineCtx = document.getElementById('line');
  window.myLine = new Chart(lineCtx, lineConfig);

  // change this to the id of your chart element in HMTL
  const pieCtx = document.getElementById('pie');
  window.myPie = new Chart(pieCtx, pieConfig);
});