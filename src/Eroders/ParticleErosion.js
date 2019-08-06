import HeightMap from './../HeightMap';
import Vector2 from './../Vectors';
import * as THREE from 'three';

var lerp = (a, b, f) => { return a + f * (b - a); }										//Basic linear interpolation
var bilerp = (a, b, c, d, u, v) => { return lerp(lerp(a, b, u), lerp(c, d, u), v); }	//Bilinear interpolation

/*
	An implementation of the particle-based hydraulic erosion method introduced by Hans Theobald Beyer
	Link: https://www.firespark.de/resources/downloads/implementation%20of%20a%20methode%20for%20hydraulic%20erosion.pdf

	Simulates a number of droplets falling on the map and rolling around, eroding and depositing sediment.
	Each droplet moves one space each step, and updates its velocity, water, sediment, direction, position, and steps taken.
	Effects can be changed by modifying params; intending to move this to UI later.

	This particle-based model provides many advantages, including executing in O(1) time, as opposed to flow-based models which run in O(n^2) time.
*/

const params = {
	inertia: 0,		//How much previous direction affects direction change: 0 means only gradient matters, 1 means only previous direction
	gravity: -9.81,		//Gravity constant
	minSlope: 0.01,		//Minimum slope to ensure visible effects
	capacity: 8,		//Capacity coefficient for droplets
	maxSteps: 500,		//Maximum number of steps for a droplet
	evaporation: 0.02,	//Evaporation factor
	erosion: 0.7,		//Erosion factor
	deposition: 0.2,	//Deposition factor
	radius: 2,			//Radius of erosion
	minSedimentCapacity: .01
}

const makeSphere = (x, y, z, color) =>
{
	const height = 4;
	const meshSize = 33;
	var sizeFactor = meshSize / 257;

	let geometry = new THREE.SphereGeometry(0.05, 32, 32);
	geometry.computeVertexNormals();
	let mat = new THREE.MeshLambertMaterial( {color: color} );
	let mesh = new THREE.Mesh(geometry, mat);

	mesh.position.set((x - 257/2) * sizeFactor, y * height - height/2, (z - 257/2) * sizeFactor);

	return mesh;
}

const ParticleErosion = (map, erosions, inertia, gravity, minSlope, capacity, maxSteps, evaporation, erosion, deposition, radius, callback) =>
{
	if (erosions > 10)
		var debug = false;
	else
		var debug = true;

	radius = parseInt(radius);

	const diameter = radius * 2;

	let weights = new Float32Array(diameter**2);

	let totalWeight = 0;

	for (let y = 0; y < diameter; y++)
		for (let x = 0; x < diameter; x++)
		{
			let weight = Math.max(radius - Math.sqrt((x - (radius-1))**2 + (y - (radius-1))**2), 0);
			totalWeight += weight;
			weights[y * diameter + x] = weight;
		}

	weights.map(weight => { return weight / totalWeight; });

	for (let d = 0; d < erosions; d++)
	{
		let pos = [Math.random() * map.size, Math.random() * map.size];
		let	dir = [map.grad(pos[0], pos[1])[0], map.grad(pos[0], pos[1])[1]];
		let vel = 1;
		let water = 1;
		let sediment = 0;

		if (debug) callback(makeSphere(pos[0], map.get(pos[0], pos[1]), pos[1], 0xffffff));

		for (let s = 0; s < maxSteps; s++)
		{
			let x = Math.floor(pos[0]);
			let y = Math.floor(pos[1]);
			let u = pos[0] % 1.0;
			let v = pos[1] % 1.0;

			let currHeight = map.get(pos[0], pos[1]);
			let gradient = map.grad(pos[0], pos[1]);

			dir = [dir[0] * inertia - gradient[0] * (1-inertia), dir[1] * inertia - gradient[1] * (1-inertia)];

			if (dir[0] == 0 && dir[1] == 0)
				dir = [Math.random(), Math.random()];

			let dirLength = Math.sqrt(dir[0]**2 + dir[1]**2);

			dir[0] /= dirLength;
			dir[1] /= dirLength;

			//if (debug) console.log("Dir is " + dir[0] + ", " + dir[1]);

			let newPos = [pos[0] + dir[0], pos[1] + dir[1]];

			if (map.outOfBounds(newPos[0], newPos[1]))
				break;

			let diff = map.get(newPos[0], newPos[1]) - map.get(pos[0], pos[1]);

			let sedimentCapacity = Math.max(-diff * vel * water * capacity, params.minSedimentCapacity);

			if (diff > 0 || sediment > sedimentCapacity)
			{
				
				let amount = diff > 0 ? Math.min(sediment, diff) : (sediment - sedimentCapacity) * deposition;

				map.change(x, y, amount * (1-u) * (1-v));
				map.change(x+1, y, amount * u * (1-v));
				map.change(x, y+1, amount * (1-u) * v);
				map.change(x+1, y+1, amount * u * v);

				if (debug) callback(makeSphere(pos[0], map.get(pos[0], pos[1]), pos[1], 0x0000ff));

				sediment -= amount;
			}
			else
			{
				
				let amount = Math.min((sedimentCapacity - sediment) * erosion, -diff);

				if (debug)
					console.log("Erode " + amount + ". Calculated by Math.min((" + sedimentCapacity + " - " + sediment + ") * " + erosion + ", " + -diff + ");");

				map.change(x, y, -amount * (1-u) * (1-v));
				map.change(x+1, y, -amount * u * (1-v));
				map.change(x, y+1, -amount * (1-u) * v);
				map.change(x+1, y+1, -amount * u * v);

				if (debug) callback(makeSphere(pos[0], map.get(pos[0], pos[1]), pos[1], 0xff0000));

				sediment += amount;
			}

			vel = Math.sqrt(Math.max(vel**2 + diff * gravity, 0));

			if (vel == 0)
				break;

			water *= (1-evaporation);
			pos = newPos;
		}
	}
}

