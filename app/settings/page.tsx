import { wajibSesi, ambilDaftarSesi } from "@/lib/scheme/session";
import { ambilAkun } from "@/lib/data/account";
import SettingsPage from "@/components/settings/SettingsPage";

export default async function Page() {
  const sesi = await wajibSesi();
  const akun = await ambilAkun(sesi.userId);
  const daftarSesi = await ambilDaftarSesi(sesi.userId);

  return <SettingsPage akun={akun} sesiAktif={sesi} daftarSesi={daftarSesi} />;
}
