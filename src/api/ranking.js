const serverUrl = process.env.REACT_APP_SERVER_URL + "/ranking";

const useMock = false;

async function getRanking() {
  if (!useMock) {
    const res = await fetch(serverUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw Error(res.statusText);
    }

    try {
      const data = await res.json();
      return data.ranking;
    } catch(err) {
      throw err;
    }
  }

  const res = await fetch("/mock/ranking.json", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const data = await res.json();
  return data;
}

async function postRanking(data) {
  if (!useMock) {
    const res = await fetch(serverUrl, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw Error(res.statusText);
    }
  }

  return true;
}

export { getRanking, postRanking };
