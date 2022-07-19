#! /usr/bin/env node
const fs = require('fs')
const path = require('path')

if (process.argv.length > 2) {
  const joined = path.join('.', process.argv[2])
  const resolved = path.resolve(joined)
  const packageJson = require(resolved)

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

  packageJson.main = 'dist/tsup.js'
  packageJson.types = 'dist/tsup.d.ts'

  delete packageJson.private

  const json = JSON.stringify(packageJson, null, 2)
  fs.writeFileSync('./package.json', json)
}
