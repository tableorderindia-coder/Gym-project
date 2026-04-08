import { StreakBadge } from "@/components/streak-badge";
import { calculateAttendanceStreak } from "@/features/attendance/queries";
import { GlassCard } from "@/components/ui/glass-card";
import { PageHeader } from "@/components/ui/page-header";
import { fetchAttendanceToday, fetchAttendanceStats } from "@/features/attendance/actions";

type AttendanceLog = {
  id: string;
  check_in_at: string;
  member?: {
    full_name: string | null;
  } | null;
};

export default async function AttendancePage() {
  const [{ attendance = [], error: attendanceError }, { todayCount = 0, recentVisits = [] }] = await Promise.all([
    fetchAttendanceToday(),
    fetchAttendanceStats()
  ]);

  const { currentStreak, bestStreak } = calculateAttendanceStreak(recentVisits);

  if (attendanceError) {
    return (
      <div className="p-8 text-center" style={{ color: "var(--accent-red)" }}>
        {attendanceError}
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <PageHeader
        tag="Attendance"
        title="Check-in members and track consistency"
        description="Monitor daily attendance and gym activity streaks to identify engagement patterns."
      />

      <div className="grid gap-4 md:grid-cols-3 stagger">
        <GlassCard glow="amber">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Gym check-ins today
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold font-display" style={{ color: "var(--accent-lime)" }}>
              {todayCount}
            </span>
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              members
            </span>
          </div>
        </GlassCard>

        <GlassCard glow="orange">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Activity streak
          </p>
          <div className="mt-3 flex items-center gap-3">
            <StreakBadge days={currentStreak} />
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Best: {bestStreak} days
            </p>
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Recent active days
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {recentVisits.length === 0 ? (
              <span className="text-xs italic" style={{ color: "var(--text-secondary)" }}>
                No recent activity
              </span>
            ) : (
              [...new Set(recentVisits)].slice(0, 5).map((date) => (
                <span
                  key={date}
                  className="rounded-lg px-2.5 py-1 text-xs font-mono font-medium"
                  style={{
                    background: "rgba(168, 224, 99, 0.12)",
                    color: "var(--accent-lime)",
                    border: "1px solid rgba(168, 224, 99, 0.2)",
                  }}
                >
                  {date}
                </span>
              ))
            )}
          </div>
        </GlassCard>
      </div>

      <GlassCard hoverable={false}>
        <div className="flex items-center justify-between">
          <h2
            className="text-lg font-bold font-display"
            style={{ color: "var(--text-primary)" }}
          >
            Today&apos;s check-ins
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
          </p>
        </div>
        
        <div className="mt-6 space-y-3">
          {attendance.length === 0 ? (
            <p className="py-12 text-center" style={{ color: "var(--text-secondary)" }}>
              No check-ins recorded for today yet.
            </p>
          ) : (
            attendance.map((log: AttendanceLog) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-xl px-4 py-4"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                <div>
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                    {log.member?.full_name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {new Date(log.check_in_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div 
                  className="rounded-full h-2 w-2 shadow-[0_0_8px_rgba(168,224,99,0.6)]"
                  style={{ background: "var(--accent-lime)" }}
                />
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </section>
  );
}
