import {useState} from 'react';
import type {LoanInput, Comparison} from '../types/loan';
import {compare} from '../services/api';
import {initial} from './LoanForm';
import {money, scheme} from '../utils/format';

export function Compare() {
    const [offers, setOffers] = useState<LoanInput[]>([initial, {...initial, annualRate: 16}, {
        ...initial,
        type: 'DIFFERENTIATED'
    }]);
    const [result, setResult] = useState<Comparison>();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const change = (i: number, key: keyof LoanInput, value: string) => {
        setResult(undefined);
        setOffers(offers.map((q, j) => j === i ? {...q, [key]: key === 'type' ? value : Number(value)} : q));
    };
    return <section className="panel" id="compare"><h2>Сравните три сценария</h2><p className="muted">Одинаковые суммы и
        сроки делают сравнение нагляднее. Минимум выплат сам по себе не определяет подходящий кредит.</p>
        <form onSubmit={async e => {
            e.preventDefault();
            setBusy(true);
            setError('');
            setResult(undefined);
            try {
                setResult(await compare(offers));
            } catch (e) {
                setError((e as Error).message);
            } finally {
                setBusy(false);
            }
        }}>
            <div className="offer-grid">{offers.map((q, i) => <fieldset key={i}>
                <legend>Вариант {i + 1}</legend>
                {(['amount', 'annualRate', 'months'] as const).map((key, j) => <label
                    key={key}>{['Сумма, ₽', 'Ставка, %', 'Срок, мес.'][j]}<input aria-label={`Вариант ${i + 1}: ${key}`}
                                                                                 type="number" required
                                                                                 min={key === 'annualRate' ? 0 : 1}
                                                                                 max={key === 'amount' ? 100000000 : key === 'months' ? 600 : 100}
                                                                                 step={key === 'months' ? 1 : key === 'amount' ? 0.01 : 0.0001}
                                                                                 value={q[key]}
                                                                                 onChange={e => change(i, key, e.target.value)}/></label>)}<label>Схема<select
                value={q.type} onChange={e => change(i, 'type', e.target.value)}>
                <option value="ANNUITY">Аннуитетная</option>
                <option value="DIFFERENTIATED">Дифференцированная</option>
            </select></label></fieldset>)}</div>
            <button disabled={busy}>{busy ? 'Сравниваем…' : 'Сравнить предложения'}</button>
        </form>
        {error && <p role="alert" className="error">{error}</p>}{result && <div className="table-wrap">
            <table>
                <thead>
                <tr>{['Вариант', 'Сумма / ставка / срок', 'Схема', 'Первый платёж', 'Всего', 'Переплата', 'Минимум'].map(x =>
                    <th key={x}>{x}</th>)}</tr>
                </thead>
                <tbody>{result.offers.map((r, i) => <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{money(r.input.amount)} / {r.input.annualRate}% / {r.input.months} мес.</td>
                    <td>{scheme(r.input.type)}</td>
                    <td>{money(r.firstPayment)}</td>
                    <td>{money(r.totalPayment)}</td>
                    <td>{money(r.interest)}</td>
                    <td>{result.lowestInterestIndexes.includes(i) &&
                        <span className="badge">Переплата</span>}{result.lowestTotalIndexes.includes(i) &&
                        <span className="badge">Общие выплаты</span>}</td>
                </tr>)}</tbody>
            </table>
        </div>}</section>;
}
