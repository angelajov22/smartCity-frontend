import { CheckCircle, Clock, AlertCircle } from "lucide-react";

const STATUS_CONFIG = {
  solved: {
    label: "Решен",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  "in-progress": {
    label: "Во тек",
    color: "bg-blue-100 text-blue-700",
    icon: Clock,
  },
  pending: {
    label: "Во чекање",
    color: "bg-amber-100 text-amber-700",
    icon: AlertCircle,
  },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
