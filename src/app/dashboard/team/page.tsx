import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function TeamPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.piano !== "team") {
    return (
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#111827]">Team</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Gestisci il tuo team di lavoro
          </p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
          <h2 className="text-lg font-semibold text-[#111827] mb-2">
            Piano Team non attivo
          </h2>
          <p className="text-sm text-[#6B7280] mb-4">
            Il tuo piano attuale non include la funzionalità team.
          </p>
          <Link href="/prezzi">
            <Button>Passa a Team — 99€/mese</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { data: team } = await supabase
    .from("teams")
    .select("*")
    .eq("id", profile.team_id)
    .single();

  const { data: members } = await supabase
    .from("team_members")
    .select("*")
    .eq("team_id", profile.team_id);

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">Team</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Gestisci i membri del tuo team
        </p>
      </div>

      {!team ? (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">
            Crea il tuo team
          </h2>
          <form
            action={async () => {
              "use server";
              const supabase = await createClient();
              const {
                data: { user },
              } = await supabase.auth.getUser();

              const { data: team } = await supabase
                .from("teams")
                .insert({
                  nome: "Il mio team",
                  owner_id: user?.id,
                })
                .select()
                .single();

              if (team) {
                await supabase.from("team_members").insert({
                  team_id: team.id,
                  user_id: user?.id,
                  ruolo: "owner",
                });

                await supabase
                  .from("profiles")
                  .update({ team_id: team.id })
                  .eq("id", user?.id);
              }

              redirect("/dashboard/team");
            }}
            className="space-y-4"
          >
            <Input
              name="teamName"
              label="Nome del team"
              placeholder="Es: Studio Rossi"
            />
            <Button type="submit">Crea team</Button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#111827]">
                {team.nome}
              </h2>
            </div>

            <div className="space-y-3">
              {members?.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-[#111827]">
                      Membro
                    </p>
                    <p className="text-xs text-[#6B7280]">{member.ruolo}</p>
                  </div>
                  {member.ruolo !== "owner" && (
                    <form
                      action={async () => {
                        "use server";
                        const supabase = await createClient();
                        await supabase
                          .from("team_members")
                          .delete()
                          .eq("id", member.id);
                      }}
                    >
                      <Button variant="ghost" size="sm">
                        Rimuovi
                      </Button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">
              Invita nuovi membri
            </h2>
            <form
              action={async (formData) => {
                "use server";
                const email = formData.get("email") as string;
                // Invite logic would go here
              }}
              className="flex gap-3"
            >
              <Input
                name="email"
                type="email"
                placeholder="email@studio.it"
                className="flex-1"
              />
              <Button type="submit">Invia invito</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}