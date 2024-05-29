const mongoose = require('mongoose')

const CliSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
})

const Cli = mongoose.model('apiCli', CliSchema)

module.exports = Cli
