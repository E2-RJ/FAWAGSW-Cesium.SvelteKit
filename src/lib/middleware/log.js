/*
console.log('Console Log')
console.info('Console Info')
console.debug('Console Debug')
console.warn('Console Warn')
console.error('Console Error')

console.log( "\u001b[1;31m Red message" );
console.log( "\u001b[1;32m Green message" );
console.log( "\u001b[1;33m Yellow message" );
console.log( "\u001b[1;34m Blue message" );
console.log( "\u001b[1;35m Purple message" );
console.log( "\u001b[1;36m Cyan message" );
*/

export function Log (type, message, space) {
  const timeStamp = new Date().toLocaleTimeString('en-GB')
  switch (type) {
    case "STATUS":
    case "REQUEST":
      console.info(`[${timeStamp}] ${type}: ${message}`)
      break;
    case "SUCCESS":
      console.info(`\u001b[1;32m[${timeStamp}] ${type}: ${message}\u001b[0m`)
      break;
    case "DEBUG":
      console.debug(`\u001b[1;36m[${timeStamp}] ${type}: ${message}\u001b[0m`)
      break;
    case "WARNING":
    case "FAILED":
      console.warn(`\u001b[1;33m[${timeStamp}] ${type}: ${message}\u001b[0m`)
      break;
    case "ERROR":
      console.error(`\u001b[1;31m[${timeStamp}] ${type}: ${message}\u001b[0m`)
      break;
    default:
      console.log(`[${timeStamp}] ${type}: ${message}`)
      break;
  }
  if (space === true) {
    console.log()
  }
}