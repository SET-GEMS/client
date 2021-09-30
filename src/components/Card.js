import React from "react";
import PropTypes from "prop-types";

import { getBackgroundImageUrl, getGemImageUrl } from "../helper/image";
import { GEM_COLOR, GEM_SHAPE, METAL_COLOR, METAL_SHAPE } from "../constants/cardProperty";

function Card({ gemColor, gemShape, metalColor, metalShape }) {
  const backgroundImageUrl = getBackgroundImageUrl(metalColor, metalShape);
  const gemImageUrl = getGemImageUrl(gemColor, gemShape);

  return (
    <div className="card" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
      <img src={gemImageUrl} />
    </div>
  );
}

Card.propTypes = {
  gemColor: PropTypes.oneOf(Object.values(GEM_COLOR)),
  gemShape: PropTypes.oneOf(Object.values(GEM_SHAPE)),
  metalColor: PropTypes.oneOf(Object.values(METAL_COLOR)),
  metalShape: PropTypes.oneOf(Object.values(METAL_SHAPE)),
};

export default Card;
