
function buildSelector(){
    d3.json("samples.json").then( (data) => {
        let dropdown = d3.select("#selectOption")
        // iterate through the names and append them as an option to select
        // in the drop down menu
        data.names.forEach(id => { 
            let option = dropdown.append("option");
            option.text(id).property("value");   
        });
        getMetaData(data.names[0]) 

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


function updatePage(userid) {
    console.log("New userid selected: " + userid);
    getMetaData(userid);  }

d3.selectAll("#selectOption").on("change", updatePage);

buildSelector()

