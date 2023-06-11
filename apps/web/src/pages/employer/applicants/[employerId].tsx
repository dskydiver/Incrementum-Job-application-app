import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { List, ListItemButton, ListItemText, Stack, Typography } from 'ui'
import type { NextPage, GetServerSidePropsResult } from 'next'
import type { Data } from '@/pages/api/v1/job_appliers'
import { Layout } from '@components/Layout'
import Link from 'next/link'

type Props = {
  initialData: Data[]
}

const ApplicantsPage: NextPage<Props> = ({ initialData }) => {
  const router = useRouter()
  const { employerId } = router.query
  const [selectedJobIndex, setSelectedJobIndex] = useState(0)
  const [data, setData] = useState<Data[]>(initialData)

  return (
    <Layout>
      <Stack
        flex={1}
        direction='row'
        spacing={1}
        justifyContent='stretch'
        position='relative'
        overflow='hidden'
      >
        <Stack>
          <Typography variant='h1'>My Jobs</Typography>
          <List component='nav'>
            {data.map((job, index) => (
              <ListItemButton
                key={job.jobId}
                selected={selectedJobIndex === index}
                onClick={() => setSelectedJobIndex(index)}
              >
                <ListItemText primary={job.title} />
              </ListItemButton>
            ))}
          </List>
        </Stack>

        <Stack>
          <Typography variant='h1'>Appliers</Typography>
          <List component='nav'>
            {data[selectedJobIndex].appliers.map((applier) => (
              <ListItemButton
                key={applier.userId}
                component={Link}
                href={`/profile/applier/${applier.userId}?employerId=${
                  employerId as string
                }`}
              >
                <ListItemText
                  primary={`${applier.name} (${applier.role}, ${applier.yearsOfExperience} years of experience)`}
                />
              </ListItemButton>
            ))}
          </List>
        </Stack>
      </Stack>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
): Promise<GetServerSidePropsResult<Props>> => {
  const { employerId } = context.query
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_ENV}/api/v1/job_appliers?employer_id=${employerId}`
  )
  const result: Data[] | { message: string } = await res.json()

  const initialData: Data[] = 'message' in result ? [] : result

  return { props: { initialData } }
}

export default ApplicantsPage
