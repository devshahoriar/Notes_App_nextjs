'use client'

import useSocketIo from '@/hooks/UseSocketIo'
import { cn } from '@/lib/utils'
import noteService, { NoteResponse } from '@/services/noteService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import ConnectEdPeople from './ConnectedPeople'
import CreateNote from './CreateNote'
import EditNote from './EditNote'
import NoteCard, { NoteCardSkeleton } from './NoteCard'
import TopBar from './TopBar'

type EditSocketEventType = {
  nodeId: string
  start?: boolean
  end?: boolean
  user: string
}

const NotePage = () => {
  const { connected, socket } = useSocketIo()

  const queryClient = useQueryClient()
  const {
    data: notes,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['notes'],
    queryFn: noteService.getAllNotes,
    select(data) {
      return data.notes
    },
  })

  const { mutate: deleteTodo } = useMutation({
    mutationFn: noteService.deleteNote,
    onMutate(id) {
      const p = queryClient.getQueryData(['notes']) as NoteResponse
      const notes = p.notes
      queryClient.setQueryData(['notes'], {
        notes: notes?.filter((n) => n._id !== id),
      })
      return notes
    },
    onError(error, variables, context) {
      queryClient.setQueryData(['notes'], { notes: context })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const [editNoteId, setEditNoteId] = useState<string | null>(null)

  useEffect(() => {
    socket?.on('updateNote', () => {
      refetch()
    })

    socket?.on('noteEdit', (data: EditSocketEventType) => {
      const { user, nodeId } = data
      console.log(data)
      if (data?.start) {
        const newNotes = notes?.map((n) => {
          if (n._id === nodeId) {
            return { ...n, editorName: user }
          }
          return n
        })
        queryClient.setQueryData(['notes'], { notes: newNotes })
      }
      if (data?.end) {
        const newNotes = notes?.map((n) => {
          if (n._id === nodeId) {
            return { ...n, editorName: undefined }
          }
          return n
        })
        queryClient.setQueryData(['notes'], { notes: newNotes })
      }
    })
    return () => {
      socket?.off('noteEdit')
      socket?.off('updateNote')
    }
  })

  return (
    <>
      <TopBar />
      <EditNote nodeId={editNoteId} setTodoId={setEditNoteId} />
      <div className="container mx-auto p-4">
        <h1
          title={connected ? 'Connected' : 'Disconnected'}
          className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100"
        >
          Notes{' '}
          <span className={cn(connected ? 'text-green-600' : 'text-red-600')}>
            .
          </span>
        </h1>
        <div className="flex items-center mt-4 justify-center gap-2 mb-8 text-gray-700 dark:text-gray-300">
          <span>{notes?.length} Notes </span>·<ConnectEdPeople />·
          <CreateNote />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading ? (
            new Array(5)
              .fill(null)
              .map((_, index) => <NoteCardSkeleton key={index} />)
          ) : notes?.length === 0 ? (
            <div className="flex items-center justify-center h-[50vh] col-span-full">
              <p className="text-gray-500 dark:text-gray-400">
                No notes found. Create a new note.
              </p>
            </div>
          ) : (
            notes?.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={setEditNoteId}
                onDelete={deleteTodo}
                editorName={note?.editorName}
              />
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default NotePage
