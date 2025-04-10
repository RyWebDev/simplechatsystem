import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="p-2">
      <h3>Welcome!  <span className='underline text-blue-500'><Link href='/login'>Go to Login</Link></span></h3> 
    </div>
  )
}
