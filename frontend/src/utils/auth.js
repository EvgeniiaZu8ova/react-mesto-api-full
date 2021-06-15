import { authOptions } from "../utils/utils";

class AuthApi {
  constructor(config) {
    this._baseUrl = config.url;
    this._headers = config.headers;
  }

  _handlePromise(res) {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(new Error(`Ошибка ${res.status}`));
  }

  register(data) {
    return fetch(`${this._baseUrl}/signup`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        password: data.password,
        email: data.email,
      }),
    }).then((res) => this._handlePromise(res));
  }

  login(data) {
    return fetch(`${this._baseUrl}/signin`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        password: data.password,
        email: data.email,
      }),
    }).then((res) => this._handlePromise(res));
  }

  validateToken(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => this._handlePromise(res));
  }
}

// Создание экземпляра класса AuthApi
const auth = new AuthApi(authOptions);

export default auth;
