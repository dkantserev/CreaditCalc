package ru.practice.creditcalc.exception;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;

import java.util.*;

@RestControllerAdvice
public class ApiErrors {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> validation(MethodArgumentNotValidException e) {
        Map<String, String> fields = new TreeMap<>();
        e.getBindingResult().getFieldErrors().forEach(x -> fields.put(x.getField(),
                "Проверьте значение и допустимый диапазон"));
        return ResponseEntity.badRequest().body(Map.of("message", "Некорректные параметры расчёта",
                "fields", fields));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> malformed(HttpMessageNotReadableException e) {
        return ResponseEntity.badRequest().body(Map.of("message", "Некорректный JSON или тип поля"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> internal(Exception e) {
        return ResponseEntity.status(500).body(Map.of("message", "Внутренняя ошибка сервера"));
    }
}
