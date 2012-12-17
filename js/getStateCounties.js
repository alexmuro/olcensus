function getStateCounties(fip)
{

	var stateCounties = new OpenLayers.Layer.Vector("State "+fip+"Counties", {
    eventListeners:{
        'featureselected':function(evt){
            var feature = evt.feature;
            document.getElementById("data").innerHTML = "<div >County: " + feature.attributes.NAME+" "+feature.attributes.LSAD +" <br>Geo ID: " + feature.attributes.GEO_ID+" <br>Pop: " + addCommas(feature.attributes.CDATA)+"</div>";
        },
        'featureunselected':function(evt){
            var feature = evt.feature;
         }   
        }, 
    strategies: [new OpenLayers.Strategy.Fixed()],                
    protocol: new OpenLayers.Protocol.HTTP({
    url: "data/load/getStateCounties.php?fip="+fip,
    format: new OpenLayers.Format.GeoJSON()
    })
	});
	return stateCounties;
}