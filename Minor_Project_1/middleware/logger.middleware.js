export default function logger(req, res, next) {
    console.log(`[LOG] ${req.method} ${req.url}`);
    next();
}
