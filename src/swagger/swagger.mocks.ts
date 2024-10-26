export const exCreateValuationRequest = {
  tripId: "66d67cbdd6d5aa8b1baa2fcd",
  puntaje: 5,
  detalle: "Excelente viaje, muy cómodo y seguro."
};

export const exCreateValuationResponse = {
  hasError: false,
  message: 'Valuation created successfully.',
  data: {
    id: "66d67cbdd6d5aa8b1baa2fcd",
    email: "admin@gmail.com",
    tripId: "66d67cbdd6d5aa8b1baa2fcd",
    puntaje: 5,
    detalle: "Excelente viaje, muy cómodo y seguro.",
    createdAt: "2024-09-02T14:00:00Z",
    updatedAt: "2024-09-02T14:00:00Z"
  },
  status: 201
};

export const exFindAllValuationsResponse = {
  hasError: false,
  message: 'Successfully found valuations',
  data: [
    {
      id: "66d67cbdd6d5aa8b1baa2fcd",
      email: "admin@gmail.com",
      tripId: "66d67cbdd6d5aa8b1baa2fcd",
      puntaje: 5,
      detalle: "Excelente viaje, muy cómodo y seguro.",
      createdAt: "2024-09-02T14:00:00Z",
      updatedAt: "2024-09-02T14:00:00Z"
    },
    {
      id: "66d67cbdd6d5aa8b1baa2fce",
      email: "user@example.com",
      tripId: "66d67cbdd6d5aa8b1baa2fce",
      puntaje: 4,
      detalle: "Buen viaje, pero podría mejorar.",
      createdAt: "2024-09-03T14:00:00Z",
      updatedAt: "2024-09-03T14:00:00Z"
    }
  ],
  status: 200
};

export const exFindOneValuationResponse = {
  hasError: false,
  message: 'Valuation Successfully founded',
  data: {
    id: "66d67cbdd6d5aa8b1baa2fcd",
    email: "admin@gmail.com",
    tripId: "66d67cbdd6d5aa8b1baa2fcd",
    puntaje: 5,
    detalle: "Excelente viaje, muy cómodo y seguro.",
    createdAt: "2024-09-02T14:00:00Z",
    updatedAt: "2024-09-02T14:00:00Z"
  },
  status: 200
};

export const exUpdateValuationRequest = {
  id: "66d67cbdd6d5aa8b1baa2fcd",
  tripId: "66d67cbdd6d5aa8b1baa2fcd",
  puntaje: 4,
  detalle: "Actualización: Buen viaje, pero podría mejorar."
};

export const exUpdateValuationResponse = {
  hasError: false,
  message: 'The valuation of the trip was updated',
  data: {
    id: "66d67cbdd6d5aa8b1baa2fcd",
    email: "admin@gmail.com",
    tripId: "66d67cbdd6d5aa8b1baa2fcd",
    puntaje: 4,
    detalle: "Actualización: Buen viaje, pero podría mejorar.",
    createdAt: "2024-09-02T14:00:00Z",
    updatedAt: "2024-09-02T14:00:00Z"
  },
  status: 200
};

export const exDeleteValuationResponse = {
  hasError: false,
  message: 'The valuation of the trip was deleted',
  data: {
    id: "66d67cbdd6d5aa8b1baa2fcd",
    email: "admin@gmail.com",
    tripId: "66d67cbdd6d5aa8b1baa2fcd",
    puntaje: 5,
    detalle: "Excelente viaje, muy cómodo y seguro.",
    createdAt: "2024-09-02T14:00:00Z",
    updatedAt: "2024-09-02T14:00:00Z"
  },
  status: 200
};

export const  exPasswordToken = {
  passwordToken: "Gonzales",
  email: "admin@gmail.com",
}

export const exSendRequest = {

  tripId: "66d67cbdd6d5aa8b1baa2fcd",

  description: "Hola pa soy re picante si no me aceptas la soli muere tu perro",
  hasEquipment: true,
  hasPartner: true, 
  partnerQuantity: 2,
}

export const getRequest = {
  tripId: "66d67cbdd6d5aa8b1baa2fcd",
  requestId: "66d67cb4544ereb1baa2fcd"
}

export const exRequestFindedResponse = {
  hasError: false,
  message: 'Request founded.',
  data: {
    userId: "66d67cbdd6d5aa8b1baa2fcd",
    email: "maria@gmail.com",
    tripId: "66d67cbdd6d5aa8b1baa2fcd",
    description: "Hola pa soy maria de noche mario de día.",
    hasEquipment: true,
    hasPartner: true,
    partnerQuantity: 2,
    totalPassenger: 3,
    createdTimestamp: "2024-09-02T14:00:00Z", 
    status: "CREATED"
  }
}

