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

Vue.component('layer-table', {
  props: ['measurement'],
  template: `
    <table class="layer-table docutils">
      <thead>
        <tr> 
          <th v-for="col in visibleColumns">
            <span v-on:click="sortBy(col)" v-bind:class="{ sort: col.sortable }"> 
              {{col.title}} 
              <span v-if="col.sortable && col.sorted === 'ASC'"> &uarr; </span>
              <span v-else-if="col.sortable && col.sorted === 'DESC'"> &darr; </span>
              <span class="unsorted" v-else-if="col.sortable"> &varr; </span>
            </span> 
          </th> 
        </tr>
      </thead>
      <tbody>
        <tr v-for="layer in layers">
          <td v-for="col in visibleColumns">
            <span v-if="col.property === 'title'"> 
              {{ layer.title }} <br/> <a v-bind:href="getUrl(layer.id)" target="_blank"> {{layer.id}} </a>
            </span>
            <span v-else-if="col.property === 'projections'">
              <span v-for="proj in layer.projections"> {{ proj }} <br/> </span>
            </span>
            <span v-else-if="col.property === 'resolution'">
              <span v-for="res in layer.resolution"> {{ res }} <br/> </span>
            </span>
            <span v-else-if="col.property === 'temporalRange'">
              {{ layer.startDate }} - {{ layer.endDate }} 
            </span>
            <span v-else-if="col.property === 'product'" class="monospace">
              {{ layer.product }}
            </span>
            <span v-else>
              {{ layer[col.property] }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>`,
  computed: {
    visibleColumns: function () {
      return this.columns.filter(({visible}) => visible);
    }
  },
  data: function () {
    const { layers } = this.measurement;
    return {
      layers: [
        ...layers,
      ],
      columns: [
        {
          title: 'Platform',
          property: 'platform',
          sortable: true,
          sorted: 'ASC',
          visible: (() => layers.some(({ platform }) => platform ))()
        },
        {
          title: 'Instrument',
          property: 'instrument',
          sortable: true,
          sorted: false,
          visible: (() => layers.some(({ instrument }) => instrument ))()
        },
        {
          title: 'Name / Identifier',
          property: 'title',
          sortable: true,
          sorted: false,
          visible: true,
        },
        {
          title: 'Period',
          property: 'period',
          sortable: true,
          sorted: false,
          visible: (() => layers.some(({ period }) => period ))()
        },
        {
          title: 'Projections',
          property: 'projections',
          sortable: false,
          visible: (() => layers.some(({ projections }) => projections.length ))()
        },
        {
          title: 'Resolution',
          property: 'resolution',
          sortable: true,
          sorted: false,
          visible: (() => layers.some(({ resolution }) => resolution.length ))()
        },
        {
          title: 'Format',
          property: 'format', 
          sortable: true,
          sorted: false,
          visible: (() => layers.some(({ format }) => format ))()
        },
        {
          title: 'Temporal Range',
          property: 'temporalRange',
          sortable: false,
          visible: (() => layers.some(({ startDate }) => startDate ))()
        },
        {
          title: 'Product',
          property: 'product',
          sortable: true,
          sorted: false,
          visible: (() => layers.some(({ product }) => product ))()
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
    },
    getUrl: function (id) {
      return `https://worldview.earthdata.nasa.gov/?l=Reference_Labels_15m(hidden),Reference_Features_15m(hidden),Coastlines_15m,${id},MODIS_Terra_CorrectedReflectance_TrueColor&lg=true`
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