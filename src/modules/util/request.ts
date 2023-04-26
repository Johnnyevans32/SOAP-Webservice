import axios, { AxiosRequestConfig, AxiosInstance } from "axios";

export default class RequestService {
  private $axios: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.$axios = axios.create(config);
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const { data } = await this.$axios.request<T>(config);
    return data;
  }
}
