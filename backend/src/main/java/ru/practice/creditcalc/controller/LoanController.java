package ru.practice.creditcalc.controller;

import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import ru.practice.creditcalc.dto.*;
import ru.practice.creditcalc.service.LoanService;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class LoanController {
    private final LoanService service;

    public LoanController(LoanService service) {
        this.service = service;
    }

    @PostMapping("/loans/calculate")
    public LoanResult calculate(@Valid @RequestBody LoanRequest input) {
        return service.calculate(input);
    }

    @PostMapping("/loans/compare")
    public CompareResult compare(@Valid @RequestBody CompareRequest input) {
        return service.compare(input);
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}
