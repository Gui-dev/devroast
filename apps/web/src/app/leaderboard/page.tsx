import { LeaderboardEntry } from '@/components/ui/leaderboard-entry'
import type { Metadata } from 'next'
import type { BundledLanguage } from 'shiki'

export const metadata: Metadata = {
  title: 'Shame Leaderboard | devroast',
  description: 'The most roasted code on the internet, ranked by shame.',
}

interface LeaderboardData {
  rank: number
  score: number
  language: BundledLanguage
  code: string
}

const leaderboardData: LeaderboardData[] = [
  {
    rank: 1,
    score: 9.8,
    language: 'javascript',
    code: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`,
  },
  {
    rank: 2,
    score: 9.2,
    language: 'typescript',
    code: `async function fetchUser(id: string) {
  const response = await fetch('/api/user/' + id);
  const data = response.json();
  return data;
}`,
  },
  {
    rank: 3,
    score: 8.9,
    language: 'python',
    code: `def get_user(id):
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = " + id)
    return cursor.fetchone()`,
  },
  {
    rank: 4,
    score: 7.5,
    language: 'javascript',
    code: `const handleClick = () => {
  console.log('clicked');
  doSomething();
  doSomethingElse();
  fetchData();
  updateUI();
}`,
  },
  {
    rank: 5,
    score: 6.8,
    language: 'typescript',
    code: `type Props = {
  items: Array<any>;
  onSelect: (item: any) => void;
}

function List({ items, onSelect }: Props) {
  return items.map(item => (
    <div onClick={() => onSelect(item)} key={item.id}>
      {item.name}
    </div>
  ));
}`,
  },
]

const TOTAL_SUBMISSIONS = 2847
const AVG_SCORE = 4.2

export default function LeaderboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-col gap-6 px-4 sm:gap-8 sm:px-6 md:px-10 py-8 md:py-10 lg:py-16">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-2xl font-bold text-accent-green sm:text-3xl lg:text-4xl">
              &gt;
            </span>
            <h1 className="font-mono text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
              shame_leaderboard
            </h1>
          </div>
          <p className="font-mono text-xs text-text-secondary sm:text-sm">
            {'//'} the most roasted code on the internet
          </p>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-text-tertiary sm:text-sm">
            <span>{TOTAL_SUBMISSIONS.toLocaleString()} submissions</span>
            <span>·</span>
            <span>avg score: {AVG_SCORE}/10</span>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {leaderboardData.map(entry => (
            <LeaderboardEntry
              key={entry.rank}
              rank={entry.rank}
              score={entry.score}
              language={entry.language}
              code={entry.code}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
