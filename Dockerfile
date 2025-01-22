# syntax=docker/dockerfile:1

ARG PYTHON_VERSION=3.11.9

FROM python:${PYTHON_VERSION}-slim

LABEL fly_launch_runtime="flask"

WORKDIR /code

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    fuse3 \
    sqlite3 \
    libsqlite3-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*
    
COPY --from=flyio/litefs:0.5 /usr/local/bin/litefs /usr/local/bin/litefs


COPY . .

EXPOSE 8080

CMD ["litefs", "mount", "--", "python3", "-m", "flask", "run", "--host=0.0.0.0", "--port=8080"]