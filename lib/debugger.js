
var makeDebugger = function() {

    var level, fn

    var arg1 = arguments[1]
    var arg2 = arguments[2]

    var type = function(a, b) {
        return typeof a === b
    }

    if (type(arg1, 'number')) level = arg1
    else arg2 = arg1

    if (type(arg2, 'function')) fn = arg2

    var lt = type(level, 'number')

    var result = function() {
        if ((lt && arguments[0] === level) || !lt) {
            var func = console.log
            var dbg = fn || opts.debug
            if (type(dbg, 'function')) func = dbg
            return func.apply(this, arguments)
        }
    }

    return result
}

module.exports = makeDebugger
