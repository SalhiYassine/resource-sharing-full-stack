import axios from "axios";
import authHeader from "./authHeader";
import postHeaders from "./postHeader";
const API_URL = "http://localhost:8080/api/resources/";

export default {
  // Fetch all resources in order to display a summary of each on the resources page
  getAllResources: () => {
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
  getAllBySubject: (subject) => {
    return axios
      .post(
        `http://localhost:8080/api/resources/getAll/Subject`,
        { subject: subject },
        {
          headers: postHeaders(),
        }
      )
      .then((response) => {
        return { data: response.data, error: false };
      })
      .catch((error) => {
        return { data: error.response.data, error: true };
      });
  },

  //Fetch a single post in order to display it on the details page
  getResource: (id) => {
    return axios
      .get(API_URL + `getOne/${id}`, {
        headers: authHeader(),
      })
      .then((response) => {
        return response;
      });
  },

  //  Delete a post using a resourceID, to be used on the resource page through the resource item
  deleteResource: (id) => {
    return axios
      .delete(`/api/resources/deleteOne/${id}`, {
        headers: authHeader(),
      })
      .then((response) => {
        return { data: response.data, error: false };
      })
      .catch((error) => {
        return { data: error.response.data, error: true };
      });
  },

  //Update a post title using a resourceID, to be used on the resource page through the resource item
  updateResourceTitle: (id, newTitle) => {
    return axios
      .patch(
        `/api/resources/updateOne/${id}/title`,
        { title: newTitle },
        {
          headers: postHeaders(),
        }
      )
      .then((response) => {
        return { data: response.data, error: false };
      })
      .catch((error) => {
        return { data: error.response.data, error: true };
      });
  },
  //Update a post description using a resourceID, to be used on the resource page through the resource item
  updateResourceDescription: (id, newDescription) => {
    return axios
      .patch(
        `/api/resources/updateOne/${id}/description`,
        { description: newDescription },
        {
          headers: postHeaders(),
        }
      )
      .then((response) => {
        return { data: response.data, error: false };
      })
      .catch((error) => {
        return { data: error.response.data, error: true };
      });
  },
  //Update a post body using a resourceID, to be used on the resource page through the resource item
  updateResourceBody: (id, newBody) => {
    return axios
      .patch(
        `/api/resources/updateOne/${id}/body`,
        { body: newBody },
        {
          headers: postHeaders(),
        }
      )
      .then((response) => {
        return { data: response.data, error: false };
      })
      .catch((error) => {
        return { data: error.response.data, error: true };
      });
  },
  //Update a post subject using a resourceID, to be used on the resource page through the resource item
  updateResourceSubject: (id, newSubject) => {
    return axios
      .patch(
        `/api/resources/updateOne/${id}/subject`,
        { subject: newSubject },
        {
          headers: postHeaders(),
        }
      )
      .then((response) => {
        return { data: response.data, error: false };
      })
      .catch((error) => {
        return { data: error.response.data, error: true };
      });
  },

  //Post a resource
  postResource: (resource) => {
    return axios
      .post(API_URL + `create`, resource, {
        headers: postHeaders(),
      })
      .then((response) => {
        return response;
      });
  },

  getAllSubjects: () => {
    return axios
      .get("http://localhost:8080/api/subjects/getAll", {
        headers: postHeaders(),
      })
      .then((response) => {
        return { data: response.data, error: false };
      })
      .catch((error) => {
        return { data: error.response.data, error: true };
      });

    // return [
    //   { value: "Accounting and Finance", label: "1" },
    // "Aeronautical and Manufacturing Engineering",
    // "Agriculture and Forestry",
    // "Anatomy and Physiology",
    // "Anthropology",
    // "Archaeology",
    // "Architecture",
    // "Art and Design",
    // "Biological Sciences",
    // "Building",
    // "Business and Management Studies",
    // "Chemical Engineering",
    // "Chemistry",
    // "Civil Engineering",
    // "Classics and Ancient History",
    // "Communication and Media Studies",
    // "Complementary Medicine",
    // "Computer Science",
    // "Counselling",
    // "Creative Writing",
    // "Criminology",
    // "Dentistry",
    // "Drama Dance and Cinematics",
    // "Economics",
    // "Education",
    // "Electrical and Electronic Engineering",
    // "English",
    // "Fashion",
    // "Film Making",
    // "Food Science",
    // "Forensic Science",
    // "General Engineering",
    // "Geography and Environmental Sciences",
    // "Geology",
    // "Health And Social Care",
    // "History",
    // "History of Art Architecture and Design",
    // "Hospitality Leisure Recreation and Tourism",
    // "Information Technology",
    // "Land and Property Management",
    // "Law",
    // "Linguistics",
    // "Marketing",
    // "Materials Technology",
    // "Mathematics",
    // "Mechanical Engineering",
    // "Medical Technology",
    // "Medicine",
    // "Music",
    // "Nursing",
    // "Occupational Therapy",
    // "Pharmacology and Pharmacy",
    // "Philosophy",
    // "Physics and Astronomy",
    // "Physiotherapy",
    // "Politics",
    // "Psychology",
    // "Robotics",
    // " Social Policy",
    // "Social Work",
    // "Sociology",
    // "Sports Science",
    // "Veterinary Medicine",
    // "Youth Work",
    //   ];
  },
};
