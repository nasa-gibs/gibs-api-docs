## Bulk Downloading

A "Bulk Download" is defined as the planned retrieval of more than 1,000,000 imagery tiles within a 24 hour period. These activities are typically orchestrated through script-based access to the GIBS API, not user-based access through a client application. In order to ensure quality of service for all GIBS users, the GIBS team requests that bulk downloading activities be coordinated at least 48 hours in advance of the planned download. Prior to
beginning your bulk downloading activities, please contact the GIBS support team at [support@earthdata.nasa.gov](support@earthdata.nasa.gov) with the subject "GIBS Bulk
Download Request" and the following information:

1. Purpose
2. Primary POC (Email & Phone)
3. Layers
4. Zoom Level(s)
5. Date(s)
6. Expected Load Profile
    * Start and End Times
    * Request Volume per Hour
    * Number of Concurrent Downloads
7. Source IP Address(es)

The GIBS utilization profile indicates that there is not a period of time within which "regular" usage drops. Therefore, bulk downloading activities are
allowed to occur as is convenient for the downloading group or individual. The following guidelines should be taken into consider when designing a
bulk download plan:

1. Limit sustained download bandwidth to 50 Mbps.
    * For GIBS overlay (PNG) layers, this is an approximate minimum of 150k tiles per hour due to the large size variation based on the image content density.
    * For GIBS base (JPEG) layers, this is approximately 350k tiles per hour with limited variation in image size across products and geographic regions.
2. Limit concurrent downloads to 500 threads
3. Evenly distribute download requests across the entire bulk downloading period, avoiding significant spikes of activity.
4. Start small with fewer concurrent threads and build to your proposed maximum download rate.

[Subscribe to our mailing list](https://lists.nasa.gov/mailman/listinfo/eosdis-gibs-announce) and [follow our blog](https://wiki.earthdata.nasa.gov/pages/viewrecentblogposts.action?key=GIBS) to stay up-to-date with new features and changes to existing services. Or contact us at [support@earthdata.nasa.gov](support@earthdata.nasa.gov) with feedback and questions.