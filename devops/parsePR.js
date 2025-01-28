const glob = require('@actions/glob');

async function run() {
  const patterns = ['./devops/changed-sources/force-app/main/default/classes/**.cls','./devops/changed-sources/force-app/main/default/triggers/**.cls']
  const globber = await glob.create(patterns.join('\n'))
  const files = await globber.glob()
  
  console.log('files: ' , files)
}

run()
