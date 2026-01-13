import { GetAddedTwitchChannelsQuery } from "@twitch-logger/shared";

export const getAddedTwitchChannels = async (
  query: GetAddedTwitchChannelsQuery
) => {
  const params = new URLSearchParams();

  if (query.page) params.append("page", query.page.toString());
  if (query.page_size) params.append("page_size", query.page_size.toString());

  if (query.sort_by) params.append("sort_by", query.sort_by);
  if (query.sort_order) params.append("sort_order", query.sort_order);

  if (query.user_id)
    query.user_id.forEach((id) => params.append("user_id", id));
  if (query.broadcaster_type)
    query.broadcaster_type.forEach((bt) =>
      params.append("broadcaster_type", bt)
    );

  if (query.search_phrase) params.append("search_phrase", query.search_phrase);

  if (query.created_at_from)
    params.append("created_at_from", query.created_at_from);
  if (query.created_at_to) params.append("created_at_to", query.created_at_to);

  if (query.account_created_at_from)
    params.append("account_created_at_from", query.account_created_at_from);
  if (query.account_created_at_to)
    params.append("account_created_at_to", query.account_created_at_to);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/twitch/channels?` + params.toString()
  );

  if (!response.ok) throw new Error("Failed to fetch stored channels");

  return response.json();
};
