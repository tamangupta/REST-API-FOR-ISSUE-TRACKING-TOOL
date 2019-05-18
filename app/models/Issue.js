const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;
const time = require('../libs/timeLib')

let issueSchema = new Schema({
    issueId: {
        type: String,
        default: '',
        index: true,
        unique: true
    },
    status: {
        type: String,
        default: 'in backlog'
    },
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    createdOn: {
        type: Date,
        default: time.now()
    },
    lastModified: {
        type: Date,
        default: time.now()
    },
    reporter: {
        type: String,
        default: ''
    },
    assignee: {
        type: String,
        default: ''
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    views:{
        type:Number,
        default:0
    },
    watchedUsers:[],
    comment:[{
        type:Schema.Types.ObjectId, ref:'Comment'
    }]
})

mongoose.model('Issue', issueSchema);