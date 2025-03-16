/* eslint-disable @typescript-eslint/no-explicit-any */
import transporter from '../lib/transporter'

export interface Note {
  _id: string
  title: string
  content: string
  authorId: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface NoteData {
  title: string
  content: string
}

export interface UpdateNoteData extends NoteData {
  noteId: string
}

export interface NoteResponse {
  message?: string
  success: boolean
  note?: Note
  notes?: Note[]
}

const noteService = {
  getAllNotes: async (): Promise<NoteResponse> => {
    return transporter.get<NoteResponse, NoteResponse>('/note/', {
      withCredentials: true,
    })
  },

  getNote: async (noteId: string): Promise<NoteResponse> => {
    return transporter.get<NoteResponse, NoteResponse>(`/note/${noteId}`, {
      withCredentials: true,
    })
  },

  createNote: async (data: NoteData): Promise<NoteResponse> => {
    return transporter.post<NoteResponse, NoteResponse>('/note/', data, {
      withCredentials: true,
    })
  },

  updateNote: async (data: UpdateNoteData): Promise<NoteResponse> => {
    return transporter.put<NoteResponse, NoteResponse>('/note/', data, {
      withCredentials: true,
    })
  },

  deleteNote: async (noteId: string): Promise<NoteResponse> => {
    return transporter.delete<NoteResponse, NoteResponse>(`/note/${noteId}`, {
      withCredentials: true,
    })
  },

  connectedPeople : async (): Promise<any> => {
    return transporter.get<NoteResponse, NoteResponse>(`/note/activeUsers`, {
      withCredentials: true,
    })
  }
}

export default noteService
