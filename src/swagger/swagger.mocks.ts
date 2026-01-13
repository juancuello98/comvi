
export const exRegisterUser = {
    lastname: "Gonzales",
    name: "Maria",
    email: "admin@gmail.com",
    password: "admin123"
}

export const exValidateToken = {
    code: "1234",
    email: "admin@gmail.com"
}

export const exRegisterUserResponse = {
    "id": "66d67e6160770470da9afe84",
    "name": "Maria",
    "lastname": "Gonzales",
    "email": "admin123@gmail.com"
  }

  export const exValidateTokenResponde = {
    data: true
  }

  export const exLogin = {
    email: 'maria@gmail.com',
    password: 'admin123'
  }

  export const exLoginResponse = {
    token : "example"
  }

// Reset Password Examples
export const exRequestResetPassword = {
  email: "usuario@ejemplo.com"
}

export const exRequestResetPasswordResponse = {
  hasError: false,
  message: "Reset password email sent successfully",
  data: { email: "usuario@ejemplo.com" },
  status: 200
}

export const exPasswordToken = {
  email: "usuario@ejemplo.com",
  passwordToken: "1234"
}

export const exPasswordTokenResponse = {
  hasError: false,
  message: "Code validated and access token generated",
  data: {
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzdWFyaW9AZWplbXBsby5jb20iLCJwdXJwb3NlIjoicGFzc3dvcmRfcmVzZXQiLCJleHAiOjE3MzU2NzIwMDB9.example",
    email: "usuario@ejemplo.com"
  },
  status: 200
}

export const exResetPassword = {
  password: "nuevaContraseña123"
}

export const exResetPasswordResponse = {
  hasError: false,
  message: "Password reset successfully",
  data: { email: "usuario@ejemplo.com" },
  status: 200
}

  export const exUserData = {
    name : 'nameOfUser',
    lastname: 'lastnameOfUser',
    email: 'emailofUser@gmail.com'
  }

  export const exNewTrip = {
    
      origin: {
        country: "Argentina",
        province: "Buenos Aires",
        department: "La Plata",
        locality: "City Bell",
        format_address: "Calle 480 1234, City Bell, Buenos Aires, Argentina",
        latitude: "-34.9230",
        longitude: "-57.9740",
        place_id: "testorigin2"
      },
      destination: {
        country: "Argentina",
        province: "CABA",
        department: "Comuna 3",
        locality: "Villa del Parque",
        format_address: "Av. San Martín 3456, Villa del Parque, CABA, Argentina",
        latitude: "-34.6140",
        longitude: "-58.4430",
        place_id: "testdestination2"
      },
      description: "Transporte de mercancías desde City Bell hasta Villa del Parque",
      allowPackage: true,
      allowPassenger: true,
      peopleQuantity: 3,
      vehicle: "63614cd9207a33961a281f40",
      startedTimestamp: "2024-09-02T14:00:00Z"
  }

  export const exNewTripResponse = {
      id: "1e43e5eb-9d18-486c-96f7-a36997063110",
      origin: "66d672d288105491d615eea1",
      destination: "66d672d288105491d615eea3",
      description: "Transporte de mercancías desde City Bell hasta Villa del Parque",
      allowPackage: true,
      allowPassenger: true,
      peopleQuantity: 3,
      placesAvailable: 3,
      vehicle: "63614cd9207a33961a281f40",
      driver: "jcuello673@gmail.com",
      startedTimestamp: "2024-09-02T14:00:00Z",
      status: "OPEN",
      packages: [],
      createdTimestamp: "2024-09-03T02:22:10.992Z",
      _id: "66d672d288105491d615eea5",
      __v: 0
    }
  
