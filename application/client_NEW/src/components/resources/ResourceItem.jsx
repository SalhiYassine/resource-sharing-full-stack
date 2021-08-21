import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ResourceService from "../../Services/ResourceService";
import UserService from "../../Services/UserService";
import { AuthContext } from "../../Context/AuthContext";
import * as im from "react-icons/im";

const ResourceItem = ({ resource, dataChanged, setDataChanged }) => {
  const authContext = useContext(AuthContext);

  const { id, title, description, user } = resource;

  console.log(resource.subject);

  const deleteResource = async (e) => {
    e.preventDefault();
    const deleteResponse = await ResourceService.deleteResource(id);
    setDataChanged(!dataChanged);
  };

  return (
    <>
      {resource ? (
        <div className="container resource-item-wrap d-flex ">
          <div className="resource-author-container d-flex">
            <h6 className="resource-author-nickname"></h6>
            {!(user.username == authContext.user.username) ? (
              <h6 className="resource-author-nickname">
                {" "}
                {user.username.charAt(0).toUpperCase()}{" "}
              </h6>
            ) : (
              <h6 className="resource-author-currect"> YOU </h6>
            )}
          </div>
          <div className="resource-content-wrap d-flex">
            <div className="resource-information text-truncate">
              <h2 className="item-title text-truncate text-uppercase">
                {" "}
                {title}
              </h2>
              <h6 className=" text-truncate "> {resource.subject.subject}</h6>
              <h6 className="item-description text-truncate ">
                {" "}
                {description}
              </h6>
            </div>
          </div>

          <div className="d-flex w-75 justify-content-center m-3">
            <Link
              className="btn action-button text-center open-btn m-1"
              to={`resources/${id}`}
            >
              Open
            </Link>
            {user.username == authContext.user.username ? (
              <Link
                className="btn btn-info text-center m-1"
                to={`resources/${id}/edit`}
              >
                Edit
              </Link>
            ) : null}
            {user.username == authContext.user.username ? (
              <button
                className="btn btn-danger text-center m-1"
                onClick={deleteResource}
              >
                <im.ImBin />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ResourceItem;
