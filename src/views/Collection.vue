<template>
  <transition>
    <div class="collection-page" v-if="ginData.length > 0">
      <div id="collection-filter">
        <div class="country-selector" v-dragscroll>
          <label>
            <input name="coutries" type="radio" v-model="selectedCountry" value="All" selected/>
            <span>Alle Länder</span>
          </label>
          <label v-for="country in countrySelection" :key="country">
            <input  name="coutries" type="radio" v-model="selectedCountry" :value="country.toLowerCase()"/>
            <span>{{ country }}</span>
          </label>
        </div>
        <div class="status-selector">
          <label>
            <input name="status" type="radio" v-model="selectedStatus" value="All" selected/>
            <span>Alle anzeigen</span>
          </label>
          <label>
            <input name="status" type="radio" v-model="selectedStatus" value="instock" />
            <span>An Lager</span>
          </label>
          <label>
            <input name="status" type="radio" v-model="selectedStatus" value="outofstock" />
            <span>Nicht an Lager</span>
          </label>
          <label>
            <input name="status" type="radio" v-model="selectedStatus" value="never" />
            <span>Wunschliste</span>
          </label>
        </div>
        <input type="search" v-model="searchTerm">
        <div class="gin-counter">
            <p style="text-align: center">{{filteredGins.length}} von {{ginData.length}} angezeigt</p>
            <div class="progress-line"></div>
            <div class="progress-indicator" :style="{width: ginCounterWidth + 'px'}"></div>
        </div>
      </div>
        <div class="collection-wrapper" v-if="filteredGins.length > 0">
          <GinSingle v-for="gin in filteredGins" :key="gin.key" :ginData="gin"></GinSingle>
        </div>
        <div class="no-gins-found" v-else>No gins to display</div>
    </div>
    <div id="gin-loader" v-else>
        <loader />
    </div>
  </transition>
</template>

<script>
import sanity from '@/sanity.js';
import Loader from '@/components/Loader.vue';
import GinSingle from '@/components/GinSingle.vue';
import { dragscroll } from 'vue-dragscroll';

const query = `*[_type == "gin"]{
  'title': name,
  'key': _id,
  'link': link,
  'slug': slug.current,
  'country': country,
  'size': size,
  'percentage': percentage,
  'status': status,
  'usage': usage,
  'degu': degustationNotice,
  'details': description,
  'image': image.asset->url
} | order(country, status)`;

export default {
  name: 'Collection',
  components: {
    GinSingle,
    Loader
  },
  directives: {
    'dragscroll': dragscroll
  },
  data() {
    return {
      ginData: [],
      selectedStatus: 'All',
      searchTerm: '',
      selectedCountry: 'All',
      ginCounterWidth: ''
    }
  },
  computed: {
		filteredGins: function() {
			const status = this.selectedStatus;
			
      let filteredGinList = this.ginData;

			if(status !== 'All') {
				filteredGinList = filteredGinList.filter(function(gin) {
					return gin.status === status;
				});
			}

      let search = this.searchTerm;
      if ( search !== '') {
        filteredGinList = filteredGinList.filter(function(gin) {
					return gin.title.toLowerCase().indexOf(search.toLowerCase()) > -1;
				});
      }

      let country = this.selectedCountry;
      if ( country !== 'All' ) {
        filteredGinList = filteredGinList.filter(function(gin) {
					return gin.country.toLowerCase() === country;
				});
      }

      return filteredGinList;
		},
    countrySelection: function() {
      let countryList = [];

      this.ginData.map( gin => {
        if ( !countryList.includes(gin.country) ) {
          countryList.push(gin.country);
        }
      });
      
      // console.log(countryList);
      return countryList;
    }
  },
  watch: {
    filteredGins: function(value) {
      const ginCount = value.length;
      const ginTotal = this.ginData.length;

      const ginPercentage = ginCount / ginTotal;
      // const progressLineWidth = document.querySelector('.progress-line').offsetWidth;
      const progressLineWidth = window.innerWidth - 50;
      this.ginCounterWidth = ginPercentage * progressLineWidth;
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      sanity.fetch(query).then( json => {
        this.ginData = json;
        // console.log(this.ginData);
      });
    },
    // logGinCounterBarWidth() {
    //   console.log(this.ginCounterBarWidth);
    // }
  }
}
</script>
<style scoped>
  #collection-filter {
    text-align: center;
    margin: 0 0 50px 0;
    display: grid;
    grid-template-columns: repeat(3, auto);
  }

  /* Country Selector */
  .country-selector {
      display: flex;
      overflow-x: auto;
      padding: 25px 0 25px 25px;
      grid-column: -1 / 1;
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
      cursor : -webkit-grab;
      cursor : -moz-grab;
      cursor : -o-grab;
      cursor : grab;
  }
  /* Hide scrollbar for Chrome, Safari and Opera */
  .country-selector::-webkit-scrollbar {
    display: none;
  }
  .country-selector:active {
    cursor : -webkit-grabbing;
    cursor : -moz-grabbing;
    cursor : -o-grabbing;
    cursor : grabbing;
  }
  .country-selector::after {
      content: "";
      position: fixed;
      top: 0;
      right: 0;
      width: 50px;
      height: 56px;
      background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 80%);
      z-index: 1;
  }

.country-selector::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 50px;
    height: 56px;
    background: linear-gradient(90deg, rgba(255,255,255,1) 20%, rgba(255,255,255,0) 100%);
    z-index: 1;
}
    .country-selector label {
        display: flex;
        cursor: inherit;
    }
    .country-selector > label:last-child {
        padding-right: 25px;
    }
    .country-selector label span {
        padding: 0 25px;
        min-width: max-content;
    }
    .country-selector label input {
        opacity: 0;
        width: 0;
        margin: 0;
    }
    .country-selector label input[type="radio"]:checked+span {
        font-weight: 800;
    }
    /* Gin Counter */
    .gin-counter {
      grid-column: -1 / 1;
      position: relative;
      margin: 25px 0
    }
    .gin-counter p {
        display: inline-block;
        padding: 5px 10px;
        background: #fff;
    }
    .progress-indicator, .progress-line {
        height: 1px;
        position: absolute;
        top: 50%;
        left: 0;
        z-index: -1;
        margin: 0 25px;
    }
    .progress-line {
        width: calc(100% - 50px);
        background: #cecece;
    }
    .progress-indicator {
      background: #000;
      transition: width .8s cubic-bezier(0.76, 0, 0.24, 1);
    }
    /* Restliches */
    .collection-wrapper {
        display: grid;
        grid-template-columns: 1fr;
    }
    .no-gins-found {
        text-align: center;
    }
    /* @media screen and (max-width: 980px) {
    .collection-wrapper {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media screen and (max-width: 768px) {
    .collection-wrapper {
      grid-template-columns: 1fr;
    }
  } */
  .fade-enter-active,
  .fade-leave-active {
      transition: opacity 5s;
  }
  .fade-enter,
  .fade-leave-to {
      opacity: 0;
  }
</style>