export default function auth(req, res, next) {
    console.log("Auth checked");
    next();
}
