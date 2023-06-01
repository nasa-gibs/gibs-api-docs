/**
 * 
 * @param {*} layer 
 * @param {*} key 
 * @returns 
 */
const getDate = (layer, key) => {
  if (!layer[key]) {
    return key === 'endDate' && layer['startDate'] ? 'Present' : '';
  }
  const { period, ongoing } = layer;
  const date = period === 'subdaily' ? layer[key] : layer[key].split('T')[0];

  return (key === 'endDate' && ongoing) ? 'Present' : date;
}

/**
 * 
 * @param {*} projections 
 * @returns 
 */
const getResolution = ({ projections, type }) => {
  const resObj = {};
  Object.keys(projections).forEach(key => {
    const res = projections[key].matrixSet;
    if (res) {
      resObj[res] = resObj[res] ? resObj[res].concat([key]) : [key]
      if (key === "geographic" && type !== "vector")
        resObj[res].push("web mercator")
    }
  });
  return resObj;
}

/**
 * 
 * @param {*} layer 
 * @returns 
 */
const getProjections = (layer) => {
  const projections = Object.keys(layer.projections);
  if (layer.type !== "vector" && layer.projections.hasOwnProperty("geographic"))
    projections.unshift("web mercator");
  return projections;
}

/**
 * 
 * @param {*} conceptIds 
 * @returns 
 */
const getProducts = (conceptIds) => {
  return (conceptIds || []).map((obj) => {
    return {
      ...obj,
      url: `https://cmr.earthdata.nasa.gov/search/concepts/${obj.value}.html`,
    }
  })
}

/**
 * Build an array of all layers with display properties formatted as needed for docs
 * @param {*} layers 
 * @returns 
 */
function formatLayers (layers) {
  Object.keys(layers).forEach(id => {
    const layer = layers[id];
    const { period, title, layergroup } = layer;
    const format = (layer.format || ' / ').split('/')[1];
    const [ platform, instrument ] = (layer.subtitle || ' / ').split('/');
    layers[id] = {
      id,
      period,
      title,
      layergroup,
      projections: getProjections(layer),
      resolution: getResolution(layer),
      format: format && format.trim(),
      products: getProducts(layer.conceptIds),
      startDate: getDate(layer, 'startDate'),
      endDate: getDate(layer, 'endDate'),
      platform: platform && platform.trim(),
      instrument: instrument && instrument.trim(),
    }
  });
  return layers;
}

const app = new Vue({
  el: '#app-container',
  data: {
    loading: true,
    errorLoading: false,
    allMeasurements: undefined,
    allLayers: undefined,
    measurements: undefined,
    categories: undefined, 
    selectedCategory: 'All',
  },
  methods: {
    selectCategory: function(event) {
      const category = event.target.options[event.target.options.selectedIndex].text
      this.measurements = this.getMeasurementsForCategory(category);
      this.selectedCategory = category;
    },
    init: function (data) {
      const { measurements, layers, categories } = data; 
      this.loading = false;
      this.allMeasurements = measurements;
      this.allLayers = formatLayers(layers);
      this.categories = categories['science disciplines'];
      this.measurements = this.getMeasurementsForCategory(this.selectedCategory);
    },
    error: function () {
      this.loading = false;
      this.errorLoading = true;
    },
    getMeasurementsForCategory: function (category) { 
      const { measurements } = this.categories[category];
      return measurements.map((key) => {
        const m = this.allMeasurements[key];
        m.layers = Object.keys(m.sources)
          .flatMap((source) => {
            const { settings } = m.sources[source];
            return settings.map((id) => this.allLayers[id])
          })
          .filter(({ layergroup }) => {
            return key === 'Orbital Track' ? true : layergroup !== 'Orbital Track'
          });
        return m;
      })
    },
  }
});

const requestSettings = {
  url: "https://worldview.earthdata.nasa.gov/config/wv.json",
  type: "GET",
  crossDomain: true,
  dataType: "json",
  success: app.init,
  error: app.error,
}

$(document).ready(() => { 
  $.ajax(requestSettings);
});