import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { StatusRequest } from './enums/status.enum';

export type RequestDocument = Request & Document;

/**
 * Representa una solicitud para unirse a un viaje.
 */
@Schema({
  timestamps: true,
  collection: 'requests',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Request {
  /**
   * Email del solicitante.
   */
  @Prop({ 
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;

  /**
   * ID del viaje solicitado.
   */
  @Prop({ 
    required: true,
    index: true,
  })
  tripId: string;

  /**
   * Referencia al viaje (ObjectId).
   */
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Trip' })
  trip?: MongooseSchema.Types.ObjectId;

  /**
   * Descripción o mensaje del solicitante.
   */
  @Prop({ 
    required: true,
    trim: true,
    maxlength: 500,
  })
  description: string;

  /**
   * Indica si lleva equipaje.
   */
  @Prop({ required: true, default: false })
  hasEquipment: boolean;

  /**
   * Indica si viaja con acompañantes.
   */
  @Prop({ required: true, default: false })
  hasPartner: boolean;

  /**
   * Cantidad de acompañantes.
   */
  @Prop({ 
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  })
  partnerQuantity: number;

  /**
   * Total de pasajeros (solicitante + acompañantes).
   */
  @Prop({ 
    required: true,
    type: Number,
    min: 1,
    max: 6,
  })
  totalPassenger: number;

  /**
   * Estado de la solicitud.
   */
  @Prop({ 
    required: true,
    type: String,
    enum: Object.values(StatusRequest),
    default: StatusRequest.ON_HOLD,
    index: true,
  })
  status: StatusRequest;

  /**
   * Fecha de respuesta (aceptación/rechazo).
   */
  @Prop({ type: Date })
  respondedAt?: Date;

  /**
   * Motivo de rechazo (opcional).
   */
  @Prop({ maxlength: 200 })
  rejectionReason?: string;

  // Legacy field - mantener por compatibilidad
  @Prop()
  createdTimestamp?: string;
}

export const RequestSchema = SchemaFactory.createForClass(Request);

// ============================================
// INDEXES
// ============================================

// Índice compuesto para consultas de solicitudes por viaje y estado
RequestSchema.index({ tripId: 1, status: 1 });

// Índice compuesto para solicitudes de un usuario
RequestSchema.index({ email: 1, status: 1, createdAt: -1 });

// Índice para buscar solicitudes pendientes antiguas (para expiración)
RequestSchema.index({ status: 1, createdAt: 1 });

// ============================================
// VIRTUALS - Solo para transformación de datos
// ============================================

// Verificar si está pendiente (útil para JSON)
RequestSchema.virtual('isPending').get(function(this: RequestDocument) {
  return this.status === StatusRequest.ON_HOLD;
});

// Verificar si fue aceptada (útil para JSON)
RequestSchema.virtual('isAccepted').get(function(this: RequestDocument) {
  return this.status === StatusRequest.ACCEPTED;
});

// ============================================
// HOOKS
// ============================================

// Pre-save: calcular totalPassenger automáticamente
RequestSchema.pre('save', function() {
  if (this.isModified('hasPartner') || this.isModified('partnerQuantity')) {
    this.totalPassenger = 1 + (this.hasPartner ? this.partnerQuantity : 0);
  }
});
