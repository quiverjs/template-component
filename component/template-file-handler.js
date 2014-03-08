'use strict'

var quiverComponents = [
  {
    name: 'quiver template file handler',
    type: 'stream handler',
    configAlias: {
      dirPath: 'templateDir'
    },
    middlewares: [
      'quiver memory cache filter'
    ],
    handler: 'quiver file directory handler'
  }
]

module.exports = {
  quiverComponents: quiverComponents
}