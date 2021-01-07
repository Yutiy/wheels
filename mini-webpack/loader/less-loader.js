const less = require('less');

function loader(source) {
  let css;
  less.render(source, function(err, output) {
    css = output.css;
  })
  return css;
}

module.exports = loader;
