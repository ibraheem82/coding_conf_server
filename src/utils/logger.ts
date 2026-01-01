import pino from 'pino';

// Read NODE_ENV directly to avoid circular dependency with env.ts
const isDev = process.env.NODE_ENV === 'development';

export const logger = pino({
    level: isDev ? 'debug' : 'info',
    transport: isDev
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
                ignore: 'pid,hostname',
            },
        }
        : undefined,
    redact: {
        paths: ['password', 'token', 'secret', 'authorization', 'cookie'],
        remove: true,
    },
    base: {
        pid: process.pid,
    },
    // Serializers to handle Error objects correctly
    serializers: {
        err: pino.stdSerializers.err,
        error: pino.stdSerializers.err,
    },
});