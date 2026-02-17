# Refactorización: Patrón Repository y Serialización de Documentos

## 📋 Resumen

Se ha refactorizado toda la aplicación para seguir las mejores prácticas de arquitectura en aplicaciones NestJS con MongoDB:

1. **Schemas**: Solo definen estructura, índices y hooks básicos de validación
2. **Repositories**: Acceso a datos, siempre retornan objetos planos usando `.lean()` o `.toObject()`
3. **Services**: Lógica de negocio, métodos que antes eran `statics` y `methods` del schema

## 🎯 Objetivo

Separar correctamente las responsabilidades:
- **Schemas** → Estructura de datos y validación
- **Repositories** → Acceso a datos (CRUD)
- **Services** → Lógica de negocio

## 📦 Módulos Refactorizados

### 1. **Trips** (`src/models/trips/`)

#### Schema (`trip.schema.ts`)
- ✅ Eliminados métodos estáticos: `findNearbyTrips`, `findAvailableByRoute`, `searchTrips`
- ✅ Eliminados métodos de instancia: `canAcceptPassengers`, `reserveSeats`, `releaseSeats`
- ✅ Eliminados virtuals de cálculo: `occupancyPercentage`, `isFull`, `isPast`
- ✅ Mantenido virtual: `route` (solo para transformación JSON)

#### Repository (`trip.mongodb.repository.ts`)
- ✅ Todos los métodos usan `.lean()` para retornar objetos planos
- ✅ Implementados métodos `update` y `updateStatus`
- ✅ Tipo de retorno: `Trip` (objeto plano) en lugar de `TripDocument`

#### Service (`trip.service.ts`)
- ✅ Agregados métodos de negocio:
  - `findNearbyTrips(longitude, latitude, maxDistanceKm)` - Búsqueda geoespacial
  - `findAvailableByRoute(originProvince, destinationProvince, fromDate)` - Búsqueda por ruta
  - `searchTrips(searchTerm)` - Búsqueda full-text
  - `canAcceptPassengers(trip, count)` - Validación de capacidad
  - `reserveSeats(tripId, count)` - Reservar asientos
  - `releaseSeats(tripId, count)` - Liberar asientos
  - `calculateOccupancyPercentage(trip)` - Cálculo de ocupación
  - `isTripFull(trip)` - Verificar si está lleno
  - `isTripPast(trip)` - Verificar si ya pasó
  - `getTripRoute(trip)` - Obtener ruta formateada

### 2. **Users** (`src/models/users/`)

#### Schema (`user.schema.ts`)
- ✅ Eliminados métodos estáticos: `findActiveUsers`, `searchByText`
- ✅ Eliminados métodos de instancia: `isActive`, `incrementTripsAsDriver`, `incrementTripsAsPassenger`
- ✅ Agregado tipo: `UserWithId = User & { _id: string }` para objetos con ID
- ✅ Mantenido virtual: `fullName`

#### Repository (`user.repository.ts`)
- ✅ Todos los métodos usan `.lean()` para retornar objetos planos
- ✅ Agregado método `findByEmailWithPassword` para incluir password
- ✅ Agregados métodos `findActiveUsers` y `searchByText`
- ✅ Tipo de retorno: `User` (objeto plano) en lugar de `UserDocument`

#### Service (`user.service.ts`)
- ✅ Agregados métodos de negocio:
  - `findActiveUsers()` - Buscar usuarios activos
  - `searchByText(searchTerm)` - Búsqueda full-text
  - `isUserActive(user)` - Verificar si está activo
  - `incrementTripsAsDriver(userId)` - Incrementar contador de viajes como conductor
  - `incrementTripsAsPassenger(userId)` - Incrementar contador de viajes como pasajero
  - `getUserFullName(user)` - Obtener nombre completo

### 3. **Locations** (`src/models/locations/`)

#### Schema (`location-schema.ts`)
- ✅ Eliminados métodos estáticos: `findNearby`, `searchByText`, `getPopular`
- ✅ Eliminados métodos de instancia: `incrementUsage`, `distanceTo`

#### Repository (`location.mongodb.repository.ts`)
- ✅ Todos los métodos usan `.lean()` para retornar objetos planos
- ✅ Agregados métodos:
  - `findNearby(longitude, latitude, maxDistanceKm)` - Búsqueda geoespacial
  - `searchByText(searchTerm)` - Búsqueda full-text
  - `getPopular(limit)` - Ubicaciones más populares
  - `incrementUsage(placeId)` - Incrementar contador de uso
- ✅ Tipo de retorno: `Location` (objeto plano)

#### Interface (`location.repository.interface.ts`)
- ✅ Actualizada para incluir todos los nuevos métodos

#### Service (`location.service.ts`)
- ✅ Agregados métodos de negocio:
  - `findNearby(longitude, latitude, maxDistanceKm)` - Buscar ubicaciones cercanas
  - `searchByText(searchTerm)` - Búsqueda full-text
  - `getPopular(limit)` - Obtener ubicaciones populares
  - `incrementUsage(placeId)` - Incrementar contador de uso
  - `calculateDistance(lat1, lng1, lat2, lng2)` - Calcular distancia (Haversine)

### 4. **Requests** (`src/models/requests/`)

#### Schema (`request.schema.ts`)
- ✅ Eliminados métodos estáticos: `findPendingByTrip`, `findExpired`
- ✅ Mantenidos virtuals: `isPending`, `isAccepted` (solo para JSON)

