package ru.practice.creditcalc.dto;

import java.util.List;

public record CompareResult(List<LoanResult> offers, List<Integer> lowestInterestIndexes,
                            List<Integer> lowestTotalIndexes) {
}
