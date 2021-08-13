The Global Imagery Browse Services (GIBS) vision is to provide visual access to NASA’s Earth observations through standardized web services. These services are designed to facilitate visual discovery of scientific phenomena, support timely decision making for natural hazards, educate the next generation of scientists, and make imagery of the planet more accessible to the media and public. Browse all of this imagery through our [Worldview](https://worldview.earthdata.nasa.gov) interface.

**Overview**

The Global Imagery Browse Services (GIBS) are designed to deliver global, full-resolution satellite imagery to users in a highly responsive manner, enabling interactive exploration of the Earth. To achieve that interactivity, GIBS first ingests imagery from a given NASA data provider on a continuous basis, creates a global mosaic of that imagery, then chops the mosaic into an image tile pyramid (see figure below). By pre-generating these tiles, it relieves the servers of image rescaling and cropping duties, greatly reducing computational overhead and enabling a highly responsive system. This also means that the primary method of imagery retrieval for clients is tile-based. For more background on how tiled web maps work, see the [MapBox Developers Guide](https://www.mapbox.com/help/how-web-maps-work/).

![tile_pyramid](img/tile_pyramid.png)

*An image tile pyramid (from [OGC WMTS 1.0.0 specification](http://www.opengeospatial.org/standards/wmts))*

## Access

GIBS visualization layers are made available through a standards-compliant set of defined endpoints based on the following characteristics:

1. **Projection & Resolution** - Imagery layers are available in one or more projected coordinate systems (e.g. EPSG:4326 - "Geographic Lat/Lon") at a specific resolution (e.g. 2km/pixel)
2. **Near Real-Time vs Standard Latency** - Imagery layers are available in a near real-time (e.g. within 3 hours of observation) or standard (e.g. within X days of observation) latency.
3. **Data Version** - Imagery layers may be available for more than one version (e.g. MODIS v5 and v6) of the same science parameter.

http://127.0.0.1:8000/imagery-api-services/#projections-resolution
http://127.0.0.1:8000/imagery-api-services/#layer-naming-convention
http://127.0.0.1:8000/imagery-api-services/#best-available-layers
http://127.0.0.1:8000/imagery-api-services/#service-endpoints

You will note in the list of [available GIBS products](https://wiki.earthdata.nasa.gov/display/GIBS/GIBS+Available+Imagery+Products), that there are columns for "Projection(s)" and "Resolution", which correspond to the information provided below. GIBS services additionally provide machine-readable documents (e.g. WMTS "Get Capabilities") that provide specific information regarding all available imagery layers.

While the requests made to GIBS are for individual tiles, users generally work at a higher level and configure a [map library](http://127.0.0.1:8000/map-library-usage/), [GIS client](http://127.0.0.1:8000/gis-usage/), or [script](http://127.0.0.1:8000/#script-level-access-via-gdal) to
determine which tiles to retrieve. These clients and scripts need to know which [products are available](https://wiki.earthdata.nasa.gov/display/GIBS/GIBS+Available+Imagery+Products), which map projections are available, and how many zoom levels they support. GIBS provides this access through five mechanisms:

1. An Open Geospatial Consortium (OGC) **Web Map Tile Service (WMTS)** which supports key-value-pair and RESTful tiled requests
2. An Open Geospatial Consortium (OGC) **Web Map Service (WMS)** which supports a key-value-pair non-tiled requests
3. A **Tiled Web Map Service (TWMS)**, an unofficial extension to the OGC Web Map Service (WMS), which supports key-value-pair tiled requests that match the exact geographic tile boundaries
4. Script-level access through the **Geospatial Data Abstraction Library (GDAL)**

The implementation of these services is built from the long-running "OnEarth" server system at NASA/JPL.

Access to GIBS via OGC WMTS, OGC WMS, Tiled WMS, and GDAL is described below.

In addition, source code for the GIBS tiled imagery server and tiled imagery storage format is available. See [this blog post](https://wiki.earthdata.nasa.gov/display/GIBS/2014/02/04/OnEarth+and+MRF+Now+Available+on+GitHub) for more info along with the [code on GitHub](https://github.com/nasa-gibs/onearth).