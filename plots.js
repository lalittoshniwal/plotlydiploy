function init() {
    var selector = d3.select("#selDataset");
    
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}
  
  init();

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      PANEL.append("h6").text("ID: " + result.id);
      PANEL.append("h6").text("ETHNICITY: " + result.ethnicity);
      PANEL.append("h6").text("GENDER: " + result.gender);
      PANEL.append("h6").text("AGE: " + result.age);
      PANEL.append("h6").text("LOCATION: " + result.location);
      PANEL.append("h6").text("bbtype: " + result.bbtype);
      PANEL.append("h6").text("wfreq: " + result.wfreq);
    });
  }

  // 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
  // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
  // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray1 = samples.filter(sampleObj => sampleObj.id == sample);
  //  5. Create a variable that holds the first sample in the array.
    var result1 = resultArray1[0]
    console.log(result1)
  // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result1.otu_ids;
    var otu_labels = result1.otu_labels;
    var sample_values = result1.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last.

    var otu_ids_topTen = otu_ids.slice(0,10);
    var otu_ids_tickLabels = otu_ids_topTen.map(x => "OTU ID" + x).reverse();
    var otu_labels_topTen = otu_labels.slice(0,10).reverse();
    var sample_values_topTen = sample_values.slice(0,10).reverse();
    var sample_values_descending = sample_values_topTen;

    var bar_data = [{
            type: 'bar',
      x: sample_values_descending,
      y: otu_ids_tickLabels,
      text: otu_labels_topTen,
      orientation: 'h'
    }];

    var layout = {plot_bgcolor:"black", paper_bgcolor:"black", title:{text: "<b>Top Ten Bacteria Culture Found</b>", font:{color:"grey", size:16}}, margin: {t: 40, b: 100 }}
    
    Plotly.newPlot('bar', bar_data, layout);

  // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        colorscale: 'Portland',
        color: otu_ids,
        size: sample_values}
    }];

  // 2. Create the layout for the bubble chart.
    var bubbleLayout = {plot_bgcolor:"black", paper_bgcolor:"black", title:{text: '<b>Bacteria Culture per Sample</b>', font:{color:"grey", size:16}}, xaxis:{title: "OTU ID"}, margin: { t: 100, b: 50 }};

  // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 

  // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      
  // 2. Create a variable that holds the first sample in the metadata array.
      var result = resultArray[0];
  
  // 3. Create a variable that holds the washing frequency.
      var washFreq = parseFloat(result.wfreq);
      console.log(washFreq);
       
  // 4. Create the trace for the gauge chart.
    var gaugeData = [{
		domain: { x: [0, 1], y: [0, 1] },
		value: washFreq,
		title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week", font:{color:"grey", size:16}},
		type: "indicator",
		mode: "gauge+number",
    gauge: {
      axis: { range: [null, 10] },
      bar: { color: "black" },
      steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "orange" },
        { range: [4, 6], color: "yellow" },
        { range: [6, 8], color: "green" },
        { range: [8, 10], color: "darkgreen" }
      ],
      }
	  }];
    
  // 5. Create the layout for the gauge chart.
    var gaugeLayout = {plot_bgcolor:"black", paper_bgcolor:"black", margin: { t: 30, b: 10 }   
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout );
  });

  })
}

  optionChanged(940);