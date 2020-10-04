const admin = require("firebase-admin");

const listAllUsers = async (req, res) => {
    try {
        const listUsers = await admin.auth().listUsers()
        const users = listUsers.users.map(mapUser)
        return res.status(200).send({ users })
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
    listAllUsers: listAllUsers
}