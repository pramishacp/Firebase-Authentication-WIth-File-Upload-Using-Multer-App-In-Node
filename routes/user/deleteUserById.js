const admin = require("firebase-admin");

const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        await admin.auth().deleteUser(id)
        return res.status(204).send({})
    } catch (err) {
        return handleError(res, err)
    }
}

function handleError(res, err) {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}

module.exports = {
    deleteUserById: deleteUserById
}