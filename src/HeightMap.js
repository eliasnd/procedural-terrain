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
		return this.map[y * this.size + x];
	}

	set(x, y, val)
	{
		this.map[y * this.size + x] = val;
	}
}

export default HeightMap;