'use strict'

var configLib = require('quiver-config')
var copyObject = require('quiver-copy').copyObject

var streamableToCompiledTemplate = require(
  '../lib/streamable-to-template').streamableToCompiledTemplate

var templateHandlerBuilder = function(config, callback) {
  var templateCompiler = config.templateCompiler

  var templateFileHandler = configLib.getSimpleHandler(config, 
    'quiver template file handler')

  var getCompiledTemplate = function(templatePath, callback) {
    var inArgs = {
      path: templatePath
    }

    templateFileHandler(inArgs, function(err, resultStreamable) {
      if(err) return callback(err)
      
      streamableToCompiledTemplate(resultStreamable, templateCompiler, callback)
    })
  }

  var handler = function(args, body, callback) {
    var templatePath = args.templatePath || '.'

    getCompiledTemplate(templatePath, function(err, compiledTemplate) {
      if(err) return callback(err)
      
      var templateArgs = {
        args: args,
        body: body
      }

      compiledTemplate(templateArgs, callback)
    })
  }

  callback(null, handler)
}

var quiverComponents = [
  {
    name: 'quiver template convert handler',
    type: 'simple handler',
    inputType: 'text',
    outputType: 'text',
    handleables: [
      {
        handler: 'quiver template file handler',
        type: 'simple handler',
        inputType: 'void',
        outputType: 'streamable'
      }
    ],
    configParam: [
      {
        key: 'templateCompiler',
        valueType: 'function',
        required: true
      }
    ],
    handlerBuilder: templateHandlerBuilder
  }
]

module.exports = {
  quiverComponents: quiverComponents
}