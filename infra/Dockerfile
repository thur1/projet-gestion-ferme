# Backend Django Dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
		PYTHONUNBUFFERED=1

WORKDIR /app

# Install system deps
RUN apt-get update \ 
	&& apt-get install -y --no-install-recommends build-essential libpq-dev \ 
	&& rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --upgrade pip \ 
	&& pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
