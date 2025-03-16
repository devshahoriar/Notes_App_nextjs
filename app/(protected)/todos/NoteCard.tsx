import { AuthResponse } from '@/services/authService'
import { Note } from '@/services/noteService'
import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { PencilIcon, TrashIcon } from 'lucide-react'

interface NoteCardProps {
  note: Note
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  isEditing?: boolean
  editorName?: string
}

const NoteCard = ({
  note,
  onEdit,
  onDelete,
  isEditing,
  editorName,
}: NoteCardProps) => {
  const queryClient = useQueryClient()
  const { _id } = queryClient.getQueryData(['user']) as AuthResponse
  const formattedDate = format(new Date(note.updatedAt), 'hh:mm - dd/MM/yyyy')

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 border border-gray-100 dark:border-gray-700 relative group">
      {isEditing && editorName && (
        <div className="absolute -top-0 left-0 flex justify-center">
          <span className="px-3 py-[2px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-[10px] font-medium flex items-center shadow-sm">
            <span className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse mr-1.5"></span>
            <span>{editorName} is editing...</span>
          </span>
        </div>
      )}

      <div className="absolute top-3 right-3 flex space-x-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit?.(note._id)}
          className="p-1.5 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-600 dark:text-blue-400"
          aria-label="Edit note"
        >
          <PencilIcon className="w-3.5 h-3.5" />
        </button>
        {_id === note.authorId._id && (
          <button
            onClick={() => onDelete?.(note._id)}
            className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400"
            aria-label="Delete note"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 truncate pr-16">
        {note.title}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-1">
        {note.content}
      </p>
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>{note.authorId.name}</span>
        <span>{formattedDate}</span>
      </div>
    </div>
  )
}

export default NoteCard

export const NoteCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 w-3/4 mb-4"></div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 w-1/2 mb-2"></div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 w-3/4 mb-2"></div>
    </div>
  )
}