export const exListOfTripsResponse = {
  data: [
    {
      "id": "1e43e5eb-9d18-486c-96f7-a36997063110",
      "origin": {
        "_id": "66d672d288105491d615eea1",
        "country": "Argentina",
        "province": "Buenos Aires",
        "department": "La Plata",
        "locality": "City Bell",
        "format_address": "Calle 480 1234, City Bell, Buenos Aires, Argentina",
        "latitude": "-34.9230",
        "longitude": "-57.9740",
        "place_id": "testorigin2",
        "__v": 0
      },
      "destination": {
        "_id": "66d672d288105491d615eea3",
        "country": "Argentina",
        "province": "CABA",
        "department": "Comuna 3",
        "locality": "Villa del Parque",
        "format_address": "Av. San Martín 3456, Villa del Parque, CABA, Argentina",
        "latitude": "-34.6140",
        "longitude": "-58.4430",
        "place_id": "testdestination2",
        "__v": 0
      },
      "description": "Transporte de mercancías desde City Bell hasta Villa del Parque",
      "allowPackage": true,
      "allowPassenger": true,
      "peopleQuantity": 3,
      "placesAvailable": 3,
      "vehicle": {
        "_id": "66d676615b92ee86af66dbc0",
        "patentPlate": "AE234KL",
        "model": "208",
        "brand": "Peugeot Feline Cuir",
        "year": 2020,
        "pics": [],
        "email": "jcuello673@gmail.com",
        "color": "Negro",
        "__v": 0
      },
      "driver": "jcuello673@gmail.com",
      "startedTimestamp": "2024-09-02T14:00:00Z",
      "status": "OPEN",
      "packages": [],
      "createdTimestamp": "2024-09-03T02:22:10.992Z"
    },
    {
      "id": "cb9e02e7-a847-436f-bf39-2861aec24f88",
      "origin": {
        "_id": "66d8fe607bb32f821c815edb",
        "country": "Argentina",
        "province": "Córdoba",
        "department": "Capital",
        "locality": "Nueva Córdoba",
        "format_address": "Av. Hipólito Yrigoyen 123, Nueva Córdoba, Córdoba, Argentina",
        "latitude": "-31.4245",
        "longitude": "-64.1830",
        "place_id": "testorigin3",
        "__v": 0
      },
      "destination": {
        "_id": "66d8fe607bb32f821c815edd",
        "country": "Argentina",
        "province": "Santa Fe",
        "department": "Rosario",
        "locality": "Centro",
        "format_address": "Bv. Oroño 789, Centro, Rosario, Santa Fe, Argentina",
        "latitude": "-32.9468",
        "longitude": "-60.6393",
        "place_id": "testdestination3",
        "__v": 0
      },
      "description": "Transporte de pasajeros desde Nueva Córdoba hasta el Centro de Rosario",
      "allowPackage": false,
      "allowPassenger": true,
      "peopleQuantity": 4,
      "placesAvailable": 4,
      "vehicle": null,
      "driver": "juan.frc.utn@gmail.com",
      "startedTimestamp": "2024-09-05T09:30:00Z",
      "status": "OPEN",
      "packages": [],
      "createdTimestamp": "2024-09-05T00:42:09.146Z"
    },
    {
      "id": "c39f14b6-54a9-46fd-b518-8dc57f5478c4",
      "origin": {
        "_id": "66d9029a00bb5bfac63c0dd4",
        "country": "Argentina",
        "province": "Mendoza",
        "department": "Luján de Cuyo",
        "locality": "Chacras de Coria",
        "format_address": "Ruta Panamericana 2000, Chacras de Coria, Mendoza, Argentina",
        "latitude": "-32.9775",
        "longitude": "-68.8914",
        "place_id": "testorigin4",
        "__v": 0
      },
      "destination": {
        "_id": "66d9029a00bb5bfac63c0dd6",
        "country": "Argentina",
        "province": "San Juan",
        "department": "Capital",
        "locality": "Desamparados",
        "format_address": "Av. Libertador 4567, Desamparados, Capital, San Juan, Argentina",
        "latitude": "-31.5235",
        "longitude": "-68.5386",
        "place_id": "testdestination4",
        "__v": 0
      },
      "description": "Transporte de mercancías desde Chacras de Coria hasta Desamparados",
      "allowPackage": true,
      "allowPassenger": false,
      "peopleQuantity": 0,
      "placesAvailable": 0,
      "vehicle": null,
      "driver": "jcuello673@gmail.com",
      "startedTimestamp": "2024-09-10T08:00:00Z",
      "status": "OPEN",
      "packages": [],
      "createdTimestamp": "2024-09-05T01:00:10.680Z"
    }
  ]
}

