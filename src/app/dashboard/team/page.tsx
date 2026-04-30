"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function TeamPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [team, setTeam] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(profile);

      if (profile?.piano === "team" && profile?.team_id) {
        const { data: team } = await supabase.from("teams").select("*").eq("id", profile.team_id).single();
        const { data: members } = await supabase.from("team_members").select("*").eq("team_id", profile.team_id);
        setTeam(team);
        setMembers(members || []);
      }
      setLoading(false);
    };
    getData();
  }, [router, supabase]);

  const handleCreateTeam = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: newTeam } = await supabase.from("teams").insert({ nome: "Il mio team", owner_id: user?.id }).select().single();
    if (newTeam) {
      await supabase.from("team_members").insert({ team_id: newTeam.id, user_id: user?.id, ruolo: "owner" });
      await supabase.from("profiles").update({ team_id: newTeam.id }).eq("id", user?.id);
      setTeam(newTeam);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    // Invite logic here
  };

  if (loading) return <div className="max-w-2xl min-h-[400px] flex items-center justify-center"><div className="text-[#6B7280]">Caricamento...</div></div>;

  if (profile?.piano !== "team") {
    return (
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#111827]">Team</h1>
          <p className="text-sm text-[#6B7280] mt-1">Gestisci il tuo team di lavoro</p>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
          <h2 className="text-lg font-semibold text-[#111827] mb-2">Piano Team non attivo</h2>
          <p className="text-sm text-[#6B7280] mb-4">Il tuo piano attuale non include la funzionalità team.</p>
          <Link href="/prezzi"><Button>Passa a Team — 99€/mese</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">Team</h1>
        <p className="text-sm text-[#6B7280] mt-1">Gestisci i membri del tuo team</p>
      </div>

      {!team ? (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">Crea il tuo team</h2>
          <Button onClick={handleCreateTeam}>Crea team</Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">{team.nome}</h2>
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
                  <div><p className="text-sm font-medium text-[#111827]">Membro</p><p className="text-xs text-[#6B7280]">{member.ruolo}</p></div>
                  {member.ruolo !== "owner" && <Button variant="ghost" size="sm">Rimuovi</Button>}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Invita nuovi membri</h2>
            <form onSubmit={handleInvite} className="flex gap-3">
              <Input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="email@studio.it" className="flex-1" />
              <Button type="submit">Invia invito</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}