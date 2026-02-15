const core = require('@actions/core');
const glob = require('@actions/glob');
const fs = require('fs')

async function run() {
  try {
    core.setOutput('noDiff', false);
    const patternsToDeploy = ['./devops/changed-sources/force-app/main/default/classes/**.cls','./devops/changed-sources/force-app/main/default/triggers/**.cls']
    const globberToDeploy = await glob.create(patternsToDeploy.join('\n'))
    const filesToDeploy = await globberToDeploy.glob()
    
    if(filesToDeploy.length === 0) {
      core.setOutput('noDiff', true);
      return
    }

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
      if(relatedTestClassName !== undefined && relatedTestClassName !== null) {
        testClassesToRun.push(relatedTestClassName)
      }
      return className
    })
  
    console.log('fileNames: ' , fileNames)
    console.log('testClassesToRun: ' , testClassesToRun)
    testLevel = testClassesToRun.length > 0 ? 'RunSpecifiedTests' : 'NoTestRun'
    core.setOutput('testLevel', testLevel);

    let testClassesToRunParam = testClassesToRun.length > 0 ? '--tests ' + testClassesToRun.join(' ') : ''
    core.setOutput('testClassesToRun', testClassesToRunParam);
  } catch (err) {
    console.log('err reading testclasses.json: ' , err)
    core.setFailed(`Action failed with error ${err}`)
  }
}

run()
