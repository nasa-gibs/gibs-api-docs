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
      resObj[matrixSet] = resObj[matrixSet] ? resObj[matrixSet] += `, ${key}` : key 
    });
    const resKeys = Object.keys(resObj)
    return resKeys.length === 1 ? [resKeys[0]] : resKeys.map(res => `${res} (${resObj[res]})`);
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
    getMeasurementsForCategory: function getMeasurementsForCategory(category) { 
      const keys = this.categories[category].measurements;
      const mForCategory = {}
      keys.forEach(key => {
        const measurement = this.allMeasurements[key]
        measurement.layers = [];
        mForCategory[key] = measurement;
      });
    
      Object.keys(this.allLayers).forEach(key => {
        const layer = this.allLayers[key];
        let { layergroup } = layer; 
        if (!layergroup) {
          layergroup = 'Other';
        }
        if (layergroup === 'Reference') {
          layergroup = 'Reference Map'
        }
        if (!mForCategory[layergroup]) {
          // TODO handle this
          // console.error(layergroup);
          return;
        }
        mForCategory[layergroup].layers.push(layer); 
      });
    
      return Object.keys(mForCategory).map(key => mForCategory[key]);
    },
  }
});

const requestSettings = {
  url: "../wv.json",
  type: "GET",
  crossDomain: true,
  dataType: "json",
  success: app.init
}

$(document).ready(() => { 
  $.ajax(requestSettings);
});