// Handles direct data operations related to flights.
// This layer interacts with the database or a data source to perform CRUD operations.

import logger from '../config/logger';
import { IFlightModel, FlightModel } from '../models/flight.model';
import {
  IFlight,
  IFlightCreate,
  IFlightUpdate,
} from '../interfaces/flight.interface';
import { BaseRepository } from './base.repository';

export class FlightRepository {
  private readonly baseRepository: BaseRepository<IFlightModel>;

  constructor() {
    this.baseRepository = new BaseRepository(FlightModel);
  }

  private mapToDomain(f: IFlightModel): IFlight {
    return {
      id: f.id!, // forzamos porque Mongo siempre devuelve _id
      origin: f.origin,
      destination: f.destination,
      time_departure: f.time_departure,
      status: f.status,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
    };
  }

  getById = async (
    id: string,
    projection: Record<string, boolean>
  ): Promise<IFlight | null> => {
    logger.debug(`Repository: Fetching flight by id: ${id}`);
    const flightFound = await this.baseRepository.getById(id, projection);
    if (!flightFound) {
      logger.debug(`Repository: No flight found with id: ${id}`);
      return null;
    }
    logger.debug(`Repository: Flight with id ${id} fetched`);
    return this.mapToDomain(flightFound);
  };

  find = async (
    filters: Record<string, unknown> = {},
    projection: Record<string, boolean> = {},
    pagination: { skip: number; limit: number } = { skip: 0, limit: 0 }
  ): Promise<IFlight[]> => {
    const options = { ...pagination };

    const query: Record<string, any> = {};
    if (filters.origin) {
      query.origin = { $regex: filters.origin as string, $options: 'i' };
    }
    if (filters.destination) {
      query.destination = {
        $regex: filters.destination as string,
        $options: 'i',
      };
    }

    logger.debug(
      `Repository: Finding flights with filters: ${JSON.stringify(query)} and pagination: ${JSON.stringify(options)}`
    );

    const flights = await this.baseRepository.find<IFlightModel>(
      query,
      projection,
      options
    );

    logger.debug(`Repository: Found ${flights ? flights.length : 0} flights`);
    return (flights || []).map((f) => this.mapToDomain(f));
  };

  create = async (
    data: IFlightCreate,
    projection: Record<string, boolean>
  ): Promise<IFlight | null> => {
    logger.debug({ data }, 'Repository: Creating flight with data');
    const createdFlight = await this.baseRepository.create(data, projection);
    if (!createdFlight) {
      logger.debug('Repository: Flight creation returned null');
      return null;
    }
    logger.debug({ flight: createdFlight }, 'Repository: Flight created');
    return this.mapToDomain(createdFlight);
  };

  update = async (
    id: string,
    data: IFlightUpdate,
    projection: Record<string, boolean>
  ): Promise<IFlight | null> => {
    logger.debug({ data }, `Repository: Updating flight with id: ${id}`);
    const updatedFlight = await this.baseRepository.update(
      id,
      data,
      projection
    );
    if (!updatedFlight) {
      logger.debug(`Repository: No flight found to update with id: ${id}`);
      return null;
    }
    logger.debug(`Repository: Flight with id ${id} updated`);
    return this.mapToDomain(updatedFlight);
  };

  delete = async (
    id: string,
    projection: Record<string, boolean>
  ): Promise<IFlight | null> => {
    logger.debug(`Repository: Deleting flight with id: ${id}`);
    const flightDeleted = await this.baseRepository.delete(id, projection);
    if (!flightDeleted) {
      logger.warn(`Repository: No flight found to delete with id: ${id}`);
      return null;
    }
    logger.debug(`Repository: Flight with id ${id} deleted`);
    return this.mapToDomain(flightDeleted);
  };
}
