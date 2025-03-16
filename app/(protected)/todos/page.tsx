'use client'

import useSocketIo from '@/hooks/UseSocketIo'
import { cn } from '@/lib/utils'
import noteService from '@/services/noteService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import ConnectEdPeople from './ConnectedPeople'
import CreateNote from './CreateNote'
import EditNote from './EditNote'
import NoteCard, { NoteCardSkeleton } from './NoteCard'
import TopBar from './TopBar'

const NotePage = () => {
  const { connected, socket } = useSocketIo()

  const queryClient = useQueryClient()
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['notes'],
    queryFn: noteService.getAllNotes,
  })
  const { mutate: deleteTodo } = useMutation({
    mutationFn: noteService.deleteNote,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
  const notes = data?.notes || []
  const [editNoteId, setEditNoteId] = useState<string | null>(null)
  const handleEditNote = (id: string) => {
    setEditNoteId(id)
  }
  const handleDeleteNote = (id: string) => {
    deleteTodo(id)
  }

  socket.on('updateNote', () => {
    refetch()
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
          <span>{notes.length} Notes </span>·<ConnectEdPeople />·
          <CreateNote />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading ? (
            new Array(5)
              .fill(null)
              .map((_, index) => <NoteCardSkeleton key={index} />)
          ) : notes.length === 0 ? (
            <div className="flex items-center justify-center h-[50vh]">
              <p className="text-gray-500 dark:text-gray-400">
                No notes found. Create a new note.
              </p>
            </div>
          ) : (
            notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default NotePage
