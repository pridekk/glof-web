<template>

  <div>
    <h4>Your position</h4>
    Latitude: {{coords.latitude}}, Longitude: {{coords.longitude}}
  </div>
  <div ref="mapDiv" style="width: 100%; height: 80vh"></div>
</template>

<script lang="ts" setup>
/* eslint-disable no-undef */
import {computed, onMounted, onUnmounted, ref} from 'vue'
import { FirebaseApiKey } from '@/utils/securityConstants'
import { Loader } from '@googlemaps/js-api-loader'
import { getLandOwnersWithBounds } from '@/utils/land'
import {useStore} from "vuex";

const store = useStore()
const user = computed(() => store.state.user)

const coords = ref({latitude: 0, longitude: 0})

const currPos = ref({
  lat: coords.value.latitude,
  lng: coords.value.longitude
})

const loader = new Loader( {apiKey: FirebaseApiKey})
const mapDiv = ref("<div/>")

let watcher = null

class CoordMapType {
  tileSize: google.maps.Size;

  constructor(tileSize: google.maps.Size) {
    this.tileSize = tileSize;
  }
  getTile(
      coord: google.maps.Point,
      zoom: number,
      ownerDocument: Document
  ): HTMLElement {
    const div = ownerDocument.createElement("div");
    console.log(zoom)
    div.innerHTML = String(coord);
    div.style.width = this.tileSize.width + "px";
    div.style.height = this.tileSize.height + "px";
    div.style.fontSize = "10";
    div.style.borderStyle = "solid";
    div.style.borderWidth = "1px";
    div.style.borderColor = "#AAAAAA";
    if(coord.x === 109 && coord.y === 49){
      div.style.backgroundColor = "#000113"
    }
    return div;
  }
  releaseTile(tile: Element): void {
    console.log(`released: ${tile}`)
  }
}
onMounted(async () => {

  let google = await loader.load()
  const isSupported = 'navigator' in window && 'geolocation' in navigator

  let zoom = 8
  if(isSupported){
    watcher = navigator.geolocation.watchPosition(
        async (position) => {
          coords.value = position.coords
          currPos.value.lat = coords.value.latitude
          currPos.value.lng = coords.value.longitude
          let map = new google.maps.Map(mapDiv.value, {
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


          console.log(zoom<<5)
          await map.overlayMapTypes.insertAt(
              0,
              new CoordMapType(new google.maps.Size(zoom << 5, zoom << 5))
          );
          let bounds = map.getBounds()
          // await getLandOwnersWithBounds(JSON.parse(user.value).stsTokenManager.accessToken, zoom, bounds)
          await addEventListenersToMap(map)

        }

    )
  }

  const addEventListenersToMap = async (map: google.maps.Map) => {
    map.addListener("dragend", () => {
      let bounds = map.getBounds()
      console.log(user.value)
      getLandOwnersWithBounds(user.value.accessToken,zoom, bounds)
    });

    map.addListener("zoom_changed", () => {
      let bounds = map.getBounds()
      getLandOwnersWithBounds(JSON.parse(user.value).stsTokenManager.accessToken,zoom, bounds)
    })

  }

  const TILE_SIZE = 256;

  const createInfoWindowContent = (latLng: google.maps.LatLng, zoom: number)  =>{
    const scale = 1 << zoom;

    const worldCoordinate = project(latLng);

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

// The mapping between latitude, longitude and pixels is defined by the web
// mercator projection.
  const project = (latLng) => {
    console.log(latLng)
    let siny = Math.sin((latLng.lat* Math.PI) / 180);

    // Truncating to 0.9999 effectively limits latitude to 89.189. This is
    // about a third of a tile past the edge of the world tile.
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);

    return new google.maps.Point(
        TILE_SIZE * (0.5 + latLng.lng / 360),
        TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
    );
  }

})
onUnmounted( () => {
  console.log("unmounted")
  if(watcher !== null)
    navigator.geolocation.clearWatch(watcher)
})

</script>

<style scoped>

</style>