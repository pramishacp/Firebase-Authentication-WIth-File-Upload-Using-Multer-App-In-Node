const admin = require("firebase-admin");
const Resume = require('../../models/resume');

const listUsersNearby = async (req, res) => {
    try {
        const { neighbour, designation} = req.query;
        const listUser = await admin.auth().getUser(neighbour)
        const user = mapUser(listUser)
        const myLat = user.latitude;
        const myLong = user.longitude;
        const listAllUsers = await admin.auth().listUsers()
        const allUsers = listAllUsers.users.map(mapUser)
        let filteredUsers;
        if(designation === 'all'){
            filteredUsers = allUsers;
        } else {
            filteredUsers = await filterUsersByDesignation(designation, allUsers);
        }
        const users= await sortUsersBasedOnDistance(myLat, myLong, filteredUsers);
        const uidArray = users.map(user => { return user.uid })
        const resumes = await findResumePath(uidArray);
        var mergedArray = users.map(user => {
            const resume = resumes.find(resume => resume.uid === user.uid);
            user['resume'] = resume? resume.path: null;
            return user; 
        })
        return res.status(200).send({ users: mergedArray  })
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

function findResumePath(uidArray) {
    return new Promise((resolve, reject) => {
        Resume.find( { uid: { $in: uidArray } } )
            .then(resume => {
                resolve(resume);
            }).catch(error => {
                reject(error);
            })
    });
}

function sortUsersBasedOnDistance(myLat, myLong, users) {
    return users.sort( (a, b) => {
        const diffA = (Number(a.latitude) - myLat) + (Number(a.longitude) - myLong);
        const diffB = (Number(b.latitude) - myLat) + (Number(b.longitude) - myLong);
        if (diffA > diffB) {
            return 1;
        } else if (diffA < diffB) {
            return -1;
        } else {
            return 0; // same
        }
    });
}

function filterUsersByDesignation(designation, users) {
    return users.filter(item => {
        return item.designation === designation
    })
}

function handleError(res, err) {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}

module.exports = {
    listUsersNearby: listUsersNearby
}


