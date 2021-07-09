**"Best Available" Layers**

As has been discussed, imagery layers visualizing the same science parameter from a specific instrument and platform may be available for multiple versions and/or data latencies. Direct access to those various flavors of the same visualization are directly available. However, many users are simply interested in seeing a consistent "best available" imagery layer. The details of what is "best" being determined by the GIBS team. Therefore, GIBS provides a unique set of "Best Available" imagery layers for all of its imagery layers, abstracting away the individual versions and latencies. A similar naming convention is used, as described in the previous section, but identifiers do not specify the version or latency (e.g. MODIS_Terra_Aerosol_Optical_Depth). 

For each "best available" layer, the "best" image will be determined based on the evaluation of availability for following imagery products:

1. Latest Version Standard Product
2. Latest Version NRT
3. Previous Version Standard Product
4. Previous Version NRT

![versions](img/versions.png)

See the image above for a visual example. The top four bars show the temporal coverage of related imagery products. The bottom bar shows the imagery products that will be returned based on the "best available" determination.
