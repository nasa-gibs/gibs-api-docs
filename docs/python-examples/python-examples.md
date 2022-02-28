# Python Examples

<DIV align="left" style="line-height:1.5em;">
<p>
    
NASA's Global Imagery Browse Services (GIBS) is a web service for accessing Earth observation imagery. GIBS implements Open Geospatial Consortium (OGC) Web Map Service (WMS) and Web Map Tile Service (WMTS) protocol. It provides more than one thousand of the Earth physical parameters daily for over two decades. These examples show how to access GIBS WMS data, WMTS data and how to visualize them on map. It covers getting capabilities, maps, tiles, rasters and vectors. It also includes data request API, XML paring and responded image processing. Finally it shows how to use matplotlib and cartopy packages to display images on various map projections. For more detail of GIBS, please refer to GIBS related introduction:
<a href=https://wiki.earthdata.nasa.gov/display/GIBS/GIBS+API+for+Developers>GIBS API for Developer</a>
    
</p>
</DIV>

## Import Python Packages And Modules

<DIV align="left" style="line-height:1.5em;">
<p>
    
Major packages are requests, xml, json, skiimage, matplotlib, cartopy and pillow image.
    
</p>
</DIV>


```python
import os
from io import BytesIO
from skimage import io
import requests
import json
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import cartopy.crs as ccrs
import cartopy
from cartopy.mpl.gridliner import LONGITUDE_FORMATTER, LATITUDE_FORMATTER
import urllib.request
import mapbox_vector_tile
import xml.etree.ElementTree as xmlet
import lxml.etree as xmltree
from PIL import Image as plimg
import numpy as np
from owslib.wms import WebMapService
from IPython.display import Image
%matplotlib inline
```

## Basic WMS Connection

First we will connect to the GIBS WMS Service and visualize the MODIS_Terra_CorrectedReflectance_TrueColor layer.


```python
# Connect to GIBS WMS Service
wms = WebMapService('https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?', version='1.1.1')

# Configure request for MODIS_Terra_CorrectedReflectance_TrueColor
img = wms.getmap(layers=['MODIS_Terra_CorrectedReflectance_TrueColor'],  # Layers
                 srs='epsg:4326',  # Map projection
                 bbox=(-180,-90,180,90),  # Bounds
                 size=(1200, 600),  # Image size
                 time='2021-09-21',  # Time of data
                 format='image/png',  # Image format
                 transparent=True)  # Nodata transparency

# Save output PNG to a file
out = open('MODIS_Terra_CorrectedReflectance_TrueColor.png', 'wb')
out.write(img.read())
out.close()

# View image
Image('MODIS_Terra_CorrectedReflectance_TrueColor.png')
```




    
![png](output_4_0.png)
    



## Get WMS Capabilities

<DIV align="left" style="line-height:1.5em;">
<p>
    
For WMS, first is to get capabilities. GIBS provides four map projections, so there are four WMS endpoints to get capabilities:
    
Geographic - EPSG:4326: https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi 
    
Web Mercator - EPSG:3857: https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi
    
Arctic polar stereographic - EPSG:3413: https://gibs.earthdata.nasa.gov/wms/epsg3413/best/wms.cgi
    
Antarctic polar stereographic - EPSG:3031: https://gibs.earthdata.nasa.gov/wms/epsg3031/best/wms.cgi
     
The codes below will show how to get capabilities.
</p>
</DIV>


```python
# Construct capability URL.
wmsUrl = 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?\
SERVICE=WMS&REQUEST=GetCapabilities'

# Request WMS capabilities.
response = requests.get(wmsUrl)

# Display capabilities XML in original format. Tag and content in one line.
WmsXml = xmltree.fromstring(response.content)
# print(xmltree.tostring(WmsXml, pretty_print = True, encoding = str))
```

## Display WMS All Layers

<DIV align="left" style="line-height:1.5em;">
<p>
    
Parse WMS capabilities XML to get total layers and display all layer names.
    
</p>
</DIV>


```python
# Currently total layers are 1081.

# Coverts response to XML tree.
WmsTree = xmlet.fromstring(response.content)

alllayer = []
layerNumber = 0

# Parse XML.
for child in WmsTree.iter():
    for layer in child.findall("./{http://www.opengis.net/wms}Capability/{http://www.opengis.net/wms}Layer//*/"): 
         if layer.tag == '{http://www.opengis.net/wms}Layer': 
            f = layer.find("{http://www.opengis.net/wms}Name")
            if f is not None:
                alllayer.append(f.text)
                
                layerNumber += 1

print('There are layers: ' + str(layerNumber))

for one in sorted(alllayer)[:5]:
    print(one)
print('...')
for one in sorted(alllayer)[-5:]:
    print(one)
```

    There are layers: 1096
    AIRS_L2_Carbon_Monoxide_500hPa_Volume_Mixing_Ratio_Day
    AIRS_L2_Carbon_Monoxide_500hPa_Volume_Mixing_Ratio_Night
    AIRS_L2_Cloud_Top_Height_Day
    AIRS_L2_Cloud_Top_Height_Night
    AIRS_L2_Dust_Score_Day
    ...
    VIIRS_SNPP_L2_Sea_Surface_Temp_Day
    VIIRS_SNPP_L2_Sea_Surface_Temp_Night
    VIIRS_SNPP_Thermal_Anomalies_375m_All
    VIIRS_SNPP_Thermal_Anomalies_375m_Day
    VIIRS_SNPP_Thermal_Anomalies_375m_Night


## Search WMS Layer And Its Attributes

<DIV align="left" style="line-height:1.5em;">
<p>
    
