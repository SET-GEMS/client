import React from "react";
import PropTypes from "prop-types";

function Multi({ onHomeButtonClick }) {
  return (
    <div>
      <h1>같이하기</h1>
      <button type="button" onClick={onHomeButtonClick}>
        home
      </button>
    </div>
  );
}

Multi.propTypes = {
  onHomeButtonClick: PropTypes.func,
};

export default Multi;
