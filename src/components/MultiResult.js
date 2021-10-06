import React from "react";
import PropTypes from "prop-types";

function MultiResult({ result }) {
  const resultElements = [...result].sort((a, b) => b.point - a.point)
    .map(({ nickname, point }, i) => (
      <p key={`${nickname}${i}`}>{`${nickname}: ${point}`}</p>
    ));

  return (
    <div>
      <h2>GAME RESULT</h2>
      {resultElements}
    </div>
  );
}

MultiResult.propTypes = {
  result: PropTypes.arrayOf(PropTypes.shape({
    nickname: PropTypes.string,
    point: PropTypes.number,
  })),
};

export default MultiResult;