Requesting WMS data needs layer name, bounding box, time, projection, data format and so on. Enter a layer
name to search its attributes.
    
</p>
</DIV>


```python
# Define layname to use.
layerName = 'Landsat_WELD_CorrectedReflectance_Bands157_Global_Annual'  

# Get general information of WMS.
for child in WmsTree.iter():
    if child.tag == '{http://www.opengis.net/wms}WMS_Capabilities': 
        print('Version: ' +child.get('version'))
    
    if child.tag == '{http://www.opengis.net/wms}Service': 
        print('Service: ' +child.find("{http://www.opengis.net/wms}Name").text)
        
    if child.tag == '{http://www.opengis.net/wms}Request': 
        print('Request: ')
        for e in child:
            print('\t ' + e.tag.partition('}')[2])
                            
        all = child.findall(".//{http://www.opengis.net/wms}Format")
        if all is not None:
            print("Format: ")
            for g in all:
                print("\t " + g.text)     
                
        for e in child.iter():
            if e.tag == "{http://www.opengis.net/wms}OnlineResource":
                print('URL: ' + e.get('{http://www.w3.org/1999/xlink}href'))
                break

# Get layer attributes.
for child in WmsTree.iter():
    for layer in child.findall("./{http://www.opengis.net/wms}Capability/{http://www.opengis.net/wms}Layer//*/"): 
         if layer.tag == '{http://www.opengis.net/wms}Layer': 
            f = layer.find("{http://www.opengis.net/wms}Name")
            if f is not None:
                if f.text == layerName:
                    # Layer name.
                    print('Layer: ' + f.text)
                    
                    # All elements and attributes:
                    # CRS
                    e = layer.find("{http://www.opengis.net/wms}CRS")
                    if e is not None:
                        print('\t CRS: ' + e.text)
                    
                    # BoundingBox.
                    e = layer.find("{http://www.opengis.net/wms}EX_GeographicBoundingBox")
                    if e is not None:
                        print('\t LonMin: ' + e.find("{http://www.opengis.net/wms}westBoundLongitude").text)
                        print('\t LonMax: ' + e.find("{http://www.opengis.net/wms}eastBoundLongitude").text)
                        print('\t LatMin: ' + e.find("{http://www.opengis.net/wms}southBoundLatitude").text)
                        print('\t LatMax: ' + e.find("{http://www.opengis.net/wms}northBoundLatitude").text)
                    
                    # Time extent.
                    e = layer.find("{http://www.opengis.net/wms}Dimension")
                    if e is not None:
                        print('\t TimeExtent: ' + e.text)
                        
                    # Style.
                    e = layer.find("{http://www.opengis.net/wms}Style")
                    if e is not None:
                        f = e.find("{http://www.opengis.net/wms}Name")
                        if f is not None:
                            print('\t Style: ' + f.text)

print('')                         
```

    Version: 1.3.0
    Service: WMS
    Request: 
    	 GetCapabilities
    	 GetMap
    Format: 
    	 text/xml
    	 image/png
    	 application/vnd.google-earth.kml.xml
    	 application/vnd.google-earth.kmz
    	 image/jpeg
    	 image/png; mode=8bit
    	 image/tiff
    URL: https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?
    Layer: Landsat_WELD_CorrectedReflectance_Bands157_Global_Annual
    	 CRS: EPSG:4326
    	 LonMin: -180
    	 LonMax: 180
    	 LatMin: -90
    	 LatMax: 90
    	 TimeExtent: 1983-12-01/1985-12-01/P1Y,1988-12-01/1990-12-01/P1Y,1998-12-01/2000-12-01/P1Y
    


## Visualize WMS Raster Data In Geographic Projection

<DIV align="left" style="line-height:1.5em;">
<p>
    
This example shows how to get Ggeographic projection (EPSG:4326) image. Use a layer name and its attributes to form a URL for requesting WMS image. After a responded image is returned, display it in map by matplotlib and cartopy. 
    
</p>
</DIV>


```python
#  Construct Geographic projection URL.
proj4326 = 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?\
version=1.3.0&service=WMS&\
request=GetMap&format=image/png&STYLE=default&bbox=-40,-40,40,40&CRS=EPSG:4326&\
HEIGHT=600&WIDTH=600&TIME=2000-12-01&layers=Landsat_WELD_CorrectedReflectance_Bands157_Global_Annual'

# Request image.
img = io.imread(proj4326)

# Display image on map.
fig = plt.figure()
ax = fig.add_subplot(1, 1, 1, projection=ccrs.PlateCarree())
extent = (-40, 40, -40, 40)
plt.imshow(img, transform = ccrs.PlateCarree(), extent = extent, origin = 'upper')

# Draw grid.
gl = ax.gridlines(ccrs.PlateCarree(), linewidth = 1, color = 'blue', alpha = 0.3,  draw_labels = True)
gl.top_labels = False
gl.right_labels = False
gl.xlines = True
gl.ylines = True
gl.xlocator = mticker.FixedLocator([0, 30, -30, 0])
gl.ylocator = mticker.FixedLocator([-30, 0, 30])
gl.xformatter = LONGITUDE_FORMATTER
gl.yformatter = LATITUDE_FORMATTER
gl.xlabel_style = {'color': 'blue'}
gl.ylabel_style = {'color': 'blue'}

plt.title('WMS Landsat Reflectance In Geographic Projection',\
          fontname = "Times New Roman", fontsize = 20, color = 'green')

plt.show()

print('')
```


    
![png](output_12_0.png)
    


    


## Visualize WMS Raster Data In Web Mercator Projection

