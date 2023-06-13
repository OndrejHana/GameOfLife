import { useEffect, useState } from "react";
import "./App.css";
import MapGrid from "./Map";
import { invoke } from "@tauri-apps/api";
import { listen, once } from "@tauri-apps/api/event";

export type Map = {
	map: boolean[][];
};

function App() {
	const [map, setMap] = useState<Map | undefined>(undefined);

	useEffect(() => {
		invoke("init").then((value) => setMap(value as Map));
	}, []);

	async function handleStart() {
		invoke("start");

		const unlisten = await listen("tick", (event) => {
			const map = { map: event.payload as boolean[][] } satisfies Map;
      setMap(map);
		});

    once("end", ()=> unlisten());

    return () => {
      unlisten();
    }
	}

	if (!map) {
		return <h1>Loading</h1>;
	}

	return (
		<div>
			<MapGrid map={map} />
			<button onClick={handleStart}>Start!</button>
		</div>
	);
}

export default App;
