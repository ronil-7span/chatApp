import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const accessToken = req.cookies.accessToken

    if (!accessToken) {
        console.log("No access token found, attempting renewal...")
        return renewToken(req, res, next);
    }
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("Invalid access token, attempting renewal...");
            return renewToken(req, res, next);
        }
        req.email = decoded.email;
        next()
    })
}
export const renewToken = (req, res, next) => {
    const refreshTokens = req.cookies.refreshToken

    if (!refreshTokens) {
        return res.status(401).json({ valid: false, message: "No Refresh Token" });
    }
    jwt.verify(refreshTokens, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ valid: false, message: "Invalid Refresh Token" });
        }

        // Generate a new access token
        const newAccessToken = jwt.sign({ email: decoded.email }, process.env.JWT_SECRET, { expiresIn: "1m" });

        // Set new access token in cookie
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true, // khali http req maj hase js document.cookie thi nai male
            secure: true, // khali 'https' maj cookie sent thase 
            sameSite: "None", // cross-site requests(frontend=example.com - backend=api.example.com) include karva mate
            maxAge: 60000, // 1 minute mate
        });

        // email ne req thi attach karde after decoding the email
        req.email = decoded.email;

        console.log("Access token renewed successfully!");
        next();
    });
}
