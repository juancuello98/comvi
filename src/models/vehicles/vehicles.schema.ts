import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type VehicleDocument = Vehicle & Document;

/**
 * Tipo de vehículo
 */
export enum VehicleType {
  CAR = 'CAR',
  SUV = 'SUV',
  VAN = 'VAN',
  PICKUP = 'PICKUP',
  MOTORCYCLE = 'MOTORCYCLE',
}

/**
 * Representa un vehículo registrado en el sistema.
 */
@Schema({
  timestamps: true,
  collection: 'vehicles',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Vehicle {
  /**
   * Patente/Placa del vehículo (única).
   */
  @Prop({ 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true,
    index: true,
  })
  patentPlate: string;

  /**
   * Modelo del vehículo.
   */
  @Prop({ required: true, trim: true })
  model: string;

  /**
   * Marca del vehículo.
   */
  @Prop({ required: true, trim: true, index: true })
  brand: string;

  /**
   * Año de fabricación.
   */
  @Prop({ 
    required: true,
    type: Number,
    min: 1950,
    max: new Date().getFullYear() + 1,
  })
  year: number;

  /**
   * Color del vehículo.
   */
  @Prop({ trim: true })
  color?: string;

  /**
   * Tipo de vehículo.
   */
  @Prop({
    type: String,
    enum: Object.values(VehicleType),
    default: VehicleType.CAR,
    index: true,
  })
  vehicleType: VehicleType;

  /**
   * Capacidad de pasajeros (excluyendo conductor).
   */
  @Prop({
    type: Number,
    min: 1,
    max: 15,
    default: 4,
  })
  passengerCapacity: number;

  /**
   * URLs de fotos del vehículo.
   */
  @Prop({ type: [String], default: [] })
  pics: string[];

  /**
   * Email del propietario.
   */
  @Prop({ 
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;

  /**
   * Referencia al usuario propietario.
   */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  owner?: MongooseSchema.Types.ObjectId;

  /**
   * ¿Tiene aire acondicionado?
   */
  @Prop({ type: Boolean, default: false })
  hasAirConditioning: boolean;

  /**
   * ¿Acepta mascotas?
   */
  @Prop({ type: Boolean, default: false })
  allowsPets: boolean;

  /**
   * ¿Tiene espacio para equipaje grande?
   */
  @Prop({ type: Boolean, default: true })
  hasLuggage: boolean;

  /**
   * Número de viajes realizados con este vehículo.
   */
  @Prop({ type: Number, default: 0 })
  tripsCount: number;

  /**
   * Calificación promedio del vehículo.
   */
  @Prop({ 
    type: Number, 
    default: 0,
    min: 0,
    max: 5,
  })
  rating: number;

  /**
   * Estado del vehículo.
   */
  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

// ============================================
// INDEXES
// ============================================

// Índice compuesto para buscar vehículos de un usuario
VehicleSchema.index({ email: 1, isActive: 1 });

// Índice compuesto para filtrar por marca y tipo
VehicleSchema.index({ brand: 1, vehicleType: 1 });

// Índice de texto para búsqueda
VehicleSchema.index(
  { brand: 'text', model: 'text', color: 'text' },
  { name: 'vehicle_text_search' }
);

// ============================================
// VIRTUALS - Solo para transformación de datos
// ============================================

// Descripción completa del vehículo (útil para JSON)
VehicleSchema.virtual('fullDescription').get(function(this: VehicleDocument) {
  return `${this.brand} ${this.model} (${this.year}) - ${this.color || 'Color no especificado'}`;
});

// Antigüedad del vehículo (útil para JSON)
VehicleSchema.virtual('age').get(function(this: VehicleDocument) {
  return new Date().getFullYear() - this.year;
});

// ============================================
// HOOKS
// ============================================

// Pre-save: formatear patente
VehicleSchema.pre('save', function() {
  // Normalizar patente (quitar espacios y guiones)
  if (this.isModified('patentPlate')) {
    this.patentPlate = this.patentPlate.replace(/[\s-]/g, '').toUpperCase();
  }
});
