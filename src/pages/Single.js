import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import CardArea from "../components/CardArea";
import Ranking from "../components/Ranking";
import { WAITING, PLAYING, ENDED } from "../constants/playState";

function Single({ onHomeButtonClick }) {
  const [state, setState] = useState(WAITING);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (state !== PLAYING) {
      return;
    }

    setTime(0);

    const timer = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [state]);

  const handleStartButtonClick = function () {
    if (state === WAITING) {
      setState(PLAYING);
    } else {
      setState(WAITING);
    }
  };

  return (
    <div>
      <div className="header">
        <h1>혼자하기</h1>
        <button type="button" onClick={onHomeButtonClick}>
          home
        </button>
      </div>
      <div className="play">
        <div className="main">
          {state === WAITING && <Ranking />}
          {state === PLAYING && <CardArea />}
        </div>
        <div className="sub">
          {state === PLAYING && <p>{`${time}초`}</p>}
        </div>
        <div className="button">
          <button type="button" onClick={handleStartButtonClick}>
            {state === WAITING ? "START" : "CANCEL"}
          </button>
        </div>
      </div>
    </div>
  );
}

Single.propTypes = {
  onHomeButtonClick: PropTypes.func,
};

export default Single;
