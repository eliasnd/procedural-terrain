class HeightMap 
{
	constructor(size)
	{
		this.map = [];
		this.size = size;
		for (let i = 0; i < size ** 2; i++)
			this.map[i] = 0;
	}

	get(x, y)
	{
		if (Number.isInteger(x) && Number.isInteger(y))
			return this.map[y * this.size + x];
		else
		{
			let unitX = Math.floor(x);
			//console.log("unitX is " + unitX);
			let unitY = Math.floor(y);
			let xOffset = x % 1.0;
			let yOffset = y % 1.0;
			let nextX = Math.min(this.size-1, unitX+1);
			//console.log("nextX is " + nextX);
			let nextY = Math.min(this.size-1, unitY+1);

			let top = this.map[unitY * this.size + unitX] * (1-xOffset) + this.map[unitY * this.size + nextX] * xOffset;
			let bottom = this.map[nextY * this.size + unitX] * (1-xOffset) + this.map[nextY * this.size + nextX] * xOffset;
			return top * (1-yOffset) + bottom * yOffset;
		}
	}

	set(x, y, val)
	{
		this.map[y * this.size + x] = val;
	}

	change(x, y, val)
	{
		this.map[y * this.size + x] += val;
	}

	outOfBounds(x, y)
	{
		return x < 0 || x >= this.size || y < 0 || y >= this.size;
	}

	grad(x, y)
	{
		let unitX = Math.floor(x);
		let unitY = Math.floor(y);
		let xOffset = x % 1.0;
		let yOffset = y % 1.0;
		let nextX = Math.min(this.size-1, unitX + 1);
		let nextY = Math.min(this.size-1, unitY + 1);

		let top = this.get(nextX, unitY) - this.get(x, unitY);				//Gradients along each edge of square
		let bottom = this.get(nextX, nextY) - this.get(x, nextY);
		let left = this.get(unitX, nextY) - this.get(x, unitY);
		let right = this.get(nextX, nextY) - this.get(nextX, unitY);

		let xGrad = top * (1-yOffset) + bottom * yOffset;
		let yGrad = left * (1-xOffset) + right * xOffset;

		return [xGrad, yGrad];
	}
}

export default HeightMap;