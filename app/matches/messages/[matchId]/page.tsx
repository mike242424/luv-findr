'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchMessages, sendMessage } from '@/lib/messageApi';
import { fetchUserDetails } from '@/lib/userApi';
import { calculateAge } from '@/lib/dateUtils';
import LoadingSpinner from '@/components/loading';
import NoMessagesFoundPage from './no-messages-found';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messagesLoading || userDetailsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-24 mx-10">
      <div className="flex flex-col w-full lg:flex-row gap-4">
        <div className="w-full lg:w-1/2 p-4 flex flex-col">
          <Card className="flex flex-col bg-black border-2 border-primary rounded-lg h-[500px] overflow-y-auto text-white">
            <CardTitle className="text-center text-primary font-bold text-3xl mb-4 p-4 border-b-2 border-primary">
              MY MATCH
            </CardTitle>
            <div className="overflow-y-auto mb-4">
              <div className="flex justify-center py-10">
                <Image
                  src={matchedUser?.user?.profilePhoto}
                  alt={`${matchedUser?.user?.firstName} profile photo`}
                  width={300}
                  height={300}
                  className="rounded"
                />
              </div>
              <div className="ms-4">
                <CardTitle>
                  <strong>
                    {matchedUser?.user?.firstName},{' '}
                    {calculateAge(matchedUser?.user?.dateOfBirth)}
                  </strong>
                </CardTitle>
                <p className="text-md pt-3">{matchedUser?.user?.profession}</p>
              </div>

              <CardContent className="flex-1 p-4">
                <hr className="border-[1px] border-primary" />
                <p className="my-4 text-md">{matchedUser?.user?.about}</p>
                <hr className="border-[1px] border-primary mb-2" />
              </CardContent>
            </div>
          </Card>
        </div>
        <div className="w-full lg:w-1/2 p-4 flex flex-col">
          <Card className="flex flex-col bg-black border-2 border-primary rounded-lg h-[500px] overflow-y-auto">
            <CardTitle className="text-center text-primary font-bold text-3xl mb-4 p-4 border-b-2 border-primary">
              MY MESSAGES
            </CardTitle>
            <div className="flex-1 overflow-y-auto p-4">
              {messages && messages.length > 0 ? (
                messages.map((message: any) => (
                  <div
                    key={message.id}
                    className={`flex flex-col ${
                      message.from === matchId ? 'items-end' : 'items-start'
                    } mb-4`}
                  >
                    <div
                      className={`p-3 rounded ${
                        message.from === matchId
                          ? 'bg-primary text-white'
                          : 'bg-white text-black'
                      }`}
                    >
                      <p>{message.content}</p>
                      <span className="text-sm">
                        {new Date(message.createdAt).toLocaleTimeString(
                          'en-US',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          },
                        )}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <NoMessagesFoundPage />
              )}
              <div ref={messagesEndRef} />
            </div>
            {messages.length > 0 && (
              <div className="flex items-center justify-center w-full mt-4 p-4 bg-black border-t-2 border-primary">
                <div className="flex w-full gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
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
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
