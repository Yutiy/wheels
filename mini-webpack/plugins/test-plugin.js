class TestPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('emit', function() {
      console.log(emit);
    })
  }
}

module.exports = TestPlugin;
