import { prisma } from '@arbeitsraum/db'

export default async function Home() {
  const userCount = await prisma.user.count()

  return (
    <main className="flex h-screen items-center justify-center">
      <div>Hello, from arbeitsraum 👋</div>
      <p>Number of users: {userCount}</p>
    </main>
  )
}
