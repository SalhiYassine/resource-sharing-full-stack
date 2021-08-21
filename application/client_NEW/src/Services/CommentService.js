import axios from "axios";
import authHeader from "./authHeader";
import postHeaders from "./postHeader";
const API_URL = "http://localhost:8080/api/comments/";

export default {
  getAllComments: (id) => {
    return axios
      .get(API_URL + `getAllOnSpecific/${id}`, {
        headers: authHeader(),
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
  },

  getOneComment: (id) => {
    return axios
      .get(API_URL + `getOneComment/${id}`, {
        headers: authHeader(),
      })
      .then((response) => {
        return response;
      });
  },

  deleteComment: (id) => {
    return axios
      .delete(API_URL + `deleteOneComment/${id}`, {
        headers: authHeader(),
      })
      .then((response) => {
        return response;
      });
  },

  updateCommentBody: (id, newBody) => {
    return axios
      .patch(
        API_URL + `updateOne/${id}/body`,
        { body: newBody },
        {
          headers: postHeaders(),
        }
      )
      .then((response) => {
        return response;
      });
  },

  postComment: (id, comment) => {
    return axios
      .post(API_URL + `createOnSpecific/${id}`, comment, {
        headers: postHeaders(),
      })
      .then((response) => {
        return response.data;
      });
  },
};

// export default {

//     // Fetch all the comments on the specified post
//     getAllComments: (resourceID) => {
//         return fetch(`/api/resources/${resourceID}/comments/`)
//             .then(res => {
//                 return res.json().then(data => data)
//             });
//     },

//     //Fetch a specific comment on a resource
//     getSpecificComment: (resourceID, commentID) => {
//         return fetch(`/api/resources/${resourceID}/comments/${commentID}`)
//             .then(res => {
//                 return res.json().then(data => data)
//             });
//     },

//     //Post a comment on a specific post
//     postComment: (resourceID, comment) => {
//         return fetch(`/api/resources/${resourceID}/comments`, {
//             method: "post",
//             body: JSON.stringify(comment),
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//         }).then(res => {
//             return res.json().then(data => data)
//         });
//     },

//     //Update a post using a resourceID, to be used on the resource page through the resource item
//     deleteComment: (resourceID, commentID) => {
//         return fetch(`/api/resources/${resourceID}/comments/${commentID}`, {
//             method: "delete",
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//         }).then(res => {
//             return res.json().then(data => data)
//         });
//     }
// }