export const exRequestsdFindedResponse = {
  hasError: false,
  message: 'Requests founded.',
  data: [
    {
      userId: "66d67cbdd6d5aa8b1baa2fcd",
      email: "maria@gmail.com",
      tripId: "66d67cbdd6d5aa8b1baa2fcd",
      description: "Hola pa soy maria de noche mario de día.",
      hasEquipment: true,
      hasPartner: true,
      partnerQuantity: 2,
      totalPassenger: 3,
      createdTimestamp: "2024-09-02T14:00:00Z", 
      status: "CREATED"
    },
    {
      userId: "66d67cbdd6d5aa8b1baa2fcd",
      email: "juan@gmail.com",
      tripId: "66d67cbdd6d5aa8b1baa2fcd",
      description: "Hola pa soy juan de día y juan de noche.",
      hasEquipment: false,
      hasPartner: false,
      partnerQuantity: 0,
      totalPassenger: 1,
      createdTimestamp: "2024-09-03T14:00:00Z",
      status: "CREATED"
    },
    {
      userId: "66d67cbdd6d5aa8b1baa2fcd",
      email: "pedro@gmail.com",
      tripId: "66d67cbdd6d5aa8b1baa2fcd",
      description: "Hola pa soy pedro, siempre pedro.",
      hasEquipment: true,
      hasPartner: true,
      partnerQuantity: 1,
      totalPassenger: 2,
      createdTimestamp: "2024-09-04T14:00:00Z",
      status: "CREATED"
    }
  ]
}


export const exAcceptRequest = {
  description: "Acepto la solicitud", 
  tripId: "1e43e5eb-9d18-486c-96f7-a36997063110",
  requestId: "1e43e5eb-9d18-486c-96f7-a36997063110"
}

export const exRejectRequest = {
  description: "Rechazo la solicitud", 
  tripId: "1e43e5eb-9d18-486c-96f7-a36997063110",
  requestId: "1e43e5eb-9d18-486c-96f7-a36997063110"
}

export const exCancelRequest = {
  description: "Cancelo la solicitud",
  tripId: "1e43e5eb-9d18-486c-96f7-a36997063110",
  requestId: "1e43e5eb-9d18-486c-96f7-a36997063110"
}

export const exCreateRequestResponse = {
  hasError: false,
  message: 'Request was sended succesfully',
  data: {  },
  status: 200
}

export const exRejectRequestResponse = {
  hasError: false,
  message: 'Request was rejected succesfully',
  data: {  },
  status: 200
}

export const exAcceptRequestResponse = {
  hasError: false,
  message: 'Request was acepted succesfully',
  data: {  },
  status: 200
}

export const exCancelRequestResponse = {
  hasError: false,
  message: 'Request was canceled succesfully',
  data: {  },
  status: 200
}

export const exChangePasswordResponseOK= {
  hasError: false,
  message: 'Password changed succesfully',
  data: {  },
  status: 200
}

export const exChangePasswordResponseBad = {
  hasError: true,
  message: 'The password was wrong',
  data: {  },
  status: 400
}

export const exChangePasswordResponseNotFound = {
  hasError: true,
  message: 'The user not exist',
  data: {  },
  status: 400
}


export const exFindRequestResponse = {
  hasError: false,
  message: 'Request was finded succesfully',
  data: {  
    userId: "66d67cbdd6d5aa8b1baa2fcd",
    email: "admin@gmail.com",
    tripId: "1e43e5eb-9d18-486c-96f7-a36997063110",
    _id: "1e43e5eb-9d18-486c-96f7-a36997063110",
    description: "Hola pa soy maria de noche mario de día.",
    hasEquipment: true,
    hasPartner: true,
    partnerQuantity: 2,
    totalPassenger: 3,
    createdTimestamp: "2024-09-02T14:00:00Z",
    status: "CREATED",
    __v: 0


  },
  status: 200
}

export const exRequestResetPassword = {
  email: "admin@gmail.com",
}


export const exResetPassword = {
  password: "admin@1234",
  email: "admin@gmail.com",
}

