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
    if (supportOrigin.includes(origin)) {
        req.originSource = "SUPPORT";
    } else if (mainOrigin.includes(origin)) {
        req.originSource = "MAIN";
    } else if (claimsOrigin.includes(origin)) {
        req.originSource = "CLAIMS";
    } else if (careersOrigin.includes(origin)) {
        req.originSource = "CAREERS";
    }else {
        req.originSource = "ANOTHER"
    }
    next();
};

module.exports = corsHandler;