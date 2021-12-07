<template>

  <div>
    <h4>Your position</h4>
    Latitude: {{coords.latitude}}, Longitude: {{coords.longitude}}
  </div>
  <div ref="mapDiv" style="width: 100%; height: 80vh"></div>
</template>

<script>
/* eslint-disable no-undef */
import {computed, defineAsyncComponent, defineComponent, onMounted, ref} from 'vue'
import { useGeolocation } from '@/utils/useGeolocation.ts'
import { Loader } from '@googlemaps/js-api-loader'

const GOOGLE_MAPS_API_KEY = 'AIzaSyB-t229L72fa1j477tUSSPpHuDBUdIJdFs'
export default defineComponent({
  name: 'App',
  setup(){

    const coords = ref({latitude: 0, longitude: 0})

    const currPos = ref({
      lat: coords.value.latitude,
      lng: coords.value.longitude
    })

    const loader = new Loader( {apiKey: GOOGLE_MAPS_API_KEY})
    const mapDiv = ref("<div/>")


    onMounted(async () => {

      let google = await loader.load()
      const isSupported = 'navigator' in window && 'geolocation' in navigator

      let watcher = null
      if(isSupported){
        watcher = navigator.geolocation.watchPosition(
            (position) => {
              coords.value = position.coords
              currPos.value.lat = coords.value.latitude
              currPos.value.lng = coords.value.longitude
              new google.maps.Map(mapDiv.value, {
                center: currPos.value,
                zoom: 7
              })
            }

        )
      }

    })
    return { coords, mapDiv }
  }
})
</script>

<style scoped>

</style>