export const UserValidatedDTO = {
  id: "66d67cbdd6d5aa8b1baa2fcd",	
  validated: true,
  email: "admin@gmail.com"
}

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
  hasError: false,
  message: "PasswordToken generated.",
  status: 200,
  data: {
    id: "66d67e6160770470da9afe84",
    name: "Maria",
    lastname: "Gonzales",
    email: "admin123@gmail.com"
  }
}

export const exValidate = {
  hasError: false,
  message: "PasswordToken generated.",
  data: {email:"admin@gmail.com"},
  status: 200
}

export const exValidatePasswordToken = {
  hasError: false,
  message: "PasswordToken validated.",
  data: {email:"admin@gmail.com"},
  status: 200
}

export const exValidateTokenResponse = {
    hasError: false,
    message: 'Validation was succesfully.',
    data: true,
    status: 200
}

export const exRequestResetPasswordResponse = {
  hasError: false,
  message: 'PasswordToken generated.',
  data: { email: "admin@gmail.com"},
  status: 200
}

export const exValidatePasswordTokenResponse = {
  hasError: false,
  message: 'Token validated reseted.',
  data: {
    email: "admin@gmail.com",
    id: "66d67cbdd6d5aa8b1baa2fcd",
    validated: true
  },
  status: 200
}

export const exLogin = {
    email: 'maria@gmail.com',
    password: 'admin123'
  }

export const exLoginResponse = {
    token : "example"
  }

export const exUserData = {
    name : 'nameOfUser',
    lastname: 'lastnameOfUser',
    email: 'emailofUser@gmail.com'
  }

