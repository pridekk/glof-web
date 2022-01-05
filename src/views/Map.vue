<template>

  <div>
    <h4>Your position</h4>
    Latitude: {{coords.latitude}}, Longitude: {{coords.longitude}}
  </div>
  <div ref="mapDiv" style="width: 100%; height: 80vh"></div>
</template>

<script lang="ts" setup>
/* eslint-disable no-undef */
import {computed, onMounted, onUnmounted, ref, watchEffect} from 'vue'
import { FirebaseApiKey } from '@/utils/securityConstants'
import { Loader } from '@googlemaps/js-api-loader'
import {CoordMapType, getLandOwnersWithBounds, TileOwner, project} from '@/utils/land'
import {useStore} from "vuex";

const store = useStore()
const user = computed(() => JSON.parse(JSON.stringify(store.state.user)))

const coords = ref({latitude: 0, longitude: 0})

const owners = ref<TileOwner[]>()

const currPos = ref({
  lat: coords.value.latitude,
  lng: coords.value.longitude
})

const loader = new Loader( {apiKey: FirebaseApiKey})
const mapDiv = ref("<div/>")

let watcher: number | null = null

let google: any = null
const map = ref<google.maps.Map| undefined>(undefined)
let zoom = 8

let ownerCalculated = false

watchEffect( async () => {
  if (owners.value !== undefined){
    console.log(`owners ${owners.value}`)
    let items = JSON.parse(JSON.stringify(owners.value))
    console.log('owners items')
    console.log(items)

    items.owners.forEach((item: any) => {
      let owner: TileOwner = new TileOwner(item.tile_x, item.tile_y, item.center_x, item.center_y, item.owner_id,)
      console.log(owner.getCenter())
      new google.maps.Marker({
        position: owner.getCenter(),
        map: map.value,
        title: owner.owner_id,
      });
    })
  }
  if(map.value !== undefined && user.value !== null && ownerCalculated === false){
    ownerCalculated = true
    await addEventListenersToMap(map.value)
    console.log("Map is initialized. Calculated owners")

    let bounds = map.value.getBounds()
    owners.value = await getLandOwnersWithBounds(user.value.stsTokenManager.accessToken, zoom, bounds)
  }
})


onMounted(async () => {

  google = await loader.load()
  const isSupported = 'navigator' in window && 'geolocation' in navigator
  console.log(`isSupported ${isSupported}`)

  if (isSupported) {
    watcher = navigator.geolocation.watchPosition(
        async (position) => {
          coords.value = position.coords
          currPos.value.lat = coords.value.latitude
          currPos.value.lng = coords.value.longitude
          map.value = new google.maps.Map(mapDiv.value, {
            center: currPos.value,
            zoom: zoom
          })
          // const coordInfoWindow = new google.maps.InfoWindow();
          //
          // coordInfoWindow.setContent(createInfoWindowContent( currPos.value, map.getZoom()));
          // coordInfoWindow.setPosition( currPos.value);
          // coordInfoWindow.open(map);
          // map.addListener("zoom_changed", () => {
          //   coordInfoWindow.setContent(createInfoWindowContent( currPos.value, map.getZoom()));
          //   coordInfoWindow.open(map);
          // });
          console.log('owners')
          console.log(owners.value)

          console.log(zoom << 5)
          if(map.value !== undefined){
            await map.value.overlayMapTypes.insertAt(
                0,
                new CoordMapType(new google.maps.Size(zoom << 5, zoom << 5))
            );
            let bounds = map.value.getBounds()
            // await getLandOwnersWithBounds(JSON.parse(user.value).stsTokenManager.accessToken, zoom, bounds)
            await addEventListenersToMap(map.value)
          }

        }
    )
  }



  const TILE_SIZE = 256;

  const createInfoWindowContent = (latLng: google.maps.LatLng, zoom: number) => {
    const scale = 1 << zoom;

    const worldCoordinate = project(latLng.lat(), latLng.lng());

    const pixelCoordinate = new google.maps.Point(
        Math.floor(worldCoordinate.x * scale),
        Math.floor(worldCoordinate.y * scale)
    );

    const tileCoordinate = new google.maps.Point(
        Math.floor((worldCoordinate.x * scale) / TILE_SIZE),
        Math.floor((worldCoordinate.y * scale) / TILE_SIZE)
    );

    return [
      "Chicago, IL",
      "LatLng: " + latLng,
      "Zoom level: " + zoom,
      "World Coordinate: " + worldCoordinate,
      "Pixel Coordinate: " + pixelCoordinate,
      "Tile Coordinate: " + tileCoordinate,
    ].join("<br>");
  }

  })

onUnmounted( () => {
  console.log("unmounted")
  if(watcher !== null){
    navigator.geolocation.clearWatch(watcher)
  }
})

const addEventListenersToMap = async (map: google.maps.Map) => {
  map.addListener("dragend", async () => {
    let bounds = map.getBounds()
    console.log(user.value)
    owners.value = await getLandOwnersWithBounds(user.value.stsTokenManager.accessToken, zoom, bounds)
  });

  map.addListener("zoom_changed", async () => {
    let bounds = map.getBounds()
    if(user.value !== null){
      owners.value = await getLandOwnersWithBounds(user.value.stsTokenManager.accessToken, zoom, bounds)
    }

  })

}
</script>

<style scoped>

</style>