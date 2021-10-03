import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { getRanking } from "../api/ranking";

function Ranking({ setRankerStandard }) {
  const [error, setError] = useState("");
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    async function loadRanking() {
      try {
        const ranking = await getRanking();

        if (ranking.length === 20) {
          const lastRanker = ranking[ranking.length - 1];
          const rankingStandard = lastRanker.time;
          setRankerStandard(rankingStandard);
        }

        setRanking(ranking);
      } catch(err) {
        setError("현재 랭킹서비스를 이용할 수 없습니다");
      }
    }

    loadRanking();
  }, []);

  const rankingElements = ranking.length
    ? ranking.map((record) => {
      return <p key={record._id}>{`${record.name} ${record.time}초`}</p>;
    }) : [];

  return (
    <div>
      <h2>{error ? error : "Ranking"}</h2>
      <div className="ranking">
        {rankingElements}
      </div>
    </div>
  );
}

Ranking.propTypes = {
  setRankerStandard: PropTypes.func,
};

export default Ranking;
