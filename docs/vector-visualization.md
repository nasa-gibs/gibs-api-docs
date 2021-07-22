## Vector Visualization Products

### Overview

Vector products are accessible through the GIBS WMTS and WMS services. WMTS responses are formatted as gzip-compressed Mapbox vector tiles ([specification](https://docs.mapbox.com/vector-tiles/specification/)), or "MVTs", while WMS responses are available as raster images. See the [Access](#access) section below for more information.

The data behind each visualization service is the same, however the mechanism for styling differs. A client application is responsible for applying styling to MVTs when using the WMTS API. Conversely, GIBS applies a default style when rendering vector data as a raster when using the WMS API. See the [Vector Layer Styles](#vector-styling) section below for more information.

An MVT returned via the WMTS service contains information for a client to draw the features within the user interface, but also a set of properties that contain data associated with the feature. The Mapbox vector tile specification provides structure for representing these data, but no mechanism for interpreting the meaning or intended use. As such, additional metadata is required. GIBS has developed a specification for defining each property contained within MVTs in its vector products. See the [Vector Layer Metadata](#vector-metadata) section below for more information.

### Access

The following sections provide examples for how to detect and interact with vector products within the GIBS WMTS and WMS services.

NOTE: Vector products are not natively provided in the EPSG:3857 projection through either the WMTS or WMS services.  A workaround for WMS requests is to utilize the EPSG:4326 endpoint with EPSG:3857-based SRS and BBOX query parameters ([example](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?service=WMS&request=GetMap&version=1.1.1&layers=VIIRS_SNPP_Thermal_Anomalies_375m_All&styles=&format=image%2Fpng&transparent=false&srs=EPSG:3857&width=480&height=480&bbox=-20037508,-20037508,20037508,20037508&time=2020-01-01)).

#### WMTS

Accessing a vector product through the WMTS service follows the same rules as raster products. The primary differences being the format specified
in the request and of the response. When issuing a KVP WMTS request, the "format" value must be application/vnd.mapbox-vector-tile.
When issuing a REST-ful WMTS request, the extension must be .mvt. See below for examples of each:

* KVP - [https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?TIME=2020-10-01T00:00:00Z&FORMAT=application/vnd.mapbox-vector-tile&layer=VIIRS_NOAA20_Thermal_Anomalies_375m_All&tilematrixset=500m&Service=WMTS&Request=GetTile&Version=1.0.0&TileMatrix=4&TileCol=4&TileRow=3](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?TIME=2020-10-01T00:00:00Z&FORMAT=application/vnd.mapbox-vector-tile&layer=VIIRS_NOAA20_Thermal_Anomalies_375m_All&tilematrixset=500m&Service=WMTS&Request=GetTile&Version=1.0.0&TileMatrix=4&TileCol=4&TileRow=3)
* REST - [https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/VIIRS_NOAA20_Thermal_Anomalies_375m_All/default/2020-10-01T00:00:00Z/500m/4/3/4.mvt](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/VIIRS_NOAA20_Thermal_Anomalies_375m_All/default/2020-10-01T00:00:00Z/500m/4/3/4.mvt)

The response to a KVP or REST-ful WMTS response will be a gzip-compressed MVT. The following Python code snippet provides an example of
how to download and print out the contents of a vector tile. Note that the Python [requests](https://requests.readthedocs.io/en/master/) library is automatically decoding the gzip'd response.

**MVT Tile Printer**

```
#!/usr/bin/env python
 
#
# pip install mapbox_vector_tile and requests first
#
 
import mapbox_vector_tile
import requests
import sys
 
url = 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/VIIRS_NOAA20_Thermal_Anomalies_375m_All/default/2020-10-01T00:00:00Z/500m/4/3/4.mvt'
response = requests.get(url)
 
decoded_data = mapbox_vector_tile.decode(response.content)
 
print(repr(decoded_data))
 
for key in decoded_data:
   print(key + " Feature Count: " + str(len(decoded_data[key]["features"])))
```

#### WMS

Accessing a vector product through the WMS service follows the same rules as raster products. Both version 1.1.1. and 1.3.0 WMS GetMap requests
will return rasterized representations of the vector product. See below for an example:

* WMS Request - [https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?/wms/epsg4326/best/wms.cgi?TIME=2020-10-01T00:00:00Z&LAYERS=VIIRS_NOAA20_Thermal_Anomalies_375m_All&REQUEST=GetMap&SERVICE=WMS&FORMAT=image/png&STYLES=&HEIGHT=240&VERSION=1.1.1&SRS=epsg:4326&WIDTH=480&BBOX=-180,-90,180,90&TRANSPARENT=TRUE](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?/wms/epsg4326/best/wms.cgi?TIME=2020-10-01T00:00:00Z&LAYERS=VIIRS_NOAA20_Thermal_Anomalies_375m_All&REQUEST=GetMap&SERVICE=WMS&FORMAT=image/png&STYLES=&HEIGHT=240&VERSION=1.1.1&SRS=epsg:4326&WIDTH=480&BBOX=-180,-90,180,90&TRANSPARENT=TRUE)
WMS Response - See picture ...

![wms_response](img/wms_response.png)

Almost all raster layers in the GIBS WMS service provide a link to a pre-generated legend image as the LegendURL associated with the default style. This image is generated from the associated XML colormap. However, for vector products, the GIBS WMS service utilizes the GetLegendGraphic request as the basis for a layer's LegendURL. The following snippet shows how this is defined in the WMS Capabilities document. Issuing the sample request returns this ![thermal_anomaly](img/thermal_anomaly.png) image.

**WMS Legend URL Definition**

```
<Style>
  <LegendURL width="138" height="23">
    <Format>image/png</Format>
    <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?version=1.1.1&service=WMS&request=GetLegendGraphic&layer=VIIRS_NOAA20_Thermal_Anomalies_375m_All&format=image/png&STYLE=default"/>
  </LegendURL>
</Style>
```


## Vector Metadata

As mentioned previously, the Mapbox vector tile specification provides structure for representing these data, but no mechanism for interpreting the meaning or intended use. As such, GIBS has developed a [Vector Metadata Specification](/vector-metadata-specification) for defining each property contained within MVTs in its vector products. Each vector product has an associated JSON *vector metadata* file which provides the following information:

* A unique identifier for the property, as found in the MVT data itself
* Descriptive information such as a title, description, and the function of the property (e.g. identification vs styling)
* The data type and optional units for the property
* Valid values for the property
* Additional flags for improved UI experience

### WMTS Capabilities Definition

A vector product's vector metadata file is referenced in the WMTS Capabilities document as `Layer/ows:Metadata` elements. The following snippet shows an example of how these elements will appear in the XML Capabilities response. Note that there are two entries listed. One is for the "default" *vector metadata* file and one for the versioned (e.g. '1.0') *vector metadata* file. This allows for the addition of future versions as enhancements are
made to the GIBS vector product visualization capabilities, while retaining retaining backwards compatibility.

**WMTS Capabilities Layer Metadata**

```
<ows:Metadata xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/layer" xlink:
href="https://gibs.earthdata.nasa.gov/vector-metadata/v1.0/FIRMS_MODIS_Thermal_Anomalies.json" xlink:title="
Layer Metadata"/>
<ows:Metadata xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/layer/1.0" xlink:
href="https://gibs.earthdata.nasa.gov/vector-metadata/v1.0/FIRMS_MODIS_Thermal_Anomalies.json" xlink:title="
Layer Metadata"/>
```

### Vector Metadata Contents

A *vector metadata* file is a list of content blocks defining each property. The following snippet shows an example of a single property's definition within the *vector metadata* file.

**MVT Property Snippet**

```
{
"Identifier" : "NumReactor",
"Title" : "Number of Reactors",
"Description": "Number of Active Reactors at a given Plant",
"Units" : "Reactors",
"DataType" : "int",
"ValueRanges": [ { "Min": 1, "Max": 9 } ],
"Function" : "Style",
"IsOptional" : false,
"IsLabel" : false
}
```

The following block provides a full example of a *vector metadata* file.

**Sample Vector Metadata File**

``` json
{
  "id": "Nuclear_Power_Plant_Locations",
  "mvt_properties": [
 
    {
      "Identifier" : "Plant",
      "Title"      : "Plant Site Name",
      "Description": "Name of Nuclear Plant",
      "DataType"   : "string",
      "Function"   : "Identify",
      "IsOptional" : false,
      "IsLabel"    : true
    },
 
    {
      "Identifier" : "NumReactor",
      "Title"      : "Number of Reactors",
      "Description": "Number of Active Reactors at a given Plant",
      "Units"      : "Reactors",
      "DataType"   : "int",
      "ValueRanges": [ { "Min": 1, "Max": 9 } ],
      "Function"   : "Style",
      "IsOptional" : false,
      "IsLabel"    : false
    },
 
    {
      "Identifier" : "p10_30",
      "Title"      : "Population within 30km (2010)",
      "Description": "Total population within a 30km radius of the nuclear plant (2010)",
      "Units"      : "Persons",
      "DataType"   : "int",
      "ValueRanges": [ { "Min": 275, "Max": 7170590 } ],
      "Function"   : "Describe",
      "IsOptional" : false,
      "IsLabel"    : false
    }
}
```


### Vector Styling

As mentioned previously, a client is responsible for applying style to MVT tiles received from the GIBS WMTS service in order to represent the feature defined within the MVT. This is most simply done by utilizing the vector style file provided by GIBS for each vector product. These vector style files following the [Mapbox style specification](https://docs.mapbox.com/mapbox-gl-js/style-spec/). Here is a [live example](https://nasa-gibs.github.io/gibs-web-examples/examples/openlayers/vectors/geographic-epsg4326-vector-mapbox-styles.html) of how to use these styles with [OpenLayers](http://openlayers.org/).

#### WMTS Capabilities Definition

A vector product's vector style file is referenced in the WMTS Capabilities document as Layer/ows:Metadata elements. The following snippet shows an example of how these elements will appear in the XML Capabilities response. Note that there are two entries listed. One is for the "default" *vector style* file and one for the versioned (e.g. '1.0') *vector style* file. This allows for the addition of future versions as enhancements are made to the GIBS vector product visualization capabilities, while retaining retaining backwards compatibility.

**WMTS Capabilities Layer Metadata**

``` xml
<ows:Metadata xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/mapbox-gl-style"
xlink:href="https://gibs.earthdata.nasa.gov/vector-styles/v1.0/FIRMS_VIIRS_Thermal_Anomalies.json" xlink:
title="Mapbox GL Layer Styles"/>
<ows:Metadata xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/mapbox-gl-style/1.
0" xlink:href="https://gibs.earthdata.nasa.gov/vector-styles/v1.0/FIRMS_VIIRS_Thermal_Anomalies.json" xlink:
title="Mapbox GL Layer Styles"/>
```

#### Vector Style Contents

The *vector style* file contains the necessary information to apply a default style to a GIBS vector product, as required by the [Mapbox style specification](https://docs.mapbox.com/mapbox-gl-js/style-spec/). The file may contain style information for more than one vector product, as this allows for simplified file management within the GIBS system. Unneeded information should be ignored by the display library (e.g. [OpenLayers](http://openlayers.org/)). The following block provides a full example of a *vector style* file.

**Sample Vector Style File**

``` json
{
  "version": 8,
  "name": "SEDAC",
  "sources": {
    "GRanD_Reservoirs": {
      "type": "vector",
      "tiles": [
        "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/GRanD_Reservoirs/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.mvt"
      ]
    }
  },
  "layers": [
    {
      "id": "GRanD_Reservoirs_v1.01_STD",
      "source": "GRanD_Reservoirs",
      "source-layer": "GRanD_Reservoirs_v1.01_STD",
      "source-description": "Default",
      "type": "fill",
      "paint": {
        "fill-color": "rgb(0, 77, 168)"
      }
    }
  ]
}
```
