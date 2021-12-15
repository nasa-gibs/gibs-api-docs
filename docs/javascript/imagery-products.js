/**
 * Build an array of all layers with display properties formatted as needed for docs
 * @param {*} layers 
 * @returns 
 */
function formatLayers (layers) {
  const getDate = (layer, key) => {
    if (!layer[key]) {
      return key === 'endDate' && layer['startDate'] ? 'Present' : '';
    }
    const { period, inactive } = layer;
    const date = period === 'subdaily' ? layer[key] : layer[key].split('T')[0];
    return (key === 'endDate' && !inactive) ? 'Present' : date;
  }
  const getResolution = (projections) => {
    const resObj = {};
    Object.keys(projections).forEach(key => {
      const { matrixSet } = projections[key];
      if (matrixSet)
        resObj[matrixSet] = resObj[matrixSet] ? resObj[matrixSet] += `, ${key}` : key 
    });
    const resKeys = Object.keys(resObj)
    switch (resKeys.length) {
      case 0: {
        return [];
      }
      case 1: {
        return [resKeys[0]];
      }
      default: 
        return resKeys.map(res => `${res} (${resObj[res]})`);
    }
  }
  Object.keys(layers).map(id => {
    const layer = layers[id];
    const projections = Object.keys(layer.projections);
    const resolution = getResolution(layer.projections);
    const startDate = getDate(layer, 'startDate');
    const endDate = getDate(layer, 'endDate');
    const format = (layer.format || ' / ').split('/')[1];
    const product = (layer.conceptIds || []).map(({shortName}) => shortName).join(', ');
    const [ platform, instrument ] = (layer.subtitle || ' / ').split('/');
    
    layers[id] = {
      ...layer,
      projections,
      format: format && format.trim(),
      product,
      startDate,
      endDate,
      platform: platform && platform.trim(),
      instrument: instrument && instrument.trim(),
      resolution,
    }
  });
  return layers;
}

const app = new Vue({
  el: '#page-container',
  data: {
    loading: true,
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
  success: app.init
}

$(document).ready(() => { 
  $.ajax(requestSettings);
});