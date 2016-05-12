"use strict";
var log = require("winston");
var schedule = require("node-schedule");

var currentMeetings = {};

var addMeeting = function(invitation) {
  if(!(invitation.getHost() in currentMeetings)) {
    currentMeetings[invitation.getHost()] = [];
  }
  currentMeetings[invitation.getHost()].push(invitation);
  log.info("Scheduling meeting for " + invitation.getHost() + " at " + invitation.getTime().toTimeString() + " " + invitation.getTime().toDateString());
  scheduleMeeting(invitation);
};

var scheduleMeeting = function(invitation) {
  schedule.scheduleJob(invitation.getTime(), function() {
    log.info("Sending invite for " + invitation.getHost()); 
    invitation.send();
  });
};

module.exports = {
  addMeeting: addMeeting
};
