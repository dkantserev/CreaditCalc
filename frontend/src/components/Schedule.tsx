import {useState} from 'react';
import type {Result} from '../types/loan';
import {money, download} from '../utils/format';

export function Schedule({r}: { r: Result }) {
    const [all, setAll] = useState(false);
    return <section id="schedule" className="panel">
        <div className="section-head"><h2>График погашения</h2>
            <div>
                <button className="secondary" onClick={() => download(r)}>Скачать CSV</button>
                <button className="secondary" onClick={() => window.print()}>Печать / PDF</button>
            </div>
        </div>
        <div className="table-wrap">
            <table>
                <thead>
                <tr>{['Месяц', 'Платёж', 'Основной долг', 'Проценты', 'Остаток'].map(x => <th key={x}>{x}</th>)}</tr>
                </thead>
                <tbody>{r.schedule.map((x, i) => <tr key={x.month} className={!all && i >= 12 ? 'extra-row' : ''}>
                    <td>Месяц {x.month}</td>
                    {[x.payment, x.principal, x.interest, x.balance].map((n, j) => <td key={j}>{money(n)}</td>)}
                </tr>)}</tbody>
            </table>
        </div>
        {r.schedule.length > 12 && <button className="secondary"
                                           onClick={() => setAll(!all)}>{all ? 'Свернуть' : 'Показать все ' + r.schedule.length + ' платежей'}</button>}
        <p className="muted">Периоды условные: месяц 1 начинается после выдачи. Календарные даты и банковские переносы
            не моделируются.</p></section>;
}
