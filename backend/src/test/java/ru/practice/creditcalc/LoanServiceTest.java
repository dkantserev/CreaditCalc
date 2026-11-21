package ru.practice.creditcalc;

import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.math.*;
import java.util.*;

import ru.practice.creditcalc.dto.*;
import ru.practice.creditcalc.service.LoanService;

import static org.junit.jupiter.api.Assertions.*;

class LoanServiceTest {
    private final LoanService service = new LoanService();

    private LoanRequest q(String s, String rate, int n, LoanRequest.PaymentType t) {
        return new LoanRequest(new BigDecimal(s), new BigDecimal(rate), n, t);
    }

    private void eq(String expected, BigDecimal actual) {
        assertEquals(0, new BigDecimal(expected).compareTo(actual), actual.toString());
    }

    @Test
    void annuityReference() {
        var r = service.calculate(q("100000", "12", 12, LoanRequest.PaymentType.ANNUITY));
        eq("8884.88", r.firstPayment());
        eq("0", r.schedule().getLast().balance());
    }

    @Test
    void differentiatedReference() {
        var r = service.calculate(q("120000", "12", 12, LoanRequest.PaymentType.DIFFERENTIATED));
        eq("11200", r.firstPayment());
        eq("10100", r.lastPayment());
        eq("7800", r.interest());
    }

    @Test
    void zeroRateRounding() {
        var r = service.calculate(q("100", "0", 3, LoanRequest.PaymentType.ANNUITY));
        eq("33.33", r.firstPayment());
        eq("33.34", r.lastPayment());
        eq("100", r.totalPayment());
    }

    @Test
    void oneMonth() {
        var r = service.calculate(q("10000", "12", 1, LoanRequest.PaymentType.ANNUITY));
        eq("10100", r.totalPayment());
    }

    @Test
    void compareThreeAndTies() {
        var a = q("100000", "12", 12, LoanRequest.PaymentType.ANNUITY);
        var b = q("100000", "0", 12, LoanRequest.PaymentType.ANNUITY);
        var c = service.compare(new CompareRequest(List.of(a, b, b)));
        assertEquals(List.of(1, 2), c.lowestInterestIndexes());
        assertEquals(List.of(1, 2), c.lowestTotalIndexes());
    }

    @ParameterizedTest
    @CsvSource({"1,0,600", "100000000,100,600", "123456.78,13.1234,359", "100,0.0001,600", "1,100,600", "1000000,18,36"})
    void conservation(String amount, String rate, int n) {
        for (var type : LoanRequest.PaymentType.values()) {
            var r = service.calculate(q(amount, rate, n, type));
            assertEquals(n, r.schedule().size());
            eq(amount, r.schedule().stream().map(LoanResult.Row::principal).reduce(BigDecimal.ZERO, BigDecimal::add));
            eq("0", r.schedule().getLast().balance());
            assertEquals(0, r.totalPayment().subtract(new BigDecimal(amount)).compareTo(r.interest()));
            BigDecimal previous = new BigDecimal(amount);
            for (var row : r.schedule()) {
                assertTrue(row.balance().signum() >= 0);
                assertTrue(row.balance().compareTo(previous) <= 0);
                assertEquals(0, row.payment().compareTo(row.principal().add(row.interest())));
                previous = row.balance();
            }
        }
    }
}
