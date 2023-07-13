# useRecords

The `useRecords` hook is a wrapper around the `useWS` hook. This hook will fetch all the latest records from the server on load. It works by sending a `rt_request` message to the server when the connection is established. The server will then send a message with all the latest records.

## Parameters

None

## Returns

The hook returns the following:

- `records`: The latest records received from the server
- `refreshRecords`: A function that sends a `rt_request` message to the server to fetch the latest records and updates the `records` state
- `messageHistory`: an array of all messages received from the server
- `connectionStatus`: the current connection status
- `rtConnected`: a boolean indicating whether a real-time connection is established

## Example Usage

```tsx
const Example = () => {
  const { records, connectionStatus, rtConnected, refreshRecords } =
    useRecords();

  return (
    <div>
      <button onClick={refreshRecords}>Refresh Records</button>
      <div>Connection Status: {connectionStatus}</div>
      <div>
        Real-time Connection: {rtConnected ? "Connected" : "Disconnected"}
      </div>
      <div>Records: {JSON.stringify(records)}</div>
    </div>
  );
};
```
