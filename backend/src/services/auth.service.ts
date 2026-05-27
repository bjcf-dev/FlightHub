import { httpStatus } from '../config/httpStatusCodes';
import logger from '../config/logger';
import { AppError } from '../utils/application.error';
import { UserRepository } from '../repositories/user.repository';
import { PasswordHelper } from '../utils/password.helper';
import { TokenHelper } from '../utils/token.helper';
import { IUserCredentials, IUserWithToken } from '../interfaces/user.interface';

export class AuthService {
  private readonly userRepository: UserRepository;
  private readonly defaultProjection: Record<string, boolean>;

  constructor() {
    this.userRepository = new UserRepository();
    this.defaultProjection = {
      id: true,
      name: true,
      email: true,
      password: false,
      birthday: true, // puedes decidir si mostrarlo o no
      isBlocked: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  login = async (credentials: IUserCredentials): Promise<IUserWithToken> => {
    logger.debug(
      `AuthService: Attempting login for email: ${credentials.email}`
    );

    const projection = { ...this.defaultProjection, password: true };
    const normalizedEmail = credentials.email.toLowerCase();

    const foundUser = await this.userRepository.getByEmail(
      normalizedEmail,
      projection
    );

    if (!foundUser) throw new AppError('User not found', httpStatus.NOT_FOUND);
    if (foundUser.isBlocked)
      throw new AppError('User is blocked', httpStatus.FORBIDDEN);

    const isPasswordValid = await PasswordHelper.comparePasswords(
      credentials.password,
      foundUser.password
    );
    if (!isPasswordValid)
      throw new AppError('Invalid password', httpStatus.UNAUTHORIZED);

    const token = TokenHelper.generateToken({ id: foundUser.id });

    logger.info(`AuthService: Login successful for email: ${normalizedEmail}`);

    const { password, ...userWithoutPassword } = foundUser;

    return { user: userWithoutPassword as Omit<IUser, 'password'>, token };
  };
}
