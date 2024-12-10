import { FuelsStation } from "../schemas/FuelsStationSchemas";
import { Polygon, MultiPolygon } from 'geojson';
export interface IFuelsStationRepository {
    findAll(): Promise<FuelsStation[]>;
    create(createDto: FuelsStation): Promise<FuelsStation>;
    findById(id: string): Promise<FuelsStation>;
    update(id: string, updateDto: FuelsStation): Promise<FuelsStation>;
    delete(id: string): Promise<boolean>;
    addCompanies(companies: FuelsStation[]): Promise<FuelsStation[]>;
    findByGeometry(geometry: { type: string, coordinates: number[] }): Promise<FuelsStation[]>;
    findByBuffer(geometry: Polygon | MultiPolygon): Promise<FuelsStation[]>;
  }