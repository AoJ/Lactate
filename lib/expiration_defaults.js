
var units = {
    year:    31556926
  , month:   2629743
  , week:    604800
  , day:     86400
  , hour:    3600
  , minute:  60
  , second:  1
}

var values = [
    'zero'
  , 'one'
  , 'two'
  , 'three'
  , 'four'
  , 'five'
  , 'six'
  , 'seven'
  , 'eight'
  , 'nine'
  , 'ten'
  , 'eleven'
  , 'twelve'
  , 'thirteen'
  , 'fourteen'
  , 'fifteen'
  , 'sixteen'
  , 'seventeen'
  , 'eighteen'
  , 'nineteen'
  , 'twenty'
]

values = values.map(function(value, index) {
    return [value, ''+index]
})

function getValue(v) {
    var res = 0
    values.forEach(function(value, index) {
       if (value.indexOf(v) !== -1) res = index 
    })
    return res
}

function computeSeconds(value, unit) {
  unit = unit.replace(/s$/i, '')
  unit = parseInt(units[unit.toLowerCase()])
  value = parseInt(getValue(value.toLowerCase()))
  if (!value || !unit) return 0
  return value * unit
}

function getExpires(str) {

  var subs = str.split(/\sand\s/)
  
  subs = subs.map(function(i) { 
    return i.split(' ')
  })

  var sum = 0

  subs.forEach(function(sub) {
    sum += computeSeconds(sub[0], sub[1])
  })

  return sum
}

module.exports = getExpires

console.log(getExpires(process.argv.slice(2).join(' ')))

