import MeshMap from './../../HeightMap';

//Physical params
const gravity = 9.81;			//m/s^2
const density = 997;			//kg/m^3
const atmoPressure = 101.3; 	//kPa
const friction = 0.9995;		//Not scientific

//Model params
const resolution = 16;
const cellCount = 3;

//Time params
const timeStep = 50;				//5 ms
const timeOut = 10000;			//50 seconds

const debug = false;

const simulate = (waterMap, landMap) =>
{
	let { columns, pipes } = init(waterMap, landMap);
	let columnSize = waterMap.size / resolution;

	const columnHeight = (col) => col[cellCount-1].top - col[0].bottom;

	const setBounds = (col) => {
		for (let c = 0; c < cellCount; c++)
		{
			col[c].bottom = col[c-1] ? col[c-1].top : 0;
			col[c].top = col[c].bottom + col[c].volume / columnSize**2;
		}
	};

	for (let t = 0; t < timeOut; t += timeStep)
	{
		setTimeout(function () 
		{
			for (let p = 0; p < pipes.length; p++)		//Update pipe flow and calculate volume through each pipe
			{
				let pipe = pipes[p];

				let headCol = columns[pipe.head[1] * resolution + pipe.head[0]];
				let tailCol = columns[pipe.tail[1] * resolution + pipe.tail[0]];

				let headCell = headCol[pipe.head[2]];
				let tailCell = tailCol[pipe.tail[2]];

				let crossSection = (Math.min(headCell.top, tailCell.top) - Math.max(headCell.bottom, tailCell.bottom)) * columnSize;

				if (crossSection > 0)		//Cross section less than 0 means cells are not adjacent
				{
					let headPressure = columnHeight(headCol) * density * gravity + atmoPressure;
					let tailPressure = columnHeight(tailCol) * density * gravity + atmoPressure;

					pipe.flow = friction * pipe.flow + timeStep * (headPressure - tailPressure) / (density * pipe.length);		//Update pipe flow by pressure at head and tail

					let deltaVolume = timeStep * pipe.flow * crossSection;

					if (deltaVolume > tailCell.volume)			//Ensure no negative volumes
						deltaVolume = tailCell.volume;
					else if (deltaVolume < -headCell.volume)
						deltaVolume = -headCell.volume;

					if (debug)
					{
						console.log('Pipe: ')
						console.log('		Length: ' + pipe.length);
						console.log('		Head: ' + pipe.head[0] + ', ' + pipe.head[1] + ', ' + pipe.head[2]);
						console.log('			Volume: ' + headCell.volume);
						console.log('			Column height: ' + columnHeight(headCol));
						console.log('		Tail: ' + pipe.tail[0] + ', ' + pipe.tail[1] + ', ' + pipe.tail[2]);
						console.log('			Volume: ' + tailCell.volume);
						console.log('			Column height: ' + columnHeight(tailCol));
						console.log('		Cross section: ' + crossSection);
						console.log('		Flow: ' + pipe.flow);
						console.log('			Pressure: ' + headPressure + ' --> ' + tailPressure);
						console.log('		Delta Volume: ' + deltaVolume);
					}

					headCell.volume -= deltaVolume;

					tailCell.volume += deltaVolume;

					if (debug)
					{
						console.log('New Volumes: ');
						console.log('		Head: ' + headCell.volume);
						console.log('		Tail: ' + tailCell.volume);
					}
				}
			}

			for (let y = 0; y < resolution; y++)
				for (let x = 0; x < resolution; x++)
				{
					let column = columns[y * resolution + x];

					let oldHeight = columnHeight(column);

					setBounds(column);
					waterMap.setRange(x * columnSize, y * columnSize, (x+1) * columnSize, (y+1) * columnSize, columnHeight(column));

					if (columnHeight(column) !== oldHeight && debug)
					{
						console.log('Changed height at ' + x + ', ' + y + ' from ' + oldHeight + ' to ' + columnHeight(column));
						console.log('map now has val ' + waterMap.get(x, y));
					}
				}
		}, 
		timeStep);
	}
}

const init = (waterMap, landMap) => 
{
	//----------- Create Columns -----------//

	let columns = [];

	let columnSize = waterMap.size / resolution;

	for (let y = 0; y < resolution; y++)			//Condensce waterMap to array of columns with size resolution * resolution
		for (let x = 0; x < resolution; x++)
		{	
			let heights = [];							//Average values in columnSize * columnSize area

			for (let cy = y * columnSize; cy < (y+1) * columnSize; cy++)		
				for (let cx = x * columnSize; cx < (x+1) * columnSize; cx++)
					heights.push(waterMap.get(cx, cy));

			columns[y * resolution + x] = heights.reduce( (total, curr) => total + curr ) / heights.length;		//Initialize columns to contain heights
		}

	for (let y = 0; y < resolution; y++)
		for (let x = 0; x < resolution; x++)
		{
			let height = columns[y * resolution + x] / cellCount;

			columns[y * resolution + x] = [];		//Columns will now be arrays of cells

			for (let c = 0; c < cellCount; c++)		//Cells initialized with volume, top, and bottom
				columns[y * resolution + x].push(
				{
					volume: height * columnSize**2,
					top: height * (c+1),
					bottom: height * c
				});
		}

	//----------- Create Pipes -----------//

	let pipes = [];

	const connectColumns = (x1, y1, x2, y2) => 		//Connect all cells of both columns now to avoid having to make more pipes later
	{			
		let columnPipes = [];

		for (let c1 = 0; c1 < cellCount; c1++)
			for (let c2 = 0; c2 < cellCount; c2++)
				columnPipes.push({
					head: [x1, y1, c1],
					tail: [x2, y2, c2],
					length: Math.sqrt(((x1 * columnSize + columnSize/2) - (x2 * columnSize + columnSize/2))**2 + ((y1 * columnSize + columnSize/2) - (y2 * columnSize + columnSize/2))**2),
					flow: 0
				});

		return columnPipes;
	}

	for (let y = 0; y < resolution-1; y++)		//Each cell initializes its own down-left, down, down-right, and right pipes, so skip last row
		for (let x = 0; x < resolution; x++)
		{
			if (x > 0)
				pipes.push(...connectColumns(x, y, x-1, y+1)); 		//Down-left pipes

			pipes.push(...connectColumns(x, y, x, y+1));			//Down pipes

			if (x < resolution-1)
			{
				pipes.push(...connectColumns(x, y, x+1, y+1));		//Down-right pipes
				pipes.push(...connectColumns(x, y, x+1, y));		//Right pipes
			}
		}

	return { columns, pipes };
}

export default simulate;
