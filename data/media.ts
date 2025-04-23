export type MediaType = 'movie' | 'book' | 'anime' | 'drama' | 'game'
export type MediaState = 'done' | 'doing' | 'todo'

export interface MediaRecord {
  name: string
  creator?: string
  state?: MediaState
  date?: string
  note?: string
  lang?: string
}

export const movie: MediaRecord[] = [
  {
    name: '首尔之春',
    creator: '金成洙',
    date: '2023',
  },
  {
    name: '南山的部长们',
    creator: '禹民镐',
    date: '2020',
  },
  {
    name: '饮食男女',
    creator: '李安',
    date: '1994',
  },
  {
    name: '阿诺拉',
    creator: 'Sean Baker',
    date: '2024',
  },
]

export const anime: MediaRecord[] = [
  {
    name: 'empty',
    creator: '',
    date: '',
  },
]

export const book: MediaRecord[] = [
  {
    name: 'empty',
    creator: '',
  },
]

export const drama: MediaRecord[] = [
  {
    name: 'empty',
    date: '',
  },
]

export const game: MediaRecord[] = [
  {
    name: 'empty',
    creator: '',
    date: '',
  },
]

export const media: Record<MediaType, MediaRecord[]> = {
  movie,
  book,
  drama,
  anime,
  game,
}
