import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PasswordTokenDocument = PasswordToken & Document;

/**
 * Schema para tokens de restablecimiento de contraseña.
 * Usa TTL index para auto-eliminación de tokens expirados.
 */
@Schema({
  timestamps: true,
  _id: false, // Es un subdocumento embebido
})
export class PasswordToken {
  /**
   * Código de verificación (4-6 dígitos).
   */
  @Prop({ 
    required: true,
    minlength: 4,
    maxlength: 6,
  })
  code: string;

  /**
   * Fecha de creación del token.
   */
  @Prop({ 
    required: true,
    type: Date,
    default: Date.now,
  })
  created: Date;

  /**
   * Fecha de expiración del token.
   * MongoDB TTL index eliminará documentos automáticamente después de esta fecha.
   */
  @Prop({ 
    required: true,
    type: Date,
    index: { expireAfterSeconds: 0 }, // TTL index - expira exactamente en esta fecha
  })
  expire: Date;

  /**
   * Indica si el token ha sido validado/usado.
   */
  @Prop({ 
    required: true, 
    default: false,
  })
  validated: boolean;

  /**
   * Número de intentos fallidos.
   * Para limitar intentos de fuerza bruta.
   */
  @Prop({ 
    type: Number,
    default: 0,
    max: 5, // Máximo 5 intentos
  })
  attempts: number;
}

export const PasswordTokenSchema = SchemaFactory.createForClass(PasswordToken);

// ============================================
// INSTANCE METHODS
// ============================================

// Verificar si el token está expirado
PasswordTokenSchema.methods.isExpired = function(): boolean {
  return new Date() > this.expire;
};

// Verificar si se excedieron los intentos
PasswordTokenSchema.methods.hasExceededAttempts = function(): boolean {
  return this.attempts >= 5;
};

// Incrementar intentos fallidos
PasswordTokenSchema.methods.incrementAttempts = function() {
  this.attempts += 1;
  return this;
};
