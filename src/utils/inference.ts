/**
 * BBIE Active Intelligence Engine
 * Handles Part B of Theme 1: Activity classification based on event streams.
 */

export type ActivityStatus = 'active' | 'dormant' | 'closed';

interface ActivityEvent {
  event_type: string;
  event_date: string;
  metadata?: any;
}

export interface InferenceResult {
  status: ActivityStatus;
  confidence: number;
  reasoning: string;
  score: number;
}

const EVENT_WEIGHTS: Record<string, number> = {
  'inspection': 1.0,
  'renewal': 0.7,
  'compliance': 0.5,
  'filing': 0.4,
  'tax_payment': 0.6,
  'utility_bill': 0.3
};

/**
 * Infers business status from a stream of events using PRD Section 22 logic
 */
export function inferStatus(events: ActivityEvent[]): InferenceResult {
  if (!events || events.length === 0) {
    return {
      status: 'closed',
      confidence: 0.6,
      reasoning: 'No activity signals detected in the observation period. Suggesting administrative closure.',
      score: 0
    };
  }

  // Sort events by date descending
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
  );

  const now = new Date();
  const lastEventDate = new Date(sortedEvents[0].event_date);
  const daysSinceLastActivity = (now.getTime() - lastEventDate.getTime()) / (1000 * 60 * 60 * 24);

  // Calculate Weighted Score
  let score = 0;
  const uniqueEventTypes = new Set<string>();
  
  sortedEvents.forEach(event => {
    const type = event.event_type.toLowerCase();
    const weight = EVENT_WEIGHTS[type] || 0.2;
    // We count score based on unique event types to avoid gaming the system with duplicate signals
    if (!uniqueEventTypes.has(type)) {
      score += weight;
      uniqueEventTypes.add(type);
    }
  });

  // PRD Classification Logic
  
  // 1. Active: last activity < 180 days AND score >= 1.5
  if (daysSinceLastActivity < 180 && score >= 1.5) {
    return {
      status: 'active',
      confidence: Math.min(0.7 + (score * 0.1), 0.98),
      reasoning: `High-intensity activity detected within 180 days. Score: ${score.toFixed(1)}.`,
      score
    };
  }

  // 2. Closed: > 730 days
  if (daysSinceLastActivity > 730) {
    return {
      status: 'closed',
      confidence: 0.9,
      reasoning: `Terminal inactivity detected (> 730 days). No signals since ${lastEventDate.toLocaleDateString()}.`,
      score
    };
  }

  // 3. Dormant: 180 - 730 days OR (recent activity but low score)
  return {
    status: 'dormant',
    confidence: 0.8,
    reasoning: daysSinceLastActivity >= 180 
      ? `Inactivity period (${Math.floor(daysSinceLastActivity)} days) suggests dormancy.`
      : `Recent signals detected but insufficient diversity (Score: ${score.toFixed(1)} < 1.5).`,
    score
  };
}
