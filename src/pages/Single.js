import React from "react";
import PropTypes from "prop-types";

function Single({ onHomeButtonClick }) {
  return (
    <div>
      <h1>혼자하기</h1>
      <button type="button" onClick={onHomeButtonClick}>
        home
      </button>
    </div>
  );
}

Single.propTypes = {
  onHomeButtonClick: PropTypes.func,
};

export default Single;
