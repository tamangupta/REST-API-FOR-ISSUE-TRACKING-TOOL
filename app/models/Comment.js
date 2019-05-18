'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
Schema = mongoose.Schema;
const date = require('./../libs/timeLib')


let commentSchema = new Schema({
    comment:{
        type:String,
        default:''
    },
    user_id:{
        type:Schema.Types.ObjectId, ref:'Issue'
    }
})

mongoose.model('Comment', commentSchema);
