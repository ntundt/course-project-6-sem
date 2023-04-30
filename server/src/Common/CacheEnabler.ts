const enableCache = (req: any, res: any, next: any) => {
	res.setHeader('Pragma', 'cache');
	res.setHeader('Cache-Control', 'max-age=3600');
	next();
}

export default enableCache;
