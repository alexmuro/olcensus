<?php
//Pass Map ID by Map ID
$routeID = $_GET["route"];
include '../../config/db.php'; 
$test = new db();
$inscon = $test->connect();


$output ['type'] = 'FeatureCollection';
 

//Sql call & json encod
$sql = "select 
        distinct CONCAT(shapes.shape_id,'_',shapes.shape_pt_sequence),
        shapes.shape_id,
        shapes.shape_pt_lat,
        shapes.shape_pt_lon,
        shapes.shape_pt_sequence
        FROM shapes,trips where shapes.shape_id = trips.shape_id
        AND trips.route_id = $routeID
        ";
//echo $sql;

$rs=mysql_query($sql) or die($sql."<br><br>".mysql_error());
$results = array();while ($row = mysql_fetch_assoc( $rs ))
{
    //echo $curr_shape_id;
    $curr_shape_id=$row['shape_id'];
    $properties = array();
    $feature = array();
    $geometry = array();
    $properties['id'] = $row['shape_id'];
    
    $feature['type'] = 'Feature';
    $feature['properties'] = $properties;
    $geometry['type'] = 'LineString'; 
    $coordinates[] = array();

    $x=0;
    $coordinates[] = array();
    //echo $curr_shape_id;
    while($row['shape_id'] == $curr_shape_id)
    {        
           //$geo = json_decode($geodata, true);
           if (!empty($row['shape_pt_lat']) && !empty($row['shape_pt_lon']))
           {
            $coordinates[$x][0] = floatval($row['shape_pt_lat']);
            $coordinates[$x][1] = floatval($row['shape_pt_lon']);
            }
           $x++;            
           $row = mysql_fetch_assoc( $rs );
    }

    $geometry['coordinates'][0] = $coordinates;
    $feature['geometry'] = $geometry;
    $output['features'][]=$feature;
    unset($coordinates);
}
echo json_encode($output); 


?>