"use strict";

var _require = require('openpgp'),
    sign = _require.sign,
    readCleartextMessage = _require.readCleartextMessage,
    createCleartextMessage = _require.createCleartextMessage,
    readMessage = _require.readMessage,
    decrypt = _require.decrypt,
    readPrivateKey = _require.readPrivateKey,
    decryptKey = _require.decryptKey;

var axios = require("axios");

function create(name, email, payload) {
  var response;
  return regeneratorRuntime.async(function create$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(axios.request({
            url: "http://localhost:3000/pgp/create",
            method: 'post',
            data: {
              name: name,
              email: email,
              payload: payload
            }
          }));

        case 2:
          response = _context.sent;
          return _context.abrupt("return", response.data);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}

function submit(idTemplate, name, email, payload) {
  var response;
  return regeneratorRuntime.async(function submit$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(axios.request({
            url: "http://localhost:3000/pgp/submit",
            method: 'post',
            data: {
              idTemplate: idTemplate,
              name: name,
              email: email,
              payload: payload
            }
          }));

        case 2:
          response = _context2.sent;
          return _context2.abrupt("return", response.data);

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function list(idTemplate) {
  var response;
  return regeneratorRuntime.async(function list$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(axios.get("http://localhost:3000/pgp/list/".concat(idTemplate)));

        case 2:
          response = _context3.sent;
          return _context3.abrupt("return", response.data);

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function login(idTemplate, privateKeyArmored) {
  var timestamp, privateKey, unsignedMessage, cleartextMessage, response;
  return regeneratorRuntime.async(function login$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          timestamp = Date.now();
          _context4.t0 = regeneratorRuntime;
          _context4.t1 = decryptKey;
          _context4.next = 5;
          return regeneratorRuntime.awrap(readPrivateKey({
            armoredKey: privateKeyArmored
          }));

        case 5:
          _context4.t2 = _context4.sent;
          _context4.t3 = {
            privateKey: _context4.t2,
            passphrase: '-'
          };
          _context4.t4 = (0, _context4.t1)(_context4.t3);
          _context4.next = 10;
          return _context4.t0.awrap.call(_context4.t0, _context4.t4);

        case 10:
          privateKey = _context4.sent;
          _context4.next = 13;
          return regeneratorRuntime.awrap(createCleartextMessage({
            text: "" + timestamp
          }));

        case 13:
          unsignedMessage = _context4.sent;
          _context4.next = 16;
          return regeneratorRuntime.awrap(sign({
            message: unsignedMessage,
            // CleartextMessage or Message object
            signingKeys: privateKey
          }));

        case 16:
          cleartextMessage = _context4.sent;
          _context4.next = 19;
          return regeneratorRuntime.awrap(axios.request({
            url: "http://localhost:3000/pgp/login",
            method: 'post',
            data: {
              idTemplate: idTemplate,
              timestamp: timestamp,
              signedTimestamp: cleartextMessage.toString()
            }
          }));

        case 19:
          response = _context4.sent;
          return _context4.abrupt("return", response.data);

        case 21:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function bootstrap() {
  var created, submissions, i, submission, results;
  return regeneratorRuntime.async(function bootstrap$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(create("Michele Mastrogiovanni", "michele.mastrogiovanni@gmail.com", {}));

        case 3:
          created = _context5.sent;
          _context5.t0 = console;
          _context5.next = 7;
          return regeneratorRuntime.awrap(login(created._id, created.privateKey));

        case 7:
          _context5.t1 = _context5.sent;

          _context5.t0.log.call(_context5.t0, _context5.t1);

          submissions = {};
          i = 0;

        case 11:
          if (!(i < 3)) {
            _context5.next = 19;
            break;
          }

          _context5.next = 14;
          return regeneratorRuntime.awrap(submit(created._id, "pippo" + i, i + "pluto@pippo.com", {
            option1: true,
            option2: false,
            option3: true
          }));

        case 14:
          submission = _context5.sent;
          // this.score(submission.id, i);
          submissions[i] = submission;

        case 16:
          i++;
          _context5.next = 11;
          break;

        case 19:
          _context5.next = 21;
          return regeneratorRuntime.awrap(list(created._id));

        case 21:
          results = _context5.sent;
          _context5.next = 24;
          return regeneratorRuntime.awrap(decryptList(results, submissions[0].privateKey));

        case 24:
          // Dump all data
          results.forEach(function (x) {
            console.log("* " + JSON.stringify(x, null, 2));
          });
          /*
          const created = await this.create({  });
               console.log("Encrypted list")
          await this.decryptList(
              results, 
              submissions[0].privateKey
          )
               results.forEach(item => { console.log("* ", item )});
               console.log("Plain list")
          console.log(await this.listPlain(created.id))
          // console.log(await this.listPlain(created.id))
          */

          _context5.next = 30;
          break;

        case 27:
          _context5.prev = 27;
          _context5.t2 = _context5["catch"](0);
          console.log(_context5.t2);

        case 30:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 27]]);
}

function decryptList(payloads, privateKeyArmored) {
  var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, payload, message, privateKey, decrypted;

  return regeneratorRuntime.async(function decryptList$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context6.prev = 3;
          _iterator = payloads[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context6.next = 33;
            break;
          }

          payload = _step.value;
          _context6.prev = 7;

          if (!payload.encrypted) {
            _context6.next = 26;
            break;
          }

          _context6.next = 11;
          return regeneratorRuntime.awrap(readMessage({
            armoredMessage: payload.encrypted // parse armored message

          }));

        case 11:
          message = _context6.sent;
          _context6.t0 = regeneratorRuntime;
          _context6.t1 = decryptKey;
          _context6.next = 16;
          return regeneratorRuntime.awrap(readPrivateKey({
            armoredKey: privateKeyArmored
          }));

        case 16:
          _context6.t2 = _context6.sent;
          _context6.t3 = {
            privateKey: _context6.t2,
            passphrase: '-'
          };
          _context6.t4 = (0, _context6.t1)(_context6.t3);
          _context6.next = 21;
          return _context6.t0.awrap.call(_context6.t0, _context6.t4);

        case 21:
          privateKey = _context6.sent;
          _context6.next = 24;
          return regeneratorRuntime.awrap(decrypt({
            message: message,
            decryptionKeys: privateKey
          }));

        case 24:
          decrypted = _context6.sent;
          payload.plain = JSON.parse(decrypted.data);

        case 26:
          _context6.next = 30;
          break;

        case 28:
          _context6.prev = 28;
          _context6.t5 = _context6["catch"](7);

        case 30:
          _iteratorNormalCompletion = true;
          _context6.next = 5;
          break;

        case 33:
          _context6.next = 39;
          break;

        case 35:
          _context6.prev = 35;
          _context6.t6 = _context6["catch"](3);
          _didIteratorError = true;
          _iteratorError = _context6.t6;

        case 39:
          _context6.prev = 39;
          _context6.prev = 40;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 42:
          _context6.prev = 42;

          if (!_didIteratorError) {
            _context6.next = 45;
            break;
          }

          throw _iteratorError;

        case 45:
          return _context6.finish(42);

        case 46:
          return _context6.finish(39);

        case 47:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[3, 35, 39, 47], [7, 28], [40,, 42, 46]]);
}

bootstrap();