<DIV align="left" style="line-height:1.5em;">
<p>
    
This example shows how to get image in WMS Web Mercator projection (EPSG:3857) and display it on map.
    
</p>
</DIV>


```python
# Construct Web Mercator projection URL.
proj3857 = 'https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?\
version=1.3.0&service=WMS&\
request=GetMap&format=image/png&STYLE=default&bbox=-8000000,-8000000,8000000,8000000&\
CRS=EPSG:3857&HEIGHT=600&WIDTH=600&TIME=2000-12-01&layers=Landsat_WELD_CorrectedReflectance_Bands157_Global_Annual'

# Request image.
img=io.imread(proj3857)

# Display image on map.
fig = plt.figure()
ax = fig.add_subplot(1, 1, 1, projection = ccrs.Mercator.GOOGLE)
extent = (-8000000, 8000000, -8000000, 8000000)
plt.imshow(img, transform = ccrs.Mercator.GOOGLE, extent = extent, origin = 'upper')

# Draw grid.
gl = ax.gridlines(ccrs.PlateCarree(), linewidth = 1, color = 'blue', alpha = 0.3,  draw_labels = True)
gl.top_labels = False
gl.right_labels = False
gl.xlines = True
gl.ylines = True
gl.xlocator = mticker.FixedLocator([0, 30, -30, 0])
gl.ylocator = mticker.FixedLocator([-30, 0, 30])
gl.xformatter = LONGITUDE_FORMATTER
gl.yformatter = LATITUDE_FORMATTER
gl.xlabel_style = {'color': 'blue'}
gl.ylabel_style = {'color': 'blue'}

plt.title('WMS Landsat Reflectance In Web Mercator Projection',
          fontname = "Times New Roman", fontsize = 20, color = 'green')

plt.show()

print('')
```


    
![png](output_14_0.png)
    


    


## Visualize WMS Raster Data In Arctic Polar Stereographic Projection

<DIV align="left" style="line-height:1.5em;">
<p>
    
This example shows how to get WMS Arctic Polar Stereographic projection (EPSG:3413) image and display it on map.
    
</p>
</DIV>


```python
# Construct Arctic Polar Stereographic projection URL.
proj3413 = 'https://gibs.earthdata.nasa.gov/wms/epsg3413/best/wms.cgi?\
version=1.3.0&service=WMS&request=GetMap&\
format=image/png&STYLE=default&bbox=-4194300,-4194300,4194300,4194300&CRS=EPSG:3413&\
HEIGHT=512&WIDTH=512&TIME=2021-08-01&layers=MODIS_Terra_CorrectedReflectance_TrueColor'

# Request image.
img = io.imread(proj3413) 

# Display image on map.
plt.figure(figsize=(5, 5))
ax = plt.axes(projection=ccrs.NorthPolarStereo(central_longitude=-45))
plt.imshow(img, extent = (-4194300,4194300,-4194300,4194300), origin = 'upper')

# Draw coastline and grid.
ax.coastlines(color='blue', linewidth=1)
ax.gridlines()

plt.title('WMTS Terra True Color Image In Arctic Polar Stereographic',\
          fontname = "Times New Roman", fontsize = 20, color = 'green')

plt.show()
 
print('')
```


    
![png](output_16_0.png)
    


    


## Visualize WMS Raster Data In Antarctic Polar Stereographic Projection

<DIV align="left" style="line-height:1.5em;">
<p>
    
This example shows how to get WMS Antarctic Polar Stereographic projection (EPSG:3031) image and display it on map.
    
</p>
</DIV>


```python
# Construct Antarctic Polar Stereographic project 
proj3031 = 'https://gibs.earthdata.nasa.gov/wms/epsg3031/best/wms.cgi?\
version=1.3.0&service=WMS&request=GetMap&\
format=image/png&STYLE=default&bbox=-4194300,-4194300,4194300,4194300&CRS=EPSG:3031&\
HEIGHT=512&WIDTH=512&TIME=2021-03-01&layers=MODIS_Terra_CorrectedReflectance_TrueColor'

# Request image.
img = io.imread(proj3031) 

# Display image on map.
plt.figure(figsize=(5, 5))
ax = plt.axes(projection=ccrs.SouthPolarStereo())
plt.imshow(img, extent = (-4194300,4194300,-4194300,4194300), origin = 'upper')

# Draw coastline and grid.
ax.coastlines(color='blue', linewidth=1)
ax.gridlines()

plt.title('WMTS Terra True Color Image In Antarctic Polar Stereographic',\
          fontname = "Times New Roman", fontsize = 20, color = 'green')

plt.show()
 
print('')
```


    
![png](output_18_0.png)
    


    


## Visualize WMS Global Raster Data

<DIV align="left" style="line-height:1.5em;">
<p>
    
This example shows how to get WMS global image and to display it on map.
    
</p>
</DIV>


