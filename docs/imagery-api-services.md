## Imagery API/Services

### OGC Web Map Tile Service (WMTS)

The [Open Geospatial Consortium (OGC) Web Map Tile Service (WMTS)](http://www.opengeospatial.org/standards/wmts/) provides a way for clients to retrieve tiled mapping data in a standardized manner, handling product-specific details such as available number of zoom levels, map projections, image formats, tile sizes, etc. The WMTS specification provides guidance for three methods of tile retrieval: Key-Value Pair (KVP), REpresentational State Transfer (REST), and Simple Object Access Protocol (SOAP). GIBS supports KVP and REST, but not SOAP.

#### Service Endpoints and GetCapabilities

The WMTS specification requires that a WMTS server provide information regarding the available imagery via a GetCapabilities request. Here is a list of available service endpoints, projections, and their GetCapabilities request:

* WGS 84 / Geographic - EPSG:4326, WMTS version 1.0.
    * KVP endpoint: [https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi)
    * KVP GetCapabilities: [https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?SERVICE=WMTS&request=GetCapabilities](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?SERVICE=WMTS&request=GetCapabilities)
    * REST endpoint: [https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/)
    * REST GetCapabilities: [https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml)
* Web Mercator - EPSG:3857, WMTS version 1.0.
    * KVP endpoint: [https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi](https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi)
    * KVP GetCapabilities: [https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi?SERVICE=WMTS&request=GetCapabilities](https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi?SERVICE=WMTS&request=GetCapabilities)
    * REST endpoint: [https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/](https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi?SERVICE=WMTS&request=GetCapabilities)
    * REST GetCapabilities: [https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/1.0.0/WMTSCapabilities.xml](https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/1.0.0/WMTSCapabilities.xml)
* Arctic polar stereographic - EPSG:3413, WMTS version 1.0.
    * KVP endpoint: [https://gibs.earthdata.nasa.gov/wmts/epsg3413/best/wmts.cgi](https://gibs.earthdata.nasa.gov/wmts/epsg3413/best/wmts.cgi)
    * KVP GetCapabilities: [https://gibs.earthdata.nasa.gov/wmts/epsg3413/best/wmts.cgi?SERVICE=WMTS&request=GetCapabilities](https://gibs.earthdata.nasa.gov/wmts/epsg3413/best/wmts.cgi?SERVICE=WMTS&request=GetCapabilities)
    * REST endpoint: [https://gibs.earthdata.nasa.gov/wmts/epsg3413/best/](https://gibs.earthdata.nasa.gov/wmts/epsg3413/best/)
    * REST GetCapabilities: [https://gibs.earthdata.nasa.gov/wmts/epsg3413/best/1.0.0/WMTSCapabilities.xml](https://gibs.earthdata.nasa.gov/wmts/epsg3413/best/1.0.0/WMTSCapabilities.xml)
* Antarctic polar stereographic - EPSG:3031, WMTS version 1.0.
    * KVP endpoint: [https://gibs.earthdata.nasa.gov/wmts/epsg3031/best/wmts.cgi](https://gibs.earthdata.nasa.gov/wmts/epsg3031/best/wmts.cgi)
    * KVP GetCapabilities: [https://gibs.earthdata.nasa.gov/wmts/epsg3031/best/wmts.cgi?SERVICE=WMTS&request=GetCapabilities](https://gibs.earthdata.nasa.gov/wmts/epsg3031/best/wmts.cgi?SERVICE=WMTS&request=GetCapabilities)
    * REST endpoint: [https://gibs.earthdata.nasa.gov/wmts/epsg3031/best/](https://gibs.earthdata.nasa.gov/wmts/epsg3031/best/)
    * REST GetCapabilities: [https://gibs.earthdata.nasa.gov/wmts/epsg3031/best/1.0.0/WMTSCapabilities.xml](https://gibs.earthdata.nasa.gov/wmts/epsg3031/best/1.0.0/WMTSCapabilities.xml)

#### Time Dimension

The core concept within the GetCapabilities response is a map layer. GIBS map layers represent data that changes over time, most commonly providing a different map each day. Therefore, the layer definition within the GIBS GetCapabilities response must present a time dimension. The GIBS team has chosen to address this in the following manner, within each layer:

``` xml
<Dimension>
  <ows:Identifier>time</ows:Identifier>
  <UOM>ISO8601</UOM>
  <Default>2013-05-29</Default>
  <Current>false</Current>
  <Value>2012-05-08/2013-05-29/P1D</Value>
</Dimension>
```

The parts of the Dimension data structure are taken from the WMTS 1.0.0 spec (Table 9, p. 22). However, since the WMTS spec doesn't address the time dimension, we are adapting some aspects of the WMS spec regarding the time dimension, specifically:

1. The contents of the `<UOM>` part match the contents of the "units=" attribute in the WMS `<Dimension>` element.
2. The contents of the `<Value>` part match the contents of the WMS `<Extent>` element.

If the time dimension is omitted in the WMTS request, GIBS will return tiles for the default date, as specified in the `<Default>` tag. Note that GIBS' imagery layers all have a value of false in the `<Current>` tag which means that the special current keyword cannot be provided as the time value. However, GIBS does support use of the special default keyword, which results in the same response as though the date were omitted.

#### Sample Execution

GIBS has chosen to implement the Key-Value Pair and RESTful service interfaces. Equivalent sample requests are included below:

* KVP - [https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=MODIS_Terra_CorrectedReflectance_TrueColor&STYLE=&TILEMATRIXSET=250m&TILEMATRIX=6&TILEROW=13&TILECOL=36&FORMAT=image%2Fjpeg&TIME=2012-07-09](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=MODIS_Terra_CorrectedReflectance_TrueColor&STYLE=&TILEMATRIXSET=250m&TILEMATRIX=6&TILEROW=13&TILECOL=36&FORMAT=image%2Fjpeg&TIME=2012-07-09)
* RESTful - [https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2012-07-09/250m/6/13/36.jpg](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2012-07-09/250m/6/13/36.jpg)

More generically, the RESTful request follows the form of:

``` xml
https://gibs.earthdata.nasa.gov/wmts/epsg{EPSG:Code}/best/{ProductName}/default/{Time}/{TileMatrixSet}/{ZoomLevel}/{TileRow}/{TileCol}.png
```

#### Example Clients

* [NASA Worldview](https://worldview.earthdata.nasa.gov)
* [OpenLayers v2 and v3, Leaflet, Bing Maps, Google Maps](https://github.com/nasa-gibs/gibs-web-examples)

## Generic XYZ Tile Access

The WMTS RESTful interface above can be easily adapted for use as a "generic" XYZ tile server if the developer pre-populates all of the required fields except the tile row, column, and zoom level. For example, by starting with the most generalized GIBS API request:

``` xml
https://gibs.earthdata.nasa.gov/wmts/epsg{EPSG:Code}/best/{ProductName}/default/{Time}/{TileMatrixSet}/{ZoomLevel}/{TileRow}/{TileCol}.png
```

Populating the fields with the desired projection, product, time, etc (Terra/MODIS Aerosol Optical depth from 2014/04/09, in this case), GIBS
products can be used by clients such as [ESRI's ArcGIS Online](http://www.arcgis.com/home/webmap/viewer.html) to add a "Tile Layer" by leaving the row, column, and zoom level as parameters:

``` xml
https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_Aerosol/default/2014-04-09/GoogleMapsCompatible_Level6/{level}/{row}/{col}.png
```

## OGC Web Map Service (WMS)

The [Open Geospatial Consortium (OGC) Web Map Service (WMS)](http://www.opengeospatial.org/standards/wms/) provides a way for clients to receive a customized WMS response based on request parameters such as a custom bounding box, dimensions, layer(s) and format. Unlike the rigidity enforced through tiled interfaces (e.g. WMTS and TWMS), WMS responses are more flexible and may contain multiple composited layers in a single output. Two WMS specifications are currently available and supported by GIBS: 1.1.1 and 1.3.0. Both WMS specifications support a single method of image retrieval, which is supported by GIBS:
Key-Value Pair (KVP).

#### Service Endpoints and GetCapabilities

The WMS specification requires that a WMS server provide information regarding the available imagery via a GetCapabilities request. H
ere is a list of available service endpoints, projections, and their GetCapabilities request:

* WGS 84 / Geographic - EPSG:
    * WMS endpoint: [https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi)
    * WMS v1.1.1 GetCapabilities: [https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.1.1](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.1.1)
    * WMS v1.3.0 GetCapabilities: [https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0)
* Web Mercator - EPSG:3857
    * WMS endpoint: https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi
    * WMS v1.1.1 GetCapabilities: [https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.1.1](https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.1.1)
    * WMS v1.3.0 GetCapabilities: [https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0](https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0)
* Arctic polar stereographic - EPSG:3413
    * WMS endpoint: [https://gibs.earthdata.nasa.gov/wms/epsg3413/best/wms.cgi](https://gibs.earthdata.nasa.gov/wms/epsg3413/best/wms.cgi)
    * WMS v1.1.1 GetCapabilities: [https://gibs.earthdata.nasa.gov/wms/epsg3413/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.1.1](https://gibs.earthdata.nasa.gov/wms/epsg3413/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.1.1)
    * WMS v1.3.0 GetCapabilities: [https://gibs.earthdata.nasa.gov/wms/epsg3413/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0](https://gibs.earthdata.nasa.gov/wms/epsg3413/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0)
* Antarctic polar stereographic - EPSG:3031
    * WMS endpoint: [https://gibs.earthdata.nasa.gov/wms/epsg3031/best/wms.cgi](https://gibs.earthdata.nasa.gov/wms/epsg3031/best/wms.cgi)
    * WMS v1.1.1 GetCapabilities: [https://gibs.earthdata.nasa.gov/wms/epsg3031/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.1.1](https://gibs.earthdata.nasa.gov/wms/epsg3031/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.1.1)
    * WMS v1.3.0 GetCapabilities: [https://gibs.earthdata.nasa.gov/wms/epsg3031/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0](https://gibs.earthdata.nasa.gov/wms/epsg3031/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0)

NOTE: EPSG:3857 GetMap requests for vector-based visualizations may fail when using the Web Mercator WMS endpoint listed above. However, you may instead provide the "CRS=EPSG:3857" query parameter to the Geographic WMS endpoint.  This affects the following GIBS visualization layers:

* Thermal Anomalies
* Orbit Tracks
* Nuclear Power Plants
* Settlements
* Dams and Reservoirs

#### Time Dimension

The core concept within the GetCapabilities response is a map layer. GIBS map layers represent data that changes over time, most commonly providing a different map each day. Therefore, the layer definition within the GIBS GetCapabilities response must present a time dimension. The GIBS team has chosen to address this in the following manner, as outlined in the respective OGC WMS specification:

**WMS v1.1.1**

```
<Dimension name="time" units="ISO8601"/>
<Extent name="time" default="2018-11-14" nearestValue="1">2013-07-16/2018-11-14/P1D</Extent>
```

**WMS v1.3.0**

```
<Dimension name="time" units="ISO8601" default="2018-10-01" nearestValue="1">2002-09-01/2018-10-
/P1M</Dimension>
```

If the time dimension is omitted in the WMS request, GIBS will return tiles for the default date, as specified in the *default* attribute. Note that GIBS' imagery layers all have a value of *1* in the *nearestValue* tag indicating that GIBS will snap to the nearest time value within the specified dimension extents. Additionally, GIBS supports use of the special *default* keyword, which results in the same response as though the date were omitted.

#### Sample Execution

GIBS has chosen to implement the Key-Value Pair and RESTful service interfaces. Equivalent sample requests are included below:

* WMS v1.1.1 - [https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=MODIS_Terra_SurfaceReflectance_Bands721&STYLES=&FORMAT=image%2Fpng&TRANSPARENT=true&HEIGHT=256&WIDTH=256&TIME=2018-10-01&SRS=EPSG:4326&BBOX=-22.5,0,0,22.5](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=MODIS_Terra_SurfaceReflectance_Bands721&STYLES=&FORMAT=image%2Fpng&TRANSPARENT=true&HEIGHT=256&WIDTH=256&TIME=2018-10-01&SRS=EPSG:4326&BBOX=-22.5,0,0,22.5)
* WMS v1.3.0 - [https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MODIS_Terra_SurfaceReflectance_Bands721&STYLES=&FORMAT=image%2Fpng&TRANSPARENT=true&HEIGHT=256&WIDTH=256&TIME=2018-10-01&CRS=EPSG:4326&BBOX=-22.5,0,0,22.5](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MODIS_Terra_SurfaceReflectance_Bands721&STYLES=&FORMAT=image%2Fpng&TRANSPARENT=true&HEIGHT=256&WIDTH=256&TIME=2018-10-01&CRS=EPSG:4326&BBOX=-22.5,0,0,22.5)

#### Geographic Information System (GIS) Client Usage

* [ESRI ArcGIS, Google Earth](http://127.0.0.1:8000/gis-usage/)

## Tiled Web Map Service (TWMS)

Tiled WMS offers fast response to a limited number of WMS access patterns - specifically those access patterns which provide geographic
bounds which fall along the edges of pregenerated tiles.

Those patterns are described in the TWMS [GetTileService request](https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi?request=GetTileService). The response is an XML encoded list of available WMS access patterns. A TiledPattern access pattern is a set gridded WMS requests, where parameter order, case and content are constant, with the exception of the bbox values. Using this pattern allows fast access to tiles for a given combination of layers and associated styles at a given resolution over a defined area. All the information about a pattern can be extracted form the provided WMS call, using these rules:

Server prefix is defined in the OnlineResource tag Area covered is defined in the LatLonBoundingBox Tile size is provided by the *width* and *height* parameters values Tile format is provided by the *format* parameter value Tile coverage can be computed as *(Lon1-Lon0)* and *(Lat1-Lat0)*, where *Lon1,Lon0,Lat1 and Lat0* are the arguments of the *bbox* parameter. The Grid alignment results from the *bbox* argument and the tile coverage. The *bbox* argument values provided in the pattern are for the top-left tile, the other tile locations can be computed based on the tile coverage. Other metadata that might be of interest to a user is contained in the *Name*, *Title* and *Abstract* tags.

Multiple WMS patterns in a single *TilePattern* are equivalent. *TilePattern* tags that have something in common are grouped in a hierarchical structure build using *TiledGroup* tags. The innermost level refers to the same exact data, possible differences being the image size, image format, resolution, and alignment. Higher level *TiledGroup* are used to group together related datasets.

A client application is expected to request this information only if it is defined as a request in the WMS server Capabilities. Once obtained, the application needs to analyze the patterns, decide which ones can be used and then issue only WMS requests that match the pattern to the normal WMS server, requests that can be built by modifying the *bbox* argument in a *TiledPattern* and prefixing the resulting string with the content of the *OnlineResource* tag.

The 'time' parameter follows the form YYYY-MM-DD which should be included in the request for a time-varying layer; if the time dimension is omitted in the TWMS request, tiles for the current UTC date will be returned. Be aware that many of the current date’s tiles will be empty because the imagery is generated as the satellites orbit from east to west.

#### Service Endpoints

* Geographic - EPSG:4326, TWMS version 0.1.0
    * Service endpoint: [https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi](https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi)
    * GetTileService request: [https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi?request=GetTileService](https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi?request=GetTileService)
* Arctic Polar Stereographic - EPSG:3413, TWMS version 0.1.0
    * Service endpoint: [https://gibs.earthdata.nasa.gov/twms/epsg3413/best/twms.cgi](https://gibs.earthdata.nasa.gov/twms/epsg3413/best/twms.cgi)
    * GetTileService request: [https://gibs.earthdata.nasa.gov/twms/epsg3413/best/twms.cgi?request=GetTileService](https://gibs.earthdata.nasa.gov/twms/epsg3413/best/twms.cgi?request=GetTileService)
* Antarctic Polar Stereographic - EPSG:3031, TWMS version 0.1.0
    * Service endpoint: [https://gibs.earthdata.nasa.gov/twms/epsg3031/best/twms.cgi](https://gibs.earthdata.nasa.gov/twms/epsg3031/best/twms.cgi)
    * GetTileService request: [https://gibs.earthdata.nasa.gov/twms/epsg3031/best/twms.cgi?request=GetTileService](https://gibs.earthdata.nasa.gov/twms/epsg3031/best/twms.cgi?request=GetTileService)

#### Sample Execution

* [https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi?request=GetMap&layers=MODIS_Terra_CorrectedReflectance_TrueColor&srs=EPSG:4326&format=image/jpeg&styles=&time=2012-07-09&width=512&height=512&bbox=-18,27,-13.5,31.5](https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi?request=GetMap&layers=MODIS_Terra_CorrectedReflectance_TrueColor&srs=EPSG:4326&format=image/jpeg&styles=&time=2012-07-09&width=512&height=512&bbox=-18,27,-13.5,31.5)

