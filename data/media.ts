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
    name: '鋼の錬金術師 FULLMETAL ALCHEMIST',
    creator: '荒川弘',
    date: '2007',
  },
]

export const book: MediaRecord[] = [
  {
    name: 'Die with Zero',
    creator: 'Bill Perkins',
  },
]

export const drama: MediaRecord[] = [
  {
    name: 'グランメゾン東京 La Grande Maison Tokyo',
    date: '2022',
  },
]

export const game: MediaRecord[] = [
  {
    name: 'Factorio',
    creator: 'Wube Software',
    date: '2013',
  },
]

export const media: Record<MediaType, MediaRecord[]> = {
  movie,
  drama,
  anime,
  game,
  book,
}
