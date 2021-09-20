function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    var sampleData = data.samples;
    var filteredSampleData = sampleData.filter(num => num.id == sample);
    var firstData = filteredSampleData[0];
    var sample_otuIDs = firstData.otu_ids;
    var sample_values = firstData.sample_values;
    var sample_labels = firstData.otu_labels;

    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var firstData = resultArray[0];
    wfreq = firstData.wfreq;

    var yticks = sample_otuIDs.map(id => `OTU ${id}`).slice(0,10).reverse();

    var barData = [{
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      text: sample_labels.slice(0,10).reverse(),
      type: 'bar',
      orientation: 'h',
      marker: {
        color: sample_otuIDs,
        colorscale: 'Picnic'
      }
    }];
    
    var barLayout = {
     title: {
      text:'Top ten Bacteria Cultures Found', 
      font: {size: 22}
    },
     xaxis: {title: ""},
     yaxis: {title: "OTU IDs"},
     paper_bgcolor: 'rgb(186, 197, 211)',
     font: {family: "Times New Roman"},
     showlegend: false
    };
    
    Plotly.newPlot("bar", barData, barLayout);

    var bubbleData = [{
      x: sample_otuIDs,
      y: sample_values,
      text: sample_labels,
      mode: 'markers',
      marker: {
        color: sample_otuIDs,
        size: sample_values,
        colorscale: 'Picnic'
      }
    }];

    var bubbleLayout = {
      title: {
        text:'Bacteria Cultures Per Sample', 
        font: {size: 26}
      },
      xaxis: {title: "OTU IDs"},
      yaxis: {title: ""},
      paper_bgcolor: 'rgb(186, 197, 211)',
      font: {family: "Times New Roman"} ,
      showlegend: false
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    var gaugeData = [{
      domain: {
        x: [0,1],
        y: [0,1]
      },
      value: wfreq,
      title: {
        text: "Belly Button Washing Frequency", 
        font: {size: 22},
      },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10]},
        steps: [
          {range: [0,2], color:"red"},
          {range: [2,4], color:"orange"},
          {range: [4,6], color:"yellow"},
          {range: [6,8], color:"greenyellow"},
          {range: [8,10], color:"green"}
        ],
        threshold: {
          line: {color: "green", width: 4},
          thickness: 0.75,
          value: 7
        },
        bar: {color:"black"}
    }
    }];

    var gaugeLayout = {
      width: 550,
      height: 500,
      paper_bgcolor: 'rgb(186, 197, 211)',
      font: {family: "Times New Roman"} 
    };

    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}