```python
# Construct global image URL.
proj4326 = 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?\
version=1.3.0&service=WMS&request=GetMap&\
format=image/jpeg&STYLE=default&bbox=-90,-180,90,180&CRS=EPSG:4326&\
HEIGHT=512&WIDTH=512&TIME=2021-11-25&layers=MODIS_Terra_SurfaceReflectance_Bands143'

# Request image.
img = io.imread(proj4326) 

# Display image on map.
plt.figure(figsize = (9, 6))
ax = plt.axes(projection = ccrs.PlateCarree(central_longitude = 0))
cmp = plt.imshow(img, transform = ccrs.PlateCarree(), extent = (-180,180,-90,90), origin = 'upper')

# Draw grid.
gl = ax.gridlines(ccrs.PlateCarree(), linewidth = 1, color = 'blue', alpha = 0.3,  draw_labels = True)
gl.top_labels = False
gl.right_labels = False
gl.xlines = True
gl.ylines = True
gl.xlocator = mticker.FixedLocator([0, 60, 120, 180, -120, -60, 0])
gl.ylocator = mticker.FixedLocator([-90, -60, -30, 0, 30, 60, 90])
gl.xformatter = LONGITUDE_FORMATTER
gl.yformatter = LATITUDE_FORMATTER
gl.xlabel_style = {'color': 'blue'}
gl.ylabel_style = {'color': 'blue'}

# Draw coastline.
ax.coastlines()

plt.title('WMS Terra MODIS Surface Reflectance',fontname="Times New Roman", fontsize = 20, color = 'green')

plt.show()
 
print('')
```


    
![png](output_20_0.png)
    


    


## Visualize WMS Global Vector Data

<DIV align="left" style="line-height:1.5em;">
<p>
    
This example shows how to get WMS global vector data and to display it on map.
    
</p>
</DIV>


```python
# Construct WMS global vector URL.
wmsVector = 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?\
TIME=2020-10-01T00:00:00Z&\
LAYERS=VIIRS_NOAA20_Thermal_Anomalies_375m_All&REQUEST=GetMap&SERVICE=WMS&\
FORMAT=image/png&WIDTH=480&HEIGHT=240&VERSION=1.1.1&SRS=epsg:4326&BBOX=-180,-90,180,90&TRANSPARENT=TRUE'

# Request image.
img = io.imread(wmsVector)

# Setup map size, projection and background.
fig = plt.figure(figsize = (10, 6))
ax = plt.axes(projection = ccrs.PlateCarree(central_longitude = 0))
ax.set_facecolor("white")
ax.stock_img()
ax.coastlines()

# Draw grid.
gl = ax.gridlines(ccrs.PlateCarree(), linewidth = 1, color = 'blue', alpha = 0.3,  draw_labels = True)
gl.top_labels = False
gl.right_labels = False
gl.xlines = True
gl.ylines = True
gl.xlocator = mticker.FixedLocator([0, 60, 120, -120, -60, 0])
gl.ylocator = mticker.FixedLocator([-90, -60, -30, 0, 30, 60, 90])
gl.xformatter = LONGITUDE_FORMATTER
gl.yformatter = LATITUDE_FORMATTER
gl.xlabel_style = {'color': 'blue'}
gl.ylabel_style = {'color': 'blue'}

# Display image on map.
extent = (-180, 180, -90, 90)
plt.imshow(img, extent = extent)

plt.title('WMS Vector Data VIIRS Thermal Anomalies',\
          fontname = "Times New Roman", fontsize = 20, color = 'green')

print('')
```

    



    
![png](output_22_1.png)
    


## Interactive Web Map with WMS

The next example shows how to display VIIRS_NOAA20_Thermal_Anomalies_375m_All layer in an interactive web map (may require additional Python libraries).


```python
from ipyleaflet import Map, WMSLayer, basemaps

# Make a WMS connection to a map layer
wms_layer = WMSLayer(url='https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?',
                     layers='VIIRS_NOAA20_Thermal_Anomalies_375m_All',
                     format='image/png',
                     transparent=True)

# Define map properties and add the WMS layer from above on top of basemap
m = Map(basemap=basemaps.NASAGIBS.BlueMarble, center=(0, -0), zoom=3)
m.add_layer(wms_layer)

# Display interactive web map
m
```
* Interactive map not available in Markdown


## Get WMTS Capabilities

<DIV align="left" style="line-height:1.5em;">
<p>
    
This example shows how to get WMTS capabilities and display capability XML content.
    
</p>
</DIV>


```python
# Construct WMTS capability URL.
wmtsUrl = 'http://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?SERVICE=WMTS&REQUEST=GetCapabilities'

# Request capabilities.
response = requests.get(wmtsUrl)

# Display capability XML.
WmtsXml = xmltree.fromstring(response.content)
# print(xmltree.tostring(WmtsXml, pretty_print = True, encoding = str))
```

## Display WMTS All Layers of capabilities.

<DIV align="left" style="line-height:1.5em;">
<p>
    
This example shows how to parse WMTS capabilities and to display all layers of capabilities.
    
</p>
</DIV>


```python
# Currently total layers are 1026.  

# Convert capability response to XML tree.
WmtsTree = xmlet.fromstring(response.content)

alllayer = []
layerNumber = 0

# Parse capability XML tree.
for child in WmtsTree.iter():
    for layer in child.findall("./{http://www.opengis.net/wmts/1.0}Layer"): 
         if '{http://www.opengis.net/wmts/1.0}Layer' == layer.tag: 
            f=layer.find("{http://www.opengis.net/ows/1.1}Identifier")
            if f is not None:
                alllayer.append(f.text)
                layerNumber += 1

print('There are layers: ' + str(layerNumber))
for one in sorted(alllayer)[:5]:
    print(one)
print('...')
for one in sorted(alllayer)[-5:]:
    print(one)       
```

    There are layers: 1041
    AIRS_L2_Carbon_Monoxide_500hPa_Volume_Mixing_Ratio_Day
    AIRS_L2_Carbon_Monoxide_500hPa_Volume_Mixing_Ratio_Night
    AIRS_L2_Cloud_Top_Height_Day
    AIRS_L2_Cloud_Top_Height_Night
    AIRS_L2_Dust_Score_Day
    ...
    VIIRS_SNPP_L2_Sea_Surface_Temp_Day
    VIIRS_SNPP_L2_Sea_Surface_Temp_Night
    VIIRS_SNPP_Thermal_Anomalies_375m_All
    VIIRS_SNPP_Thermal_Anomalies_375m_Day
    VIIRS_SNPP_Thermal_Anomalies_375m_Night


