# Step 1: Use official python base image
FROM python:3.12-slim

# Step 2: define a working directory for the container
WORKDIR /app

# Step 3: Copy requirements.txt file into container
COPY requirements.txt .

#Step 4: Install the dependencies or pip packages
RUN pip install -r requirements.txt

# Step 5: Copy the flask application into the container
COPY . .

# Step 6: Expose a port
EXPOSE 8080

# Step 7: Setting flask ENV vars
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=8080

# Step 8: Run flask app
CMD ["flask", "run"]