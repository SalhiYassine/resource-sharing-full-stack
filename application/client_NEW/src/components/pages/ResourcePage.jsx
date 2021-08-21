import React, { useState, useEffect, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import CommentSection from "../resources/CommentsComp";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

import ResourceService from "../../Services/ResourceService";
import CommentService from "../../Services/CommentService";
import { AuthContext } from "../../Context/AuthContext";
import authHeader from "../../Services/authHeader";

const ResourcePage = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const [dataChanged, setDataChanged] = useState();
  const [loading, setLoading] = useState(true);
  const [resourceDetails, setResourceDetails] = useState();
  const [savedResources, setSavedResources] = useState([]);

  useEffect(() => {
    ResourceService.getResource(path).then((response) => {
      setResourceDetails(response.data);

      setLoading(false);
    });
    getSavedResources();
  }, []);

  const [formData, setFormData] = useState({ author: "", message: "" });

  const onFormSubmit = async (event) => {
    // Submit here
    await CommentService.postComment(path, formData).then((response) => {
      if (response.status == 200) {
      }
      setData("body", "");
    });
    setDataChanged(!dataChanged);
  };

  // get Data
  const getData = (key) => {
    return formData.hasOwnProperty(key) ? formData[key] : "";
  };

  // Set data
  const setData = (key, value) => {
    return setFormData({ ...formData, [key]: value });
  };

  const saveResource = () => {
    console.log("saveResource");
    const headers = authHeader();
    axios({
      method: "post",
      url: `http://localhost:8080/save-resource/${user.userID}/${resourceDetails.id}`,
      headers,
    })
      .then((res) => {
        getSavedResources();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getSavedResources = () => {
    console.log("getSavedResources");
    const headers = authHeader();
    axios({
      method: "get",
      url: `http://localhost:8080/saved-resources/${user.userID}`,
      headers,
    }).then((res) => {
      console.log(res.data);
      setSavedResources(res.data || []);
    });
  };

  const removeSavedResources = () => {
    const headers = authHeader();
    axios({
      method: "get",
      url: `http://localhost:8080/remove-saved-resource/${user.userID}/${resourceDetails.id}`,
      headers,
    })
      .then((res) => {
        getSavedResources();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="details-wrap">
      <div className="details-page">
        <div className="details-container container">
          <Link className="action-button btn" to="/resources">
            Back
          </Link>
          {!loading &&
            resourceDetails?.user?.id != user.userID &&
            savedResources.findIndex((a) => a.id === resourceDetails.id) ==
              -1 && (
              <button
                type="submit"
                class="btn action-button ml-5"
                onClick={saveResource}
              >
                Save
              </button>
            )}
          {!loading &&
            resourceDetails?.user?.id != user.userID &&
            savedResources.findIndex((a) => a.id === resourceDetails.id) >=
              0 && (
              <button
                type="submit"
                class="btn action-button ml-5"
                onClick={removeSavedResources}
              >
                Remove
              </button>
            )}
          {loading ? (
            <div className="loading">Loading....</div>
          ) : (
            <div className="resource-details-display text-justify">
              <h3>{resourceDetails.title}</h3>
              {/* <h4>{resourceDetails.resourceSubject}</h4> */}
              <ReactMarkdown
                parserOptions={{ commonmark: true }}
                source={resourceDetails.body}
                className="reactMarkDown"
              />
            </div>
          )}
        </div>
        <div className=" ">
          <div className="comments-container container d-flex align-items-center ">
            <CommentSection
              dataChanged={dataChanged}
              resourceID={path}
              setDataChanged={setDataChanged}
            />
          </div>

          <form
            className="container glass-styling  m-1 p-1 comment-input-wrap d-flex justify-content-center"
            onSubmit={onFormSubmit}
          >
            <input
              value={getData("body")}
              onChange={(e) => setData("body", e.target.value)}
              placeholder="Write a comment"
              className="form-control glass-styling comment-input m-1"
              type="text"
            />
            <button type="submit" className="btn action-button m-1">
              submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResourcePage;
