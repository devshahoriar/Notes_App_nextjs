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
  CredenzaTrigger,
} from '@/components/ui/credenza'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import useHandelChange from '@/hooks/useHandelChange'
import { validateError } from '@/lib/utils'
import noteService from '@/services/noteService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
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
const CreateNote = () => {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState(dfData)
  const [error, setError] = useState('')
  const hendelChange = useHandelChange(setInput)
  const queryClient = useQueryClient()
  
  const { mutate, isPending } = useMutation({
    mutationFn: noteService.createNote,
    onSuccess: (data) => {
      queryClient.setQueryData(['notes'], (old: any) => ({
        notes: [...old.notes, data.note],
      }))
      setInput(dfData)
      setOpen(false)
    },
    onError: (error) => {
      setError(error.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const handelCreate = () => {
    const data = newNote.safeParse(input)
    if (!data.success) {
      return setError(validateError(data))
    }
    mutate({
      title: data.data.title,
      content: data.data.content,
    })
  }
  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <button className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">
          Create Note
        </button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle> Create Note</CredenzaTitle>
          <CredenzaDescription>Create your Note</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
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
          <Button onClick={handelCreate} disabled={isPending} variant="outline">
            Create
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

export default CreateNote
