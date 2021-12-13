# Available Imagery Products

<div id="page-container" class="rst-content">

  <div class="section">
    <div v-if="loading" class="loader"></div>
    <div v-else>
      <category-selector
        v-bind:categories="categories"
        v-bind:selected-category="selectedCategory"
        v-bind:select-category="selectCategory">
      </category-selector>
      <p id="imagery-products">
        <measurement-container 
          v-for="measurement in measurements" 
          :key="measurement.title" 
          :measurement="measurement">
        </measurement-container> 
      </p>
    </div>
  </div>
</div>