/*let erosionBrushIndices = [];
let erosionBrushWeights = [];

const ParticleErosion = (map) =>
{
	let inertia = 0;		//How much previous direction affects direction change = 0 means only gradient matters, 1 means only previous direction
	let gravity = -9.81;	//Gravity constant
	let minSlope = 0.01;	//Minimum slope to ensure visible effects
	let capacity = 2;	//Capacity coefficient for droplets
	let maxSteps = 500;	//Maximum number of steps for a droplet
	let evaporation = 0.02;//Evaporation factor
	let erosion = 0.7;	//Erosion factor
	let deposition = 0.2;//Deposition factor
	let radius = 2;		//Radius of erosion
	let minSedimentCapacity = .01

	InitializeBrushIndices(map.size, radius);

    for (let iteration = 0; iteration < 100; iteration++) {
        // Create water droplet at random point on map
        let posX = Math.random() * (map.size-1);
        let posY = Math.random() * (map.size-1);
        let dirX = 0;
        let dirY = 0;
        let speed = 1;
        let water = 1;
        let sediment = 0;

        //console.log("Drop started at " + posX + ", " + posY);

        for (let lifetime = 0; lifetime < 64; lifetime++) {
        	//console.log("Pos is " + posX + ", " + posY);
            let nodeX = Math.floor(posX);
            let nodeY = Math.floor(posY);
            let dropletIndex = nodeY * map.size + nodeX;
            // Calculate droplet's offset inside the cell (0,0) = at NW node, (1,1) = at SE node
            let cellOffsetX = posX - nodeX;
            let cellOffsetY = posY - nodeY;

            //if (posX >= map.size-1 || posY >= map.size-1)
            //	console.log("OOB: " + posX + ", " + posY);

            // Calculate droplet's height and direction of flow with bilinear interpolation of surrounding heights
            let heightAndGradient = CalculateHeightAndGradient (map, posX, posY);

            // Update the droplet's direction and position (move position 1 unit regardless of speed)
            dirX = (dirX * inertia - heightAndGradient.gradientX * (1 - inertia));
            dirY = (dirY * inertia - heightAndGradient.gradientY * (1 - inertia));

            //if (!dirX)
            //	console.log("Gradient is " + heightAndGradient.gradientX + ", " + heightAndGradient.gradientY);
            // Normalize direction
            let len = Math.sqrt(dirX * dirX + dirY * dirY);
            if (len != 0) {
                dirX /= len;
                dirY /= len;
            }
            posX += dirX;
            posY += dirY;

            // Stop simulating droplet if it's not moving or has flowed over edge of map
            if ((dirX == 0 && dirY == 0) || posX < 0 || posX >= map.size - 1 || posY < 0 || posY >= map.size - 1) {
                break;
            }

            // Find the droplet's new height and calculate the deltaHeight
            let newHeight = CalculateHeightAndGradient (map, posX, posY).height;
            let deltaHeight = newHeight - heightAndGradient.height;

            //console.log(heightAndGradient.height + ", " + newHeight + ", " + deltaHeight);

            // Calculate the droplet's sediment capacity (higher when moving fast down a slope and contains lots of water)
            let sedimentCapacity = Math.max(-deltaHeight * speed * water * capacity, minSedimentCapacity);

            if (sedimentCapacity > 1)
            {
           		console.log("At " + posX + ", " + posY + ", sedimentCapacity is " + sedimentCapacity);
           		console.log("Deltaheight is " + deltaHeight + ", speed is " + speed + ", water is " + water + ", capacity is " + capacity);
            }

            // If carrying more sediment than capacity, or if flowing uphill:
            if (sediment > sedimentCapacity || deltaHeight > 0) 
            {
                // If moving uphill (deltaHeight > 0) try fill up to the current height, otherwise deposit a fraction of the excess sediment
                let amountToDeposit = (deltaHeight > 0) ? Math.min (deltaHeight, sediment) : (sediment - sedimentCapacity) * deposition;
                sediment -= amountToDeposit;

                //console.log("Deposit " + amountToDeposit);

                // Add the sediment to the four nodes of the current cell using bilinear interpolation
                // Deposition is not distributed over a radius (like erosion) so that it can fill small pits
                map.change(posX, posY, amountToDeposit * (1 - cellOffsetX) * (1 - cellOffsetY));
                map.change(posX+1, posY, amountToDeposit * cellOffsetX * (1 - cellOffsetY));
                map.change(posX, posY+1, amountToDeposit * (1 - cellOffsetX) * cellOffsetY);
                map.change(posX+1, posY+1, amountToDeposit * cellOffsetX * cellOffsetY);

            } 
            else 
            {

            	let dropletIndex = nodeX + map.size * nodeY;
                let amountToErode = Math.min ((sedimentCapacity - sediment) * erosion, -deltaHeight);

                if (!erosionBrushIndices[dropletIndex])
                {
                	console.log("Pos is " + posX + ", " + posY + ", Index is " + dropletIndex + ", erosionBrushIndices is ");
                	console.log(erosionBrushIndices);
                }

                // Use erosion brush to erode from all nodes inside the droplet's erosion radius
                for (let brushPointIndex = 0; brushPointIndex < erosionBrushIndices[dropletIndex].length; brushPointIndex++) {
                    let nodeIndex = erosionBrushIndices[dropletIndex][brushPointIndex];
                    let brushY = Math.floor(nodeIndex / map.size);
                    let brushX = nodeIndex % map.size;
                    let weighedErodeAmount = amountToErode * erosionBrushWeights[dropletIndex][brushPointIndex];
                    let deltaSediment = (map.get(brushX, brushY) < weighedErodeAmount) ? map.get(brushX, brushY) : weighedErodeAmount;

                    //if (deltaSediment > 0.03)
                    //{
                    //	console.log("At " + posX + ", " + posY + " eroding " + brushX + ", " + brushY + " by " + deltaSediment + ", height now " + (map.get(brushX, brushY) - deltaSediment));
                    //	console.log("Sediment was " + sediment + ", will now be " + sediment + deltaSediment);
                    //	console.log("Amount to erode is " + amountToErode + ", erosionBrushWeights[" + dropletIndex + "][" + brushPointIndex + "] is " + erosionBrushWeights[dropletIndex][brushPointIndex]);
                    //	console.log("Sediment is " + sediment + ", sedimentCapacity is " + sedimentCapacity);
                    //}

                    //if (Number.isNaN(deltaSediment))
                    //{
                    //	console.log("deltaSediment is NaN at " + brushX + ", " + brushY + ", height " + map.get(brushX, brushY));
                    //	console.log("weighedErodeAmount is " + weighedErodeAmount);
                    //}
                    map.change(brushX, brushY, -deltaSediment);

                    //if (map.get(brushX, brushY) == 0)
                    //{
                    //	console.log("From " + nodeX + ", " + nodeY + ", Eroded " + deltaSediment + " at " + brushX + ", " + brushY + ", Val was " + oldHeight + ", is now " + map.get(brushX, brushY));
                    //	console.log("This is step " + lifetime);
                    //}

                    sediment += deltaSediment;
                }
            }

            // Update droplet's speed and water content
            speed = Math.sqrt (speed * speed + deltaHeight * gravity);
            water *= (1 - evaporation);

            //console.log("Pos is " + posX + ", " + posY);
        }
    }
}

const InitializeBrushIndices = (mapSize, radius) =>
{
    erosionBrushIndices = [];
    erosionBrushWeights = [];

    let xOffsets = [];
    let yOffsets = [];
    let weights = [];
    let weightSum = 0;
    let addIndex = 0;

    for (let i = 0; i < mapSize * mapSize; i++) {
        let centreX = i % mapSize;
        let centreY = Math.floor(i / mapSize);

        if (centreY <= radius || centreY >= mapSize - radius || centreX <= radius + 1 || centreX >= mapSize - radius) {
            weightSum = 0;
            addIndex = 0;
            for (let y = -radius; y <= radius; y++) {
                for (let x = -radius; x <= radius; x++) {
                    let sqrDst = x * x + y * y;
                    if (sqrDst < radius * radius) {
                        let coordX = centreX + x;
                        let coordY = centreY + y;

                        if (coordX >= 0 && coordX < mapSize && coordY >= 0 && coordY < mapSize) {
                            let weight = 1 - Math.sqrt (sqrDst) / radius;
                            weightSum += weight;
                            weights[addIndex] = weight;
                            xOffsets[addIndex] = x;
                            yOffsets[addIndex] = y;
                            addIndex++;
                        }
                    }
                }
            }
        }

        let numEntries = addIndex;
        //console.log("There are " + numEntries + " entries at " + i);
        erosionBrushIndices[i] = [];
        erosionBrushWeights[i] = [];

        for (let j = 0; j < numEntries; j++) {
            erosionBrushIndices[i][j] = (yOffsets[j] + centreY) * mapSize + xOffsets[j] + centreX;
            erosionBrushWeights[i][j] = weights[j] / weightSum;
        }
    }
}

const CalculateHeightAndGradient = (map, posX, posY) => 
{
        let coordX = Math.floor(posX);
        let coordY = Math.floor(posY);

        // Calculate droplet's offset inside the cell (0,0) = at NW node, (1,1) = at SE node
        let x = posX - coordX;
        let y = posY - coordY;

        // Calculate heights of the four nodes of the droplet's cell
        let nodeIndexNW = coordY * map.size + coordX;
        let heightNW = map.get(coordX, coordY);
        let heightNE = map.get(coordX+1, coordY);
        let heightSW = map.get(coordX, coordY+1);
        let heightSE = map.get(coordX+1, coordY+1);

        //if (!heightSE)
        //	console.log("pos is " + posX + ", " + posY);

        // Calculate droplet's direction of flow with bilinear interpolation of height difference along the edges
        let gradientX = (heightNE - heightNW) * (1 - y) + (heightSE - heightSW) * y;
        let gradientY = (heightSW - heightNW) * (1 - x) + (heightSE - heightNE) * x;

        if (Number.isNaN(gradientX))
        {
        	console.log("Pos is " + posX + ", " + posY + ", corners are " + heightNW + ", " + heightNE + ", " + heightSW + ", " + heightSE);
        	console.log("gradientX is (" + heightNE + "-" + heightNW + ") * " + (1-y) + " + (" + heightSE + "-" + heightSW + ") * " + y);
        }

        // Calculate height with bilinear interpolation of the heights of the nodes of the cell
        let height = heightNW * (1 - x) * (1 - y) + heightNE * x * (1 - y) + heightSW * (1 - x) * y + heightSE * x * y;

        return { height: height, gradientX: gradientX, gradientY: gradientY };
    }*/

export default ParticleErosion;

