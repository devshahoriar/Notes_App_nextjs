import { ChangeEvent, Dispatch, SetStateAction } from 'react'

const useHandelChange = <T>(
  setState: Dispatch<SetStateAction<T>>,
  after?: () => void
) => {
  return (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setState(
      (prevState) =>
        ({
          ...prevState,
          [name]: value,
        } as T)
    )
    if (after) {
      after()
    }
  }
}
export default useHandelChange
