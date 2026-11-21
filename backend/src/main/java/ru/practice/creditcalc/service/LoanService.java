package ru.practice.creditcalc.service;

import java.math.*;
import java.util.*;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;
import ru.practice.creditcalc.dto.*;

@Service
public class LoanService {
    private static final MathContext MC = MathContext.DECIMAL128;

    private static BigDecimal money(BigDecimal x) {
        return x.setScale(2, RoundingMode.HALF_UP);
    }

    public LoanResult calculate(LoanRequest q) {
        BigDecimal balance = money(q.amount()), total = money(BigDecimal.ZERO), interests = total;
        BigDecimal rate = q.annualRate().divide(new BigDecimal("1200"), MC);
        BigDecimal base = q.amount().divide(BigDecimal.valueOf(q.months()), MC);
        BigDecimal annuity = base;
        if (rate.signum() != 0) {
            BigDecimal power = BigDecimal.ONE.add(rate, MC).pow(q.months(), MC);
            annuity = q.amount().multiply(rate, MC).multiply(power, MC).divide(power.subtract(BigDecimal.ONE, MC), MC);
        }
        annuity = money(annuity);
        List<LoanResult.Row> rows = new ArrayList<>();
        for (int k = 1; k <= q.months(); k++) {
            BigDecimal interest = money(balance.multiply(rate, MC));
            BigDecimal principal = q.type() == LoanRequest.PaymentType.ANNUITY ? annuity.subtract(interest) : money(base);
            principal = principal.max(BigDecimal.ZERO).min(balance);
            if (k == q.months()) principal = balance;
            BigDecimal payment = principal.add(interest);
            balance = balance.subtract(principal);
            total = total.add(payment);
            interests = interests.add(interest);
            rows.add(new LoanResult.Row(k, payment, principal, interest, balance));
        }
        return new LoanResult(q, rows.getFirst().payment(), rows.getLast().payment(), total, interests, List.copyOf(rows));
    }

    public CompareResult compare(CompareRequest q) {
        var results = q.offers().stream().map(this::calculate).toList();
        var minI = results.stream().map(LoanResult::interest).min(BigDecimal::compareTo).orElseThrow();
        var minT = results.stream().map(LoanResult::totalPayment).min(BigDecimal::compareTo).orElseThrow();
        return new CompareResult(results, IntStream.range(0, results.size()).filter(i -> results.get(i).interest().compareTo(minI) == 0).boxed().toList(), IntStream.range(0, results.size()).filter(i -> results.get(i).totalPayment().compareTo(minT) == 0).boxed().toList());
    }
}
