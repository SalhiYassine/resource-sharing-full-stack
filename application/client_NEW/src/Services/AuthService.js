import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

export default {
  login: (username, password) => {
    return axios
      .post(API_URL + "login", {
        username,
        password,
      })
      .then((response) => {
        if (response.data.token) {
          return response;
        }
        return null;
      });
  },

  logout: () => {
    localStorage.removeItem("userDetails");
    localStorage.removeItem("token");
  },

  register: (username, email, password) => {
    return axios
      .post(API_URL + "signup", {
        username,
        email,
        password,
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("userDetails"));
  },
};
