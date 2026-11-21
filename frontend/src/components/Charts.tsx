import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import type {Result} from '../types/loan';

export function Charts({r}: { r: Result }) {
    return <div className="charts">
        <section><h3>Остаток долга</h3><ResponsiveContainer width="100%" height={230}><LineChart
            data={[{month: 0, balance: r.input.amount}, ...r.schedule]}><CartesianGrid strokeDasharray="3 3"/><XAxis
            dataKey="month"/><YAxis width={72} tickFormatter={n => `${Math.round(n / 1000)} тыс.`}/><Tooltip/><Line
            dataKey="balance" name="Остаток, ₽" stroke="#116c5c" dot={false}
            strokeWidth={3}/></LineChart></ResponsiveContainer></section>
        <section><h3>Состав платежей по месяцам</h3><ResponsiveContainer width="100%" height={230}><BarChart
            data={r.schedule}><XAxis dataKey="month"/><YAxis width={65}/><Tooltip/><Legend/><Bar dataKey="principal"
                                                                                                 name="Долг, ₽"
                                                                                                 fill="#116c5c"
                                                                                                 stackId="a"/><Bar
            dataKey="interest" name="Проценты, ₽" fill="#eab65a" stackId="a"/></BarChart></ResponsiveContainer>
        </section>
        <section><h3>Структура всех выплат</h3><ResponsiveContainer width="100%" height={230}><PieChart><Pie
            data={[{name: 'Основной долг', value: r.input.amount}, {name: 'Проценты', value: r.interest}]}
            dataKey="value" innerRadius={55} outerRadius={80}><Cell fill="#116c5c"/><Cell
            fill="#eab65a"/></Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer></section>
    </div>;
}
