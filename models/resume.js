const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema({
    uid: { 
        type: String 
    },
    path: {
        type: String 
    },
    file: {
        type: String 
    }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
