FROM mcr.microsoft.com/playwright:v1.50.0-jammy

WORKDIR /e2e

COPY package*.json ./

RUN npm install

RUN npx playwright install chromium --with-deps

COPY . .

CMD ["npx", "playwright", "test"]