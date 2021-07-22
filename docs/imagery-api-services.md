# API Advanced Topics


## Layer Naming Convention
GIBS visualization layer identifiers follow a human-readable convention (e.g. *MODIS_Terra_Aerosol_Optical_Depth_v6_STD*) to simplify situations where manual parsing of service documentation (e.g. WMTS GetCapabilities) is performed. Identifiers include uniquely identifying information like the following items:

* **Instrument/Platform** - The Instrument and Platform responsible for collecting the visualized data (e.g. "MODIS / Terra")
* **Science Parameter** - The science parameter that is being visualized (e.g. "Aerosol Optical Depth")
* **Processing Level** - The processing level of the associated data (e.g. "L3" or "L2")
* **Data Period** - The period of the available imagery products (e.g. "Monthly")
* **Data Version** - The version of the associated data product (e.g. "v6")
* **Data Latency** - The latency of the associated data product (e.g. "STD" or "NRT")

The following are examples of visualization layer identifiers for the "Aerosol Optical Depth" science parameter collected by the MODIS instrument on the Terra platform. In this example, visualization layers exist for a combination of data versions and latencies. The first item is considered the "Best Available" layer, which is described further in the following section.

* MODIS_Terra_Aerosol_Optical_Depth
* MODIS_Terra_Aerosol_Optical_Depth_v6_NRT
* MODIS_Terra_Aerosol_Optical_Depth_v6_STD
* MODIS_Terra_Aerosol_Optical_Depth_v5_NRT


## "Best Available" Layers

Visualization layers representing the same science parameter from a specific instrument and platform may be available for multiple versions and/or data latencies. Direct access to those various flavors of the same visualization are directly available. However, many users are simply interested in seeing a consistent "best available" visualization. The details of what is "best" being determined by the GIBS team. Therefore, GIBS provides a unique set of "Best Available" visualization layers for all of its visualization layers, abstracting away the individual versions and latencies. A similar naming convention is used, as described in the previous section, but identifiers do not specify the version or latency (e.g. *MODIS_Terra_Aerosol_Optical_Depth*).

For each "best available" layer, the "best" image will be determined based on the evaluation of availability for following imagery products:

1. Latest Version Standard Product
2. Latest Version NRT
3. Previous Version Standard Product
4. Previous Version NRT

![versions](img/versions.png)

See the image above for a visual example. The top four bars show the temporal coverage of related imagery products. The bottom bar shows the visualization products that will be returned based on the "best available" determination.


## Domain Sharding
Browsers typically limit the number of concurrent requests to the same server, based on hostname. In order to ake tiles load more quickly, it often makes sense to distribute requests over multiple hostnames to achieve more concurrency. Typically, browsers perform best with 3 different hostnames -- your performance may vary. (For example, if your server can't handle more than 2 requests simultaneously, then additional hostnames will not help you.)

HTTPS 2.0 vs 1.1... currently still 1.1... so additional DNS entries are available as a way to circumvent simultaneous connection limits of the web browser. The additional DNS entries are [https://gibs-a.earthdata.nasa.gov](https://gibs-a.earthdata.nasa.gov), [https://gibs-b.earthdata.nasa.gov](https://gibs-b.earthdata.nasa.gov), and [https://gibs-c.earthdata](https://gibs-c.earthdata).
nasa.gov. Please note that these are not additional servers, simply aliases for the [https://gibs.earthdata.nasa.gov](https://gibs.earthdata.nasa.gov) domain.


## Service Endpoints

GIBS imagery layers are made available through standard access methods, described in a following section of this page. Where applicable, those services have multiple "endpoints" that contain a specific set of GIBS imagery layers. The endpoints are scoped using the following items:

1. Service - Either the WMTS, WMS, or TWMS specification.
2. Projection - The EPSG code for the appropriate projection.
3. Category - The "type" of visualization layers available in the endpoint. Valid values include:
   * **best** - The "Best Available" imagery products.
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

See WMS above


##Projections & Resolution

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


## Vector Visualizations


### WMTS Access

Accessing a vector product through the WMTS service follows the same rules as raster products. The primary differences being the format specified
in the request and of the response. When issuing a KVP WMTS request, the "format" value must be application/vnd.mapbox-vector-tile.
When issuing a REST-ful WMTS request, the extension must be .mvt. See below for examples of each:

* [KVP Tile](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?TIME=2020-10-01T00:00:00Z&FORMAT=application/vnd.mapbox-vector-tile&layer=VIIRS_NOAA20_Thermal_Anomalies_375m_All&tilematrixset=500m&Service=WMTS&Request=GetTile&Version=1.0.0&TileMatrix=4&TileCol=4&TileRow=3)
* [REST Tile](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/VIIRS_NOAA20_Thermal_Anomalies_375m_All/default/2020-10-01T00:00:00Z/500m/4/3/4.mvt)

The response to a KVP or REST-ful WMTS response will be a gzip-compressed MVT. The following Python code snippet provides an example of
how to download and print out the contents of a vector tile. Note that the Python [requests](https://requests.readthedocs.io/en/master/) library is automatically decoding the gzip'd response.

**MVT Tile Printer**

``` python
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

**NOTE** - Vector products are not natively provided in the EPSG:3857 projection through the WMTS service. At present there is no workaround.


### WMS

Accessing a vector product through the WMS service follows the same rules as raster products. Both version 1.1.1. and 1.3.0 WMS GetMap requests
will return rasterized representations of the vector product. See below for an example request and response:

* Request: [1.1.1 GetMap](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?/wms/epsg4326/best/wms.cgi?TIME=2020-10-01T00:00:00Z&LAYERS=VIIRS_NOAA20_Thermal_Anomalies_375m_All&REQUEST=GetMap&SERVICE=WMS&FORMAT=image/png&STYLES=&HEIGHT=240&VERSION=1.1.1&SRS=epsg:4326&WIDTH=480&BBOX=-180,-90,180,90&TRANSPARENT=TRUE)
* Response: (See Below)

![wms_response](img/wms_response.png)

Almost all raster layers in the GIBS WMS service provide a link to a pre-generated legend image as the LegendURL associated with the default style. This image is generated from the associated XML colormap. However, for vector products, the GIBS WMS service utilizes the `GetLegendGraphic` request as the basis for a layer's LegendURL. The following snippet shows how this is defined in the WMS Capabilities document. 

``` xml
<Style>
  <LegendURL width="138" height="23">
    <Format>image/png</Format>
    <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?version=1.1.1&service=WMS&request=GetLegendGraphic&layer=VIIRS_NOAA20_Thermal_Anomalies_375m_All&format=image/png&STYLE=default"/>
  </LegendURL>
</Style>
```

Issuing the sample request returns the following image.

![thermal_anomaly](img/thermal_anomaly.png)

**NOTE** - Vector products are not natively provided in the EPSG:3857 projection through the WMS services  A workaround is to utilize the EPSG:4326 endpoint with EPSG:3857-based SRS and BBOX query parameters ([example](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?service=WMS&request=GetMap&version=1.1.1&layers=VIIRS_SNPP_Thermal_Anomalies_375m_All&styles=&format=image%2Fpng&transparent=false&srs=EPSG:3857&width=480&height=480&bbox=-20037508,-20037508,20037508,20037508&time=2020-01-01)).