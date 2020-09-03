import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'
import * as forge from 'node-forge'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import * as qs from 'querystring'
import { signIt } from './requestSigner'
dotenv.config({ path: path.join(__dirname, '../../.env') })

const pkey = fs.readFileSync(path.join(__dirname, `../../${process.env.PRIVATE_KEY_FILENAME}.key`))
const privateKey = forge.pki.privateKeyFromPem(pkey)
const pem = forge.pki.privateKeyToPem(privateKey)
const baseURL = process.env.HOST_URL

export class ApiAxios {
  async get(endpoint: string, query: AxiosRequestConfig): Promise<AxiosResponse> {
    const encodedBody = query.params ? `?${qs.encode(query.params)}` : ''
    const myAxios = getPreparedAxiosApi(endpoint + encodedBody, '')
    return myAxios.get(endpoint, query)
  }
  async post(endpoint: string, body): Promise<AxiosResponse> {
    const encodedBody = qs.encode(body)
    const myAxios = getPreparedAxiosApi(endpoint, encodedBody)
    return myAxios.post(endpoint, encodedBody)
  }
}

function getPreparedAxiosApi(endpoint, body): AxiosInstance {
  const dateNow = new Date()
  const timestamp = dateNow.toISOString().split('.')[0] + 'Z'
  const toBeSigned = `${timestamp}${endpoint}${body}`
  const myAxios = axios.create({
    baseURL,
    headers: {
      'X-API-Key': process.env.API_KEY,
      'X-API-Signature': signIt(pem, toBeSigned),
      'X-API-Timestamp': timestamp,
    },
  })
  return myAxios
}
