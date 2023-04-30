const enableCors = (req: any, res: any, next: any) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	next();
}

export default enableCors;