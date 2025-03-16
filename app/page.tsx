import Link from "next/link";

export default function Home() {
  return <div className="h-[95vh] w-full flex justify-center items-center">
    <Link className="text-4xl" href='/login'>Login</Link>
  </div>
}