export const exNewTrip = 
{
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
  
    hasError: false,
    message: "PasswordToken generated.",
    status: 200,
    data: 
{
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
  }
  
export const exListOfTripsResponse = 
{
  "hasError": false,
  "message": "Trips founded.",
  "data": [
    {
      "id": "1e43e5eb-9d18-486c-96f7-a36997063110",
      "origin": {
        "_id": "66d672d288105491d615eea1",
        "country": "Argentina",
        "province": "Buenos Aires",
        "departament": "La Plata",
        "locality": "City Bell",
        "format_address": "Calle 480 1234, City Bell, Buenos Aires, Argentina",
        "latitud": "-34.9230",
        "longitud": "-57.9740",
        "place_id": "testorigin2",
        "__v": 0
      },
      "destination": {
        "_id": "66d672d288105491d615eea3",
        "country": "Argentina",
        "province": "CABA",
        "departament": "Comuna 3",
        "locality": "Villa del Parque",
        "format_address": "Av. San Martín 3456, Villa del Parque, CABA, Argentina",
        "latitud": "-34.6140",
        "longitud": "-58.4430",
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
        "brand": "Pe 3 Cuir",
        "age": 2020,
        "pics": [],
        "email": "jcuello673@gmail.com",
        "color": "Negro",
        "__v": 0,
        "year": 2020
      },
      "driver": {
        "_id": "66d9016900bb5bfac63c0dc9",
        "lastname": "Cuello",
        "name": "Juan Cruz",
        "email": "jcuello673@gmail.com",
        "password": "$2b$12$OnHNBRT0I7RWM4PBs6DVOOxa6vx78A28Yji4RtcqRP8oSulavl18S",
        "status": "VALIDATED",
        "verificationCode": "7394",
        "__v": 0,
        "resetPasswordToken": {
          "code": "06NLZ",
          "created": "2024-10-08T21:53:07.972Z",
          "expire": "2024-10-08T23:53:07.972Z",
          "validated": false,
          "_id": "6705a9c325f307c9c574691b"
        }
      },
      "startedTimestamp": "2024-09-02T14:00:00Z",
      "packages": [],
      "createdTimestamp": "2024-09-03T02:22:10.992Z",
      "passengers": [
        "66d67cbdd6d5aa8b1baa2fcd"
      ]
    },
    {
      "id": "cb9e02e7-a847-436f-bf39-2861aec24f88",
      "origin": {
        "_id": "66d8fe607bb32f821c815edb",
        "country": "Argentina",
        "province": "Córdoba",
        "departament": "Capital",
        "locality": "Nueva Córdoba",
        "format_address": "Av. Hipólito Yrigoyen 123, Nueva Córdoba, Córdoba, Argentina",
        "latitud": "-31.4245",
        "longitud": "-64.1830",
        "place_id": "testorigin3",
        "__v": 0
      },
      "destination": {
        "_id": "66d8fe607bb32f821c815edd",
        "country": "Argentina",
        "province": "Santa Fe",
        "departament": "Rosario",
        "locality": "Centro",
        "format_address": "Bv. Oroño 789, Centro, Rosario, Santa Fe, Argentina",
        "latitud": "-32.9468",
        "longitud": "-60.6393",
        "place_id": "testdestination3",
        "__v": 0
      },
      "description": "Transporte de pasajeros desde Nueva Córdoba hasta el Centro de Rosario",
      "allowPackage": false,
      "allowPassenger": true,
      "peopleQuantity": 4,
      "placesAvailable": 4,
      "vehicle": null,
      "startedTimestamp": "2024-09-05T09:30:00Z",
      "packages": [],
      "createdTimestamp": "2024-09-05T00:42:09.146Z"
    },
    {
      "id": "c39f14b6-54a9-46fd-b518-8dc57f5478c4",
      "origin": {
        "_id": "66d9029a00bb5bfac63c0dd4",
        "country": "Argentina",
        "province": "Mendoza",
        "departament": "Luján de Cuyo",
        "locality": "Chacras de Coria",
        "format_address": "Ruta Panamericana 2000, Chacras de Coria, Mendoza, Argentina",
        "latitud": "-32.9775",
        "longitud": "-68.8914",
        "place_id": "testorigin4",
        "__v": 0
      },
      "destination": {
        "_id": "66d9029a00bb5bfac63c0dd6",
        "country": "Argentina",
        "province": "San Juan",
        "departament": "Capital",
        "locality": "Desamparados",
        "format_address": "Av. Libertador 4567, Desamparados, Capital, San Juan, Argentina",
        "latitud": "-31.5235",
        "longitud": "-68.5386",
        "place_id": "testdestination4",
        "__v": 0
      },
      "description": "Transporte de mercancías desde Chacras de Coria hasta Desamparados",
      "allowPackage": true,
      "allowPassenger": false,
      "peopleQuantity": 0,
      "placesAvailable": 0,
      "vehicle": null,
      "driver": {
        "_id": "66d9016900bb5bfac63c0dc9",
        "lastname": "Cuello",
        "name": "Juan Cruz",
        "email": "jcuello673@gmail.com",
        "password": "$2b$12$OnHNBRT0I7RWM4PBs6DVOOxa6vx78A28Yji4RtcqRP8oSulavl18S",
        "status": "VALIDATED",
        "verificationCode": "7394",
        "__v": 0,
        "resetPasswordToken": {
          "code": "06NLZ",
          "created": "2024-10-08T21:53:07.972Z",
          "expire": "2024-10-08T23:53:07.972Z",
          "validated": false,
          "_id": "6705a9c325f307c9c574691b"
        }
      },
      "startedTimestamp": "2024-09-10T08:00:00Z",
      "packages": [],
      "createdTimestamp": "2024-09-05T01:00:10.680Z"
    },
    {
      "id": "95d3b384-ab32-4215-a0e1-a386e40a429e",
      "origin": {
        "_id": "66fdafb6a4a9711ada3eff02",
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
        "_id": "66fdafb6a4a9711ada3eff04",
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
      "vehicle": null,
      "driver": {
        "_id": "66d9016900bb5bfac63c0dc9",
        "lastname": "Cuello",
        "name": "Juan Cruz",
        "email": "jcuello673@gmail.com",
        "password": "$2b$12$OnHNBRT0I7RWM4PBs6DVOOxa6vx78A28Yji4RtcqRP8oSulavl18S",
        "status": "VALIDATED",
        "verificationCode": "7394",
        "__v": 0,
        "resetPasswordToken": {
          "code": "06NLZ",
          "created": "2024-10-08T21:53:07.972Z",
          "expire": "2024-10-08T23:53:07.972Z",
          "validated": false,
          "_id": "6705a9c325f307c9c574691b"
        }
      },
      "startedTimestamp": "2024-09-02T14:00:00Z",
      "packages": [],
      "createdTimestamp": "2024-10-02T20:40:22.895Z"
    },
    {
      "id": "7943a8b0-fe73-496b-825f-f47413432cfc",
      "origin": {
        "_id": "66fdb099a4a9711ada3eff09",
        "country": "Argentina",
        "province": "Buenos Aires",
        "department": "La Plata",
        "locality": "City Bell",
        "format_address": "Bosques de palermo, Lo de kiko, Buenos Aires, Argentina",
        "latitude": "-34.9230",
        "longitude": "-57.9740",
        "place_id": "testorigin2",
        "__v": 0
      },
      "destination": {
        "_id": "66fdb099a4a9711ada3eff0b",
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
        "brand": "Pe 3 Cuir",
        "age": 2020,
        "pics": [],
        "email": "jcuello673@gmail.com",
        "color": "Negro",
        "__v": 0,
        "year": 2020
      },
      "driver": {
        "_id": "66d9016900bb5bfac63c0dc9",
        "lastname": "Cuello",
        "name": "Juan Cruz",
        "email": "jcuello673@gmail.com",
        "password": "$2b$12$OnHNBRT0I7RWM4PBs6DVOOxa6vx78A28Yji4RtcqRP8oSulavl18S",
        "status": "VALIDATED",
        "verificationCode": "7394",
        "__v": 0,
        "resetPasswordToken": {
          "code": "06NLZ",
          "created": "2024-10-08T21:53:07.972Z",
          "expire": "2024-10-08T23:53:07.972Z",
          "validated": false,
          "_id": "6705a9c325f307c9c574691b"
        }
      },
      "startedTimestamp": "2024-09-02T14:00:00Z",
      "packages": [],
      "createdTimestamp": "2024-10-02T20:44:09.823Z"
    },
    {
      "id": "7a48eac2-61e7-4bc0-b2e5-ca5b04c87a6a",
      "origin": {
        "_id": "6705b52e421200c73fbeb7d5",
        "country": "Argentina",
        "province": "Córdoba",
        "department": "Córdoba",
        "locality": "Nueva Córdoba",
        "format_address": "Av. Velez Sarfield, Córdoba, Córdoba, Argentina",
        "latitude": "-31.4503828",
        "longitude": "-64.202499",
        "place_id": "testorigin2",
        "__v": 0
      },
      "destination": {
        "_id": "6705b52e421200c73fbeb7d7",
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
      "vehicle": null,
      "driver": {
        "_id": "66d9016900bb5bfac63c0dc9",
        "lastname": "Cuello",
        "name": "Juan Cruz",
        "email": "jcuello673@gmail.com",
        "password": "$2b$12$OnHNBRT0I7RWM4PBs6DVOOxa6vx78A28Yji4RtcqRP8oSulavl18S",
        "status": "VALIDATED",
        "verificationCode": "7394",
        "__v": 0,
        "resetPasswordToken": {
          "code": "06NLZ",
          "created": "2024-10-08T21:53:07.972Z",
          "expire": "2024-10-08T23:53:07.972Z",
          "validated": false,
          "_id": "6705a9c325f307c9c574691b"
        }
      },
      "startedTimestamp": "2024-09-02T14:00:00Z",
      "packages": [],
      "createdTimestamp": "2024-10-08T22:41:50.613Z"
    },
    {
      "id": "5d01ca4a-0559-4222-9520-9dcd3e1004db",
      "origin": {
        "_id": "6705b77bcd31ea171eb3c7ad",
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
        "_id": "6705b77bcd31ea171eb3c7af",
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
      "vehicle": null,
      "driver": {
        "_id": "67005b7cbb7c42a9fd784e1d",
        "lastname": "Odetti",
        "name": "Agustin",
        "email": "agustinodetti@gmail.com",
        "password": "$2b$12$7BYEMYe4Q3shEsdYjDa6Ce5NDp6KBnM.QNN.ZmQu1wi4OrMt6ckjy",
        "status": "VALIDATED",
        "verificationCode": "5967",
        "__v": 0
      },
      "startedTimestamp": "2024-09-02T14:00:00Z",
      "packages": [],
      "createdTimestamp": "2024-10-08T22:51:39.664Z"
    },
    {
      "id": "cad67a52-d2f4-4f37-b092-7626f3531dd3",
      "origin": {
        "_id": "6705b825cd31ea171eb3c808",
        "country": "Argentina",
        "province": "Tucumán",
        "department": "Yerba Buena",
        "locality": "Yerba Buena",
        "format_address": "Yerba Buena, Tucumán, Argentina",
        "latitude": "-26.8119881",
        "longitude": "-65.30135290000001",
        "place_id": "ChIJ-7_hLjpDIpQRsZgN7j4I1MU",
        "__v": 0
      },
      "destination": {
        "_id": "6705b825cd31ea171eb3c80a",
        "country": "Argentina",
        "province": "Tierra del Fuego",
        "department": "Ushuaia",
        "locality": "Ushuaia",
        "format_address": "V9410 Ushuaia, Tierra del Fuego, Argentina",
        "latitude": "-54.8019121",
        "longitude": "-68.3029511",
        "place_id": "ChIJvwnRurUiTLwR_OtDuj1HmFQ",
        "__v": 0
      },
      "description": "Dndhd",
      "allowPackage": false,
      "allowPassenger": true,
      "peopleQuantity": 4,
      "placesAvailable": 4,
      "vehicle": {
        "_id": "66d676615b92ee86af66dbc0",
        "patentPlate": "AE234KL",
        "model": "208",
        "brand": "Pe 3 Cuir",
        "age": 2020,
        "pics": [],
        "email": "jcuello673@gmail.com",
        "color": "Negro",
        "__v": 0,
        "year": 2020
      },
      "driver": {
        "_id": "66d9016900bb5bfac63c0dc9",
        "lastname": "Cuello",
        "name": "Juan Cruz",
        "email": "jcuello673@gmail.com",
        "password": "$2b$12$OnHNBRT0I7RWM4PBs6DVOOxa6vx78A28Yji4RtcqRP8oSulavl18S",
        "status": "VALIDATED",
        "verificationCode": "7394",
        "__v": 0,
        "resetPasswordToken": {
          "code": "06NLZ",
          "created": "2024-10-08T21:53:07.972Z",
          "expire": "2024-10-08T23:53:07.972Z",
          "validated": false,
          "_id": "6705a9c325f307c9c574691b"
        }
      },
      "startedTimestamp": "18-10-2024 19:53",
      "packages": [],
      "createdTimestamp": "2024-10-08T22:54:29.028Z"
    },
    {
      "id": "58faf958-e40e-4bd6-b7cd-753b878ac1b0",
      "origin": {
        "_id": "6705b96acd31ea171eb3c82d",
        "country": "Argentina",
        "province": "Río Negro",
        "department": "General Roca",
        "locality": "General Roca",
        "format_address": "R8332 Gral. Roca, Río Negro, Argentina",
        "latitude": "-39.032803",
        "longitude": "-67.5892227",
        "place_id": "ChIJWz9RQOIcCpYRUOsHthvorgk",
        "__v": 0
      },
      "destination": {
        "_id": "6705b96acd31ea171eb3c82f",
        "country": "Argentina",
        "province": "San Juan",
        "department": "Capital",
        "locality": "San Juan",
        "format_address": "San Juan, Argentina",
        "latitude": "-31.5351074",
        "longitude": "-68.5385941",
        "place_id": "ChIJl9Q8oylAgZYRs_w8I6Cj878",
        "__v": 0
      },
      "description": "leo messi ",
      "allowPackage": false,
      "allowPassenger": true,
      "peopleQuantity": 2,
      "placesAvailable": 2,
      "vehicle": null,
      "driver": {
        "_id": "67005b7cbb7c42a9fd784e1d",
        "lastname": "Odetti",
        "name": "Agustin",
        "email": "agustinodetti@gmail.com",
        "password": "$2b$12$7BYEMYe4Q3shEsdYjDa6Ce5NDp6KBnM.QNN.ZmQu1wi4OrMt6ckjy",
        "status": "VALIDATED",
        "verificationCode": "5967",
        "__v": 0
      },
      "startedTimestamp": "17-10-2024 19:26",
      "packages": [],
      "createdTimestamp": "2024-10-08T22:59:54.366Z"
    },
    {
      "id": "739d002a-0ce1-41cb-ad42-33603ddad8dd",
      "origin": {
        "_id": "6714448bdd7a5bed69713dc6",
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
        "_id": "6714448cdd7a5bed69713dc8",
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
      "vehicle": null,
      "driver": {
        "_id": "6712a6aaa0ff7ebe7acc044c",
        "lastname": "Casella",
        "name": "Juan",
        "email": "juanmanuelcasella99@gmail.com",
        "password": "$2b$12$gqW7akAwUVx8ElYaTNPl4OMUrHSfeqatNPpurNtqnPlkoc5LEfe/a",
        "status": "VALIDATED",
        "verificationCode": "2229",
        "__v": 0
      },
      "startedTimestamp": "2024-09-02T14:00:00Z",
      "packages": [],
      "createdTimestamp": "2024-10-19T23:45:16.307Z"
    }
  ],
  "status": 200
}

export const exTripByIdResponse = 
  {
    hasError: false,
    message: "PasswordToken generated.",
    status: 200 ,
    data:{
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
  "data": null,
  "status": 404
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
  "data": null,
  "status": 200
}

