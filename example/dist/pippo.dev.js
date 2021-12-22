"use strict";

var openpgp = require('openpgp');

(function _callee() {
  var passphrase, keys, publicKeyArmored, privateKeyArmored, publicKey, privateKey, unsignedMessage, cleartextMessage, signedMessage, verificationResult, _verificationResult$s, verified, keyID;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          passphrase = "yourPassphrase"; // what the private key is encrypted with

          _context.next = 3;
          return regeneratorRuntime.awrap(openpgp.generateKey({
            curve: 'ed25519',
            userIDs: [{
              name: "name",
              email: "michele@gmail.com"
            }],
            passphrase: passphrase
          }));

        case 3:
          keys = _context.sent;
          console.log("Keys", keys);
          publicKeyArmored = keys.publicKey;
          privateKeyArmored = keys.privateKey;
          _context.next = 9;
          return regeneratorRuntime.awrap(openpgp.readKey({
            armoredKey: publicKeyArmored
          }));

        case 9:
          publicKey = _context.sent;
          _context.t0 = regeneratorRuntime;
          _context.t1 = openpgp;
          _context.next = 14;
          return regeneratorRuntime.awrap(openpgp.readPrivateKey({
            armoredKey: privateKeyArmored
          }));

        case 14:
          _context.t2 = _context.sent;
          _context.t3 = passphrase;
          _context.t4 = {
            privateKey: _context.t2,
            passphrase: _context.t3
          };
          _context.t5 = _context.t1.decryptKey.call(_context.t1, _context.t4);
          _context.next = 20;
          return _context.t0.awrap.call(_context.t0, _context.t5);

        case 20:
          privateKey = _context.sent;
          _context.next = 23;
          return regeneratorRuntime.awrap(openpgp.createCleartextMessage({
            text: 'Hello, World!'
          }));

        case 23:
          unsignedMessage = _context.sent;
          _context.next = 26;
          return regeneratorRuntime.awrap(openpgp.sign({
            message: unsignedMessage,
            // CleartextMessage or Message object
            signingKeys: privateKey
          }));

        case 26:
          cleartextMessage = _context.sent;
          console.log(cleartextMessage); // '-----BEGIN PGP SIGNED MESSAGE ... END PGP SIGNATURE-----'

          _context.next = 30;
          return regeneratorRuntime.awrap(openpgp.readCleartextMessage({
            cleartextMessage: cleartextMessage // parse armored message

          }));

        case 30:
          signedMessage = _context.sent;
          _context.next = 33;
          return regeneratorRuntime.awrap(openpgp.verify({
            message: signedMessage,
            verificationKeys: publicKey
          }));

        case 33:
          verificationResult = _context.sent;
          _verificationResult$s = verificationResult.signatures[0], verified = _verificationResult$s.verified, keyID = _verificationResult$s.keyID;
          _context.prev = 35;
          _context.next = 38;
          return regeneratorRuntime.awrap(verified);

        case 38:
          // throws on invalid signature
          console.log('Signed by key id ' + keyID.toHex());
          _context.next = 44;
          break;

        case 41:
          _context.prev = 41;
          _context.t6 = _context["catch"](35);
          throw new Error('Signature could not be verified: ' + _context.t6.message);

        case 44:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[35, 41]]);
})();