export const logger = async (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;

        console.log(JSON.stringify({
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            time: `${duration}ms`
        }));
    });

    next();
}