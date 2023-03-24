import { FC, ReactNode } from 'react'

type MDXComponentProps = {
  children: ReactNode
}

export const MDXComponent: FC<MDXComponentProps> = ({ children }) => {
  return (
    <div className="prose dark:prose-invert max-w-screen-md mx-auto p-8">
      {children}
    </div>
  )
}
