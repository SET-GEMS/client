import React, { useState } from "react";

import Welcome from "./pages/Welcome";
import Single from "./pages/Single";
import Multi from "./pages/Multi";
import { SINGLE, MULTI } from "./constants/mode";

function App() {
  const [mode, setMode] = useState("");
  const handleHomeButtonClick = () => setMode("");

  return (
    <div className="App">
      {!mode && <Welcome onSelectMode={setMode} />}
      {mode === SINGLE
        && <Single onHomeButtonClick={handleHomeButtonClick} />}
      {mode === MULTI
        && <Multi onHomeButtonClick={handleHomeButtonClick} />}
    </div>
  );
}

export default App;
