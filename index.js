#! /usr/bin/env node
const fs = require('fs')
const path = require('path')

if (process.argv.length > 2) {
  const filepath = path.join(__dirname, process.argv[2])
  const packageJson = require(filepath)

  function move ({ name, to }) {
    if (packageJson.dependencies?.[name] != null) {
      const { [name]: value, ...without } = packageJson.dependencies

      packageJson.dependencies = without

      if (packageJson[to] != null) {
        packageJson[to][name] = value
      } else {
        packageJson[to] = { [name]: value }
      }
    }
  }
  move({ name: 'react', to: 'peerDependencies' })
  move({ name: 'react-dom', to: 'peerDependencies' })
  move({ name: 'react-router-dom', to: 'peerDependencies' })
  move({ name: 'react-scripts', to: 'devDependencies' })

  if (packageJson.files) {
    if (!packageJson.files.includes('dist')) {
      packageJson.files.push('dist')
    }
  } else {
    packageJson.files = ['dist']
  }

  packageJson.main = 'dist/App.js'
  packageJson.types = 'dist/App.d.ts'

  delete packageJson.private

  const json = JSON.stringify(packageJson, null, 2)
  fs.writeFileSync('./package.json', json)
}
