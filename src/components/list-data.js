import React from "react";

const ListData = ({ label, value, newLine }) => {
  //return label value data
  return (
    <>
      <b className="passenger-name">
        <strong>{label}: </strong>
        {value}
      </b>
      {newLine && <br />}
    </>
  );
};

export default ListData;