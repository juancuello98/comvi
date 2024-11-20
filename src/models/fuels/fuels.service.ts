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

    response.data .pipe(csv())
        .on('data', (row: any) => {
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
            geojson,
          } = row;
          let productoEncontrado;
          if (!empresas.get(idempresa)) {
            const com = new FuelsStation();
            com.stationId = idempresa;
            com.cuit = cuit;
            com.empresa = empresa;
            com.direccion = direccion;
            com.localidad = localidad;
            com.provincia = provincia;
            com.region = region;
            com.idempresabandera = idempresabandera;
            com.empresabandera = empresabandera;
            com.latitud = latitud;
            com.longitud = longitud;
            com.geojson = geojson;
            com.productos = [];
            empresas.set(idempresa, com) 
          }
          productoEncontrado = false;
          productoEncontrado = empresas.get(idempresa)?.productos.find(x=> x === idproducto);
          if (!productoEncontrado) {
          const newProduct = new Product();
          newProduct.idproducto = idproducto;
          newProduct.producto = producto;
          empresas.get(idempresa).productos.push(idproducto);
          productos.set(idproducto, newProduct);}

          if (!precios.get(idproducto)) {
          const newPrice = new PriceHistory();
          newPrice.productoId = idproducto;
          newPrice.fecha_vigencia = fecha_vigencia;
          newPrice.precios = [];
          precios.set(idproducto, newPrice);
          }
          let ex = precios.get(idproducto)
          if(!ex){
            console.log('No se encontro el producto');
          }
          precios.get(idproducto).precios.push(
            {
              empresaId: idempresa,                
              idtipohorario,
              tipohorario,
              precio: parseFloat(precio),
          });

        })
        .on('end', async () => { 
          
          precios = this.calcularPromedios(precios);
          await this.FuelsStationRepository.addCompanies(Array.from(empresas.values()));
          await this.productRepository.addProducts(Array.from(productos.values()));
          await this.priceHistoryRepository.addPriceHistories(Array.from(precios.values()));

          console.log('Datos insertados en MongoDB correctamente.');
        })
        .on('error', (error) => {
          console.error(error);
        });
    };
  
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