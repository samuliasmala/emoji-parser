var fetchImage, fetchImages, fs, headers, https, wrench;
(https = require('https')),
  (fs = require('fs')),
  (wrench = require('wrench')),
  (headers = { 'User-Agent': 'frissdiegurke/emoji-parser' }),
  (fetchImage = function (target, path, name, cb) {
    var file;
    return (
      (file = target + name),
      fs.exists(file, function (bool) {
        var req;
        return bool
          ? cb(name)
          : ((req = https.get(
              {
                hostname: 'raw.githubusercontent.com',
                path: '/samuliasmala/emoji-cheat-sheet.com/master/' + path,
                headers: headers,
              },
              function (res) {
                var data;
                return (
                  (data = ''),
                  res.setEncoding('binary'),
                  res.on('data', function (chunk) {
                    return (data += chunk);
                  }),
                  res.on('end', function () {
                    return fs.writeFile(file, data, 'binary', function (err) {
                      return err
                        ? (console.warn(
                            'emoji-parser: failed to fetch ' + name
                          ),
                          cb())
                        : cb(name);
                    });
                  })
                );
              }
            )),
            req.on('error', function () {
              return (
                console.warn('emoji-parser: failed to fetch ' + name), cb()
              );
            }),
            req.end());
      })
    );
  }),
  (fetchImages = function (target, images, cb) {
    var amount, done, image, list, _i, _len, _results;
    if (null != images.message)
      return console.error('emoji-parser: GitHub: ' + images.message), cb([]);
    for (
      amount = images.length,
        list = [],
        done = function (name) {
          return (
            null != name && list.push(name.substring(0, name.length - 4)),
            --amount ? void 0 : cb(list)
          );
        },
        _results = [],
        _i = 0,
        _len = images.length;
      _len > _i;
      _i++
    )
      (image = images[_i]),
        _results.push(fetchImage(target, image.path, image.name, done));
    return _results;
  }),
  (module.exports = function (dir, remain, token, cb) {
    var req;
    return (
      'function' == typeof token && ((cb = token), (token = null)),
      '/' !== dir[dir.length - 1] && (dir += '/'),
      remain || wrench.rmdirSyncRecursive(dir, !0),
      wrench.mkdirSyncRecursive(dir),
      (req = https.get(
        {
          hostname: 'api.github.com',
          path:
            '/repos/samuliasmala/emoji-cheat-sheet.com/contents/public/graphics/emojis' +
            (null != token ? '?access_token=' + token : ''),
          headers: headers,
        },
        function (res) {
          var data;
          return (
            (data = ''),
            res.on('data', function (chunk) {
              return (data += chunk);
            }),
            res.on('end', function () {
              return fetchImages(dir, JSON.parse(data), function (images) {
                return cb(null, images);
              });
            })
          );
        }
      )),
      req.on('error', cb),
      req.end()
    );
  });
