import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import "./Card.css";
import { getBackgroundImageUri, getGemImageUri } from "../../helper/image";
import {
  GEM_COLOR,
  GEM_SHAPE,
  METAL_COLOR,
  METAL_SHAPE,
} from "../../constants/cardProperty";

function Card({ index, gemColor, gemShape, metalColor, metalShape, onClick }) {
  const animationTime = 500;
  const [isNew, setIsNew] = useState(false);
  const backgroundImageUri = getBackgroundImageUri(metalColor, metalShape);
  const gemImageUri = getGemImageUri(gemColor, gemShape);

  useEffect(() => {
    setIsNew(true);
    const timer = setTimeout(() => {
      setIsNew(false);
    }, animationTime);

    return () => clearTimeout(timer);
  }, [gemColor, gemShape, metalColor, metalShape]);

  const handleClick = ({ currentTarget }) => {
    if (onClick) {
      onClick(index, currentTarget);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={isNew ? "new card" : "card"}
      style={{ backgroundImage: `url(${backgroundImageUri})` }}
    >
      <img src={gemImageUri} />
    </div>
  );
}

Card.propTypes = {
  index: PropTypes.number,
  gemColor: PropTypes.oneOf(Object.values(GEM_COLOR)).isRequired,
  gemShape: PropTypes.oneOf(Object.values(GEM_SHAPE)).isRequired,
  metalColor: PropTypes.oneOf(Object.values(METAL_COLOR)).isRequired,
  metalShape: PropTypes.oneOf(Object.values(METAL_SHAPE)).isRequired,
  onClick: PropTypes.func,
};

export default React.memo(Card);
