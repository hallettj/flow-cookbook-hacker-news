/* @flow */

// The `typeof fetch` works because Flow has built-in type definitions for
// a global `fetch` function.
const nodeFetch: typeof fetch = require('node-fetch')

type Item =
  | { type: 'story', kids: ID[], url: URL }                 & ItemCommon & TopLevel
  | { type: 'ask',  kids: ID[], text: string, url: URL }    & ItemCommon & TopLevel
  | { type: 'job', text: string, url: URL }                 & ItemCommon & TopLevel
  | { type: 'poll', kids: ID[], parts: ID[], text: string } & ItemCommon & TopLevel
  | { type: 'pollopt', parent: ID, score: number, text: string } & ItemCommon
  | { type: 'comment', kids: ID[], parent: ID, text: string }    & ItemCommon

// Fields common to all item types
type ItemCommon = {
  by:   Username,
  id:   ID,
  time: number,
}

// Fields common to top-level item types
type TopLevel = {
  descendents: number,
  score: number,
  title: string,
}

// These type aliases just help to illustrate the purpose of certain fields
type Username = string
type ID = number
type URL = string

function fetchItem(id: ID): Promise<Item> {
  return nodeFetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    .then(res => res.json())
}

function getTitle(item: Item): ?string {
  if (item.type === 'story') {
    // This works because this line is only reachable if the type of
    // `item.type` is `'story'`, which means that `item` can be expected to
    // have a `title` property.
    return item.title
  }
}

function formatItem(item: Item): string {
  switch (item.type) {
    case 'story':
      return `${item.title} submitted by ${item.by}`
    case 'ask':
      return `${item.by} asked: ${item.title}`
    case 'job':
      return `job posting: ${item.title}`
    case 'poll':
      return `poll: ${item.title} - choose one of ${item.kids.length} options`
    case 'pollopt':
      return `poll option: ${item.text}`
    case 'comment':
      return `${item.by} commented: ${item.text.slice(0,60)}...`
    default:
      throw new Error(`unknown item type: ${item.type}`)
  }
}

// Fetches the largest ID, which should be the ID of the most recently-created
// item.
function fetchMaxItemId(): Promise<ID> {
  return nodeFetch(`https://hacker-news.firebaseio.com/v0/maxitem.json`)
    .then(res => res.json())
}

async function fetchLatestItems(n: number): Promise<Item[]> {
  const maxId = await fetchMaxItemId()
  const fetches = []
  for (let i = 0; i < n; i++) {
    fetches.push(fetchItem(maxId - i))
  }
  return Promise.all(fetches)
}

function formatItem(item: Item): string {
  switch (item.type) {
    case 'story':
      return `${item.title} submitted by ${item.by}`
    case 'ask':
      return `${item.by} asked: ${item.title}`
    case 'job':
      return `job posting: ${item.title}`
    case 'poll':
      return `poll: ${item.title} - choose one of ${item.kids.length} options`
    case 'pollopt':
      return `poll option: ${item.text}`
    case 'comment':
      return `${item.by} commented: ${item.text.slice(0,60)}...`
    default:
      throw new Error(`unknown item type: ${item.type}`)
  }
}

function getTitleCowboyStyle(item: Item): ?string {
  switch (item.type) {
    case 'story':
    case 'ask':
    case 'job':
    case 'poll':
      return item.title
  }
}

(async function main() {
  const latestItems = await fetchLatestItems(15)
  latestItems.forEach(item => console.log(formatItem(item)))
}())
