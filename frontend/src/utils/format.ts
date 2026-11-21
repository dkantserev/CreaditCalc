import type {Result} from '../types/loan';

export const money = (n: number) => new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2
}).format(n);
export const scheme = (s: string) => s === 'ANNUITY' ? 'Аннуитетный' : 'Дифференцированный';

export function csv(result: Result) {
    return '\uFEFF' + ['Месяц;Платёж;Основной долг;Проценты;Остаток', ...result.schedule.map(r => [r.month,
        ...[r.payment, r.principal, r.interest, r.balance].map(n => n.toFixed(2).replace('.', ','))].join(';'))].join('\r\n');
}

export function download(result: Result) {
    const url = URL.createObjectURL(new Blob([csv(result)], {type: 'text/csv;charset=utf-8'}));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'creditcalc-schedule.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
