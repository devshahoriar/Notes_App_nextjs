/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button'
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from '@/components/ui/credenza'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import useHandelChange from '@/hooks/useHandelChange'
import useSocketIo from '@/hooks/UseSocketIo'
import { validateError } from '@/lib/utils'
import noteService from '@/services/noteService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { z } from 'zod'

const newNote = z.object({
  title: z
    .string({ message: 'Title is required' })
    .min(1, { message: 'Title not empty' }),
  content: z
    .string({ message: 'Content is required' })
    .min(1, { message: 'Content not empty' }),
})

const dfData = {
  title: '',
  content: '',
}
const EditNote = ({
  nodeId,
  setTodoId,
}: {
  nodeId: string | null
  setTodoId: any
}) => {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState(dfData)
  const [error, setError] = useState('')
  const hendelChange = useHandelChange(setInput)
  const queryClient = useQueryClient()
  const { socket } = useSocketIo()
  const [activNoteId, setActivNoteId] = useState<string | null>(null)

  useEffect(() => {
    if (nodeId) {
      setOpen(true)
      setActivNoteId(nodeId)
      setTimeout(() => {
        socket.emit('startEditNote', nodeId)
      })
    } else {
      if (activNoteId) {
        socket.emit('endEditNote', activNoteId)
      }
    }
  }, [nodeId])

  const { mutate, isPending } = useMutation({
    mutationFn: noteService.updateNote,
    onSuccess: () => {
      setOpen(false)
      setInput(dfData)
      setTodoId(null)
    },
    onError: (error) => {
      setError(error.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const { data, isLoading } = useQuery({
    queryKey: ['note', nodeId],
    queryFn: () => noteService.getNote(nodeId as string),
    enabled: Boolean(nodeId),
    retry: false,
  })

  useEffect(() => {
    if (data) {
      setInput({
        title: data?.note?.title as string,
        content: data?.note?.content as string,
      })
    }
  }, [data])

  const handelEdit = () => {
    const data = newNote.safeParse(input)
    if (!data.success) {
      return setError(validateError(data))
    }
    mutate({
      content: data.data.content,
      title: data.data.title,
      noteId: nodeId as string,
    })
  }

  return (
    <Credenza
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        setTodoId(null)
      }}
    >
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Edit Note</CredenzaTitle>
          <CredenzaDescription>Edit your Note</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              disabled={isLoading}
              type="text"
              name="title"
              placeholder="Enter title"
              onChange={hendelChange}
              value={input.title}
            />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              disabled={isLoading}
              name="content"
              placeholder="Enter title"
              value={input.content}
              onChange={hendelChange}
            />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="destructive">Close</Button>
          </CredenzaClose>
          <Button onClick={handelEdit} disabled={isPending} variant="outline">
            Update
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

export default EditNote
