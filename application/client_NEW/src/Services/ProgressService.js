import axios from "axios";
import authHeader from "./authHeader";
import postHeaders from "./postHeader";
const API_URL = "http://localhost:8080/api/progress/";

export default {
  //Post a resource
  addAssessment: (assessment) => {
    console.log(assessment);
    return axios
      .post(API_URL + `createAssessment`, assessment, {
        headers: authHeader(),
      })
      .then((assessmentResponse) => {
        return assessmentResponse.data;
      });
  },

  getAllAssessments: () => {
    return axios
      .get(API_URL + "getAll", {
        headers: authHeader(),
      })
      .then((response) => {
        return { data: response.data, error: false };
      })
      .catch((error) => {
        return { data: error.response.data, error: true };
      });
  },
};
