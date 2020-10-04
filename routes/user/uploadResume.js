const mongoose = require('mongoose');
const Resume = require('../../models/resume');
const path = require('path');
const config = require('../../config');
const uploadResume = async (req, res) => {
    try {
        if (req.file) {
            const createdNewResume = await createNewResume(req.body.uid);
            const deletedOldResumesFromCollection = await deleteOldResumesFromCollection(createdNewResume._id, createdNewResume.uid);
            return res.status(200).send({ message: `Resume submitted successfully` })
        }
    } catch (err) {
        return handleError(res, err)
    } 
}

function createNewResume(uid) {
    return new Promise((resolve, reject) => {
        let resume = new Resume();
        resume.uid = uid;
        resume.path = `/${config.directory.resume}/${uid}.pdf`;
        resume.file = `${uid}.pdf`
        resume.save()
        .then(resume => {
            resolve(resume);
        }).catch(error => {
            reject(error);
        })
    });
}

function deleteOldResumesFromCollection(latestResumeId, uid) {
    return new Promise((resolve, reject) => {
        Resume.remove(
            {
                _id: {
                    $not: { $eq: new mongoose.Types.ObjectId(latestResumeId) }
                },
                uid: {
                    $eq: uid
                }
            })
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
    uploadResume: uploadResume
}