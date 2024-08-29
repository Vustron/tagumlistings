// components
import ClientHeader from "@/app/(client)/_components/header"

export default function ClientPage() {
  return (
    <div className="font-sans">
      <ClientHeader />
      <main className="mx-auto my-12 max-w-5xl rounded-md border border-zinc-800">
        <table className="w-full">
          <tbody>
            {[...Array(20)].map((_, i) => (
              <tr key={i} className="h-12 border-b border-zinc-800 bg-zinc-950">
                <td />
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  )
}
