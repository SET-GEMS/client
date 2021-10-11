import React, { useState } from "react";

import "./Guide.css";
import Card from "../Card";
import Tutorial from "../Tutorial";
import { GEM_COLOR, GEM_SHAPE, METAL_COLOR, METAL_SHAPE } from "../../constants/cardProperty";

function Guide() {
  const [isTutorial, setIsTutorial] = useState(false);

  const handleTutorialButton = function () {
    setIsTutorial((prev) => !prev);
  };

  const tutorialButton = (
    <button onClick={handleTutorialButton}>
      {isTutorial ? "가이드로 돌아가기" : "카드 조합 해보기"}
    </button>
  );

  const propertyExample = [...Array(3)].map((_, i) => {
    const cardProps = {
      gemColor: Object.values(GEM_COLOR)[i],
      gemShape: Object.values(GEM_SHAPE)[i],
      metalColor: Object.values(METAL_COLOR)[i],
      metalShape: Object.values(METAL_SHAPE)[i],
    };

    return <Card key={`propertyExample${i}`} {...cardProps} />;
  });

  return (
    <div className="guide">
      {isTutorial
        ? <div>
          {tutorialButton}
          <Tutorial />
        </div>
        : <div>
          <p>SET GEMS는 카드들의 공통점과 차이점을 이용해 조합을 만들어 카드를 수집하는 게임입니다.</p>
          <ul>
            <li>혼자하기 모드에서는 자유롭게 카드를 선택할 수 있습니다</li>
            <li>같이하기 모드에서는 SET버튼을 누른 플레이어만 5초 동안 카드를 선택할 수 있습니다</li>
            <li>조합은 각 속성이 전부 다르거나 같은 3장의 카드로 이루어집니다.</li>
            <li>카드의 속성은 총 4가지 입니다.
              <div className="example">
                {propertyExample}
              </div>
              <ol>
                <li>보석의 종류: 루비, 사피이어, 에메랄드</li>
                <li>보석의 모양: 타원형, 배형, 사각형</li>
                <li>금속의 종류: 옐로우골드, 화이트골드, 로즈골드</li>
                <li>금속의 모양: 거미줄, 반복되는 문, 퍼지는 원</li>
              </ol>
            </li>
          </ul>
          {tutorialButton}
        </div>}
    </div>
  );
}

export default Guide;
