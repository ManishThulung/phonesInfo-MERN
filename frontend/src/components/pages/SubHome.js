import React from "react";
import { Link } from "react-router-dom";

function SubHome({ phone }) {
  // const num = 4;
  // let page = [];
  // page.push(phone);
  // page.length <= num &&
  // console.log(page.length);
  // if (page.length >= num) {
  //   return;
  // }
  return (
    <>
      <Link to={`/phone/${phone._id}`}>
        <img
          className="card-img-top"
          crossOrigin="anonymous"
          src={phone.image.map((img) => img.url)}
          alt="Card"
          style={{ paddingTop: "1.2rem", width: "200px", height: "200px" }}
        />

        <div className="card-body">
          <h5 className="card-title text-center title">{phone.name}</h5>
        </div>
      </Link>
    </>
  );
}

export default SubHome;
