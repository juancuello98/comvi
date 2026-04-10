import { Inject, Injectable } from '@nestjs/common';
import * as turf from '@turf/turf'; // Si estás usando Node.js o herramientas similares
import { googleMapsClient } from '@google/maps'; // SDK de Google Maps
import { FuelService } from 'src/models/fuels/fuels.service';
import { ProductIdNumber } from '../models/fuels/enums/fuel-type.enum'; // Adjust the import path as necessary
import { createClient } from '@google/maps';
import { FuelsStation } from 'src/models/fuels/schemas/FuelsStationSchemas';
import { DirectionsResponse } from './interface/directions-response.interface'; // Ajusta la ruta según sea necesario
import { TripRouteRepository } from './repository/tripRoute.repository';
import { ITRIP_ROUTE_REPOSITORY } from './repository/constants/tripRoute.repository.constant';
import { TripRoute } from './tripRoute.schema'; // Adjust the import path as necessary


@Injectable()
export class TravellingService {
  private readonly googleMapsClient;
  constructor(
    private readonly fuelsService: FuelService,
    @Inject(ITRIP_ROUTE_REPOSITORY) 
    private readonly tripRouteRepository: TripRouteRepository
      ) {
        this.googleMapsClient = createClient({
          key: process.env.GOOGLE_MAPS_API_KEY,
          Promise: Promise
        });
      }


async calcularRutaConEstaciones(
  origen: { lat: number; lng: number },
  destino: { lat: number; lng: number },
  consumo: number,
  combustibles: ProductIdNumber[],
  radioBuffer: number // Radio del buffer en kilómetros
) : Promise<rutaConEstaciones> {
  // 1. Obtener la ruta desde Google Maps
const ruta: DirectionsResponse = await this.googleMapsClient.directions({
    origin: `${origen.lat},${origen.lng}`,
    destination: `${destino.lat},${destino.lng}`,
    mode: 'driving',
  }).asPromise();

  const decodedPath = googleMapsClient.util.decodePath(ruta.routes[0].overview_polyline);
  const coordenadasRuta = decodedPath.map(coord => ({
    lat: coord.lat(),
    lng: coord.lng(),
  }));

  const distancia = ruta.routes[0].legs[0].distance.value;

  // 2. Crear un buffer en torno a la ruta
  const geojsonRuta = turf.lineString(coordenadasRuta.map(coord => [coord.lng, coord.lat]));
  const buffer = turf.buffer(geojsonRuta, radioBuffer, { units: 'kilometers' });

  // 3. Consultar estaciones dentro del buffer
  const estaciones = await this.fuelsService.findByBuffer(buffer.geometry);

  const estacionesId = estaciones.map(estacion => estacion.stationId);

  const tripRoute = new TripRoute();
  tripRoute.route = ruta;
  tripRoute.fuelStation = estacionesId;
  tripRoute.distance = distancia; 



  const newTripRoute = await this.tripRouteRepository.create(tripRoute)

  // 4. Calcular el costo de combustible para cada estación

  let precio_combustible: Map<number, number>= new Map();
    estaciones.map(async estacion => {
      const precios = combustibles.map(async fuel => {
          const precioHistorial = estacion.precios[fuel];
          if (precio_combustible.has(fuel)){
            precio_combustible.set(fuel, precioHistorial.promedio + precio_combustible.get(fuel));}
        else{
            precio_combustible.set(fuel, precioHistorial.promedio);
        }
          
        })}
      );


  // 5. Formatear datos para Google Maps
  const rutaConEstaciones = {
    ruta: newTripRoute,
    precio_combustible: precio_combustible,
    estaciones: estaciones,
    distancia: distancia,
  };

  return rutaConEstaciones;
}

}

export interface rutaConEstaciones {
  ruta: TripRoute;
  precio_combustible: Map<number, number>;
  estaciones: FuelsStation[];
  distancia: number;
}

