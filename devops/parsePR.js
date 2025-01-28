const glob = require('@actions/glob');

async function run() {
  const patterns = ['./devops/changed-sources/force-app/main/default/classes/**.cls','./devops/changed-sources/force-app/main/default/triggers/**.cls']
  const globber = await glob.create(patterns.join('\n'))
  const files = await globber.glob()
  
  console.log('files: ' , files)
  fileNames = files.map(f => {
    let splitted = f.split('/')
    let tmp = splitted[splitted.length-1]
    return tmp.split('.')[0]
  })

  console.log('fileNames: ' , fileNames)
}

run()
