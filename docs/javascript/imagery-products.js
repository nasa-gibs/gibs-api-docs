Vue.component('category-selector', {
  props: ['categories', 'selectCategory'],
  template: `
    <div class="category-selector">
      <select class="category-selector" v-on:change="selectCategory($event)">
        <option 
          v-for="category in categories" 
          :value="category.title" 
          :key="category.title">
            {{ category.title }}
        </option>
      </select>
    </div>
  `
})

Vue.component('layer-row', {
  props: ['layer'],
  template: `
    <tr>
      <td> {{ layer.platform }} </td>
      <td> {{ layer.instrument }} </td>
      <td> {{ layer.title }} <br/> <a v-bind:href="getUrl(layer.id)" target="_blank"> {{layer.id}} </a> </td>
      <td> {{ layer.period }} </td>
      <td> {{ layer.format }} </td>
      <td> {{ layer.startDate }} - {{layer.endDate}} </td>
      <td class="monospace"> {{ layer.product }}</td>
    </tr>`,
  methods: {
    getUrl: function (id) {
      return `https://worldview.earthdata.nasa.gov/?l=Reference_Labels_15m(hidden),Reference_Features_15m(hidden),Coastlines_15m,${id},MODIS_Terra_CorrectedReflectance_TrueColor&lg=true`
    } 
  }
})

Vue.component('source-container', {
  props: ['layers'],
  template: `
    <div class="source-container">
      <table class="layer-table docutils">
        <thead>
          <tr> <th v-for="title in columnTitles"> {{title}} </th> </tr>
        </thead>
        <tbody>
          <layer-row v-for="layer in layers" :layer="layer"></layer-row>
        </tbody>
      </table>
    </div>`,
  data: function () {
    return { 
      columnTitles: [ 'Platform', 'Instrument', 'Name / Identifier', 'Period', 'Format', 'Temporal Range', 'Product'] 
    }
  }
})

Vue.component('measurement-container', {
  props: ['measurement'],
  template: `
    <div class="measurement-container">
      <h3 v-on:click="toggleExpanded()"> {{expandSymbol}} {{ measurement.title }} </h3>
      <div v-if="isExpanded">
        <source-container :layers="measurement.layers"> </source-container>
      </div>
    </div>`,
  data: function () {
    return {
      isExpanded: false,
      expandSymbol: '+'
    }
  },
  methods: {
    toggleExpanded: function () {
      this.isExpanded = !this.isExpanded
      this.expandSymbol = this.isExpanded ? '-' : '+'
    }
  }
})


function getMeasurementsForCategory(category, allCategories, allLayers, allMeasurements) { 
  const keys = allCategories[category].measurements;
  const mForCategory = {}
  keys.forEach(key => {
    const measurement = allMeasurements[key]
    measurement.layers = [];
    mForCategory[key] = measurement;
  });

  Object.keys(allLayers).forEach(key => {
    const layer = allLayers[key];
    let { layergroup } = layer; 
    if (!layergroup) {
      layergroup = 'Other';
    }
    if (layergroup === 'Reference') {
      layergroup = 'Reference Map'
    }
    if (!mForCategory[layergroup]) {
      console.error(layergroup);
      return;
    }
    mForCategory[layergroup].layers.push(layer); 
  });

  return Object.keys(mForCategory).map(key => mForCategory[key]);
}

function getDate (layer, key) {
  if (!layer[key]) {
    return key === 'endDate' && layer['startDate'] ? 'Present' : '';
  }
  const { period, inactive } = layer;
  const date = period === 'subdaily' ? layer[key] : layer[key].split('T')[0];
  return (key === 'endDate' && !inactive) ? 'Present' : date;
}

function formatLayers (layers) {
  Object.keys(layers).map(id => {
    const layer = layers[id];
    const projections = Object.keys(layer.projections);
    const startDate = getDate(layer, 'startDate');
    const endDate = getDate(layer, 'endDate');
    const format = (layer.format || ' / ').split('/')[1];
    const product = (layer.conceptIds || []).map(({shortName}) => shortName).join(', ');
    const [ platform, instrument ] = (layer.subtitle || ' / ').split('/');
    
    layers[id] = {
      ...layer,
      projections,
      format,
      product,
      startDate,
      endDate,
      platform,
      instrument,
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
      this.measurements = getMeasurementsForCategory(category, this.categories, this.allLayers, this.allMeasurements);
      this.selectedCategory = category;
    },
  }
});

const requestSettings = {
  url: "https://worldview.sit.earthdata.nasa.gov/config/wv.json",
  type: "GET",
  crossDomain: true,
  dataType: "json",
  success: function (data) {
    app.loading = false;
    app.allMeasurements = data.measurements;
    app.allLayers = formatLayers(data.layers);
    app.categories = data.categories['science disciplines'];
    app.measurements = getMeasurementsForCategory(app.selectedCategory, app.categories, app.allLayers, app.allMeasurements)
  }
}

$(document).ready(() => { 
  $.ajax(requestSettings);
});