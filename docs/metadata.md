# Visualization Metadata



## Raster Color Maps

... Info here about colormaps

```text
Example from Capabilities response
```


## Vector Properties

The Mapbox vector tile specification provides structure for including data values as properties associated with a feature, but no mechanism for interpreting the meaning or intended use.  As such, GIBS has developed a specification for defining each property contained within MVTs in its vector products. Each vector product has an associated JSON vector metadata file which provides the following information:

   * A unique identifier for the property, as found in the MVT data itself
   * Descriptive information such as a title, description, and the function of the property (e.g. identification vs styling)
   * The data type and optional units for the property
   * Valid values for the property
   * Additional flags for improved UI experience


### Specification
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


### WMTS Capabilities Definition

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

### Sample Content

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


## Vector Styles

As mentioned previously, a client is responsible for applying style to MVT tiles received from the GIBS WMTS service in order to represent the feature defined within the MVT. This is most simply done by utilizing the vector style file provided by GIBS for each vector product. These vector style files following the [Mapbox style specification](https://docs.mapbox.com/mapbox-gl-js/style-spec/). Here is a [live example](https://nasa-gibs.github.io/gibs-web-examples/examples/openlayers/vectors/geographic-epsg4326-vector-mapbox-styles.html) of how to use these styles with [OpenLayers](http://openlayers.org/).

### WMTS Capabilities Definition

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

### Vector Style Contents

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