## Search WMTS Vector Layer, Attributes And Vector Information

<DIV align="left" style="line-height:1.5em;">
<p>
    
This example shows how to search a WMTS layer and to parse its attributes and vector information.
    
</p>
</DIV>


```python
# Get general information of WMTS from XML tree.
for child in WmtsTree.iter():
    if child.tag == '{http://www.opengis.net/wmts/1.0}Capabilities': 
        print('Version: ' + child.get('version'))
    
    if child.tag == '{http://www.opengis.net/ows/1.1}ServiceType': 
        print('Service: ' + child.text)
        
    if child.tag == '{http://www.opengis.net/ows/1.1}OperationsMetadata': 
        print('Request: ')
        for e in child:
            print('\t ' + e.get('name'))

# Parse layer attributes and vector information.
for child in WmtsTree.iter():
    for layer in child.findall("./{http://www.opengis.net/wmts/1.0}Layer"): 
         if '{http://www.opengis.net/wmts/1.0}Layer' == layer.tag: 
            f = layer.find("{http://www.opengis.net/ows/1.1}Identifier")
            if f is not None:
                if f.text == 'MODIS_Aqua_Thermal_Anomalies_All':
                    # Layer name.
                    print('Layer: ' + f.text)
                    
                    # All elements and attributes:
                    
                    # BoundingBox.
                    e = layer.find("{http://www.opengis.net/ows/1.1}WGS84BoundingBox")
                    if e is not None:
                        print("\t crs: " + e.get('crs'))
                        print("\t UpperCorner: " + e.find("{http://www.opengis.net/ows/1.1}UpperCorner").text)
                        print("\t LowerCorner: " + e.find("{http://www.opengis.net/ows/1.1}LowerCorner").text)
                    
                    # TileMatrixSet.
                    e = layer.find("{http://www.opengis.net/wmts/1.0}TileMatrixSetLink")
                    if e is not None:
                        print("\t TileMatrixSet: " + e.find("{http://www.opengis.net/wmts/1.0}TileMatrixSet").text)
                        
                    # Time extent.
                    e = layer.find("{http://www.opengis.net/wmts/1.0}Dimension")
                    if e is not None:
                        all = e.findall("{http://www.opengis.net/wmts/1.0}Value")
                        if all is not None:
                            print("\t TimeExtent: ")
                            for g in all:
                                print("\t\t " + g.text)
                        
                    # Foramt.
                    e = layer.find("{http://www.opengis.net/wmts/1.0}Format")
                    if e is not None:
                        print("\t Format: " + e.text)
                    
                    # Style.
                    e = layer.find("{http://www.opengis.net/wmts/1.0}Style")
                    if e is not None:
                        g=e.find("{http://www.opengis.net/ows/1.1}Identifier")
                        if g is not None:
                            print("\t Style: " + g.text)
                       
                    # Template.
                    e = layer.find("{http://www.opengis.net/wmts/1.0}ResourceURL")
                    if e is not None:
                        print("\t Template: " + e.get('template'))
                        
                    # Vector metadata.                    
                    for e in layer.findall("{http://www.opengis.net/ows/1.1}Metadata"):
                        if "vector-metadata" in e.get("{http://www.w3.org/1999/xlink}href"):
                            vectorMetadata=e.get("{http://www.w3.org/1999/xlink}href")
                            print('\t Vector metadata: ' + vectorMetadata)
                                  
                            response = urllib.request.urlopen(vectorMetadata)

                            # Load to json.
                            data = json.loads(response.read())

                            #Parse json.
                            for p in data['mvt_properties']:
                                keys = list(p.keys())
                                if 'Identifier' in keys:
                                    print('\t\t Identifier: ' + p['Identifier'])
                                if 'Title' in keys:
                                    print('\t\t Title: ' + p['Title'])
                                if 'Description' in keys:
                                    print('\t\t Description: ' + p['Description'])
                                if 'Units' in keys:
                                    print('\t\t Units: ' + p['Units'])
                                if 'DataType' in keys:
                                    print('\t\t DataType: ' + p['DataType'])
                                if 'ValueRanges' in keys:
                                    print('\t\t ValueRanges: ' + str(p['ValueRanges']))
                                if 'ValueMap' in keys:
                                    print('\t\t ValueMap: ' + str(p['ValueMap']))   
                                if 'Function' in keys:
                                    print('\t\t Function: ' + p['Function'])
                                if 'IsOptional' in keys:
                                    print('\t\t IsOptional: ' + str(p['IsOptional']))
                                if 'IsLabel' in keys:
                                    print('\t\t IsLabel: ' + str(p['IsLabel']))
                                
                                print('\n')
                            
                            # There two vector metadata. Only need one, so break.
                            break      
                    
print('')
```

    Version: 1.0.0
    Service: OGC WMTS
    Request: 
    	 GetCapabilities
    	 GetTile
    Layer: MODIS_Aqua_Thermal_Anomalies_All
    	 crs: urn:ogc:def:crs:OGC:2:84
    	 UpperCorner: 180 90
    	 LowerCorner: -180 -90
    	 TileMatrixSet: 1km
    	 TimeExtent: 
    		 2002-07-04/2002-07-29/P1D
    		 2002-08-08/2002-09-12/P1D
    		 2002-09-14/2020-08-16/P1D
    		 2020-09-02/2021-12-31/P1D
    	 Format: application/vnd.mapbox-vector-tile
    	 Style: default
    	 Template: https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Aqua_Thermal_Anomalies_All/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.mvt
    	 Vector metadata: https://gibs.earthdata.nasa.gov/vector-metadata/v1.0/FIRMS_MODIS_Thermal_Anomalies.json
    		 Identifier: LATITUDE
    		 Title: Latitude
    		 Description: Latitude in Decimal Degrees
    		 Units: °
    		 DataType: float
    		 Function: Describe
    		 IsOptional: False
    		 IsLabel: False
    
    
    		 Identifier: LONGITUDE
    		 Title: Longitude
    		 Description: Longitude in Decimal Degrees
    		 Units: °
    		 DataType: float
    		 Function: Describe
    		 IsOptional: False
    		 IsLabel: False
    
    
    		 Identifier: BRIGHTNESS
    		 Title: Brightness Temperature (Channel 21/22)
    		 Description: Channel 21/22 brightness temperature of the fire pixel, measured in Kelvin.
    		 Units: Kelvin
    		 DataType: float
    		 ValueRanges: [{'Min': 0, 'Max': 500}]
    		 Function: Style
    		 IsOptional: False
    		 IsLabel: False
    
    
    		 Identifier: BRIGHT_T31
    		 Title: Brightness Temperature (Channel 31)
    		 Description: Channel 31 brightness temperature of the fire pixel, measured in Kelvin.
    		 Units: Kelvin
    		 DataType: float
    		 ValueRanges: [{'Min': 0, 'Max': 500}]
    		 Function: Style
    		 IsOptional: False
    		 IsLabel: False
    
    
    		 Identifier: FRP
    		 Title: Fire Radiative Power
    		 Description: The Fire Radiative Power (FRP) is a measure of the rate of radiant heat output from a fire. It has been demonstrated in small-scale experimental fires that the FRP of a fire is related to the rate at which fuel is being consumed (Wooster et al., 2005) and smoke emissions released (Freeborn et al., 2008).
    		 Units: MW
    		 DataType: float
    		 ValueRanges: [{'Min': 0, 'Max': 20000}]
    		 Function: Style
    		 IsOptional: False
    		 IsLabel: False
    
    
    		 Identifier: CONFIDENCE
    		 Title: Detection Confidence
    		 Description: This value is based on a collection of intermediate algorithm quantities used in the detection process. It is intended to help users gauge the quality of individual hotspot/fire pixels. Confidence estimates range between 0 and 100%.
    		 Units: %
    		 DataType: int
    		 ValueRanges: [{'Min': 0, 'Max': 100}]
    		 Function: Style
    		 IsOptional: False
    		 IsLabel: False
    
    
    		 Identifier: DAYNIGHT
    		 Title: Day/Night Flag
    		 Description: Indicates whether the fire point was observed during the ‘day’ or ‘night’.
    		 DataType: string
    		 ValueMap: {'D': 'Daytime Fire', 'N': 'Nighttime Fire'}
    		 Function: Describe
    		 IsOptional: False
    		 IsLabel: False
    
    
    		 Identifier: SCAN
    		 Title: Along-Scan Pixel Size
    		 Description: The algorithm produces 1km pixels at nadir, but pixels get bigger toward the edge of scan. This value reflects the actual along-scan pixel size.
    		 Units: km
    		 DataType: float
    		 ValueRanges: [{'Min': 1.0, 'Max': 5.0}]
    		 Function: Style
    		 IsOptional: False
    		 IsLabel: False
    
    
    		 Identifier: TRACK
    		 Title: Along-Track Pixel Size
    		 Description: The algorithm produces 1km pixels at nadir, but pixels get bigger toward the edge of scan. This value reflects the actual along-track pixel size.
    		 Units: km
    		 DataType: float
    		 ValueRanges: [{'Min': 1.0, 'Max': 2.0}]
    		 Function: Style
    		 IsOptional: False
    		 IsLabel: False
    
    
    		 Identifier: ACQ_DATE
    		 Title: Acquisition Date
    		 Description: The date of acquisition for this fire point. (YYYY-MM-DD)
    		 DataType: string
    		 Function: Describe
    		 IsOptional: False
    		 IsLabel: False
    
    
    		 Identifier: ACQ_TIME
    		 Title: Acquisition Time
    		 Description: The time of acquisition for this fire point, in UTC. (HHMM)
    		 DataType: string
    		 Function: Describe
    		 IsOptional: False
    		 IsLabel: True
    
    
    		 Identifier: SATELLITE
    		 Title: Satellite
    		 Description: Satellite from which the fire is observed.
    		 DataType: string
    		 ValueMap: {'A': 'Aqua', 'T': 'Terra', 'Aqua': 'Aqua', 'Terra': 'Terra'}
    		 Function: Describe
    		 IsOptional: False
    		 IsLabel: False
    
    
    		 Identifier: VERSION
    		 Title: Collection and Source
    		 Description: The collection (e.g. MODIS Collection 6) and source of data processing: Near Real-Time (NRT suffix added to collection) or Standard Processing (collection only).
    		 DataType: string
    		 ValueMap: {'6.1NRT': 'Collection 6.1 Near Real-Time processing', '6.1': 'Collection 6.1 Standard processing', '6.0NRT': 'Collection 6 Near Real-Time processing', '6.0': 'Collection 6 Standard processing', '6.02': 'Collection 6 Standard processing', '6.03': 'Collection 6 Standard processing'}
    		 Function: Describe
    		 IsOptional: False
    		 IsLabel: False
    
    
    		 Identifier: UID
    		 Title: Unique Identifier
    		 Description: Unique identifier of the data point.
    		 DataType: int
    		 Function: Identify
    		 IsOptional: False
    		 IsLabel: False
    
    
    


