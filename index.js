'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var fetchLatestItems = exports.fetchLatestItems = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(n) {
    var maxId, fetches, i;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetchMaxItemId();

          case 2:
            maxId = _context.sent;
            fetches = [];

            for (i = 0; i < n; i++) {
              fetches.push(fetchItem(maxId - i));
            }
            return _context.abrupt('return', Promise.all(fetches));

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function fetchLatestItems(_x) {
    return _ref.apply(this, arguments);
  };
}();

var main = exports.main = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
    var latestItems;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return fetchLatestItems(15);

          case 2:
            latestItems = _context2.sent;

            latestItems.forEach(function (item) {
              console.log(formatItem(item) + "\n");
            });

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function main() {
    return _ref2.apply(this, arguments);
  };
}();

var fetchPollOpts = exports.fetchPollOpts = function () {
  var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(_ref4) {
    var parts = _ref4.parts;
    var promises, items;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            promises = parts.map(fetchItem);
            _context3.next = 3;
            return Promise.all(promises);

          case 3:
            items = _context3.sent;
            return _context3.abrupt('return', flatMap(items, function (item) {
              return item.type === 'pollopt' ? [item] : [];
            }));

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function fetchPollOpts(_x2) {
    return _ref5.apply(this, arguments);
  };
}();

var displayItem = function () {
  var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(item) {
    var opts;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!(item.type === 'poll')) {
              _context4.next = 7;
              break;
            }

            _context4.next = 3;
            return fetchPollOpts(item);

          case 3:
            opts = _context4.sent;

            formatPoll(item, opts);
            _context4.next = 8;
            break;

          case 7:
            if (item.type === 'pollopt') {
              // do nothing
            } else {
              console.log(formatItem(item) + "\n");
            }

          case 8:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function displayItem(_x3) {
    return _ref6.apply(this, arguments);
  };
}();

var betterClient = exports.betterClient = function () {
  var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
    var latestItems, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return fetchLatestItems(15);

          case 2:
            latestItems = _context5.sent;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context5.prev = 6;
            _iterator = latestItems[Symbol.iterator]();

          case 8:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context5.next = 15;
              break;
            }

            item = _step.value;
            _context5.next = 12;
            return displayItem(item);

          case 12:
            _iteratorNormalCompletion = true;
            _context5.next = 8;
            break;

          case 15:
            _context5.next = 21;
            break;

          case 17:
            _context5.prev = 17;
            _context5.t0 = _context5['catch'](6);
            _didIteratorError = true;
            _iteratorError = _context5.t0;

          case 21:
            _context5.prev = 21;
            _context5.prev = 22;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 24:
            _context5.prev = 24;

            if (!_didIteratorError) {
              _context5.next = 27;
              break;
            }

            throw _iteratorError;

          case 27:
            return _context5.finish(24);

          case 28:
            return _context5.finish(21);

          case 29:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[6, 17, 21, 29], [22,, 24, 28]]);
  }));

  return function betterClient() {
    return _ref7.apply(this, arguments);
  };
}();

// Provides flexible array processing - this function can be used to remove
// items from an array, to replace individual items with multiple items in the
// output array, or pretty much anything you might need.


/* Additional Hacker News API endpoints */

var fetchTopStories = exports.fetchTopStories = function () {
  var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(n) {
    var storyIds;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return nodeFetch('https://hacker-news.firebaseio.com/v0/topstories.json').then(function (res) {
              return res.json();
            });

          case 2:
            storyIds = _context6.sent;
            _context6.next = 5;
            return Promise.all(storyIds.slice(0, n).map(fetchStory));

          case 5:
            return _context6.abrupt('return', _context6.sent);

          case 6:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function fetchTopStories(_x5) {
    return _ref8.apply(this, arguments);
  };
}();

var fetchStory = function () {
  var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(id) {
    var item;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return fetchItem(id);

          case 2:
            item = _context7.sent;

            if (!(item.type === 'story')) {
              _context7.next = 7;
              break;
            }

            return _context7.abrupt('return', item);

          case 7:
            return _context7.abrupt('return', Promise.reject(new Error('item ' + id + ' is an ' + item.type + ', not a story')));

          case 8:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function fetchStory(_x6) {
    return _ref9.apply(this, arguments);
  };
}();

var fetchComment = function () {
  var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(id) {
    var item;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return fetchItem(id);

          case 2:
            item = _context9.sent;

            if (!(item.type === 'comment')) {
              _context9.next = 7;
              break;
            }

            return _context9.abrupt('return', item);

          case 7:
            return _context9.abrupt('return', Promise.reject(new Error('item ' + id + ' is an ' + item.type + ', not a comment')));

          case 8:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function fetchComment(_x8) {
    return _ref12.apply(this, arguments);
  };
}();

exports.fetchItem = fetchItem;
exports.fetchComments = fetchComments;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// The `typeof fetch` works because Flow has built-in type definitions for
var nodeFetch = require('node-fetch');

// Fields common to all item types


// Fields common to top-level item types


// These type aliases just help to illustrate the purpose of certain fields
function fetchItem(id) {
  return nodeFetch('https://hacker-news.firebaseio.com/v0/item/' + id + '.json').then(function (res) {
    return res.json();
  });
}

function getTitle(item) {
  if (item.type === 'story') {
    // This works because this line is only reachable if the type of
    // `item.type` is `'story'`, which means that `item` can be expected to
    // have a `title` property.
    return item.title;
  }
}

function formatItem(item) {
  switch (item.type) {
    case 'story':
      return '"' + item.title + '" submitted by ' + item.by;
    case 'ask':
      return item.by + ' asked: ' + item.title;
    case 'job':
      return 'job posting: ' + item.title;
    case 'poll':
      var numOpts = item.kids ? item.kids.length : 0;
      return 'poll: "' + item.title + '" - choose one of ' + numOpts + ' options';
    case 'pollopt':
      return 'poll option: ' + item.text;
    case 'comment':
      return item.by + ' commented: ' + item.text.slice(0, 60) + '...';
    default:
      throw new Error('unknown item type: ' + item.type);
  }
}

// Fetches the largest ID, which should be the ID of the most recently-created
// item.
function fetchMaxItemId() {
  return nodeFetch('https://hacker-news.firebaseio.com/v0/maxitem.json').then(function (res) {
    return res.json();
  });
}

function getTitleCowboyStyle(item) {
  switch (item.type) {
    case 'story':
    case 'ask':
    case 'job':
    case 'poll':
      return item.title;
  }
}

function formatPoll(_ref3, opts) {
  var by = _ref3.by,
      title = _ref3.title;

  var headline = by + ' started a poll: "' + title + '"';
  return headline + "\n" + opts.map(function (opt) {
    return '  - ' + opt.text;
  }).join("\n");
}

function flatMap(xs, fn) {
  var result = [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = xs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _x4 = _step2.value;

      result.push.apply(result, fn(_x4));
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return result;
}function fetchComments(_ref10) {
  var kids = _ref10.kids;

  if (!kids) {
    return Promise.resolve([]);
  }
  return Promise.all(kids.map(function () {
    var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(id) {
      var comment, kids;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return fetchComment(id);

            case 2:
              comment = _context8.sent;
              _context8.next = 5;
              return fetchComments(comment);

            case 5:
              kids = _context8.sent;
              return _context8.abrupt('return', { comment: comment, kids: kids });

            case 7:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    return function (_x7) {
      return _ref11.apply(this, arguments);
    };
  }()));
}

//# sourceMappingURL=index.js.map