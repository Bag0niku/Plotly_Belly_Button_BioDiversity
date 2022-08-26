
function buildSelector(){
    d3.json("samples.json").then( (data) => {
        let dropdown = d3.select("#selectOption")
        // iterate through the names and append them as an option to select
        // in the drop down menu
        data.names.forEach(id => { 
            let option = dropdown.append("option");
            option.text(id).property("value");   
        });
        getMetaData(data.names[0]);
        buildCharts(data.names[0]) 

    } );
}


function getMetaData(userid) {
    d3.json("samples.json").then( (data) => {
        // retrieve the metadata associated with the userid
        let metadata = data.metadata;
        let filteredData = metadata.filter(sampleObject => sampleObject.id == userid);
        let userArray = filteredData[0];
        
        // place the metadata on the html page in the metadata section
        let div = d3.select("#sample-metadata");
        div.html("");
        console.log(userArray)
        Object.entries(userArray).forEach(([key,value]) => {
            key = key.toUpperCase()
            let h6 = div.append("h6");
            h6.text(key + " :   " + value);

        } );
    } );
}

function buildCharts(userid) {
    d3.json("samples.json").then((data)=>{
        console.log(data)
        let samples = data.samples;
        let testSubject = samples.filter(subject => subject.id == userid)[0];
        let otu_ids = testSubject.otu_ids;
        let otu_labels = testSubject.otu_labels;
        let sample_values = testSubject.sample_values;
        let person = data.metadata.filter(subject => subject.id == userid)[0];
        
        // Build Wash Frequency Gauge
        let trace3 = [{
            value: person.wfreq,
            title: { text: "Washing Frequency"},
            type: "indicator",
            mode: "gauge+number",
            gauge:{ axis: { range: [0,11] } }
        }]
        let gaugeLayout = {
            width: 600,
            height:400
        }
        Plotly.newPlot('gauge', trace3, gaugeLayout);
        
        //Build the Bubble Graph
        let bubbleGraph = [{x: otu_ids, y: sample_values, marker :{color:otu_ids, size:sample_values}, mode: "markers"}]; 
        let bubbleLayout = {title: "Bacteria Cultures Per Sample", xaxis:{title:"OTU ID"}};
        Plotly.newPlot("bubble", bubbleGraph, bubbleLayout)
        
        //Build the Bar Graph
        let barOtu_ids = otu_ids.slice(0,10).map((d)=> "OTU " + d.toString()).reverse();
        let barSample_values = sample_values.slice(0,10).reverse();
        let barOtu_labels = otu_labels.slice(0,10).reverse()
        let barGraph = [{x: barSample_values, y: barOtu_ids, type: "bar", orientation:"h", text: barOtu_labels}]; 
        let barLayout = {title: "Top 10 Cultures found"};
        Plotly.newPlot("bar", barGraph, barLayout);
    });
}

function updatePage(userid) {
    console.log("New userid selected: " + userid);
    getMetaData(userid);  
    buildCharts(userid);
}

buildSelector()

