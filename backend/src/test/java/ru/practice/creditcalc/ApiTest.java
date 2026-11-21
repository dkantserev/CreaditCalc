package ru.practice.creditcalc;

import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ApiTest {
    @Autowired
    MockMvc mvc;
    private final String valid = "{\"amount\":120000,\"annualRate\":12,\"months\":12,\"type\":\"DIFFERENTIATED\"}";

    @Test
    void calculate() throws Exception {
        mvc.perform(post("/api/v1/loans/calculate").contentType(MediaType.APPLICATION_JSON).content(valid))
                .andExpect(status().isOk()).andExpect(jsonPath("$.totalPayment").value(127800)).andExpect(jsonPath("$.schedule.length()").value(12));
    }

    @Test
    void health() throws Exception {
        mvc.perform(get("/api/v1/health")).andExpect(status().isOk());
    }

    @Test
    void docs() throws Exception {
        mvc.perform(get("/v3/api-docs")).andExpect(status().isOk()).andExpect(jsonPath("$.openapi")
                .exists());
    }

    @Test
    void comparison() throws Exception {
        mvc.perform(post("/api/v1/loans/compare").contentType(MediaType.APPLICATION_JSON)
                .content("{\"offers\":[" + valid + "," + valid + "," + valid + "]}")).andExpect(status().isOk())
                .andExpect(jsonPath("$.lowestTotalIndexes.length()").value(3));
    }

    @ParameterizedTest
    @ValueSource(strings = {"{}", "null", "{bad}", "{\"amount\":-1,\"annualRate\":12,\"months\":12,\"type\":\"ANNUITY\"}",
            "{\"amount\":100,\"annualRate\":101,\"months\":12,\"type\":\"ANNUITY\"}", "{\"amount\":100,\"annualRate\":12,\"months\":601,\"type\":\"ANNUITY\"}",
            "{\"amount\":100,\"annualRate\":12,\"months\":1.5,\"type\":\"ANNUITY\"}", "{\"amount\":100,\"annualRate\":12,\"months\":1,\"type\":\"BAD\"}"})
    void invalid(String body) throws Exception {
        mvc.perform(post("/api/v1/loans/calculate").contentType(MediaType.APPLICATION_JSON)
                .content(body)).andExpect(status().isBadRequest()).andExpect(jsonPath("$.message").exists());
    }

    @Test
    void nestedValidation() throws Exception {
        mvc.perform(post("/api/v1/loans/compare").contentType(MediaType.APPLICATION_JSON)
                .content("{\"offers\":[null," + valid + "]}")).andExpect(status().isBadRequest());
    }

    @Test
    void oversize() throws Exception {
        mvc.perform(post("/api/v1/loans/calculate").contentType(MediaType.APPLICATION_JSON)
                .content(" ".repeat(17000))).andExpect(status().isPayloadTooLarge());
    }

    @Test
    void corsDenied() throws Exception {
        mvc.perform(options("/api/v1/loans/calculate").header("Origin",
                "https://untrusted.example").header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isForbidden());
    }

    @Test
    void corsAllowed() throws Exception {
        mvc.perform(options("/api/v1/loans/calculate").header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Origin",
                        "http://localhost:5173"));
    }
}
