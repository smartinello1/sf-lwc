const glob = require('@actions/glob');

async function start() {
  const patterns = ['./devops/changed-sources/**.cls']
  const globber = await glob.create(patterns.join('\n'))
  const files = await globber.glob()
  
  console.log('files: ' , files)
}

start()
