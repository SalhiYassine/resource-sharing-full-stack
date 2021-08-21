import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import Comment from "./CommentsItem";
import CommentService from "../../Services/CommentService";

const CommentsComp = ({ dataChanged, setDataChanged }) => {
  const [dataLoading, setDataLoading] = useState(true);
  const [detailsData, setDetailsData] = useState();
  const [commentsExist, setCommentsExist] = useState(false);
  const location = useLocation();
  const resourceID = location.pathname.split("/")[2];

  useEffect(() => {
    CommentService.getAllComments(resourceID).then((response) => {
      if (response.status == 200) {
        console.log(response.data);
        let comments = [];
        for (let i = 0; i < response.data.length; i = i + 1) {
          const { id, body, date_created, date_updated, user } = response.data[
            i
          ];
          const formattedComment = {
            id,
            body,
            date_created,
            date_updated,
            user_username: user.username,
            user_id: user.id,
          };
          console.log(formattedComment);
          comments.push(formattedComment);
        }
        setDetailsData(comments);
        console.log(comments);
        setCommentsExist(true);
        setDataLoading(false);
      } else if (response.status == 404) {
        setCommentsExist(false);
        setDataLoading(false);
        setDetailsData(response.data);
      } else {
        setCommentsExist(false);
        setDataLoading(false);
      }
    });
  }, [dataChanged]);

  return (
    <div>
      Comment Section
      {dataLoading ? (
        <Loading />
      ) : (
        <Loaded
          commentsExist={commentsExist}
          dataChanged={dataChanged}
          setDataChanged={setDataChanged}
          detailsData={detailsData}
        />
      )}
    </div>
  );
};

const Loading = () => {
  return <h5>Loading</h5>;
};
const Loaded = ({
  commentsExist,
  detailsData,
  dataChanged,
  setDataChanged,
}) => {
  return (
    <>
      {commentsExist ? (
        detailsData.map((comment, i) => {
          return (
            <Comment
              key={i}
              comment={comment}
              dataChanged={dataChanged}
              setDataChanged={setDataChanged}
            />
          );
        })
      ) : (
        <p>There are no comments available, sorry about that!</p>
      )}
    </>
  );
};

export default CommentsComp;
