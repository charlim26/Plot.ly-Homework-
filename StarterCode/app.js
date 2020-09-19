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
  // alert("dropdown value change" + this.value)
}
// 

d3.json("samples.json").then((bbData) => {
  console.log(bbData);
  var data = bbData;

  // Set up default plot
  updatePlots(0)

  // / Updating plots function   
  function updatePlots(index) {
    // Set up arrays for horizontal bar chart & gauge chart
    var sampleOTUs = data.samples[index].otu_ids;
    console.log(sampleOTUs);
    var sampleFreq = data.samples[index].sample_values;
    var otuLabels = data.samples[index].otu_labels;

    var washFreq = data.metadata[+index].wfreq;
    console.log(washFreq);


    // Demographic Data
    var demoKeys = Object.keys(data.metadata[index]);
    var demoValues = Object.values(data.metadata[index])
    var demoData = d3.select('#sample-metadata');

    // clear demographic data
    demoData.html("");

    for (var i = 0; i < demoKeys.length; i++) {

      demoData.append("p").text(`${demoKeys[i]}: ${demoValues[i]}`);
    };

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
        size: sampleFreq
      }
    }
  }

  // data
  var bubbleData = [trace2];

  // Layout
  var layout = {
    title: 'OTU Frequency',
    height: 600,
    width: 800
  }
  // 
  // Render the plot to the div tag with id "bubble-plot"
  Plotly.newPlot("bubble", bubbleData, layout)

  // Gauge chart trace
  var trace3 = [{
    domain: { x: [0, 1], y: [0, 1] },
    value: washFreq,
    title: { text: "Belly Button Washes Per Week" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 400 },
    gauge: {
      axis: { range: [null, 500] },
      steps: [
        { range: [0, 250], color: "green" },
        { range: [250, 400], color: "grey" }
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: washFreq
      }
    }
  }
  ];
  gaugeData = trace3;
  var layout = { width: 600, height: 400, margin: { t: 0, b: 0 } };
  Plotly.newPlot('gauge', gaugeData, layout);
});
init();


