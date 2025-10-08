FROM node:20-alpine

# Copy entire repo so /app/data is present
WORKDIR /app
COPY . .

# Install only backend deps
WORKDIR /app/src/backend
RUN npm ci --omit=dev

ENV PORT=8080
EXPOSE 8080
CMD ["node", "app.js"]
