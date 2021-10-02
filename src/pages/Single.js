import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import CardArea from "../components/CardArea";
import Ranking from "../components/Ranking";
import SingleResult from "../components/SingleResult";
import { WAITING, PLAYING, ENDED } from "../constants/playState";

function Single({ onHomeButtonClick }) {
  const numberOfAllCards = 81;
  const [state, setState] = useState(ENDED);
  const [time, setTime] = useState(0);
  const [restCardCount, setRestCardCount] = useState(numberOfAllCards);
  const [rankerStandard, setRankerStandard] = useState(Infinity);

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

  const handleSuccess = function (count) {
    setRestCardCount(count);
  };

  const handleGameCompleted = function () {
    setState(ENDED);
  };

  const handleRankingFormSubmit = function () {
    setState(WAITING);
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
          {state === WAITING
            && <Ranking setRankerStandard={setRankerStandard} />}
          {state === PLAYING
            && <CardArea
            onSuccess={handleSuccess}
            onGameCompleted={handleGameCompleted} />}
          {state === ENDED
            && <SingleResult
              time={time}
              rankerStandard={rankerStandard}
              onSubmit={handleRankingFormSubmit} />}
        </div>
        <div className="sub">
          {state === PLAYING
            && <div>
              <p>{`${time}초`}</p>
              <p>{`남은 카드 수: ${restCardCount}개`}</p>
            </div>}
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
