import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import {
  clearErrors,
  createReview,
  getSinglePhone,
} from "../../redux/actions/phoneAction";
import Loader from "../loader/Loader";
import "./PhoneDetails.css";
import ReviewCard from "./ReviewCard";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { CREATE_REVIEW_RESET } from "../../redux/constants/constants";

function PhoneDetails() {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { phone, isLoading, error } = useSelector(
    (state) => state.phoneDetails
  );

  const { success, error: reviewError } = useSelector((state) => state.reviews);

  const {
    // loading,
    // user,
    isAuthenticated,
    // error: userError,
  } = useSelector((state) => state.user);

  const { id } = useParams();

  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");

  const submitReviewToggle = () => {
    if (!isAuthenticated) {
      return alert.error("Please Log in first to submit review.");
    }

    open ? setOpen(false) : setOpen(true);
  };

  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set("comment", comment);
    myForm.set("phoneId", id);

    dispatch(createReview(myForm));

    setOpen(false);
  };

  useEffect(() => {
    dispatch(getSinglePhone(id));

    if (error) {
      alert.error(error);
      dispatch(clearErrors);
    }
    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors);
    }

    if (success) {
      alert.success("Review added successfully");
      dispatch({ type: CREATE_REVIEW_RESET });
    }
  }, [dispatch, id, error, alert, reviewError, success]);

  if (!phone) return null;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="container">
        <div className="row phone">
          <h2 className="text-center name">{phone.name}</h2>
          <div className="col-lg-8" style={{ textAlign: "center" }}>
            <img
              crossOrigin="anonymous"
              src={phone.image.map((img) => img.url)}
              alt=""
              srcSet=""
              style={{ width: "50%" }}
            />
          </div>
          <div className="col-lg-8" style={{ width: "79%" }}>
            <h2 className="name centerr">
              <span className="center">Specifications</span>
            </h2>
            <div className="tablee">
              <table className="table table-striped tableText" border="2px">
                <tr>
                  <th>Storage & RAM</th>
                  <td>
                    <b>
                      {phone.storage}+{phone.RAM}
                    </b>
                    <p className="detailsPara">
                      External Memory: {phone.externalMemory}
                    </p>
                  </td>
                </tr>

                <tr>
                  <th>Display</th>
                  <td>
                    <b>{phone.display}</b>

                    {phone.displayExtraOne !== undefined && (
                      <p className="detailsPara">{phone.displayExtraOne}</p>
                    )}
                    {phone.displayExtraTwo !== undefined && (
                      <p className="detailsPara">{phone.displayExtraTwo}</p>
                    )}
                    {phone.displayExtraThree !== "" && (
                      <p className="detailsPara">{phone.displayExtraThree}</p>
                    )}
                    {phone.displayExtraFour !== "" && (
                      <p className="detailsPara">{phone.displayExtraFour}</p>
                    )}
                    {phone.displayExtraFive !== "" && (
                      <p className="detailsPara">{phone.displayExtraFive}</p>
                    )}
                  </td>
                </tr>
                <tr>
                  <th>Processor</th>
                  <td>
                    <b>{phone.processor}</b>
                    {phone.processorExtraOne !== "" && (
                      <p className="detailsPara">{phone.processorExtraOne}</p>
                    )}
                    {phone.processorExtraTwo !== "" && (
                      <p className="detailsPara">{phone.processorExtraTwo}</p>
                    )}
                    {phone.processorExtraThree !== "" && (
                      <p className="detailsPara">{phone.processorExtraThree}</p>
                    )}
                  </td>
                </tr>
                <tr>
                  <th>Camera</th>
                  <td>
                    <b>{phone.camera}</b>
                    {phone.cameraExtraOne !== "" && (
                      <p className="detailsPara">
                        Front: {phone.cameraExtraOne}
                      </p>
                    )}
                    {phone.cameraExtraTwo !== "" && (
                      <p className="detailsPara">
                        Front: {phone.cameraExtraTwo}
                      </p>
                    )}
                    {phone.cameraExtraThree !== "" && (
                      <p className="detailsPara">{phone.cameraExtraThree}</p>
                    )}
                  </td>
                </tr>

                <tr>
                  <th>Battery</th>
                  <td>
                    <b>{phone.battery}</b>
                    {phone.batteryExtraOne !== "" && (
                      <p className="detailsPara">{phone.batteryExtraOne}</p>
                    )}
                    {phone.batteryExtraTwo !== "" && (
                      <p className="detailsPara">{phone.batteryExtraTwo}</p>
                    )}
                    {phone.batteryExtraThree !== "" && (
                      <p className="detailsPara">{phone.batteryExtraThree}</p>
                    )}
                  </td>
                </tr>

                <tr>
                  <th>Security & Authentication</th>
                  <td>
                    <b>{phone.security}</b>
                    {phone.securityExtraOne !== "" && (
                      <p className="detailsPara">{phone.securityExtraOne}</p>
                    )}
                    {phone.securityExtraTwo !== "" && (
                      <p className="detailsPara">{phone.securityExtraTwo}</p>
                    )}
                  </td>
                </tr>
                <tr>
                  <th>NFC</th>
                  <td>
                    <b>{phone.nfc}</b>
                    {phone.nfcExtraOne !== "" && (
                      <p className="detailsPara">{phone.nfcExtraOne}</p>
                    )}
                    {phone.nfcExtraTwo !== "" && (
                      <p className="detailsPara">{phone.nfcExtraTwo}</p>
                    )}
                    {phone.nfcExtraThree !== "" && (
                      <p className="detailsPara">{phone.nfcExtraThree}</p>
                    )}
                  </td>
                </tr>

                <tr>
                  <th>Networks</th>
                  <td>
                    <b>{phone.network}</b>

                    {phone.networkExtraOne && (
                      <p className="detailsPara">{phone.networkExtraOne}</p>
                    )}
                    {phone.networkExtraTwo && (
                      <p className="detailsPara">{phone.networkExtraTwo}</p>
                    )}
                    {phone.networkExtraThree && (
                      <p className="detailsPara">{phone.networkExtraThree}</p>
                    )}
                  </td>
                </tr>

                <tr>
                  <th>Sensors</th>
                  <td>
                    <b>{phone.sensors}</b>
                    {phone.sensorsExtraOne !== "" && (
                      <p className="detailsPara">{phone.sensorsExtraOne}</p>
                    )}
                    {phone.sensorsExtraTwo !== "" && (
                      <p className="detailsPara">{phone.sensorsExtraTwo}</p>
                    )}
                    {phone.sensorsExtraThree !== "" && (
                      <p className="detailsPara">{phone.sensorsExtraThree}</p>
                    )}
                  </td>
                </tr>
                <tr>
                  <th>Operating System</th>
                  <td>
                    <b>{phone.os}</b>
                    {phone.osExtraOne !== "" && (
                      <p className="detailsPara">{phone.osExtraOne}</p>
                    )}
                    {phone.osExtraTwo !== "" && (
                      <p className="detailsPara">{phone.osExtraTwo}</p>
                    )}
                    {phone.osExtraThree !== "" && (
                      <p className="detailsPara">{phone.osExtraThree}</p>
                    )}
                  </td>
                </tr>
                <tr>
                  <th>Package Contains</th>
                  <td>
                    <b>{phone.packagecontains}</b>
                    {phone.packagecontainsExtraOne !== "" && (
                      <p className="detailsPara">
                        {phone.packagecontainsExtraOne}
                      </p>
                    )}
                    {phone.packagecontainsExtraTwo !== "" && (
                      <p className="detailsPara">
                        {phone.packagecontainsExtraTwo}
                      </p>
                    )}
                  </td>
                </tr>
                <tr>
                  <th>Price</th>
                  <td>
                    <b>&#x20b9; {phone.price}</b>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="reviewBtn">
        <button onClick={submitReviewToggle} className="submitReview">
          Submit Review
        </button>
      </div>

      <h3 className="reviewsHeading">REVIEWS</h3>

      <Dialog
        aria-labelledby="simple-dialog-title"
        open={open}
        onClose={submitReviewToggle}
      >
        <DialogTitle>Submit Review</DialogTitle>
        <DialogContent className="submitDialog">
          <textarea
            className="submitDialogTextArea"
            cols="30"
            rows="5"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </DialogContent>
        <DialogActions>
          <Button onClick={submitReviewToggle} color="secondary">
            Cancel
          </Button>
          <Button onClick={reviewSubmitHandler} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {phone.reviews && phone.reviews[0] ? (
        <div className="reviews">
          {phone.reviews &&
            phone.reviews.map((review) => (
              <ReviewCard key={review._id} review={review} phone={phone} />
            ))}
        </div>
      ) : (
        <p className="noReviews">No Reviews Yet</p>
      )}
    </div>
  );
}

export default PhoneDetails;
