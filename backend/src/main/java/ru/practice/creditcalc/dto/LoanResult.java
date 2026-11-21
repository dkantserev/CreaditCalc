package ru.practice.creditcalc.dto;

import java.math.BigDecimal;
import java.util.List;

public record LoanResult(LoanRequest input, BigDecimal firstPayment, BigDecimal lastPayment,
                         BigDecimal totalPayment, BigDecimal interest, List<Row> schedule) {
    public record Row(int month, BigDecimal payment, BigDecimal principal, BigDecimal interest, BigDecimal balance) {
    }
}
