import {useState} from 'react';
import type {LoanInput} from '../types/loan';

export const initial: LoanInput = {amount: 1000000, annualRate: 18, months: 36, type: 'ANNUITY'};

export function LoanForm({onSubmit, busy}: { onSubmit: (q: LoanInput) => void; busy: boolean }) {
    const [q, setQ] = useState(initial);
    const [unit, setUnit] = useState('months');
    const [term, setTerm] = useState('36');
    return <form onSubmit={e => {
        e.preventDefault();
        onSubmit({...q, months: Number(term) * (unit === 'years' ? 12 : 1)});
    }}>
        <label>Сумма кредита, ₽<input name="amount" type="number" min="1" max="100000000" step="0.01" required
                                      value={q.amount}
                                      onChange={e => setQ({...q, amount: e.target.valueAsNumber})}/></label>
        <label>Годовая ставка, %<input name="annualRate" type="number" min="0" max="100" step="0.0001" required
                                       value={q.annualRate}
                                       onChange={e => setQ({...q, annualRate: e.target.valueAsNumber})}/></label>
        <div className="term"><label>Срок<input name="term" type="number" min="1" max={unit === 'years' ? 50 : 600}
                                                step="1" required value={term} onChange={e => setTerm(e.target.value)}/></label><label>Единица<select
            aria-label="Единица срока" value={unit} onChange={e => {
            setUnit(e.target.value);
            setTerm(e.target.value === 'years' ? '3' : '36');
        }}>
            <option value="months">Месяцы</option>
            <option value="years">Годы</option>
        </select></label></div>
        <label>Схема платежей<select name="type" value={q.type}
                                     onChange={e => setQ({...q, type: e.target.value as LoanInput['type']})}>
            <option value="ANNUITY">Аннуитетная</option>
            <option value="DIFFERENTIATED">Дифференцированная</option>
        </select></label>
        <button disabled={busy} type="submit">{busy ? 'Выполняется расчёт…' : 'Рассчитать кредит'}</button>
        <p className="muted">От 1 ₽ до 100 млн ₽ · до 600 месяцев</p></form>;
}
