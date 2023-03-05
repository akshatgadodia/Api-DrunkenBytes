const corsHandler = (req, res, next) => {
    const supportOrigin = [
        "http://localhost:3000/",
        "http://localhost:3000",
        "https://support-drunkenbytes.vercel.app/",
        "https://support-drunkenbytes.vercel.app"
    ];
    const mainOrigin = [
        "http://localhost:3005/",
        "http://localhost:3005",
        "https://drunkenbytes.vercel.app/",
        "https://drunkenbytes.vercel.app"
    ];
    const claimsOrigin = [
        "http://localhost:3006/",
        "http://localhost:3006",
        "https://claims-drunkenbytes.vercel.app/",
        "https://claims-drunkenbytes.vercel.app"
    ];
    const careersOrigin = [
        "http://localhost:3007/",
        "http://localhost:3007",
        "https://careers-drunkenbytes.vercel.app/",
        "https://careers-drunkenbytes.vercel.app"
    ];
    const origin = req.get("origin");
    const isWhitelisted =
        supportOrigin.includes(origin) || mainOrigin.includes(origin) || claimsOrigin.includes(origin) || careersOrigin.includes(origin);
    if (isWhitelisted) {
        res.setHeader("Access-Control-Allow-Origin", req.get("origin"));
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS, PUT, PATCH, DELETE"
        );
        res.setHeader(
            "Access-Control-Allow-Headers",
            "X-Requested-With,Content-Type,Authorization"
        );
        res.setHeader("Access-Control-Allow-Credentials", true);
    } else {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS, PUT, PATCH, DELETE"
        );
        res.setHeader(
            "Access-Control-Allow-Headers",
            "X-Requested-With,Content-Type,Authorization"
        );
    }
    // Pass to next layer of middleware
    if (req.method === "OPTIONS") res.sendStatus(200);
    else next();
};

module.exports = corsHandler;