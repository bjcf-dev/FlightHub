// src/validators/flight.validator.ts
import Joi from 'joi';

export class FlightValidator {
  private static readonly id = Joi.string().trim();

  // Permitimos letras, acentos y espacios
  private static readonly origin = Joi.string()
    .pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
    .min(3)
    .max(50)
    .trim();

  private static readonly destination = Joi.string()
    .pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
    .min(3)
    .max(50)
    .trim();

  // Aceptamos string ISO para la fecha
  private static readonly time_departure = Joi.string().isoDate();

  // Aceptamos tanto on-time como on_time para mayor tolerancia
  private static readonly status = Joi.string().valid(
    'on-time',
    'on_time',
    'delayed',
    'cancelled'
  );

  private static readonly skip = Joi.number().min(1);
  private static readonly limit = Joi.number().min(1).max(100);

  static readonly flightIdSchema = Joi.object({
    id: FlightValidator.id.required(),
  });

  static readonly flightPaginationSchema = Joi.object({
    skip: FlightValidator.skip,
    limit: FlightValidator.limit,
    origin: FlightValidator.origin.optional(),
    destination: FlightValidator.destination.optional(),
  }).with('skip', 'limit');

  // Helper: acepta time_departure o departureTime y normaliza status
  private static readonly timeDepartureAlternative = Joi.alternatives().try(
    FlightValidator.time_departure,
    Joi.string().trim()
  );

  static readonly flightCreateSchema = Joi.object({
    origin: FlightValidator.origin.required(),
    destination: FlightValidator.destination.required(),
    // permitimos que el cliente envíe time_departure o departureTime
    time_departure: FlightValidator.timeDepartureAlternative,
    departureTime: FlightValidator.timeDepartureAlternative,
    status: FlightValidator.status.required(),
  })
    .custom((value) => {
      // Si viene departureTime y no time_departure, copiarlo
      if (value.departureTime && !value.time_departure) {
        value.time_departure = value.departureTime;
        delete value.departureTime;
      }

      // Normalizar status: on-time -> on_time
      if (typeof value.status === 'string') {
        value.status = value.status.replace('-', '_');
      }

      return value;
    })
    .required()
    .prefs({ abortEarly: false });

  static readonly flightUpdateSchema = Joi.object({
    origin: FlightValidator.origin,
    destination: FlightValidator.destination,
    time_departure: FlightValidator.timeDepartureAlternative,
    departureTime: FlightValidator.timeDepartureAlternative,
    status: FlightValidator.status,
  })
    .custom((value) => {
      if (value.departureTime && !value.time_departure) {
        value.time_departure = value.departureTime;
        delete value.departureTime;
      }
      if (typeof value.status === 'string') {
        value.status = value.status.replace('-', '_');
      }
      return value;
    })
    .prefs({ abortEarly: false });
}
