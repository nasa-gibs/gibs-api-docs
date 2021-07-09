**Imagery Layers & Endpoints**

GIBS imagery layers are named and made available through a set of defined endpoints based on the following characteristics:

1. **Projection & Resolution** - Imagery layers are available in one or more projected coordinate systems (e.g. EPSG:4326 - "Geographic Lat/Lon")
at a specific resolution (e.g. 2km/pixel)
2. **Near Real-Time vs Standard Latency** - Imagery layers are available in a near real-time (e.g. within 3 hours of observation) or standard (e.g.
within X days of observation) latency.
3. **Data Version** - Imagery layers may be available for more than one version (e.g. MODIS v5 and v6) of the same science parameter.

You will note in the list of [available GIBS products](https://wiki.earthdata.nasa.gov/display/GIBS/GIBS+Available+Imagery+Products), that there are columns for "Projection(s)" and "Resolution", which correspond to the information provided below. GIBS services additionally provide machine-readable documents (e.g. WMTS "Get Capabilities") that provide specific information regarding all available imagery layers.

For GIBS service endpoints, additional DNS entries are available as a way to circumvent simultaneous connection limits of the web browser (as described here ). The additional DNS entries are [https://gibs-a.earthdata.nasa.gov](https://gibs-a.earthdata.nasa.gov), [https://gibs-b.earthdata.nasa.gov](https://gibs-b.earthdata.nasa.gov), and [https://gibs-c.earthdata](https://gibs-c.earthdata).
nasa.gov. Please note that these are not additional servers, simply aliases for the [https://gibs.earthdata.nasa.gov](https://gibs.earthdata.nasa.gov) domain.

The remainder of this section provides additional details regarding how GIBS imagery layers are named and made available through service endpoints. These details provide a thorough description of the available configurations of the GIBS imagery layers. Outside of this section, this page will reference only the "Best Available" imagery layers and endpoints, described below, for simplicity.