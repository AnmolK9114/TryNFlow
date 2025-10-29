# Use the official Python 3.10 image
FROM python:3.10.13-slim

# Set the working directory
WORKDIR /app

# Copy all project files into container
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose port 10000 
EXPOSE 10000

# Command to start the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]
