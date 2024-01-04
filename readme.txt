// code to create products table in postgresSQL

CREATE TABLE products (
id SERIAL PRIMARY KEY,
	p_name VARCHAR(150),
	in_stock INT,
	rating INT,
	selling_price INT,
	mrp INT,
	feature TEXT[],
	color VARCHAR(10),
	material VARCHAR(30),
	dimension INT[],
	weight_limit INT,
	suitable_for TEXT[],
	wheels INT,
	item_weight INT,
	category TEXT[],
	assembly_required VARCHAR(4),
	brand VARCHAR(50),
	model_number TEXT,
	warranty TEXT,
	in_box TEXT[],
	description TEXT[],
	power_required VARCHAR(4),
	images bytea[]
);

**//