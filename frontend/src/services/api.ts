import type {LoanInput, Result, Comparison} from '../types/loan';

async function post<T>(path: string, body: unknown): Promise<T> {
    let response: Response;
    try {
        response = await fetch('/api/v1/loans/' + path, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(15000)
        });
    } catch {
        throw new Error('Сервер недоступен. Проверьте подключение и повторите расчёт.');
    }
    const data = await response.json().catch(() => ({message: 'Некорректный ответ сервера'}));
    if (!response.ok) throw new Error(data.message || 'Не удалось выполнить расчёт');
    return data;
}

export const calculate = (q: LoanInput) => post<Result>('calculate', q);
export const compare = (offers: LoanInput[]) => post<Comparison>('compare', {offers});
