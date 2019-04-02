import * as React from 'react'

interface Props {
  is?: 'div' | 'span' | 'header' | 'main' | 'footer' | 'section' | 'aside'
  className?: string
  children?: React.ReactNode
}

export const Box = ({ is = 'div', children, ...restProps }: Props) => {
  return React.createElement(is, restProps, children)
}
