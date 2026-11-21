package ru.practice.creditcalc;

import org.junit.jupiter.api.Test;
import ru.practice.creditcalc.controller.LoanController;
import ru.practice.creditcalc.service.LoanService;
import ru.practice.creditcalc.dto.LoanRequest;

import java.math.BigDecimal;

import static org.mockito.Mockito.*;

class ControllerUnitTest {
    @Test
    void delegatesToService() {
        var service = mock(LoanService.class);
        var q = new LoanRequest(BigDecimal.TEN, BigDecimal.ZERO, 1, LoanRequest.PaymentType.ANNUITY);
        new LoanController(service).calculate(q);
        verify(service).calculate(q);
    }
}