export const exTripByIdResponse = {
  "data": {
    "id": "1e43e5eb-9d18-486c-96f7-a36997063110",
    "origin": {
      "_id": "66d672d288105491d615eea1",
      "country": "Argentina",
      "province": "Buenos Aires",
      "department": "La Plata",
      "locality": "City Bell",
      "format_address": "Calle 480 1234, City Bell, Buenos Aires, Argentina",
      "latitude": "-34.9230",
      "longitude": "-57.9740",
      "place_id": "testorigin2",
      "__v": 0
    },
    "destination": {
      "_id": "66d672d288105491d615eea3",
      "country": "Argentina",
      "province": "CABA",
      "department": "Comuna 3",
      "locality": "Villa del Parque",
      "format_address": "Av. San Martín 3456, Villa del Parque, CABA, Argentina",
      "latitude": "-34.6140",
      "longitude": "-58.4430",
      "place_id": "testdestination2",
      "__v": 0
    },
    "description": "Transporte de mercancías desde City Bell hasta Villa del Parque",
    "allowPackage": true,
    "allowPassenger": true,
    "peopleQuantity": 3,
    "placesAvailable": 3,
    "vehicle": {
      "_id": "66d676615b92ee86af66dbc0",
      "patentPlate": "AE234KL",
      "model": "208",
      "brand": "Peugeot Feline Cuir",
      "year": 2020,
      "pics": [],
      "email": "jcuello673@gmail.com",
      "color": "Negro",
      "__v": 0
    },
    "driver": "jcuello673@gmail.com",
    "startedTimestamp": "2024-09-02T14:00:00Z",
    "status": "OPEN",
    "packages": [],
    "createdTimestamp": "2024-09-03T02:22:10.992Z"
  }
}

export const exListOfPassengersNotFound = {
  "hasError": false,
  "message": "Not found passengers in the trip.",
  "status": 404
}

export const exListOfPassengersFound = {
  "hasError": false,
  "message": "Passengers founded by trip.",
  "data": [
    {
      "_id": "66d672d288105491d615eea7",
      "name": "Juan",
      "lastname": "Pérez",
      "email": "juan.perez@ejemplo.com"
    },
    {
      "_id": "66d672d288105491d615eea8",
      "name": "María",
      "lastname": "González",
      "email": "maria.gonzalez@ejemplo.com"
    }
  ],
  "status": 200
}

export const exListMyTrips = {
  "hasError": false,
  "message": "Trip founded.",
  "data": [
    {
      "id": "1e43e5eb-9d18-486c-96f7-a36997063110",
      "origin": {
        "_id": "66d672d288105491d615eea1",
        "country": "Argentina",
        "province": "Buenos Aires",
        "department": "La Plata",
        "locality": "City Bell",
        "format_address": "Calle 480 1234, City Bell, Buenos Aires, Argentina",
        "latitude": "-34.9230",
        "longitude": "-57.9740",
        "place_id": "testorigin2",
        "__v": 0
      },
      "destination": {
        "_id": "66d672d288105491d615eea3",
        "country": "Argentina",
        "province": "CABA",
        "department": "Comuna 3",
        "locality": "Villa del Parque",
        "format_address": "Av. San Martín 3456, Villa del Parque, CABA, Argentina",
        "latitude": "-34.6140",
        "longitude": "-58.4430",
        "place_id": "testdestination2",
        "__v": 0
      },
      "description": "Transporte de mercancías desde City Bell hasta Villa del Parque",
      "allowPackage": true,
      "allowPassenger": true,
      "peopleQuantity": 3,
      "placesAvailable": 3,
      "vehicle": {
        "_id": "66d676615b92ee86af66dbc0",
        "patentPlate": "AE234KL",
        "model": "208",
        "brand": "Peugeot Feline Cuir",
        "year": 2020,
        "pics": [],
        "email": "jcuello673@gmail.com",
        "color": "Negro",
        "__v": 0
      },
      "driver": "jcuello673@gmail.com",
      "startedTimestamp": "2024-09-02T14:00:00Z",
      "status": "OPEN",
      "packages": [],
      "createdTimestamp": "2024-09-03T02:22:10.992Z",
      "passengers": []
    }
  ],
  "status": 200
}

