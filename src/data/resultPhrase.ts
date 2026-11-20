export interface Grade {
  /** Shown as the heading and said first: "Перфектно!", "Отлично!" … */
  title: string
  emoji: string
  /** Said after the score, on the lower grades only. */
  encouragement?: string
}

/**
 * The grade for a score. Every grade praises: the lowest still thanks the
 * child for playing, and points to next time rather than at what went wrong.
 */
export function gradeFor(correct: number, total: number): Grade {
  const ratio = total > 0 ? correct / total : 0
  if (ratio >= 1) return { title: 'Перфектно!', emoji: '🌟' }
  if (ratio >= 0.8) return { title: 'Отлично!', emoji: '🎉' }
  if (ratio >= 0.6) return { title: 'Много добре!', emoji: '👏' }
  if (ratio >= 0.4) return { title: 'Добре!', emoji: '👍', encouragement: 'Продължавай така!' }
  return { title: 'Браво, че игра!', emoji: '💪', encouragement: 'Следващия път ще стане още по-добре!' }
}

// Spelled out, not left as digits: "точки" is feminine, and a speech engine
// reading "1" or "2" on its own picks "едно" and "два" instead of "една" and "две".
const FEMININE_NUMBERS = ['нула', 'една', 'две', 'три', 'четири', 'пет', 'шест', 'седем', 'осем', 'девет', 'десет']

function spoken(n: number): string {
  return FEMININE_NUMBERS[n] ?? String(n)
}

/** "Отлично! Имаш осем от десет точки!" */
export function buildResultPhrase(correct: number, total: number): string {
  const grade = gradeFor(correct, total)
  const score = `Имаш ${spoken(correct)} от ${spoken(total)} точки!`
  return [grade.title, score, grade.encouragement].filter(Boolean).join(' ')
}
