<?php
ini_set("memory_limit","512M");
ini_set('max_execution_time', 300);
//error_reporting(E_ALL);
//ini_set('display_errors', '1');

$source = $_GET['s'];
$var = $_GET['v'];
$source = 0;
$fips = $_GET['fip'];
$county = $_GET['county'];
$noapi = $_GET['nodata'];


$dataurl = "http://localhost/olcensus/data/states/".$fips."/census_tracts.json";
//echo $dataurl;
$geo = curl_download($dataurl);
$foo =  utf8_encode($geo);
$geo = json_decode($foo, true);
//echo '<pre>Test';
//print_r($geo);
//echo 'End Test<pre>';

    
$sources = Array('sf1','acs5');
$handles = Array( 'sf1' =>Array('P0010001','P0030002','P0030003','P0030005','P0040001','P0120002','P0120026','P0180001'), 'acs5' => Array('B00001_001E','B00002_001E','B23001_001E','B25044_003E','B25044_004E','B25119_001E','B08006_008E','B08006_009E','B08006_011E'));


$cursor = 1;
$geoSort=Array();
foreach($geo['features'] as $feature){
    $countyfip = $feature['properties']['GEO_ID'][11].$feature['properties']['GEO_ID'][12].$feature['properties']['GEO_ID'][13];
                    
    //echo $countyfip.' '.$county.'<br>'; 
    if($countyfip == $county){
        $geoSort[$feature['properties']['GEO_ID']] = $feature;
    }
}

$validFIPS = Array($fips);

if(!$nodata)
{
    foreach($validFIPS as $fipscode)
    {
        //echo "FipsCode: $fipscode <br>";
        $vars = 'P0010001,P0030002,P0030003,P0030005,P0040001,P0120002,P0120026,P0180001';
        $var = $handles[$sources[$source]][$var];
        $jURL = 'http://api.census.gov/data/2010/'.$sources[$source].'?key=564db01afc848ec153fa77408ed72cad68191211&get='.$vars.'&for=tract:*&in=county:'.$county.'+state:'.$fipscode;

        //echo $jURL."<br>";
        $cdata = curl_download($jURL);
        //echo $cdata;
        $foo =  utf8_encode($cdata);
        $cdata = json_decode($foo, true); 


        for($cursor =1;$cursor <count($cdata);$cursor++)
        {
        $length = count($cdata[$cursor]);
        $geoid = '1400000US'.$cdata[$cursor][$length-3]. $cdata[$cursor][$length-2]. $cdata[$cursor][$length-1];
        //echo $geoid.'<br>';
        //echo  $geoSort[$geoid]['properties']['NAME'].' '.$geoSort[$geoid]['properties']['LSAD'].' Population:'.number_format ($cdata[$cursor][0]).    "-$cursor".'<br>';
            for($var = 0;$var < $length-2;$var++)
            { 
                //echo $handles[$sources[$source]][$var];
             $geoSort[$geoid]['properties'][$handles[$sources[$source]][$var]] = $cdata[$cursor][$var];
            }
            //echo  $cdata[$cursor][0];
        }
    }
}

$empty=Array();
$geo['features'] = $empty;
foreach($geoSort as $feature){
    $geo['features'][] = $feature;
}
echo json_encode($geo);


function curl_download($Url){
 
    // is cURL installed yet?
    if (!function_exists('curl_init')){
        die('Sorry cURL is not installed!');
    }
 
    // OK cool - then let's create a new cURL resource handle
     $ch = curl_init();
   curl_setopt($ch, CURLOPT_URL, $Url);
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
   $output = curl_exec($ch);

    return $output;
}
?>