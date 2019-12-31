import axios, { AxiosResponse } from "axios";
import { IActivity } from "../modules/activities";

axios.defaults.baseURL = "http://localhost:5000/api";

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms : number) => (response : AxiosResponse) => 
    new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

const requests = {
  get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
  delete: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody)
}


const ActivitiesRequests = {
    list : () : Promise<IActivity[]> => requests.get('/activities'),
    details: (id : string) : Promise<IActivity> => requests.get(`/activities/${id}`),
    create: (a: IActivity) => requests.post('/activities', a),
    update: (a: IActivity) => requests.put(`/activities/${a.id}`, a),
    delete: (id : string)  => requests.delete(`/activities/${id}`)
}

export default {
    ActivitiesRequests
}