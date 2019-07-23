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
		this.x /= this.magnitude();
		this.y /= this.magnitude();
	}
}

export default Vector2;