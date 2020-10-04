const admin = require("firebase-admin");

const updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        let { displayName, email, phoneNumber, latitude, longitude, role, designation} = req.body;
        if (!id || !displayName || !phoneNumber || !email || !latitude || !longitude || !role || !designation) {
            return res.status(400).send({ message: 'Missing fields' })
        }
        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);
        await admin.auth().updateUser(id, { displayName, phoneNumber, email, latitude, longitude, role, designation})
        await admin.auth().setCustomUserClaims(id, { role, latitude, longitude, designation})
        const user = await admin.auth().getUser(id)
        return res.status(204).send({ user: mapUser(user) })
    } catch (err) {
        return handleError(res, err)
    }
}

function mapUser(user) {
    const customClaims = (user.customClaims || { role: '' });
    const role = customClaims.role ? customClaims.role : '';
    const latitude = customClaims.latitude ? customClaims.latitude : '';
    const longitude = customClaims.longitude ? customClaims.longitude : '';
    const designation = customClaims.designation ? customClaims.designation : '';
    return {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        phoneNumber: user.phoneNumber,
        role,
        latitude,
        longitude,
        designation,
        lastSignInTime: user.metadata.lastSignInTime,
        creationTime: user.metadata.creationTime
    }
}

function handleError(res, err) {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}

module.exports = {
    updateUserById: updateUserById
}