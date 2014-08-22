/* jshint and chai's expect interface do not place nicely
 * so we ignore jshint in our tests :\
 */
/* jshint -W024, expr:true */

// TODO: put these in a common file to reduce boilerplate
// ala https://github.com/domenic/sinon-chai/blob/master/test/common.js

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = require('chai').expect;
// @TODO Figure out if we need a test Haxfred
var Haxfred = require('haxfred');
var path = require('path');
var chai = require('chai');
var irc = require('irc');

chai.use(expect);
chai.use(sinonChai);

describe('Haxfred-irc', function () {
  // Setup haxfred for tests
  var haxfred;
  beforeEach(function() {
    haxfred = new Haxfred({
      adapters: ['haxfred-irc.js'],
      // Config is necessary to pass
      // @TODO determine how to deal with lack of config
      // haxfred-irc doesnt care if the server isnt defined.
      // It probably shouldnt care about the rest of its config.
      nicks: [ 'haxfred' ],
      channels: [
        '#haxiom',
        '#node.js'
      ],
      rootDir: path.resolve(__dirname, '../lib')
    });

    haxfred.initialize();
  });

  describe('creation', function () {
    it('creates irc namespace on Haxfred', function () {
      expect(haxfred).to.have.property('irc');
    });

    it('defaults to first nick w/o defined nickMethod', function () {
      expect(haxfred.irc).to.have.property('_currentNick');
      expect(haxfred.irc._currentNick).to.be.a('string');
      expect(haxfred.irc._currentNick).to.equal('haxfred');
    });

    it('creates client', function () {
      expect(haxfred.irc).to.have.property('client');
      expect(haxfred.irc.client).to.be.a('object');
      expect(haxfred.irc.client).to.be.an.instanceof(irc.Client);
      // @TODO Determine if client.nick should be tested against _currentNick
    });
  });

  describe('events', function () {
    describe('"join" listener', function () {
      it('added successfully', function () {
        expect(haxfred.irc.client.listeners('join')).to.ok;
        expect(haxfred.irc.client.listeners('join')[0]).to.be.a('function');
      });
      it('joinHandler emits "irc.join"', function () {
        haxfred;
      });
    });

    describe('"names" listener', function () {
      it('added successfully', function () {
        expect(haxfred.irc.client.listeners('names')).to.ok;
        expect(haxfred.irc.client.listeners('names')[0]).to.be.a('function');
      });
    });

    describe('"message#channel(s)" listener', function () {
      it('added successfully', function () {
        haxfred.config.channels.forEach(function(channel) {
          expect(haxfred.irc.client.listeners('message'+channel)).to.not.be.empty;
          expect(haxfred.irc.client.listeners('message'+channel)[0]).to.be.a('function');
        });
      });
    });

    describe('"pm" listener', function () {
      it('added successfully', function () {
        expect(haxfred.irc.client.listeners('pm')).to.ok;
        expect(haxfred.irc.client.listeners('pm')[0]).to.be.a('function');
      });
    });
  });

  describe('react to channel properties', function () {
    //it('changes name if initally _currentNick is already taken', function () { });
  });
});
