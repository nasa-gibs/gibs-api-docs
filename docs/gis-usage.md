# Accessing via GIS Applications

Through the OGC Web Map Service (WMS) and Web Map Tile Service (WMTS), it's often possible to access imagery directly from NASA's Global Imagery Browse Services (GIBS) from your favorite Geographic Information System (GIS) client.

Please note: some existing GIS applications do not currently handle time-varying imagery layers, especially with WMTS sources. The primary suggested method for access within GIS clients is through WMS as this protocol has better time support. Alternatively, [Worldview's](https://worldview.earthdata.nasa.gov/) "image capture" tool (camera icon in upper right) can be used to export imagery as a GeoTIFF or KMZ (or other formats with worldfiles) which can then be imported into your application.

## QGIS

The [QGIS application](https://qgis.org/) supports GIBS' time-varying layers using the WMS protocol.

### Requirements

* QGIS [version 3.14](https://qgis.org/en/site/forusers/visualchangelog314/#temporal) or later

### Instructions

* In QGIS, open the "Layer | Add Layer | Add WMS / WMTS Layer" window
* Add a "Name" such as "GIBS WMS (EPSG:4326, Best)"
* Add a "URL" for the [GIBS WMS endpoint](/visualization-services/#ogc-web-map-service-wms) of your desired map projection, i.e. one of the following:
[https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi)<br>
[https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi](https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi)<br>
[https://gibs.earthdata.nasa.gov/wms/epsg3413/best/wms.cgi](https://gibs.earthdata.nasa.gov/wms/epsg3413/best/wms.cgi)<br>
[https://gibs.earthdata.nasa.gov/wms/epsg3031/best/wms.cgi](https://gibs.earthdata.nasa.gov/wms/epsg3031/best/wms.cgi)

![QGIS, Add WTMS Connection](img/CreateWMTSConnection_QGIS.png)

* Click the "Connect" button to list all available layers for that map projection, select a layer of interest, and "Add" it to the map:

![QGIS, Connect to WTMS Connection](img/ConnectWMTS_QGIS.png)

* This should result in a map and legend with your selected layer:

![QGIS, WMTS Layer added](img/WMTSlayer_QGIS.png)

* At this point, you'll need to enable temporal navigation in QGIS to change the currently-displayed date; just above the map area, you can enable either a fixed temporal range or an animated one. For this example, we'll enable a fixed one by clicking the ![QGIS, Temporal Controller Button](img/TemporalControllerbutton_QGIS.png) button.
* In the case of QGIS, the first field (i.e., leftmost) in the date range is what controls the imagery from GIBS.

![QGIS, Temporal Controller](img/TemporalController_QGIS.png)

## ESRI ArcGIS/ArcMap

GIBS imagery layers can be directly imported into ESRI ArcGIS/ArcMap 10.2.1 or later using the WMS protocol.

### Requirements

* ESRI ArcGIS ArcMap 10.2.1 or later (earlier versions are untested, though possibly usable)

### Instructions

* Open the "Catalog" window (far right pane) in ArcMap and select "Add WMS Server"
* Paste one of the [GIBS WMS endpoints](http://127.0.0.1:8000/#ogc-web-map-service-wms) (e.g., [WGS84 / Geographic](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi) or [Web Mercator](https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi)) into the "URL" field and press the "Get Layers" button to validate the connection.

![ArcMap, Add WMS Server](img/ArcMap-CatWindow.png)

* Expand the "NASA Global Imagery Browse Services for EOSDIS on gibs.earthdata.nasa.gov" entry in the catalog pane to reveal the list of available layers.

![ArcMap, GIBS Catalog](img/ArcMap-GIBS-Catalog.png)

* Drag any layers of interest (VIIRS Corrected Reflectance in this case) into the layer pane at far left:

![ArcMap, Add imagery](img/ArcMap-VIIRS-CR.png)

* Open the Time Slider panel from the toolbar and choose your date of interest.

![ArcMap, Time Slider](img/ArcMap-TimeSlider.png)

* Add any additional layers in a similar manner.

![ArcMap, Time Panel](img/ArcMap-TimePanel.png)

## ESRI ArcGIS Online

GIBS imagery layers can be imported into [ESRI's ArcGIS Online](http://www.arcgis.com/) in one of two ways: through the GIBS WMS or as a predefined layer from ESRI.

### Adding GIBS layers via WMS

* Click the "Modify Map" button in the upper right corner, then "Add | Add Layer from Web".

![ArcGIS Online, Add Layer](img/AGOL-AddLayer.png)

* Change the data type to a WMS OGC Web Service
* Paste one of the GIBS WMS endpoints (e.g., [WGS84 / Geographic](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi) into the "URL" field and press the "Get Layers" button
* Deselect all of the layers (upper left "square") and select a layer you'd like to add

![ArcGIS Online, Add Layer from web](img/AGOL-AddLayer2.png)

* For each layer that you've loaded, click on the three small dots below "NASA Global Imagery Browse Services for EOSDIS", then "WMS OGC options"
* Add a Parameter for "TIME" and enter a YYYY-MM-DD Value for your desired date

![ArcGIS Online, Adjust Time](img/AGOL-TimeAdjust2.png)

### Adding GIBS layers from a list of ones predefined by ESRI

* Search for ["Global Imagery Browse Services"](http://www.arcgis.com/home/search.html?q=Global%20Imagery%20Browse%20Services&t=content) in ArcGIS Online and add individual results to your map, such as [Aqua/MODIS Corrected Reflectance (True Color)](http://www.arcgis.com/home/item.html?id=10739eefdc9743a2b884bebe4b3476d7).
* To change the currently-displayed date, go to the "Details" pane, then click the small down arrow next to the layer name. Click "Enable Time Animation", then adjust the date at the bottom of the page.

![ArcGIS Online, Enable Time](img/AGOL-EnableTime.png)

## Google Earth (Web / Pro)

The [web-based Google Earth](https://earth.google.com/web/) and [desktop Google Earth Pro](https://www.google.com/earth/versions/#earth-pro) support loading of KML/KMZ files which allows you to import GIBS imagery via Worldview's KMZ download capability.

### Generate/Download KMZ file from Worldview

* Start in [Worldview](https://worldview.earthdata.nasa.gov/) to find your imagery of interest.
    * Use Worldview's "camera tool" in the upper right corner to select an image to download and choose the "KMZ" format
    * Click "Download" and save the KMZ file to your computer

![Worldview, image snapshot](img/Worldview-snapshot.png)

### Loading a KMZ into Google Earth (Web)

* Open [Google Earth (Web)](https://earth.google.com/web/)
    * Click the "hamburger" button (three horizontal lines in the upper left), go to Projects, and click "Import KML from computer"
    * Select the KMZ file that you just downloaded from Worldview

![Google Earth, Worldview KMZ](img/GoogleEarth-WorldviewKMZ.png)


### Loading a KMZ into Google Earth Pro (Desktop)

* Launch [Google Earth Pro](https://www.google.com/earth/versions/#earth-pro)
    * Go the the "File" menu and click "Open..." 
    * Select the KMZ file that you just downloaded from Worldview

![Google Earth Pro, Worldview KMZ](img/GoogleEarthPro-WorldviewKMZ.png)