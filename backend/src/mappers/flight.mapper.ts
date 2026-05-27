// src/mappers/flight.mapper.ts

import {
  IFlight,
  IFlightCreate,
  IFlightUpdate,
} from '../interfaces/flight.interface';
import {
  FlightResponseDto,
  CreateFlightDto,
  UpdateFlightDto,
} from '../dtos/flight.dto';

// Enum de estados válidos
export enum FlightStatus {
  ON_TIME = 'on time',
  DELAYED = 'delayed',
  CANCELLED = 'cancelled',
}

// Normalizador de valores
function normalizeStatus(status: string): FlightStatus {
  switch (status.toLowerCase()) {
    case 'activo':
      return FlightStatus.ON_TIME;
    case 'cancelado':
      return FlightStatus.CANCELLED;
    case 'delayed':
      return FlightStatus.DELAYED;
    default:
      // fallback: si ya es válido, lo devuelve tal cual
      return status as FlightStatus;
  }
}

// Mapper de salida (Response DTO)
export const toFlightResponse = (u: IFlight): FlightResponseDto => ({
  id: u.id,
  origin: u.origin,
  destination: u.destination,
  departureTime: u.time_departure.toISOString(),
  status: normalizeStatus(u.status), // siempre normalizado
  createdAt: u.createdAt.toISOString(),
  updatedAt: u.updatedAt.toISOString(),
});

// Mapper de entrada (Create DTO → dominio)
export const toCreateFlightInput = (dto: CreateFlightDto): IFlightCreate => ({
  origin: dto.origin,
  destination: dto.destination,
  time_departure: new Date(dto.time_departure),
  status: normalizeStatus(dto.status), // normaliza al crear
});

// Mapper de entrada (Update DTO → dominio)
export const toUpdateFlightInput = (dto: UpdateFlightDto): IFlightUpdate => {
  const input: IFlightUpdate = {};

  if (dto.origin !== undefined) input.origin = dto.origin;
  if (dto.destination !== undefined) input.destination = dto.destination;
  if (dto.time_departure !== undefined)
    input.time_departure = new Date(dto.time_departure);
  if (dto.status !== undefined) input.status = normalizeStatus(dto.status); // normaliza al actualizar

  return input;
};
