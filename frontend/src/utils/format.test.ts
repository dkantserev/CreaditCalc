import {describe, it, expect} from 'vitest';
import {csv, money} from './format';
import type {Result} from '../types/loan';

describe('export', () => {
    it('exports BOM, Russian headers and decimal comma', () => {
        const r = {schedule: [{month: 1, payment: 100.25, principal: 100, interest: 0.25, balance: 0}]} as Result;
        expect(csv(r)).toBe('\uFEFFМесяц;Платёж;Основной долг;Проценты;Остаток\r\n1;100,25;100,00;0,25;0,00');
    });
    it('formats rubles', () => expect(money(123.45)).toContain('123,45'));
});
