function getBackgroundImageUrl(color, shape) {
  const baseUrl = "/image/backgrounds/";
  return baseUrl + color + "-" + shape + ".png";
}

function getGemImageUrl(color, shape) {
  const baseUrl = "/image/gems/";
  return baseUrl + color + "-" + shape + ".png";
}

export { getBackgroundImageUrl, getGemImageUrl };
