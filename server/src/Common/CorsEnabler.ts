import fs from 'fs/promises';
const config = JSON.parse(await fs.readFile('./src/config.json', 'utf-8'));

const enableCors = (req: any, res: any, next: any) => {
	res.setHeader('Access-Control-Allow-Origin', `${config.client.protocol}://${config.client.host}:${config.client.port}`);
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	next();
}

export default enableCors;