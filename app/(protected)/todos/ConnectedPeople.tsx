/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import useSocketIo from '@/hooks/UseSocketIo'
import { AuthResponse } from '@/services/authService'
import noteService from '@/services/noteService'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

const ConnectEdPeople = () => {
  const [open, setOpen] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['connectedPeople'],
    queryFn: noteService.connectedPeople,
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  const { socket } = useSocketIo()
  const queryClient = useQueryClient()
  const { _id } = queryClient.getQueryData(['user']) as AuthResponse
  const people = data?.users?.filter((user: any) => user.userId !== _id)

  socket.on('updateUser', () => {
    refetch()
  })

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <button className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">
          {isLoading ? 'Loading..' : `Connected ${people?.length} people`}
        </button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Connected people</CredenzaTitle>
          <CredenzaDescription>{people?.length} people</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="space-y-4">
          {people?.map((person: any) => (
            <div key={person?.userId} className="flex items-center space-x-2">
              <Avatar>
                <AvatarFallback>
                  {person?.name
                    ?.split(' ')
                    .map((n: any) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {person.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {person.email}
                </p>
              </div>
            </div>
          ))}
        </CredenzaBody>
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
