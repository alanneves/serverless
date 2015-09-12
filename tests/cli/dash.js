'use strict';

/**
 * JAWS Test: Dash Command
 */

var Jaws = require('../../lib/index.js'),
    CMDdash = require('../../lib/commands/dash'),
    CMDtag = require('../../lib/commands/tag'),
    JawsError = require('../../lib/jaws-error'),
    testUtils = require('../test_utils'),
    Promise = require('bluebird'),
    path = require('path'),
    assert = require('chai').assert;

var config = require('../config'),
    projPath,
    JAWS;

describe('Test "dash" command', function() {

  before(function(done) {
    this.timeout(0);

    // Tag All Lambdas & Endpoints
    return Promise.try(function() {

      // Create Test Project
      projPath = testUtils.createTestProject(
          config.name,
          config.region,
          config.stage,
          config.iamRoleArnLambda,
          config.iamRoleArnApiGateway,
          config.envBucket,
          ['back']);
      process.chdir(path.join(projPath, 'back'));

      // Instantiate JAWS
      JAWS = new Jaws();
    })
        .then(function() {
          return CMDtag.tagAll(JAWS, 'lambda');
        })
        .then(function() {
          return CMDtag.tagAll(JAWS, 'endpoint');
        })
        .then(function() {
          return done();
        });
  });

  after(function(done) {
    done();
  });

  describe('Positive tests', function() {
    it('Show Dash', function(done) {
      this.timeout(0);

      CMDdash.run(JAWS, config.stage, config.regions, true)
          .then(function() {
            done();
          })
          .catch(JawsError, function(e) {
            done(e);
          })
          .error(function(e) {
            done(e);
          });
    });
  });
});