## Read WMTS Vector Data

<DIV align="left" style="line-height:1.5em;">
<p>
    
This example shows how to get one of WMTS vector data (MVT) from previous vector information. Also shows to parse vector data values.
    
</p>
</DIV>


```python
# Vector data format.
'''
{
   'MODIS_Aqua_Thermal_Anomalies_All':
   {
    'extent': 4096,
    'version': 1, 
    'features': 
    [
        {'geometry': 
            {'type': 'Point', 
             'coordinates': [4028, 3959]}, 
             'properties': {'LATITUDE': 35.397, 
                            'LONGITUDE': -90.3, 
                            'BRIGHTNESS': 307.3, 
                            'SCAN': 3.2, 
                            'TRACK': 1.7, 
                            'ACQ_DATE': '2020-10-01', 
                            'ACQ_TIME': '18:30', 
                            'SATELLITE': 'A', 
                            'CONFIDENCE': 48, 
                            'VERSION': '6.0NRT', 
                            'BRIGHT_T31': 296.0, 
                            'FRP': 21.4, 
                            'DAYNIGHT': 'D', 
                            'UID': 13159}, 
                            'id': 0,
                            'type': 1
                           }
            }
        }
        ,,,
    ]
}
'''

# Below both kvp and restful methods work. 
'''
kvp = 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?\
TIME=2020-10-01T00:00:00Z&FORMAT=application/vnd.mapbox-vector-tile&\
layer=MODIS_Aqua_Thermal_Anomalies_All&tilematrixset=1km&\
Service=WMTS&Request=GetTile&Version=1.0.0&TileMatrix=4&TileCol=3&TileRow=3'
response = requests.get(kvp)
'''

restful = 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Aqua_Thermal_Anomalies_All\
/default/2020-10-01T00:00:00Z/1km/4/3/4.mvt'

# Request data.
response = requests.get(restful)

# Parse vector values.
data = response.content
dataDictionary = mapbox_vector_tile.decode(data)
for key in dataDictionary.keys():
    parameterDictionary = dataDictionary[key]
    features = parameterDictionary['features']
    # Print vector data format.
    #print(features)

    lat = []
    lon = []
    brightness = []
    for f in features:
        p = f['properties']
        lat.append(p['LATITUDE'])
        lon.append(p['LONGITUDE'])
        brightness.append(p['BRIGHTNESS'])
        
print('lat number: ' + str(len(lat)))
print(str(lat))
print('lon number: ' + str(len(lon)))
print(str(lon))
print('brightness number: ' + str(len(brightness)))
print('brightness min: ' + str(min(brightness)))
print('brightness min: ' + str(max(brightness)))
print(str(brightness))

print('')
```

    lat number: 81
    [35.397, 35.403, 35.405, 35.446, 35.45, 35.454, 35.467, 35.47, 35.484, 36.053, 33.225, 33.449, 33.45, 33.451, 33.451, 33.625, 33.627, 33.755, 33.756, 33.77, 33.8, 33.803, 33.853, 33.853, 33.855, 33.867, 34.076, 34.346, 34.356, 34.457, 31.032, 31.034, 31.046, 31.048, 31.365, 31.608, 31.89, 31.892, 31.899, 18.316, 19.026, 19.091, 19.094, 19.232, 19.592, 19.594, 19.639, 19.653, 19.8, 19.808, 19.961, 20.518, 20.601, 20.611, 20.723, 20.725, 21.151, 21.726, 21.728, 21.911, 22.04, 22.917, 23.775, 25.189, 25.191, 25.228, 25.723, 25.843, 27.436, 27.447, 28.799, 28.801, 28.914, 29.095, 29.096, 29.527, 29.529, 29.529, 29.531, 29.561, 29.805]
    lon number: 81
    [-90.3, -90.272, -90.266, -90.676, -90.67, -90.641, -92.205, -92.215, -92.209, -89.904, -91.815, -94.62, -94.167, -94.593, -94.589, -93.99, -93.982, -94.507, -94.516, -94.509, -93.806, -93.798, -94.621, -94.626, -94.594, -94.627, -96.957, -91.197, -91.157, -91.021, -95.208, -95.182, -95.209, -95.183, -98.348, -95.122, -90.842, -90.851, -93.643, -100.281, -102.094, -102.919, -101.519, -101.459, -102.482, -102.472, -102.49, -101.918, -102.7, -102.712, -101.019, -100.926, -101.311, -101.245, -103.487, -103.493, -102.555, -102.297, -102.287, -104.148, -99.446, -99.056, -105.361, -99.646, -99.635, -98.347, -103.445, -98.224, -97.681, -97.682, -100.546, -100.535, -98.055, -98.17, -98.155, -97.284, -97.277, -97.267, -97.26, -98.374, -104.591]
    brightness number: 81
    brightness min: 304.2
    brightness min: 346.3
    [307.3, 312.5, 309.7, 325.2, 335.2, 306.3, 331.4, 325.5, 305.6, 307.8, 304.9, 310.6, 305.1, 317.2, 312.8, 307.3, 310.3, 304.5, 309.3, 311.7, 304.2, 304.8, 343.0, 339.2, 307.3, 325.3, 308.9, 320.4, 341.2, 306.5, 319.4, 332.3, 328.0, 346.3, 317.0, 320.6, 305.4, 305.1, 307.0, 315.7, 319.5, 315.8, 311.3, 313.7, 315.6, 316.2, 312.0, 308.6, 313.6, 313.6, 326.1, 323.6, 318.2, 322.2, 320.2, 318.6, 316.3, 320.1, 318.7, 313.2, 316.2, 318.1, 311.3, 324.7, 326.4, 327.3, 325.8, 327.6, 327.4, 330.9, 326.0, 335.6, 317.2, 319.0, 324.2, 323.9, 333.0, 327.9, 316.7, 322.5, 326.2]
    


