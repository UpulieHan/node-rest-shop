//to install mocha
module.exports.add = (a, b) => a + b;

module.exports.square = (x) => Math.pow(x, 2);

module.exports.asyncAdd = (a, b, callback) => {
  setTimeout(() => {
    callback(a + b);
  }, 1000);
};

module.exports.asyncSquare = (a, callback) => {
  setTimeout(() => {
    callback(a * a);
  }, 1000);
};
