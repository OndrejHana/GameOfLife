import { useEffect, useState } from "react";
import "./App.css";
import MapGrid from "./Map";
import { invoke } from "@tauri-apps/api";
import { listen, once, emit } from "@tauri-apps/api/event";

export type Map = {
	map: boolean[][];
};

function App() {
	const [map, setMap] = useState<Map | undefined>(undefined);
  const [isRunning, setIsRunning] = useState(false);

	useEffect(() => {
		invoke("init").then((value) => setMap(value as Map));
	}, []);

	async function handleStart() {
		invoke("start");
    setIsRunning(true);

		const unlisten = await listen("tick", (event) => {
			const map = { map: event.payload as boolean[][] } satisfies Map;
      setMap(map);
		});

    once("end", ()=> {
      setIsRunning(false);
      unlisten();
    });

    return () => {
      unlisten();
    }
	}

  async function handleStop() {
    emit("stop");
    setIsRunning(false);
  }

  async function handleReset() {
    const map = await invoke("reset");
    setMap(map as Map);
  }

	if (!map) {
		return <h1>Loading</h1>;
	}

	return (
		<div>
			<MapGrid map={map} />
      {isRunning? (
        <button onClick={handleStop}>Stop!</button>
      ): (
        <div style={{ display: "flex" }}>
          <button onClick={handleStart}>Start!</button>
          <button onClick={handleReset}>Reset!</button>
        </div>
      )}
		</div>
	);
}

export default App;
