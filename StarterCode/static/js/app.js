function init() {
  d3.json("samples.json").then((bbData) => {
    var names = bbData.names;
    console.log(names);
    names.forEach(element => {
      dropdown.append("option").text(element).property("value", element)
    });
  });
};
var dropdown = d3.select("#selDataset")
// Create event handlers 
dropdown.on("change", optionChanged);
function optionChanged() {
  alert("dropdown value change" + this.value)
}
// 

d3.json("samples.json").then((bbData) => {
  console.log(bbData);
  var data = bbData;

  // Set up default plot
  updatePlots(0)

  // / Updating plots function   
  function updatePlots(select) {
    // Set up arrays for horizontal bar chart & gauge chart
    var sampleOTUs = data.samples[select].otu_ids;
    console.log(sampleOTUs);
    var sampleFreq = data.samples[select].sample_values;
    var otuLabels = data.samples[select].otu_labels;

    var washFreq = data.metadata[+select].wfreq;
    console.log(washFreq);


    // Demographic Data
    var demoKeys = Object.keys(data.metadata[select]);
    var demoValues = Object.values(data.metadata[select])
    var demoData = d3.select('#sample-metadata');

    // clear demographic data
    demoData.html("");
    for (var i = 0; i < demoKeys.length; i++) {
      demoData.append("p").text(`${demoKeys[i]}: ${demoValues[i]}`);
  
  
      // Slice data for bar chart
    var topTenOtu = sampleOTUs.slice(0, 10).reverse();
    var topTenFreq = sampleFreq.slice(0, 10).reverse();
    var topTenLabels = topTenOtu.map((otu => "OTU" + otu));
    var reversedLabels = topTenLabels.reverse();
    // 
    // Set up trace
    var trace1 = {
      x: topTenFreq,
      y: reversedLabels,
      type: "bar",
      orientation: "h"
    };

    data
    var barData = [trace1];

    // Layout
    var layout = {
      title: "Top 10 OTUs",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 50
      }
    };

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", barData, layout);

    // Set up trace
    trace2 = {
      x: sampleOTUs,
      y: sampleFreq,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: sampleOTUs,
        opacity: [1, 0.8, 0.6, 0.4],
        size: sampleFreq
      }
    }
  }

  // data
  var dataBubble = [trace2];

  // Layout
  var layout = {
    title: 'OTU Frequency',
    showlegend: false,
    height: 600,
    width: 600
  }
  // 
  // Render the plot to the div tag with id "bubble-plot"
  Plotly.newPlot("bubble", dataBubble, layout)

  // Gauge chart trace
  var trace3 = [{
    domain: { x: [0, 1], y: [0, 1] },
    value: washFreq,
    title: { text: "Belly Button Washes Per Week" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 7 },
    gauge: {
      axis:  { axis: { range: [null, 100]  } },
      steps: [
        { range: [0, 10], color: "lightblue" },
        { range: [10, 40], color: "grey" }
      ],
      threshold: {
        line: { color: "black", width: 4 },
        thickness: 0.75,
        value: washFreq
      }
    }
  }
  ];
  gaugeData = trace3;
  var layout = { width: 600, height: 400, margin: { t: 0, b: 0 } };
  Plotly.newPlot('gauge', gaugeData, layout);
}});
init();


