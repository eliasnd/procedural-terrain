class Vector2
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}

	magnitude()
	{
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}

	normalize()
	{
		let mag = this.magnitude();
		this.x /= mag;
		this.y /= mag;
	}
}

export default Vector2;