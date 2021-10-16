# SET GEMS

## 목차
1. [소개](#set-gems-소개)
2. [미리보기](#미리보기)
3. [개발 과정](#개발-과정)
4. [카드 제작기](#카드-제작기)
5. [에러로그](#에러로그)

## SET GEMS 소개
https://user-images.githubusercontent.com/72963478/136772296-55e99e1b-ed79-44e0-a480-6fff8b3e0b19.mp4


### LINK
- 웹 게임 주소: https://www.setgems.online/

#### Git Repository
- client: https://github.com/SET-GEMS/set-gems-client
- server: https://github.com/SET-GEMS/set-gems-server

### 주요 기술 스택
- MERN(MongoDB, Express, React, Node)
- Socket.IO
- WebRTC
- Service Worker

### 기능
- 프로그레시브 웹 앱으로 만들어져 네트워크 없이도 혼자하기를 진행할 수 있습니다.
- socket.io를 이용하여 멀리 떨어진 사람과도 방 이름을 공유하기만 하면 함께 같이하기를 즐길 수 있습니다.
- webRTC를 이용해 같이하기 모드에서는 화상통화를 이용할 수 있습니다. 

### 게임 규칙
- SET GEMS는 카드들의 공통점과 차이점을 이용해 조합을 만들어 카드를 수집하는 게임입니다.
- 카드의 속성은 총 4가지이며, 각각 세 종류의 값을 갖습니다.


  ![alldifferent](https://user-images.githubusercontent.com/72963478/137574584-eff6ee66-8244-4842-9fb0-9a3ccbf267ee.png)

      1. 보석의 종류: 루비, 사파이어, 에메랄드
      2. 보석의 모양: 타원형, 배형, 사각형
      3. 금속의 종류: 옐로우골드, 화이트골드, 로즈골드
      4. 금속의 모양: 거미줄, 반복되는 문, 퍼지는 원
- 조합은 각각의 속성 값이 전부 다르거나 같은 3장의 카드로 이루어집니다.

      - 세 장의 카드에 그려진 보석의 종류가 모두 같거나 달라야 합니다.
      - 세 장의 카드에 그려진 보석의 모양이 모두 같거나 달라야 합니다.
      - 세 장의 카드에 그려진 금속의 종류가 모두 같거나 달라야 합니다.
      - 세 장의 카드에 그려진 금속의 모양이 모두 같거나 달라야 합니다.

      - 위 네 가지 조건을 모두 만족해야 조합이 됩니다.
      - 예를 들어, 두 장의 카드만 루비이고 한 장은 에메랄드라면 조합이 성립되지 않습니다.


## 미리보기

### 웰컴페이지
가이드 / 카드 조합해보기

![guide](https://user-images.githubusercontent.com/72963478/137576963-18f58ac3-4b67-47ed-818b-e65d266d8adc.gif)
![tutorial](https://user-images.githubusercontent.com/72963478/137577042-2e893664-2c7b-4e12-8145-6f758bac3a99.gif)

- 가이드: 게임 규칙을 확인하고, 속성 변화에 따른 카드를 미리 볼 수 있습니다.
- 카드 조합해보기: 카드를 선택하여 조합이 가능한 지 확인할 수 있습니다. 

### 혼자하기
랭킹 / 플레이 / 랭킹 등록

![랭킹](https://user-images.githubusercontent.com/72963478/137577191-982bf7cc-0a56-4667-af4f-2bb5420617ac.png)
![플레이](https://user-images.githubusercontent.com/72963478/137577346-85b21567-882a-49f9-a674-28cf226f3a8f.png)
![랭킹 등록](https://user-images.githubusercontent.com/72963478/137577724-4d674073-744a-498e-83d7-a6e39d2a66ea.png)

- 랭킹: 혼자하기 모드에 진입하면 첫 화면에서 상위 20인의 기록을 확인할 수 있습니다.
- 플레이 화면: 플레이 중에는 플레이 시간과 남은 카드 수를 확인할 수 있습니다.
- 랭킹 등록 화면: 플레이 시간이 상위 20인 안에 든다면 원하는 닉네임으로 랭킹을 등록할 수 있습니다.

### 같이하기
방 선택

![방 선택](https://user-images.githubusercontent.com/72963478/137578991-4fdee21f-c855-48eb-9ee1-5d1877903670.png)

대기 / 플레이 / 게임결과

![대기](https://user-images.githubusercontent.com/72963478/137578214-a372cc87-87ff-4b9a-9b9a-71b42a052a30.gif)
![플레이](https://user-images.githubusercontent.com/72963478/137578450-ead13cae-1289-4ef5-b1b2-45c974c77e98.gif)
![결과](https://user-images.githubusercontent.com/72963478/137578849-a6ddd770-e81c-4c9b-a770-e93e665fb612.png)

- 방 선택: 방 이름과 닉네임, 화상통화 설정을 선택한 후 방에 입장할 수 있습니다.
- 대기
  - 화상통화와 함께 채팅을 할 수 있습니다
  - 방에 있는 모든 플레이어가 준비를 하면, 방장은 게임을 시작할 수 있습니다.
- 플레이
  - SET 버튼을 누른 후, 5초 간 카드를 선택할 수 있습니다.
  - 만약 5초 동안 조합을 완성하지 못한다면, 5초 동안 SET 버튼이 비활성화됩니다.
- 게임결과: 게임 결과를 확인하고 대기상태로 돌아갈 수 있습니다.

## 개발 과정
이 프로젝트는 총 3주의 기간을 거쳐 구현하였습니다.

### 1주차: 기획
  - simple-peer 라이브러리 시연
  - [카드 제작](#카드-제작-과정)
  - 목업: [Figma](https://www.figma.com/file/vSOrS4IR4D2XlizT8qo7bR/SET-GEMS-Mockup?node-id=0%3A1)
  - 데이터베이스 스키마: [Lucid Chart](https://lucid.app/lucidchart/dab0b8b7-bcc2-463c-9993-3081e038c37c/view)
  - 태스크 보드: [Github Project](https://github.com/orgs/SET-GEMS/projects/1)

### 2주차: 개발
  - [서버] express 설정, 소켓 연결
  - [클라이언트] 웰컴 페이지, 혼자하기 모드, 같이하기 모드
  - 배포
    - [클라이언트] netlify 배포
    - [서버] Amazon Elastic Beanstalk 배포 
  - [클라이언트] Service worker 추가

### 3주차: 마무리
  - 시범 운영 후 피드백 반영
  - 프로젝트 소개 및 ReadMe 작성
  - [서버, 클라이언트] 테스트 작성


## 카드 제작기
### 브레인스토밍
- 컨셉: 큰 보석이 장식으로 들어간 빈티지 악세사리
- 속성 후보
  - 보석의 종류: 다이아몬드, 사파이어, 에메랄드, 루비 등
  - 보석 커팅의 종류: 프린세스, 브릴리언트, 스퀘어 등
  - 보석의 개수
  - 악세사리의 종류: 목걸이, 귀걸이, 반지
  - 악세사리 금속의 종류: 금, 은, 동

### 속성 확정
- 필요 속성은 총 4가지이며 각 속성의 값은 3종류여야 한다.
- 보석의 종류: 루비, 사파이어(블루), 에메랄드 

![roval](https://user-images.githubusercontent.com/72963478/137573816-acfeceb3-c17e-422e-825d-2baec6686be8.png)
![soval](https://user-images.githubusercontent.com/72963478/137573819-19614444-d9c7-416e-b789-d1a297ea25db.png)
![eoval](https://user-images.githubusercontent.com/72963478/137573814-3c3e0042-8aaa-416c-86d5-c003b12e126f.png)

    - 유저에게 쉽게 받아들여질 수 있도록 각각 빛의 삼원색인 빨강, 파랑, 초록으로 널리 알려진 보석으로 선택하였습니다.
  
- 보석의 모양(보석 커팅의 종류): 타원형(oval), 배형(pear), 사각형(square)

![roval](https://user-images.githubusercontent.com/72963478/137573914-5f7e92f8-060c-4cf0-81a2-88ffa6fc5432.png)
![rpear](https://user-images.githubusercontent.com/72963478/137573918-8c108b88-25aa-4ccf-9c6a-b995adb6be69.png)
![rsquare](https://user-images.githubusercontent.com/72963478/137573920-9d8e3aab-8860-43fc-81f6-d9ed725b0b6b.png)

      - 세로가 긴 카드에 알맞게 보석의 형태도 세로가 길고, 너무 복잡하지 않은 커팅을 선택하였습니다.
      - 구분이 쉽도록 전부 위에서 내려다볼 때, 외곽의 형태가 확연히 다른 커팅을 선택하였습니다.
      
- 금속의 모양: 거미줄, 반복되는 문, 퍼지는 원

![white-spider](https://user-images.githubusercontent.com/72963478/137574705-c0a9b44b-bf78-413b-ba98-c0106abc0ecb.png)
![white-door](https://user-images.githubusercontent.com/72963478/137574707-b74c5917-c908-404f-91c0-084fc2c8d130.png)
![white-circle](https://user-images.githubusercontent.com/72963478/137574895-447183fb-4809-42e3-ab82-5b377adc3cc7.png)

      - 악세사리의 종류를 상징적으로 변형하였습니다.
      - 구분하기 쉽게 삼각형, 사각형, 원형의 형태를 모티브로 삼아 형태를 확정지었습니다.
      
- 금속의 종류: 옐로우골드, 화이트골드, 로즈골드

![yellow-spider](https://user-images.githubusercontent.com/72963478/137574807-665234a1-d36d-4f03-a642-1df6cf0c8e67.png)
![white-spider](https://user-images.githubusercontent.com/72963478/137574810-2ae7649d-4f70-4bfb-86f3-2c4ca7d7ffce.png)
![rose-spider](https://user-images.githubusercontent.com/72963478/137574813-ba10ca7b-9a74-463b-9aa6-001bbde16ff7.png)

      - 제작 중 금과 동의 색상 차가 확연하지 않아 로즈골드로 대체하였습니다.
      - 속성 이름들의 통일성을 위해 종류를 세 가지 다 골드로 바꾸고, 앞에 색의 이름을 넣는 형식으로 변경하였습니다.
      
### 카드 완성
- 카드에 필요한 이미지 소스는 전부 포토샵으로 제작되었습니다.
- 카드 자체는 리액트 컴포넌트로, prop으로 각 속성의 값을 받아 조합하여 필요한 이미지 소스를 불러오는 방식으로 렌더링합니다.
- 사용되는 이미지 소스는 배경 이미지, 보석 이미지 두 가지입니다.


## 에러로그

### 힌트시간을 길게 설정했을 시 잘못된 힌트가 보여짐
- 태스크 카드: [#2 혼자하기 플레이 페이지](https://github.com/SET-GEMS/set-gems-client/issues/2)
- 원인
  - 새로운 카드가 바닥에 배치될 때마다 setTimeout으로 일정 시간 후에 힌트를 보여주도록 설정
  - 힌트 시간이 다 지나기도 전에 새로운 카드가 배치됐을 경우, 이전에 예약되었던 힌트가 보여짐.
- 수정사항: 이전 hintTimer를 state로 설정하여 새로운 힌트가 생기면 이전의 힌트타이머를 제거하도록 함.

### 같이하기 방에 3명 이상 입장 시 기존의 peer의 연결이 끊김
- 태스크 카드: [#6 같이하기 대기 페이지](https://github.com/SET-GEMS/set-gems-client/issues/6)
- 원인: socket의 이벤트리스너가 중복으로 등록되면서 같은 peer가 반복적으로 생성되어 연결이 끊김
- 수정사항: useEffect의 반환값에서 socket.removeAllListeners 메소드로 socket 이벤트리스너를 정리함.

### 플레이 중 플레이어 퇴장 시 카운트다운 멈춤
- 태스크 카드: [#21 커스텀 훅 사용으로 관심사 분리](https://github.com/SET-GEMS/set-gems-client/issues/21)
- 원인
  - socket의 이벤트리스너들을 hook으로 분리하여 각각 Player컴포넌트에서 등록하게 함.
  - socket 이벤트의 정리는 이전과 같이 socket.removeAllListeners를 사용.
  - 플레이어가 나가면 Player 컴포넌트가 언마운트 되면서 다른 컴포넌트에서 사용중인 socket의 이벤트리스너까지 전부 지워짐.
- 수정사항: 중복으로 사용되는 이벤트의 경우, socket.off 메소드로 개별 이벤트리스너를 지우는 방식으로 바꿈.

### 퇴장 후 재입장 시 화상연결이 되지 않음
- 태스크 카드: [#7 같이하기 게임 플레이 페이지](https://github.com/SET-GEMS/set-gems-client/issues/7)
- 원인
  - 플레이어가 퇴장 후 남은 플레이어의 Peer는 peer.destroy 메소드를 이용하여 정리를 함.
  - 퇴장하는 플레이어에서도 state를 정리하면서 peers를 빈 배열로 바꿈.
  - 하지만 peers 배열에 담긴 peer를 따로 종료시키지는 않음.
  - 플레이어가 방에 재입장 시 다시 peer를 생성해도 peer id가 같아 기존 peer로 인식.
  - 남은 플레이어쪽에서 재입장한 유저의 정보를 받아 peer를 다시 생성하더라도 이미 파괴된 것으로 인식하여 연결되지 않음.
- 플레이어 퇴장 시 peers를 빈 배열로 재설정할 때, 기존 peers에 담긴 peer들도 peer.destroy 메소드로 정리함.

### Service Worker 적용 후, 서버와의 연결이 끊김
- 태스크 카드: [#29 프로그레시브 웹 앱 적용](https://github.com/SET-GEMS/set-gems-client/issues/29)
- 원인: service worker의 fetch 이벤트리스너가 cors 요청을 처리하지 못함.
- 수정: cors 요청은 service worker의 feth 이벤트 리스너가 처리하지 않게 조건문으로 cors요청을 걸러냄.
