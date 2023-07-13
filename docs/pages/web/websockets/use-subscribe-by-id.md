# useSubscribeById

The `useSubscribeById` hook is a wrapper around the `useWS` hook. This hook will subscribe to the device feed and filter the messages by the `acp_id`. Under the hood it first sends a request for the latest record for that device then sends a `rt_subscribe` message to the server to subscribe to the device feed. It also ensures that the `id` is not undefined before connecting to the server (this is useful when the `id` is fetched asynchronously using query params).

## Parameters

- `id`: the `acp_id` of the device to subscribe to

## Returns

The hook returns the following:

- `messageHistory`: an array of all messages received from the server
- `lastMessage`: the last message received from the server
- `sendJsonMessage`: a function that sends a JSON message to the server
- `connectionStatus`: the current connection status
- `rtConnected`: a boolean indicating whether a real-time connection is established

## Example Usage

```tsx
const {
  messageHistory,
  lastMessage,
  sendJsonMessage,
  connectionStatus,
  rtConnected,
} = useSubscribeById(id);
```
