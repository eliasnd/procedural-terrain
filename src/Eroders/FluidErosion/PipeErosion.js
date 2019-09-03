//Physical params
const gravity = 9.81;			//m/s^2
const density = 997;			//kg/m^3
const atmoPressure = 101.3; 	//kPa
const friction = 0.9995;		//Not scientific

//Model params
const cellCount = 3;

//Time params
const timeStep = 500;				//5 ms
const timeOut = 1000;			//50 seconds

const debug = false;

const simulate = (waterMap, landMap) =>
{
	let { columns, pipes } = init(waterMap, landMap);
	let columnSize = landMap ? landMap.size / waterMap.size : 257 / waterMap.size;
	let size = waterMap.size;

	const getCol = (x, y) => columns[y * size + x];

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
				let [x1, y1, c1] = [...pipe.head];
				let [x2, y2, c2] = [...pipe.tail];

				let headCol = getCol(x1, y1);
				let tailCol = getCol(x2, y2);

				let headCell = headCol[c1];
				let tailCell = tailCol[c2];

				let crossSection = (Math.min(headCell.top, tailCell.top) - Math.max(headCell.bottom, tailCell.bottom)) * columnSize;

				if (debug && crossSection <= 0)
				{
					console.log('crossSection: ' + crossSection);
					console.log(headCell);
					console.log(tailCell);
					console.log('columnSize: ' + columnSize); 
				}

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

			for (let y = 0; y < size; y++)
				for (let x = 0; x < size; x++)
				{
					let column = getCol(x, y);

					let oldHeight = columnHeight(column);

					setBounds(column);
					waterMap.set(x, y, columnHeight(column));

					if (columnHeight(column) !== oldHeight)// && debug)
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

	let columnSize = landMap ? landMap.size / waterMap.size : 257 / waterMap.size;

	for (let y = 0; y < waterMap.size; y++)
		for (let x = 0; x < waterMap.size; x++)
		{
			let height = waterMap.get(x, y) / cellCount;

			columns[y * waterMap.size + x] = [];		//Columns will now be arrays of cells

			for (let c = 0; c < cellCount; c++)		//Cells initialized with volume, top, and bottom
				columns[y * waterMap.size + x].push(
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

	for (let y = 0; y < waterMap.size-1; y++)		//Each cell initializes its own down-left, down, down-right, and right pipes, so skip last row
		for (let x = 0; x < waterMap.size; x++)
		{
			if (x > 0)
				pipes.push(...connectColumns(x, y, x-1, y+1)); 		//Down-left pipes

			pipes.push(...connectColumns(x, y, x, y+1));			//Down pipes

			if (x < waterMap.size-1)
			{
				pipes.push(...connectColumns(x, y, x+1, y+1));		//Down-right pipes
				pipes.push(...connectColumns(x, y, x+1, y));		//Right pipes
			}
		}

	return { columns, pipes };
}

export default simulate;
