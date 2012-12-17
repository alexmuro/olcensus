var urls = [
    "http://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
    "http://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
    "http://c.tile.openstreetmap.org/${z}/${x}/${y}.png"
];

var cdata = 'P0010001';
var style = getStyle(cdata,0);
   
var rule = new OpenLayers.Rule({
    // We could also set a filter here.  E.g.
    // filter: format.read("STATE_ABBR >= 'B' AND STATE_ABBR <= 'O'"),
    symbolizer: {
        fillColor: "#ff0000",
        strokeColor: "#ffcccc",
        fillOpacity: "0.5"
    }    
})

var styles = new OpenLayers.StyleMap({
    "default": {
        strokeWidth: 2,
        strokeColor:'#fff',
        fillColor: "#fff",
        fillOpacity: ".1" 
    },
    "select": {
         strokeColor: "#fff",
         fillColor: "#fff",
        strokeWidth: 4,
        fillOpacity: ".37" 
    }
});

var blankstyle = new OpenLayers.StyleMap({
    "default": {
        strokeWidth: 0,
        strokeColor:'#fff',
        fillColor: "#fff",
        fillOpacity: "0" 
    }
});

var map = new OpenLayers.Map({
    div: "map",

    layers: [
       new OpenLayers.Layer.XYZ("OSM (with buffer)", urls, {
            transitionEffect: "resize", buffer: 2, sphericalMercator: true
        }),
        new OpenLayers.Layer.XYZ("OSM (without buffer)", urls, {
            transitionEffect: "resize", buffer: 0, sphericalMercator: true
        })

    ],
    controls: [
        new OpenLayers.Control.Navigation({
            dragPanOptions: {
                enableKinetic: true
            }
        }),
        new OpenLayers.Control.PanZoom(),
        new OpenLayers.Control.Attribution()
    ],
    center: [-10165141.079578,4625473.078965],
    zoom: 4.5
});
//map.fractionalZoom = true;

var counties= new OpenLayers.Layer.Vector("US Counties", {
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
        styleMap: style
});

var states = new OpenLayers.Layer.Vector("States", {
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
    , styleMap: styles
});
            
var DblclickFeature = OpenLayers.Class(OpenLayers.Control, {
  initialize: function (layer, options) {
    OpenLayers.Control.prototype.initialize.apply(this, [ options ]);
    this.handler = new OpenLayers.Handler.Feature(this, layer, {
      dblclick: this.dblclick
    });
  }
});

var dblclick = new DblclickFeature(states, {
  dblclick: function (event) {
    
    map.zoomToExtent(event.geometry.bounds);
    event.attributes.GEO_ID[1]=4; //Convert State Geo_ID to County Geo_ID
    console.log(event.attributes.GEO_ID);
    activelayer.styleMap = blankstyle;
    activelayer.redraw();
    console.log('activelayer redraw');

    var fip = event.attributes.GEO_ID[9]+event.attributes.GEO_ID[10];
    console.log(fip);
    
    var stateCounties = getStateCounties(fip)
    map.addLayer(stateCounties);
    activelayer = stateCounties;

    quant = getLayerAttribute(activelayer,sf1var[$('#sf1').val()]);
    activelayer.styleMap = getStyle(sf1var[$('#sf1').val()],$("#color").val(),quant);
    activelayer.redraw();
    /*
    rule = getFilter('GEO_ID', event.attributes.GEO_ID, 'like');
    filterMap = new OpenLayers.StyleMap({
        "default": new OpenLayers.Style(null, {rules: [rule]})
    });
    counties.styleMap = filterMap;
    counties.refresh();
    */
  }
});


                            

map.events.register("zoomend", null, displayZoom);
map.events.register("moveend", null, displayCenter);
var selector = new OpenLayers.Control.SelectFeature([counties,states],{
        hover:true,
        multiple: true,
        autoActivate:true
});

var stateselect = new OpenLayers.Control.SelectFeature(states,{
        click:true,
        autoActivate:true
});

map.addLayers([counties,states]);
map.addControl(selector);
map.addControl(new OpenLayers.Control.LayerSwitcher());
map.addControl(dblclick);
dblclick.activate();
activelayer = counties;
 
document.getElementById("zoom").innerHTML = map.zoom.toFixed(4);
document.getElementById("center").innerHTML = map.getCenter().toShortString();

 function displayZoom() {
            document.getElementById("zoom").innerHTML = map.zoom.toFixed(4);
        }
 function displayCenter() {
            document.getElementById("center").innerHTML = map.getCenter().toShortString();
        }
