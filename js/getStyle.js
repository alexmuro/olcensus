function getStyle(cdata,color,quant)
{
var cchoice =color;
var colors =[['#F1EEF6','#D0D1E6','#A6BDDB','#74A9CF','#3690C0','#0570B0','#034E7B'],
              ['#FFFFCC','#C7E9B4','#7FCDBB','#41B6C4','#1D91C0','#225EA8','#225EA8'],
              ['#FFFFB2','#FED976','#FEB24C','#FD8D3C','#FC4E2A','#E31A1C','#E31A1C'],
              ['#FFFFD4','#FEE391','#FEC44F','#FE9929','#EC7014','#CC4C02','#8C2D04'],
              ['#F7F7F7','#D9D9D9','#BDBDBD','#969696','#737373','#525252','#252525'],
              ['#D73027','#FC8D59','#FEE08B','#FFFFBF','#D9EF8B','#91CF60','#1A9850']];
//console.log(quant);
//console.log(pv.values(quant))
var quantile = pv.Scale.quantile()
  .quantiles(6)
  .domain(pv.values(quant));

console.log(quantile.quantiles());

var style = new OpenLayers.Style(
    // the first argument is a base symbolizer
    // all other symbolizers in rules will extend this one
    {
        strokeWidth: 0,
        strokeColor:'#333',
        fillColor: "#0033cc",
        fillOpacity: "1.",
    },
    // the second argument will include all rules
    {
        rules: [
            new OpenLayers.Rule({
                // a rule contains an optional filter
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LESS_THAN,
                    property: cdata, // the "foo" feature attribute
                    value: quantile.quantiles()[0]
                }),
                // if a feature matches the above filter, use this symbolizer
                symbolizer: {
                    
                    fillColor: colors[cchoice][0]
                }
            }),
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN,
                    property: cdata,
                    lowerBoundary: quantile.quantiles()[0],
                    upperBoundary: quantile.quantiles()[1]
                }),
                symbolizer: {
                    
                    fillColor: colors[cchoice][1]
                }
            }),
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN,
                    property: cdata,
                    lowerBoundary: quantile.quantiles()[1],
                    upperBoundary: quantile.quantiles()[2]
                }),
                symbolizer: {
                    fillColor: colors[cchoice][2]
                }
            }),
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN,
                    property: cdata,
                    lowerBoundary: quantile.quantiles()[2],
                    upperBoundary: quantile.quantiles()[3]
                }),
                symbolizer: {
                    fillColor: colors[cchoice][3]
                }
            }),
             new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN,
                    property: cdata,
                    lowerBoundary: quantile.quantiles()[3],
                    upperBoundary: quantile.quantiles()[4]
                }),
                symbolizer: {
                    fillColor: colors[cchoice][4]
                }
            }),
            new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN,
                    property: cdata,
                    lowerBoundary: quantile.quantiles()[4],
                    upperBoundary: quantile.quantiles()[5]
                }),
                symbolizer: {
                    fillColor: colors[cchoice][5]
                }
            }),
            new OpenLayers.Rule({
                // apply this rule if no others apply
                elseFilter: true,
                symbolizer: {
                    fillColor: colors[cchoice][6]
                }
            })
        ]
    }
);

return new OpenLayers.StyleMap(style);
}