import 'dotenv/config'
import { faker } from '@faker-js/faker'
import { sql } from 'drizzle-orm'
import { db } from './index.js'

const roastQuotes = [
  'This code is so spaghetti, even Italians are confused.',
  "Your variable naming convention is 'writeEverythingInOneLine'.",
  "I've seen more organized code in a Black Friday sale.",
  "Congratulations! You've achieved maximum cognitive load in minimum lines.",
  'This code has more bugs than a summer picnic.',
  "Your function does everything except what it's supposed to do.",
  "I'm not saying it's bad, but your code would make a compiler cry.",
  'The person who wrote this should be tried for crimes against programming.',
  'Your code is like a plot twist - completely unexpected and hard to follow.',
  "I've seen better architecture in a house of cards.",
  "This code is so nested, it's practically a Russian doll.",
  'Your variable names are as creative as a beige wall.',
  "This code would fail a code review faster than you can say 'WTF'.",
  "Your commit message said 'fixed stuff' - very informative.",
  'This code would make a linter quit its job.',
  'Your solution is creative, but wrong.',
  "I've seen clearer code in an encrypted message.",
  'This code has the complexity of a soap opera plot.',
  'Your indentation is... creative. Very avant-garde.',
  'This code would confuse even the person who wrote it.',
  "The 'any' types are strong with this one.",
  "Your error handling is 'hope it doesn't break'.",
  'This code is a great example of how not to do it.',
  "I'm pretty sure your code uses black magic.",
  'This has more side effects than a pharmaceutical commercial.',
  "Your null checks are 'optimistic' at best.",
  'This code would fail the Turing test of code quality.',
  "I've seen more DRY code in the Sahara desert.",
  "Your comments explain the 'what', never the 'why'.",
  'This code is a perfect example of technical debt.',
  'Your global variables are having a party without your knowledge.',
  "This code is why we can't have nice things.",
  'Your magic numbers are literally magic - nobody knows what they mean.',
  'This code was clearly written at 3 AM.',
  'Your recursion has more depth than the Mariana Trench.',
  'This code is an infinite loop of bad decisions.',
  "Your naming convention is 'keyboard smash'.",
  "I've seen more consistent behavior in chaos theory.",
  'This code would make Bob Martin weep.',
  "Your code is proof that 'just works' is not a design pattern.",
  'This has more temporal coupling than a bad romance novel.',
  'Your code smells worse than a Limburger cheese.',
  "I've seen better separation of concerns in a haunted house.",
  "This code is a perfect example of 'it works on my machine'.",
  'Your abstraction is as flat as a pancake.',
  'This code would make Kent Beck sad.',
  'Your state management is more chaotic than my love life.',
  "I've seen more predictable code in a lottery draw.",
  'This code is why we need code reviews.',
  "Your error messages are as helpful as 'something went wrong'.",
]

