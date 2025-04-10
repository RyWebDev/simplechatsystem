import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/try')({
  component: RouteComponent,
})

function RouteComponent() {
  const func = <T extends number | number[], U extends number | number[]>(
    value: T,
    value2: U
  ): T | U => {
    return (
      Array.isArray(value)
        ? [...value, ...(Array.isArray(value2) ? value2 : [value2])]
        : [value, ...(Array.isArray(value2) ? value2 : [value2])]
    ) as T | U
  }

  console.log(func(3, [2, 7]))

  return (
    <>
      <div className='underline'>Hello</div>
    </>
  )
}
