import axios from 'axios'
import {API_URL} from '@/utils/apiConfig'
import LatLngBounds = google.maps.LatLngBounds;
import LatLng = google.maps.LatLng;
const GET_TILE_OWNERS_URL = `${API_URL}/lands/owners`

export const getLandOwnersWithBounds = async (token: string, zoom: number, bounds: LatLngBounds | undefined) => {
  if(bounds){
    console.log(bounds.toJSON())

    console.log(bounds.getNorthEast().toJSON())
    console.log(bounds.getSouthWest().toJSON())

    getTileOwners(token, bounds.getNorthEast(),bounds.getSouthWest() )
  }
}

const ZOOM = 18;
const SCALE = 1 << ZOOM;

// eslint-disable-next-line max-len
const getTileOwners = async (token: string, northEast: LatLng, southWest: LatLng) => {
  const southEastPoint = project(southWest.lat(), northEast.lng());
  const northWestPoint = project(northEast.lat(), southWest.lng());


  const southEastTile = calculateTile(southEastPoint);
  const northWestTile = calculateTile(northWestPoint);

  console.log(southEastTile);
  console.log(northWestTile);

  try {
    const response = await axios.get(GET_TILE_OWNERS_URL+`?north=${northWestTile.y}&south=${southEastTile.y}&west=${northWestTile.x}&east=${southEastTile.x}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if(response.status === 200 )
      console.log(response.data)
    return response.data
  } catch (e){
    console.log(e)
  }



};

const calculateTile = (point: PointType) => {
  const tileCoordinate = new PointType(
    Math.floor((point.x * SCALE) / TILE_SIZE),
    Math.floor((point.y * SCALE) / TILE_SIZE)
  );
  return tileCoordinate;
};

// const getTiles = (x: number, y: number) => console.log(x, y);
const TILE_SIZE = 256;

const project = (lat: number, lng: number) => {
  let siny = Math.sin((lat * Math.PI) / 180);

  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
  // about a third of a tile past the edge of the world tile.
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);

  // eslint-disable-next-line max-len
  return new PointType(TILE_SIZE * (0.5 + lng / 360), TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
};


// eslint-disable-next-line require-jsdoc
class PointType {
  x: number;
  y: number ;
  // eslint-disable-next-line require-jsdoc
  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }
}