'use strict'

var pathLib = require('path')
var should = require('should')
var mustache = require('mustache')
var configLib = require('quiver-config')
var moduleLib = require('quiver-module')
var copyObject = require('quiver-copy').copyObject
var mergeObjects = require('quiver-merge').mergeObjects
var componentLib = require('quiver-component')
var templateComponent = require('../lib/template-component')

var mustacheTemplateCompiler = function(templateText, callback) {
  mustache.parse(templateText)

  var compiledTemplate = function(args, callback) {
    var result = mustache.render(templateText, args)
    
    callback(null, result)
  }

  callback(null, compiledTemplate)
}

var quiverComponents = moduleLib.loadComponentsFromQuiverModule(
  templateComponent.quiverModule)

describe('template component test', function() {
  var config = {
    templateCompiler: mustacheTemplateCompiler,
    templateDir: pathLib.join(__dirname, '../test-template/hello.txt.template'),
  }

  before(function(callback) {
    componentLib.installComponents(quiverComponents, function(err, componentConfig) {
      if(err) return callback(err)

      config = mergeObjects([componentConfig, config])
      callback()
    })
  })

  it('basic template test', function(callback) {
    configLib.loadSimpleHandler(copyObject(config), 'quiver template convert handler',
      'text', 'text', function(err, handler) {
        if(err) return callback(err)
        
        var args = {
          name: 'John'
        }
        handler(args, 'You have one new message.', function(err, result) {
          if(err) return callback(err)
          
          should.equal(result, 'Hello, John! You have one new message.')
          
          var args = {
            name: 'Smith'
          }
          handler(args, 'You have no new message.', function(err, result) {
            if(err) return callback(err)
            
            should.equal(result, 'Hello, Smith! You have no new message.')
            callback()
          })
        })
      })
  })
})