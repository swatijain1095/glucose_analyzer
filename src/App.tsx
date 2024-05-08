import { createContext, useState } from "react";
import ChartsSetup from "./component/Charts/ChartsSetup";
import UploadFile from "./component/UploadFile/UploadFile";
import Widgets from "./component/Widget/Widgets";
import { MainData } from "./types";

const initialState = {
  glucoseData: [],
  insulinData: [],
};

const DataContext = createContext<MainData>(initialState);
function App() {
  const [data, setData] = useState<MainData>(initialState);
  return (
    <DataContext.Provider value={data}>
      <div className="main-container">
        <UploadFile setData={setData} />
        <Widgets />
        <ChartsSetup />
      </div>
    </DataContext.Provider>
  );
}

export default App;
