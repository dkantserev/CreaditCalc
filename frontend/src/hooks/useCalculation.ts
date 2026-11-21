import {useState} from 'react';
import {calculate} from '../services/api';
import type {LoanInput, Result} from '../types/loan';

export function useCalculation() {
    const [result, setResult] = useState<Result>();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    async function run(q: LoanInput) {
        setBusy(true);
        setError('');
        setResult(undefined);
        try {
            setResult(await calculate(q));
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setBusy(false);
        }
    }

    return {result, busy, error, run};
}