export const exNewVehicle = {
  "patentPlate": "AE234KL",
  "model": "208",
  "brand": "Peugeot Feline Cambiado Cuir",
  "year": 2020,
  "pics": [],
  "email": "jcuello673@gmail.com",
  "color": "Negro"
}

export const exNewVehicleResponse = {
  "hasError": false,
  "message": "Vehicle created successfully.",
  "data": {
    "patentPlate": "AE234K",
    "model": "208",
    "brand": "Peugeot Feline Cambiado Cuir",
    "year": 2020,
    "pics": [],
    "email": "jcuello673@gmail.com",
    "color": "Negro",
    "_id": "66de505c0503795664330d69",
    "__v": 0
  },
  "status": 201
}

export const exMyVehiclesResponse = {
  "hasError": false,
  "message": "User vehicles found.",
  "data": [
    {
      "_id": "66d676615b92ee86af66dbc0",
      "patentPlate": "AE234KL",
      "model": "208",
      "brand": "Peugeot Feline Cuir",
      "year": 2020,
      "pics": [],
      "email": "jcuello673@gmail.com",
      "color": "Negro",
      "__v": 0
    },
    {
      "_id": "66de4b3d71bfdbb278bba27f",
      "patentPlate": "AE234KM",
      "model": "208",
      "brand": "Peugeot Feline Cambiado Cuir",
      "year": 2020,
      "pics": [],
      "email": "jcuello673@gmail.com",
      "color": "Negro",
      "__v": 0
    },
    {
      "_id": "66de505c0503795664330d69",
      "patentPlate": "AE234K",
      "model": "208",
      "brand": "Peugeot Feline Cambiado Cuir",
      "year": 2020,
      "pics": [],
      "email": "jcuello673@gmail.com",
      "color": "Negro",
      "__v": 0
    }
  ],
  "status": 200
}

export const exFindVehicleByPatent = {
  "hasError": false,
  "message": "Vehicle founded.",
  "data": {
    "_id": "66de505c0503795664330d69",
    "patentPlate": "AE234K",
    "model": "208",
    "brand": "Peugeot Feline Cambiado Cuir",
    "year": 2020,
    "pics": [],
    "email": "jcuello673@gmail.com",
    "color": "Negro",
    "__v": 0
  },
  "status": 200
}

export const exUpdateVehicle = {
  "model": "208",
  "brand": "Pe 3 Cuir",
  "year": 2020,
  "pics": [],
  "email": "jcuello673@gmail.com",
  "color": "Negro"
}

export const exUpdateVehicleResponse = {
  "hasError": false,
  "message": "Vehicle updated.",
  "data": {
    "_id": "66de505c0503795664330d69",
    "patentPlate": "AE234K",
    "model": "208",
    "brand": "Pe 3 Cuir",
    "year": 2020,
    "pics": [],
    "email": "jcuello673@gmail.com",
    "color": "Negro",
    "__v": 0
  },
  "status": 200
}

export const exDeleteVehicleResponse = {
  "hasError": false,
  "message": "Vehicle deleted.",
  "status": 200
}

