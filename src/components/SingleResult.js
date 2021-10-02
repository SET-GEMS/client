import React from "react";
import PropTypes from "prop-types";

import { postRanking } from "../api/ranking";

function SingleResult({ time, rankerStandard, onSubmit }) {
  const isRanker = time < rankerStandard;
  let isSubmitted = false;

  const handleFormSubmit = async function(ev) {
    ev.preventDefault();

    if (isSubmitted) {
      return;
    }

    isSubmitted = true;
    const data = { time, name: ev.target.nickname.value };
    await postRanking(data);

    onSubmit();
  };

  return (
    <div className="result">
      <h2>{`완료 시간: ${time}초`}</h2>
      {isRanker && <form onSubmit={handleFormSubmit}>
        <div className="guide">
          <p>당신은 상위 20인에 들었습니다.</p>
          <p>랭킹에 기록을 등록할 수 있습니다!</p>
          <label htmlFor="nickname">
            닉네임
          </label>
          <input name="nickname" placeholder="anonymous" type="text" required/>
        </div>
        <button>SUBMIT</button>
      </form>}
    </div>
  );
}

SingleResult.propTypes = {
  time: PropTypes.number,
  rankerStandard: PropTypes.number,
  onSubmit: PropTypes.func,
};

export default SingleResult;
