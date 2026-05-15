import { wshcmxnet } from "@wshcmx/net";
import { wshcmx } from ".";

/**
 * Выполняет процесс с указанными аргументами и возвращает результат выполнения.
 * @param {string} cmd - команда для выполнения
 * @param {string[]} args - массив аргументов для команды
 * @returns {object} объект с результатами выполнения процесса, включая код выхода, стандартный вывод, стандартную ошибку, время начала и окончания, продолжительность и статус успеха
 */
export function execute(cmd: string, args: string[]) {
    wshcmx.log.verbose("Executing process...");

    // @ts-ignore
    const result = wshcmx.net?.CallClassStaticMethod<wshcmxnet.ProcessHelper>("wshcmx.Net.ProcessHelper", "Execute", [cmd, args.join(" ")]);
    wshcmx.log.verbose("Process finished execution in " + result.Duration + " ms with exit code " + result.ExitCode);

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