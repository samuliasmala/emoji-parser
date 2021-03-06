var dirName, emoji, fs, parse, save, service, update;
(fs = require('fs')),
  (update = require('./update')),
  (parse = require('./parse')),
  (service = module.exports),
  (dirName = null),
  (emoji = service.emoji = void 0),
  (service.init = function (dir) {
    var data;
    null == dir &&
      (dir = dirName || require('path').dirname(module.filename) + '/emoji'),
      (dirName = dir);
    try {
      (data = fs.readFileSync('' + dir + '/!index.list', { encoding: 'UTF8' })),
        null != data && (emoji = service.emoji = JSON.parse(data));
    } catch (_error) {}
    return (emoji = service.emoji = emoji || []), service;
  }),
  (save = function (cb) {
    return fs.writeFile(
      '' + dirName + '/!index.list',
      JSON.stringify(emoji),
      cb
    );
  }),
  (service.update = function (remain, token, cb) {
    return (
      'function' == typeof token
        ? ((cb = token), (token = null))
        : 'function' == typeof remain &&
          ((cb = remain), (remain = !0), (token = null)),
      'string' == typeof remain
        ? ((token = remain), (remain = !0))
        : (remain = remain !== !1),
      null != dirName
        ? update.call(this, dirName, remain, token, function (err, list) {
            return null != list && list instanceof Array
              ? ((emoji = service.emoji = list),
                save(function () {
                  return null != cb && 'function' == typeof cb.call
                    ? cb.call(service, err, list)
                    : void 0;
                }))
              : null != cb && 'function' == typeof cb.call
              ? cb.call(service, err, list)
              : void 0;
          })
        : null != cb &&
          'function' == typeof cb.call &&
          cb.call(service, 'not initialized'),
      service
    );
  }),
  (service.list = parse.list),
  (service.parse = function (text, url, options) {
    return (
      null == options && (options = {}),
      (options.list = options.list || emoji),
      parse(text, url, options)
    );
  });
