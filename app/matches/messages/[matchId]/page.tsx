'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Loading from '@/components/loading';
import NoMessagesFoundPage from './no-messages-found';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateAge } from '@/lib/utils';

export const fetchUserDetails = async (userId: string) => {
  const response = await axios.get(`/api/users/user`, {
    params: { userId },
  });
  return response.data;
};

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

  const { data: matchedUser, isLoading: userDetailsLoading } = useQuery({
    queryKey: ['userDetails', matchId],
    queryFn: () => fetchUserDetails(matchId),
    enabled: !!matchId,
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

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      mutation.mutate(newMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (messagesLoading || userDetailsLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-28 mx-10">
      <div className="flex flex-col lg:flex-row w-full">
        <div className="w-full lg:w-1/2 p-4">
          <Card className="text-white bg-black border-2 border-primary">
            <CardHeader>
              <CardTitle className="text-center text-primary font-bold text-3xl">
                MY MATCH
              </CardTitle>
              <div className="flex justify-center py-10">
                <Image
                  src={matchedUser?.user?.profilePhoto}
                  alt={`${matchedUser?.user?.firstName} profile photo`}
                  width={300}
                  height={300}
                  className="rounded-full"
                />
              </div>
              <CardTitle>
                <strong>
                  {matchedUser?.user?.firstName},{' '}
                  {calculateAge(matchedUser?.user?.dateOfBirth)}
                </strong>
              </CardTitle>
              <p className="text-md pt-3">{matchedUser?.user?.profession}</p>
            </CardHeader>
            <CardContent>
              <hr className="border-[1px] border-primary" />
              <p className="my-4 text-md">{matchedUser?.user?.about}</p>
              <hr className="border-[1px] border-primary mb-2" />
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-1/2 p-4 flex flex-col">
          <Card
            className={`flex flex-col bg-black h-full ${
              messages.length > 0 ? 'border-2 border-primary rounded-lg' : ''
            } p-10 overflow-y-auto`}
          >
            <CardTitle className="text-center text-primary font-bold text-3xl">
              MY MESSAGES
            </CardTitle>
            {messages && messages.length > 0 ? (
              messages.map((message: any) => (
                <div
                  key={message.id}
                  className={`flex flex-col ${
                    message.from === matchId ? 'items-end' : 'items-start'
                  } mb-2`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      message.from === matchId ? 'text-primary' : 'text-white'
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
          </Card>
          <div className="flex items-center justify-center w-full mt-6">
            <div className="flex w-full">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown} // Add key down handler
                placeholder="Type your message"
                className="flex-grow"
              />
              <Button
                onClick={handleSendMessage}
                disabled={mutation.isPending}
                className="ml-2"
              >
                {mutation.isPending ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
