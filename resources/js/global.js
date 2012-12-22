//----------------
//GLOBAL VARIABLES
//----------------
var quant = {};
var activelayer,selectlayer;
var usBounds;
var selectlayerer,tractselectlayerer;
var counties, states,stateCounties,countiesSelect;
var level = 0;
var sources = ['sf1','acs5'];
var sf1var = ['P0010001','P0030002','P0030003','P0030005','P0040001','P0120002','P0120026','P0180001']
var acsvar = ['B00001_001E','B00002_001E','B23001_001E','B25044_003E','B25044_004E','B25119_001E','B08006_008E','B08006_009E','B08006_011E'];

//---------------------------------------------------
// Screen Behavior Jquery - to be Refactored
//---------------------------------------------------
jQuery(document).ready(function(){

 quant = getLayerAttribute(counties,sf1var[$('#sf1').val()]);
 counties.styleMap = getStyle(sf1var[$('#sf1').val()],$("#color").val(),quant);
 counties.redraw();
$("#acs").change(function() {
        var page = 'data/load/?s=1&v='+$(this).val();
        activelayer.log(counties['features'])
        activelayer.styleMap = getStyle(sf1var[$(this).val()]);
        activelayer.redraw();
        $("#sf1").css("border-color","black");
        $("#acs").css("border-color","red");
    });

$("#sf1").change(function() {
       
        quant = getLayerAttribute(activelayer,sf1var[$(this).val()]);
        activelayer.styleMap = getStyle(sf1var[$(this).val()],$("#color").val(),quant);
        activelayer.redraw();
        $("#acs").css("border-color","black");
        $("#sf1").css("border-color","red");
    });

$("#color").change(function() {
        activelayer.styleMap = getStyle(sf1var[$('#sf1').val()],$(this).val(),quant);
        activelayer.redraw();
    });
});
