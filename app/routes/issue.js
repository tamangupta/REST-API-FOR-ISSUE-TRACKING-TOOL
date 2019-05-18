const express = require('express');
const router = express.Router();
const issueController = require("./../../app/controllers/issueController");
const appConfig = require("./../../config/appConfig")


module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/issue`;

    app.get(`${baseUrl}/view/all`, issueController.getAllIssue);

    app.get(`${baseUrl}/:issueId/view`, issueController.findByIssueId);

    app.post(`${baseUrl}/:issueId/watch`, issueController.watchIssue);

    app.post(`${baseUrl}/create`, issueController.createIssue);

    app.put(`${baseUrl}/:issueId/update`, issueController.updateIssue);

    app.post(`${baseUrl}/delete/:issueId`, issueController.deleteIssue)






}