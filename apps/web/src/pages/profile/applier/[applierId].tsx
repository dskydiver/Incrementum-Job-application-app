import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from 'ui'
import type { NextPage, GetServerSidePropsResult } from 'next'
import type { Data } from '@/pages/api/v1/job_applier'
import { Layout } from '@components/Layout'
import Link from 'next/link'

type Props = {
  initialData: Data
}

const ApplicantsPage: NextPage<Props> = ({ initialData }) => {
  const router = useRouter()
  const { employerId } = router.query
  const { userId, name, email, role, yearsOfExperience, education, skills } =
    initialData

  return (
    <Layout>
      <Typography variant='h1'>Applier Profile</Typography>
      <List component='nav'>
        <ListItem>
          <ListItemText primary='ID' secondary={userId} />
        </ListItem>
        <ListItem>
          <ListItemText primary='Name' secondary={name} />
        </ListItem>
        <ListItem>
          <ListItemText primary='Email' secondary={email} />
        </ListItem>
        <ListItem>
          <ListItemText primary='Primary Role' secondary={role} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary='Years of Experience'
            secondary={yearsOfExperience}
          />
        </ListItem>
        <ListItem>
          <ListItemText primary='Education' secondary={education} />
        </ListItem>
        <ListItem>
          <ListItemText primary='Skills' secondary={skills.join(', ')} />
        </ListItem>
      </List>
      <Button
        component={Link}
        href={`/conversation?myId=${employerId as string}&opponentId=${userId}`}
      >
        Message to this applier
      </Button>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
): Promise<GetServerSidePropsResult<Props>> => {
  const { applierId } = context.query
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_ENV}/api/v1/job_applier?job_applier_id=${applierId}`
  )
  const result: Data | { message: string } = await res.json()

  const initialData: Data = 'message' in result ? undefined : result

  return { props: { initialData } }
}

export default ApplicantsPage
