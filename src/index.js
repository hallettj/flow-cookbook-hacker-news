/*
 * This is a demonstration Javascript type-checking using Flow. This example is
 * a Hacker News client.
 *
 * Take a look at the accompanying blog post:
 * http://sitr.us/2016/12/20/flow-cookbook-unpacking-json.html
 *
 * The full code for this project is here:
 * https://github.com/hallettj/flow-cookbook-hacker-news
 *
 * @flow
 */

// The `typeof fetch` works because Flow has built-in type definitions for
// a global `fetch` function.
const nodeFetch: typeof fetch = require('node-fetch')

export type Item = Story | Ask | Job | Poll | PollOpt | Comment | DeletedComment

export type Story   = { type: 'story', kids?: ID[], url: URL }                 & ItemCommon & TopLevel
export type Ask     = { type: 'ask',  kids?: ID[], text: string, url: URL }    & ItemCommon & TopLevel
export type Job     = { type: 'job', text: string, url: URL }                  & ItemCommon & TopLevel
export type Poll    = { type: 'poll', kids?: ID[], parts: ID[], text: string } & ItemCommon & TopLevel
export type PollOpt = { type: 'pollopt', parent: ID, score: number, text: string } & ItemCommon
export type Comment = { type: 'comment', kids?: ID[], parent: ID, text: string }   & ItemCommon

export type DeletedComment = {
  type:    'comment',
  dead:    true,
  deleted: true,
  id:      ID,
  kids?:   ID[],
  parent:  ID,
  time:    number,
}

// Fields common to all item types
type ItemCommon = {
  by:       Username,
  id:       ID,
  time:     number,
  dead?:    false,
  deleted?: false,
}

// Fields common to top-level item types
type TopLevel = {
  descendents: number,
  score:       number,
  title:       string,
}

// These type aliases just help to illustrate the purpose of certain fields
export type Username = string
export type ID = number
export type URL = string

export function fetchItem(id: ID): Promise<Item> {
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
      return `"${item.title}" submitted by ${item.by}`
    case 'ask':
      return `${item.by} asked: ${item.title}`
    case 'job':
      return `job posting: ${item.title}`
    case 'poll':
      const numOpts = item.kids ? item.kids.length : 0
      return `poll: "${item.title}" - choose one of ${numOpts} options`
    case 'pollopt':
      return `poll option: ${item.text}`
    case 'comment':
      return item.deleted
        ? '(deleted)'
        : `${item.by} commented: ${item.text.slice(0,60)}...`
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

export async function fetchLatestItems(n: number): Promise<Item[]> {
  const maxId = await fetchMaxItemId()
  const fetches = []
  for (let i = 0; i < n; i++) {
    fetches.push(fetchItem(maxId - i))
  }
  return Promise.all(fetches)
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

export async function main() {
  const latestItems = await fetchLatestItems(15)
  latestItems.forEach(item => {
    console.log(formatItem(item) + "\n")
  })
}

function formatPoll({ by, deleted, title }: Poll, opts: PollOpt[]): string {
  const headline = `${by} started a poll: "${title}"`
  return headline + "\n" + opts.map(opt => `  - ${opt.text}`).join("\n")
}

export async function fetchPollOpts({ parts }: Poll): Promise<PollOpt[]> {
  const promises = parts.map(fetchItem)
  const items = await Promise.all(promises)
  return flatMap(items, item => (
    item.type === 'pollopt' ? [item] : []
  ))
}

async function displayItem(item) {
  if (item.type === 'poll') {
    // At this point the type of `item` has been narrowed so that we can pass it
    // to specialized functions.
    const opts = await fetchPollOpts(item)
    formatPoll(item, opts)
  }
  else if (item.type === 'pollopt') {
    // do nothing
  }
  else {
    console.log(formatItem(item) + "\n")
  }
}

export async function betterClient() {
  const latestItems = await fetchLatestItems(15)
  for (const item of latestItems) {
    await displayItem(item)
  }
}


/* Additional Hacker News API endpoints */

export async function fetchTopStories(n: number): Promise<Story[]> {
  const storyIds = await nodeFetch(`https://hacker-news.firebaseio.com/v0/topstories.json`)
    .then(res => res.json())
  return fetchNStories(storyIds, n)
}

async function fetchNStories(storyIds: ID[], n: number): Promise<Story[]> {
  const results = await Promise.all(
    storyIds.slice(0,n).map(fetchStory)
  )
  const justStories = nub(results)

  // Check to see if `nub` left us with fewer than `n` stories.
  if (justStories.length < n && storyIds.length > n) {
    const m = n - justStories.length
    const remainingIds = storyIds.slice(n)
    return justStories.concat(await fetchNStories(remainingIds, m))
  }
  else {
    return justStories
  }
}

// Fetch an item, but resolve to `null` if the item is not a story.
async function fetchStory(id: ID): Promise<?Story> {
  const item = await fetchItem(id)
  if (item.type === 'story') {
    return item
  }
  else {
    return null
  }
}

export type CommentTree = { comment: Comment | DeletedComment, kids: CommentTree[] }

export function fetchComments({ kids }: Story | Comment | DeletedComment): Promise<CommentTree[]> {
  if (!kids) {
    return Promise.resolve([])
  }
  return Promise.all(kids.map(async function(id) {
    const comment = await fetchComment(id)
    const kids = await fetchComments(comment)
    return { comment, kids }
  }))
}

async function fetchComment(id: ID): Promise<Comment | DeletedComment> {
  const item = await fetchItem(id)
  if (item.type === 'comment') {
    return item
  }
  else {
    return Promise.reject(new Error(`item ${id} is an ${item.type}, not a comment`))
  }
}


/* helpers */

// Provides flexible array processing - this function can be used to remove
// items from an array, to replace individual items with multiple items in the
// output array, or pretty much anything you might need.
function flatMap<A, B>(xs: A[], fn: (x: A) => B[]): B[] {
  const result = []
  for (const x of xs) {
    result.push.apply(result, fn(x))
  }
  return result
}

// Removes `null` or `undefined` values from an array
function nub<A>(xs: Array<?A>): Array<A> {
  return flatMap(xs, x => x ? [x] : [])
}
