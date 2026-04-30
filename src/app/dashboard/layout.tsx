import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const handleSignOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Sidebar
        user={{
          email: user.email || "",
          nome: profile?.nome || "",
          piano: profile?.piano || "free",
        }}
        onSignOut={handleSignOut}
      />
      <main className="lg:ml-60 p-6 lg:p-8">{children}</main>
    </div>
  );
}