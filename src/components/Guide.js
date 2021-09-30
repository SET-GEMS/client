import React from "react";

import Card from "../components/Card";
import { GEM_COLOR, GEM_SHAPE, METAL_COLOR, METAL_SHAPE } from "../constants/cardProperty";

function Guide() {
  const propertyExample = [...Array(3)].map((_, i) => {
    const cardProps = {
      gemColor: Object.values(GEM_COLOR)[i],
      gemShape: Object.values(GEM_SHAPE)[i],
      metalColor: Object.values(METAL_COLOR)[i],
      metalShape: Object.values(METAL_SHAPE)[i],
    };

    return <Card key={`propertyExample${i}`} {...cardProps} />;
  });

  const wrongExample =  [...Array(3)].map((_, i) => {
    const cardProps = {
      gemColor: Object.values(GEM_COLOR)[i],
      gemShape: Object.values(GEM_SHAPE)[i],
      metalColor: Object.values(METAL_COLOR)[i],
      metalShape: Object.values(METAL_SHAPE)[i || 1],
    };

    return <Card key={`wrongExample${i}`} {...cardProps} />;
  });

  return (
    <div className="guide">
      <p>SET GEMS는 카드들의 공통점과 차이점을 이용해 조합을 만들어 카드를 수집하는 게임입니다.</p>
      <ul>
        <li>조합은 3장의 카드로 이루어집니다.</li>
        <li>카드의 속성은 총 4가지 입니다.
          <div className="example">
            {propertyExample}
          </div>
          <ol>
            <li>보석의 색상: 빨강, 파랑, 초록</li>
            <li>보석의 모양: 타원형, 배형, 사각형</li>
            <li>금속의 종류: 옐로우골드, 화이트골드, 로즈골드</li>
            <li>금속의 모양: 거미줄, 반복되는 문, 퍼지는 원</li>
          </ol>
        </li>
        <li>조합 판정은 모두 자동으로 이루어집니다.</li>
        <li>
          4가지 속성 중 단 하나라도 두 카드만 같은 경우에는 조합을 수집할 수 없습니다.
          <div className="example">
            {wrongExample}
            <ol>
              <li>보석의 색상이 모두 같거나 다르나요? (O)</li>
              <li>보석의 모양이 모두 같거나 다르나요? (O)</li>
              <li>금속의 종류이 모두 같거나 다르나요? (O)</li>
              <li>금속의 모양이 모두 같거나 다르나요? (X)</li>
          </ol>
          </div>
        </li>
        <li>수집 실패의 패널티는 없습니다. 다양한 조합을 만들어보세요!</li>
      </ul>
    </div>
  );
}

export default Guide;
