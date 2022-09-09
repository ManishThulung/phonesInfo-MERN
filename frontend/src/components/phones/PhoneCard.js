import React from "react";
import { Link } from "react-router-dom";
// import MetaData from "../layout/Metadata";

import "./AllPhones.css";

function PhoneCard({ phone, width }) {
  return (
    <>
      {/* <MetaData title="Phone Details" /> */}
      <Link to={`/phone/${phone._id}`} target="_blank">
        {width === 1 ? (
          <img
            className="card-img-top"
            crossOrigin="anonymous"
            src={phone.image.map((img) => img.url)}
            alt="Card"
            style={{ paddingTop: "1.2rem", width: "165px", height: "180px" }}
          />
        ) : (
          <img
            className="card-img-top"
            crossOrigin="anonymous"
            src={phone.image.map((img) => img.url)}
            alt="Card"
            style={{ paddingTop: "1.2rem", width: "200px", height: "200px" }}
          />
        )}

        <div className="card-body">
          <h5 className="card-title text-center title">{phone.name}</h5>
        </div>
      </Link>
    </>
  );
}

export default PhoneCard;
