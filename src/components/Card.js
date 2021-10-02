import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { getBackgroundImageUri, getGemImageUri } from "../helper/image";
import { GEM_COLOR, GEM_SHAPE, METAL_COLOR, METAL_SHAPE } from "../constants/cardProperty";

function Card({
  gemColor, gemShape,
  metalColor, metalShape,
  onClick,
}) {
  const animationTime = 500;
  const [isNew, setIsNew] = useState(false);
  const backgroundImageUri = getBackgroundImageUri(metalColor, metalShape);
  const gemImageUri = getGemImageUri(gemColor, gemShape);

  useEffect(() => {
    setIsNew(true);
    setTimeout(() => {
      setIsNew(false);
    }, animationTime);
  }, [gemColor, gemShape, metalColor, metalShape]);

  return (
    <div
      onClick={onClick}
      className={isNew ? "new card" : "card"}
      style={{ backgroundImage: `url(${backgroundImageUri})` }}
    ><img src={gemImageUri} /></div>
  );
}

Card.propTypes = {
  gemColor: PropTypes.oneOf(Object.values(GEM_COLOR)),
  gemShape: PropTypes.oneOf(Object.values(GEM_SHAPE)),
  metalColor: PropTypes.oneOf(Object.values(METAL_COLOR)),
  metalShape: PropTypes.oneOf(Object.values(METAL_SHAPE)),
  onClick: PropTypes.func,
};

export default Card;
