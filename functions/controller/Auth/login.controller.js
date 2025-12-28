const axios = require("axios");

const FIREBASE_API_KEY = "AIzaSyAn5IWMHT8eVp2UGZOetZxmPKzX7Z4G8Pw";

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email dan password wajib diisi",
            });
        }

        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
            {
                email,
                password,
                returnSecureToken: true,
            }
        );

        const { idToken, refreshToken, expiresIn, localId } = response.data;


        return res.json({
            message: "Login berhasil",
            data: {
                uid: localId,
                idToken,
                refreshToken,
                expiresIn,
            },
        });
    } catch (error) {
        return res.status(401).json({
            message: "Login gagal",
            error: error.response?.data?.error?.message || error.message,
        });
    }
};
