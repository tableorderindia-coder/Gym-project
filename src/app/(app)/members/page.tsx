import { GlassCard } from "@/components/ui/glass-card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusPill } from "@/components/ui/status-pill";
import { fetchMembers } from "@/features/members/actions";

type MemberState = "ACTIVE" | "EXPIRING" | "EXPIRED" | "LOST";

type Member = {
  id: string;
  full_name: string;
  notes: string | null;
  state: MemberState;
};

export default async function MembersPage() {
  const { members = [], error } = await fetchMembers();

  if (error) {
    return (
      <div className="p-8 text-center" style={{ color: "var(--accent-red)" }}>
        {error}
      </div>
    );
  }

  const stats = {
    ACTIVE: members.filter((m: Member) => m.state === "ACTIVE").length,
    EXPIRING: members.filter((m: Member) => m.state === "EXPIRING").length,
    EXPIRED: members.filter((m: Member) => m.state === "EXPIRED").length,
  };

  const statCards = [
    {
      label: "Active",
      value: stats.ACTIVE.toString(),
      color: "var(--accent-lime)",
      glow: "lime" as const,
    },
    {
      label: "Expiring",
      value: stats.EXPIRING.toString(),
      color: "var(--accent-amber)",
      glow: "amber" as const,
    },
    {
      label: "Expired",
      value: stats.EXPIRED.toString(),
      color: "var(--accent-red)",
      glow: "red" as const,
    },
  ];

  return (
    <section className="space-y-8">
      <PageHeader
        tag="Members"
        title="Keep the active base visible"
        description="A lightweight view for member state, renewal urgency, and recent visit context."
      />

      <div className="grid gap-4 md:grid-cols-3 stagger">
        {statCards.map((card) => (
          <GlassCard key={card.label} glow={card.glow}>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {card.label}
            </p>
            <p
              className="mt-2 text-3xl font-bold font-display"
              style={{ color: card.color }}
            >
              {card.value}
            </p>
          </GlassCard>
        ))}
      </div>

      <GlassCard hoverable={false}>
        <div className="flex items-center justify-between">
          <h2
            className="text-lg font-bold font-display"
            style={{ color: "var(--text-primary)" }}
          >
            Member snapshot
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Total: {members.length}
          </p>
        </div>
        <div className="mt-5 space-y-3">
          {members.length === 0 ? (
            <p className="py-8 text-center" style={{ color: "var(--text-secondary)" }}>
              No members found yet.
            </p>
          ) : (
            members.map((member: Member) => (
              <div
                key={member.id}
                className="flex flex-col gap-2 rounded-xl px-4 py-4 transition-all sm:flex-row sm:items-center sm:justify-between"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                <div>
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                    {member.full_name}
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {member.notes || "No notes added"}
                  </p>
                </div>
                <StatusPill state={member.state} />
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </section>
  );
}