const badCodePatterns: Record<string, string[]> = {
  javascript: [
    'function calculate(x,y){return x+y}',
    'const data = await fetch(url); return data.json();',
    'var result = arr.filter(x=>x>5).map(x=>x*2).reduce((a,b)=>a+b);',
    'function doStuff(){if(x>10){return true}else{return false}}',
    'let data; fetch(url).then(r=>r.json()).then(d=>{data=d});',
    'const x=1;const y=2;const z=3;const a=4;const b=5;export{a,b,x,y,z};',
    'for(var i=0;i<10;i++){console.log(i)}',
    'function process(data){if(data)return process(data)}',
    'try{}catch(e){console.log(e)}',
    'const arr=new Array();arr.push(1);arr.push(2);',
  ],
  typescript: [
    'function calc(x:any,y:any):any{return x+y}',
    'const data:any=await fetch(url).then(r=>r.json())',
    'interface Props{props:any}export default function(props:any){return <div>{props.children}</div>}',
    'type T=string|number|boolean|any[]|object|null|undefined;',
    'const f=(x:any)=>{return x}',
    'class Bad{private x:any;public y:any;protected z:any;}',
    'const obj:any={};obj.method=()=>obj;',
    "const arr:any[]=[1,'2',true,null,undefined,{}]",
    "function nuke(){throw new Error('any')}",
    'type X=typeof something?.nested?.deeply?.unknown',
  ],
  python: [
    'def calc(x,y):return x+y',
    'def process(data):return [x for x in data if x>0]',
    'class Bad:def __init__(self):self.x=1;self.y=2',
    'def func():x=1;y=2;z=3;return x+y+z',
    "data={'a':1,'b':2,'c':3};result=data['a']+data['b']",
    'def foo(x):print(x);return x',
    'class MyClass:pass',
    "def broken():raise Exception('oops')",
    'x=1;y=2;z=3;a=4;b=5;print(x+y+z+a+b)',
    "import * as everything from 'everything'",
  ],
  go: [
    'func calc(x int, y int) interface{}{return x+y}',
    'var data map[string]interface{}',
    'type Bad struct{Field interface{}}',
    'func process() (interface{},error){return nil,nil}',
    'var x,y,z int=1,2,3',
    'if err!=nil{return nil}else{return result}',
    'var arr []interface{};arr=append(arr,1,"2",true)',
    'for i:=0;i<10;i++{fmt.Println(i)}',
    'func main(){defer func(){recover()}}()',
    'const x,y,z int=1,2,3',
  ],
  rust: [
    'fn calc(x:i32,y:i32)->impl Into<String>{x+y}',
    'let data:Vec<_>=vec![1,"2",true]',
    'fn process(){let mut v=Vec::new();v.push(1);v.push(2);}',
    'struct Bad{x:i32,y:String,z:Vec<u8>}',
    'let result:Result<_,Box<dyn std::error::Error>>=Ok(())',
    'fn main(){let x:u8=255;let y=x+1;}',
    'use std::collections::HashMap;let mut m:HashMap<_,_>=HashMap::new();',
    'fn dangerous(){panic!("any")}',
    'let tuple:(i32,&str,bool)=(1,"2",true);',
    'struct Bad{x:i32,}fn new()->Self{Self{x:0}}',
  ],
  java: [
    'public int calc(int x,int y){return x+y;}',
    'public Object process(Object data){return data;}',
    'private String x;private int y;private Object z;',
    'public void doStuff(){try{}catch(Exception e){e.printStackTrace();}}',
    'List<Object> list=Arrays.asList(1,"2",true,null);',
    'public class Bad{public Bad(){x=1;y=2;}}',
    'if(x==null){return null;}else{return x.toString();}',
    'String s="";for(int i=0;i<100;i++){s+=i;}',
    'public final static int X=1,Y=2,Z=3;',
    'Optional<Object> data=Optional.empty();',
  ],
  cpp: [
    'int calc(int x,int y){return x+y;}',
    'void* process(void* data){return data;}',
    'class Bad{public:int x;void*y;char*z;};',
    'int* arr=new int[100];for(int i=0;i<100;i++)arr[i]=i;',
    '#define MACRO(x) x*x',
    'int x=1;int y=2;int z=3;int a=x+y+z;',
    'try{}catch(...){}',
    'auto data=make_shared<any>();',
    'int arr[100];memset(arr,0,sizeof(arr));',
    'void doStuff(){goto label;label:return;}',
  ],
  css: [
    '.container{position:absolute;top:0;left:0;right:0;bottom:0;z-index:9999;}',
    '.bad{font-size:14px;font-size:1rem;font-size:13px;font-size:0.9rem;}',
    '.item{display:flex;display:grid;display:block;}',
    '.box{color:red;color:#ff0000;color:rgb(255,0,0);}',
    '#main{background:url(\'bg.png\');background:url("bg.png");background:url(bg.png);}',
    '.element{!important;important:!;}',
    '.nested{div{p{span{color:red;}}}}',
    '.inline{width:100%;width:calc(100%-20px);width:auto;}',
    '.style{font-family:Arial;font-family:\'Arial\';font-family:"Arial";}',
    '.mess{margin:1px;padding:2px;border:3px;color:4px;}',
  ],
  html: [
    '<div class="container"><div class="box"><div class="inner"><p>Text</p></div></div></div>',
    '<div style="color:red;font-size:14px;margin:10px;padding:5px;border:1px solid black"></div>',
    '<br><br><br><br><br><br>',
    '<table><tr><td><div><span><p>Data</p></span></div></td></tr></table>',
    '<div onclick="doStuff()"></div><script>function doStuff(){}</script>',
    '<img src="img.png" alt="" width="100" height="200" style="width:150px">',
    '<a href="#" onclick="location.href=\'/\'">Link</a>',
    '<div class="container container-two container-3"></div>',
    '<font size="5" color="red" face="Arial">Old school</font>',
    '<center><marquee>Moving text</marquee></center>',
  ],
  json: [
    '{"data":{"nested":{"deeply":{"value":"text"}}}}',
    '{"items":[null,1,"2",true,{"x":null}]}',
    '{"config":{"setting1":1,"setting2":"value","setting3":true}}',
    '{"users":[{"id":1,"name":"John"},{"id":2,"name":"Jane"}]}',
    '{"mixed":{"str":"text","num":123,"bool":true,"null":null,"arr":[1,2,3]}}',
    '{"level1":{"level2":{"level3":{"level4":"deep"}}}}',
    '{"arr":[{"a":1},{"b":2},{"c":3},{"d":4},{"e":5}]}',
    '{"data":{"count":100,"items":[null]*100}}',
    '{"config":{"active":true,"debug":true,"verbose":true,"trace":true}}',
    '{"settings":{"theme":"dark","lang":"en","region":"US","currency":"USD"}}',
  ],
}

