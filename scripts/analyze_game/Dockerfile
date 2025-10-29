FROM python:3.12-alpine3.20

WORKDIR /app
COPY scripts/analyze_game ./analyze_game
RUN pip install -r analyze_game/requirements.txt
CMD ["python", "analyze_game/analyze_game.py"]