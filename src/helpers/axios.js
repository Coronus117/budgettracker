import axios from "axios";

const httpBasePath = "https://budget-2bc52-default-rtdb.firebaseio.com/";
const httpClient = axios.create({
  baseURL: httpBasePath,
});

const fetcher = async (uri, ...args) =>
  httpClient.get(uri, { ...args }).then((res) => res.data);

export { httpClient, fetcher, httpBasePath };
