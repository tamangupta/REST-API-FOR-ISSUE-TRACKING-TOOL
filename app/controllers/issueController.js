const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib')

const IssueModel = mongoose.model('Issue')

/**
 * function to read all Issue.
 */
let getAllIssue = (req, res) => {
    IssueModel.find()
        .select('-__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'issue Controller: getAllIssue', 10)
                let apiResponse = response.generate(true, 'Failed To Find All Issue', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Issue Found', 'issue Controller: getAllIssue')
                let apiResponse = response.generate(true, 'No Issue Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All Issue Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get all Issue

/**
 * function to read single issue.
 */
let findByIssueId = (req, res) => {

    if (check.isEmpty(req.params.issueId)) {

        console.log('issueId should be passed')
        let apiResponse = response.generate(true, 'issueId is missing', 403, null)
        res.send(apiResponse)
    } else {

        IssueModel.findOne({ 'issueId': req.params.issueId }, (err, result) => {

            if (err) {

                console.log('Error Occured.')
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('Issue Not Found.')
                let apiResponse = response.generate(true, 'Issue Not Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("Issue found successfully", "issueController:findByIssueId", 5)
                let apiResponse = response.generate(false, 'Issue Found Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}
//end of find By IssueId

/**
 * function to create the blog.
 */
let createIssue = (req, res) => {
    let issueCreationFunction = () => {
        return new Promise((resolve, reject) => {
            console.log(req.body)
            if (check.isEmpty(req.body.status) || check.isEmpty(req.body.title) || check.isEmpty(req.body.description) || check.isEmpty(req.body.assignee)) {

                console.log("403, forbidden request");
                let apiResponse = response.generate(true, 'required parameters are missing', 403, null)
                reject(apiResponse)
            } else {

                var today = Date.now()
                let issueId = shortid.generate()

                let newIssue = new IssueModel({

                    issueId: issueId,
                    status: req.body.status,
                    title: req.body.title,
                    description: req.body.description,
                    assignee: req.body.assignee,
                    isPublished: true,
                    reporter: 'taman',
                    created: time.now(),
                    lastModified: time.now()
                }) // end new issue model

                newIssue.save((err, result) => {
                    if (err) {
                        console.log('Error Occured.')
                        logger.error(`Error Occured : ${err}`, 'Database', 10)
                        let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                        reject(apiResponse)
                    } else {
                        console.log('Success in issue creation')
                        resolve(result)
                    }
                }) // end new issue save
            }
        }) // end new issue promise
    } // end create issue function

    // making promise call.
    issueCreationFunction()
        .then((result) => {
            let apiResponse = response.generate(false, 'Issue Created successfully', 200, result)
            res.send(apiResponse)
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
        })
}// end of create issue function

/**
 * function to increase views of a issue.
 * function to add name of watcher
 */
let watchIssue = (req, res) => {

    if (check.isEmpty(req.params.issueId)) {

        console.log('issueId should be passed')
        let apiResponse = response.generate(true, 'issueId is missing', 403, null)
        res.send(apiResponse)
    } else {

        IssueModel.findOne({ 'issueId': req.params.issueId }, (err, result) => {

            if (err) {

                console.log('Error Occured.')
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('Issue Not Found.')
                let apiResponse = response.generate(true, 'Issue Not Found', 404, null)
                res.send(apiResponse)
            } else {
                result.views +=1;
                result.save(function (err, result) {
                    if (err) {
                        console.log('Error Occured.')
                        logger.error(`Error Occured : ${err}`, 'Database', 10)
                        let apiResponse = response.generate(true, 'Error Occured While saving blog', 500, null)
                        res.send(apiResponse)
                    }
                    else {
                        console.log('Issue Watched Successfully')
                        let apiResponse = response.generate(false, 'Issue Watched Successfully.', 200, result)
                        res.send(apiResponse)
                    }
                });// end result
            }
        })
    }
} // end of watch Issue function

/**
 * function to edit issue by user.
 */
let updateIssue = (req, res) => {

    if (check.isEmpty(req.params.issueId)) {

        console.log('issueId should be passed')
        let apiResponse = response.generate(true, 'issueId is missing', 403, null)
        res.send(apiResponse)
    } else {

        let options = req.body;
        console.log(options);
        IssueModel.update({ 'issueId': req.params.issueId }, options, { multi: true }).exec((err, result) => {

            if (err) {

                console.log('Error Occured.')
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('Issue Not Found.')
                let apiResponse = response.generate(true, 'Issue Not Found', 404, null)
                res.send(apiResponse)
            } else {
                console.log('Issue Updated Successfully')
                let apiResponse = response.generate(false, 'Issue Updated Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
} // end of issue edit function 

/**
 * function to delete the particular issue.
 */
let deleteIssue = (req, res) => {

    if (check.isEmpty(req.params.issueId)) {

        console.log('issueId should be passed')
        let apiResponse = response.generate(true, 'issueId is missing', 403, null)
        res.send(apiResponse)
    } else {

        IssueModel.remove({ 'issueId': req.params.issueId }, (err, result) => {
            if (err) {
                console.log('Error Occured.')
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                console.log('Issue Not Found.')
                let apiResponse = response.generate(true, 'Issue Not Found.', 404, null)
                res.send(apiResponse)
            } else {
                console.log('Issue Deleted Successfully')
                let apiResponse = response.generate(false, 'Issue Deleted Successfully', 200, result)
                res.send(apiResponse)
            }
        })
    }
} // end of issue delete function

module.exports = {
    getAllIssue: getAllIssue,
    findByIssueId: findByIssueId,
    createIssue: createIssue,
    watchIssue: watchIssue,
    updateIssue: updateIssue,
    deleteIssue: deleteIssue
}