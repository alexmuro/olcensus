function loadCensusLayers()
{

var cdata = 'P0010001';
//map.fractionalZoom = true;

counties= new OpenLayers.Layer.Vector("US Counties", {
    eventListeners:{
        'featureselected':function(evt){
            var feature = evt.feature;
            document.getElementById("countydata").innerHTML = "<div >County: " + feature.attributes.NAME+" "+feature.attributes.LSAD +" <br>Geo ID: " + feature.attributes.GEO_ID+" <br>Pop: " + addCommas(feature.attributes[cdata])+"</div>";
        },
        'featureunselected':function(evt){
            var feature = evt.feature;
         }   
        } ,
        strategies: [new OpenLayers.Strategy.Fixed()],                
        protocol: new OpenLayers.Protocol.HTTP({
            url: "data/county-sf1",
            format: new OpenLayers.Format.GeoJSON()
        }),
        styleMap: getStyle(cdata,0)
});
    


states = new OpenLayers.Layer.Vector("States", {
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
    url: "data/gz_2010_us_040_00_20m.json",
    format: new OpenLayers.Format.GeoJSON()
    })
    ,styleMap: getDefaultStyle()
});



var statedblclick = new DblclickFeature(states, {
  dblclick: function (event) { 

    map.zoomToExtent(event.geometry.bounds);
    event.attributes.GEO_ID[1]=4; //Convert State Geo_ID to County Geo_ID)
    activelayer.styleMap = getDefaultStyle('blank');
    activelayer.redraw();

    var fip = event.attributes.GEO_ID[9]+event.attributes.GEO_ID[10];
    
    stateCounties = getStateCounties(fip);
    map.addLayer(stateCounties);
    activelayer = stateCounties;

    activelayer.styleMap = getStyle(sf1var[$('#sf1').val()],$("#color").val(),quant);
    activelayer.redraw();

    countiesSelect = getStateCounties(fip);
    selectlayer = countiesSelect;
    map.addLayer(selectlayer);
    countiesSelect.styleMap = getDefaultStyle();

    selectlayerer = new OpenLayers.Control.SelectFeature([selectlayer],{
        hover:true,
        tiple: true,
        autoActivate:true
    });
   map.addControl(selectlayerer);
   level++;

   var countydblclick = new DblclickFeature(countiesSelect, {
    dblclick: function (event) { 

            event.attributes.GEO_ID[1]=4;
            var name = event.attributes.NAME+" "+event.attributes.LSAD+" tracts";
            var statefip=event.attributes.GEO_ID[9]+event.attributes.GEO_ID[10];
            var countyfip=event.attributes.GEO_ID[11]+event.attributes.GEO_ID[12]+event.attributes.GEO_ID[13];
            console.log(name+' '+statefip+' '+countyfip);
            map.zoomToExtent(event.geometry.bounds);
            
            activelayer.styleMap = getDefaultStyle('blank');
            activelayer.redraw();

            countyTracts = getCountyTracts(statefip,countyfip,name);
            map.addLayer(countyTracts);
            activelayer = countyTracts;

            activelayer.styleMap = getStyle(sf1var[$('#sf1').val()],$("#color").val(),quant);
            activelayer.redraw();

            tractSelect =getCountyTracts(statefip,countyfip,name);
            selectlayer = tractSelect;
            map.addLayer(selectlayer);
            selectlayer.styleMap = getDefaultStyle();
            
            tractselectlayerer = new OpenLayers.Control.SelectFeature([selectlayer],{
                hover:true,
                tiple: true,
                autoActivate:true
            });
            map.addControl(tractselectlayerer);
            level++;

            var tractdblclick = new DblclickFeature(tractSelect, {
            dblclick: function (event) { 

                        event.attributes.GEO_ID[1]=4;
                        var name = event.attributes.NAME+"block groups";
                        var statefip=event.attributes.GEO_ID[9]+event.attributes.GEO_ID[10];
                        var countyfip=event.attributes.GEO_ID[11]+event.attributes.GEO_ID[12]+event.attributes.GEO_ID[13];
                        var tractfip = event.attributes.GEO_ID[14]+event.attributes.GEO_ID[15]+event.attributes.GEO_ID[16]+event.attributes.GEO_ID[17]+event.attributes.GEO_ID[18]+event.attributes.GEO_ID[19];
                        console.log(name+' '+statefip+' '+countyfip+' '+tractfip);
                        map.zoomToExtent(event.geometry.bounds);
                    
                        activelayer.styleMap = getDefaultStyle('blank');
                        activelayer.redraw();

                        var TractBlockGroups = getTractBlockGroups(statefip,countyfip,tractfip,name);
                        map.addLayer(TractBlockGroups);
                        activelayer = TractBlockGroups;

                        activelayer.styleMap = getStyle(sf1var[$('#sf1').val()],$("#color").val(),quant);
                        activelayer.redraw();

                        var BGSelect = getTractBlockGroups(statefip,countyfip,tractfip,name); 
                        selectlayer = BGSelect;
                        map.addLayer(selectlayer);
                        selectlayer.styleMap = getDefaultStyle();
                        
                        bgselectlayerer = new OpenLayers.Control.SelectFeature([selectlayer],{
                            hover:true,
                            tiple: true,
                            autoActivate:true
                        });
                        map.addControl(bgselectlayerer);
                        level++;
                    } 
                });
            
            map.addControl(tractdblclick);
            tractdblclick.activate();


        }
    });
    map.addControl(countydblclick);
    countydblclick.activate();

  }
});
            

var selector = new OpenLayers.Control.SelectFeature([counties,states],{
        hover:true,
        multiple: true,
        autoActivate:true
});


usBounds = map.getExtent;
map.addLayers([counties,states]);
map.addControl(selector);
map.addControl(statedblclick);
statedblclick.activate();


activelayer = counties;

}