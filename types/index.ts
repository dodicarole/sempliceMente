export interface BaseItem {
  id: string
  name: string
  icon: string
  photo_url: string | null
  sort_order: number
}

export interface ScheduleItem extends BaseItem {
  day_of_week: number   // 0 = Lunedì … 4 = Venerdì
}

export interface RoutineItem extends BaseItem {}

export const DAY_NAMES  = ['LUNEDÌ', 'MARTEDÌ', 'MERCOLEDÌ', 'GIOVEDÌ', 'VENERDÌ']
export const DAY_SHORTS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven']
export const DAY_COLORS = ['#6B7FE3', '#E07090', '#3EAB7A', '#D4902A', '#9167D8']
export const FALLBACK_ICONS  = ['📚','📓','📏','🎨','🔬','📝','🥪','💧','✂️','🖍️']
export const ROUTINE_ICONS   = ['⏰','🚿','👕','🥣','🦷','👟','🎒','🧴','💊','🌟']