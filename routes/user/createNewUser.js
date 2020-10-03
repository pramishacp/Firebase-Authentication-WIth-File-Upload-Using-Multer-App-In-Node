
const admin = require("firebase-admin");
const createNewUser = async (req, res) => {
    try {
        let { displayName, email, phoneNumber, latitude, longitude, role, designation } = req.body;
        if (!displayName || !email || !phoneNumber || !latitude || !longitude || !role || !designation) {
            return res.status(400).send({ message: 'Missing fields' })
        }
        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);
        const { uid } = await admin.auth().createUser({
            displayName,
            email,
            phoneNumber,
            latitude,
            longitude,
            role,
            designation
        })
        await admin.auth().setCustomUserClaims(uid, { role, latitude, longitude, designation })
        return res.status(201).send({ uid })
    } catch (err) {
        return handleError(res, err)
    }
}

function handleError(res, err) {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}

module.exports = {
    createNewUser: createNewUser
}


