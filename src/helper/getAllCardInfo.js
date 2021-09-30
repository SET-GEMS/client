import { GEM_COLOR, GEM_SHAPE, METAL_COLOR, METAL_SHAPE } from "../constants/cardProperty";

function getAllCardInfo() {
  const allCardInfo = [];

  Object.values(GEM_COLOR).forEach(gemColor => {
    Object.values(GEM_SHAPE).forEach(gemShape => {
      Object.values(METAL_COLOR).forEach(metalColor => {
        Object.values(METAL_SHAPE).forEach(metalShape => {
          const cardInfo = { gemColor, gemShape, metalColor, metalShape };
          allCardInfo.push(cardInfo);
        });
      });
    });
  });

  return allCardInfo;
}

export default getAllCardInfo;
