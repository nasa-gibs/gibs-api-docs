**Service Endpoints**

GIBS imagery layers are made available through standard access methods, described in a following section of this page. Where applicable, those services have multiple "endpoints" that contain a specific set of GIBS imagery layers. The endpoints are scoped using the following items:

1. Service - Either the WMTS, WMS, or TWMS specification.
2. Projection - The EPSG code for the appropriate projection.
3. Type - The "type" of imagery layers available in the endpoint. Valid values include:
    1. best - The "Best Available" imagery products.
    2. std - Standard imagery products only.
    3. nrt - Near Real-Time imagery products only.
    4. all - All Best Available, Standard, and Near Real-Time imagery products.

The pattern for a GIBS service endpoint is shown below. Parameterized elements of the pattern are provided in \{parameter:value1[|value2]*\} notation.

``` xml
https://gibs.earthdata.nasa.gov/{service:wmts|wms|twms}/epsg{code:4326|3857|3413|3031}/{type:all|best|nrt|std}
```

The following table provides some sample endpoints for various unique combinations:

| Service | EPSG | Type | Sample Endpoint |
| ------- | ---- | ---- | --------------- |
| WMTS | 4326 | all | https://gibs.earthdata.nasa.gov/wmts/epsg4326/all/ |
| WMS | 3857 | best | https://gibs.earthdata.nasa.gov/wms/epsg3857/best/ |
| TWMS | 3413 | nrt | https://gibs.earthdata.nasa.gov/twms/epsg3413/nrt/ |