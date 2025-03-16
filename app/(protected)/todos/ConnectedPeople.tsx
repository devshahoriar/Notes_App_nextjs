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
import noteService from '@/services/noteService'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const ConnectEdPeople = () => {
  const [open, setOpen] = useState(false)
  const {data,isLoading} = useQuery({
    queryKey:['connectedPeople'],
    queryFn: noteService.connectedPeople
  })
  console.log(data)
  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <button className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">
          1 people
        </button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Connected people</CredenzaTitle>
          <CredenzaDescription>1 people</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="space-y-4">ssss</CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="destructive">Close</Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

export default ConnectEdPeople
