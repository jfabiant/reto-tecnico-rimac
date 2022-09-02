import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";
import { v4 } from "uuid";
import axios from "axios";

const docClient = new AWS.DynamoDB.DocumentClient();
const headers = {
  "content-type": "application/json",
};

const tableName: string = "ProductsTable";

export const helloWorld = async (evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 201,
    body: JSON.stringify({
      hello: "Reto Tecnico Rimac",
    }),
  };
};

export const saveProduct = async (evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { id, name, price } = JSON.parse(evt.body as string);

    let currentDate: Date = new Date();

    let newProduct: any = {
      id: id ? id : v4(),
      name,
      price,
      created_at: currentDate,
    };

    if (id) {
      newProduct["updated_at"] = currentDate;
    }

    await docClient
      .put({
        TableName: tableName,
        Item: newProduct,
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        code: "00",
        details: newProduct,
      }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 501,
      body: JSON.stringify({
        code: "01",
        details: "Error",
      }),
    };
  }
};

export const productList = async (evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const results = await docClient
      .scan({
        TableName: tableName,
      })
      .promise();

    const products = results.Items;

    return {
      statusCode: 201,
      body: JSON.stringify({
        code: "00",
        details: products,
      }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 501,
      body: JSON.stringify({
        code: "01",
        details: "Error",
      }),
    };
  }
};

export const findProduct = async (evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = evt.pathParameters?.id;

    const results = await docClient
      .get({
        TableName: tableName,
        Key: {
          id,
        },
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        code: "00",
        details: results.Item,
      }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 501,
      body: JSON.stringify({
        code: "01",
        details: "Algo salio mal, por favor, comuniquese con soporte",
      }),
    };
  }
};

export const deleteProduct = async (evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = evt.pathParameters?.id;

    await docClient
      .delete({
        TableName: tableName,
        Key: {
          id,
        },
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        code: "00",
        details: "Producto eliminado satisfactoriamente",
      }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 501,
      body: JSON.stringify({
        code: "01",
        details: "Error al eliminar un producto, comuniquese con soporte",
      }),
    };
  }
};

interface IPlanet {
  [key: string]: any;
  name?: string;
  rotation_period?: string;
  orbital_period?: string;
  diameter?: string;
  climate?: string;
  gravity?: string;
  terrain?: string;
  surface_water?: string;
  population?: string;
  residents?: string[];
  films?: string[];
  created?: string;
  edited?: string;
  url?: string;
}

interface IVehicle {
  [key: string]: any;
  name?: string;
  model?: string;
  manufacturer?: string;
  cost_in_credits?: string;
  length?: string;
  max_atmosphering_speed?: string;
  crew?: string;
  passengers?: string;
  cargo_capacity?: string;
  consumables?: string;
  vehicle_class?: string;
  pilots?: string[];
  films?: string[];
  created?: string;
  edited?: string;
  url?: string;
}

const dictNamesTrans = (dictionType: number, key: string): string => {
  const list1: any = {
    name: "nombre",
    rotation_period: "periodo_rotacion",
    orbital_period: "periodo_orbital",
    diameter: "diametro",
    climate: "clima",
    gravity: "gravedad",
    terrain: "terreno",
    surface_water: "superficie_agua",
    population: "poblacion",
    residents: "residentes",
    films: "peliculas",
    created: "creado",
    edited: "editado",
    url: "enlace",
  };
  const list2: any = {
    name: "nombre",
    model: "modelo",
    manufacturer: "fabricante",
    cost_in_credits: "costo",
    length: "longitud",
    max_atmosphering_speed: "velocidad_atmosferica_maxima",
    crew: "tripulacion",
    passengers: "pasajeros",
    cargo_capacity: "capacidad_cargo",
    consumables: "consumibles",
    vehicle_class: "clase_vehiculo",
    pilots: "pilotos",
    films: "peliculas",
    created: "creado",
    edited: "editado",
    url: "enlace",
  };

  if (dictionType == 0) {
    return list1[key];
  } else {
    return list2[key];
  }
};

export const swPlanets = async (evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const response = await axios.get("https://swapi.py4e.com/api/planets");
    const data = await response.data;

    const planets: IPlanet[] = data.results;

    let newArr: IPlanet[] = [];

    for (let i = 0; i < planets.length; i++) {
      let newObj: IPlanet = {};
      Object.keys(planets[i]).map((key) => {
        newObj[dictNamesTrans(0, key)] = planets[i][key];
      });
      newArr.push(newObj);
    }

    return {
      statusCode: 201,
      body: JSON.stringify({
        code: "00",
        details: newArr,
      }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 501,
      body: JSON.stringify({
        code: "01",
        details: "Error",
      }),
    };
  }
};

export const swVehicles = async (evt: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const response = await axios.get("https://swapi.py4e.com/api/vehicles");
    const data = await response.data;

    const vehicles: IVehicle[] = data.results;

    let newArr: IVehicle[] = [];

    for (let i = 0; i < vehicles.length; i++) {
      let newObj: IVehicle = {};
      Object.keys(vehicles[i]).map((key) => {
        newObj[dictNamesTrans(1, key)] = vehicles[i][key];
      });
      newArr.push(newObj);
    }

    return {
      statusCode: 201,
      body: JSON.stringify({
        code: "00",
        details: newArr,
      }),
    };
  } catch (e) {
    return {
      statusCode: 501,
      body: JSON.stringify({
        code: "01",
        details: "Error",
      }),
    };
  }
};