const issueTypes = [
  'naming-convention',
  'code-complexity',
  'unused-variable',
  'security-vulnerability',
  'performance-issue',
  'code-smell',
  'best-practice',
  'error-handling',
  'type-safety',
  'maintainability',
]

const issueTitles = [
  'Consider renaming this variable',
  'Function is too complex',
  'Unused variable detected',
  'Potential security risk',
  'Performance could be improved',
  'Code smell detected',
  'Follow best practices here',
  'Missing error handling',
  'Type safety issue',
  'Hard to maintain this code',
  'Consider using a constant',
  'Too many parameters',
  'Deeply nested code',
  'Magic number found',
  'Consider extracting function',
  'Missing null check',
  'Redundant code detected',
  'Inconsistent naming',
  'Consider using enum',
  'Could use early return',
]

const languages = [
  'javascript',
  'typescript',
  'python',
  'go',
  'rust',
  'java',
  'cpp',
  'css',
  'html',
  'json',
]
const verdictsList = ['critical', 'warning', 'good', 'needs_serious_help']
const roastModesList = ['honest', 'roast']

async function clearTables() {
  console.log('🗑️  Clearing existing data...')
  await db.execute(
    sql`TRUNCATE TABLE "roasts", "analysisIssues", "codeDiffs", "leaderboard", "users" CASCADE`
  )
  console.log('✅ Tables cleared')
}

async function seedUsers(): Promise<string[]> {
  console.log('👤 Creating 10 users...')
  const userIds: string[] = []

  for (let i = 0; i < 10; i++) {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    const email = faker.internet.email().toLowerCase()
    const username = faker.internet.username().toLowerCase()

    await db.execute(
      sql`
        INSERT INTO users (id, email, username, "createdAt", "updatedAt")
        VALUES (${id}, ${email}, ${username}, ${now}, ${now})
      `
    )
    userIds.push(id)
  }

  console.log(`✅ Created ${userIds.length} users`)
  return userIds
}

async function seedRoasts(userIds: string[]): Promise<string[]> {
  console.log('🔥 Creating 100 roasts...')
  const roastIds: string[] = []

  for (let i = 0; i < 100; i++) {
    const id = crypto.randomUUID()
    const now = faker.date.past({ years: 1 }).toISOString()
    const language = faker.helpers.arrayElement(languages)
    const verdict = faker.helpers.arrayElement(verdictsList)
    const roastMode = faker.helpers.arrayElement(roastModesList)
    const hasUser = i < 70
    const userId = hasUser ? faker.helpers.arrayElement(userIds) : null
    const code = faker.helpers.arrayElement(badCodePatterns[language] || badCodePatterns.javascript)
    const lineCount = code.split('\n').length
    const score = faker.number.float({ min: 0, max: 100, fractionDigits: 2 })
    const roastQuote = faker.helpers.arrayElement(roastQuotes)

    await db.execute(
      sql`
        INSERT INTO roasts (id, "userId", code, language, "lineCount", score, verdict, "roastQuote", "roastMode", "createdAt", "updatedAt")
        VALUES (${id}, ${userId}, ${code}, ${language}, ${lineCount}, ${score}, ${verdict}, ${roastQuote}, ${roastMode}, ${now}, ${now})
      `
    )
    roastIds.push(id)

    if ((i + 1) % 25 === 0) {
      console.log(`  📦 Created ${i + 1}/100 roasts...`)
    }
  }

  console.log(`✅ Created ${roastIds.length} roasts`)
  return roastIds
}

