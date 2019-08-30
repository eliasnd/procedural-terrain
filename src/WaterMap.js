

export default class WaterMap
{
	constructor(size)
	{
		this.map = new Float32Array(size**2 * 3);
		this.size = size;

		for (let y = 0; y < size; y++)
			for (let x = 0; x < size; x++)
			{
				let index = (y * size + x) * 3;

				this.map[index] = x - size/2;
				this.map[index+1] = 0;
				this.map[index+2] = y - size/2;
			}
	}

	get(x, y)
	{
		return this.map[(y * this.size + x) * 3 + 1];
	}

	set(x, y, val)
	{
		this.map[(y * this.size + x) * 3 + 1] = val;
	}
}