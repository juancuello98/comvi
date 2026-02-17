import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PasswordToken, PasswordTokenSchema } from './passwordToken.schema';
import { VERIFICATION_CODE_STATUS } from '../../authentication/authentication.enum';

export type UserDocument = User & Document;

/**
 * Tipo para usuario como objeto plano con _id de MongoDB
 */
export type UserWithId = User & { _id: string };

// Re-export for convenience
export { VERIFICATION_CODE_STATUS as UserStatus };

/**
 * Representa un usuario en la base de datos.
 * Optimizado para MongoDB con índices y virtuals.
 */
@Schema({
  timestamps: true, // Adds createdAt and updatedAt automatically
  collection: 'users',
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      delete ret['password']; // Never expose password in JSON
      delete ret['__v'];
      return ret;
    },
  },
  toObject: { virtuals: true },
})
export class User {
  /**
   * Nombre del usuario.
   */
  @Prop({ 
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  })
  name: string;

  /**
   * Apellido del usuario.
   */
  @Prop({ 
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  })
  lastname: string;

  /**
   * Correo electrónico único del usuario.
   * Índice único y lowercase para evitar duplicados.
   */
  @Prop({ 
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true, // Índice para búsquedas rápidas
  })
  email: string;

  /**
   * Contraseña del usuario (hasheada).
   * Select false para no incluirla en consultas por defecto.
   */
  @Prop({ 
    required: true,
    select: false, // No incluir en consultas por defecto
  })
  password: string;

  /**
   * Estado del usuario.
   */
  @Prop({ 
    required: true,
    type: String,
    enum: Object.values(VERIFICATION_CODE_STATUS),
    default: VERIFICATION_CODE_STATUS.IN_PROGRESS,
    index: true, // Índice para filtrar por estado
  })
  status: VERIFICATION_CODE_STATUS;

  /**
   * Código de verificación del usuario.
   */
  @Prop({ required: true })
  verificationCode: string;

  /**
   * Token para restablecer la contraseña del usuario.
   * Documento embebido para acceso rápido.
   */
  @Prop({ type: PasswordTokenSchema })
  resetPasswordToken?: PasswordToken;

  /**
   * Número de teléfono (opcional).
   */
  @Prop({ 
    sparse: true, // Índice sparse para valores opcionales
    index: true,
  })
  phone?: string;

  /**
   * URL de la foto de perfil.
   */
  @Prop()
  profilePicture?: string;

  /**
   * Calificación promedio del usuario como conductor.
   */
  @Prop({ 
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  })
  driverRating: number;

  /**
   * Cantidad de viajes como conductor.
   */
  @Prop({ type: Number, default: 0 })
  tripsAsDriver: number;

  /**
   * Cantidad de viajes como pasajero.
   */
  @Prop({ type: Number, default: 0 })
  tripsAsPassenger: number;

  /**
   * Fecha del último login.
   */
  @Prop({ type: Date })
  lastLoginAt?: Date;

  /**
   * IDs de vehículos del usuario (denormalized for quick access).
   */
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Vehicle', default: [] })
  vehicles: MongooseSchema.Types.ObjectId[];
}

/**
 * Esquema de Mongoose para el usuario.
 */
export const UserSchema = SchemaFactory.createForClass(User);

// ============================================
// INDEXES - Optimización de consultas MongoDB
// ============================================

// Índice compuesto para búsqueda por nombre completo
UserSchema.index({ name: 1, lastname: 1 });

// Índice de texto para búsqueda full-text
UserSchema.index(
  { name: 'text', lastname: 'text', email: 'text' },
  { 
    weights: { name: 2, lastname: 2, email: 1 },
    name: 'user_text_search',
  }
);

// Índice compuesto para filtrado común
UserSchema.index({ status: 1, createdAt: -1 });

// ============================================
// VIRTUALS - Solo para transformación de datos
// ============================================

// Nombre completo como virtual (útil para JSON)
UserSchema.virtual('fullName').get(function(this: UserDocument) {
  return `${this.name} ${this.lastname}`;
});

// ============================================
// HOOKS / MIDDLEWARE - Solo validación y normalización básica
// ============================================

// Pre-save hook para normalizar datos
UserSchema.pre('save', function() {
  // Capitalizar nombre y apellido
  if (this.isModified('name')) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  }
  if (this.isModified('lastname')) {
    this.lastname = this.lastname.charAt(0).toUpperCase() + this.lastname.slice(1).toLowerCase();
  }
});
