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
  
  // Demographics Panel when dropdown number is selected ID number is passed as sample into this function
  function buildMetadata(sample) {
    //pulls the entire data set contained in samples.json and reads it as data
    d3.json("samples.json").then((data) => {
      //metadata array in teh samples json is set to variable metadata
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      //results of filter method are return as an array - first item in array is assigned to result variable
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
      //skill drill CODE
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    //just puts location
    //var wFreq = PANEL.append("h6").text(result.wFreq)
    });
  }
  
  
  // 1. Create the buildCharts function.
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples= data.samples;
    //console.log(samples);
  
    //test to order samples
    // Sort the array in ascending order using an arrow function
  // and assign the results to a variable and print to the console
    //var sortedSamples = samples.sort((a, b) => a.sample_values - b.sample_values);
    //console.log(sortedSamples);
  
  //numpy sort
  
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(i => i.id == sample);
    //console.log(samplesArray);
  
    //  5. Create a variable that holds the first sample in the array.
    var samplesResult = samplesArray[0];
    //console.log(samplesResult);
  
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = samplesResult.otu_ids;
    //console.log(otu_ids);
    var otu_labels = samplesResult.otu_labels;
    //console.log(otu_labels);
    var sample_values = samplesResult.sample_values;
    //console.log(sample_values);
  
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    // samplesResult.sort((a,b)=> (b.otu_ids)-(a.otu_ids);
    // });
    var yticks = otu_ids.slice(0,10).map(i=>`OTU ${i}`).reverse()
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x:sample_values.slice(0,10).reverse(),
      y:yticks,
      text: otu_labels,
      type: "bar",
      orientation: "h"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title:"Top 10 Bacteria Cultures Found",
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      type: "scatter",
      x:otu_ids,
      y:sample_values,
      text: otu_labels,
      mode:'markers',
      marker:{
        size:sample_values,
        color: otu_ids
      }
    }];
  
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      hoovermode:"closest",
      title: "Bacteria Cultures Per Sample",
 
      xaxis: {title: "OTU ID"},

    };
  
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 
  
  
  // 3. Create a variable that holds the washing frequency.
    var metadata=data.metadata;
    console.log(metadata)
    // Filter the data for the object with the desired sample number
    var metadataArray = metadata.filter(i => i.id == sample);
    //results of filter method are return as an array - first item in array is assigned to result variable
    var metadataResult = metadataArray[0];
    console.log(metadataResult)
  
    var washFreq=parseFloat(metadataResult.wfreq);
    console.log(washFreq);

    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value:washFreq,
      title:{ text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week"}, 
      type:"indicator",
      mode:"gauge+number",
      gauge: {
        axis: {range: [0,10]},
        bar: {color:"black"},
        steps: [
          {range:[0,2],color:"red"},
          {range:[2,4],color:"orange"},
          {range:[4,6],color:"yellow"},
          {range:[6,8],color:"lightgreen"},
          {range:[8,10],color:"green"},
        ],
      }
    }];
  
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width:500,
      height: 425,
      margin: {t:0,b:0},
    };
  
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge',gaugeData, gaugeLayout);
    });
  }