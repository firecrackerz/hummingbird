var types = require('../types')

module.exports = function (TypeSystem) {

  TypeSystem.prototype.bootstrap = function () {
    // The root object is the base object from which all objects descend
    var rootObject = new types.Object('fake')
    rootObject.supertype = null
    rootObject.isRoot    = true
    // Setup the basic intrinsic types (Any, Object, Integer, etc.)
    this.bootstrapIntrinsicTypes(rootObject)
    // Set up our built-ins
    this.bootstrapConsole(rootObject)
    // Expose rootObject to later functions
    this.rootObject = rootObject
  }// bootstrap()

  TypeSystem.prototype.bootstrapIntrinsicTypes = function (rootObject) {
    var Integer = new types.Integer(rootObject)
    this.root.setLocal('Any',     new types.Any())
    this.root.setLocal('Object',  new types.Object(rootObject))
    this.root.setLocal('String',  new types.String(rootObject))
    this.root.setLocal('Integer', Integer)
    this.root.setLocal('Boolean', new types.Boolean(rootObject))
    this.root.setLocal('Void',    new types.Void(rootObject))
  }

  TypeSystem.prototype.bootstrapConsole = function (rootObject) {
    var consoleType = new types.Object(this.root.getLocal('Object'))
    consoleType.intrinsic = true
    consoleType.name      = 'BuiltinConsole'
    // Create the `log(...)` function and add it to the console's type as a
    // read-only property
    var consoleLogFunction = new types.Function(rootObject, [this.root.getLocal('Any')], this.root.getLocal('Void'))
    consoleType.setTypeOfProperty('log', consoleLogFunction)
    consoleType.setFlagsOfProperty('log', 'r')
    // Create a faux instance of the console and add it to the root scope
    var consoleInstance = new types.Instance(consoleType)
    this.root.setLocal('console', consoleInstance)
  }

}// module.exports

