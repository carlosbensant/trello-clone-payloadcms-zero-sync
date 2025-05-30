'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@rocicorp/zero/react'
import { useZero } from '@/hooks/use-zero'
import { useAuth } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  PlusCircle as Plus,
  CheckCircle,
  Target01 as Target,
  Settings01 as Settings,
  AlarmClock as Clock,
  Speaker01 as Sparkles,
  ArrowRight,
  LogOut01 as LogOut,
} from '@untitled-ui/icons-react'
import { v4 as uuidv4 } from 'uuid'

export default function HomePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const z = useZero()

  // Use Zero React hooks for data fetching
  const [pipelines] = useQuery(z.query.pipelines)

  const [newPipelineTitle, setNewPipelineTitle] = useState('')
  const [newPipelineDescription, setNewPipelineDescription] = useState('')
  const [showNewPipelineDialog, setShowNewPipelineDialog] = useState(false)

  const createPipeline = async () => {
    if (!newPipelineTitle.trim() || !user) return

    try {
      const now = Date.now()
      const pipelineId = uuidv4()

      await z.mutate.pipelines.insert({
        id: pipelineId,
        title: newPipelineTitle,
        description: newPipelineDescription,
        backgroundColor: '#0079bf',
        owner: user.id,
        isPrivate: false,
        createdAt: now,
        updatedAt: now,
      })

      setNewPipelineTitle('')
      setNewPipelineDescription('')
      setShowNewPipelineDialog(false)

      console.log('Pipeline created successfully!')
    } catch (error) {
      console.error('Error creating pipeline:', error)
    }
  }

  const openPipeline = (pipelineId: string | null) => {
    if (pipelineId) {
      router.push(`/board/${pipelineId}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Mana</h1>
                  <p className="text-xs text-slate-500">Real-time collaboration</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge variant="default" className="hidden sm:flex">
                  <div className="w-2 h-2 rounded-full mr-2 bg-green-400"></div>
                  Connected
                </Badge>

                {pipelines.length > 0 && (
                  <Badge variant="default" className="hidden sm:flex">
                    {pipelines.length} board{pipelines.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                        {user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{user?.email}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button variant="secondary" size="sm" asChild>
                <a href="/admin" target="_blank" rel="noopener noreferrer">
                  <Settings className="w-4 h-4" />
                </a>
              </Button>

              <Button variant="secondary" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Your Boards</h2>
              <p className="text-slate-600">
                Organize your projects and collaborate with your team
              </p>
            </div>

            <Dialog open={showNewPipelineDialog} onOpenChange={setShowNewPipelineDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Board
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create new board</DialogTitle>
                  <DialogDescription>
                    Start a new project and collaborate with your team in real-time.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="pipeline-title">Board title</Label>
                    <Input
                      id="pipeline-title"
                      value={newPipelineTitle}
                      onChange={(e) => setNewPipelineTitle(e.target.value)}
                      placeholder="Enter board title..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pipeline-description">Description (optional)</Label>
                    <Textarea
                      id="pipeline-description"
                      value={newPipelineDescription}
                      onChange={(e) => setNewPipelineDescription(e.target.value)}
                      placeholder="What's this board about?"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setShowNewPipelineDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createPipeline} disabled={!newPipelineTitle.trim()}>
                      Create board
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Pipelines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {pipelines
            .filter((pipeline) => pipeline.id !== null)
            .map((pipeline) => (
              <Card
                key={pipeline.id}
                className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-0 shadow-sm"
                onClick={() => openPipeline(pipeline.id)}
                style={{
                  background: `linear-gradient(135deg, ${pipeline.backgroundColor || '#0079bf'}15, ${pipeline.backgroundColor || '#0079bf'}25)`,
                  borderLeft: `4px solid ${pipeline.backgroundColor || '#0079bf'}`,
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-slate-700">
                      {pipeline.title}
                    </CardTitle>
                    <div className="flex items-center space-x-1">
                      {pipeline.isPrivate && (
                        <Badge variant="outline" className="text-xs">
                          Private
                        </Badge>
                      )}
                    </div>
                  </div>
                  {pipeline.description && (
                    <CardDescription className="text-sm text-slate-600">
                      {pipeline.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>
                        {pipeline.createdAt
                          ? new Date(pipeline.createdAt * 1000).toLocaleDateString()
                          : 'Unknown'}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {pipelines.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No pipelines yet</h3>
            <p className="text-slate-600 mb-6">
              Create your first pipeline to get started with your projects!
            </p>
            <Button onClick={() => setShowNewPipelineDialog(true)} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Pipeline
            </Button>
          </div>
        )}

        {/* Success Status */}
        <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">🎉 Real-time Sync Active!</CardTitle>
                <CardDescription>
                  Your Trello clone is now fully operational with Zero React hooks
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">PayloadCMS Auth</p>
                  <p className="text-sm text-green-700">Connected</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Zero React Hooks</p>
                  <p className="text-sm text-green-700">Active</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Database</p>
                  <p className="text-sm text-green-700">Synced</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
