import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseHelper } from '../../common/helpers/http/response.helper';
import { ResponseDTO } from '../../common/interfaces/responses.interface';
import { Trip, TripDocument } from '../trips/trip.schema';
import { TripStatus } from '../trips/enums/state.enum';
import { User, UserDocument } from '../users/user.schema';
import { CreateValuationDto } from './dto/create-valuation.dto';
import { Valuation, ValuationDocument } from './entities/valuation.schema';
import { Request as RequestModel, RequestDocument } from '../requests/request.schema';

@Injectable()
export class ValuationsService {
  private readonly logger = new Logger(ValuationsService.name);

  constructor(
    @InjectModel(Valuation.name)
    private readonly valuationModel: Model<ValuationDocument>,
    @InjectModel(Trip.name)
    private readonly tripModel: Model<TripDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(RequestModel.name)
    private readonly requestModel: Model<RequestDocument>,
    private readonly responseHelper: ResponseHelper,
  ) {}

  /**
   * Crea una nueva valoración para un usuario después de un viaje.
   */
  async create(createValuationDto: CreateValuationDto, userEmail: string): Promise<ResponseDTO> {
    try {
      // 1. Verificar que el viaje existe
      const trip = await this.tripModel.findOne({ id: createValuationDto.tripId });

      if (!trip) {
        this.logger.warn(`Trip not found: ${createValuationDto.tripId}`);
        return this.responseHelper.makeResponse(
          true,
          'El viaje no existe',
          null,
          HttpStatus.NOT_FOUND,
        );
      }

      // 2. Verificar que el viaje está en estado FINISHED o PENDING_VALORATION
      if (trip.status !== TripStatus.FINISHED && trip.status !== TripStatus.PENDING_VALORATION) {
        this.logger.warn(`Trip ${createValuationDto.tripId} is not finished. Status: ${trip.status}`);
        return this.responseHelper.makeResponse(
          true,
          'El viaje aún no ha finalizado',
          null,
          HttpStatus.BAD_REQUEST,
        );
      }

      // 3. Verificar que el usuario que valora participó en el viaje (como conductor o pasajero)
      const isDriver = trip.driver === userEmail;

      // Buscar si el usuario es pasajero (tiene una request aceptada)
      const passengerRequest = await this.requestModel.findOne({
        tripId: createValuationDto.tripId,
        email: userEmail,
        status: 'ACEPTADA'
      });
      const isPassenger = !!passengerRequest;

      if (!isDriver && !isPassenger) {
        this.logger.warn(`User ${userEmail} is not a participant in trip ${createValuationDto.tripId}`);
        return this.responseHelper.makeResponse(
          true,
          'No participaste en este viaje',
          null,
          HttpStatus.FORBIDDEN,
        );
      }

      // 4. Verificar que el usuario valorado también participó en el viaje
      const valoradoIsDriver = trip.driver === createValuationDto.valoradoEmail;
      const valoradoRequest = await this.requestModel.findOne({
        tripId: createValuationDto.tripId,
        email: createValuationDto.valoradoEmail,
        status: 'ACEPTADA'
      });
      const valoradoIsPassenger = !!valoradoRequest;

      if (!valoradoIsDriver && !valoradoIsPassenger) {
        this.logger.warn(`User ${createValuationDto.valoradoEmail} is not a participant in trip ${createValuationDto.tripId}`);
        return this.responseHelper.makeResponse(
          true,
          'El usuario a valorar no participó en este viaje',
          null,
          HttpStatus.BAD_REQUEST,
        );
      }

      // 5. Verificar que no se está valorando a sí mismo
      if (userEmail === createValuationDto.valoradoEmail) {
        return this.responseHelper.makeResponse(
          true,
          'No puedes valorarte a ti mismo',
          null,
          HttpStatus.BAD_REQUEST,
        );
      }

      // 6. Verificar que no existe ya una valoración del mismo usuario para el mismo viaje y persona
      const existingValuation = await this.valuationModel.findOne({
        email: userEmail,
        valoradoEmail: createValuationDto.valoradoEmail,
        tripId: createValuationDto.tripId,
      });

      if (existingValuation) {
        this.logger.warn(`Valuation already exists for user ${userEmail} -> ${createValuationDto.valoradoEmail} in trip ${createValuationDto.tripId}`);
        return this.responseHelper.makeResponse(
          true,
          'Ya has valorado a este usuario para este viaje',
          null,
          HttpStatus.CONFLICT,
        );
      }

      // 7. Crear la valoración
      const newValuation = new this.valuationModel({
        email: userEmail,
        valoradoEmail: createValuationDto.valoradoEmail,
        tripId: createValuationDto.tripId,
        puntaje: createValuationDto.puntaje,
        detalle: createValuationDto.detalle || '',
        tags: createValuationDto.tags || [],
        paid: createValuationDto.paid,
        fechaHoraCreado: new Date().toISOString(),
      });

      const savedValuation = await newValuation.save();

      // 8. Actualizar el rating promedio del usuario valorado
      await this.updateUserRating(createValuationDto.valoradoEmail);

      // 9. Agregar la valoración al viaje
      trip.valuations.push(savedValuation._id);
      await trip.save();

      this.logger.log(`Valuation created successfully: ${userEmail} -> ${createValuationDto.valoradoEmail} (${createValuationDto.puntaje} stars)`);

      return this.responseHelper.makeResponse(
        false,
        'Valoración creada exitosamente',
        savedValuation,
        HttpStatus.CREATED,
      );
    } catch (error) {
      this.logger.error('Error creating valuation:', error);
      return this.responseHelper.makeResponse(
        true,
        'Error al crear la valoración',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Actualiza el rating promedio de un usuario basado en todas sus valoraciones recibidas.
   */
  async updateUserRating(userEmail: string): Promise<void> {
    try {
      const valuations = await this.valuationModel.find({ valoradoEmail: userEmail });

      if (valuations.length === 0) {
        return;
      }

      const totalReviews = valuations.length;
      const sumRatings = valuations.reduce((sum, val) => sum + val.puntaje, 0);
      const averageRating = Math.round((sumRatings / totalReviews) * 10) / 10; // Redondear a 1 decimal

      await this.userModel.findOneAndUpdate(
        { email: userEmail },
        { averageRating, totalReviews }
      );

      this.logger.log(`Updated rating for ${userEmail}: ${averageRating} (${totalReviews} reviews)`);
    } catch (error) {
      this.logger.error(`Error updating user rating for ${userEmail}:`, error);
    }
  }

  /**
   * Obtiene todas las valoraciones recibidas por un usuario.
   */
  async findByUser(userEmail: string): Promise<ResponseDTO> {
    try {
      const valuations = await this.valuationModel
        .find({ valoradoEmail: userEmail })
        .sort({ fechaHoraCreado: 'desc' })
        .exec();

      if (valuations.length === 0) {
        return this.responseHelper.makeResponse(
          false,
          'No se encontraron valoraciones',
          [],
          HttpStatus.OK,
        );
      }

      return this.responseHelper.makeResponse(
        false,
        'Valoraciones encontradas',
        valuations,
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error('Error finding valuations by user:', error);
      return this.responseHelper.makeResponse(
        true,
        'Error al buscar valoraciones',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene todas las valoraciones de un viaje específico.
   */
  async findByTrip(tripId: string): Promise<ResponseDTO> {
    try {
      const valuations = await this.valuationModel
        .find({ tripId })
        .sort({ fechaHoraCreado: 'desc' })
        .exec();

      return this.responseHelper.makeResponse(
        false,
        'Valoraciones del viaje',
        valuations,
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error('Error finding valuations by trip:', error);
      return this.responseHelper.makeResponse(
        true,
        'Error al buscar valoraciones del viaje',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene el resumen de rating de un usuario.
   */
  async getUserRatingSummary(userEmail: string): Promise<ResponseDTO> {
    try {
      const user = await this.userModel.findOne({ email: userEmail });

      if (!user) {
        return this.responseHelper.makeResponse(
          true,
          'Usuario no encontrado',
          null,
          HttpStatus.NOT_FOUND,
        );
      }

      const summary = {
        averageRating: user.averageRating || 0,
        totalReviews: user.totalReviews || 0,
      };

      return this.responseHelper.makeResponse(
        false,
        'Resumen de rating',
        summary,
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error('Error getting user rating summary:', error);
      return this.responseHelper.makeResponse(
        true,
        'Error al obtener resumen de rating',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Verifica si un usuario ya valoró a todos los participantes de un viaje.
   */
  async checkPendingValuations(tripId: string, userEmail: string): Promise<ResponseDTO> {
    try {
      const trip = await this.tripModel.findOne({ id: tripId });

      if (!trip) {
        return this.responseHelper.makeResponse(
          true,
          'Viaje no encontrado',
          null,
          HttpStatus.NOT_FOUND,
        );
      }

      // Obtener todos los participantes del viaje
      const participants: string[] = [trip.driver];

      // Obtener pasajeros aceptados
      const acceptedRequests = await this.requestModel.find({
        tripId,
        status: 'ACEPTADA'
      });

      acceptedRequests.forEach(req => {
        if (!participants.includes(req.email)) {
          participants.push(req.email);
        }
      });

      // Obtener valoraciones ya realizadas por el usuario
      const existingValuations = await this.valuationModel.find({
        tripId,
        email: userEmail,
      });

      const valoradosEmails = existingValuations.map(v => v.valoradoEmail);

      // Encontrar participantes pendientes de valorar (excluyendo al propio usuario)
      const pendingParticipants = participants.filter(
        p => p !== userEmail && !valoradosEmails.includes(p)
      );

      return this.responseHelper.makeResponse(
        false,
        'Estado de valoraciones',
        {
          totalParticipants: participants.filter(p => p !== userEmail).length,
          valorados: valoradosEmails.length,
          pendientes: pendingParticipants,
          completado: pendingParticipants.length === 0,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error('Error checking pending valuations:', error);
      return this.responseHelper.makeResponse(
        true,
        'Error al verificar valoraciones pendientes',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
