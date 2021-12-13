const store = {
  loading: true,
  allMeasurements: undefined,
  allLayers: undefined,
  measurements: undefined,
  categories: undefined, 
  selectedCategory: 'All',
}

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
      <td> <span v-for="proj in layer.projections"> {{ proj }} <br/> </span> </td>
      <td> <span v-for="res in layer.resolution"> {{ res }} <br/> </span> </td>
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

Vue.component('layer-table', {
  props: ['measurement'],
  template: `
    <table class="layer-table docutils">
      <thead>
        <tr> 
          <th v-for="col in columns" v-on:click="sortBy(col)"> 
            {{col.title}} 
            <span class="sort" v-if="col.sortable && col.sorted === 'ASC'"> &uarr; </span>
            <span class="sort" v-else-if="col.sortable && col.sorted === 'DESC'"> &darr; </span>
            <span class="sort unsorted" v-else-if="col.sortable"> &varr; </span>
          </th> 
        </tr>
      </thead>
      <tbody>
        <layer-row v-for="layer in layers" :layer="layer"></layer-row>
      </tbody>
    </table>`,
  data: function () {
    return {
      layers: [
        ...this.measurement.layers,
      ],
      columns: [
        {
          title: 'Platform',
          property: 'platform',
          sortable: true,
          sorted: 'ASC',
        },
        {
          title: 'Instrument',
          property: 'instrument',
          sortable: true,
          sorted: false,
        },
        {
          title: 'Name / Identifier',
          property: 'title',
          sortable: true,
          sorted: false,
        },
        {
          title: 'Period',
          property: 'period',
          sortable: true,
          sorted: false,
        },
        {
          title: 'Projections',
          property: 'projections',
          sortable: false,
        },
        {
          title: 'Resolution',
          property: 'resolution',
          sortable: true,
          sorted: false,
        },
        {
          title: 'Format',
          property: 'format', 
          sortable: true,
          sorted: false,
        },
        {
          title: 'Temporal Range',
          sortable: false,
        },
        {
          title: 'Product',
          property: 'product',
          sortable: true,
          sorted: false,
        },
      ],
    }
  },
  methods: {
    sortBy: function (col) {
      const { property } = col;
      const getVal = (obj) => obj[property] ? obj[property] : ' ';
      if (col.sorted === 'ASC') {
        this.layers = this.layers.sort((a, b) => getVal(a) < getVal(b) ? -1 : getVal(a) > getVal(b) ? 1 : 0);
        col.sorted = 'DESC'
      } else {
        this.layers = this.layers.sort((a, b) => getVal(a) < getVal(b) ? 1 : getVal(a) > getVal(b) ? -1 : 0);
        col.sorted = 'ASC'
      }
      this.columns.forEach(column => {
        if (column.property !== col.property) {
          column.sorted = false;
        }
      });
    }
  },
  mounted: function () {
    // TODO check initial sort
    this.sortBy(this.columns.find(({sorted}) => sorted));
  }
})

Vue.component('measurement-container', {
  props: ['measurement'],
  template: `
    <div class="measurement-container">
      <h3 v-on:click="toggleExpanded()"> {{expandSymbol}} {{ measurement.title }} </h3>
      <div v-if="isExpanded">
        <layer-table :measurement="measurement"> </layer-table>
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
  data: store,
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
  url: "https://worldview.sit.earthdata.nasa.gov/config/wv.json",
  type: "GET",
  crossDomain: true,
  dataType: "json",
  success: app.init
}

$(document).ready(() => { 
  $.ajax(requestSettings);
});