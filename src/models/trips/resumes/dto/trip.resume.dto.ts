export class NewResumeDTO {
  /**
   * Lista de IDs de los pasajeros del viaje.
   */
  passengers: string[];

  /**
   * Lista de IDs de las valuaciones asociadas al viaje.
   */

  valuations?: string[];

  /**
   * Marca de tiempo de inicio del viaje.
   */
  startedTimestamp: string;

  /**
   * Marca de tiempo de finalización del viaje.
   */

  endedTimestamp?: string;
}
