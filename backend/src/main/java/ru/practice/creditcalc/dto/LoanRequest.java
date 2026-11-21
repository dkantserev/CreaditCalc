package ru.practice.creditcalc.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record LoanRequest(
        @NotNull @DecimalMin("1.00") @DecimalMax("100000000.00") @Digits(integer = 9, fraction = 2) BigDecimal amount,
        @NotNull @DecimalMin("0") @DecimalMax("100") @Digits(integer = 3, fraction = 4) BigDecimal annualRate,
        @NotNull @Min(1) @Max(600) Integer months,
        @NotNull PaymentType type) {
    public enum PaymentType {ANNUITY, DIFFERENTIATED}
}
