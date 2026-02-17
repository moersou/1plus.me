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
    name: '卢旺达饭店',
    creator: 'Terry George',
    date: '2004',
  },
  {
    name: '孟买酒店',
    creator: 'Anthony Maras',
    date: '2018',
  },
  {
    name: '一一',
    creator: '杨德昌',
    date: '2000',
  },
  {
    name: '阳光普照',
    creator: '钟孟宏',
    date: '2019',
  },
  {
    name: '大佛普拉斯',
    creator: '黄信尧',
    date: '2017',
  },
  {
    name: '鬼灭之刃 Infinity Castle',
    creator: '近藤光と外崎春雄',
    date: '2025',
  },
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
    name: '额尔古纳河右岸',
    creator: '迟子建',
  },
]

export const drama: MediaRecord[] = [
  {
    name: '人民的名义',
    creator: '李路',
    date: '2017',
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
