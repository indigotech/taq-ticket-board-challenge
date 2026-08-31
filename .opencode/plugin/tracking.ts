import { appendFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { Plugin } from '@opencode-ai/plugin';

const MAX_STRING_LENGTH = 2000;

function truncate(value: unknown, seen: WeakSet<object> = new WeakSet()): unknown {
  if (typeof value === 'string') {
    if (value.length <= MAX_STRING_LENGTH) {
      return value;
    }
    return `${value.slice(0, MAX_STRING_LENGTH)}… [truncated, ${value.length - MAX_STRING_LENGTH} more chars]`;
  }

  if (Array.isArray(value)) {
    return value.map(item => truncate(item, seen));
  }

  if (value && typeof value === 'object') {
    if (seen.has(value)) {
      return '[circular]';
    }
    seen.add(value);

    const result: Record<string, unknown> = {};
    for (const [key, entryValue] of Object.entries(value)) {
      result[key] = truncate(entryValue, seen);
    }
    return result;
  }

  return value;
}

interface PendingToolCall {
  tool: string;
  args: unknown;
  startedAt: number;
}

export const TrackingPlugin: Plugin = async ({ directory }) => {
  const logFile = join(directory, '.opencode', 'logs', 'session.jsonl');
  const pendingToolCalls = new Map<string, PendingToolCall>();

  async function log(entry: Record<string, unknown>): Promise<void> {
    try {
      await mkdir(dirname(logFile), { recursive: true });
      const line = { timestamp: new Date().toISOString(), ...(truncate(entry) as Record<string, unknown>) };
      await appendFile(logFile, `${JSON.stringify(line)}\n`, 'utf8');
    } catch (error) {
      console.error('tracking plugin: failed to write log entry', error);
    }
  }

  return {
    event: async ({ event }) => {
      if (event.type === 'session.created') {
        const { id, parentID, title, directory: sessionDirectory, time } = event.properties.info;
        await log({
          type: 'session.created',
          sessionID: id,
          parentID,
          title,
          directory: sessionDirectory,
          createdAt: new Date(time.created).toISOString(),
        });
        return;
      }

      if (event.type === 'session.idle') {
        await log({ type: 'session.idle', sessionID: event.properties.sessionID });
        return;
      }

      if (event.type === 'session.error') {
        await log({ type: 'session.error', sessionID: event.properties.sessionID, error: event.properties.error });
        return;
      }

      if (event.type === 'file.edited') {
        await log({ type: 'file.edited', file: event.properties.file });
      }
    },

    'chat.message': async (input, output) => {
      const text = output.parts
        .filter(part => part.type === 'text')
        .map(part => part.text)
        .join('\n');

      await log({ type: 'prompt', sessionID: input.sessionID, agent: input.agent, text });
    },

    'tool.execute.before': async (input, output) => {
      pendingToolCalls.set(input.callID, { tool: input.tool, args: output.args, startedAt: Date.now() });
    },

    'tool.execute.after': async (input, output) => {
      const pending = pendingToolCalls.get(input.callID);
      pendingToolCalls.delete(input.callID);

      await log({
        type: 'tool',
        sessionID: input.sessionID,
        callID: input.callID,
        tool: input.tool,
        args: pending?.args,
        title: output.title,
        output: output.output,
        metadata: output.metadata,
        durationMs: pending ? Date.now() - pending.startedAt : undefined,
      });
    },
  };
};