#### Service (`request.service.ts`)
- ✅ Agregados métodos de negocio:
  - `findPendingByTrip(tripId)` - Buscar solicitudes pendientes de un viaje
  - `findExpired(hoursOld)` - Buscar solicitudes expiradas
  - `isRequestPending(request)` - Verificar si está pendiente
  - `isRequestAccepted(request)` - Verificar si fue aceptada
  - `autoExpireRequests(hoursOld)` - Auto-expirar solicitudes antiguas
- ✅ Actualizados métodos existentes para usar `.lean()`

### 5. **Vehicles** (`src/models/vehicles/`)

#### Schema (`vehicles.schema.ts`)
- ✅ Eliminados métodos estáticos: `findByOwner`
- ✅ Eliminados métodos de instancia: `incrementTrips`
- ✅ Mantenidos virtuals: `fullDescription`, `age`

## 🔧 Cambios Técnicos

### Serialización de Documentos

**Antes:**
```typescript
// Repository retornaba documentos de Mongoose
async findById(id: string): Promise<TripDocument> {
  return await this.tripModel.findOne({id}).exec();
}
```

**Después:**
```typescript
// Repository retorna objetos planos
async findById(id: string): Promise<Trip> {
  const trip = await this.tripModel
    .findOne({id})
    .lean() // ✅ Serializa a objeto plano
    .exec();
  return trip as Trip;
}
```

### Lógica de Negocio en Services

**Antes:**
```typescript
// Método estático en el schema
TripSchema.statics.findNearbyTrips = function(longitude, latitude, maxDistanceKm) {
  return this.find({
    'origin.location': {
      $near: { /* ... */ }
    }
  });
};
```

**Después:**
```typescript
// Método en el service
async findNearbyTrips(longitude, latitude, maxDistanceKm): Promise<ResponseDTO> {
  try {
    const trips = await this.tripRepository.find({
      'origin.location': {
        $near: { /* ... */ }
      }
    });
    return this.responseHelper.makeResponse(/* ... */);
  } catch (error) {
    // Manejo de errores
  }
}
```

### Métodos de Instancia → Métodos del Service

**Antes:**
```typescript
// Método de instancia en el schema
TripSchema.methods.canAcceptPassengers = function(count: number): boolean {
  return this.placesAvailable >= count && this.status === TripStatus.OPEN;
};

// Uso
const canAccept = trip.canAcceptPassengers(2);
```

**Después:**
```typescript
// Método del service
canAcceptPassengers(trip: Trip, count: number = 1): boolean {
  return trip.placesAvailable >= count && trip.status === TripStatus.OPEN;
}

// Uso
const canAccept = this.tripService.canAcceptPassengers(trip, 2);
```

## ✅ Beneficios

### 1. **Separación de Responsabilidades**
- Schemas: Solo estructura y validación
- Repositories: Solo acceso a datos
- Services: Solo lógica de negocio

### 2. **Mejor Testabilidad**
- Los services pueden ser testeados sin necesidad de MongoDB
- Los repositories pueden ser mockeados fácilmente

### 3. **Mejor Performance**
- `.lean()` retorna objetos JavaScript planos (más rápidos)
- No hay overhead de métodos de Mongoose en objetos serializados

### 4. **Mejor Mantenibilidad**
- Código más organizado y predecible
- Más fácil de entender y modificar
- Mejor para trabajo en equipo

### 5. **Mejor Escalabilidad**
- Fácil cambiar de base de datos (solo cambiar repositories)
- Fácil agregar caché (interceptar en repositories)
- Fácil agregar validaciones de negocio (en services)

## 📊 Estadísticas

- **Archivos modificados**: 15
- **Métodos movidos de schemas a services**: ~25
- **Líneas de código agregadas**: ~800
- **Compilación**: ✅ Exitosa
- **Aplicación**: ✅ Corriendo

## 🚀 Próximos Pasos Recomendados

1. **Testing**:
   - Agregar tests unitarios para services
   - Agregar tests de integración para repositories

2. **Documentación**:
   - Documentar todos los nuevos métodos de negocio
   - Agregar ejemplos de uso

3. **Optimización**:
   - Revisar queries N+1
   - Agregar caché para queries frecuentes
   - Implementar paginación donde sea necesario

4. **Validación**:
   - Agregar validaciones de negocio en services
   - Implementar DTOs para todos los métodos públicos

## 📝 Notas Importantes

- Todos los métodos de repositories retornan objetos planos (`User`, `Trip`, `Location`, etc.)
- Los services siempre trabajan con objetos planos, nunca con documentos de Mongoose
- Los virtuals se mantienen solo para transformación JSON (útil en APIs)
- Los hooks (pre-save, etc.) se mantienen para validaciones básicas y normalización de datos
- Se usa `as any` en algunos lugares para evitar conflictos de tipos entre objetos planos y documentos

## 🎓 Arquitectura Final

```
┌─────────────────────────────────────────┐
│           Controllers                    │
│  (Manejo de HTTP, validación de DTOs)   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│            Services                      │
│  (Lógica de negocio, orquestación)      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│          Repositories                    │
│  (Acceso a datos, siempre .lean())      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│            Schemas                       │
│  (Estructura, índices, hooks básicos)   │
└─────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│           MongoDB                        │
└─────────────────────────────────────────┘
```

---

**Fecha**: 12 de Enero de 2026  
**Estado**: ✅ Completado y Funcionando


