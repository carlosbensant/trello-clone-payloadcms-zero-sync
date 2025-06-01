'use client'

import React, { useState } from 'react'
import { useQuery } from '@rocicorp/zero/react'
import { useZero } from '@/hooks/use-zero'
import { useAuth } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  PlusCircle as Plus,
  Calendar,
  DotsGrid as GripVertical,
  LogOut01 as LogOut,
} from '@untitled-ui/icons-react'
import { useParams, useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

import { Stage, Task, User } from '@/payload-types'

interface TaskWithAssignee extends Task {
  assignedUser: User
}

export default function PipelinePage() {
  const params = useParams()
  const pipelineId = params.id as string
  const { user, logout } = useAuth()
  const router = useRouter()
  const z = useZero()

  // Use Zero React hooks for data fetching
  const [pipelines] = useQuery(z.query.pipelines)
  const [stages] = useQuery(z.query.stages)
  const [tasks] = useQuery(z.query.tasks.related('assignedUser'))

  const [newStageTitle, setNewStageTitle] = useState('')
  const [showNewStageForm, setShowNewStageForm] = useState(false)

  // Simple drag and drop state
  const [activeTask, setActiveTask] = useState<TaskWithAssignee | null>(null)
  const [activeStage, setActiveStage] = useState<Stage | null>(null)
  const [overId, setOverId] = useState<string | number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  // Find the current pipeline from the pipelineId prop
  const currentPipeline = pipelines.find((p) => p.id === pipelineId) || null

  const createStage = async () => {
    if (!newStageTitle.trim() || !currentPipeline || !currentPipeline.id) return

    try {
      const now = Date.now()
      const position = stages.filter((l) => l.pipeline === currentPipeline.id).length

      await z.mutate.stages.insert({
        id: uuidv4(),
        title: newStageTitle,
        pipeline: currentPipeline.id,
        position: position || 0,
        createdAt: now,
        updatedAt: now,
      })

      setNewStageTitle('')
      setShowNewStageForm(false)
    } catch (error) {
      console.error('Error creating stage:', error)
    }
  }

  const createTask = async (stageId: string, title: string) => {
    try {
      const now = Date.now()
      const position = tasks.filter((c) => c.stage === stageId).length

      await z.mutate.tasks.insert({
        id: uuidv4(),
        title,
        stage: stageId,
        assignee: user?.id || null,
        position: position || 0,
        createdAt: now,
        updatedAt: now,
      })
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event

    if (active.data.current?.type === 'task') {
      setActiveTask(active.data.current.task)
    } else if (active.data.current?.type === 'stage') {
      setActiveStage(active.data.current.stage)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    setOverId(over?.id || null)

    if (!over || !active.data.current) {
      setOverIndex(null)
      return
    }

    const activeType = active.data.current?.type
    const overType = over.data.current?.type

    // Only handle task dragging for position feedback
    if (activeType === 'task') {
      if (overType === 'task' && over.data.current) {
        // Dragging over another task - find insertion index
        const overTask = over.data.current.task
        const stageTasks = tasks
          .filter((c) => c.stage === overTask.stage && c.id !== active.id)
          .sort((a, b) => (a.position || 0) - (b.position || 0))

        const overTaskIndex = stageTasks.findIndex((c) => c.id === overTask.id)
        setOverIndex(overTaskIndex)
      } else if (overType === 'stage' && over.data.current) {
        // Dragging over a stage - will go to the end
        const stageId = over.data.current.stage.id
        const stageTasks = tasks.filter((c) => c.stage === stageId && c.id !== active.id)
        setOverIndex(stageTasks.length)
      } else {
        setOverIndex(null)
      }
    } else {
      setOverIndex(null)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    setActiveTask(null)
    setActiveStage(null)
    setOverId(null)
    setOverIndex(null)

    if (!over) return

    const activeId = active.id
    const overId = over.id

    // Find containers
    const activeContainer = findContainer(activeId)
    const overContainer = findContainer(overId)

    if (!activeContainer || !overContainer) return

    // Handle different drag scenarios
    if (active.data.current?.type === 'task') {
      handleTaskDragEnd(activeId, overId, activeContainer, overContainer)
    } else if (active.data.current?.type === 'stage') {
      handleStageDragEnd(activeId, overId)
    }
  }

  const findContainer = (id: string | number) => {
    if (tasks.some((task) => task.id === id)) {
      return tasks.find((task) => task.id === id)?.stage
    }
    return id
  }

  const handleTaskDragEnd = async (
    activeId: string | number,
    overId: string | number,
    activeContainer: any,
    overContainer: any,
  ) => {
    const activeTask = tasks.find((task) => task.id === activeId)
    if (!activeTask || !activeTask.id) return

    let newStageId = activeContainer
    let newPosition = activeTask.position || 0

    // If dropped on another task
    if (tasks.some((task) => task.id === overId)) {
      const overTask = tasks.find((task) => task.id === overId)
      if (overTask) {
        newStageId = overTask.stage
        newPosition = overTask.position || 0
      }
    }
    // If dropped on a stage
    else if (stages.some((stage) => stage.id === overId)) {
      newStageId = overId as number
      newPosition = tasks.filter((c) => c.stage === newStageId).length
    }

    // Update task position
    if (newStageId !== activeTask.stage || newPosition !== activeTask.position) {
      try {
        await z.mutate.tasks.update({
          id: activeTask.id,
          stage: newStageId,
          position: newPosition,
          updatedAt: Math.floor(Date.now() / 1000),
        })
      } catch (error) {
        console.log(newStageId)
        console.error('Error updating task:', error)
      }
    }
  }

  const handleStageDragEnd = async (activeId: string | number, overId: string | number) => {
    const activeStage = stages.find((stage) => stage.id === activeId)
    const overStage = stages.find((stage) => stage.id === overId)

    if (!activeStage || !overStage || !activeStage.id || !overStage.id) return

    const pipelineStages = stages
      .filter((l) => l.pipeline === currentPipeline?.id)
      .sort((a, b) => (a.position || 0) - (b.position || 0))

    const oldIndex = pipelineStages.findIndex((l) => l.id === activeStage.id)
    const newIndex = pipelineStages.findIndex((l) => l.id === overStage.id)

    if (oldIndex !== newIndex) {
      const reorderedStages = arrayMove(pipelineStages, oldIndex, newIndex)

      // Update positions
      for (let i = 0; i < reorderedStages.length; i++) {
        const stage = reorderedStages[i]
        if (stage.id && (stage.position || 0) !== i) {
          try {
            await z.mutate.stages.update({
              id: stage.id,
              position: i,
              updatedAt: Math.floor(Date.now() / 1000),
            })
          } catch (error) {
            console.error('Error updating stage position:', error)
          }
        }
      }
    }
  }

  const pipelineStages = stages
    .filter((stage) => stage.pipeline === currentPipeline?.id)
    .sort((a, b) => (a.position || 0) - (b.position || 0))

  // Show loading state while pipeline is being fetched
  if (!currentPipeline) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading pipeline...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: currentPipeline.backgroundColor || '#0079bf' }}
    >
      {/* Pipeline Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-full px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push(`/`)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                ← Back to Boards
              </Button>
              <h1 className="text-2xl font-bold text-white">{currentPipeline.title as string}</h1>
              <Badge variant="outline" className="text-white border-white/30">
                {pipelineStages.length} stage{pipelineStages.length !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="outline" className="text-white border-white/30">
                <GripVertical className="w-3 h-3 mr-1" />
                Drag & Drop Enabled
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-white/70 hover:text-white"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Pipeline Content with Drag and Drop */}
      <div className="p-4 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex space-x-4 min-w-max">
            <SortableContext
              items={pipelineStages.map((s) => s.id).filter((id): id is number => id !== null)}
              strategy={horizontalListSortingStrategy}
            >
              {pipelineStages.map((stage) => (
                <SortableStageComponent
                  key={stage.id}
                  stage={stage as Stage}
                  tasks={
                    tasks
                      .filter((c) => c.stage === stage.id && c.id !== null)
                      .sort((a, b) => (a.position || 0) - (b.position || 0)) as TaskWithAssignee[]
                  }
                  onTaskCreate={createTask}
                  isOver={overId === stage.id}
                  isDraggingTask={!!activeTask}
                  draggedTaskId={activeTask?.id || null}
                  overIndex={overId === stage.id ? overIndex : null}
                />
              ))}
            </SortableContext>

            {/* Add Stage Button */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 w-72 flex-shrink-0">
              {showNewStageForm ? (
                <div className="space-y-2">
                  <Input
                    value={newStageTitle}
                    onChange={(e) => setNewStageTitle(e.target.value)}
                    placeholder="Stage title"
                    className="bg-white"
                    onKeyPress={(e) => e.key === 'Enter' && createStage()}
                  />
                  <div className="flex space-x-2">
                    <Button onClick={createStage} size="sm">
                      Add Stage
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowNewStageForm(false)
                        setNewStageTitle('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => setShowNewStageForm(true)}
                  className="w-full text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add a stage
                </Button>
              )}
            </div>
          </div>

          {/* Simple Drag Overlays */}
          <DragOverlay>
            {activeTask && (
              <div className="bg-white rounded-lg p-3 shadow-lg border opacity-90">
                <h4 className="text-sm font-medium text-gray-900 mb-1">{activeTask.title}</h4>
                {activeTask.description && (
                  <p className="text-xs text-gray-600 mb-2">{activeTask.description}</p>
                )}
                <div className="text-xs text-gray-400">#{activeTask.id}</div>
              </div>
            )}
            {activeStage && (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 w-72 opacity-90">
                <h3 className="font-semibold text-white mb-4">{activeStage.title}</h3>
                <div className="text-sm text-white/70">Moving...</div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}

// Drop Indicator Component
const DropIndicator: React.FC = () => (
  <div className="h-0.5 bg-blue-500 rounded-full mx-2 my-1 shadow-sm animate-pulse" />
)

// Simple Sortable Stage Component
interface SortableStageComponentProps {
  stage: Stage
  tasks: TaskWithAssignee[]
  onTaskCreate: (stageId: string, title: string) => void
  isOver: boolean
  isDraggingTask: boolean
  draggedTaskId: string | null
  overIndex: number | null
}

const SortableStageComponent: React.FC<SortableStageComponentProps> = ({
  stage,
  tasks,
  onTaskCreate,
  isOver,
  isDraggingTask,
  draggedTaskId,
  overIndex,
}) => {
  if (!stage.id) return null

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: stage.id,
    data: {
      type: 'stage',
      stage,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white/20 backdrop-blur-sm rounded-lg p-4 w-72 flex-shrink-0 transition-all duration-200 ${
        isDragging ? 'opacity-60 scale-105 rotate-2' : ''
      } ${isOver && isDraggingTask ? 'ring-2 ring-blue-400 ring-opacity-60 bg-blue-50/10' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">{stage.title}</h3>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/50 hover:text-white cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-1 mb-4 min-h-[2rem]">
        <SortableContext
          items={tasks.map((t) => t.id).filter((id) => id !== null)}
          strategy={verticalListSortingStrategy}
        >
          {/* Drop indicator at the beginning */}
          {isOver && isDraggingTask && overIndex === 0 && <DropIndicator />}

          {tasks.map((task, index) => (
            <React.Fragment key={task.id}>
              <SortableTaskComponent task={task} isDraggedTask={task.id === draggedTaskId} />
              {/* Drop indicator after each task */}
              {isOver && isDraggingTask && overIndex === index + 1 && <DropIndicator />}
            </React.Fragment>
          ))}

          {/* Show drop placeholder when dragging task over empty stage */}
          {tasks.length === 0 && isOver && isDraggingTask && (
            <div className="bg-blue-100/20 border-2 border-dashed border-blue-400/50 rounded-lg p-6 text-center">
              <div className="text-blue-200 text-sm font-medium">Drop task here</div>
            </div>
          )}
        </SortableContext>
      </div>

      <AddTaskForm stageId={stage.id} onTaskCreate={onTaskCreate} />
    </div>
  )
}

// Simple Sortable Task Component
interface SortableTaskComponentProps {
  task: TaskWithAssignee
  isDraggedTask?: boolean
}

const SortableTaskComponent: React.FC<SortableTaskComponentProps> = ({
  task,
  isDraggedTask = false,
}) => {
  if (!task.id) return null

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
  }

  // Hide the task visually if it's being dragged from another stage
  if (isDraggedTask && !isDragging) {
    return <div ref={setNodeRef} style={style} className="h-0 overflow-hidden" />
  }

  // Return invisible placeholder when this task is being dragged
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-transparent border-2 border-dashed border-gray-300 rounded-lg h-20 flex items-center justify-center"
      >
        <div className="text-gray-400 text-xs">Moving...</div>
      </div>
    )
  }

  console.log(task)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg p-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md hover:bg-gray-50 transition-colors group"
    >
      <h4 className="text-sm font-medium text-gray-900 mb-1">{task.title}</h4>
      {task.description && <p className="text-xs text-gray-600 mb-2">{task.description}</p>}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {task.dueDate && (
            <Badge variant="outline" className="text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(task.dueDate * 1000).toLocaleDateString()}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <GripVertical className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="text-xs text-gray-400">#{task.id}</div>
        </div>
      </div>
      {task.assignedUser && typeof task.assignedUser !== 'string' && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm">
                  {task.assignedUser?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{task.assignedUser?.email}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}

// Add Task Form Component
interface AddTaskFormProps {
  stageId: string
  onTaskCreate: (stageId: string, title: string) => void
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ stageId, onTaskCreate }) => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const handleCreateTask = () => {
    if (newTaskTitle.trim()) {
      onTaskCreate(stageId, newTaskTitle)
      setNewTaskTitle('')
      setShowAddTask(false)
    }
  }

  if (showAddTask) {
    return (
      <div className="space-y-2">
        <Textarea
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter a title for this task..."
          className="bg-white text-black resize-none"
          rows={3}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleCreateTask()}
        />
        <div className="flex space-x-2">
          <Button onClick={handleCreateTask} size="sm">
            Add Task
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowAddTask(false)
              setNewTaskTitle('')
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      onClick={() => setShowAddTask(true)}
      className="w-full text-white/70 hover:text-white hover:bg-white/10"
    >
      <Plus className="w-4 h-4 mr-2" />
      Add a task
    </Button>
  )
}
