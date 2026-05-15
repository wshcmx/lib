import { wshcmx } from ".";
import { wshcmx as wschmxnet } from "@wshcmx/net";

export interface IProcessResult {
    ExitCode: number;
    StandardOutput: string;
    StandardError: string;
    StartTime: Date;
    ExitTime: Date;
    Duration: number;
    IsSuccess: boolean;
}

/**
 * Выполняет процесс с указанными аргументами и возвращает результат выполнения.
 * @param {string} cmd - команда для выполнения
 * @param {string[]} args - массив аргументов для команды
 * @returns {object} объект с результатами выполнения процесса, включая код выхода, стандартный вывод, стандартную ошибку, время начала и окончания, продолжительность и статус успеха
 */
export function execute(cmd: string, args: string[]): IProcessResult {
    wshcmx.log.verbose("Выполнение процесса...");

    const result = wshcmx.net?.CallClassStaticMethod<ReturnType<wschmxnet.Net.ProcessHelper["Execute"]>>("wshcmx.Net.ProcessHelper", "Execute", [cmd, args.join(" ")]);

    if (result === undefined) {
        wshcmx.log.error("Ошибка выполнения процесса: wshcmx.net не определен.");
        return {
            ExitCode: -1,
            StandardOutput: "",
            StandardError: "wshcmx.net не определен",
            StartTime: new Date(),
            ExitTime: new Date(),
            Duration: 0,
            IsSuccess: false
        };
    }

    wshcmx.log.verbose("Процесс завершен за " + result.Duration + " мс с кодом выхода " + result.ExitCode);

    return {
        ExitCode: result.ExitCode,
        StandardOutput: result.StandardOutput,
        StandardError: result.StandardError,
        StartTime: result.StartTime,
        ExitTime: result.ExitTime,
        Duration: result.Duration,
        IsSuccess: result.IsSuccess
    }
}