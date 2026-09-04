import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ArrowLeft,
  Bot,
  Plus,
  Search,
  Send,
  Sparkles,
  Trash2,
} from 'lucide-react';

import { Link } from 'react-router-dom';

import { Breadcrumbs } from '../components/common/Breadcrumbs';

import {
  RagService,
  type RagSearchResult,
} from '../services/api';


interface ChatItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  results?: RagSearchResult[];
}


const createTimestamp = () =>
  new Date().toLocaleTimeString(
    [],
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  );


export const ChatbotPage: React.FC = () => {

  const [messages, setMessages] =
    useState<ChatItem[]>([
      {
        id: 'welcome',
        sender: 'assistant',
        text:
          'Hello! Ask me a question about the KBM knowledge base. I will search the indexed lessons and documents for relevant information.',
        timestamp:
          createTimestamp(),
      },
    ]);


  const [input, setInput] =
    useState('');


  const [isSearching, setIsSearching] =
    useState(false);


  const messagesEndRef =
    useRef<HTMLDivElement>(null);


  /*
  |--------------------------------------------------------------------------
  | Scroll
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });

  }, [messages, isSearching]);


  /*
  |--------------------------------------------------------------------------
  | New Chat
  |--------------------------------------------------------------------------
  */

  const handleNewChat = () => {

    setMessages([
      {
        id:
          `${Date.now()}-welcome`,

        sender: 'assistant',

        text:
          'New search started. Ask me anything about the KBM knowledge base.',

        timestamp:
          createTimestamp(),
      },
    ]);

    setInput('');
  };


  /*
  |--------------------------------------------------------------------------
  | Send
  |--------------------------------------------------------------------------
  */

  const handleSend = async (
    event: React.FormEvent
  ) => {

    event.preventDefault();

    const question =
      input.trim();

    if (
      !question ||
      isSearching
    ) {
      return;
    }


    /*
    |--------------------------------------------------------------------------
    | User Message
    |--------------------------------------------------------------------------
    */

    const userMessage: ChatItem = {

      id:
        `${Date.now()}-user`,

      sender: 'user',

      text:
        question,

      timestamp:
        createTimestamp(),
    };


    setMessages(
      (previous) => [
        ...previous,
        userMessage,
      ]
    );

    setInput('');
    setIsSearching(true);


    /*
    |--------------------------------------------------------------------------
    | RAG Search
    |--------------------------------------------------------------------------
    */

    try {

      const response =
        await RagService.search(
          question,
          5
        );


      if (
        response.results.length === 0
      ) {

        setMessages(
          (previous) => [
            ...previous,
            {
              id:
                `${Date.now()}-assistant`,

              sender:
                'assistant',

              text:
                'I could not find any relevant information in the indexed knowledge base.',

              timestamp:
                createTimestamp(),
            },
          ]
        );

        return;
      }


      /*
      |--------------------------------------------------------------------------
      | Format Retrieved Results
      |--------------------------------------------------------------------------
      */

      const answerText =
        response.results
          .map(
            (result, index) => {

              const source =
                result.metadata
                  .source_type ===
                'lesson'
                  ? `Lesson: ${
                      result.metadata.title ??
                      result.metadata.lesson_id ??
                      'Unknown'
                    }`
                  : `PDF: ${
                      result.metadata.filename ??
                      'Unknown'
                    }`;

              const page =
                result.metadata.page
                  ? ` — Page ${result.metadata.page}`
                  : '';

              return (
                `${index + 1}. ${source}${page}\n\n` +
                `${result.content}`
              );
            }
          )
          .join(
            '\n\n--------------------\n\n'
          );


      const assistantMessage: ChatItem = {

        id:
          `${Date.now()}-assistant`,

        sender:
          'assistant',

        text:
          `I found ${response.results.length} relevant result${
            response.results.length === 1
              ? ''
              : 's'
          } in the knowledge base.\n\n${answerText}`,

        timestamp:
          createTimestamp(),

        results:
          response.results,
      };


      setMessages(
        (previous) => [
          ...previous,
          assistantMessage,
        ]
      );

    } catch (error) {

      console.error(
        'RAG search error:',
        error
      );


      setMessages(
        (previous) => [
          ...previous,
          {
            id:
              `${Date.now()}-error`,

            sender:
              'assistant',

            text:
              'Sorry, I could not connect to the RAG service. Make sure the Python RAG API is running on http://127.0.0.1:8000.',

            timestamp:
              createTimestamp(),
          },
        ]
      );

    } finally {

      setIsSearching(false);
    }
  };


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="mx-auto flex h-[calc(100vh-4.25rem)] max-w-7xl flex-col px-4 py-3 sm:px-6 lg:px-8">

      <div className="mb-2 shrink-0">

        <Breadcrumbs
          items={[
            {
              label: 'Knowledge Search',
            },
          ]}
        />

      </div>


      <div className="grid flex-1 grid-cols-1 gap-6 overflow-hidden pb-2 md:grid-cols-4">


        {/* ============================================================
            Sidebar
        ============================================================ */}

        <div className="hidden flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-[#0b1623] md:flex">

          <div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">

              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">

                Search

              </span>


              <button
                type="button"
                onClick={handleNewChat}
                title="Clear Search"
                className="text-slate-400 transition-colors hover:text-red-500"
              >

                <Trash2 className="h-3.5 w-3.5" />

              </button>

            </div>


            <div className="mt-5 rounded-xl border border-sky-100 bg-sky-50 p-4 dark:border-sky-900/40 dark:bg-sky-950/20">

              <div className="mb-2 flex items-center gap-2">

                <Search className="h-4 w-4 text-sky-500" />

                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">

                  Semantic Search

                </span>

              </div>


              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">

                Your question is converted into an embedding and matched against the indexed lessons and PDF documents.

              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={handleNewChat}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700/80 dark:bg-[#07101a] dark:text-slate-200 dark:hover:bg-[#0f1d2e]"
          >

            <Plus className="h-4 w-4 text-sky-500" />

            New Search

          </button>

        </div>


        {/* ============================================================
            Main
        ============================================================ */}

        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800/80 dark:bg-[#0b1623] md:col-span-3">


          {/* Header */}

          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-5 py-3 backdrop-blur dark:border-slate-800 dark:bg-[#07101a]">

            <div className="flex items-center gap-3">

              <Link
                to="/lessons"
                aria-label="Back to lessons"
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >

                <ArrowLeft className="h-4 w-4" />

              </Link>


              <div className="flex items-center gap-2.5">

                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">

                  <Bot className="h-4 w-4" />

                </div>


                <div>

                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">

                    Knowledge Base Search

                  </h2>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400">

                    KBM Semantic Retrieval

                  </p>

                </div>

              </div>

            </div>


            <button
              type="button"
              onClick={handleNewChat}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300 md:hidden"
            >

              <Plus className="h-3.5 w-3.5 text-sky-500" />

              New

            </button>

          </div>


          {/* Messages */}

          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">

            {messages.map(
              (message) => (

                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >

                  {message.sender === 'assistant' && (

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">

                      <Sparkles className="h-4 w-4" />

                    </div>

                  )}


                  <div className="flex max-w-[90%] flex-col gap-1 sm:max-w-2xl">

                    <div
                      className={`whitespace-pre-line rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                        message.sender === 'user'
                          ? 'rounded-br-none bg-sky-600 text-white'
                          : 'rounded-bl-none border border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-800/80 dark:bg-[#07101a] dark:text-slate-200'
                      }`}
                    >

                      {message.text}

                    </div>


                    <span
                      className={`px-1 text-[10px] text-slate-400 ${
                        message.sender === 'user'
                          ? 'text-right'
                          : 'text-left'
                      }`}
                    >

                      {message.timestamp}

                    </span>

                  </div>

                </div>

              )
            )}


            {isSearching && (

              <div className="flex items-center gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">

                  <Search className="h-4 w-4 animate-pulse" />

                </div>


                <div className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs text-slate-500 dark:border-slate-800 dark:bg-[#07101a] dark:text-slate-400">

                  Searching the knowledge base...

                </div>

              </div>

            )}


            <div ref={messagesEndRef} />

          </div>


          {/* Input */}

          <div className="border-t border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-[#07101a]">

            <form
              onSubmit={handleSend}
              className="relative flex items-center"
            >

              <input
                type="text"
                value={input}
                onChange={(event) =>
                  setInput(
                    event.target.value
                  )
                }
                placeholder="Search the KBM knowledge base..."
                disabled={isSearching}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-12 text-xs text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:opacity-60 dark:border-slate-700/80 dark:bg-[#0b1623] dark:text-white dark:placeholder:text-slate-500"
              />


              <button
                type="submit"
                disabled={
                  !input.trim() ||
                  isSearching
                }
                aria-label="Search"
                className="absolute right-1.5 rounded-lg bg-sky-600 p-2 text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-40"
              >

                <Send className="h-3.5 w-3.5" />

              </button>

            </form>


            <p className="mt-1.5 text-center text-[10px] text-slate-500 dark:text-slate-400">

              Results are retrieved from indexed KBM lessons and PDF documents.

            </p>

          </div>

        </div>

      </div>

    </div>
  );
};