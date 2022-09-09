import React, { useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import { Button } from "@material-ui/core";
import { useSelector } from "react-redux";
import ModalReview from "../layout/ModalReview";

const ReviewCard = ({ review, phone }) => {
  const [deleteState, setDeleteState] = useState(false);
  const [reviewId, setReviewId] = useState(null);

  const deleteReviewModal = (id) => {
    setDeleteState(true);
    setReviewId(id);
  };
  const { user } = useSelector((state) => state.user);

  return (
    <>
      {user && user.role === "admin" ? (
        <div className="reviewCard" style={{ paddingTop: "0px" }}>
          <Button
            className="deleteIcon"
            onClick={() => deleteReviewModal(review._id)}
          >
            <DeleteIcon style={{ color: "#bd1e1e" }} />
          </Button>
          <img crossOrigin="anonymous" src="/profile.png" alt="User" />
          <p>{review.name}</p>
          <span className="reviewCardComment">{review.comment}</span>
        </div>
      ) : (
        <div className="reviewCard">
          <img crossOrigin="anonymous" src="/profile.png" alt="User" />
          <p>{review.name}</p>
          <span className="reviewCardComment">{review.comment}</span>
        </div>
      )}
      {deleteState && (
        <ModalReview
          deleteState={setDeleteState}
          id={reviewId}
          phoneId={phone._id}
        />
      )}
    </>
  );
};

export default ReviewCard;
