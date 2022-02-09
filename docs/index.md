# Introduction
## Overview
NASA's Global Imagery Browse Services (GIBS) system provides visualizations of NASA Earth Science observations through standardized web services. These services deliver global, full-resolution visualizations of satellite data to users in a highly responsive manner, enabling visual discovery of scientific phenomena, supporting timely decision-making for natural hazards, educating the next generation of scientists, and making imagery of the planet more accessible to the media and public. Browse all of these visualizations through our [Worldview](https://worldview.earthdata.nasa.gov){:target="_blank"} application.

GIBS visualization layers are based satellite data that has been transformed into pre-generated visualizations stored as a tile pyramid (see figure below).  GIBS coordinates with NASA data centers and science teams to regularly ingest visualizations based on remotely sensed satellite data.  By processing, storing, and serving these visualizations as pre-generated tiles, GIBS can enable highly responsive access to its visualizations.  See [here](https://en.wikipedia.org/wiki/Tiled_web_map){:target="_blank"} for more background on how tiled web maps work.

![tile_pyramid](img/tile_pyramid.png)[^1]
[^1]: A tile pyramid (from [OGC WMTS 1.0.0 specification](http://www.opengeospatial.org/standards/wmts){:target="_blank"})

GIBS services are built atop the open source [OnEarth](https://github.com/nasa-gibs/onearth){:target="_blank"} software and [Meta Raster Format (MRF)](https://github.com/nasa-gibs/mrf){:target="_blank"} format. Visit those projects on GitHub to learn more or become a contributor.

## More Information
Visit the following content areas within this documentation site to learn more about GIBS visualizations and how to integrate them into your applications or utilities.

* [**Available Visualizations**](./available-visualizations/) - Learn more about what visualizations are available to you
* [**Access Basics**](./access-basics/) - Learn the basics about accessing visualizations through GIBS services
* [**Access Advanced Topics**](./access-advanced-topics/) - Take a deeper dive into advanced topics related to accessing and interpreting GIBS visualizations
* [**Accessing via GIS Applications**](./gis-usage/) - Learn how to access GIBS imagery via Geographic Information System (GIS) applications
* [**Accessing via Map Libraries and Scripts**](./map-library-usage/) - Learn how to access GIBS imagery from interactive mapping libraries and GDAL-based scripts

Contact us at [support@earthdata.nasa.gov](mailto:support@earthdata.nasa.gov) if you have additional questions. 

You may also visit the [GIBS landing page](https://earthdata.nasa.gov/gibs){:target="_blank"} for high-level information and the [GIBS blog](https://wiki.earthdata.nasa.gov/pages/viewrecentblogposts.action?key=GIBS){:target="_blank"} for periodic updates on new Worldview features, GIBS service enhancements, and visualization layers.

## Data Use Policy and Acknowledgements

NASA supports an [open data policy](https://earthdata.nasa.gov/earth-science-data-systems-program/policies){:target="_blank"}. We ask that users who make use of GIBS in their clients or when referencing it in written or oral presentations to add the following acknowledgment:

> _We acknowledge the use of imagery provided by services from NASA's Global Imagery Browse Services (GIBS), part of NASA's Earth Observing System Data and Information System (EOSDIS)._
