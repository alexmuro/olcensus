var urls = [
    "http://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
    "http://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
    "http://c.tile.openstreetmap.org/${z}/${x}/${y}.png"
];

var style = new OpenLayers.Style(
    // the first argument is a base symbolizer
    // all other symbolizers in rules will extend this one
    {
        strokeWidth: 1,
        strokeColor:'#333',
        fillColor: "#0033cc",
        fillOpacity: ".7",
    },
    // the second argument will include all rules
    {
        rules: [
            new OpenLayers.Rule({
                // a rule contains an optional filter
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LESS_THAN,
                    property: "CDATA", // the "foo" feature attribute
                    value: 10000
                }),
                // if a feature matches the above filter, use this symbolizer
                symbolizer: {
                    
                    fillColor: "#0099ff"
                }
            }),
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN,
                    property: "CDATA",
                    lowerBoundary: 10000,
                    upperBoundary: 25000
                }),
                symbolizer: {
                    
                    fillColor: "#0055cc"
                }
            }),
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN,
                    property: "CDATA",
                    lowerBoundary: 25000,
                    upperBoundary: 100000
                }),
                symbolizer: {
                    fillColor: "#0033bb"
                }
            }),
            new OpenLayers.Rule({
                // apply this rule if no others apply
                elseFilter: true,
                symbolizer: {
                    fillColor: "#0011aa",
                }
            })
        ]
    }
);

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

var counties= new OpenLayers.Layer.Vector("US Counties", {
    eventListeners:{
        'featureselected':function(evt){
            var feature = evt.feature;
            document.getElementById("countydata").innerHTML = "<div >County: " + feature.attributes.NAME+" "+feature.attributes.LSAD +" <br>Geo ID: " + feature.attributes.GEO_ID+" <br>Pop: " + addCommas(feature.attributes.CDATA)+"</div>";
        },
        'featureunselected':function(evt){
            var feature = evt.feature;
         }   
        } ,
        strategies: [new OpenLayers.Strategy.Fixed()],                
        protocol: new OpenLayers.Protocol.HTTP({
            url: "data/outputdata",
            format: new OpenLayers.Format.GeoJSON()
        }),
        styleMap: new OpenLayers.StyleMap(style)
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
 document.getElementById("zoom").innerHTML = map.zoom.toFixed(4);
 document.getElementById("center").innerHTML = map.getCenter().toShortString();

 function displayZoom() {
            document.getElementById("zoom").innerHTML = map.zoom.toFixed(4);
        }
 function displayCenter() {
            document.getElementById("center").innerHTML = map.getCenter().toShortString();
        }
function addCommas(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}