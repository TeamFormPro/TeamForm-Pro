import type { GroupOptions } from '../types'

export type AlgStudent = {
  name: string
  gender?: string | null
  skill?: number | null
  exclude_with?: string[] | null
}
function mean(arr: number[]) { return arr.reduce((a,b)=>a+b,0) / (arr.length || 1) }
function variance(arr: number[]) { const m = mean(arr); return mean(arr.map(x => (x-m)*(x-m))) }
function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]] }
  return array
}

export type TeamResult = { score: number, teams: AlgStudent[][] }

export function scoreTeams(teams: AlgStudent[][], opts: GroupOptions, historyPairs: string[][]) {
  const { balanceGender, balanceSkill, respectExclusions } = opts;

  let genderPenalty = 0;
  if (balanceGender) {
    const females = teams.map(t => t.filter(s => (s.gender||'').toLowerCase().startsWith('f')).length)
    const males = teams.map(t => t.filter(s => (s.gender||'').toLowerCase().startsWith('m')).length)
    genderPenalty += variance(females) + variance(males)
  }

  let skillPenalty = 0;
  if (balanceSkill) {
    const sums = teams.map(t => t.reduce((a,s)=> a + (Number.isFinite(s.skill as number) ? (s.skill as number) : 3), 0))
    skillPenalty += variance(sums)
  }

  let repeatPenalty = 0;
  if (historyPairs?.length) {
    const seen = new Set(historyPairs.map(p => p.slice().sort().join('||')))
    for (const t of teams) {
      for (let i=0;i<t.length;i++) for (let j=i+1;j<t.length;j++) {
        const key = [t[i].name, t[j].name].sort().join('||')
        if (seen.has(key)) repeatPenalty += 1
      }
    }
  }

  let exclusionPenalty = 0;
  if (respectExclusions) {
    for (const t of teams) {
      const names = new Set(t.map(s=>s.name))
      for (const s of t) for (const bad of (s.exclude_with || [])) if (names.has(bad)) exclusionPenalty += 5
    }
  }

  const sizePenalty = variance(teams.map(t => t.length))
  return genderPenalty*4 + skillPenalty*3 + repeatPenalty*2 + exclusionPenalty*8 + sizePenalty
}

export function generateTeams(students: AlgStudent[], opts: GroupOptions, historyPairs: string[][] = []): TeamResult {
  const N = Math.max(50, Math.min(2000, (opts as any).iterations || 400));
  const count = (opts.mode === 'size')
    ? Math.ceil(students.length / Math.max(2, opts.teamSize || 2))
    : Math.max(1, opts.numTeams || 1)

  let best: TeamResult | null = null

  for (let iter=0; iter<N; iter++) {
    const pool = shuffle(students.slice())
    const teams: AlgStudent[][] = Array.from({length: count}, () => [])

    if (opts.locks?.length) {
      const byName = new Map(pool.map(s => [s.name, s]))
      for (const L of opts.locks) {
        const s = byName.get(L.studentName)
        if (!s) continue
        const idx = Math.max(0, Math.min(count-1, L.teamIndex))
        teams[idx].push(s)
        const i = pool.findIndex(p => p.name === L.studentName)
        if (i >= 0) pool.splice(i,1)
      }
    }

    const captainNames = (opts.captains || []).filter((v,i,a)=>a.indexOf(v)===i)
    if (captainNames.length) {
      const byName = new Map(pool.map(s => [s.name, s]))
      captainNames.forEach((name, idx) => {
        const s = byName.get(name)
        if (!s) return
        teams[idx % count].push(s)
        const i = pool.findIndex(p => p.name === name)
        if (i >= 0) pool.splice(i,1)
      })
    }

    for (const s of pool) {
      let bestIdx = 0, bestDelta = Infinity
      for (let i=0;i<count;i++) {
        teams[i].push(s)
        const sc = scoreTeams(teams, opts, [])
        teams[i].pop()
        if (sc < bestDelta) { bestDelta = sc; bestIdx = i }
      }
      teams[bestIdx].push(s)
    }

    const total = scoreTeams(teams, opts, [])
    if (!best || total < best.score) best = { score: total, teams }
  }
  return best!
}
