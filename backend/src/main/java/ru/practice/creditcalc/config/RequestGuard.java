package ru.practice.creditcalc.config;

import jakarta.servlet.*;
import jakarta.servlet.http.*;

import java.io.*;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class RequestGuard extends OncePerRequestFilter {
    private long window = System.nanoTime();
    private int count = 0;

    private synchronized boolean allowed() {
        long now = System.nanoTime();
        if (now - window > 1_000_000_000L) {
            window = now;
            count = 0;
        }
        return ++count <= 50;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        response.setHeader("X-Content-Type-Options", "nosniff");
        if (!request.getRequestURI().startsWith("/api/") || !"POST".equals(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }
        if (!allowed()) {
            fail(response, 429, "Слишком много запросов. Повторите позже");
            return;
        }

        byte[] bytes = request.getInputStream().readNBytes(16385);
        if (bytes.length > 16384) {
            fail(response, 413, "Размер запроса превышает 16 Кб");
            return;
        }
        chain.doFilter(new HttpServletRequestWrapper(request) {
            @Override
            public ServletInputStream getInputStream() {
                ByteArrayInputStream in = new ByteArrayInputStream(bytes);
                return new ServletInputStream() {
                    public int read() {
                        return in.read();
                    }

                    public boolean isFinished() {
                        return in.available() == 0;
                    }

                    public boolean isReady() {
                        return true;
                    }

                    public void setReadListener(ReadListener listener) {
                        throw new UnsupportedOperationException();
                    }
                };
            }
        }, response);
    }

    private void fail(HttpServletResponse r, int status, String message) throws IOException {
        r.setStatus(status);
        r.setContentType("application/json;charset=UTF-8");
        r.getWriter().write("{\"message\":\"" + message + "\"}");
    }
}
