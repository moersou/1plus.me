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
    name: 'The Dark Knight',
    creator: 'Nolan',
    date: '2008',
  },
  {
    name: 'The Odyssey',
    creator: 'Nolan',
    date: '2016',
  },
  {
    name: 'Dear You - 给阿嬷的情书',
    creator: '蓝鸿春',
    date: '2016',
  },
  {
    name: 'Hotel Rwanda',
    creator: 'Terry George',
    date: '2004',
  },
  {
    name: 'Hotel Mumbai',
    creator: 'Anthony Maras',
    date: '2018',
  },
  {
    name: 'A One and a Two - 一一',
    creator: '杨德昌',
    date: '2000',
  },
  {
    name: 'A Sun - 阳光普照',
    creator: '钟孟宏',
    date: '2019',
  },
  {
    name: 'The Great Buddha - 大佛普拉斯',
    creator: '黄信尧',
    date: '2017',
  },
  {
    name: 'Infinity Castle- 鬼灭之刃',
    creator: '近藤光と外崎春雄',
    date: '2025',
  },
  {
    name: '12.12: The Day - 首尔之春',
    creator: '金成洙',
    date: '2023',
  },
  {
    name: 'The Man Standing Next- 南山的部长们',
    creator: '禹民镐',
    date: '2020',
  },
  {
    name: 'Eat Drink Man Woman- 饮食男女',
    creator: '李安',
    date: '1994',
  },
  {
    name: 'Anora',
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
    name: '置身事内：中国政府与经济发展',
    creator: '兰小欢',
  },
  {
    name: '额尔古纳河右岸',
    creator: '迟子建',
  },
]

export const drama: MediaRecord[] = [
  {
    name: '悬案',
    creator: '算',
    date: '2026',
  },
  {
    name: '人民的名义',
    creator: '李路',
    date: '2017',
  },
]

export const game: MediaRecord[] = [
  {
    name: 'Hollow Knight: Silksong',
    creator: 'Team Cherry',
    date: '2025',
  },
]

export const media: Record<MediaType, MediaRecord[]> = {
  movie,
  book,
  drama,
  anime,
  game,
}
