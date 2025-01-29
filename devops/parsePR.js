const glob = require('@actions/glob');
const fs = require('fs')

async function run() {
  const patterns = ['./devops/changed-sources/force-app/main/default/classes/**.cls','./devops/changed-sources/force-app/main/default/triggers/**.cls']
  const globber = await glob.create(patterns.join('\n'))
  const files = await globber.glob()
  
  try {
    const jsonString = fs.readFileSync('./testclasses.json')
    var testClassesMap = JSON.parse(jsonString)
  } catch (err) {
    console.log('err reading testclasses.json: ' , err)
  }

  console.log('files: ' , files)
  let testClassesToRun = []
  let testLevel = 'NoTestRun'
  fileNames = files.map(f => {
    let splitted = f.split('/')
    let tmp = splitted[splitted.length-1]
    let className = tmp.split('.')[0]
    let relatedTestClassName = testClassesMap[className]
    testClassesToRun.push(relatedTestClassName)
  })

  console.log('fileNames: ' , fileNames)
  console.log('testClassesToRun: ' , testClassesToRun)
  testLevel = testClassesToRun.length > 0 ? 'RunSpecifiedTest' : 'NoTestRun'
  return { testLevel, testClassesToRun }
}

run()
