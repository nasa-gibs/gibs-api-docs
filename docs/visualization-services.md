# Access Basics

   * [Visualization Services](#visualization-services)
   * [Service Endpoints](#service-endpoints)
   * [Time Dimension](#time-dimension)
   * [Projections & Resolutions](#projections-resolutions)

## Visualization Services

The Global Imagery Browse Services (GIBS) provides visualizations through the following APIs/services, further described on this page:

  * [OGC Web Map Tile Service (WMTS)](#ogc-web-map-tile-service-wmts)
  * [OGC Web Map Service (WMS)](#ogc-web-map-service-wms)
  * [Tiled Web Map Service (TWMS)](#ogc-web-map-service-wms)
  * [Generic XYZ Tile Service (TMS)](#generic-xyz-tile-access-tms)

Each service is publicly available through endpoints specific to the service, projection, and category (e.g. Near Real-Time vs "Best Available") hosted on the [https://gibs.earthdata.nasa.gov](https://gibs.earthdata.nasa.gov) domain. (See [here](../api-advanced-topics/#service-endpoints) for more details)

The following sections provide details regarding each visualization service, sample executions, and reference clients.

### OGC Web Map Tile Service (WMTS)
#### Overview
The [Open Geospatial Consortium (OGC) Web Map Tile Service (WMTS)](http://www.opengeospatial.org/standards/wmts/) provides a way for clients to retrieve tiled mapping data in a standardized manner, handling product-specific details such as available number of zoom levels, map projections, image formats, tile sizes, etc. The WMTS specification provides guidance for three methods of tile retrieval: Key-Value Pair (KVP), REpresentational State Transfer (REST), and Simple Object Access Protocol (SOAP). GIBS supports the KVP and REST access methods.  Example endpoints are found below:

  * KVP EPSG:4326 Endpoint: [https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi)
  * REST EPSG:4326 Endpoint: [https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/)

#### Sample Execution

WMTS requests utilize the following components, which provided context for subsequent examples of both RESTful and KVP access patterns:

  * LayerIdentifier - Unique identifier for a visualization within a specific service endpoint
  * Time - An optional dimension whereby visualizations are separated by data day (i.e. YYYY-MM-DD) or data data/time (i.e. YYYY-MM-DDTHH:MI:SSZ). (See [Time Dimension](../imagery-api-services/#time-dimension))
  * TileMatrixSet - The identifier for the Tile Matrix Set that the visualization utilizes
  * TileMatrix - The tile zoom level (0..N) for the requested tile; Min/Max are dictated by the Tile Matrix
  * TileRow - The tile row (0..N) for the requested tile; Min/Max are dictated by the Tile Matrix
  * TileCol - The tile column (0..N) for the requested tile; Min/Max are dictated by the Tile Matrix
  * FormatExt/FormatMime - The format extension or mime-type of the visualization

**RESTful Access**

GIBS visualizations are accessed via the RESTful WMTS API with URLS that look like this:
``` html
https://gibs.earthdata.nasa.gov/wmts/epsg{EPSG:Code}/best/{LayerIdentifier}/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.{FormatExt}
```
Sample URLs for the supported WMTS requests are provided here:

   - GetCapabilities - [https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml)
   - GetTile - [https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2012-07-09/250m/6/13/36.jpg](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2012-07-09/250m/6/13/36.jpg)


**KVP Access**

GIBS visualizations are accessed via the KVP WMTS API with URLS that look like this:

``` html
https://gibs.earthdata.nasa.gov/wmts/epsg{EPSG:Code}/best/wmts.cgi?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER={LayerIdentifier}&STYLE=&TIME={Time}&TILEMATRIXSET={TileMatrixSet}&TILEMATRIX={TileMatrix}&TILEROW={TileRow}&TILECOL={TileCol}&FORMAT={FormatMime}
```
Sample URLs for the supported WMTS requests are provided here:

   - GetCapabilities - [https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?SERVICE=WMTS&request=GetCapabilities](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?SERVICE=WMTS&request=GetCapabilities)
   - GetTile - [https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0 &LAYER=MODIS_Terra_CorrectedReflectance_TrueColor&STYLE= &TILEMATRIXSET=250m&TILEMATRIX=6&TILEROW=13&TILECOL=36&FORMAT=image%2Fjpeg&TIME=2012-07-09](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=MODIS_Terra_CorrectedReflectance_TrueColor&STYLE=&TILEMATRIXSET=250m&TILEMATRIX=6&TILEROW=13&TILECOL=36&FORMAT=image%2Fjpeg&TIME=2012-07-09)


#### Example Clients
   * [NASA Worldview](https://worldview.earthdata.nasa.gov)
   * [OpenLayers v2 and v3, Leaflet, Bing Maps, Google Maps](https://github.com/nasa-gibs/gibs-web-examples)



### OGC Web Map Service (WMS)
#### Overview
The [Open Geospatial Consortium (OGC) Web Map Service (WMS)](http://www.opengeospatial.org/standards/wms/) provides a way for clients to receive a customized WMS response based on request parameters such as a custom bounding box, dimensions, layer(s) and format. Unlike the rigidity enforced through tiled interfaces (e.g. WMTS and TWMS), WMS responses are more flexible and may contain multiple composited layers in a single output. Two WMS specifications are currently available and supported by GIBS: 1.1.1 and 1.3.0. Both WMS specifications support a single method of image retrieval, which is supported by GIBS: Key-Value Pair (KVP).

   * KVP EPSG:4326 Endpoint: [https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi)


#### Sample Execution
GIBS visualizations comply with the WMS OGC specification. Sample URLs for the supported WMS requests are provided here:

  - GetCapabilities (1.1.1) - [https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.1.1](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.1.1)
  - GetCapabilities (1.3.0) - [https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0)
  - GetMap (1.1.1) - [https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1 &LAYERS=MODIS_Terra_SurfaceReflectance_Bands721&STYLES=&FORMAT=image%2Fpng&TRANSPARENT=true &HEIGHT=256&WIDTH=256&TIME=2018-10-01&SRS=EPSG:4326&BBOX=-22.5,0,0,22.5](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=MODIS_Terra_SurfaceReflectance_Bands721&STYLES=&FORMAT=image%2Fpng&TRANSPARENT=true&HEIGHT=256&WIDTH=256&TIME=2018-10-01&SRS=EPSG:4326&BBOX=-22.5,0,0,22.5)
   - GetMap (1.3.0) - [https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0 &LAYERS=MODIS_Terra_SurfaceReflectance_Bands721&STYLES=&FORMAT=image%2Fpng&TRANSPARENT=true &HEIGHT=256&WIDTH=256&TIME=2018-10-01&CRS=EPSG:4326&BBOX=-22.5,0,0,22.5](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MODIS_Terra_SurfaceReflectance_Bands721&STYLES=&FORMAT=image%2Fpng&TRANSPARENT=true&HEIGHT=256&WIDTH=256&TIME=2018-10-01&CRS=EPSG:4326&BBOX=-22.5,0,0,22.5)


#### Example Clients
* [QGIS](../gis-usage/#qgis)
* [Esri ArcMap](../gis-usage/#esri-arcgisarcmap)
* [Esri ArcGIS Online](../gis-usage/#esri-arcgis-online)


### Tiled Web Map Service (TWMS)
#### Overview
Tiled WMS offers fast response to a limited number of WMS access patterns - specifically those access patterns which provide geographic
bounds which fall along the edges of pregenerated tiles.

Those patterns are described in the TWMS [GetTileService request](https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi?request=GetTileService). The response is an XML encoded list of available WMS access patterns. A TiledPattern access pattern is a set gridded WMS requests, where parameter order, case and content are constant, with the exception of the bbox values. Using this pattern allows fast access to tiles for a given combination of layers and associated styles at a given resolution over a defined area. All the information about a pattern can be extracted form the provided WMS call, using these rules:

Server prefix is defined in the OnlineResource tag Area covered is defined in the LatLonBoundingBox Tile size is provided by the *width* and *height* parameters values Tile format is provided by the *format* parameter value Tile coverage can be computed as *(Lon1-Lon0)* and *(Lat1-Lat0)*, where *Lon1,Lon0,Lat1 and Lat0* are the arguments of the *bbox* parameter. The Grid alignment results from the *bbox* argument and the tile coverage. The *bbox* argument values provided in the pattern are for the top-left tile, the other tile locations can be computed based on the tile coverage. Other metadata that might be of interest to a user is contained in the *Name*, *Title* and *Abstract* tags.

Multiple WMS patterns in a single *TilePattern* are equivalent. *TilePattern* tags that have something in common are grouped in a hierarchical structure build using *TiledGroup* tags. The innermost level refers to the same exact data, possible differences being the image size, image format, resolution, and alignment. Higher level *TiledGroup* are used to group together related datasets.

A client application is expected to request this information only if it is defined as a request in the WMS server Capabilities. Once obtained, the application needs to analyze the patterns, decide which ones can be used and then issue only WMS requests that match the pattern to the normal WMS server, requests that can be built by modifying the *bbox* argument in a *TiledPattern* and prefixing the resulting string with the content of the *OnlineResource* tag.

   * EPSG:4326 Endpoint: [https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi](https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi)

#### Sample Execution
Sample URLs for the supported TWMS requests are provided here:

* GetCapabilities - [https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi?request=GetCapabilities](https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi?request=GetCapabilities)
* GetTileService - [https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi?request=GetTileService](https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi?request=GetTileService)
* GetMap - [https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi?request=GetMap &layers=MODIS_Terra_CorrectedReflectance_TrueColor&srs=EPSG:4326&format=image/jpeg&styles=&time=2012-07-09 &width=512&height=512&bbox=-18,27,-13.5,31.5](https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi?request=GetMap&layers=MODIS_Terra_CorrectedReflectance_TrueColor&srs=EPSG:4326&format=image/jpeg&styles=&time=2012-07-09&width=512&height=512&bbox=-18,27,-13.5,31.5)

#### Example Clients
* [GDAL](../map-library-usage/#gdal)


### Generic XYZ Tile Access (TMS)

The WMTS RESTful interface above can be easily adapted for use as a "generic" XYZ tile server if the developer pre-populates all of the required fields except the tile row, column, and zoom level. For example, by starting with the most generalized GIBS API request:

``` html
https://gibs.earthdata.nasa.gov/wmts/epsg{EPSG:Code}/best/{ProductName}/default/{Time}/{TileMatrixSet}/{ZoomLevel}/{TileRow}/{TileCol}.png
```

Populating the fields with the desired projection, product, time, etc (Terra/MODIS Aerosol Optical depth from 2014/04/09, in this case), GIBS
products can be used by clients such as [ESRI's ArcGIS Online](http://www.arcgis.com/home/webmap/viewer.html) to add a "Tile Layer" by leaving the row, column, and zoom level as parameters:

``` html
https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_Aerosol/default/2014-04-09/GoogleMapsCompatible_Level6/{level}/{row}/{col}.png
```


## Service Endpoints

GIBS imagery layers are made available through standard access methods, described in a following section of this page. Where applicable, those services have multiple "endpoints" that contain a specific set of GIBS imagery layers. The endpoints are scoped using the following items:

1. Service - Either the WMTS, WMS, or TWMS specification.
2. Projection - The EPSG code for the appropriate projection.
3. Category - The "type" of visualization layers available in the endpoint. Valid values include:
    * **best** - The "Best Available" imagery products. (See [Best Available Layers](../api-advanced-topics/#best-availble-layers))
    * **std** - Standard imagery products only.
    * **nrt** - Near Real-Time imagery products only.
    * **all** - All Best Available, Standard, and Near Real-Time imagery products.

The pattern for a GIBS service endpoint is shown below. Parameterized elements of the pattern are provided in \{parameter:value1[|value2]*\} notation.

``` xml
https://gibs.earthdata.nasa.gov/{service:wmts|wms|twms}/epsg{code:4326|3857|3413|3031}/{type:all|best|nrt|std}
```

The following table provides some sample endpoints for various unique combinations:

| Service | EPSG | Type | Sample Endpoint | Sample URLs |
| ------- | ---- | ---- | --------------- | --------------- |
| WMTS    | 4326 | all  | https://gibs.earthdata.nasa.gov/wmts/epsg4326/all/ | [KVP GetCapabilities](https://gibs.earthdata.nasa.gov/wmts/epsg4326/all/wmts.cgi?SERVICE=WMTS&request=GetCapabilities) / [Rest Tile](https://gibs.earthdata.nasa.gov/wmts/epsg4326/all/Coastlines/default/2021-04-13/250m/0/0/0.png)
| WMS     | 3857 | best | https://gibs.earthdata.nasa.gov/wms/epsg3857/best/ | [1.1.1 GetCapabilities](https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.1.1) / [1.3.0 GetMap](https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?version=1.3.0&service=WMS&request=GetMap&format=image/png&STYLE=default&bbox=-8000000,-8000000,8000000,8000000&CRS=EPSG:3857&HEIGHT=600&WIDTH=600&TIME=1999-04-10&layers=Landsat_WELD_CorrectedReflectance_Bands157_Global_Annual)
| TWMS    | 3413 | nrt  | https://gibs.earthdata.nasa.gov/twms/epsg3413/nrt/ | [GetTileService](https://gibs.earthdata.nasa.gov/twms/epsg3413/best/twms.cgi?request=GetTileService) / [GetMap](https://gibs.earthdata.nasa.gov/twms/epsg3413/best/twms.cgi?request=GetMap&layers=MODIS_Terra_CorrectedReflectance_TrueColor&srs=EPSG:3413&format=image%2Fjpeg&styles=&time=default&width=512&height=512&bbox=2097152,-1048576,2621440,-524288)


##Projections & Resolutions

GIBS supports imagery products in the following projections. In order to facilitate the pre-generation of tiled imagery, GIBS has selected a set of resolutions within each projection.

* EPSG:4326 - Lat-lon / Geographic / WGS 84
* EPSG:3857 - Web Mercator / Spherical Mercator / "Google Projection"
* EPSG:3413 - NSIDC Sea Ice Polar Stereographic North
* EPSG:3031 - Antarctic Polar Stereographic / WGS 84

When developing new imagery layers, GIBS works with the imagery providers to determine the "appropriate" projections and resolution. The following guidelines will help you access these layers:

1. Imagery layers may not be available in all projections.
2. Imagery layers available in multiple projections utilize the same identifiers.
3. Imagery layers available in the EPSG:4326, EPSG:3413, and EPSG:3031 projections are provided at the same resolution.
4. Imagery layers available in the EPSG:4326 "Geographic" projection are available in the EPSG:3857 "Web Mercator" projection.
* Note: Some of the non-data (e.g. coastlines, land mask) may not be available in EPSG:3857.

For each projection and resolution, a certain number of zoom levels are available for tiled access services (i.e. WMTS and TWMS). Each zoom level corresponds to a "power of 2" zoom in/out from the previous/next level. This information can be used to configure your [map client](/map-library-usage) to work with GIBS. Note that the GIBS spatial coverage of the Geographic and Web Mercator projections match the full extent of the projections, as defined by the EPSG. The GIBS spatial coverages of the north and south polar projections are a subset of the full projection extent, as defined by the EPSG. The GIBS' extents were selected to a) cover the main land/ice masses at each pole and b), to ensure that the full resolution image has a resolution and pixel height/width that are a power of two as required for tiled access and zooming.

The following subsections provide additional information regarding the GIBS projections and their available resolutions:

### WGS 84 / Lat-lon / Geographic (EPSG:4326)

![EPSG4326](img/espg4326.png)

*Lat-lon / Geographic / WGS 84 (EPSG:4326)*

| Resolution (per pixel) | Tile Matrix Set (WMTS) | # Zoom Levels | Max Resolution (deg/pixel) | Min Resolution (deg/pixel) |
| ---------------------- | ---------------------- | ------------- | -------------------------- | -------------------------- |
| 15.125m | 15.125m | 13 | 0.5625 | 0.0001373291015625 |
| 31.25m | 31.25m | 12 | 0.5625 | 0.000274658203125 |
| 250m | 250m | 9 | 0.5625 | 0.002197265625 |
| 500m | 500m | 8 | 0.5625 | 0.00439453125 |
| 1km | 1km | 7 | 0.5625 | 0.0087890625 |
| 2km | 2km | 6 | 0.5625 | 0.017578125 |

### Web Mercator (EPSG:3857)

![webmerc](img/webmerc-sm.png)

*Web Mercator / Spherical Mercator / "Google Projection" (EPSG:3857)*

| Resolution (per pixel) | Tile Matrix Set (WMTS) | # Zoom Levels | Max Resolution (deg/pixel) | Min Resolution (deg/pixel) |
| ---------------------- | ---------------------- | ------------- | -------------------------- | -------------------------- |
| 19.10925707129405m | GoogleMapsCompatible_Level13 | 13 | 156543.03390625 | 19.10925707129405 |
| 38.21851414258810m | GoogleMapsCompatible_Level12 | 12 | 156543.03390625 | 38.21851414258810 |
| 305.7481131407048m | GoogleMapsCompatible_Level9 | 9 | 156543.03390625 | 305.7481131407048 |
| 611.4962262814100m | GoogleMapsCompatible_Level8 | 8 | 156543.03390625 | 611.4962262814100 |
| 1222.992452562820m | GoogleMapsCompatible_Level7 | 7 | 156543.03390625 | 1222.992452562820 |
| 2445.984905125640m | GoogleMapsCompatible_Level6 | 6 | 156543.03390625 | 2445.984905125640 |

### NSIDC Sea Ice Polar Stereographic North (EPSG:3413)

![arctic](img/arctic-sm.png)

*NSIDC Sea Ice Polar Stereographic North (EPSG:3413)*

| Resolution (per pixel) | Tile Matrix Set (WMTS) | # Zoom Levels | Max Resolution (deg/pixel) | Min Resolution (deg/pixel) |
| ---------------------- | ---------------------- | ------------- | -------------------------- | -------------------------- |
| 250m | 250m | 6 | 8192.0 | 256. |
| 500m | 500m | 5 | 8192.0 | 512. |
| 1km | 1km | 4 | 8192.0 | 1024. |
| 2km | 2km | 3 | 8192.0 | 2048. |

### Antarctic Polar Stereographic (EPSG:3031)

![arctic](img/antarctic-sm.png)

*Antarctic Polar Stereographic / WGS 84 (EPSG:3031)*

| Resolution (per pixel) | Tile Matrix Set (WMTS) | # Zoom Levels | Max Resolution (deg/pixel) | Min Resolution (deg/pixel) |
| ---------------------- | ---------------------- | ------------- | -------------------------- | -------------------------- |
| 250m | 250m | 6 | 8192.0 | 256.0 |
| 500m | 500m | 5 | 8192.0 | 512.0 |
| 1km | 1km | 4 | 8192.0 | 1024.0 |
| 2km | 2km | 3 | 8192.0 | 2048.0 |

## Time Dimension
The core concept within the GetCapabilities response is a map layer. GIBS map layers represent data that changes over time, most commonly providing a different map each day. Therefore, the layer definition within the GIBS GetCapabilities response must present a time dimension.

#### OGC Web Map Tile Service (WMTS)
The GIBS team has chosen to address this in the following manner, within each layer:

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


### OGC Web Map Service (WMS)

The GIBS team has chosen to address this in the following manner, as outlined in the respective OGC WMS specification:

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


### Tiled Web Map Service (TWMS)
The 'time' parameter follows the form YYYY-MM-DD which should be included in the request for a time-varying layer; if the time dimension is omitted in the TWMS request, tiles for the current UTC date will be returned. Be aware that many of the current date’s tiles will be empty because the imagery is generated as the satellites orbit from east to west.

See [WMS above](#ogc-web-map-service-wms)