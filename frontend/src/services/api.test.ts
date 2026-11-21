import {it, expect, vi, afterEach} from 'vitest';
import {calculate} from './api';
import {initial} from '../components/LoanForm';

afterEach(() => vi.unstubAllGlobals());
it('reports network errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error()));
    await expect(calculate(initial)).rejects.toThrow('Сервер недоступен');
});
it('reports API validation error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({message: 'Некорректные параметры'})
    }));
    await expect(calculate(initial)).rejects.toThrow('Некорректные параметры');
});
