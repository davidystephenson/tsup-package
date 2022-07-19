#! /usr/bin/env node
const packageJson = require('./package.json')
const fs = require('fs')

function move ({ name, to }) {
  if (packageJson.dependencies[name] != null) {
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
