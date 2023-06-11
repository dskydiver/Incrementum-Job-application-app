import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Avatar,
  TextField,
  Button,
  ListItemAvatar,
  Typography,
  Icon,
  FontAwesomeProIcon,
} from 'ui'
import { Layout } from '@/components/Layout'
import type { NextPage, GetServerSidePropsResult } from 'next'
import type { Data } from '../api/v1/messages/inbox'
import { Message as MessageType } from '@/prisma'

type Props = {
  initialData: Data[]
  myId: string
  opponentId: string
}

const ConversationPage: NextPage<Props> = ({
  initialData,
  myId,
  opponentId,
}) => {
  const router = useRouter()
  const [data, setData] = useState<Data[]>(initialData)
  const [newMessage, setNewMessage] = useState('')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value)
  }

  const refetchConversation = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_ENV}/api/v1/messages/inbox?employer_id=${myId}&applier_id=${opponentId}`
    )
    const initialData: Data[] | { message: string } = await res.json()

    setData('message' in initialData ? [] : initialData)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const sendData = {
      sender_id: myId,
      recipient_id: opponentId,
      content: newMessage,
    }

    try {
      const res = await fetch('/api/v1/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendData),
      })

      if (!res.ok) {
        throw new Error('Failed to send message')
      }

      const result: MessageType = await res.json()
      const sentMessage = result
      await refetchConversation()
    } catch (error) {
      console.error('Error:', error)
    }

    setNewMessage('')
  }

  return (
    <Layout>
      <Grid container spacing={3} alignItems='stretch'>
        <Grid item xs={12}>
          <Box
            sx={{
              minHeight: { sm: 300, md: 500 },
              maxHeight: { sm: 300, md: 500 },
              overflow: 'auto',
              bgcolor: 'grey.800',
              p: 2,
              flexGrow: 1,
            }}
          >
            {data.map((message) => (
              <Box
                key={message.messageId}
                display='flex'
                justifyContent={
                  message.senderId !== myId ? 'flex-start' : 'flex-end'
                }
                my={1}
              >
                <Box
                  component='span'
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    maxWidth: '75%',
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    bgcolor:
                      message.senderId === myId
                        ? 'info.light'
                        : 'success.light',
                    boxShadow: 1,
                    flexDirection:
                      message.senderId === myId ? 'row' : 'row-reverse',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: message.senderId === myId ? 'blue' : 'green',
                      }}
                    >
                      {message.senderId === myId ? 'E' : 'A'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={message.content} sx={{ ml: 1 }} />
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ ml: 1, alignSelf: 'flex-end' }}
                  >
                    {new Date(message.timestamp).toLocaleString()}{' '}
                    {/* convert timestamp to locale string */}
                  </Typography>
                  {message.senderId === myId && (
                    <Box display='flex' alignItems='center' sx={{ ml: 0.5 }}>
                      {message.status === 'UNDELIEVERED' && (
                        <Icon
                          icon={FontAwesomeProIcon.faCheck}
                          sx={{ fontSize: 'small' }}
                        />
                      )}
                      {message.status === 'DELIEVERED' && (
                        <Icon
                          icon={FontAwesomeProIcon.faCheckDouble}
                          sx={{ fontSize: 'small' }}
                        />
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Grid container alignItems='center'>
            <Grid item xs={12} sm={10}>
              <TextField
                fullWidth
                multiline
                rows={2}
                variant='outlined'
                value={newMessage}
                onChange={handleInputChange}
                placeholder='Type your message here...'
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant='outlined'
                color='primary'
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                Send
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
): Promise<GetServerSidePropsResult<Props>> => {
  const { myId, opponentId } = context.query
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_ENV}/api/v1/messages/inbox?employer_id=${myId}&applier_id=${opponentId}`
  )
  const initialData: Data[] | { message: string } = await res.json()

  return {
    props: {
      initialData: 'message' in initialData ? [] : initialData,
      myId: myId as string,
      opponentId: opponentId as string,
    },
  }
}

export default ConversationPage
