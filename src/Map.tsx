import * as React from "react";
import { Map } from "./App";

function MapGrid({ map }: { map: Map }) {
	return (
		<div>
			{map.map.map((row, y) => (
				<div
					key={y}
					style={{
						margin: 0,
						padding: 0,
						display: "flex",
					}}
				>
					{row.map((cell, x) => (
						<div
							key={x}
							style={{
								width: 10,
								height: 10,
								margin: 0,
								padding: 0,
								backgroundColor: cell ? "black" : "white",
								border: "1px solid black",
								display: "inline-block",
							}}
						/>
					))}
				</div>
			))}
		</div>
	);
}

export default MapGrid;