export const exListMyPassengerTrips = {
  "hasError": false,
  "message": "Trips where you are a passenger found successfully.",
  "data": [
    {
      "id": "2f54f6fc-0a29-597d-07g8-b47008174221",
      "origin": {
        "_id": "66d672d288105491d615eea1",
        "country": "Argentina",
        "province": "Buenos Aires",
        "department": "La Plata",
        "locality": "City Bell",
        "format_address": "Calle 480 1234, City Bell, Buenos Aires, Argentina",
        "latitude": "-34.9230",
        "longitude": "-57.9740",
        "place_id": "testorigin2",
        "__v": 0
      },
      "destination": {
        "_id": "66d672d288105491d615eea3",
        "country": "Argentina",
        "province": "CABA",
        "department": "Comuna 3",
        "locality": "Villa del Parque",
        "format_address": "Av. San Martín 3456, Villa del Parque, CABA, Argentina",
        "latitude": "-34.6140",
        "longitude": "-58.4430",
        "place_id": "testdestination2",
        "__v": 0
      },
      "description": "Viaje compartido desde City Bell hasta Villa del Parque",
      "allowPackage": false,
      "allowPassenger": true,
      "peopleQuantity": 4,
      "placesAvailable": 1,
      "vehicle": {
        "_id": "66d676615b92ee86af66dbc0",
        "patentPlate": "AB123CD",
        "model": "Gol",
        "brand": "Volkswagen",
        "year": 2019,
        "pics": [],
        "email": "conductor@ejemplo.com",
        "color": "Blanco",
        "__v": 0
      },
      "driver": "conductor@ejemplo.com",
      "startedTimestamp": "2024-09-05T10:00:00Z",
      "status": "IN_PROGRESS",
      "packages": [],
      "createdTimestamp": "2024-09-01T15:30:00.000Z",
      "bookings": [
        {
          "_id": "66d672d288105491d615eea6",
          "email": "pasajero@ejemplo.com",
          "tripId": "2f54f6fc-0a29-597d-07g8-b47008174221",
          "description": "Viaje de trabajo",
          "hasEquipment": false,
          "hasPartner": false,
          "totalPassenger": 1,
          "createdTimestamp": "2024-09-01T16:00:00.000Z",
          "status": "ACCEPTED"
        }
      ]
    }
  ],
  "status": 200
}

export const exNewRequest = {
  tripId: '1e43e5eb-9d18-486c-96f7-a36997063110',
  description: 'Me gustaría unirme al viaje con mi valija',
  hasEquipment: true,
  hasPartner: true,
  partnerQuantity: 1
};

export const exNewRequestResponse = {
  hasError: false,
  message: 'Request sent successfully',
  data: {
    _id: '66e1234567890abcdef12345',
    email: 'usuario@ejemplo.com',
    tripId: '1e43e5eb-9d18-486c-96f7-a36997063110',
    description: 'Me gustaría unirme al viaje con mi valija',
    hasEquipment: true,
    hasPartner: true,
    partnerQuantity: 1,
    totalPassenger: 2,
    createdTimestamp: '2024-09-10T12:00:00.000Z',
    status: 'ON_HOLD',
    __v: 0
  },
  status: 201
};

export const exListMyRequests = {
  hasError: false,
  message: 'Requests found successfully',
  data: [
    {
      _id: '66e1234567890abcdef12345',
      email: 'usuario@ejemplo.com',
      tripId: '1e43e5eb-9d18-486c-96f7-a36997063110',
      description: 'Me gustaría unirme al viaje con mi valija',
      hasEquipment: true,
      hasPartner: true,
      partnerQuantity: 1,
      totalPassenger: 2,
      createdTimestamp: '2024-09-10T12:00:00.000Z',
      status: 'ON_HOLD',
      trip: {
        id: '1e43e5eb-9d18-486c-96f7-a36997063110',
        origin: '66d672d288105491d615eea1',
        destination: '66d672d288105491d615eea3',
        description: 'Transporte de mercancías desde City Bell hasta Villa del Parque',
        allowPackage: true,
        allowPassenger: true,
        peopleQuantity: 3,
        placesAvailable: 3,
        vehicle: '63614cd9207a33961a281f40',
        driver: 'jcuello673@gmail.com',
        startedTimestamp: '2024-09-02T14:00:00Z',
        status: 'OPEN',
        packages: [],
        createdTimestamp: '2024-09-03T02:22:10.992Z',
        _id: '66d672d288105491d615eea5',
        __v: 0
      }
    }
  ],
  status: 200
};

