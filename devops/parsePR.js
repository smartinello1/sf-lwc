const core = require('@actions/core');
const glob = require('@actions/glob');
const fs = require('fs')

async function run() {
  try {
    const patterns = ['./devops/changed-sources/force-app/main/default/classes/**.cls','./devops/changed-sources/force-app/main/default/triggers/**.cls']
    const globber = await glob.create(patterns.join('\n'))
    const files = await globber.glob()
    
    
    const jsonString = fs.readFileSync('./devops/testclasses.json')
    var testClassesMap = JSON.parse(jsonString)
  
    console.log('files: ' , files)
    let testClassesToRun = []
    let testLevel = 'NoTestRun'
    fileNames = files.map(f => {
      let splitted = f.split('/')
      let tmp = splitted[splitted.length-1]
      let className = tmp.split('.')[0]
      let relatedTestClassName = testClassesMap[className]
      testClassesToRun.push(relatedTestClassName)
      return className
    })
  
    console.log('fileNames: ' , fileNames)
    console.log('testClassesToRun: ' , testClassesToRun)
    testLevel = testClassesToRun.length > 0 ? 'RunSpecifiedTests' : 'NoTestRun'
    // return { testLevel, testClassesToRun }
    core.setOutput('testLevel', testLevel);
    core.setOutput('testClassesToRun', testClassesToRun.join(' '));
  } catch (err) {
    console.log('err reading testclasses.json: ' , err)
    core.setFailed(`Action failed with error ${err}`)
  }
}

run()
