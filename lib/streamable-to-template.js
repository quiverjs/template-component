'use strict'

var streamConvert = require('quiver-stream-convert')

var streamableToCompiledTemplate = function(streamable, templateCompiler, callback) {
  if(streamable.toCompiledTemplate) return streamable.toCompiledTemplate(callback)

  streamConvert.streamableToText(streamable, function(err, rawTemplate) {
    if(err) return callback(err)
    
    templateCompiler(rawTemplate, function(err, compiledTemplate) {
      if(err) return callback(err)
      
      streamable.toCompiledTemplate = function(callback) {
        callback(null, compiledTemplate)
      }

      callback(null, compiledTemplate)
    })
  })
}

module.exports = {
  streamableToCompiledTemplate: streamableToCompiledTemplate
}