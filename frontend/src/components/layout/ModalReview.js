import { Button } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, deleteReview } from "../../redux/actions/phoneAction";
import { useAlert } from "react-alert";
import "./ModalReview.css";
import { DELETE_REVIEW_RESET } from "../../redux/constants/constants";

function ModalReview({ deleteState, id, phoneId }) {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.reviews
  );

  const deleteReviewHandler = (id) => {
    dispatch(deleteReview(id, phoneId));
  };

  useEffect(() => {
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Review deleted successfully.");
      dispatch({ type: DELETE_REVIEW_RESET });
      window.location.reload();
    }
  }, [dispatch, alert, deleteError, isDeleted, phoneId]);

  return (
    <div className="modalBackgrounds">
      <div className="modalContainers">
        <div className="titleCloseBtns">
          <button
            onClick={() => {
              deleteState(false);
            }}
          >
            X
          </button>
        </div>
        <div className="titles">
          <h4>Are You Sure?</h4>
        </div>
        <div className="bodyyy">
          <p>Do you really want to delete this review?</p>
        </div>
        <div className="footers">
          <Button
            variant="contained"
            onClick={() => {
              deleteState(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => deleteReviewHandler(id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ModalReview;
