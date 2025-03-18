import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useSocketIo from '@/hooks/UseSocketIo'
import authService from '@/services/authService'
import { useMutation, useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const UserAvaterCrontrol = () => {
  const { data } = useQuery({
    queryKey: ['user'],
    queryFn: authService.refreshToken,
    retry: false,
  })
  const router = useRouter()
  const { socket } = useSocketIo()

  const { mutate, isPending } = useMutation({
    mutationFn: authService.logout,
    onSuccess() {
      router.replace('/login')
      socket?.close()
    },
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarFallback>
            {data?.name
              ?.split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="px-2">
          <h1 className="font-semibold">{data?.name}</h1>
          <p className=" text-sm">{data?.email}</p>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button
            disabled={isPending}
            onClick={() => mutate()}
            variant="destructive"
            size="sm"
            className="w-full"
          >
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const TopBar = () => {
  return (
    <header className="bg-background p-4">
      <div className="container flex items-center justify-between">
        <Link className="hover:underline font-semibold" href="/">
          Real-Time Collaborative Notes App
        </Link>
        <UserAvaterCrontrol />
      </div>
    </header>
  )
}

export default TopBar
