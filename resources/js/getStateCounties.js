function getStateCounties(fip,select)
{
    var url = "data/load/getStateCounties.php?fip="+fip;
    var name = "State "+fip+" Counties"
    if(select){
    url = "data/load/getStateCounties.php?fip="+fip+"&nodata=1";
    name = 'Select'
    }
    if(fip == 36)
    {
    url = "data/states/"+fip+"/county-sf1.json";
    }
    
    var stateCounties = new OpenLayers.Layer.Vector(name, {
    eventListeners:{
        'featureselected':function(evt){
            var feature = evt.feature;
            document.getElementById("data").innerHTML = "<div >County: " + feature.attributes.NAME+" "+feature.attributes.LSAD +" <br>Geo ID: " + feature.attributes.GEO_ID+" <br>Pop: " + addCommas(feature.attributes.P0010001)+"</div>";
        },
        'featureunselected':function(evt){
            var feature = evt.feature;
         }   
        }, 
    strategies: [new OpenLayers.Strategy.Fixed()],                
    protocol: new OpenLayers.Protocol.HTTP({
    url: url,
    format: new OpenLayers.Format.GeoJSON()
    })
	});
	
    return stateCounties;
}