export const exListMyRequestsEmpty = {
  hasError: false,
  message: 'No requests found',
  data: null,
  status: 404
};

// Trip Action Examples
export const exCancelTripResponse = {
  hasError: false,
  message: 'Trip cancelled successfully.',
  data: {
    id: '1e43e5eb-9d18-486c-96f7-a36997063110',
    status: 'CANCELLED'
  },
  status: 200
};

export const exInitTripResponse = {
  hasError: false,
  message: 'Trip started successfully.',
  data: {
    id: '1e43e5eb-9d18-486c-96f7-a36997063110',
    status: 'IN_PROGRESS'
  },
  status: 200
};

export const exFinishTripResponse = {
  hasError: false,
  message: 'Trip finished successfully.',
  data: {
    id: '1e43e5eb-9d18-486c-96f7-a36997063110',
    status: 'FINISHED'
  },
  status: 200
};

export const exTripNotFoundResponse = {
  hasError: true,
  message: 'Trip not found.',
  status: 404
};

export const exUnauthorizedTripResponse = {
  hasError: true,
  message: 'You are not authorized to perform this action.',
  status: 401
};

// Request Action Examples
export const exAcceptRequestResponse = {
  hasError: false,
  message: 'Request accepted successfully.',
  data: {
    _id: '66e1234567890abcdef12345',
    status: 'ACCEPTED'
  },
  status: 200
};

export const exRejectRequestResponse = {
  hasError: false,
  message: 'Request rejected successfully.',
  data: {
    _id: '66e1234567890abcdef12345',
    status: 'REJECTED'
  },
  status: 200
};

export const exCancelRequestResponse = {
  hasError: false,
  message: 'Request cancelled successfully.',
  data: {
    _id: '66e1234567890abcdef12345',
    status: 'CANCELLED'
  },
  status: 200
};

export const exRequestNotFoundResponse = {
  hasError: true,
  message: 'Request not found.',
  status: 404
};

export const exReceivedRequestsResponse = {
  hasError: false,
  message: 'Requests received for your trips.',
  data: [
    {
      tripId: '1e43e5eb-9d18-486c-96f7-a36997063110',
      tripDescription: 'Transporte de mercancías desde City Bell hasta Villa del Parque',
      requests: [
        {
          _id: '66e1234567890abcdef12345',
          email: 'pasajero@ejemplo.com',
          description: 'Me gustaría unirme al viaje',
          hasEquipment: false,
          hasPartner: false,
          totalPassenger: 1,
          status: 'ON_HOLD',
          createdTimestamp: '2024-09-10T12:00:00.000Z',
          passengerName: 'Juan Pérez'
        }
      ]
    }
  ],
  status: 200
};

export const exNoReceivedRequestsResponse = {
  hasError: false,
  message: 'No requests received for your trips.',
  data: [],
  status: 200
};

// Auth Examples
export const exResentVerificationCode = {
  email: 'usuario@ejemplo.com'
};

export const exResentVerificationCodeResponse = {
  hasError: false,
  message: 'Verification code sent successfully.',
  data: { email: 'usuario@ejemplo.com' },
  status: 200
};

// Valuation Examples
export const exNewValuation = {
  tripId: '1e43e5eb-9d18-486c-96f7-a36997063110',
  rating: 5,
  comment: 'Excelente conductor, muy puntual y amable.',
  valuatedUserEmail: 'conductor@ejemplo.com'
};

export const exNewValuationResponse = {
  hasError: false,
  message: 'Valuation created successfully.',
  data: {
    _id: '66e1234567890abcdef99999',
    tripId: '1e43e5eb-9d18-486c-96f7-a36997063110',
    rating: 5,
    comment: 'Excelente conductor, muy puntual y amable.',
    valuatedUserEmail: 'conductor@ejemplo.com',
    valuatorEmail: 'pasajero@ejemplo.com',
    createdTimestamp: '2024-09-10T14:00:00.000Z'
  },
  status: 201
};