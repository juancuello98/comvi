import { ResponseDTO } from '@/common/interfaces/responses.interface';
import { ResponseHelper } from '@/helpers/http/response.helper';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { GetUserDTO } from './dto/user.dto';
import { UserDTO } from './interfaces/user-details.interface';
import { UserRepository } from './user.repository';
import { User, UserWithId, UserStatus } from './user.schema';
import { VERIFICATION_CODE_STATUS } from '../../authentication/authentication.enum';
import { CreateUserDto } from './dto/create-user.dto';

/**
 * Servicio de usuarios - Lógica de negocio
 * Trabaja con objetos planos (User), no con documentos de Mongoose
 */
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly responseHelper: ResponseHelper,
  ) {}

  async update(user: Partial<UserWithId>): Promise<User | null> {
    if (!user._id) {
      throw new Error('User _id is required for update');
    }
    return this.userRepository.update(user as Partial<User> & { _id: string });
  }
  
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    return user;
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmailWithPassword(email);
    return user;
  }
  
  getUser({ _id, name, lastname, email }: UserWithId): UserDTO {
    return {
      _id,
      name,
      lastname,
      email,
    };
  }

  async getUserData(email: string): Promise<ResponseDTO> {
    try {
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        return this.responseHelper.makeResponse(
          false,
          'User not found.',
          null,
          HttpStatus.NOT_FOUND,
        );
      }

      const {
        name,
        lastname
      } = user;

      const userData: GetUserDTO = {
        name,
        lastname,
        email,
      };

      return this.responseHelper.makeResponse(
        false,
        'User data successfully found.',
        userData,
        HttpStatus.OK,
      );
    } catch (error) {
      return this.responseHelper.makeResponse(
        true,
        'Error recovering user data.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: string): Promise<UserDTO | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    return this.getUser(user as UserWithId);
  }

  async create(user: CreateUserDto): Promise<User> {
    return this.userRepository.create(user);
  }

  async updateUserRequests(email: string, requestId: string): Promise<void> {
    await this.userRepository.createRequest(email, requestId);
  }

  async getUsers(ids: string[]): Promise<User[]> {
    const users = await this.userRepository.findUsersById(ids, [
      'name',
      'lastName',
      'email',
    ]);
    return users;
  }

  // ============================================
  // BUSINESS LOGIC METHODS
  // ============================================

  /**
   * Buscar usuarios activos
   */
  async findActiveUsers(): Promise<ResponseDTO> {
    try {
      const users = await this.userRepository.findActiveUsers();

      if (!users.length) {
        return this.responseHelper.makeResponse(
          false,
          'No active users found.',
          [],
          HttpStatus.OK,
        );
      }

      return this.responseHelper.makeResponse(
        false,
        `Found ${users.length} active users.`,
        users,
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error(`Error finding active users: ${error.message}`);
      return this.responseHelper.makeResponse(
        true,
        'Error retrieving active users.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Búsqueda full-text de usuarios
   */
  async searchByText(searchTerm: string): Promise<ResponseDTO> {
    try {
      this.logger.log(`Full-text search for users: ${searchTerm}`);

      const users = await this.userRepository.searchByText(searchTerm);

      if (!users.length) {
        return this.responseHelper.makeResponse(
          false,
          'No users found matching your search.',
          [],
          HttpStatus.OK,
        );
      }

      return this.responseHelper.makeResponse(
        false,
        `Found ${users.length} users matching your search.`,
        users,
        HttpStatus.OK,
      );
    } catch (error) {
      this.logger.error(`Error in user search: ${error.message}`);
      return this.responseHelper.makeResponse(
        true,
        'Error searching users.',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Verificar si un usuario está activo
   */
  isUserActive(user: User): boolean {
    return user.status === VERIFICATION_CODE_STATUS.VALIDATED;
  }

  /**
   * Incrementar contador de viajes como conductor
   */
  async incrementTripsAsDriver(userId: string): Promise<User | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) return null;

    user.tripsAsDriver = (user.tripsAsDriver || 0) + 1;
    return this.userRepository.update({ ...user, _id: userId });
  }

  /**
   * Incrementar contador de viajes como pasajero
   */
  async incrementTripsAsPassenger(userId: string): Promise<User | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) return null;

    user.tripsAsPassenger = (user.tripsAsPassenger || 0) + 1;
    return this.userRepository.update({ ...user, _id: userId });
  }

  /**
   * Obtener el nombre completo de un usuario
   */
  getUserFullName(user: User): string {
    return `${user.name} ${user.lastname}`;
  }
}
