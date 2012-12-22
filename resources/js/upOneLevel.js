function upOneLevel()
{
 console.log('Up One Level');
 if(level == 1)
 {
 	console.log('level == 1');
 	map.removeLayer(activelayer);
 	map.removeLayer(selectlayer);
 	map.removeControl(selectlayerer);
 	selectlayerer.destroy();
 	
 	
 	activelayer = counties;
 	//console.log()
 	//map.center = [-10165141.079578,4625473.078965];
 	//map.zoomToExtent(activelayer.getDataExtent());
 	map.zoomTo(4);
 	//states.styleMap = styles;
 	quant = getLayerAttribute(activelayer,sf1var[$('#sf1').val()]);
    activelayer.styleMap = getStyle(sf1var[$('#sf1').val()],$("#color").val(),quant);
    activelayer.redraw()
    level--;
 }	

}