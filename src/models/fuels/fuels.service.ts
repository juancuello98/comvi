import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import csv from 'csv-parser';
import axios from 'axios';
import { IFuelsStationRepository } from './interfaces/fuelsStation.repository.interface';
import { IProductHashRepository } from './interfaces/productHash.repository.interface';
import { IProductRepository } from './interfaces/product.repository.interface';
import { IPriceHistoryRepository } from './interfaces/priceHistory.repository.interface';
import { IFUELSSTATION_REPOSITORY } from './repository/constants/fuelsStation.repository.constant';
import { IPRODUCT_REPOSITORY } from './repository/constants/product.repository.constant';
import { IPRICEHISTORY_REPOSITORY } from './repository/constants/priceHistory.repository.constant';
import { FuelsStation } from './schemas/FuelsStationSchemas';
import { Product } from './schemas/ProductSchemas';
import { PriceHistory } from './schemas/PriceHistorySchemas';
import { Polygon, MultiPolygon } from 'geojson';

dotenv.config();

@Injectable()
export class FuelService {
  constructor(
    @Inject(IFUELSSTATION_REPOSITORY) private readonly FuelsStationRepository: IFuelsStationRepository,
    @Inject(IPRODUCT_REPOSITORY) private readonly productRepository: IProductRepository,
    @Inject(IPRICEHISTORY_REPOSITORY) private readonly priceHistoryRepository: IPriceHistoryRepository,

  ) {}

  async downloadAndSaveCSV() {
    const url = process.env.URLFuelStations;
    const response = await axios.get(url, { responseType: 'stream' });
  
    let empresas: Map<string, FuelsStation> = new Map();
    let productos: Map<string, Product> = new Map();
    let precios: Map<string, PriceHistory> = new Map();
  
    response.data
  .pipe(csv())
  .on('data', (row: any) => {
    try {
      const {
        idempresa,
        cuit,
        empresa,
        direccion,
        localidad,
        provincia,
        region,
        idproducto,
        producto,
        idtipohorario,
        tipohorario,
        precio,
        fecha_vigencia,
        idempresabandera,
        empresabandera,
        latitud,
        longitud,
      } = row;

      if (!idempresa || !latitud || !longitud) {
        console.warn(`Datos faltantes en la fila: ${JSON.stringify(row)}`);
        return;
      }

      // Procesar estación
      let station = empresas.get(idempresa);
      if (!station) {
        station = new FuelsStation();
        station.stationId = idempresa;
        station.cuit = cuit;
        station.empresa = empresa;
        station.direccion = direccion;
        station.localidad = localidad;
        station.provincia = provincia;
        station.region = region;
        station.idempresabandera = idempresabandera;
        station.empresabandera = empresabandera;
        station.latitud = parseFloat(latitud);
        station.longitud = parseFloat(longitud);
        station.geojson = {
          type: 'Point',
          coordinates: [parseFloat(longitud), parseFloat(latitud)],
        };
        station.productos = [];
        empresas.set(idempresa, station);
      }

      // Procesar productos
      if (!station.productos.includes(idproducto)) {
        station.productos.push(idproducto);
        productos.set(idproducto, { idproducto, producto });
      }

      // Procesar precios
      const priceKey = `${idproducto}_${fecha_vigencia}`;
      let price = precios.get(priceKey);
      if (!price) {
        price = new PriceHistory();
        price.productoId = idproducto;
        price.fecha_vigencia = fecha_vigencia;
        price.precios = [];
        price.precio_promedioDía = 0;
        price.precio_promedioNoche = 0;
        price.precio_promedio = 0;
        precios.set(priceKey, price);
      }
      price.precios.push({
        empresaId: idempresa,
        idtipohorario,
        tipohorario,
        precio: parseFloat(precio),
      });
    } catch (error) {
      console.error(`Error procesando fila: ${JSON.stringify(row)}`, error);
    }
  })
  .on('end', async () => {
    try {
      precios = this.calcularPromedios(precios);
      await this.FuelsStationRepository.addCompanies(Array.from(empresas.values()));
      await this.productRepository.addProducts(Array.from(productos.values()));

      // Insertar todos los precios históricos por fecha y producto
      for (const price of precios.values()) {
        await this.priceHistoryRepository.addPriceHistories([price]);
      }

      console.log('Datos insertados en MongoDB correctamente.');
    } catch (error) {
      console.error('Error insertando datos en MongoDB:', error);
    }
  })
  .on('error', (error) => {
    console.error('Error leyendo el archivo CSV:', error);
  });

  }

  async findByBuffer(geometry:Polygon|MultiPolygon) : Promise<FuelsStation[]> {
    // Implement the logic to find fuel stations by buffer
    const stations = await this.FuelsStationRepository.findByBuffer(geometry);
    return stations;
  }
  
  
  calcularPromedios( precios: Map<string, PriceHistory>): Map<string, PriceHistory> {
        let countDiu =0;
        let countNoc =0;
        precios.forEach(producto => {
          producto.precio_promedioDía = 0;
          producto.precio_promedioNoche = 0;
          producto.precio_promedio = 0;
          producto.precios.forEach(precio => {
            if (precio.tipohorario === 'Diurno') {
              producto.precio_promedioDía += precio.precio;
              countDiu++;
            } else {
              producto.precio_promedioNoche += precio.precio;
              countNoc++;
            }
          });

          if (countDiu === 0) {
            countDiu = 1;
          } 
          if (countNoc === 0) {
            countNoc = 1;
          }

          producto.precio_promedioDía /= countDiu;
          producto.precio_promedioNoche /= countNoc;
          producto.precio_promedio = (producto.precio_promedioDía + producto.precio_promedioNoche) / 2;
        });
        return precios;
      }

  async calcularCosto(distance:number, consumption:number , fuels: string[]): Promise<{ fuelType: string, cost: number }[]> {
        const prices: { fuelType: string, cost: number}[] = []; 
        for (let i = 0; i < fuels.length; i++) {
          const fuelId = fuels[i];
          const productPrice = await this.priceHistoryRepository.findByProductId(fuelId);
          const totalCost = (distance / 100) * consumption * productPrice.precio_promedio;
          prices.push({ fuelType: fuelId, cost: totalCost });
        }
        return prices;
  }

  async getFuelsPrices(): Promise< PriceHistory[]> {
    const fuels = await this.priceHistoryRepository.findAll();
    return fuels; }

  async getStationsPrices(): Promise< FuelsStation[]> {
      const fuelsStation = await this.FuelsStationRepository.findAll();
      return fuelsStation; }
}