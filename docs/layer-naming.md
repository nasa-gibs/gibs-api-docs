**Layer Naming**

GIBS imagery layer identifiers follow a human-readable convention (e.g. *MODIS_Terra_Aerosol_Optical_Depth_v6_STD*) to simplify situations where manual parsing of service documentation (e.g. WMTS GetCapabilities) is performed. Identifiers include uniquely identifying information like the following items:

* **Science Parameter** - The science parameter that is being visualized (e.g. "Aerosol Optical Depth")
* **Processing Level** - The processing level of the associated data (e.g. "L3" or "L2")
* **Data Period** - The period of the available imagery products (e.g. "Monthly")
* **Data Version** - The version of the associated data product (e.g. "v6")
* **Data Latency** - The latency of the associated data product (e.g. "STD" or "NRT")
* **Instrument/Platform** - The Instrument and Platform responsible for collecting the visualized data (e.g. "MODIS / Terra").

The following are examples of imagery layer identifiers for the "Aerosol Optical Depth" science parameter collected by the MODIS instrument on the Terra platform. In this example, imagery layers exist for a combination of data versions and latencies. The first item is considered the "Best Available"
layer, which is described further in the following section.

Example layer names are listed below:

* MODIS_Terra_Aerosol_Optical_Depth
* MODIS_Terra_Aerosol_Optical_Depth_v6_NRT
* MODIS_Terra_Aerosol_Optical_Depth_v6_STD
* MODIS_Terra_Aerosol_Optical_Depth_v5_NRT