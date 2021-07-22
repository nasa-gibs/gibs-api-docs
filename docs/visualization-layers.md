# Visualization Layers


GIBS visualization layers are made available through a set of defined endpoints based on the following characteristics:

1. **Projection & Resolution** - Imagery layers are available in one or more projected coordinate systems (e.g. EPSG:4326 - "Geographic Lat/Lon")
   at a specific resolution (e.g. 2km/pixel)
2. **Near Real-Time vs Standard Latency** - Imagery layers are available in a near real-time (e.g. within 3 hours of observation) or standard (e.g.
   within X days of observation) latency.
3. **Data Version** - Imagery layers may be available for more than one version (e.g. MODIS v5 and v6) of the same science parameter.

You will note in the list of [available GIBS products](https://wiki.earthdata.nasa.gov/display/GIBS/GIBS+Available+Imagery+Products), that there are columns for "Projection(s)" and "Resolution", which correspond to the information provided below. GIBS services additionally provide machine-readable documents (e.g. WMTS "Get Capabilities") that provide specific information regarding all available imagery layers.


## Available Imagery Products

Currently, the list of [Available Imagery Products](https://wiki.earthdata.nasa.gov/display/GIBS/GIBS+Available+Imagery+Products) can be found on the GIBS wiki.

## Visualization Types

### Raster

True / False Color

Data Valued... 


### Vector

Vector products are accessible through the GIBS WMTS and WMS services. WMTS responses are formatted as gzip-compressed Mapbox vector tiles ([specification](https://docs.mapbox.com/vector-tiles/specification/)), or "MVTs", while WMS responses are available as raster images. See the [Access](#access) section below for more information.

The data behind each visualization service is the same, however the mechanism for styling differs. A client application is responsible for applying styling to MVTs when using the WMTS API. Conversely, GIBS applies a default style when rendering vector data as a raster when using the WMS API. See the [Vector Layer Styles](#vector-styling) section below for more information.

An MVT returned via the WMTS service contains information for a client to draw the features within the user interface, but also a set of properties that contain data associated with the feature. The Mapbox vector tile specification provides structure for representing these data, but no mechanism for interpreting the meaning or intended use. As such, additional metadata is required. GIBS has developed a specification for defining each property contained within MVTs in its vector products. See the [Vector Layer Metadata](#vector-metadata) section below for more information.

NOTE: Vector products are not natively provided in the EPSG:3857 projection through either the WMTS or WMS services.  A workaround for WMS requests is to utilize the EPSG:4326 endpoint with EPSG:3857-based SRS and BBOX query parameters ([example](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?service=WMS&request=GetMap&version=1.1.1&layers=VIIRS_SNPP_Thermal_Anomalies_375m_All&styles=&format=image%2Fpng&transparent=false&srs=EPSG:3857&width=480&height=480&bbox=-20037508,-20037508,20037508,20037508&time=2020-01-01)).


