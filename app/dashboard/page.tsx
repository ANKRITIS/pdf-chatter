import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import UploadButton from '@/components/dashboard/UploadButton'
import { Card } from '@/components/ui/card'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import FileCard from '@/components/dashboard/FileCard'
import { FileText } from 'lucide-react'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  // Get or create user
  const dbUser = await db.user.findUnique({
    where: { id: userId },
  })

  if (!dbUser) {
    await db.user.create({
      data: {
        id: userId,
        email: '',
      },
    })
  }

  // Get user's files with message count
  const files = await db.file.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { messages: true }
      }
    }
  })

  return (
    <MaxWidthWrapper className="py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Documents</h1>
          <p className="text-zinc-600 mt-2">
            Upload and chat with your PDF documents
          </p>
        </div>
        <UploadButton />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-zinc-600">Total Documents</p>
              <p className="text-2xl font-bold">{files.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-zinc-600">Successfully Processed</p>
              <p className="text-2xl font-bold">
                {files.filter(f => f.uploadStatus === 'SUCCESS').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-zinc-600">Total Conversations</p>
              <p className="text-2xl font-bold">
                {files.reduce((acc, file) => acc + file._count.messages, 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Files Grid */}
      {files.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">
              No documents yet
            </h3>
            <p className="text-zinc-600 mb-6">
              Upload your first PDF to get started with AI-powered document chat
            </p>
            <UploadButton />
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              messageCount={file._count.messages}
            />
          ))}
        </div>
      )}
    </MaxWidthWrapper>
  )
}