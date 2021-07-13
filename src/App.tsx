import "./App.css";
import Pie from "./Pie";
import Donut from "./Donut";
import Radar from "./Radar";
import Counties from "./Counties";
import RoundedDonut from "./RoundedDonut";
import IncompleteRoundDoughnut from "./IncompleteRoundDoughnut";

function App() {
  return (
    <div className='App'>
      <Pie />
      <Donut />
      <Radar />
      <Counties />
      <RoundedDonut />
      <IncompleteRoundDoughnut />
    </div>
  );
}

export default App;
