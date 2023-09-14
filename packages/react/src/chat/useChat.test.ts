// import { DEFAULT_SUBMIT_CHAT_OPTIONS } from '@markprompt/core';
// import { waitFor } from '@testing-library/react';
// import {
//   act,
//   renderHook,
//   suppressErrorOutput,
// } from '@testing-library/react-hooks';
// import { rest } from 'msw';
// import { setupServer } from 'msw/node';
// import {
//   afterAll,
//   afterEach,
//   beforeAll,
//   describe,
//   expect,
//   it,
//   vi,
// } from 'vitest';

// import { useChat } from './useChat';

// const encoder = new TextEncoder();
// let markpromptData: unknown = '';
// let markpromptDebug = '';
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// let requestBody: any = {};
// let response: string | string[] = [];
// let slowChunks = false;
// let status = 200;
// let stream: ReadableStream;

// const server = setupServer(
//   rest.post(DEFAULT_SUBMIT_CHAT_OPTIONS.apiUrl!, async (req, res, ctx) => {
//     requestBody = await req.json();

//     stream = new ReadableStream({
//       async start(controller) {
//         for (const chunk of response) {
//           if (slowChunks) {
//             await new Promise((resolve) => setTimeout(resolve, 10));
//           }
//           controller.enqueue(encoder.encode(chunk));
//         }
//         controller?.close();
//       },
//     });

//     return res(
//       ctx.status(status),
//       ctx.set(
//         'x-markprompt-data',
//         encoder.encode(JSON.stringify(markpromptData)).toString(),
//       ),
//       ctx.set(
//         'x-markprompt-debug-info',
//         encoder.encode(JSON.stringify(markpromptDebug)).toString(),
//       ),
//       ctx.body(stream),
//     );
//   }),
// );

// describe('useChat', () => {
//   // eslint-disable-next-line @typescript-eslint/no-empty-function
//   const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => {});

//   beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

//   afterEach(() => {
//     status = 200;
//     response = [];
//     requestBody = {};
//     slowChunks = false;
//     markpromptData = '';
//     markpromptDebug = '';

//     server.resetHandlers();
//     vi.resetAllMocks();
//   });

//   afterAll(() => {
//     vi.restoreAllMocks();
//     server.close();
//   });

//   it('throws an error when the project key is missing', () => {
//     const restoreConsole = suppressErrorOutput();

//     try {
//       // @ts-expect-error - projectKey is missing
//       const { result } = renderHook(() => useChat({}));
//       expect(result.error).toBeDefined();
//       expect(result.error).toBeInstanceOf(Error);
//     } finally {
//       restoreConsole();
//     }
//   });

//   it('initializes with a default state', () => {
//     const { result } = renderHook(() => useChat({ projectKey: 'test-key' }));
//     expect(result.current).toStrictEqual({
//       abort: expect.any(Function),
//       abortFeedbackRequest: expect.any(Function),
//       messages: [],
//       conversationId: undefined,
//       regenerateLastAnswer: expect.any(Function),
//       submitChat: expect.any(Function),
//       submitFeedback: expect.any(Function),
//     });
//   });

//   it('adds a new message when submitChat is called', async () => {
//     const { result, waitFor } = renderHook(() =>
//       useChat({ projectKey: 'test-key' }),
//     );

//     response = ['Hi! ', 'How are you?'];

//     act(() => result.current.submitChat('Hello'));

//     await waitFor(() =>
//       expect(result.current.messages[0].answer).toBe('Hi! How are you?'),
//     );
//   });

//   it('updates the state of the message as it streams', async () => {
//     const { result, waitFor } = renderHook(() =>
//       useChat({ projectKey: 'test-key' }),
//     );

//     response = ['Hi! ', 'How are you?'];

//     act(() => result.current.submitChat('Hello'));

//     await waitFor(() =>
//       expect(result.current.messages[0].state).toBe('preload'),
//     );

//     await waitFor(() =>
//       expect(result.current.messages[0].state).toBe('streaming-answer'),
//     );

//     await waitFor(() => expect(result.current.messages[0].state).toBe('done'));
//   });

