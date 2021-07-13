import "./App.css";
import Pie from "./Pie";
import Donut from "./Donut";
import Radar from "./Radar";
import Counties from "./Counties";
import RoundedDonut from "./RoundedDonut";

function App() {
  return (
    <div className='App'>
      <Pie />
      <Donut />
      <Radar />
      <Counties />
      <RoundedDonut />
    </div>
  );
}

export default App;
