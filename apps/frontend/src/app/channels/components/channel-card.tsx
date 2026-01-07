"use client";

import { addChannelToUser } from "@/api/twitch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { TwitchUser } from "@twitch-logger/shared";
import { BadgeCheckIcon } from "lucide-react";

interface ChannelCardProps {
  channel: TwitchUser;
}

export default function ChannelCard({ channel }: ChannelCardProps) {
  const { isPending, mutate } = useMutation({
    mutationFn: (twitchUserId: string) => addChannelToUser(twitchUserId),
  });

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex flex-col items-start gap-2">
          <Avatar className="size-16 border-2 border-indigo-500">
            <AvatarImage
              src={channel.profile_image_url}
              alt={channel.display_name + " avatar"}
            />
            <AvatarFallback>{channel.display_name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex gap-1 item-center">
            <span>{channel.display_name}</span>
            {channel.broadcaster_type === "partner" && (
              <BadgeCheckIcon className="text-indigo-500" size={18} />
            )}
          </div>
        </CardTitle>
        {channel.description !== "" && (
          <CardDescription>{channel.description}</CardDescription>
        )}
      </CardHeader>
      <CardFooter>
        <CardAction>
          <Button disabled={isPending} onClick={() => mutate(channel.id)}>
            Add
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
