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

export const exCreateRequestResponse = {
  hasError: false,
  message: 'PasswordToken generated.',
  data: {  },
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
    hasError: false,
    message: "PasswordToken generated.",
    status: 200,
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

