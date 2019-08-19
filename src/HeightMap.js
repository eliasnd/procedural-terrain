var lerp = (a, b, f) => { return a + f * (b - a); }										//Basic linear interpolation
var bilerp = (a, b, c, d, u, v) => { return lerp(lerp(a, b, u), lerp(c, d, u), v); }	//Bilinear interpolation

const height = 8;
const meshSize = 33;

class HeightMap 
{
	constructor(size)
	{
		this.map = new Float32Array(size**2 * 3);
		this.size = size;
		this.sizeFactor = meshSize / size;

		for (let y = 0; y < size; y++)
			for (let x = 0; x < size; x++)
			{
				let index = (y * size + x) * 3;
				this.map[index] = (x - size/2) * this.sizeFactor;
				this.map[index+1] = -height/2;
				this.map[index+2] = (y - size/2) * this.sizeFactor;
			}
	}

	unscale(num)
	{
		return (num + height/2) / height;
	}

	get(x, y)
	{
		if (Number.isInteger(x) && Number.isInteger(y))
			return this.unscale(this.map[(y * this.size + x) * 3 + 1]);
		else
		{
			let unitX = Math.floor(x);
			let unitY = Math.floor(y);
			let xOffset = x % 1.0;
			let yOffset = y % 1.0;
			let nextX = Math.min(this.size-1, unitX+1);
			let nextY = Math.min(this.size-1, unitY+1);

			return bilerp(this.unscale(this.map[(unitY * this.size + unitX) * 3 + 1]), this.unscale(this.map[(unitY * this.size + nextX) * 3 + 1]), 
						  this.unscale(this.map[(nextY * this.size + unitX) * 3 + 1]), this.unscale(this.map[(nextY * this.size + nextX) * 3 + 1]), 
						  xOffset, yOffset);
		}
	}

	set(x, y, val)
	{
		this.map[(y * this.size + x) * 3 + 1] = val * height - height/2;
	}

	setRange(x1, y1, x2, y2, val)
	{
		for (let y = y1; y < y2; y++)
			for (let x = x1; x < x2; x++)
				this.map[(y * this.size + x) * 3 + 1] = val * height - height/2;
	}

	setAll(val)
	{
		for (let i = 1; i < this.map.length; i+=3)
			this.map[i] = val * height - height/2;
	}

	change(x, y, val)
	{
		this.map[(y * this.size + x) * 3 + 1] += val;
	}

	outOfBounds(x, y)
	{
		return x < 0 || x >= this.size || y < 0 || y >= this.size;
	}

	grad(x, y)
	{
		let xOffset = x % 1.0;
		let yOffset = y % 1.0;
		let unitX = Math.floor(x);
		let unitY = Math.floor(y);
		let nextX = Math.min(this.size-1, unitX + 1);
		let nextY = Math.min(this.size-1, unitY + 1);

		let top = this.get(nextX, unitY) - this.get(unitX, unitY);				//Gradients along each edge of square
		let bottom = this.get(nextX, nextY) - this.get(unitX, nextY);
		let left = this.get(unitX, nextY) - this.get(unitX, unitY);
		let right = this.get(nextX, nextY) - this.get(nextX, unitY);

		let xGrad = lerp(top, bottom, yOffset);
		let yGrad = lerp(left, right, xOffset);

		return [xGrad, yGrad];
	}

	clone()
	{
		let newMap = new HeightMap(this.size);

		for (let y = 0; y < this.size; y++)
			for (let x = 0; x < this.size; x++)
				newMap.set(x, y, this.get(x, y));

		return newMap;
	}
}

export default HeightMap;