//   it('updates messages when references are present', async () => {
//     const { result, waitFor } = renderHook(() =>
//       useChat({ projectKey: 'test-key' }),
//     );

//     response = ['Hi! ', 'How are you?'];

//     const references = [
//       {
//         file: { path: '/page1', source: { type: 'file-upload' } },
//         meta: { leadHeading: { value: 'Page 1' } },
//       },
//     ];

//     markpromptData = { references };

//     act(() => result.current.submitChat('Hello'));

//     await waitFor(() =>
//       expect(result.current.messages[0].references).toStrictEqual(references),
//     );
//   });

//   it('updates messages when promptId is present', async () => {
//     const { result, waitFor } = renderHook(() =>
//       useChat({ projectKey: 'test-key' }),
//     );

//     response = ['Hi! ', 'How are you?'];

//     const promptId = 'test-prompt-id';

//     markpromptData = { promptId };

//     act(() => result.current.submitChat('Hello'));

//     await waitFor(() =>
//       expect(result.current.messages[0].promptId).toStrictEqual(promptId),
//     );
//   });

//   it('cancels the previous request while it is preloading when submitChat is called', async () => {
//     const { result, waitFor } = renderHook(() =>
//       useChat({ projectKey: 'test-key' }),
//     );

//     response = ['Hi! ', 'How are you?'];

//     act(() => result.current.submitChat('Hello'));
//     await waitFor(() =>
//       expect(result.current.messages[0].state).toBe('preload'),
//     );
//     act(() => result.current.submitChat('Hello'));

//     await waitFor(() => expect(result.current.messages.length).toBe(2));
//     expect(result.current.messages[0].state).toBe('cancelled');
//   });

//   it('cancels the previous request while it is streaming when submitChat is called', async () => {
//     const { result, waitFor } = renderHook(() =>
//       useChat({ projectKey: 'test-key' }),
//     );

//     response = ['Hi! ', 'How are you?'];
//     slowChunks = true;

//     act(() => result.current.submitChat('Hello'));
//     await waitFor(() =>
//       expect(result.current.messages[0].state).toBe('streaming-answer'),
//     );
//     act(() => result.current.submitChat('Hello'));

//     await waitFor(() => expect(result.current.messages.length).toBe(2));
//     expect(result.current.messages[0].state).toBe('cancelled');
//   });

//   it('converts messages to the proper shape for the API', async () => {
//     const { result, waitFor } = renderHook(() =>
//       useChat({ projectKey: 'test-key' }),
//     );

//     response = ['Hi! ', 'How are you?'];

//     act(() => result.current.submitChat('Hello'));

//     await waitFor(() =>
//       expect(requestBody?.messages).toEqual([
//         {
//           content: 'Hello',
//           role: 'user',
//         },
//       ]),
//     );
//   });

//   it('sets message state to cancelled after aborting the request', async () => {
//     const { result } = renderHook(() => useChat({ projectKey: 'test-key' }));

//     response = ['Hi! ', 'How are you?'];

//     result.current.submitChat('Hello');
//     act(() => result.current.abort());

//     await waitFor(() =>
//       expect(result.current.messages[0].state).toBe('cancelled'),
//     );

//     expect(consoleMock).not.toHaveBeenCalled();
//   });

//   it('logs errors other than AbortErrors', async () => {
//     const { result } = renderHook(() => useChat({ projectKey: 'test-key' }));

//     response = 'Internal server error';
//     status = 500;

//     act(() => result.current.submitChat('Hello'));

//     await waitFor(() =>
//       expect(result.current.messages[0].state).toBe('cancelled'),
//     );

//     expect(consoleMock).toHaveBeenCalled();
//   });

//   it('regenerates the last message', async () => {
//     const { result } = renderHook(() => useChat({ projectKey: 'test-key' }));

//     response = ['Hi! ', 'How are you?'];

//     act(() => result.current.submitChat('Hello'));

//     await waitFor(() => expect(result.current.messages[0].state).toBe('done'));

//     act(() => result.current.regenerateLastAnswer());

//     expect(result.current.messages.length).toBe(2);
//     expect(result.current.messages[0].prompt).toBe(
//       result.current.messages[1].prompt,
//     );
//   });
// });
