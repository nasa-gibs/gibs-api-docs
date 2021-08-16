# Access Advanced Topics

   * [Raster Color Maps](#raster-color-maps)


### Specification
The GIBS Colormap specification outlines the format and content of GIBS Colormap XML documents. The GIBS Colormap XML document contains the information required to document the mapping between data values and RGB colors in a raster visualization, hereafter referred to as "data-to-image mapping."  Additionally, the Colormap contains information required to generate a legend graphic representation of the mapping. The following sections will provide information regarding the Colormap constructs, sample Colormap XML demonstrating the data-to-image mapping approaches, and specific considerations when developing the Colormap.


#### Colormap Schema
This section provides an overview of the content and format of each element within the GIBS Colormap XML schema.


##### &lt;ColorMaps&gt;
The root element of the GIBS Colormap XML is the *ColorMaps* element as is shown in the following XML schema snippet. This element contains one or more ColorMap element, described in the following section.

``` xml
<xs:element name="ColorMaps">
  <xs:complexType>
    <xs:sequence>
      <xs:element ref="ColorMap" maxOccurs="unbounded" minOccurs="1" />
    </xs:sequence>
  </xs:complexType>
</xs:element>
```

##### &lt;ColorMap&gt;
The *ColorMap* element is defined as is shown in the following XML schema snippet. Each ColorMap represents a unique set of data-to-image mapping information. For reasons described later in this document, it is common for a GIBS Colormap XML document to have 2 or more ColorMap elements. For example, one ColorMap element for the "no data" and/or classification values, and one ColorMap element for the actual data values.

``` xml
<xs:element name="ColorMap">
  <xs:complexType>
    <xs:sequence>
      <xs:element ref="Entries" />
      <xs:element ref="Legend" minOccurs="0"/>
    </xs:sequence>
    <xs:attribute type="xs:string" name="title" use="required" />
    <xs:attribute type="xs:string" name="units" use="optional" />
  </xs:complexType>
</xs:element>
```

The *Entries* and *Legend* elements represent the two major conceptual constructs within the GIBS Colormap, described below. These will be further described in the following sections.

   * **Colormap Entries** - The complete set of the data-to-image mapping information used for provenance and image interpretation.
   * **Colormap Legend** - A simplified set of the data-to-image mapping information used for generating legend graphics.

The ColorMap element has the following two attributes:

   * **title (Required)** - A human-readable title that uniquely identifies the contents of the Colormap. (e.g. "No Data", "Classifications", "Sea Surface Temperature")
   * **units (Optional)** - The units to be applied to data values within the Colormap Entries and Legend information. If the visualized data parameter is unitless, then this attribute may be omitted.

##### &lt;Entries&gt;
The *Entries* element is defined as is shown in the following XML schema snippet. This element provides to explicit information about the data-to-image mapping, but simply is a parent to the *ColorMapEntry* elements, which will contain detailed information.

``` xml
<xs:element name="Entries">
  <xs:complexType>
    <xs:sequence>
      <xs:element ref="ColorMapEntry" maxOccurs="unbounded"/>
    </xs:sequence>
  </xs:complexType>
</xs:element>
```

##### &lt;ColorMapEntry&gt;
The *ColorMapEntry* element is where the specifics regarding the data-to-image mapping are defined. All information is represented in XML schema attributes on the *ColorMapEntry* element. The possible attributes are listed below for context to the sample XML schema snippet following the list.

   * **rgb (Required)** - A comma separated listing of the 8-bit red, green, and blue channel values.
   * **transparent (Optional)** - A boolean flag indicating whether the entry should be opaque (false) or transparent (true). (Default = "false")
   * **sourceValue (Optional)** - The data value(s) that correspond to the raw data values within the source data file used during data-to-image mapping. Values are represented using interval notation.
   * **value (Optional)** - The data value(s) that correspond to the scaled data values to which measured units (e.g. "°K") may be applied. Values are represented using interval notation.
   * **ref (Required)** - A short integer numerical field used to facilitate references between ColorMapEntry element(s) and the Colormap Legend.
      * NOTE – This value may be shared across multiple consecutive ColorMapEntry elements if the Legend will have a one-to-many association. 
   * **nodata (Optional)** - A boolean flag indicating whether the entry should be used as the “No Data” fill value. (Default = "false")
      * NOTE – One, and only one, ColorMapEntry element within all ColorMap elements must contain the nodata=”true” attribute.

``` xml
<xs:element name="ColorMapEntry">
  <xs:complexType>
    <xs:simpleContent>
      <xs:extension base="xs:string">
        <xs:attribute name="rgb" use="required">
          <xs:simpleType>
            <xs:restriction base="xs:string">
              <xs:pattern value="\d{1,3},\d{1,3},\d{1,3}" />
            </xs:restriction>
          </xs:simpleType>
        </xs:attribute>
        <xs:attribute type="xs:boolean" name="transparent" default="false"/>
        <xs:attribute name="sourceValue">
          <xs:simpleType>
            <xs:restriction base="xs:string">
              <xs:pattern value="[\[(]?((-?\d+(\.\d+)?(e[\+\-]\d+)?)|([\+\-]INF))(,((-?\d+(\.\d+)?(e[\+\-]\d+)?)|([\+\-]INF)))?[\])]?(,[\[(]?((-?\d+(\.\d+)?(e[\+\-]\d+)?)|([\+\-]INF))(,((-?\d+(\.\d+)?(e[\+\-]\d+)?)|([\+\-]INF)))?[\])]?)*" />
            </xs:restriction>
          </xs:simpleType>
        </xs:attribute>
        <xs:attribute name="value">
          <xs:simpleType>
            <xs:restriction base="xs:string">
              <xs:pattern value="[\[(]?((-?\d+(\.\d+)?(e[\+\-]\d+)?)|([\+\-]INF))(,((-?\d+(\.\d+)?(e[\+\-]\d+)?)|([\+\-]INF)))?[\])]?(,[\[(]?((-?\d+(\.\d+)?(e[\+\-]\d+)?)|([\+\-]INF))(,((-?\d+(\.\d+)?(e[\+\-]\d+)?)|([\+\-]INF)))?[\])]?)*" />
            </xs:restriction>
          </xs:simpleType>
        </xs:attribute>
        <xs:attribute type="xs:short" name="ref" use="required"/>
        <xs:attribute type="xs:boolean" name="nodata" default="false" use="optional"/>
      </xs:extension> 
    </xs:simpleContent>
  </xs:complexType>
</xs:element>
```

The *sourceValue* and *value* attribute values may specify a single floating point value or a range of data values. The *value* attribute should be provided for all mappings that represent a measured data value. Not providing the *value* attribute indicates that the colormap entry represents a classification (e.g. "Forest" or "No Data"), which should not be represented as a part of the measured data range. The *sourceValue* should be provided for all ColorMapEntry elements, as it is a representation of the raw data values mapped to that visual RGB color within the image. In many cases, the *sourceValue* and *value* attributes will have the same value, due to the situation where there is no offset of scale factor between the raw and measured data values. Not providing the *sourceValue* attribute indicates that the RGB color is not mapped to a specific raw data value. The likelihood of this is slim and exceptions will be discussed between the imagery provider and GIBS during Colormap creation. However, to allow for special cases, the attribute is not explicitly required.

For the purposes of clarity, the GIBS color map entry utilizes [interval notation](https://en.wikipedia.org/wiki/Interval_(mathematics))) to explicitly define a range as inclusive or exclusive. The following graphic provides an overview of how this is accomplished. A parenthesis indicates an exclusive endpoint and a bracket indicates an inclusive endpoint. Within this notation, a single value should be specified as `[value]`. Values of `+INF` and `-INF` are supported to indicate open-ended ranges. A comma separate list of intervals may be used to indicate disjoint value ranges.

##### &lt;:Legend&gt;
As was previously mentioned, each *ColorMap* may specify a *Legend* element. The *Legend* element is used to provide a representation of the *ColorMapEntry* elements for the purpose of generating a legend graphic. The *Legend* element is defined as shown in the following XML schema snippet. The *LegendEntry* elements contain the detailed information required for generating the legend graphic.

``` xml
<xs:element name="Legend">
  <xs:complexType>
    <xs:sequence>
      <xs:element ref="LegendEntry" maxOccurs="unbounded"/>
    </xs:sequence>
    <xs:attribute name="type" use="required">
      <xs:simpleType>
        <xs:restriction base="xs:string">
          <xs:enumeration value="continuous" />
          <xs:enumeration value="discrete" />
          <xs:enumeration value="classification" />
        </xs:restriction>
      </xs:simpleType>
    </xs:attribute>
    <xs:attribute type="xs:string" name="minLabel" use="optional" />
    <xs:attribute type="xs:string" name="maxLabel" use="optional" />
  </xs:complexType>
</xs:element>
```

The Legend element has the following three attributes:

   * **type (Required)** - The type of data-to-image mapping that is being represented in the ColorMap. Valid values include "Classification", "Discrete", and "Continuous". The differences between these are described in a subsequent section.
   * **minLabel (Optional)** - A unitless label that may be used as the "minimum value" for a generated legend graphic. This value will typically be a single value (e.g. "10") or an open range (e.g. "< 10"), properly encoded. 
   * **maxLabel (Optional)** - A unitless label that may be used as the "maximum value" for a generated legend graphic. This value will typically be a single value (e.g. "50") or an open range (e.g. ">= 50"), properly encoded.


##### &lt;LegendEntry&gt;
The LegendEntry is where the specifics regarding how a legend graphic should be generated are defined. All information is represented in XML Schema attributes on the LegendEntry element. The possible attributes are listed below for context to the sample XML schema snippet following the list.

   * **rgb (Required)** - A comma separated list of the 8-bit red, green, and blue channel values.
   * **tooltip (Required)** - A unitless label describing the value, range, or classifier (e.g. "Land") associated with this legend entry.
   * **showTick (Optional)** – A boolean flag indicating whether the legend entry should be annotated with a tick mark when programatically generating a legend graphic. (Default = "false")
   * **showLabel (Optional)** - A boolean flag indicating whether the legend entry should be annotated with a unitless label (from the tooltip attribute when programatically generating a legend graphic. (Default = "false")
   * **id (Required)** - The numerical ref attribute value in the corresponding ColorMapEntry elements to which this LegendEntry is associated.

``` xml
<xs:element name="LegendEntry">
  <xs:complexType>
    <xs:simpleContent>
      <xs:extension base="xs:string">
        <xs:attribute name="rgb" use="required">
          <xs:simpleType>
            <xs:restriction base="xs:string">
              <xs:pattern value="\d{1,3},\d{1,3},\d{1,3}" />
            </xs:restriction>
          </xs:simpleType>
        </xs:attribute>
        <xs:attribute type="xs:string" name="tooltip" use="required" />
        <xs:attribute type="xs:string" name="label" use="optional" />
        <xs:attribute type="xs:boolean" name="showTick" default="false" use="optional" />
        <xs:attribute type="xs:boolean" name="showLabel" default="false" use="optional" />
        <xs:attribute type="xs:short" name="id" use="required" />
      </xs:extension>
    </xs:simpleContent>
  </xs:complexType>
</xs:element>

```



When developing the color maps, the following considerations should be addressed:

Discrete vs. Continuous Data Values

An example of a discrete data range is “Percent Snow Cover”, where the data values are integer percentages from 0% to 100%. In this instance, it would not be appropriate to list a range of values (e.g. “[2,3)”), but instead the discrete value alone (e.g. “[3]”). When the corresponding data is continuous (e.g. “Land Surface Temperature”), then a range should be utilized (e.g. “[10.3,20.6)”).


Inclusive vs. Exclusive Range Endpoints

The most common approach to representing continuous data values is to utilize ranges that start inclusive and end exclusive (e.g. “[2,3)”). Where possible, color map ranges should follow this pattern. However, this is not enforced by GIBS and providers may utilize different inclusive/exclusive rules if required. Note that ranges may not overlap by both including the same end or start value.


Color Map Identification

The GIBS Color Map schema supports multiple ColorMap elements, that each represents a portion of the visualized parameter values. Typically, a single ColorMap element can be used to represent all visualized data values. In some situations, the visualization may represent to separate ranges (e.g. Cloud Effective Radius within an “Ice Phase” and “Water Phase”). In this case, two separate ColorMap elements are needed. Classification values must be included in a separate ColorMap when available. The “NoData” color value may be included in it’s own ColorMap or included in the primary ColorMap with the visualized data values. Having a separate ColorMap is recommended for clarity


Color Map Entry Ordering

The ordering of GIBS Color Map entries dictates the ordering of the PNG palette for the associated imagery product. Color Map entries representing data values should be grouped and ordered based on their natural numerical ordering. Classification or other non-data values (e.g. transparent flags) should be grouped at the beginning and/or end of a Color Map.

NOTE – If imagery is submitted to GIBS as a paletted PNG, the ordering of mapping elements must match the ordering of colors in the PNG’s palette.


Precision

The number of digits to the right of the decimal place in the sourceValue, value, and label elements should be consistent across all values in the color map. For example, the following values are considered consistent:

-0.12
-10.10
-20.00
-0.05e+16
Providers may choose the level of detail that they feel is appropriate for the data being represented. In general, GIBS finds the following heuristics to be applicable:

The range size and number of significant digits are inversely proportional (e.g. small range = more significant digits)
Be true to the data’s level of detail and measurement accuracy (i.e. don’t introduce precision where it does not exist)
The detail in the sourceValue, value, and label fields may not be consistent when compared to each other (e.g. sourceValue=1000, value=10.00, label=10. However, precision should be consistent compared to their companions in other mappings (e.g. all label values have the same precision).
ColorMapEntry Label Creation

The ColorMapEntry label field is used to provide a default, human readable, representation of the data value that is being visualized. The following guidelines should be used when generating labels:

Discrete values should be labeled using this pattern: “<Value> <Unit>”
Range values should be labeled using this pattern: “<Lower Value> – <Upper Value> <Unit>”
Classifications should be labeled with capitalized text: “Forest” or “No Data”
The number of significant digits in the label field may differ from that of the value element. This should be chosen based on the heuristics described in the previous section.
Where possible, special characters (e.g. 2) should be used instead of substitutive notations (e.g. ^2). UTF-8 encoding is utilized for this purpose within the XML documents.
ColorMap min/maxLabel Creation

The ColorMap minLabel and maxLabel fields are used to provide default, human readable, representations of the min/max data values being visualized. The following guidelines should be used when generating labels:

Discrete values should be labeled using this pattern: “<Value> <Unit>”
Range values should be labeled using this pattern: “<Lower Value> – <Upper Value> <Unit>”
Classifications do not utilize these attributes
The number of significant digits in the label field may differ from that of the value element. This should be chosen based on the heuristics described in the previous section.
Where possible, special characters (e.g. 2) should be used instead of substitutive notations (e.g. ^2). UTF-8 encoding is utilized for this purpose within the XML documents.
Non-Data Values

There may exist colors in the Color Map that do not correlate to a value in the underlying data. In this instance, both the sourceValue and value attributes should not be provided.


No-Data Value

In contrast to the “Non-Data Values” mentioned above, one and only one colormap entry must have a nodata attribute value of true. This indicates that this color is used by the imagery provider and GIBS to fill areas of the image where no data is being visualized. This is used both during imagery processing and access.


LegendEntry showTick/showLabel Usage

The LegendEntry showTick and showLabel attributes provide direction when generating a legend graphic for a Color Map document. The identification of the “best” tick/labeling approach for a ColorMap will depend on the Color Map density and color variation. It is expected that this process will be iterative. The following guidelines should be noted when setting these attributes:

Discrete values will be ticked/labeled in the middle of the legend graphic portion.
Continuous values/ranges will be ticked/labeled at the beginning of the legend graphic portion.
The first legend entry should have showTick and showLabel attribute values of “False” because the beginning of the graphic will be automatically labeled with the minValue attribute value.
Tick marks without a label may be used to provide visual progression to the legend without too many labels.
