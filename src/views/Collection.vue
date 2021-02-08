<template>
  <div class="collection-page">
    <div id="collection-filter">
      <div class="country-selector">
        <label><input name="coutries" type="radio" v-model="selectedCountry" value="All" selected/> Alle Länder</label>
        <label v-for="country in countrySelection" :key="country">
          <input name="coutries" type="radio" v-model="selectedCountry" :value="country.toLowerCase()"/> {{ country }}
        </label>
      </div>
      <label><input name="status" type="radio" v-model="selectedStatus" value="All" selected/> All</label>
      <label><input name="status" type="radio" v-model="selectedStatus" value="instock" /> An Lager</label>
      <label><input name="status" type="radio" v-model="selectedStatus" value="outofstock" /> Nicht an Lager</label>
      <label><input name="status" type="radio" v-model="selectedStatus" value="never" /> Wunschliste</label>
      <input type="search" v-model="searchTerm">
    </div>
    <p style="text-align: center">{{filteredGins.length}} von {{ginData.length}} angezeigt</p>
      <div class="collection-wrapper" v-if="filteredGins.length > 0">
        <GinSingle v-for="gin in filteredGins" :key="gin.key" :ginData="gin"></GinSingle>
      </div>
      <div class="no-gins-found" v-else>No gins to display</div>
  </div>
</template>

<script>
import sanity from '@/sanity.js';
import GinSingle from '@/components/GinSingle.vue';

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
    GinSingle
  },
  data() {
    return {
      ginData: [],
      selectedStatus: 'All',
      searchTerm: '',
      selectedCountry: 'All'
    }
  },
  computed: {
		filteredGins: function() {
			const status = this.selectedStatus;
			
      let filteredGinList = this.ginData;

			if(status === 'All') {
				// do nothing
			} else {
				filteredGinList = filteredGinList.filter(function(gin) {
					return gin.status === status;
				});
			}

      let search = this.searchTerm;
      if ( search !== '') {
        // console.log(this.searchTerm);
        filteredGinList = filteredGinList.filter(function(gin) {
					return gin.title.toLowerCase().indexOf(search.toLowerCase()) > -1;
				});
      }

      let country = this.selectedCountry;
      if ( country !== 'All' ) {
        filteredGinList = filteredGinList.filter(function(gin) {
					return gin.country.toLowerCase() === country;
				});
        console.log(country);
      } else {
        console.log(country);
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
      
      console.log(countryList);
      return countryList;
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      sanity.fetch(query).then( json => {
        this.ginData = json;
        console.log(this.ginData);
      });
    }
  }
}
</script>
<style scoped>
  #collection-filter {
    grid-column: 1 / -1;
    text-align: center;
    margin: 25px 0 50px 0;
  }
  #collection-filter label {
    margin: 0 15px;
  }
  .collection-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  .no-gins-found {
    text-align: center;
  }
  @media screen and (max-width: 980px) {
    .collection-wrapper {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media screen and (max-width: 768px) {
    .collection-wrapper {
      grid-template-columns: 1fr;
    }
  }
</style>