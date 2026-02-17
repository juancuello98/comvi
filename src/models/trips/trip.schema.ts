import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TripStatus } from './enums/state.enum';

export type TripDocument = Trip & Document;

/**
 * Subdocumento embebido para ubicación (patrón NoSQL).
 * Embebemos la ubicación para evitar joins costosos y mejorar lectura.
 */
@Schema({ _id: false })
export class EmbeddedLocation {
  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  province: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  locality: string;

  @Prop({ required: true })
  formatAddress: string;

  /**
   * Coordenadas GeoJSON para consultas geoespaciales.
   * Formato: [longitude, latitude] (¡MongoDB usa este orden!)
   */
  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  })
  location: {
    type: string;
    coordinates: [number, number];
  };

  @Prop()
  placeId?: string;
}

const EmbeddedLocationSchema = SchemaFactory.createForClass(EmbeddedLocation);

/**
 * Representa un viaje en la base de datos.
 * Optimizado para MongoDB con índices geoespaciales y de texto.
 */
@Schema({
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
  collection: 'trips',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Trip {
  /**
   * UUID público del viaje (para compartir URLs).
   */
  @Prop({ 
    required: true,
    unique: true,
    index: true,
  })
  id: string;

  /**
   * Ubicación de origen embebida.
   * Patrón NoSQL: embeber datos de lectura frecuente.
   */
  @Prop({ type: EmbeddedLocationSchema, required: true })
  origin: EmbeddedLocation;

  /**
   * Ubicación de destino embebida.
   */
  @Prop({ type: EmbeddedLocationSchema, required: true })
  destination: EmbeddedLocation;

  /**
   * Referencia al documento Location original (para actualizaciones).
   */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Location' })
  originRef?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Location' })
  destinationRef?: MongooseSchema.Types.ObjectId;

  /**
   * Descripción del viaje.
   */
  @Prop({ 
    required: true,
    trim: true,
    maxlength: 500,
  })
  description: string;

  /**
   * Indica si se permiten paquetes en el viaje.
   */
  @Prop({ required: true, default: false })
  allowPackage: boolean;

  /**
   * Indica si se permiten pasajeros en el viaje.
   */
  @Prop({ required: true, default: true })
  allowPassenger: boolean;

  /**
   * Cantidad máxima de pasajeros.
   */
  @Prop({ 
    required: true,
    min: 0,
    max: 10,
  })
  peopleQuantity: number;

  /**
   * Lugares disponibles actuales.
   */
  @Prop({ 
    min: 0,
    default: function() { return this.peopleQuantity; },
  })
  placesAvailable: number;

  /**
   * Vehículo utilizado en el viaje.
   */
  @Prop({ 
    required: true, 
    type: MongooseSchema.Types.ObjectId, 
    ref: 'Vehicle',
    index: true,
  })
  vehicle: MongooseSchema.Types.ObjectId;

  /**
   * Email del conductor.
   */
  @Prop({ 
    required: true,
    lowercase: true,
    index: true,
  })
  driver: string;

  /**
   * Fecha y hora de inicio del viaje.
   * Usamos Date nativo para mejor indexación y consultas.
   */
  @Prop({ 
    required: true,
    type: Date,
    index: true,
  })
  departureDate: Date;

  /**
   * Estado actual del viaje.
   */
  @Prop({ 
    required: true, 
    type: String,
    enum: Object.values(TripStatus),
    default: TripStatus.OPEN,
    index: true,
  })
  status: TripStatus;

  /**
   * Solicitudes aceptadas (pasajeros confirmados).
   */
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Request', default: [] })
  acceptedRequests: MongooseSchema.Types.ObjectId[];

  /**
   * Solicitudes pendientes.
   */
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Request', default: [] })
  pendingRequests: MongooseSchema.Types.ObjectId[];

  /**
   * IDs de los paquetes en el viaje.
   */
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Package', default: [] })
  packages: MongooseSchema.Types.ObjectId[];

  /**
   * Precio sugerido por pasajero (en moneda local).
   */
  @Prop({ 
    type: Number,
    min: 0,
  })
  pricePerPassenger?: number;

  /**
   * Costos estimados del viaje.
   */
  @Prop({ type: Number, min: 0 })
  estimatedCosts?: number;

  /**
   * Distancia total en kilómetros.
   */
  @Prop({ type: Number, min: 0 })
  kilometers?: number;

  /**
   * Duración estimada en minutos.
   */
  @Prop({ type: Number, min: 0 })
  estimatedDuration?: number;

  /**
   * Valuaciones del viaje.
   */
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Valuation', default: [] })
  valuations: MongooseSchema.Types.ObjectId[];

  /**
   * Resumen del viaje (post-finalización).
   */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'TripResume' })
  tripResumeId?: MongooseSchema.Types.ObjectId;

  /**
   * Tags para búsqueda y categorización.
   */
  @Prop({ type: [String], default: [] })
  tags: string[];

  /**
   * Notas adicionales del conductor.
   */
  @Prop({ maxlength: 1000 })
  notes?: string;

  // Legacy field - mantener por compatibilidad
  @Prop()
  startedTimestamp?: string;

  @Prop()
  createdTimestamp?: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Request' })
  tripsRequests?: MongooseSchema.Types.ObjectId[];
}

export const TripSchema = SchemaFactory.createForClass(Trip);

// ============================================
// INDEXES - Optimización de consultas MongoDB
// ============================================

// Índice geoespacial 2dsphere para búsqueda por ubicación de origen
TripSchema.index({ 'origin.location': '2dsphere' });

// Índice geoespacial para destino
TripSchema.index({ 'destination.location': '2dsphere' });

// Índice compuesto para la consulta más común: viajes abiertos ordenados por fecha
TripSchema.index({ status: 1, departureDate: 1 });

// Índice compuesto para viajes de un conductor específico
TripSchema.index({ driver: 1, status: 1, departureDate: -1 });

// Índice para búsqueda por provincias (consultas de filtrado)
TripSchema.index({ 'origin.province': 1, 'destination.province': 1, status: 1 });

// Índice de texto para búsqueda full-text
TripSchema.index(
  { 
    description: 'text', 
    'origin.locality': 'text', 
    'destination.locality': 'text',
    tags: 'text',
  },
  { 
    weights: { 
      'origin.locality': 3, 
      'destination.locality': 3, 
      description: 1,
      tags: 2,
    },
    name: 'trip_text_search',
  }
);

// ============================================
// VIRTUALS - Solo para transformación de datos
// ============================================

// Ruta completa como virtual (útil para JSON)
TripSchema.virtual('route').get(function(this: TripDocument) {
  if (!this.origin || !this.destination) return '';
  return `${this.origin.locality} → ${this.destination.locality}`;
});

// ============================================
// HOOKS / MIDDLEWARE
// ============================================

// Pre-save: asegurar consistencia de datos
TripSchema.pre('save', function() {
  // Asegurar que placesAvailable no exceda peopleQuantity
  if (this.placesAvailable > this.peopleQuantity) {
    this.placesAvailable = this.peopleQuantity;
  }
  
  // Migrar startedTimestamp a departureDate si existe
  if (this.startedTimestamp && !this.departureDate) {
    this.departureDate = new Date(this.startedTimestamp);
  }
});
