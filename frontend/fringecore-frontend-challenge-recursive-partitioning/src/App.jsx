
import React from "react";
import { observer } from "mobx-react-lite";
import Partition from "./components/Partition";
import store from "./store/PartitionStore";
import "./styles/App.css";

const App = observer(() => {
  return (
    <div className="app-container">
      {store.partitions.map((partition) => (
        <Partition key={partition.id} partition={partition} store={store} />
      ))}
    </div>
  );
});

export default App;

