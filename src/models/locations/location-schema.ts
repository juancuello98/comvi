import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type LocationDocument = Location & Document;

/**
 * Representa una ubicación geográfica.
 * Optimizado con índices geoespaciales para consultas de proximidad.
 */
@Schema({
  timestamps: true,
  collection: 'locations',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Location {
  @Prop({ required: true, trim: true })
  country: string;

  @Prop({ required: true, trim: true, index: true })
  province: string;

  @Prop({ required: true, trim: true })
  department: string;

  @Prop({ required: true, trim: true, index: true })
  locality: string;

  @Prop({ required: true })
  format_address: string;

  /**
   * Latitud (acepta string o number, se convierte a number).
   */
  @Prop({ 
    required: true, 
    type: MongooseSchema.Types.Mixed,
    set: (v: string | number) => typeof v === 'string' ? parseFloat(v) : v,
  })
  latitude: number;

  /**
   * Longitud (acepta string o number, se convierte a number).
   */
  @Prop({ 
    required: true, 
    type: MongooseSchema.Types.Mixed,
    set: (v: string | number) => typeof v === 'string' ? parseFloat(v) : v,
  })
  longitude: number;

  /**
   * Coordenadas GeoJSON para consultas geoespaciales.
   * Formato: { type: "Point", coordinates: [longitude, latitude] }
   * ¡IMPORTANTE: MongoDB usa [lng, lat], no [lat, lng]!
   */
  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    type: string;
    coordinates: [number, number];
  };

  @Prop({ required: true, unique: true, index: true })
  place_id: string;

  /**
   * Número de veces que se usó esta ubicación.
   * Útil para sugerencias y popularidad.
   */
  @Prop({ type: Number, default: 0 })
  usageCount: number;
}

export const LocationSchema = SchemaFactory.createForClass(Location);

// ============================================
// INDEXES - Optimización para consultas geoespaciales
// ============================================

// Índice geoespacial 2dsphere para búsquedas por proximidad
LocationSchema.index({ location: '2dsphere' });

// Índice compuesto para búsquedas por región
LocationSchema.index({ country: 1, province: 1, locality: 1 });

// Índice de texto para búsqueda full-text
LocationSchema.index(
  { locality: 'text', province: 'text', format_address: 'text' },
  { 
    weights: { locality: 3, province: 2, format_address: 1 },
    name: 'location_text_search',
  }
);

// ============================================
// HOOKS / MIDDLEWARE
// ============================================

// Pre-save: generar coordenadas GeoJSON automáticamente
LocationSchema.pre('save', function() {
  // Convertir lat/lng strings a números si es necesario
  if (typeof this.latitude === 'string') {
    this.latitude = parseFloat(this.latitude as any);
  }
  if (typeof this.longitude === 'string') {
    this.longitude = parseFloat(this.longitude as any);
  }
  
  // Generar objeto GeoJSON
  this.location = {
    type: 'Point',
    coordinates: [this.longitude, this.latitude], // [lng, lat]
  };
});
