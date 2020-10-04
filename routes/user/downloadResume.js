
const path = require('path');
const config = require('../../config');

const downloadResume = async (req, res) => {
  try {
    res.status(200).download(path.join(__dirname, '../' , '../', `/${config.directory.static}/${config.directory.resume}/${req.params.file}`));
  } catch (err) {
    return handleError(res, err)
  }
}

function handleError(res, err) {
  return res.status(500).send({ message: `${err.code} - ${err.message}` });
}

module.exports = {
  downloadResume: downloadResume
}