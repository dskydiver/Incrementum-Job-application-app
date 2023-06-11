import React from 'react'
import { Container, Box } from 'ui'

type Layoutprops = {
  children: React.ReactNode
}

export const Layout: React.FC<Layoutprops> = ({ children }) => {
  return (
    <Container>
      <Box my={4}>{children}</Box>
    </Container>
  )
}
