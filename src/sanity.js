import sanityClient from "@sanity/client";


const client = sanityClient({
  projectId: "f2w81k10",
  dataset: "production",
  apiVersion: "2021-03-25", // use current UTC date - see "specifying API version"!
  token:
    "skDV5EwPsXLSxM3SYCEE7jSi0dhjb2nYNI2b5kfcRAKp7Ks07iqcrlIPMMFwUXOnYgpvNMcdPJG1iHISrrq2ZorCg3GX4olwCDpFxCkkLN0U5seKZjgm5OSI055mDOch7WpREZGnvN1gnbmDEsZayhS32c7cluEnXuc3MFkWM1MPSgUNOXmz", // or leave blank for unauthenticated usage
  useCdn: true, // `false` if you want to ensure fresh data
});

export default client;
