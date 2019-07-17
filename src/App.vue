<template>
  <div id="app">
      <div class="sticky-top border-bottom row pb-3" style="background-color: white">
          <h1 class="col-12">Example!</h1>
      </div>

      <div class="d-flex center-block">
          <div class="col-6 pb-5">
              <h2 class="">Simple Paginate</h2>
              <simple-paginate :mock="mock"></simple-paginate>
          </div>

          <div class="col-6 center-block">
              <h2 class="">Scroll Autoload</h2>
              <div class="border col-5">
                  <scroll :mock="mock"></scroll>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
    import SimplePaginate from './components/SimplePaginate'
    import Scroll from './components/Scroll'
    import MockAdapter from 'axios-mock-adapter'
    import axios from 'axios'

    export default {
        data() {
            return {
                mock: new MockAdapter(axios)
            }
        },

        components: {
            SimplePaginate,
            Scroll,
        }
    }

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