async function seedAnalysisIssues(roastIds: string[]) {
  console.log('🔍 Creating analysis issues...')
  let totalIssues = 0

  for (const roastId of roastIds) {
    const issueCount = faker.number.int({ min: 2, max: 4 })

    for (let i = 0; i < issueCount; i++) {
      const id = crypto.randomUUID()
      const now = faker.date.past({ years: 1 }).toISOString()
      const title = faker.helpers.arrayElement(issueTitles)
      const description = faker.lorem.sentence()
      const severity = faker.helpers.arrayElement(verdictsList)
      const issueType = faker.helpers.arrayElement(issueTypes)
      const lineNumber = faker.number.int({ min: 1, max: 50 })

      await db.execute(
        sql`
          INSERT INTO "analysisIssues" (id, "roastId", title, description, severity, "issueType", "lineNumber", "createdAt")
          VALUES (${id}, ${roastId}, ${title}, ${description}, ${severity}, ${issueType}, ${lineNumber}, ${now})
        `
      )
      totalIssues++
    }
  }

  console.log(`✅ Created ${totalIssues} analysis issues`)
}

async function seedCodeDiffs(roastIds: string[]) {
  console.log('📝 Creating code diffs...')
  let totalDiffs = 0

  for (const roastId of roastIds) {
    const diffCount = faker.number.int({ min: 1, max: 2 })

    for (let i = 0; i < diffCount; i++) {
      const id = crypto.randomUUID()
      const now = faker.date.past({ years: 1 }).toISOString()
      const removedLine = faker.helpers.maybe(() => `// ${faker.lorem.sentence()}`) ?? null
      const addedLine = faker.helpers.maybe(() => `// ${faker.lorem.sentence()}`) ?? null
      const context = faker.helpers.maybe(() => faker.lorem.lines(1)) ?? null
      const lineNumber = faker.number.int({ min: 1, max: 50 })

      await db.execute(
        sql`
          INSERT INTO "codeDiffs" (id, "roastId", "removedLine", "addedLine", context, "lineNumber", "createdAt")
          VALUES (${id}, ${roastId}, ${removedLine}, ${addedLine}, ${context}, ${lineNumber}, ${now})
        `
      )
      totalDiffs++
    }
  }

  console.log(`✅ Created ${totalDiffs} code diffs`)
}

async function seedLeaderboard(_roastIds: string[]) {
  console.log('🏆 Creating leaderboard (top 10)...')

  const roastResults = await db.execute(
    sql`SELECT id, score, language, code FROM roasts ORDER BY score DESC LIMIT 20`
  )
  const topRoasts = roastResults.rows.slice(0, 10)

  for (let i = 0; i < topRoasts.length; i++) {
    const roast = topRoasts[i] as { id: string; score: number; language: string; code: string }
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    const codePreview = roast.code.slice(0, 100)

    await db.execute(
      sql`
        INSERT INTO leaderboard (id, "roastId", rank, score, language, "codePreview", "updatedAt")
        VALUES (${id}, ${roast.id}, ${i + 1}, ${roast.score}, ${roast.language}, ${codePreview}, ${now})
      `
    )
  }

  console.log(`✅ Created ${topRoasts.length} leaderboard entries`)
}

async function seed() {
  console.log('🌱 Starting seed...\n')

  try {
    await clearTables()
    const userIds = await seedUsers()
    const roastIds = await seedRoasts(userIds)
    await seedAnalysisIssues(roastIds)
    await seedCodeDiffs(roastIds)
    await seedLeaderboard(roastIds)

    console.log('\n✨ Seed completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Seed failed:', error)
    process.exit(1)
  }
}

seed()
