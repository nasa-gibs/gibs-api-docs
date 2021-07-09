**Projections & Resolution**

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

#### WGS 84 / Lat-lon / Geographic (EPSG:4326)

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

#### Web Mercator (EPSG:3857)

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

#### NSIDC Sea Ice Polar Stereographic North (EPSG:3413)

![arctic](img/arctic-sm.png)

*NSIDC Sea Ice Polar Stereographic North (EPSG:3413)*

| Resolution (per pixel) | Tile Matrix Set (WMTS) | # Zoom Levels | Max Resolution (deg/pixel) | Min Resolution (deg/pixel) |
| ---------------------- | ---------------------- | ------------- | -------------------------- | -------------------------- |
| 250m | 250m | 6 | 8192.0 | 256. |
| 500m | 500m | 5 | 8192.0 | 512. |
| 1km | 1km | 4 | 8192.0 | 1024. |
| 2km | 2km | 3 | 8192.0 | 2048. |

#### Antarctic Polar Stereographic (EPSG:3031)

![arctic](img/antarctic-sm.png)

*Antarctic Polar Stereographic / WGS 84 (EPSG:3031)*

| Resolution (per pixel) | Tile Matrix Set (WMTS) | # Zoom Levels | Max Resolution (deg/pixel) | Min Resolution (deg/pixel) |
| ---------------------- | ---------------------- | ------------- | -------------------------- | -------------------------- |
| 250m | 250m | 6 | 8192.0 | 256.0 |
| 500m | 500m | 5 | 8192.0 | 512.0 |
| 1km | 1km | 4 | 8192.0 | 1024.0 |
| 2km | 2km | 3 | 8192.0 | 2048.0 |