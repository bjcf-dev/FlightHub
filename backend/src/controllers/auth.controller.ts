import { NextFunction, Request, Response } from 'express';
import { httpStatus } from '../config/httpStatusCodes';
import logger from '../config/logger';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { AppError } from '../utils/application.error';
import { toUserCredentials, toUserResponse } from '../mappers/user.mapper';
import { TokenHelper } from '../utils/token.helper';

export class AuthController {
  private readonly userService: UserService;
  private readonly authService: AuthService;

  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
  }

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { email } = req.body;
    logger.debug(`Controller: Received login request for email: ${email}`);

    try {
      const credentials = toUserCredentials(req.body);
      const { user, token } = await this.authService.login(credentials);

      res.status(httpStatus.OK).send({
        message: 'Login successful',
        user: toUserResponse(user),
        token,
      });
    } catch (error) {
      logger.debug(`Controller: Error during login for email: ${email}`);
      const appError =
        error instanceof AppError
          ? error
          : new AppError('Login failed', httpStatus.INTERNAL_SERVER_ERROR, {
              email,
              originalError: error,
            });
      next(appError);
    }
  };

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { email } = req.body;
    logger.debug(
      { body: req.body },
      `Controller: Received registration request for email: ${email}`
    );

    try {
      logger.debug(`User registration attempt: ${email}`);
      const user = await this.userService.create(req.body);
      const data = toUserResponse(user);

      logger.info(`User registered successfully with email: ${email}`);

      const token = TokenHelper.generateToken({ id: data.id });

      res.status(httpStatus.CREATED).send({
        message: 'User registered successfully',
        user: data,
        token,
      });
    } catch (error) {
      logger.debug(
        { email, body: req.body },
        'Controller: Error during registration'
      );
      const appError =
        error instanceof AppError
          ? error
          : new AppError(
              'Registration failed',
              httpStatus.INTERNAL_SERVER_ERROR,
              {
                email,
                originalError: error,
              }
            );
      next(appError);
    }
  };
}
