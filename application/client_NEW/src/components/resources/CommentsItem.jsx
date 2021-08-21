import React, { useState, useContext } from "react";
import { useEffect } from "react/cjs/react.development";
import * as ai from "react-icons/ai";
import * as im from "react-icons/im";
import * as ri from "react-icons/ri";
import { AuthContext } from "../../Context/AuthContext";

import CommentService from "../../Services/CommentService";

const CommentsItem = ({ comment, dataChanged, setDataChanged }) => {
  const authContext = useContext(AuthContext);
  const [editComment, setEditComment] = useState(true);
  const [commentBody, setCommentBody] = useState(comment.body);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const onSave = async () => {
    if (!(comment.body == commentBody)) {
      setSaving(true);
      const commentUpdate = await CommentService.updateCommentBody(
        comment.id,
        commentBody
      );
      const timer = setTimeout(() => {
        setSaving(false);
        setEditComment(!editComment);
      }, 1000);
      return () => clearTimeout(timer);
    }
  };

  const onDelete = async () => {
    // if user is allowed
    if (authContext.user.username == comment.user_username) {
      setDeleting(true);
      const commentDelete = await CommentService.deleteComment(comment.id);
      const timer = setTimeout(() => {
        setDeleted(true);
        setDeleting(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  };

  return (
    <>
      {deleted ? (
        <>
          <div className="glass-styling comment-item-wrap container p-2 m-2 d-flex flex-column">
            <h5 className="text-black text-left">Deleted :/</h5>
          </div>
        </>
      ) : (
        <>
          <div className="glass-styling comment-item-wrap container p-2 m-2 d-flex flex-column">
            <h5 className="text-black text-left">{comment.user_username}</h5>
            <div className="d-flex align-items-center">
              <textarea
                className="text-black comment-message w-75 text-left "
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                disabled={editComment}
              />
              {authContext.user.username == comment.user_username ? (
                <>
                  {editComment ? (
                    <>
                      {deleting ? (
                        <>
                          <span
                            class="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          <h6 className="m-1">Deleting...</h6>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn"
                            onClick={() => {
                              setEditComment(!editComment);
                            }}
                          >
                            <ai.AiFillEdit />
                          </button>
                          <button
                            className="btn"
                            onClick={() => {
                              onDelete();
                            }}
                          >
                            <ri.RiDeleteBin6Fill />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {saving ? (
                        <>
                          <span
                            class="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          <h6 className="m-1">Saving...</h6>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn"
                            onClick={() => {
                              onSave();
                            }}
                          >
                            <ai.AiFillSave />
                          </button>
                          <button
                            className="btn"
                            onClick={() => {
                              setCommentBody(comment.body);
                              setEditComment(true);
                            }}
                          >
                            <im.ImCross />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CommentsItem;
