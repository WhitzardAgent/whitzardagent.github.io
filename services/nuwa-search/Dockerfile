FROM python:3.12-slim
WORKDIR /app
COPY engine.py server.py ./
EXPOSE 4345
USER 65534:65534
ENTRYPOINT ["python", "server.py", "--host", "0.0.0.0", "--site", "/site", "--corpus", "/data/candidate.json", "--cache", "/cache/vectors.json"]
