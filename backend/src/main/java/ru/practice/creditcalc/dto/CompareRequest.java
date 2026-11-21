package ru.practice.creditcalc.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.util.List;

public record CompareRequest(@NotNull @Size(min = 2, max = 5) List<@NotNull @Valid LoanRequest> offers) {
}
