import type {Result} from '../types/loan';
import {money, scheme} from '../utils/format';

export function Results({r}: { r: Result }) {
    return <><p className="muted">{money(r.input.amount)} · {r.input.annualRate}% · {r.input.months} мес.
        · {scheme(r.input.type)}</p>
        <div
            className="stats">{[['Первый платёж', r.firstPayment], ['Всего к выплате', r.totalPayment],
            ['Переплата / проценты', r.interest], ['Последний платёж', r.lastPayment]].map(([label, value]) =>
            <div className="stat" key={label}><span>{label}</span><strong>{money(value as number)}</strong>
            </div>)}</div>
    </>;
}
