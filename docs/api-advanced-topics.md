# Access Advanced Topics

   * ["Best Available" Layers](#best-available-layers)
   * [Layer Naming Convention](#layer-naming-convention)
   * [Domain Sharding](#domain-sharding)
   * [Raster Color Maps](#raster-color-maps)
   * [Vector Visualizations](#vector-visualizations)


## "Best Available" Layers

Visualization layers representing the same science parameter from a specific instrument and platform may be available for multiple versions and/or data latencies. Direct access to those various flavors of the same visualization are directly available. However, many users are simply interested in seeing a consistent "best available" visualization. The details of what is "best" being determined by the GIBS team. Therefore, GIBS provides a unique set of "Best Available" visualization layers for all of its visualization layers, abstracting away the individual versions and latencies. A similar naming convention is used, as described in the previous section, but identifiers do not specify the version or latency (e.g. *MODIS_Terra_Aerosol_Optical_Depth*).

For each "best available" layer, the "best" image will be determined based on the evaluation of availability for following imagery products:

1. Latest Version Standard Product
2. Latest Version NRT
3. Previous Version Standard Product
4. Previous Version NRT

![versions](img/versions.png)

See the image above for a visual example. The top four bars show the temporal coverage of related imagery products. The bottom bar shows the visualization products that will be returned based on the "best available" determination.


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


## Domain Sharding
Browsers typically limit the number of concurrent requests to the same server, based on hostname. In order to ake tiles load more quickly, it often makes sense to distribute requests over multiple hostnames to achieve more concurrency. Typically, browsers perform best with 3 different hostnames -- your performance may vary. (For example, if your server can't handle more than 2 requests simultaneously, then additional hostnames will not help you.)

HTTPS 2.0 vs 1.1... currently still 1.1... so additional DNS entries are available as a way to circumvent simultaneous connection limits of the web browser. The additional DNS entries are [https://gibs-a.earthdata.nasa.gov](https://gibs-a.earthdata.nasa.gov), [https://gibs-b.earthdata.nasa.gov](https://gibs-b.earthdata.nasa.gov), and [https://gibs-c.earthdata](https://gibs-c.earthdata).
nasa.gov. Please note that these are not additional servers, simply aliases for the [https://gibs.earthdata.nasa.gov](https://gibs.earthdata.nasa.gov) domain.


## Raster Color Maps

... Info here about colormaps

```text
Example from Capabilities response
```

## Vector Visualizations

Vector products are accessible through the GIBS Web Map Tile Service (WMTS) and Web Map Service (WMS) (see [Visualization Services](../visualization-services/). WMTS responses are formatted as gzip-compressed Mapbox vector tiles ([specification](https://docs.mapbox.com/vector-tiles/specification/)), or "MVTs", while WMS responses are available as raster images.

The data behind the WMTS and WMS visualization services are the same, however the mechanism for styling differs. A client application is responsible for applying styling to MVTs when using the WMTS API. (See [Vector Styles](../metadata/#vector-styles)) Conversely, GIBS applies a default style when rendering vector data as a raster when using the WMS API.

An MVT returned via the WMTS service contains information for a client to draw the features within the user interface, but also a set of properties that contain data associated with the feature. The Mapbox vector tile specification provides structure for representing these data, but no mechanism for interpreting the meaning or intended use. As such, additional metadata is required. GIBS has developed a specification for defining each property contained within MVTs in its vector products. (See [Vector Properties](../metadata/#vector-properties))


### Access
#### WMTS

Accessing a vector product through the WMTS service follows the same rules as raster products. The primary differences being the format specified in the request and of the response. When issuing a KVP WMTS request, the "format" value must be `application/vnd.mapbox-vector-tile`. When issuing a REST-ful WMTS request, the extension must be `.mvt`. See below for examples of each:

* REST Tile - [https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/VIIRS_NOAA20_Thermal_Anomalies_375m_All/default/2020-10-01T00:00:00Z/500m/4/3/4.mvt](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/VIIRS_NOAA20_Thermal_Anomalies_375m_All/default/2020-10-01T00:00:00Z/500m/4/3/4.mvt)
* KVP Tile - [https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?TIME=2020-10-01T00:00:00Z&FORMAT=application/vnd.mapbox-vector-tile&layer=VIIRS_NOAA20_Thermal_Anomalies_375m_All&tilematrixset=500m&Service=WMTS&Request=GetTile&Version=1.0.0&TileMatrix=4&TileCol=4&TileRow=3](https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?TIME=2020-10-01T00:00:00Z&FORMAT=application/vnd.mapbox-vector-tile&layer=VIIRS_NOAA20_Thermal_Anomalies_375m_All&tilematrixset=500m&Service=WMTS&Request=GetTile&Version=1.0.0&TileMatrix=4&TileCol=4&TileRow=3)

The response to a KVP or REST-ful WMTS response will be a gzip-compressed MVT. The following Python code snippet provides an example of how to download and print out the contents of a vector tile. Note that the Python [requests](https://requests.readthedocs.io/en/master/) library is automatically decoding the gzip'd response.

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


#### WMS

Accessing a vector product through the WMS service follows the same rules as raster products. Both version 1.1.1 and 1.3.0 WMS GetMap requests will return rasterized representations of the vector product. See below for an example request and response:

* Request: [https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?/wms/epsg4326/best/wms.cgi?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&TIME=2020-10-01T00:00:00Z&LAYERS=VIIRS_NOAA20_Thermal_Anomalies_375m_All &FORMAT=image/png&STYLES=&HEIGHT=240&SRS=epsg:4326&WIDTH=480&BBOX=-180,-90,180,90&TRANSPARENT=TRUE](https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?/wms/epsg4326/best/wms.cgi?TIME=2020-10-01T00:00:00Z&LAYERS=VIIRS_NOAA20_Thermal_Anomalies_375m_All&REQUEST=GetMap&SERVICE=WMS&FORMAT=image/png&STYLES=&HEIGHT=240&VERSION=1.1.1&SRS=epsg:4326&WIDTH=480&BBOX=-180,-90,180,90&TRANSPARENT=TRUE)
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

### Vector Properties

The Mapbox vector tile specification provides structure for including data values as properties associated with a feature, but no mechanism for interpreting the meaning or intended use.  As such, GIBS has developed a specification for defining each property contained within MVTs in its vector products. Each vector product has an associated JSON vector metadata file which provides the following information:

* A unique identifier for the property, as found in the MVT data itself
* Descriptive information such as a title, description, and the function of the property (e.g. identification vs styling)
* The data type and optional units for the property
* Valid values for the property
* Additional flags for improved UI experience


#### Specification
The following table outlines the fields in the GIBS vector metadata specification. A JSON schema representation may be found [here](https://gibs.earthdata.nasa.gov/schemas/VectorMetadata_v1.0.json).

<table style="width: 100.0%;">
    <colgroup>
      <col style="width: 7.0931%;"/>
      <col style="width: 56.8714%;"/>
      <col style="width: 6.52312%;"/>
      <col style="width: 10.3863%;"/>
      <col style="width: 19.126%;"/>
    </colgroup>
    <tbody>
      <tr>
        <th style="text-align: center;">Name</th>
        <th style="text-align: center;">Description</th>
        <th style="text-align: center;">Type</th>
        <th colspan="1" style="text-align: center;">Required?</th>
        <th colspan="1" style="text-align: center;">Sample Value</th>
      </tr>
      <tr>
        <th>Identifier</th>
        <td>
          <span>The unique identifier of the MVT property.</span>
        </td>
        <td style="text-align: center;">String</td>
        <td colspan="1" style="text-align: center;">
          Yes
        </td>
        <td colspan="1" style="text-align: center;">
          <code>FRP</code>
        </td>
      </tr>
      <tr>
        <th>Title</th>
        <td>A human readable title for the property.</td>
        <td style="text-align: center;">String</td>
        <td colspan="1" style="text-align: center;">
          Yes
        </td>
        <td colspan="1" style="text-align: center;">
          <code>Fire Radiative Power</code>
        </td>
      </tr>
      <tr>
        <th colspan="1">Description</th>
        <td colspan="1">A human readable description for the property.</td>
        <td colspan="1" style="text-align: center;">String</td>
        <td colspan="1" style="text-align: center;">
          Yes
        </td>
        <td colspan="1" style="text-align: center;">
          <code>
            <span>A measure of the rate of radiant heat output from a fire.</span>
          </code>
        </td>
      </tr>
      <tr>
        <th colspan="1">Units</th>
        <td colspan="1">The units value to be applied to the actual value of this property.</td>
        <td colspan="1" style="text-align: center;">String</td>
        <td colspan="1" style="text-align: center;">
          No
        </td>
        <td colspan="1" style="text-align: center;">
          <code>MW</code>
        </td>
      </tr>
      <tr>
        <th colspan="1">DataType</th>
        <td colspan="1">The data type of this property. Possible values include <em>int</em>, <em>float</em>, <em>string</em>, or <em>datetime</em>.</td>
        <td colspan="1" style="text-align: center;">Enumeration</td>
        <td colspan="1" style="text-align: center;">
          Yes
        </td>
        <td colspan="1" style="text-align: center;">
          <code>float</code>
        </td>
      </tr>
      <tr>
        <th colspan="1">ValueList</th>
        <td colspan="1">A listing of the possible valid values for a 'string' property type, if the property has a controlled list.</td>
        <td colspan="1" style="text-align: center;">Array</td>
        <td rowspan="3" style="text-align: center;">
          <p>
            <br/>
          </p>
          <p>
            ?
          </p>
          <p>Only one may be used </p>
        </td>
        <td colspan="1" style="text-align: center;">
          <code>
            <span>[ "Lake Ice", "Sea Ice", "Not Ice" ]</span>
          </code>
        </td>
      </tr>
      <tr>
        <th colspan="1">ValueRanges</th>
        <td colspan="1">A listing of mutually exclusive min and max value pairs representing ranges of valid values for the 'Integer', 'float', and 'datetime' property types.</td>
        <td colspan="1" style="text-align: center;">Array of Objects</td>
        <td colspan="1" style="text-align: center;">
          <code>
            <span>[ { "Min": 0, "Max": 99999999 } ]</span>
          </code>
        </td>
      </tr>
      <tr>
        <th colspan="1">ValueMap</th>
        <td colspan="1">A map of the possible valid values for 'string' or 'int' property types, and their associated description.  <span>This facilitates a key-value lookup table allowing for a simplified property value (i.e. the ‘key’).</span>
        </td>
        <td colspan="1" style="text-align: center;">Object</td>
        <td colspan="1" style="text-align: center;">
          <code>
            <span>{ 10 : “Processed Fire Pixel”,    20 : “Saturated Fire Pixel” }</span>
          </code>
        </td>
      </tr>
      <tr>
        <th colspan="1">Function</th>
        <td colspan="1">
          <p>The property’s intended function as a part of the visualization product. Possible values include:</p>
          <ul>
            <li>
              <em>
                <span>Identify</span>
              </em>
              <span> - Properties that form a “primary key” to identify the visualization product. Often these are used used during processing to separate data points into separate layers (e.g. Platform and Day/Night).  These properties typically would also be in the associated layer metadata (e.g. Platform or Version) and embedded in the layer identifier (e.g. MODIS_Terra_Day_Fires).</span>
            </li>
            <li>
              <em>
                <span>Style</span>
              </em>
              <span> - Properties that are utilized for styling or filtering vector features.  These will typically be included in the default style(s) offered through WMS or the Mapbox Style JSONs. </span>
            </li>
            <li>
              <em>
                <span>Describe</span>
              </em>
              <span> - Properties that provide additional information regarding the vector feature (e.g. Acquisition Time or Inclination Angle).  They may be useful for tooltip presentation to users.</span>
            </li>
          </ul>
        </td>
        <td colspan="1" style="text-align: center;">Enumeration</td>
        <td colspan="1" style="text-align: center;">
          Yes
        </td>
        <td colspan="1" style="text-align: center;">
          <code>Describe</code>
        </td>
      </tr>
      <tr>
        <th colspan="1">IsOptional</th>
        <td colspan="1">Indicates whether the property is optional.</td>
        <td colspan="1" style="text-align: center;">Boolean</td>
        <td colspan="1" style="text-align: center;">
          Yes
        </td>
        <td colspan="1" style="text-align: center;">
          <code>true</code>
        </td>
      </tr>
      <tr>
        <th colspan="1">IsLabel</th>
        <td colspan="1">Indicates whether the property should be used to label the point in a user interface.</td>
        <td colspan="1" style="text-align: center;">Boolean</td>
        <td colspan="1" style="text-align: center;">
          Yes
        </td>
        <td colspan="1" style="text-align: center;">
          <code>true</code>
        </td>
      </tr>
    </tbody>
</table>

All vector metadata file are validated against the following "business logic" rules that extend beyond the basic individual property constraints.

1. A single, non-optional, property will be identified as the "label".
2. A single, non-optional, property will have the "Identify" function, which acts as the primary key for properties.
3. Properties are uniquely identified by their *Identifier* field.
4. Items in the *ValueList* are unique.
5. ValueRange is only supported for properties with a *DataType* of "int", "float", or "datetime."
6. ValueRange is only supported for properties with a *DataType* of "int" or "string.


#### WMTS Capabilities Definition

A vector product's vector metadata file is referenced in the WMTS Capabilities document as `Layer/ows:Metadata` elements. The following snippet shows an example of how these elements will appear in the XML Capabilities response. Note that there are two entries listed. One is for the "default" *vector metadata* file and one for the versioned (e.g. '1.0') *vector metadata* file. This allows for the addition of future versions as enhancements are
made to the GIBS vector product visualization capabilities, while retaining backwards compatibility.

``` xml
<ows:Metadata xlink:type="simple" 
              xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/layer" 
              xlink:href="https://gibs.earthdata.nasa.gov/vector-metadata/v1.0/FIRMS_MODIS_Thermal_Anomalies.json"
              xlink:title="Layer Metadata"/>

<ows:Metadata xlink:type="simple" 
              xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/layer/1.0"
              xlink:href="https://gibs.earthdata.nasa.gov/vector-metadata/v1.0/FIRMS_MODIS_Thermal_Anomalies.json" 
              xlink:title="Layer Metadata"/>
```

#### Sample Content

A *vector metadata* file is a list of content blocks defining each property. The following snippet shows an example of a single property's definition within the *vector metadata* file.

**Metadata Snippet**

``` json
{
"Identifier" : "NumReactor",
"Title" : "Number of Reactors",
"Description": "Number of Active Reactors at a given Plant",
"Units" : "Reactors",
"DataType" : "int",
"ValueRanges": [ { "Min": 1, "Max": 9 } ],
"Function" : "Style",
"IsOptional" : false,
"IsLabel" : false
}
```

The following block provides a full example of a *vector metadata* file.

**Full Metadata File**

``` json
{
  "id": "Nuclear_Power_Plant_Locations",
  "mvt_properties": [
 
    {
      "Identifier" : "Plant",
      "Title"      : "Plant Site Name",
      "Description": "Name of Nuclear Plant",
      "DataType"   : "string",
      "Function"   : "Identify",
      "IsOptional" : false,
      "IsLabel"    : true
    },
 
    {
      "Identifier" : "NumReactor",
      "Title"      : "Number of Reactors",
      "Description": "Number of Active Reactors at a given Plant",
      "Units"      : "Reactors",
      "DataType"   : "int",
      "ValueRanges": [ { "Min": 1, "Max": 9 } ],
      "Function"   : "Style",
      "IsOptional" : false,
      "IsLabel"    : false
    },
 
    {
      "Identifier" : "p10_30",
      "Title"      : "Population within 30km (2010)",
      "Description": "Total population within a 30km radius of the nuclear plant (2010)",
      "Units"      : "Persons",
      "DataType"   : "int",
      "ValueRanges": [ { "Min": 275, "Max": 7170590 } ],
      "Function"   : "Describe",
      "IsOptional" : false,
      "IsLabel"    : false
    }
}
```


### Vector Styles

As mentioned previously, a client is responsible for applying style to MVT tiles received from the GIBS WMTS service in order to represent the feature defined within the MVT. This is most simply done by utilizing the vector style file provided by GIBS for each vector product. These vector style files following the [Mapbox style specification](https://docs.mapbox.com/mapbox-gl-js/style-spec/). Here is a [live example](https://nasa-gibs.github.io/gibs-web-examples/examples/openlayers/vectors/geographic-epsg4326-vector-mapbox-styles.html) of how to use these styles with [OpenLayers](http://openlayers.org/).

#### WMTS Capabilities Definition

A vector product's vector style file is referenced in the WMTS Capabilities document as Layer/ows:Metadata elements. The following snippet shows an example of how these elements will appear in the XML Capabilities response. Note that there are two entries listed. One is for the "default" *vector style* file and one for the versioned (e.g. '1.0') *vector style* file. This allows for the addition of future versions as enhancements are made to the GIBS vector product visualization capabilities, while retaining retaining backwards compatibility.

**WMTS Capabilities Layer Metadata**

``` xml
<ows:Metadata xlink:type="simple" 
              xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/mapbox-gl-style"
              xlink:href="https://gibs.earthdata.nasa.gov/vector-styles/v1.0/FIRMS_VIIRS_Thermal_Anomalies.json"
              xlink:title="Mapbox GL Layer Styles"/>
              
<ows:Metadata xlink:type="simple" 
              xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/mapbox-gl-style/1.0"
              xlink:href="https://gibs.earthdata.nasa.gov/vector-styles/v1.0/FIRMS_VIIRS_Thermal_Anomalies.json"
              xlink:title="Mapbox GL Layer Styles"/>
```

#### Vector Style Contents

The *vector style* file contains the necessary information to apply a default style to a GIBS vector product, as required by the [Mapbox style specification](https://docs.mapbox.com/mapbox-gl-js/style-spec/). The file may contain style information for more than one vector product, as this allows for simplified file management within the GIBS system. Unneeded information should be ignored by the display library (e.g. [OpenLayers](http://openlayers.org/)). The following block provides a full example of a *vector style* file.

**Sample Vector Style File**

``` json
{
  "version": 8,
  "name": "SEDAC",
  "sources": {
    "GRanD_Reservoirs": {
      "type": "vector",
      "tiles": [
        "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/GRanD_Reservoirs/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.mvt"
      ]
    }
  },
  "layers": [
    {
      "id": "GRanD_Reservoirs_v1.01_STD",
      "source": "GRanD_Reservoirs",
      "source-layer": "GRanD_Reservoirs_v1.01_STD",
      "source-description": "Default",
      "type": "fill",
      "paint": {
        "fill-color": "rgb(0, 77, 168)"
      }
    }
  ]
}
```
