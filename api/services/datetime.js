function getDate(millis) {
    return(new Date(ms = millis)).toISOString()
}

module.exports.getDate = getDate