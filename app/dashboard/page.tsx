import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import UploadButton from '@/components/dashboard/UploadButton'
import { Card } from '@/components/ui/card'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import FileCard from '@/components/dashboard/FileCard'
import { FileText, CheckCircle2, MessageCircle } from 'lucide-react'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const dbUser = await db.user.findUnique({
    where: { id: userId },
  })

  if (!dbUser) {
    await db.user.create({
      data: { id: userId, email: '' },
    })
  }

  const files = await db.file.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { messages: true } }
    }
  })

  return (
    <MaxWidthWrapper className="py-8">
      
      {/* Clean Header */}
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Documents</h1>
          <p className="text-gray-600">Manage and chat with your PDFs</p>
        </div>
        <UploadButton />
      </div>

      {/* Minimal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        <Card className="p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <FileText className="h-6 w-6 text-gray-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Files</p>
              <p className="text-3xl font-bold text-gray-900">{files.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ready</p>
              <p className="text-3xl font-bold text-gray-900">
                {files.filter(f => f.uploadStatus === 'SUCCESS').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Messages</p>
              <p className="text-3xl font-bold text-gray-900">
                {files.reduce((acc, file) => acc + file._count.messages, 0)}
              </p>
            </div>
          </div>
        </Card>

      </div>

      {/* Files */}
      {files.length === 0 ? (
        <Card className="p-16 text-center border-2 border-dashed border-gray-300">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No documents yet
          </h3>
          <p className="text-gray-600 mb-6">
            Upload your first PDF to get started
          </p>
          <UploadButton />
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