## Display WMTS Vector Data

<DIV align="left" style="line-height:1.5em;">
<p>
    
This example shows how to overlay WMTS vector data values from last cell on map with legend.
    
</p>
</DIV>


```python
# Setup map size and projection.
fig = plt.figure(figsize = (8, 5))

ax = plt.axes(projection = ccrs.PlateCarree(central_longitude = 0))

# x min, x max, y min, y max.
extent = (-130,-30,-5,40)
ax.set_extent(extent)

# Plot lat, lon and brightness.
cmp = ax.scatter(lon, lat, c = brightness, cmap = 'hot')

# Plot legend.
cb = plt.colorbar(cmp, orientation='vertical',
                  fraction = 0.1, pad = 0.05, shrink = 0.8, label = 'Brightness'
                  ).outline.set_visible(True)

# Draw background.
ax.stock_img()
ax.coastlines()

# Draw grid.
gl = ax.gridlines(ccrs.PlateCarree(), linewidth=1, color = 'blue', alpha = 0.3,  draw_labels = True)
gl.top_labels = False
gl.right_labels = False
gl.xlines = True
gl.ylines = True
gl.xlocator = mticker.FixedLocator([0, 60, 120, -120, -60, 0])
gl.ylocator = mticker.FixedLocator([-60, -30, 0, 30, 60])
gl.xformatter = LONGITUDE_FORMATTER
gl.yformatter = LATITUDE_FORMATTER
gl.xlabel_style = {'color': 'blue'}
gl.ylabel_style = {'color': 'blue'}

plt.title('WMTS Vector Data Brightness',\
          fontname = "Times New Roman", fontsize = 20, color = 'green')

plt.show()

print('')
```


    
![png](output_34_0.png)
    


    


