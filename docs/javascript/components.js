Vue.component('category-selector', {
  props: ['categories', 'selectCategory'],
  template: `
    <div class="category-selector">
      <h3 class="categories-header"> Categories: &nbsp; </h3>
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
          <th v-for="col in visibleColumns" :style="col.style">
            <span v-on:click="sortBy(col)" :class="{ sort: col.sortable }"> 
              <span v-html="col.title"></span>
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
              <component 
                :is="col.renderer" 
                :layer="layer" 
                :property="col.property"
                :getUrl="getUrl"
              >
              </component>
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
    const defaultRenderer = {
      props: ['layer', 'property', 'getUrl'],
      template: `<span> {{ layer[property] }} </span>`
    }
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
          visible: (() => layers.some(({ platform }) => platform ))(),
          renderer: defaultRenderer
        },
        {
          title: 'Instrument',
          property: 'instrument',
          sortable: true,
          sorted: false,
          visible: (() => layers.some(({ instrument }) => instrument ))(),
          renderer: defaultRenderer
        },
        {
          title: 'Name / Identifier',
          property: 'title',
          sortable: true,
          sorted: false,
          visible: true,
          renderer: {
            ...defaultRenderer,
            template: `
              <span> 
                {{ layer.title }} <br/> 
                <a v-bind:href="getUrl(layer.id)" target="_blank"> {{layer.id}} </a> 
              </span>`
          }
        },
        {
          title: 'Period',
          property: 'period',
          sortable: true,
          sorted: false,
          visible: (() => layers.some(({ period }) => period ))(),
          renderer: defaultRenderer
        },
        {
          title: `
            <span>
              Projections
              <sup> [<a href="#footnote-1">1</a>] </sup>
            </span>
          `,
          style: 'min-width: 125px;',
          property: 'projections',
          sortable: false,
          visible: (() => layers.some(({ projections }) => projections.length ))(),
          renderer: {
            ...defaultRenderer,
            template: `
              <ul>
                <li v-for="proj in layer.projections"> {{proj}} <br/> </li>
              </ul>`
          }
        },
        {
          title: `
            <span>
              Imagery <sup> [<a href="#footnote-2">2</a>] </sup>
              <br/> Resolution
            </span>
          `,
          style: 'min-width: 125px;',
          property: 'resolution',
          sortable: true,
          sorted: false,
          visible: (() => layers.some(({ resolution }) => resolution ))(),
          renderer: {
            ...defaultRenderer,
            template: `
              <div> 
                <span v-if="Object.keys(layer.resolution).length === 1">
                  {{Object.keys(layer.resolution)[0]}}
                </span>
                <span v-else v-for="(projections, resolution) in layer.resolution"> 
                  {{resolution}}
                  <ul>
                    <li v-for="proj in projections"> {{proj}} </li>
                  </ul>
                </span>
              </div>`
          }
        },
        {
          title: 'Format',
          property: 'format', 
          sortable: true,
          sorted: false,
          visible: (() => layers.some(({ format }) => format ))(),
          renderer: defaultRenderer
        },
        {
          title: 'Temporal Range',
          property: 'temporalRange',
          sortable: false,
          visible: (() => layers.some(({ startDate }) => startDate ))(),
          renderer: {
            ...defaultRenderer,
            template: `<span> {{ layer.startDate }} - {{ layer.endDate }} </span>`
          }
        },
        {
          title: 'Product',
          property: 'products',
          visible: (() => layers.some(({ products }) => products.length ))(),
          renderer: {
            ...defaultRenderer,
            template: `
              <div>
                <div v-for="prod in layer.products"> 
                  {{prod.type}}: &nbsp; <a :href="prod.url" target="_blank"  class="monospace"> {{ prod.shortName }} {{prod.version}} </a>
                </div>
              </div>
            `
          }
        },
      ],
    }
  },
  methods: {
    sortBy: function (col) {
      const { property, sortable } = col;
      if (!sortable) return;
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