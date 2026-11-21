

## Быстрый запуск

Терминал 1, из корня проекта:


cd backend
mvn clean package
java -jar target/creditcalc-1.0.0.jar


Терминал 2, из корня проекта:


cd frontend
npm ci
npm run dev


Открыть http://localhost:5173. Backend слушает 127.0.0.1:8080. Vite пересылает /api в backend.
Swagger: http://127.0.0.1:8080/swagger-ui.html;

## Проверки


cd backend
mvn test



cd frontend
npm ci
npm test
npm run build




## Docker


docker compose up --build

Открыть http://localhost:8088.
