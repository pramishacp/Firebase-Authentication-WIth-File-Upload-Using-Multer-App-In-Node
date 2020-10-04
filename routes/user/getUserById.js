const admin = require("firebase-admin");
const Resume = require('../../models/resume');

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await admin.auth().getUser(id)

        const userMapped = mapUser(user);
        const resume = await findResumePath(userMapped.uid);
        userMapped['resume'] = (resume.length)? resume[0].path: null;
        
        return res.status(200).send({ user: userMapped })
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

function findResumePath(uid) {
    return new Promise((resolve, reject) => {
        Resume.find( { uid: uid } )
            .then(resume => {
                resolve(resume);
            }).catch(error => {
                reject(error);
            })
    });
}

function handleError(res, err) {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}

module.exports = {
    getUserById: getUserById
}