# Introduction
## Overview
The Global Imagery Browse Services (GIBS) provides visual access to NASA’s Earth observations through standardized web services. These services deliver global, full-resolution visualizations of satellite data to users in a highly responsive manner, enabling visual discovery of scientific phenomena, supporting timely decision-making for natural hazards, educating the next generation of scientists, and making imagery of the planet more accessible to the media and public. Browse all of these visualizations through our [Worldview](https://worldview.earthdata.nasa.gov) application.

Global Imagery Browse Services are based on a process whereby satellite data is transformed into pre-generated visualizations stored as a tile pyramid (see figure below).  GIBS coordinates with NASA data centers and science teams to regularly ingest visualizations based on remotely sensed satellite data.  By processing, storing, and serving these visualizations as pre-generated tiles, GIBS can enable highly responsive access to its visualizations.  For more background on how tiled web maps work, see the [MapBox Developers Guide](https://www.mapbox.com/help/how-web-maps-work/).

![tile_pyramid](img/tile_pyramid.png)[^1]
[^1]: A tile pyramid (from [OGC WMTS 1.0.0 specification](http://www.opengeospatial.org/standards/wmts))

GIBS services are built atop the open source [OnEarth](https://github.com/nasa-gibs/onearth) software and [Meta Raster Format (MRF)](https://github.com/nasa-gibs/mrf) format. Visit those projects on GitHub to learn more or become a contributor.

## More Information
Visit the following content areas within this documentation site to learn more about GIBS visualizations and how to integrate them into your applications or utilities.

* **Available Visualizations** - Learn more about what visualizations are available to you
* **Access Basics** - Learn the basics about accessing visualizations through GIBS services
* **Access Advanced Topics** - Take a deeper dive into advanced topics related to accessing and interpreting GIBS visualizations  
* **Accessing via GIS Applications** - Learn how to access GIBS imagery via Geographic Information System (GIS) applications
* **Accessing via Map Libraries and Scripts** - Learn how to access GIBS imagery from interactive mapping libraries and GDAL-based scripts

Contact us at [mailto:support@earthdata.nasa.gov](support@earthdata.nasa.gov) if you have additional questions.