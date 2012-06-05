
var units = {
  year:31556926,
  week:604800,
  day:86400,
  hour:3600,
  minute:60,
  second:1
}

var values = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty'
]

function computeSeconds(value, unit) {
  unit = unit.replace(/s$/i, '')
  value = parseInt(values.indexOf(value.toLowerCase()))
  unit = parseInt(units[unit.toLowerCase()])
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

