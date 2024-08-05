'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Loading from '@/components/loading';
import NoMessagesFoundPage from './no-messages-found';

const fetchMessages = async (matchId: string) => {
  const response = await axios.get(`/api/users/user/messages/${matchId}`);
  return response.data;
};

const sendMessage = async (data: { matchId: string; content: string }) => {
  const response = await axios.post(`/api/users/user/messages`, data);
  return response.data;
};

const MessagesPage = ({
  params: { matchId },
}: {
  params: { matchId: string };
}) => {
  const {
    data: messages,
    isLoading: messagesLoading,
    refetch,
  } = useQuery({
    queryKey: ['messages', matchId],
    queryFn: () => fetchMessages(matchId),
  });
  const [newMessage, setNewMessage] = useState('');

  const mutation = useMutation({
    mutationFn: (content: string) => sendMessage({ matchId, content }),
    onSuccess: () => {
      setNewMessage('');
      refetch();
    },
    onError: (error: any) => {
      console.error('Error sending message:', error);
    },
  });

  if (messagesLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-28 mx-10">
      <div
        className={`flex flex-col w-full sm:w-10/12 md:w-8/12 lg:w-6/12 ${
          messages.length > 0 ? 'border-2 border-primary rounded-lg' : ''
        } p-10 overflow-y-auto`}
      >
        {messages && messages.length > 0 ? (
          messages.map((message: any) => (
            <div
              key={message.id}
              className={`flex ${
                message.from === matchId ? 'justify-end' : 'justify-start'
              } mb-2`}
            >
              <div
                className={`p-2 rounded-lg ${
                  message.from === matchId ? 'text-white' : 'text-primary'
                }`}
              >
                <p>{message.content}</p>
                <span className="text-sm">
                  {new Date(message.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <NoMessagesFoundPage />
        )}
      </div>
      <div className="flex items-center justify-center w-full mt-6">
        <div className="flex items-center w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message"
            className="flex-grow"
          />
          <Button
            onClick={() => mutation.mutate(newMessage)}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
