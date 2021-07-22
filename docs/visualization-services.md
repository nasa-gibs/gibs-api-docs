# Visualization Services

The Global Imagery Browse Services (GIBS) provides visualizations through the following APIs/services, further described on this page:
  - OGC Web Map Tile Service (WMTS)
  - OGC Web Map Service (WMS)
  - Tiled Web Map Service (TWMS)
  - Generic Tile Service (TMS)

Each service is publicly available through endpoints specific to the service, projection, and category (e.g. Near Real-Time vs "Best Available") hosted on the [https://gibs.earthdata.nasa.gov](https://gibs.earthdata.nasa.gov) domain. (See [here](../imagery-api-services/#service-endpoints) for more details)

The following sections provide details regarding each visualization service, sample executions, and reference clients.


## OGC Web Map Tile Service (WMTS)
### Overview
The [Open Geospatial Consortium (OGC) Web Map Tile Service (WMTS)](http://www.opengeospatial.org/standards/wmts/) provides a way for clients to retrieve tiled mapping data in a standardized manner, handling product-specific details such as available number of zoom levels, map projections, image formats, tile sizes, etc. The WMTS specification provides guidance for three methods of tile retrieval: Key-Value Pair (KVP), REpresentational State Transfer (REST), and Simple Object Access Protocol (SOAP). GIBS supports the KVP and REST access methods.  Example endpoints are found below:

  * KVP EPSG:4326 Endpoint: [https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi)
  * REST EPSG:4326 Endpoint: [https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/)

### Sample Execution

WMTS requests utilize the following components:

  * LayerIdentifier - 
  * Time -
  * TileMatrixSet -
  * TileMatrix -
  * TileRow -
  * TileCol -
  * FormatExt/FormatMime -

**Rest**

``` xml
https://gibs.earthdata.nasa.gov/wmts/epsg{EPSG:Code}/best/{LayerIdentifier}/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.{FormatExt}
```

  - [GetCapabilities](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml)
  - [Tile](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2012-07-09/250m/6/13/36.jpg)


**KVP**

``` xml
https://gibs.earthdata.nasa.gov/wmts/epsg{EPSG:Code}/best/wmts.cgi?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER={LayerIdentifier}&STYLE=&TIME={Time}&TILEMATRIXSET={TileMatrixSet}&TILEMATRIX={TileMatrix}&TILEROW={TileRow}&TILECOL={TileCol}&FORMAT={FormatMime}
```

- [GetCapabilities](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?SERVICE=WMTS&request=GetCapabilities)
- [GetTile](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=MODIS_Terra_CorrectedReflectance_TrueColor&STYLE=&TILEMATRIXSET=250m&TILEMATRIX=6&TILEROW=13&TILECOL=36&FORMAT=image%2Fjpeg&TIME=2012-07-09)


### Example Clients
* [NASA Worldview](https://worldview.earthdata.nasa.gov)
* [OpenLayers v2 and v3, Leaflet, Bing Maps, Google Maps](https://github.com/nasa-gibs/gibs-web-examples)



## OGC Web Map Service (WMS)
### Overview
The [Open Geospatial Consortium (OGC) Web Map Service (WMS)](http://www.opengeospatial.org/standards/wms/) provides a way for clients to receive a customized WMS response based on request parameters such as a custom bounding box, dimensions, layer(s) and format. Unlike the rigidity enforced through tiled interfaces (e.g. WMTS and TWMS), WMS responses are more flexible and may contain multiple composited layers in a single output. Two WMS specifications are currently available and supported by GIBS: 1.1.1 and 1.3.0. Both WMS specifications support a single method of image retrieval, which is supported by GIBS: Key-Value Pair (KVP).


* EPSG:4326 Endpoint: [https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi)


### Sample Execution
GIBS has chosen to implement the Key-Value Pair and RESTful service interfaces. Equivalent sample requests are included below:

  - [GetCapabilities (1.1.1)](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.1.1)
  - [GetCapabilities (1.3.0)](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0)
  - [GetMap (1.1.1)](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=MODIS_Terra_SurfaceReflectance_Bands721&STYLES=&FORMAT=image%2Fpng&TRANSPARENT=true&HEIGHT=256&WIDTH=256&TIME=2018-10-01&SRS=EPSG:4326&BBOX=-22.5,0,0,22.5)
  - [GetMap (1.3.0)](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MODIS_Terra_SurfaceReflectance_Bands721&STYLES=&FORMAT=image%2Fpng&TRANSPARENT=true&HEIGHT=256&WIDTH=256&TIME=2018-10-01&CRS=EPSG:4326&BBOX=-22.5,0,0,22.5)


### Example Clients
* [QGIS](../gis-usage/#qgis)
* [Esri ArcMap](../gis-usage/#esri-arcgisarcmap)
* [Esri ArcGIS Online](../gis-usage/#esri-arcgis-online)


## Tiled Web Map Service (TWMS)
### Overview
Tiled WMS offers fast response to a limited number of WMS access patterns - specifically those access patterns which provide geographic
bounds which fall along the edges of pregenerated tiles.

Those patterns are described in the TWMS [GetTileService request](https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi?request=GetTileService). The response is an XML encoded list of available WMS access patterns. A TiledPattern access pattern is a set gridded WMS requests, where parameter order, case and content are constant, with the exception of the bbox values. Using this pattern allows fast access to tiles for a given combination of layers and associated styles at a given resolution over a defined area. All the information about a pattern can be extracted form the provided WMS call, using these rules:

Server prefix is defined in the OnlineResource tag Area covered is defined in the LatLonBoundingBox Tile size is provided by the *width* and *height* parameters values Tile format is provided by the *format* parameter value Tile coverage can be computed as *(Lon1-Lon0)* and *(Lat1-Lat0)*, where *Lon1,Lon0,Lat1 and Lat0* are the arguments of the *bbox* parameter. The Grid alignment results from the *bbox* argument and the tile coverage. The *bbox* argument values provided in the pattern are for the top-left tile, the other tile locations can be computed based on the tile coverage. Other metadata that might be of interest to a user is contained in the *Name*, *Title* and *Abstract* tags.

Multiple WMS patterns in a single *TilePattern* are equivalent. *TilePattern* tags that have something in common are grouped in a hierarchical structure build using *TiledGroup* tags. The innermost level refers to the same exact data, possible differences being the image size, image format, resolution, and alignment. Higher level *TiledGroup* are used to group together related datasets.

A client application is expected to request this information only if it is defined as a request in the WMS server Capabilities. Once obtained, the application needs to analyze the patterns, decide which ones can be used and then issue only WMS requests that match the pattern to the normal WMS server, requests that can be built by modifying the *bbox* argument in a *TiledPattern* and prefixing the resulting string with the content of the *OnlineResource* tag.

* EPSG:4326 Endpoint: [https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi](https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi)

### Sample Execution

* [GetCapabilities](https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi?request=GetCapabilities)
* [GetTileService](https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi?request=GetTileService)
* [GetMap](https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi?request=GetMap&layers=MODIS_Terra_CorrectedReflectance_TrueColor&srs=EPSG:4326&format=image/jpeg&styles=&time=2012-07-09&width=512&height=512&bbox=-18,27,-13.5,31.5)

### Example Clients
* [GDAL](../map-library-usage/#gdal)


## Generic XYZ Tile Access (TMS)

The WMTS RESTful interface above can be easily adapted for use as a "generic" XYZ tile server if the developer pre-populates all of the required fields except the tile row, column, and zoom level. For example, by starting with the most generalized GIBS API request:

``` xml
https://gibs.earthdata.nasa.gov/wmts/epsg{EPSG:Code}/best/{ProductName}/default/{Time}/{TileMatrixSet}/{ZoomLevel}/{TileRow}/{TileCol}.png
```

Populating the fields with the desired projection, product, time, etc (Terra/MODIS Aerosol Optical depth from 2014/04/09, in this case), GIBS
products can be used by clients such as [ESRI's ArcGIS Online](http://www.arcgis.com/home/webmap/viewer.html) to add a "Tile Layer" by leaving the row, column, and zoom level as parameters:

``` xml
https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_Aerosol/default/2014-04-09/GoogleMapsCompatible_Level6/{level}/{row}/{col}.png
```
