import { Lightbulb, AlertTriangle, TrendingUp, Clock, CheckCircle, Star, Zap } from 'lucide-react';

const WIN_PROB = { NEW: 5, CONTACTED: 15, QUALIFIED: 35, PROPOSAL: 60, WON: 100, LOST: 0 };

function daysDiff(date) {
  return Math.floor((new Date(date) - Date.now()) / 86400000);
}

function daysSince(date) {
  return Math.floor((Date.now() - new Date(date)) / 86400000);
}

function buildInsights(lead, activities) {
  const insights = [];
  const now = Date.now();

  if (lead.status === 'WON') {
    insights.push({ type: 'success', icon: CheckCircle, text: 'Deal successfully converted! Consider requesting a referral.' });
    return insights;
  }
  if (lead.status === 'LOST') {
    insights.push({ type: 'info', icon: Lightbulb, text: 'Deal marked as lost. Consider re-engaging in 3–6 months.' });
    return insights;
  }

  if (lead.priority === 'HIGH' && lead.estimatedValue > 50000) {
    insights.push({ type: 'hot', icon: Star, text: 'High-value lead. Consider involving executive sponsorship.' });
  } else if (lead.priority === 'HIGH') {
    insights.push({ type: 'warning', icon: Zap, text: 'High priority lead — prioritize outreach this week.' });
  }

  if (activities.length === 0) {
    insights.push({ type: 'warning', icon: AlertTriangle, text: 'No activities logged yet. Schedule a first touch today.' });
  } else {
    const lastActivity = activities[0];
    const age = daysSince(lastActivity.createdAt);
    if (age > 14) {
      insights.push({ type: 'warning', icon: Clock, text: `No contact in ${age} days. Re-engage before this lead goes cold.` });
    }
  }

  const overdue = activities.filter((a) => !a.completed && a.dueDate && new Date(a.dueDate) < now);
  if (overdue.length > 0) {
    insights.push({ type: 'danger', icon: AlertTriangle, text: `${overdue.length} overdue task${overdue.length > 1 ? 's' : ''} need attention.` });
  }

  if (lead.expectedCloseDate) {
    const daysLeft = daysDiff(lead.expectedCloseDate);
    if (daysLeft < 0) {
      insights.push({ type: 'danger', icon: Clock, text: `Close date passed ${Math.abs(daysLeft)} day${Math.abs(daysLeft) > 1 ? 's' : ''} ago. Update or reschedule.` });
    } else if (daysLeft <= 7) {
      insights.push({ type: 'warning', icon: Clock, text: `Close date in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}. Advance to next stage if possible.` });
    }
  }

  if (insights.length === 0) {
    insights.push({ type: 'info', icon: Lightbulb, text: 'Lead looks healthy. Keep momentum with regular touchpoints.' });
  }

  return insights;
}

const typeStyles = {
  hot: 'bg-orange-50 border-orange-200 text-orange-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  danger: 'bg-red-50 border-red-200 text-red-700',
  success: 'bg-green-50 border-green-200 text-green-700',
  info: 'bg-blue-50 border-blue-200 text-blue-700',
};

export default function LeadInsightPanel({ lead, activities }) {
  const insights = buildInsights(lead, activities);
  const prob = WIN_PROB[lead.status] || 0;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Win Probability</span>
          <span className="text-sm font-bold text-slate-900">{prob}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${prob}%`,
              backgroundColor: prob === 100 ? '#22c55e' : prob === 0 ? '#ef4444' : '#3b82f6',
            }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-1">Based on current stage: {lead.status}</p>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <Lightbulb size={12} />
          Lead Insights
        </h4>
        <div className="space-y-2">
          {insights.map((ins, i) => (
            <div key={i} className={`flex items-start gap-2.5 p-3 rounded-lg border text-sm ${typeStyles[ins.type]}`}>
              <ins.icon size={15} className="shrink-0 mt-0.5" />
              <p className="leading-snug">{ins.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
