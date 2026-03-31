import type { Meta, StoryObj } from '@storybook/react'
import {
  LeaderboardCode,
  LeaderboardCodeCollapsible,
  LeaderboardLanguage,
  LeaderboardRank,
  LeaderboardRow,
  LeaderboardScore,
} from './leaderboard-row'

const meta = {
  component: LeaderboardRow,
  title: 'UI/LeaderboardRow',
} satisfies Meta<typeof LeaderboardRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <LeaderboardRow>
      <LeaderboardRank>1</LeaderboardRank>
      <LeaderboardScore>9.5</LeaderboardScore>
      <LeaderboardCode>const x = () =&gt; console.log("hello")</LeaderboardCode>
      <LeaderboardLanguage>javascript</LeaderboardLanguage>
    </LeaderboardRow>
  ),
  args: {},
}

export const ExpandableCode: Story = {
  render: () => (
    <LeaderboardRow>
      <LeaderboardRank>2</LeaderboardRank>
      <LeaderboardScore>7.2</LeaderboardScore>
      <LeaderboardCodeCollapsible
        fullCode={
          'function fibonacci(n) {\n  if (n <= 1) return n\n  return fibonacci(n - 1) + fibonacci(n - 2)\n}\n\nconsole.log(fibonacci(10))'
        }
        language="javascript"
      />
      <LeaderboardLanguage>javascript</LeaderboardLanguage>
    </LeaderboardRow>
  ),
  args: {},
}
