import {LoanForm} from '../components/LoanForm';
import {Results} from '../components/Results';
import {lazy, Suspense} from 'react';

const Charts = lazy(() => import('../components/Charts').then(m => ({default: m.Charts})));
import {Schedule} from '../components/Schedule';
import {Compare} from '../components/Compare';
import {useCalculation} from '../hooks/useCalculation';

export function Calculator() {
    const {result, busy, error, run} = useCalculation();
    return <>
        <header><a className="brand" href="#">CreditCalc</a>
            <nav>
                <a href="#calculator">Калькулятор</a>
                <a href="#compare">Сравнение</a>
                <a href="#about">Как это работает</a></nav>
           </header>
        <main>
            <div className="hero"><h1>Разберитесь в кредите<br/>до
                первого платежа</h1><p>Рассчитайте выплаты, изучите график и сравните условия<br/>в одном месте.
                Прозрачные формулы, понятные результаты.</p></div>
            <div className="calculator" id="calculator">
                <section className="panel"><h2>Параметры кредита</h2><LoanForm onSubmit={run} busy={busy}/></section>
                <section className="panel result" aria-live="polite"><p className="eyebrow">ВАШ РАСЧЁТ</p><h2>Стоимость
                    кредита</h2>{busy ? <p role="status">Рассчитываем график платежей…</p> : error ?
                    <p className="error" role="alert">{error}</p> : result ? <><Results r={result}/><p
                            className="note">Расчёт без комиссий, страхования и досрочного погашения. Это не полная
                            стоимость кредита (ПСК).</p></> :
                        <div className="empty"><span>◈</span><h3>Здесь появятся результаты</h3><p>Укажите параметры
                            слева и нажмите<br/>«Рассчитать кредит».</p></div>}</section>
            </div>
            {result && <><Suspense fallback={<p>Загружаем графики…</p>}><Charts r={result}/></Suspense><Schedule
                r={result}/></>}<Compare/>
            <section id="about" className="panel"><h2>Как устроен расчёт</h2>
                <div className="about-grid">
                    <div><h3>Аннуитет</h3><p> Из суммы платежа уплачиваются все проценты, фактически начисленные за
                        прошедший месяц, а оставшаяся часть платежа
                        направляется на возврат основного долга. Каждый месяц сумма процентов уменьшается, так как
                        уменьшается остаток суммы кредита, на который они начисляются. Последний платёж
                        корректируется до полного погашения.</p></div>
                    <div>
                        <h3>Дифференцированные платежи</h3>
                        <p>Из суммы дифференцированного платежа оплачиваются все
                        проценты, фактически начисленные за прошедший месяц. Каждый месяц сумма процентов уменьшается,
                        так как уменьшается остаток суммы кредита, на который они начисляются. При этом сумма платежа,
                        которая направляется на возврат основного долга, не изменяется в течение срока кредита.
                        </p>
                    </div>
                </div>
            </section>
            <footer>
            </footer>
        </main>
    </>;
}