## Visualize WMTS Raster Data By GDAL

<DIV align="left" style="line-height:1.5em;">
<p>
    
This example shows how to get WMTS raster data by GDAL and to display it in map.

The Geospatial Data Abstraction Library (GDAL) has minidrivers to access WMS. please refer to the minidrivers
for detail: <a href=https://gdal.org/drivers/raster/wms.html>GDAL minidrivers</a>
 
First make XML file like in next cell and save it as globe.xml file.
Then at command line, run:
gdal_translate -of JPEG -outsize 1200 600 -projwin -180 90 180 -90 globe.xml globe.jpg
    
</p>
</DIV>


```python
# Make GDAL input XML file like globe.xml below.
xml = xmltree.parse("globe.xml")
pretty = xmltree.tostring(xml, encoding="unicode", pretty_print=True)
print(pretty)
```

    <GDAL_WMS>
        <Service name="TMS">
            <ServerUrl>https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2021-11-25/250m/${z}/${y}/${x}.jpg</ServerUrl>
        </Service>
        <Transparent>TRUE</Transparent>
        <DataWindow>
            <UpperLeftX>-180.0</UpperLeftX>
            <UpperLeftY>90</UpperLeftY>
            <LowerRightX>396.0</LowerRightX>
            <LowerRightY>-198</LowerRightY>
            <TileLevel>8</TileLevel>
            <TileCountX>2</TileCountX>
            <TileCountY>1</TileCountY>
            <YOrigin>top</YOrigin>
        </DataWindow>
        <BlockSizeX>512</BlockSizeX>
        <BlockSizeY>512</BlockSizeY>
        <Projection>EPSG:4326</Projection>
        <BandsCount>3</BandsCount>
    </GDAL_WMS>
    



```python
# Run GDAL command.
cmd  = 'gdal_translate -of JPEG -outsize 1200 600 -projwin -180 90 180 -90 globe.xml globe.jpg'
os.system(cmd)

# Output image is globe.jpg.
img = plimg.open('globe.jpg')

# Setup map size and projection.
fig = plt.figure(figsize = (5, 10), dpi = 100)
ax = plt.axes([1, 1, 1, 1], projection = ccrs.PlateCarree(central_longitude = 0))
ax.set_xlim([-180, 180])
ax.set_ylim([-90, 90])

# Display image on map.
imgExtent = (-180,180,-90,90)
cmp = plt.imshow(img, extent = imgExtent)

# Draw coastline.
ax.coastlines()

# Draw grid.
gl = ax.gridlines(ccrs.PlateCarree(), linewidth = 1, color = 'blue', alpha = 0.3,  draw_labels = True)
gl.top_labels = False
gl.right_labels = False
gl.xlines = True
gl.ylines = True
#gl.xlocator = mticker.FixedLocator([0, 60, 120, -120, -60])
gl.ylocator = mticker.FixedLocator([-90, -60, -30, 0, 30, 60, 90])
gl.xformatter = LONGITUDE_FORMATTER
gl.yformatter = LATITUDE_FORMATTER
gl.xlabel_style = {'color': 'blue'}
gl.ylabel_style = {'color': 'blue'}

plt.title('WMTS Terra True Color Image By GDAL',\
          fontname = "Times New Roman", fontsize = 20, color = 'green')

plt.show()

print('')
```


    
![png](output_37_0.png)
    


    

